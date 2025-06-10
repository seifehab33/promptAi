import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class PromptDto {
  userId: number;
  @IsString()
  @IsOptional()
  promptTitle?: string;
  @IsString()
  @IsNotEmpty()
  promptDescription: string;
  @IsArray()
  @IsOptional()
  promptTags?: string[];
  @IsString()
  @IsOptional()
  promptContext?: string;
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}
