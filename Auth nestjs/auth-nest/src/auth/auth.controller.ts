import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  Get,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { CreateUserDto } from 'src/user/dto/user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

import { Response } from 'express';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.login(dto);

    const maxAge = 7 * 24 * 60 * 60 * 1000;

    res.cookie('access_token', tokens.data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge,
      path: '/',
    });

    res.cookie('refresh_token', tokens.data.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge,
      path: '/',
    });

    return tokens;
  }
  @Post('register')
  async register(
    @Body() dto: CreateUserDto & { rememberMe?: boolean },
    @Res({ passthrough: true }) res: Response,
  ) {
    const authDto: AuthDto = {
      email: dto.email,
      password: dto.password,
      rememberMe: dto.rememberMe || false,
    };
    const result = await this.authService.register(dto, authDto);

    const maxAge = 7 * 24 * 60 * 60 * 1000;

    res.cookie('access_token', result.data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge,
      path: '/',
    });

    res.cookie('refresh_token', result.data.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge,
      path: '/',
    });

    return result;
  }
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token found');
    }

    const tokens = await this.authService.refresh(refreshToken);

    const maxAge = 7 * 24 * 60 * 60 * 1000;

    res.cookie('access_token', tokens.data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge,
      path: '/',
    });

    res.cookie('refresh_token', tokens.data.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge,
      path: '/',
    });

    return tokens;
  }
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Req() req) {
    return this.authService.logOut(req);
  }
  @UseGuards(JwtAuthGuard)
  @Get('check-token')
  async checkToken(@Req() req) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    const tokenInfo = await this.authService.checkTokenExpiration(token);

    return {
      data: {
        ...tokenInfo,
        token: token.substring(0, 20) + '...', // Show first 20 chars of token
        currentTime: new Date().toISOString(),
        tokenType: 'access_token',
      },
    };
  }
  // @Post('logout')
  // @UseGuards(JwtAuthGuard)
  // async logout(@Req() req: Request) {
  //   return this.authService.logout(req);
  // }
}
