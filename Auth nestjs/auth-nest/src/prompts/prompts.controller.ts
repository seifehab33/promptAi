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
  getPrompts(@GetUser() user: any) {
    return this.promptsService.getPrompts(user.userId);
  }

  @Get('public')
  getPublicPrompts(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.promptsService.getPublicPrompts(page, limit);
  }
  @Get('model/:model')
  getPromptByModel(@Param('model') model: string, @GetUser() user: any) {
    return this.promptsService.getPromptByModel(model, user.userId);
  }
  @Get('popular')
  async getPopularPrompts() {
    return await this.promptsService.getPopularPrompts();
  }

  @Get('search')
  searchPrompts(@Query('query') query: string, @GetUser() user: any) {
    return this.promptsService.getPromptByQuery(query, user.userId);
  }

  @Get(':id')
  getPromptById(@Param('id') id: number) {
    return this.promptsService.getPromptById(id);
  }

  @Patch(':id')
  updatePrompt(
    @Param('id') id: number,
    @Body() dto: PromptDto,
    @GetUser() user: any,
  ) {
    return this.promptsService.updatePrompt(id, dto, user.userId);
  }

  @Post(':id/share')
  sharePrompt(@Param('id') id: number, @GetUser() user: any) {
    return this.promptsService.sharePrompt(id, user.userId);
  }

  @Post(':id/unshare')
  unsharePrompt(@Param('id') id: number, @GetUser() user: any) {
    return this.promptsService.unsharePrompt(id, user.userId);
  }

  @Delete(':id')
  deletePrompt(@Param('id') id: number, @GetUser() user: any) {
    return this.promptsService.deletePrompt(id, user.userId);
  }
  @Post(':id/like')
  async likePrompt(@Param('id') id: number, @GetUser() user: any) {
    return this.promptsService.likePrompt(id, user.userId);
  }
  @Get('likes/:id')
  async getPromptLikes(@Param('id') id: number, @GetUser() user: any) {
    return this.promptsService.getPromptLikes(id, user);
  }
  @Get('check-exists')
  async checkPromptExists(
    @Query('promptTitle') promptTitle: string,
    @Query('promptModel') promptModel: string,
    @GetUser() user: any,
  ) {
    return this.promptsService.checkPromptExists(
      promptTitle,
      promptModel,
      user.userId,
    );
  }

  @Post('check-exists')
  async checkAndUpdatePrompt(@Body() updateData: any, @GetUser() user: any) {
    return this.promptsService.checkPromptExists(
      updateData.promptTitle,
      updateData.promptModel,
      user.userId,
      updateData,
    );
  }
}
