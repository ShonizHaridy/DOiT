// src/content/content.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BannerAdDto, HeroSectionDto, HomeContentDto, VendorDto } from './dto/content.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}

  async getHomeContent(): Promise<HomeContentDto> {
    // ✅ CHANGED: Use findFirst to get single active hero section
    const [heroSectionRaw, vendorsRaw, bannersRaw] = await Promise.all([
      this.prisma.heroSection.findFirst({
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

    // ✅ Handle case where no hero section exists
    if (!heroSectionRaw) {
      throw new NotFoundException('No active hero section found');
    }

    // ✅ Map single object, not array
    const mappedHeroSection = {
      ...heroSectionRaw,
      price: heroSectionRaw.price ? Number(heroSectionRaw.price) : undefined,
    };

    // ✅ Transform single object
    const heroSection = plainToInstance(HeroSectionDto, mappedHeroSection);
    const banners = plainToInstance(BannerAdDto, bannersRaw);
    const vendors = plainToInstance(VendorDto, vendorsRaw);

    // ✅ CHANGED: Return single object, not array
    return {
      heroSection, // Singular
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