import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from './user.decorator';
import { Cron, CronExpression } from '@nestjs/schedule';
@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
  @Cron(CronExpression.EVERY_5_HOURS)
  @Post('reset-tokens')
  async resetTokensForNonPremiumUsers() {
    return this.userService.resetTokensForNonPremiumUsers();
  }

  @Get('token-status/:id')
  async getTokenStatus(@Param('id') id: string) {
    return this.userService.getTokenStatus(+id);
  }

  @Get('my-token-status')
  async getMyTokenStatus(@GetUser() user: any) {
    return this.userService.getTokenStatus(user.userId);
  }
}
