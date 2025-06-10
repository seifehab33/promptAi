import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PromptEntity } from './entity/prompt.entity';
import { Repository } from 'typeorm';
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
}
