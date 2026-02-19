// types/content.types.ts


export interface HeroSection {
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
  ctaLink?: string
  order: number
  status: boolean
  createdAt?: string
  updatedAt?: string
}

export type HeroSectionProduct = HeroSection


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
  heroSection: HeroSection
  vendors: Vendor[]
  banners: Banner[]
}

export interface InformationPageSummary {
  id: string
  slug: string
  titleEn: string
  titleAr: string
  order: number
}

export interface InformationPage extends InformationPageSummary {
  contentEn: string
  contentAr: string
  status?: boolean
  showInFooter?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface PopupOffer {
  id: string;
  headlineEn: string;
  headlineAr: string;
  subHeadlineEn: string;
  subHeadlineAr: string;
  amount: number;
  amountLabel?: string;
  voucherCode: string;
  targetedUser: 'first_time_customer' | 'all' | 'returning';
  imageUrl?: string | null;
  startDate?: string;
  endDate?: string;
  status?: boolean;
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
  targetedUser: 'first_time_customer' | 'all' | 'returning';
  imageUrl?: string;
  startDate: string;
  endDate: string;
  status?: boolean;
}

export interface UpdatePopupOfferRequest {
  headlineEn?: string;
  headlineAr?: string;
  subHeadlineEn?: string;
  subHeadlineAr?: string;
  amount?: number;
  voucherCode?: string;
  targetedUser?: 'first_time_customer' | 'all' | 'returning';
  imageUrl?: string;
  startDate?: string;
  endDate?: string;
  status?: boolean;
}

export interface FeaturedProductsConfig {
  id?: string;
  autoChoose: boolean;
  selectedProducts: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSitePageRequest {
  titleEn: string
  titleAr: string
  slug: string
  contentEn: string
  contentAr: string
  showInFooter?: boolean
  order?: number
  status?: boolean
}

export interface UpdateSitePageRequest {
  titleEn?: string
  titleAr?: string
  slug?: string
  contentEn?: string
  contentAr?: string
  showInFooter?: boolean
  order?: number
  status?: boolean
}
