import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { EmailService } from '../auth/email.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  BannerAdDto,
  HeroSectionDto,
  HomeContentDto,
  InformationPageDto,
  InformationPageSummaryDto,
  VendorDto,
} from './dto/content.dto';

type ActivePopupOffer = {
  id: string;
  headlineEn: string;
  headlineAr: string;
  subHeadlineEn: string;
  subHeadlineAr: string;
  amount: number;
  amountLabel: string;
  voucherCode: string;
  targetedUser: string;
  imageUrl: string | null;
};

@Injectable()
export class ContentService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async getHomeContent(): Promise<HomeContentDto> {
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

    if (!heroSectionRaw) {
      throw new NotFoundException('No active hero section found');
    }

    const mappedHeroSection = {
      ...heroSectionRaw,
      price: heroSectionRaw.price ? Number(heroSectionRaw.price) : undefined,
    };

    const heroSection = plainToInstance(HeroSectionDto, mappedHeroSection);
    const banners = plainToInstance(BannerAdDto, bannersRaw);
    const vendors = plainToInstance(VendorDto, vendorsRaw);

    return {
      heroSection,
      vendors,
      banners,
    };
  }

  async getActivePopupOffer() {
    const offer = await this.resolveActivePopupOffer();
    if (!offer) return null;
    return offer;
  }

  async claimPopupOffer(email: string, locale: 'en' | 'ar' = 'en') {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      throw new BadRequestException('Email is required');
    }

    const activeOffer = await this.resolveActivePopupOffer();
    if (!activeOffer) {
      throw new NotFoundException('No active offer available');
    }

    const isArabic = locale === 'ar';

    await this.emailService.sendPopupOfferEmail(normalizedEmail, {
      amount: activeOffer.amount,
      amountLabel: activeOffer.amountLabel,
      voucherCode: activeOffer.voucherCode,
      headline: isArabic ? activeOffer.headlineAr : activeOffer.headlineEn,
      subHeadline: isArabic ? activeOffer.subHeadlineAr : activeOffer.subHeadlineEn,
    });

    return { success: true };
  }

  async getInformationPages(): Promise<InformationPageSummaryDto[]> {
    return this.prisma.sitePage.findMany({
      where: {
        status: true,
        showInFooter: true,
      },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
      select: {
        id: true,
        slug: true,
        titleEn: true,
        titleAr: true,
        order: true,
      },
    });
  }

  async getInformationPageBySlug(slug: string): Promise<InformationPageDto> {
    const normalizedSlug = slug.trim().toLowerCase();
    const page = await this.prisma.sitePage.findFirst({
      where: {
        slug: normalizedSlug,
        status: true,
      },
      select: {
        id: true,
        slug: true,
        titleEn: true,
        titleAr: true,
        contentEn: true,
        contentAr: true,
        order: true,
      },
    });

    if (!page) {
      throw new NotFoundException('Site page not found');
    }

    return page;
  }

  private async resolveActivePopupOffer(): Promise<ActivePopupOffer | null> {
    const now = new Date();
    
    // Popup runtime is driven by active checkout offers only.
    const offer = await this.prisma.offer.findFirst({
      where: {
        status: true,
        startDate: { lte: now },
        endDate: { gte: now },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!offer) return null;

    const amount = Number(offer.discountValue);
    const normalizedAmount = Number.isFinite(amount) ? amount : 0;
    const amountLabel = this.formatOfferAmountLabel(offer.type, normalizedAmount);

    return {
      id: `offer-${offer.id}`,
      headlineEn: 'Your Discount Expires Soon!',
      headlineAr: 'Your Discount Expires Soon!',
      subHeadlineEn:
        "Don't miss out! Your exclusive offer is about to expire. Complete your purchase now and save big!",
      subHeadlineAr:
        "Don't miss out! Your exclusive offer is about to expire. Complete your purchase now and save big!",
      amount: normalizedAmount,
      amountLabel,
      voucherCode: offer.code,
      targetedUser: 'all',
      imageUrl: null,
    };
  }

  private formatOfferAmountLabel(type: string, amount: number): string {
    if (type === 'FREE_SHIPPING') return 'Free Shipping';
    if (type === 'FIXED_AMOUNT') return `${amount} EGP Off`;
    if (amount > 0) return `${amount}% Off`;
    return 'Special Offer';
  }
}
