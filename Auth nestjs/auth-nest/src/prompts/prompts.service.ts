import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PromptEntity } from './entity/prompt.entity';
import { Like, Repository } from 'typeorm';
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
    });

    return this.promptRepo.save(prompt);
  }

  async getPrompts() {
    return this.promptRepo.find();
  }

  async getPromptById(id: number) {
    return this.promptRepo.findOneBy({ id });
  }
  async getPromptByQuery(query: string) {
    if (!query) {
      return this.promptRepo.find();
    }

    const searchQuery = query.toLowerCase();

    return this.promptRepo
      .createQueryBuilder('prompt')
      .where('LOWER(prompt.promptTitle) LIKE :search', {
        search: `%${searchQuery}%`,
      })
      .orWhere('LOWER(prompt.promptDescription) LIKE :search', {
        search: `%${searchQuery}%`,
      })
      .orWhere('LOWER(prompt.promptContext) LIKE :search', {
        search: `%${searchQuery}%`,
      })
      .orWhere('LOWER(prompt.promptTags) LIKE :search', {
        search: `%${searchQuery}%`,
      })
      .getMany();
  }
  async updatePrompt(id: number, dto: PromptDto) {
    const prompt = await this.promptRepo.findOneBy({ id });
    if (!prompt) {
      throw new NotFoundException('Prompt not found');
    }
    return this.promptRepo.update(id, dto);
  }
  async deletePrompt(id: number) {
    return this.promptRepo.delete(id);
  }
}
