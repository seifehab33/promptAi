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
import { Repository } from 'typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { User } from 'src/user/entities/user.entity';
import { BlacklistedToken } from 'src/blacklisted-token/entities/blacklisted-token.entity';

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
  ) {}

  private async generateTokens(user: User, dto: AuthDto) {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      // role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '15m' }),
      this.jwtService.signAsync(payload, {
        expiresIn: dto.rememberMe ? '7d' : '15m',
      }),
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

    const tokens = await this.generateTokens(user, dto);

    return {
      data: tokens,
    };
  }

  async refresh(refreshToken: string, dto: AuthDto) {
    try {
      // Verify the refresh token
      const payload = await this.jwtService.verifyAsync(refreshToken);

      // Check if token exists in database
      const tokenRecord = await this.refreshTokenRepo.findOne({
        where: { token: refreshToken },
        relations: ['user'],
      });

      if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new tokens
      const tokens = await this.generateTokens(tokenRecord.user, dto);

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
        throw new BadRequestException('User already exists');
      }
      const salt = randomBytes(8).toString('hex');
      const hash = (await scrypt(dto.password, salt, 32)) as Buffer;
      const resultPassword = salt + '.' + hash.toString('hex');
      const payload = {
        ...dto,
        password: resultPassword,
      };
      const user = await this.userService.create(payload);
      const tokens = await this.generateTokens(user, authDto);

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
      throw new InternalServerErrorException(
        'An error occurred during registration',
      );
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
  // async logout(req: any) {
  //   try {
  //     const authHeader = req.headers.authorization;
  //     if (!authHeader || !authHeader.startsWith('Bearer ')) {
  //       throw new UnauthorizedException('Invalid token');
  //     }

  //     const token = authHeader.split(' ')[1];
  //     const decoded = this.jwtService.decode(token);

  //     if (!decoded || !decoded['exp']) {
  //       throw new UnauthorizedException('Invalid token format');
  //     }

  //     const expiresAt = decoded['exp'] * 1000; // Convert to milliseconds
  //     const ttl = Math.max(0, expiresAt - Date.now()); // Ensure TTL is not negative

  //     if (ttl > 0) {
  //       await this.redis.setex(
  //         `blacklist:${token}`,
  //         Math.ceil(ttl / 1000),
  //         'true',
  //       );
  //     }

  //     return {
  //       data: {
  //         message: 'Logout successful',
  //       },
  //     };
  //   } catch (error) {
  //     if (error instanceof UnauthorizedException) {
  //       throw error;
  //     }
  //     throw new UnauthorizedException('Invalid or expired token');
  //   }
  // }
}
