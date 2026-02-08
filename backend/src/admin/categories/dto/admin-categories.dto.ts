// ============================================
// DTOs
// ============================================

import {
  IsString,
  IsBoolean,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

// ============ Category DTOs ============

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  nameEn: string;

  @IsString()
  @IsNotEmpty()
  nameAr: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @IsOptional()
  @IsNumber()
  order?: number;
}

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  nameEn?: string;

  @IsOptional()
  @IsString()
  nameAr?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @IsOptional()
  @IsNumber()
  order?: number;
}

// ============ SubCategory DTOs ============

export class CreateSubCategoryDto {
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  nameEn: string;

  @IsString()
  @IsNotEmpty()
  nameAr: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsNumber()
  order?: number;
}

export class UpdateSubCategoryDto {
  @IsOptional()
  @IsString()
  nameEn?: string;

  @IsOptional()
  @IsString()
  nameAr?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsNumber()
  order?: number;
}

// ============ ProductList DTOs ============

export class CreateProductListDto {
  @IsString()
  @IsNotEmpty()
  subCategoryId: string;

  @IsString()
  @IsNotEmpty()
  nameEn: string;

  @IsString()
  @IsNotEmpty()
  nameAr: string;

  @IsOptional()
  @IsNumber()
  order?: number;
}

export class UpdateProductListDto {
  @IsOptional()
  @IsString()
  nameEn?: string;

  @IsOptional()
  @IsString()
  nameAr?: string;

  @IsOptional()
  @IsNumber()
  order?: number;
}

// ============ Response DTOs ============

export class AdminCategoryDto {
  id: string;
  nameEn: string;
  nameAr: string;
  icon?: string;
  status: boolean;
  order: number;
  totalSubCategories: number;
  totalProducts: number;
  createdAt: Date;
}

