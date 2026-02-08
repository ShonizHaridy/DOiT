// ============================================
// Service
// ============================================

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOfferDto, UpdateOfferDto, CreatePopupOfferDto, UpdatePopupOfferDto } from './dto/admin-offers.dto';

@Injectable()
export class AdminOffersService {
  constructor(private prisma: PrismaService) {}

  // ============ OFFERS ============

  async createOffer(dto: CreateOfferDto) {
    // Check if code already exists
    const existing = await this.prisma.offer.findUnique({
      where: { code: dto.code },
    });

    if (existing) {
      throw new ConflictException('Offer code already exists');
    }

    return this.prisma.offer.create({
      data: {
        code: dto.code,
        nameEn: dto.nameEn,
        nameAr: dto.nameAr,
        type: dto.type,
        discountValue: dto.discountValue,
        minCartValue: dto.minCartValue,
        maxDiscount: dto.maxDiscount,
        applyTo: dto.applyTo,
        targetId: dto.targetId,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        startTime: dto.startTime,
        endTime: dto.endTime,
        totalUsageLimit: dto.totalUsageLimit,
        perUserLimit: dto.perUserLimit,
        status: dto.status ?? true,
      },
    });
  }

  async updateOffer(id: string, dto: UpdateOfferDto) {
    const offer = await this.prisma.offer.findUnique({
      where: { id },
    });

    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    return this.prisma.offer.update({
      where: { id },
      data: {
        nameEn: dto.nameEn,
        nameAr: dto.nameAr,
        type: dto.type,
        discountValue: dto.discountValue,
        minCartValue: dto.minCartValue,
        maxDiscount: dto.maxDiscount,
        applyTo: dto.applyTo,
        targetId: dto.targetId,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        startTime: dto.startTime,
        endTime: dto.endTime,
        totalUsageLimit: dto.totalUsageLimit,
        perUserLimit: dto.perUserLimit,
        status: dto.status,
      },
    });
  }

  async deleteOffer(id: string): Promise<void> {
    const offer = await this.prisma.offer.findUnique({
      where: { id },
    });

    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    await this.prisma.offer.delete({ where: { id } });
  }

  async getOffers(status?: string) {
    const where: any = {};

    if (status === 'active') {
      where.status = true;
      where.endDate = { gte: new Date() };
    } else if (status === 'expired') {
      where.endDate = { lt: new Date() };
    } else if (status === 'inactive') {
      where.status = false;
    }

    return this.prisma.offer.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOfferById(id: string) {
    const offer = await this.prisma.offer.findUnique({
      where: { id },
    });

    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    return offer;
  }

  // ============ POPUP OFFERS ============

  async createPopupOffer(dto: CreatePopupOfferDto) {
    return this.prisma.popupOffer.create({
      data: {
        headlineEn: dto.headlineEn,
        headlineAr: dto.headlineAr,
        subHeadlineEn: dto.subHeadlineEn,
        subHeadlineAr: dto.subHeadlineAr,
        amount: dto.amount,
        voucherCode: dto.voucherCode,
        targetedUser: dto.targetedUser,
        imageUrl: dto.imageUrl,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        status: dto.status ?? true,
      },
    });
  }

  async updatePopupOffer(id: string, dto: UpdatePopupOfferDto) {
    const popup = await this.prisma.popupOffer.findUnique({
      where: { id },
    });

    if (!popup) {
      throw new NotFoundException('Popup offer not found');
    }

    return this.prisma.popupOffer.update({
      where: { id },
      data: {
        headlineEn: dto.headlineEn,
        headlineAr: dto.headlineAr,
        subHeadlineEn: dto.subHeadlineEn,
        subHeadlineAr: dto.subHeadlineAr,
        amount: dto.amount,
        voucherCode: dto.voucherCode,
        targetedUser: dto.targetedUser,
        imageUrl: dto.imageUrl,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        status: dto.status,
      },
    });
  }

  async deletePopupOffer(id: string): Promise<void> {
    const popup = await this.prisma.popupOffer.findUnique({
      where: { id },
    });

    if (!popup) {
      throw new NotFoundException('Popup offer not found');
    }

    await this.prisma.popupOffer.delete({ where: { id } });
  }

  async getPopupOffers() {
    return this.prisma.popupOffer.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}

