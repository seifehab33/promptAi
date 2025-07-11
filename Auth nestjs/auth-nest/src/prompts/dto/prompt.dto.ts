import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class PromptDto {
  userId: number;
  @IsString()
  @IsOptional()
  promptModel?: string;
  @IsString()
  @IsOptional()
  promptTitle?: string;
  @IsString()
  @IsNotEmpty()
  promptDescription: string;
  @IsString()
  @IsOptional()
  promptContent?: string;
  @IsArray()
  @IsOptional()
  promptTags?: string[];
  @IsString()
  @IsOptional()
  promptContext?: string;
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
  @IsArray()
  @IsOptional()
  likes?: string[];
}
