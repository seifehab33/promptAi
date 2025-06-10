import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class AuthDto {
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(6)
  password: string;
  @IsBoolean()
  @IsOptional()
  rememberMe?: boolean;
}
