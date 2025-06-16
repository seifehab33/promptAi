import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AuthDto } from './dto/auth.dto';
import { CreateUserDto } from 'src/user/dto/user.dto';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { User } from 'src/user/entities/user.entity';
import { BlacklistedToken } from 'src/blacklisted-token/entities/blacklisted-token.entity';
import { EmailService } from './email.service';
import { ResetPasswordsEnitity } from './entities/reset-passwords.entity';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepo: Repository<RefreshToken>,
    @InjectRepository(BlacklistedToken)
    private readonly blacklistedTokenRepo: Repository<BlacklistedToken>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    @InjectRepository(ResetPasswordsEnitity)
    private readonly resetPasswordRepo: Repository<ResetPasswordsEnitity>,
  ) {}

  private async generateTokens(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      // role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '15m' }),
      this.jwtService.signAsync(payload, { expiresIn: '7d' }),
    ]);

    // Save refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    await this.refreshTokenRepo.save({
      token: refreshToken,
      expiresAt,
      userId: user.id,
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async login(dto: AuthDto) {
    const user = await this.userService.findByEmail(dto.email);

    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }
    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(dto.password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Invalid email or password');
    }

    const tokens = await this.generateTokens(user);

    return {
      data: tokens,
    };
  }

  async refresh(refreshToken: string) {
    try {
      // Verify the refresh token
      await this.jwtService.verifyAsync(refreshToken);

      // Check if token exists in database
      const tokenRecord = await this.refreshTokenRepo.findOne({
        where: { token: refreshToken },
        relations: ['user'],
      });

      if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new tokens
      const tokens = await this.generateTokens(tokenRecord.user);

      // Delete old refresh token
      await this.refreshTokenRepo.delete({ token: refreshToken });

      return {
        data: tokens,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async register(dto: CreateUserDto, authDto: AuthDto) {
    try {
      const userEmail = await this.userService.findByEmail(dto.email);
      if (userEmail) {
        throw new BadRequestException({
          message: 'User with this email already exists',
          statusCode: 400,
        });
      }
      const salt = randomBytes(8).toString('hex');
      const hash = (await scrypt(dto.password, salt, 32)) as Buffer;
      const resultPassword = salt + '.' + hash.toString('hex');
      const payload = {
        ...dto,
        password: resultPassword,
      };
      const user = await this.userService.create(payload);
      const tokens = await this.generateTokens(user);

      return {
        data: {
          ...tokens,
          user,
        },
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException({
        message: 'An error occurred during registration',
        statusCode: 500,
      });
    }
  }
  async logOut(req: any) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('No token provided');
      }
      const token = authHeader.split(' ')[1];
      let decodedToken;
      try {
        decodedToken = this.jwtService.verifyAsync(token);
      } catch (error) {
        throw new UnauthorizedException('Invalid token');
      }
      const existingToken = await this.blacklistedTokenRepo.findOne({
        where: { token },
      });
      if (existingToken) {
        return {
          data: {
            message: 'Already Logged Out',
          },
        };
      }
      const BlacklistedToken = this.blacklistedTokenRepo.create({
        token,
        expiresAt: new Date(decodedToken.exp * 1000),
        createdAt: new Date(),
      });
      await this.blacklistedTokenRepo.save(BlacklistedToken);
      return {
        data: {
          message: 'Logged Out Successfully',
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
  async requestPasswordReset(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User with this email didnt exist');
    }
    const resetToken = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);
    const resetPassword = this.resetPasswordRepo.create({
      email,
      token: resetToken,
      expiresAt,
    });
    await this.resetPasswordRepo.save(resetPassword);
    await this.emailService.sendPasswordResetEmail(email, resetToken);
    return {
      data: {
        message: 'Password reset email sent successfully',
      },
    };
  }
  async resetPassword(token: string, newPassword: string) {
    const resetPassword = await this.resetPasswordRepo.findOne({
      where: { token, expiresAt: MoreThan(new Date()) },
    });
    if (!resetPassword) {
      throw new BadRequestException('Invalid or expired token');
    }
    const user = await this.userService.findByEmail(resetPassword.email);
    if (!user) {
      throw new BadRequestException('User with this email didnt exist');
    }
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(newPassword, salt, 32)) as Buffer;
    const resultPassword = salt + '.' + hash.toString('hex');
    user.password = resultPassword;
    await this.userService.update(user.id, user);
    await this.resetPasswordRepo.update(resetPassword.id, { isUsed: true });
    return {
      data: {
        message: 'Password reset successfully',
      },
    };
  }
  async validateResetToken(token: string) {
    const passwordReset = await this.resetPasswordRepo.findOne({
      where: {
        token,
        isUsed: false,
        expiresAt: MoreThan(new Date()),
      },
    });

    return { valid: !!passwordReset };
  }
  async checkTokenExpiration(token: string) {
    try {
      const decoded = await this.jwtService.verifyAsync(token);
      const expirationDate = new Date(decoded.exp * 1000); // Convert to milliseconds
      const now = new Date();
      const timeLeft = expirationDate.getTime() - now.getTime();
      const minutesLeft = Math.floor(timeLeft / (1000 * 60));

      return {
        expiresAt: expirationDate,
        timeLeft: minutesLeft,
        isExpired: timeLeft <= 0,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
