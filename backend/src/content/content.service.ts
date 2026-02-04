// ============================================
// Service
// ============================================

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BannerAdDto, HeroSectionDto, HomeContentDto, VendorDto } from './dto/content.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}

async getHomeContent(): Promise<HomeContentDto> {
  const [heroSectionsRaw, vendorsRaw, bannersRaw] = await Promise.all([
    this.prisma.heroSection.findMany({
      where: { status: true },
      orderBy: { order: 'asc' },
    }),
    this.prisma.vendor.findMany({
      where: { status: true },
      orderBy: { order: 'asc' },
    }),
    this.prisma.bannerAd.findMany({
      where: { status: true },
      orderBy: { order: 'asc' },
    }),
  ]);

  // 1. Manually map the raw data to handle the Decimal string conversion
  // This removes any ambiguity before class-transformer starts its work.
  const mappedHeroSections = heroSectionsRaw.map(hero => ({
    ...hero,
    // Convert Prisma Decimal object/string to a plain JS number
    price: hero.price ? Number(hero.price) : undefined,
  }));

  // 2. Now transform the cleaned data
  const heroSectionProducts = plainToInstance(HeroSectionDto, mappedHeroSections);
  const banners = plainToInstance(BannerAdDto, bannersRaw);
  const vendors = plainToInstance(VendorDto, vendorsRaw);

  return {
    heroSectionProducts,
    vendors,
    banners,
  };
}

  async getActivePopupOffer() {
    const now = new Date();
    
    const offer = await this.prisma.popupOffer.findFirst({
      where: {
        status: true,
        startDate: { lte: now },
        endDate: { gte: now },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!offer) return null;

    return {
      id: offer.id,
      headlineEn: offer.headlineEn,
      headlineAr: offer.headlineAr,
      subHeadlineEn: offer.subHeadlineEn,
      subHeadlineAr: offer.subHeadlineAr,
      amount: Number(offer.amount),
      voucherCode: offer.voucherCode,
      targetedUser: offer.targetedUser,
      imageUrl: offer.imageUrl,
    };
  }
}

