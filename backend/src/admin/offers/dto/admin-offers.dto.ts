// ============================================
// DTOs
// ============================================

import {
  IsString,
  IsNumber,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  IsDateString,
  Min,
} from 'class-validator';

enum OfferType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
  BUNDLE = 'BUNDLE',
  FREE_SHIPPING = 'FREE_SHIPPING',
}

enum OfferScope {
  ALL = 'ALL',
  CATEGORY = 'CATEGORY',
  SUB_CATEGORY = 'SUB_CATEGORY',
  PRODUCT_LIST = 'PRODUCT_LIST',
  PRODUCT_TYPE = 'PRODUCT_TYPE',
}

// ============ Offer DTOs ============

export class CreateOfferDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  nameEn: string;

  @IsString()
  @IsNotEmpty()
  nameAr: string;

  @IsEnum(OfferType)
  type: OfferType;

  @IsNumber()
  @Min(0)
  discountValue: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minCartValue?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxDiscount?: number;

  @IsEnum(OfferScope)
  applyTo: OfferScope;

  @IsOptional()
  @IsString()
  targetId?: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  totalUsageLimit?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  perUserLimit?: number;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}

export class UpdateOfferDto {
  @IsOptional()
  @IsString()
  nameEn?: string;

  @IsOptional()
  @IsString()
  nameAr?: string;

  @IsOptional()
  @IsEnum(OfferType)
  type?: OfferType;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discountValue?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minCartValue?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxDiscount?: number;

  @IsOptional()
  @IsEnum(OfferScope)
  applyTo?: OfferScope;

  @IsOptional()
  @IsString()
  targetId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  totalUsageLimit?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  perUserLimit?: number;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}

// ============ Popup Offer DTOs ============

export class CreatePopupOfferDto {
  @IsString()
  @IsNotEmpty()
  headlineEn: string;

  @IsString()
  @IsNotEmpty()
  headlineAr: string;

  @IsString()
  @IsNotEmpty()
  subHeadlineEn: string;

  @IsString()
  @IsNotEmpty()
  subHeadlineAr: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  @IsNotEmpty()
  voucherCode: string;

  @IsString()
  @IsNotEmpty()
  targetedUser: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}

export class UpdatePopupOfferDto {
  @IsOptional()
  @IsString()
  headlineEn?: string;

  @IsOptional()
  @IsString()
  headlineAr?: string;

  @IsOptional()
  @IsString()
  subHeadlineEn?: string;

  @IsOptional()
  @IsString()
  subHeadlineAr?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @IsOptional()
  @IsString()
  voucherCode?: string;

  @IsOptional()
  @IsString()
  targetedUser?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}

