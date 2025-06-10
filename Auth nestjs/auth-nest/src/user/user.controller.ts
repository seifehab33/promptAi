import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { Serialize } from 'src/interceptor/serialize.interceptor';
import { NewUserDto } from './dto/new-user.dto';

@Controller('users')
@Serialize(NewUserDto)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return this.userService.getProfile(req.user.userId);
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  getUsers() {
    return this.userService.findAll();
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  getUserById(@Query('id') id: string) {
    return this.userService.findById(parseInt(id));
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  deleteUser(@Param('id') id: string) {
    return this.userService.remove(parseInt(id));
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(parseInt(id), dto);
  }
}
