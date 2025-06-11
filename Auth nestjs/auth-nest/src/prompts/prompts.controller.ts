import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PromptsService } from './prompts.service';
import { PromptDto } from './dto/prompt.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/user/user.decorator';

@Controller('prompts')
@UseGuards(JwtAuthGuard)
export class PromptsController {
  constructor(private readonly promptsService: PromptsService) {}

  @Post()
  createPrompt(@Body() dto: PromptDto, @GetUser() user: any) {
    return this.promptsService.createPrompt(dto, user.userId);
  }

  @Get()
  getPrompts() {
    return this.promptsService.getPrompts();
  }

  @Get('search')
  searchPrompts(@Query('query') query: string) {
    return this.promptsService.getPromptByQuery(query);
  }

  @Get(':id')
  getPromptById(@Param('id') id: number) {
    return this.promptsService.getPromptById(id);
  }

  @Patch(':id')
  updatePrompt(@Param('id') id: number, @Body() dto: PromptDto) {
    return this.promptsService.updatePrompt(id, dto);
  }

  @Delete(':id')
  deletePrompt(@Param('id') id: number) {
    return this.promptsService.deletePrompt(id);
  }
}
