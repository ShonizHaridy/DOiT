export interface AddToWishlistRequest {
  productId: string;
}

export interface WishlistItem {
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