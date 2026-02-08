// types/content.types.ts


export interface HeroSectionProduct {
  id: string
  headlineEn: string
  headlineAr: string
  descriptionEn: string
  descriptionAr: string
  price: number
  mainImageUrl: string
  variantImages: string[]
  ctaTextEn: string
  ctaTextAr: string
  order: number
  status: boolean
}


export interface Vendor {
  id: string
  name: string
  logoUrl: string
  order: number
  status: boolean
}

export interface Banner {
  id: string
  imageUrl: string
  titleEn: string
  titleAr: string
  link: string
  order: number
  status: boolean
}

export interface HomeContent {
  heroSection: HeroSectionProduct
  vendors: Vendor[]
  banners: Banner[]
}

export interface PopupOffer {
  id: string;
  headlineEn: string;
  headlineAr: string;
  subHeadlineEn: string;
  subHeadlineAr: string;
  amount: number;
  voucherCode: string;
  targetedUser: string;
  imageUrl?: string;
}

// ... existing types

// ============================================
// ADMIN REQUEST TYPES
// ============================================

export interface CreateHeroSectionRequest {
  headlineEn: string;
  headlineAr: string;
  descriptionEn?: string;
  descriptionAr?: string;
  price?: number;
  mainImageUrl: string;
  variantImages: string[];
  ctaTextEn?: string;
  ctaTextAr?: string;
  ctaLink?: string;
  order?: number;
  status?: boolean;
}

export interface UpdateHeroSectionRequest {
  headlineEn?: string;
  headlineAr?: string;
  descriptionEn?: string;
  descriptionAr?: string;
  price?: number;
  mainImageUrl?: string;
  variantImages?: string[];
  ctaTextEn?: string;
  ctaTextAr?: string;
  ctaLink?: string;
  order?: number;
  status?: boolean;
}

export interface CreateVendorRequest {
  name: string;
  logoUrl: string;
  order?: number;
  status?: boolean;
}

export interface UpdateVendorRequest {
  name?: string;
  logoUrl?: string;
  order?: number;
  status?: boolean;
}

export interface CreateBannerAdRequest {
  imageUrl: string;
  titleEn?: string;
  titleAr?: string;
  link?: string;
  order?: number;
  status?: boolean;
}

export interface UpdateBannerAdRequest {
  imageUrl?: string;
  titleEn?: string;
  titleAr?: string;
  link?: string;
  order?: number;
  status?: boolean;
}

export interface CreatePopupOfferRequest {
  headlineEn: string;
  headlineAr: string;
  subHeadlineEn: string;
  subHeadlineAr: string;
  amount: number;
  voucherCode: string;
  targetedUser: 'ALL' | 'NEW' | 'EXISTING';
  imageUrl?: string;
  startDate: Date;
  endDate: Date;
  status?: boolean;
}

export interface UpdatePopupOfferRequest {
  headlineEn?: string;
  headlineAr?: string;
  subHeadlineEn?: string;
  subHeadlineAr?: string;
  amount?: number;
  voucherCode?: string;
  targetedUser?: 'ALL' | 'NEW' | 'EXISTING';
  imageUrl?: string;
  startDate?: Date;
  endDate?: Date;
  status?: boolean;
}