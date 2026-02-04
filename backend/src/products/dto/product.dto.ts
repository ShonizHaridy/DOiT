import { IsEnum, IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { TransformUrl } from 'src/common/decorators/transform.decorator';

export enum SortBy {
  FEATURED = 'featured',
  BEST_SELLING = 'best-selling',
  A_Z = 'a-z',
  Z_A = 'z-a',
  PRICE_LOW = 'price-low',
  PRICE_HIGH = 'price-high',
  DATE_OLD = 'date-old',
  DATE_NEW = 'date-new',
}

class ProductImageDto {
  id: string;
  
  @TransformUrl()
  url: string;
  
  order: number;
}

export class GetProductsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @IsEnum(SortBy)
  sortBy?: SortBy = SortBy.FEATURED;

  // Filters
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  subCategory?: string;

  @IsOptional()
  @IsString()
  productList?: string;

  @IsOptional()
  @IsString()
  vendor?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;

  @IsOptional()
  @IsString()
  colors?: string; // Comma-separated

  @IsOptional()
  @IsString()
  sizes?: string; // Comma-separated

  @IsOptional()
  @IsString()
  availability?: string; // "in-stock", "low-stock", "out-of-stock"
}

export class ProductResponseDto {
  id: string;
  sku: string;
  nameEn: string;
  nameAr: string;
  descriptionEn?: string;
  descriptionAr?: string;
  detailsEn?: string[];
  detailsAr?: string[];
  basePrice: number;
  discountPercentage: number;
  finalPrice: number;
  vendor: string;
  gender: string;
  type: string;
  status: string;
  sizeChartUrl?: string;
  @Type(() => ProductImageDto) 
  images: ProductImageDto[];
  colors: string[];
  sizes: string[];
  availability: 'in-stock' | 'low-stock' | 'out-of-stock';
  totalStock: number;
  viewCount: number;
  createdAt: Date;
  category?: {
    id: string;
    nameEn: string;
    nameAr: string;
  };
  subCategory?: {
    id: string;
    nameEn: string;
    nameAr: string;
  };
  productList?: {
    id: string;
    nameEn: string;
    nameAr: string;
  };
}

export class PaginatedProductsDto {
  products: ProductResponseDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}