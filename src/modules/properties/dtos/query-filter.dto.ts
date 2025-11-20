/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class QueryFilterDto {
  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsBoolean()
  availability?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  priceMin?: number;

  @IsOptional()
  @IsNumber()
  @Max(10000)
  priceMax?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  offset?: number = 0;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
