// ============================================
// DTOs
// ============================================

import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
  IsNotEmpty,
  Matches,
  MaxLength,
} from 'class-validator';

// ============ Hero Section DTOs ============

export class CreateHeroSectionDto {
  @IsString()
  @IsNotEmpty()
  headlineEn: string;

  @IsString()
  @IsNotEmpty()
  headlineAr: string;

  @IsOptional()
  @IsString()
  descriptionEn?: string;

  @IsOptional()
  @IsString()
  descriptionAr?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsString()
  @IsNotEmpty()
  mainImageUrl: string;

  @IsArray()
  @IsString({ each: true })
  variantImages: string[];

  @IsOptional()
  @IsString()
  ctaTextEn?: string;

  @IsOptional()
  @IsString()
  ctaTextAr?: string;

  @IsOptional()
  @IsString()
  ctaLink?: string;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}

export class UpdateHeroSectionDto {
  @IsOptional()
  @IsString()
  headlineEn?: string;

  @IsOptional()
  @IsString()
  headlineAr?: string;

  @IsOptional()
  @IsString()
  descriptionEn?: string;

  @IsOptional()
  @IsString()
  descriptionAr?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  mainImageUrl?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  variantImages?: string[];

  @IsOptional()
  @IsString()
  ctaTextEn?: string;

  @IsOptional()
  @IsString()
  ctaTextAr?: string;

  @IsOptional()
  @IsString()
  ctaLink?: string;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}

// ============ Vendor DTOs ============

export class CreateVendorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  logoUrl: string;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}

export class UpdateVendorDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}

// ============ Banner DTOs ============

export class CreateBannerDto {
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsOptional()
  @IsString()
  titleEn?: string;

  @IsOptional()
  @IsString()
  titleAr?: string;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}

export class UpdateBannerDto {
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  titleEn?: string;

  @IsOptional()
  @IsString()
  titleAr?: string;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}

// ============ Featured Products DTOs ============

export class UpdateFeaturedProductsDto {
  @IsBoolean()
  autoChoose: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  selectedProducts?: string[];
}

// ============ Site Page DTOs ============

export class CreateSitePageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  titleEn: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  titleAr: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must be lowercase and can contain numbers and hyphens',
  })
  slug: string;

  @IsString()
  @IsNotEmpty()
  contentEn: string;

  @IsString()
  @IsNotEmpty()
  contentAr: string;

  @IsOptional()
  @IsBoolean()
  showInFooter?: boolean;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}

export class UpdateSitePageDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  titleEn?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  titleAr?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must be lowercase and can contain numbers and hyphens',
  })
  slug?: string;

  @IsOptional()
  @IsString()
  contentEn?: string;

  @IsOptional()
  @IsString()
  contentAr?: string;

  @IsOptional()
  @IsBoolean()
  showInFooter?: boolean;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}

