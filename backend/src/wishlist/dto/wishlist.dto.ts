// ============================================
// DTOs
// ============================================

import { IsString, IsNotEmpty } from 'class-validator';

export class AddToWishlistDto {
  @IsString()
  @IsNotEmpty()
  productId: string;
}

export class WishlistItemDto {
  id: string;
  productId: string;
  product: {
    id: string;
    nameEn: string;
    nameAr: string;
    basePrice: number;
    discountPercentage: number;
    finalPrice: number;
    images: string[];
    vendor: string;
    availability: string;
  };
  createdAt: Date;
}

