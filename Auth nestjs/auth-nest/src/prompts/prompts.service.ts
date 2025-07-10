import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PromptEntity } from './entity/prompt.entity';
import { MoreThan, Repository } from 'typeorm';
import { PromptDto } from './dto/prompt.dto';
import getUserNameFromUserId from 'src/utils/getUserName';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PromptsService {
  constructor(
    @InjectRepository(PromptEntity)
    private readonly promptRepo: Repository<PromptEntity>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async createPrompt(dto: PromptDto, userId: number) {
    const prompt = this.promptRepo.create({
      promptModel: dto.promptModel || 'gpt-4o-mini',
      promptTitle: dto.promptTitle,
      promptContent: dto.promptContent,
      promptDescription: dto.promptDescription,
      promptTags: dto.promptTags || [],
      promptContext: dto.promptContext,
      isPublic: dto.isPublic || false,
      user: { id: userId },
      // likes: dto.likes || [],
    });

    const savedPrompt = await this.promptRepo.save(prompt);
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update tokens based on premium status
    if (user.isPremium) {
      // Premium users: unlimited tokens - only increment tokensUsed, don't touch tokensRemaining
      user.tokensUsed = user.tokensUsed + 1;
      // Keep tokensRemaining unchanged (effectively unlimited)
    } else {
      // Non-premium users: check if they have enough tokens
      if (user.tokensRemaining <= 0) {
        throw new BadRequestException(
          'Insufficient tokens. Please upgrade to premium or wait for token refresh.',
        );
      }

      // Subtract 1 from tokens remaining, add 1 to tokens used
      user.tokensRemaining = user.tokensRemaining - 1;
      user.tokensUsed = user.tokensUsed + 1;
    }

    await this.userRepo.save(user);
    return savedPrompt;
  }
  async checkTokens(userId: number) {
    console.log('🔍 checkTokens called with userId:', userId);
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });
    console.log('🔍 Found user:', user);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.tokensRemaining === 0) {
      return {
        tokensRemaining: 0,
        tokensUsed: user.tokensUsed,
        message:
          'Insufficient tokens. Please upgrade to premium or wait for token refresh.',
      };
    }
    return {
      tokensRemaining: user.tokensRemaining,
      tokensUsed: user.tokensUsed,
      message: 'Tokens remaining',
    };
  }
  async getPromptByModel(model: string, userId: number) {
    const prompts = await this.promptRepo.find({
      where: { promptModel: model, user: { id: userId } },
      relations: ['user'],
      order: {
        createdAt: 'DESC',
      },
    });

    return prompts;
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
        promptContent: true,
        promptTags: true,
        promptContext: true,
        createdAt: true,
        updatedAt: true,
        likes: true,
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
  async getPopularPrompts() {
    const prompts = await this.promptRepo
      .createQueryBuilder('prompt')
      .leftJoinAndSelect('prompt.user', 'user')
      .select([
        'prompt.id',
        'prompt.promptTitle',
        'prompt.promptDescription',
        'prompt.promptContent',
        'prompt.promptTags',
        'prompt.promptContext',
        'prompt.createdAt',
        'prompt.updatedAt',
        'prompt.likes',
        'user.id',
        'user.email',
        'user.name',
      ])
      .where('prompt.isPublic = true')
      .orderBy('JSON_LENGTH(prompt.likes)', 'DESC') // only by likes
      .limit(3)
      .getMany();

    return {
      data: prompts,
      meta: {
        total: prompts.length,
        message: prompts.length
          ? 'Popular prompts retrieved successfully'
          : 'No popular prompts found',
      },
    };
  }

  async likePrompt(promptId: number, userId: number) {
    const prompt = await this.promptRepo.findOne({
      where: { id: promptId },
      relations: ['user'],
    });
    if (!prompt) {
      throw new NotFoundException('Prompt not Found');
    }

    // Get the current user who is liking the prompt
    const currentUser = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!currentUser) {
      throw new NotFoundException('User not found');
    }

    // Ensure likes is always an array
    if (!Array.isArray(prompt.likes)) {
      prompt.likes = [];
    }

    if (prompt.likes?.includes(currentUser.name)) {
      throw new BadRequestException('You have already liked this prompt');
      // prompt.likes = prompt.likes.filter((id: string) => id !== userName);
    } else {
      prompt.likes = [...prompt.likes, currentUser.name];
    }
    return this.promptRepo.save(prompt);
  }
  async getPromptLikes(promptId: number, user: any) {
    const prompt = await this.promptRepo.findOne({
      where: { id: promptId },
      relations: ['user'],
    });

    if (!prompt) {
      throw new NotFoundException('Prompt not Found');
    }

    if (prompt.likes?.includes(user.username)) {
      return {
        liked: true,
        likes: prompt.likes,
      };
    } else {
      return {
        liked: false,
        likes: prompt.likes,
      };
    }
  }
  async checkPromptExists(
    promptTitle: string,
    promptModel: string,
    userId: number,
    updateData?: any,
  ) {
    // Get user to check premium status
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // First, check if a prompt with the same title and model exists
    const existingPrompt = await this.promptRepo.findOne({
      where: {
        promptTitle,
        promptModel,
        user: { id: userId },
      },
      select: [
        'id',
        'promptTitle',
        'promptModel',
        'promptContent',
        'promptDescription',
      ],
    });

    if (existingPrompt) {
      if (updateData) {
        // If we found an existing prompt with the same title, always update it

        // Update the existing prompt with new content
        const updatedContent = existingPrompt.promptContent
          ? `${existingPrompt.promptContent}\n\n--- Additional Prompt ---\n${updateData.promptContent}`
          : updateData.promptContent;

        const updatedDescription = existingPrompt.promptDescription
          ? `${existingPrompt.promptDescription}\n\n--- Latest Update ---\n${updateData.promptDescription}`
          : updateData.promptDescription;

        // Update the existing prompt
        await this.promptRepo.update(existingPrompt.id, {
          promptContent: updatedContent,
          promptDescription: updatedDescription,
          promptTags: updateData.promptTags || existingPrompt.promptTags,
          isPublic:
            updateData.isPublic !== undefined
              ? updateData.isPublic
              : existingPrompt.isPublic,
          promptContext:
            updateData.promptContext || existingPrompt.promptContext,
        });

        // Handle token logic based on premium status
        if (user.isPremium) {
          // Premium users: only increment tokensUsed, don't touch tokensRemaining
          user.tokensUsed = user.tokensUsed + 1;
        } else {
          // Non-premium users: check if they have enough tokens
          if (user.tokensRemaining <= 0) {
            throw new BadRequestException(
              'Insufficient tokens. Please upgrade to premium or wait for token refresh.',
            );
          }
          // Subtract 1 from tokens remaining, add 1 to tokens used
          user.tokensRemaining = user.tokensRemaining - 1;
          user.tokensUsed = user.tokensUsed + 1;
        }

        await this.userRepo.save(user);

        return {
          exists: true,
          promptId: existingPrompt.id,
          promptTitle: existingPrompt.promptTitle,
          promptModel: existingPrompt.promptModel,
          updated: true,
          grouped: true,
          isPremium: user.isPremium,
          tokensRemaining: user.tokensRemaining,
          tokensUsed: user.tokensUsed,
        };
      }

      // If no updateData or content is not similar, just return that it exists
      return {
        exists: true,
        promptId: existingPrompt.id,
        promptTitle: existingPrompt.promptTitle,
        promptModel: existingPrompt.promptModel,
        updated: false,
        grouped: false,
        isPremium: user.isPremium,
        tokensRemaining: user.tokensRemaining,
        tokensUsed: user.tokensUsed,
      };
    }

    return {
      exists: false,
      promptId: null,
      promptTitle: null,
      promptModel: null,
      updated: false,
      grouped: false,
      isPremium: user.isPremium,
      tokensRemaining: user.tokensRemaining,
      tokensUsed: user.tokensUsed,
    };
  }
}
