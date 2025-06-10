import { Module } from '@nestjs/common';
import { PromptsService } from './prompts.service';
import { PromptsController } from './prompts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromptEntity } from './entity/prompt.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PromptEntity])],
  controllers: [PromptsController],
  providers: [PromptsService],
  exports: [PromptsService],
})
export class PromptsModule {}
