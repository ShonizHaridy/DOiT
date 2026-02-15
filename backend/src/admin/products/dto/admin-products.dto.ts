// ============================================
// DTOs
// ============================================

import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsArray,
  ValidateNested,
  Min,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum ProductStatus {
  PUBLISHED = 'PUBLISHED',
  UNPUBLISHED = 'UNPUBLISHED',
  DRAFT = 'DRAFT',
}

enum Gender {
  UNISEX = 'UNISEX',
  MEN = 'MEN',
  WOMEN = 'WOMEN',
  KIDS = 'KIDS',
}

class ProductVariantDto {
  @IsString()
  @IsNotEmpty()
  color: string;

  @IsString()
  @IsNotEmpty()
  size: string;

  @IsNumber()
  @Min(0)
  quantity: number;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  productListId: string;

  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsString()
  @IsNotEmpty()
  nameEn: string;

  @IsString()
  @IsNotEmpty()
  nameAr: string;

  @IsOptional()
  @IsString()
  descriptionEn?: string;

  @IsOptional()
  @IsString()
  descriptionAr?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  detailsEn?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  detailsAr?: string[];

  @IsNumber()
  @Min(0)
  basePrice: number;

  @IsNumber()
  @Min(0)
  discountPercentage: number;

  @IsString()
  @IsNotEmpty()
  vendor: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsEnum(ProductStatus)
  status: ProductStatus;

  @IsOptional()
  @IsString()
  sizeChartUrl?: string;

  @IsArray()
  @IsString({ each: true })
  imageUrls: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  variants: ProductVariantDto[];
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number;

  @IsOptional()
  @IsString()
  productListId?: string;

  @IsOptional()
  @IsString()
  nameEn?: string;

  @IsOptional()
  @IsString()
  nameAr?: string;

  @IsOptional()
  @IsString()
  descriptionEn?: string;

  @IsOptional()
  @IsString()
  descriptionAr?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  detailsEn?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  detailsAr?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  basePrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discountPercentage?: number;

  @IsOptional()
  @IsString()
  vendor?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @IsOptional()
  @IsString()
  sizeChartUrl?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  variants?: ProductVariantDto[];
}

export class AdminProductDto {
  id: string;
  sku: string;
  nameEn: string;
  nameAr: string;
  basePrice: number;
  discountPercentage: number;
  vendor: string;
  type: string;
  status: string;
  totalStock: number;
  availability: string;
  viewCount: number;
  totalOrders: number;
  image?: string;
  createdAt: Date;
  category?: string;
  subCategory?: string;
  productList?: string;
}

export class UpdateProductStatusDto {
  @IsEnum(ProductStatus)
  status: ProductStatus;
}

export class PaginatedAdminProductsDto {
  products: AdminProductDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

