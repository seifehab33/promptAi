import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/user.dto';
// import { Role } from 'src/role/enitites/role.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { BlacklistedToken } from 'src/blacklisted-token/entities/blacklisted-token.entity';
import { BlacklistedTokenDto } from 'src/blacklisted-token/dto/blacklist-token.dto';
import { JwtService } from '@nestjs/jwt';
const scrypt = promisify(_scrypt);

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
    // @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
  ) {}

  async create(dto: CreateUserDto) {
    // const role = await this.roleRepo.findOneBy({ name: dto.role });
    // if (!role) {
    //   throw new NotFoundException(`Role ${dto.role} not found`);
    // }
    const user = this.repo.create({
      ...dto,
    });
    return this.repo.save(user);
  }
  async getProfile(id: number) {
    try {
      const user = await this.findById(id);
      return user;
    } catch (error) {
      console.error('Profile error:', error);
      throw error;
    }
  }
  findByEmail(email: string) {
    return this.repo.findOneBy({ email });
  }
  async findById(id: number) {
    const user = await this.repo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
  async findAll() {
    return this.repo.find();
  }
  async remove(id: number) {
    const user = await this.repo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found To Delete');
    }
    const deletedUser = await this.repo.delete(id);
    if (deletedUser.affected === 0) {
      throw new NotFoundException('User not found To Delete');
    }
    return { message: `User ${user.email} deleted successfully` };
  }
  async update(id: number, dto: UpdateUserDto) {
    const user = await this.repo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User Not Found To Update');
    }
    Object.assign(user, dto);
    return this.repo.save(user);
  }

  async resetTokensForNonPremiumUsers() {
    // Reset tokens remaining to 10 for non-premium users
    // This should be called every 5 hours
    const fiveHoursAgo = new Date();
    fiveHoursAgo.setHours(fiveHoursAgo.getHours() - 5);

    // Find non-premium users and reset their tokens
    const nonPremiumUsers = await this.repo.find({
      where: { isPremium: false },
    });

    for (const user of nonPremiumUsers) {
      // Check if it's been more than 5 hours since last token reset
      const lastTokenReset = user.updatedAt || user.createdAt;
      if (lastTokenReset < fiveHoursAgo) {
        user.tokensRemaining = 10;
        user.tokensUsed = 0;
        user.updatedAt = new Date();
        await this.repo.save(user);
      }
    }

    return {
      message: 'Tokens reset for non-premium users',
      resetCount: nonPremiumUsers.length,
    };
  }

  async getTokenStatus(userId: number) {
    const user = await this.findById(userId);
    return {
      tokensRemaining: user.tokensRemaining,
      tokensUsed: user.tokensUsed,
      isPremium: user.isPremium,
      lastUpdated: user.updatedAt,
    };
  }
}
