import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  async create(dto: CreateUserDto) {
    const userData = {
      ...dto,
      tokensRemaining: dto.isPremium ? 999999 : dto.tokensRemaining || 10,
      tokensUsed: dto.tokensUsed || 0,
      tokensFree: dto.isPremium ? 999999 : dto.tokensFree || 10,
    };

    const user = this.repo.create(userData);
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
    const fiveHoursAgo = new Date();
    fiveHoursAgo.setHours(fiveHoursAgo.getHours() - 5);

    const nonPremiumUsers = await this.repo.find({
      where: { isPremium: false },
    });

    for (const user of nonPremiumUsers) {
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
