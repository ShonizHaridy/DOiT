// ============================================
// DTOs
// ============================================

import { OptionalField, ToNumber, TransformUrl } from "src/common/decorators/transform.decorator";

export class HeroSectionDto {
  id: string;
  headlineEn: string;
  headlineAr: string;

  @OptionalField()
  descriptionEn?: string;

  @OptionalField()
  descriptionAr?: string;

  // @OptionalField()
  @ToNumber()
  price?: number;
  @TransformUrl()
  mainImageUrl: string;
  variantImages: string[];

  @OptionalField()
  ctaTextEn?: string;

  @OptionalField()
  ctaTextAr?: string;

  @OptionalField()
  ctaLink?: string;
}

export class VendorDto {
  id: string;
  name: string;
  logoUrl: string;
}

export class BannerAdDto {
  id: string;
  @TransformUrl()
  imageUrl: string;
  @OptionalField()
  titleEn?: string;
  @OptionalField()
  titleAr?: string;
  @OptionalField()
  link?: string;
}

export class HomeContentDto {
  heroSectionProducts: HeroSectionDto[];
  vendors: VendorDto[];
  banners: BannerAdDto[];
}

