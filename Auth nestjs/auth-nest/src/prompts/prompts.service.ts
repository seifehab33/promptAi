import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PromptEntity } from './entity/prompt.entity';
import { MoreThan, Repository } from 'typeorm';
import { PromptDto } from './dto/prompt.dto';

@Injectable()
export class PromptsService {
  constructor(
    @InjectRepository(PromptEntity)
    private readonly promptRepo: Repository<PromptEntity>,
  ) {}

  async createPrompt(dto: PromptDto, userId: number) {
    const prompt = this.promptRepo.create({
      promptTitle: dto.promptTitle,
      promptDescription: dto.promptDescription,
      promptTags: dto.promptTags || [],
      promptContext: dto.promptContext,
      isPublic: dto.isPublic || false,
      user: { id: userId },
      // likes: dto.likes || [],
    });

    return this.promptRepo.save(prompt);
  }

  async getPrompts(userId: number) {
    return this.promptRepo.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }
  async getPublicPrompts(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [prompts, total] = await this.promptRepo.findAndCount({
      where: { isPublic: true },
      select: {
        id: true,
        promptTitle: true,
        promptDescription: true,
        promptTags: true,
        promptContext: true,
        createdAt: true,
        updatedAt: true,
        // likes: true,
        user: {
          id: true,
          email: true,
          name: true,
        },
      },
      relations: {
        user: true,
      },
      order: {
        createdAt: 'DESC',
      },
      skip,
      take: limit,
    });
    if (prompts.length === 0) {
      return {
        data: [],
        meta: {
          total: 0,
          page,
          limit,
          totalPages: 0,
        },
      };
    }
    return {
      data: prompts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  async getPromptById(id: number) {
    return this.promptRepo.findOneBy({ id });
  }

  async getPromptByQuery(query: string, userId: number) {
    if (!query) {
      return this.promptRepo.find({
        where: { user: { id: userId } },
        relations: ['user'],
      });
    }

    const searchQuery = query.toLowerCase();

    return this.promptRepo
      .createQueryBuilder('prompt')
      .leftJoinAndSelect('prompt.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('LOWER(prompt.promptTitle) LIKE :search', {
        search: `%${searchQuery}%`,
      })
      .getMany();
  }

  async updatePrompt(id: number, dto: PromptDto, userId: number) {
    const prompt = await this.promptRepo.findOne({
      where: { id, user: { id: userId } },
      relations: ['user'],
    });

    if (!prompt) {
      throw new NotFoundException('Prompt not found');
    }

    return this.promptRepo.update(id, dto);
  }
  async sharePrompt(promptId: number, userId: number) {
    const prompt = await this.promptRepo.findOne({
      where: { id: promptId, user: { id: userId } },
      relations: ['user'],
    });

    if (!prompt) {
      throw new NotFoundException('Prompt not found');
    }
    prompt.isPublic = true;

    return this.promptRepo.save(prompt);
  }

  async unsharePrompt(promptId: number, userId: number) {
    const prompt = await this.promptRepo.findOne({
      where: { id: promptId, user: { id: userId } },
      relations: ['user'],
    });

    if (!prompt) {
      throw new NotFoundException('Prompt not found');
    }

    prompt.isPublic = false;

    return this.promptRepo.save(prompt);
  }

  async deletePrompt(id: number, userId: number) {
    const prompt = await this.promptRepo.findOne({
      where: { id, user: { id: userId } },
      relations: ['user'],
    });

    if (!prompt) {
      throw new NotFoundException('Prompt not found');
    }

    return this.promptRepo.delete(id);
  }
  // async getPopularPrompts() {
  //   return this.promptRepo
  //     .createQueryBuilder('prompt')
  //     .orderBy('prompt.likes', 'DESC')
  //     .limit(3)
  //     .getMany();
  // }
}
// async likePrompt(promptId: number, userId: number) {
//   const prompt = await this.promptRepo.findOne({
//     where: { id: promptId },
//     relations: ['user'],
//   });
//   if (!prompt) {
//     throw new NotFoundException('Prompt not Found');
//   }
//   if (prompt.likes.includes(userId.toString())) {
//     prompt.likes = prompt.likes.filter(
//       (id: string) => id !== userId.toString(),
//     );
//   } else {
//     prompt.likes = [...prompt.likes, userId.toString()];
//   }
//   return this.promptRepo.save(prompt);
// }
