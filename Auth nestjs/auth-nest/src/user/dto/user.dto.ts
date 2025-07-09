// src/users/dto/create-user.dto.ts
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
  @IsString()
  @IsNotEmpty()
  role: string;
  @IsNumber()
  tokensFree: number;
  @IsNumber()
  tokensUsed: number;
  @IsNumber()
  tokensRemaining: number;
  @IsBoolean()
  isPremium: boolean;
}
