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
  Query,
  BadRequestException,
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

    // Set access token (short-lived, 15 minutes) - NOT HttpOnly so middleware can read it
    res.cookie('access_token', tokens.data.access_token, {
      httpOnly: false, // Allow JavaScript and middleware access
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: '/',
    });

    // Set refresh token (long-lived, 7 days)
    res.cookie('refresh_token', tokens.data.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/', // Allow access from all paths for refresh functionality
    });

    return {
      success: true,
      message: 'Login successful',
      data: {
        accessTokenExpiresIn: '15m',
        refreshTokenExpiresIn: '7d',
      },
    };
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
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

    // Set access token (short-lived, 15 minutes) - NOT HttpOnly so middleware can read it
    res.cookie('access_token', result.data.access_token, {
      httpOnly: false, // Allow JavaScript and middleware access
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: '/',
    });

    // Set refresh token (long-lived, 7 days)
    res.cookie('refresh_token', result.data.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/', // Allow access from all paths for refresh functionality
    });

    return {
      success: true,
      message: 'Registration successful',
      data: {
        user: result.data.user,
        accessTokenExpiresIn: '15m',
        refreshTokenExpiresIn: '7d',
      },
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    try {
      const tokens = await this.authService.refresh(refreshToken);

      // Set new access token (short-lived, 15 minutes) - NOT HttpOnly so it can be accessed by JS
      res.cookie('access_token', tokens.data.access_token, {
        httpOnly: false, // Allow JavaScript access
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000, // 15 minutes
        path: '/',
      });

      // Set new refresh token (long-lived, 7 days) - HttpOnly for security
      res.cookie('refresh_token', tokens.data.refresh_token, {
        httpOnly: true, // Secure, not accessible by JavaScript
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/', // Allow access from all paths for refresh functionality
      });

      return {
        success: true,
        message: 'Token refreshed successfully',
        data: {
          accessTokenExpiresIn: '15m',
          refreshTokenExpiresIn: '7d',
        },
      };
    } catch (error) {
      // Clear invalid tokens
      res.clearCookie('access_token', {
        httpOnly: false, // Match the setting when it was set
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      });

      res.clearCookie('refresh_token', {
        httpOnly: true, // Match the setting when it was set
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      });

      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return {
      success: true,
      data: {
        user: req.user,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Req() req, @Res({ passthrough: true }) res: Response) {
    // Clear access token
    res.clearCookie('access_token', {
      httpOnly: false, // Match the setting when it was set
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    // Clear refresh token
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    // Invalidate tokens on server side
    this.authService.logOut(req);

    return {
      success: true,
      message: 'Logged out successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('check-token')
  async checkToken(@Req() req) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new BadRequestException('No token provided');
    }

    try {
      const tokenInfo = await this.authService.checkTokenExpiration(token);

      return {
        success: true,
        data: {
          ...tokenInfo,
          tokenPreview: token.substring(0, 20) + '...',
          currentTime: new Date().toISOString(),
          tokenType: 'access_token',
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  @Post('forget-password')
  @HttpCode(HttpStatus.OK)
  async forgetPassword(@Body() dto: { email: string }) {
    if (!dto.email) {
      throw new BadRequestException('Email is required');
    }

    const result = await this.authService.requestPasswordReset(dto.email);

    return {
      success: true,
      message: 'Password reset email sent successfully',
      data: result,
    };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: { token: string; newPassword: string }) {
    if (!dto.token || !dto.newPassword) {
      throw new BadRequestException('Token and new password are required');
    }

    if (dto.newPassword.length < 6) {
      throw new BadRequestException(
        'Password must be at least 6 characters long',
      );
    }

    const result = await this.authService.resetPassword(
      dto.token,
      dto.newPassword,
    );

    return {
      success: true,
      message: 'Password reset successfully',
      data: result,
    };
  }

  @Get('validate-reset-token')
  @HttpCode(HttpStatus.OK)
  async validateResetToken(@Query('token') token: string) {
    if (!token) {
      throw new BadRequestException('Token is required');
    }

    const result = await this.authService.validateResetToken(token);

    return {
      success: true,
      data: result,
    };
  }
}
