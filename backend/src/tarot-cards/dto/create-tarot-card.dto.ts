import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateTarotCardDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @IsNumber()
  @Min(0)
  number: number;

  @IsString()
  @IsNotEmpty()
  arcana: string;

  @IsString()
  @IsNotEmpty()
  uprightMeaning: string;

  @IsString()
  @IsNotEmpty()
  reversedMeaning: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  symbolism?: string;

  @IsString()
  @IsOptional()
  element?: string;

  @IsString()
  @IsOptional()
  planet?: string;

  @IsString()
  @IsOptional()
  zodiac?: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  keywords?: string[];

  @IsBoolean()
  @IsOptional()
  isFavorite?: boolean;

  // Optional fields for frontend integration
  @IsString()
  @IsOptional()
  numeral?: string;

  @IsString()
  @IsOptional()
  theme?: string;

  @IsString()
  @IsOptional()
  glyph?: string;

  @IsString()
  @IsOptional()
  summary?: string;

  @IsString()
  @IsOptional()
  meaning?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  upright?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  reversed?: string[];

  @IsString()
  @IsOptional()
  love?: string;

  @IsString()
  @IsOptional()
  career?: string;

  @IsString()
  @IsOptional()
  growth?: string;

  @IsString()
  @IsOptional()
  quote?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  themes?: string[];

  @IsString()
  @IsOptional()
  slug?: string;
}

