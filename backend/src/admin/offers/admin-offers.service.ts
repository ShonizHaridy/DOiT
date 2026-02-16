// ============================================
// Service
// ============================================

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOfferDto, UpdateOfferDto, CreatePopupOfferDto, UpdatePopupOfferDto } from './dto/admin-offers.dto';

@Injectable()
export class AdminOffersService {
  constructor(private prisma: PrismaService) {}

  private normalizeListParam(value?: string): string[] {
    if (!value) return [];

    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  private buildOfferExportWhere(search?: string, type?: string, status?: string): any {
    const conditions: any[] = [];
    const now = new Date();

    if (search) {
      conditions.push({
        OR: [
          { code: { contains: search, mode: 'insensitive' } },
          { nameEn: { contains: search, mode: 'insensitive' } },
          { nameAr: { contains: search, mode: 'insensitive' } },
        ],
      });
    }

    const typeValues = this.normalizeListParam(type).map((entry) =>
      entry.toUpperCase() === 'BOGO' ? 'BUNDLE' : entry.toUpperCase(),
    );
    if (typeValues.length > 0) {
      conditions.push({ type: { in: Array.from(new Set(typeValues)) } });
    }

    const statusValues = this.normalizeListParam(status).map((entry) => entry.toUpperCase());
    if (statusValues.length > 0) {
      const statusConditions: any[] = [];

      if (statusValues.includes('DRAFT')) {
        statusConditions.push({ status: false });
      }
      if (statusValues.includes('SCHEDULED')) {
        statusConditions.push({
          AND: [{ status: true }, { startDate: { gt: now } }],
        });
      }
      if (statusValues.includes('EXPIRED')) {
        statusConditions.push({
          AND: [{ status: true }, { startDate: { lte: now } }, { endDate: { lt: now } }],
        });
      }
      if (statusValues.includes('ACTIVE')) {
        statusConditions.push({
          AND: [{ status: true }, { startDate: { lte: now } }, { endDate: { gte: now } }],
        });
      }

      if (statusConditions.length > 0) {
        conditions.push({ OR: statusConditions });
      }
    }

    if (conditions.length === 0) {
      return {};
    }

    return { AND: conditions };
  }

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

  async exportOffersCsv(search?: string, type?: string, status?: string): Promise<string> {
    const where = this.buildOfferExportWhere(search, type, status);
    const offers = await this.prisma.offer.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const headers = [
      'Code',
      'Name (EN)',
      'Name (AR)',
      'Type',
      'Status',
      'Discount Value',
      'Apply To',
      'Target',
      'Usage',
      'Start Date',
      'End Date',
      'Created At',
    ];

    const rows = offers.map((offer) => [
      offer.code,
      offer.nameEn,
      offer.nameAr,
      this.formatOfferType(offer.type),
      this.getOfferStatusLabel(offer.status, offer.startDate, offer.endDate),
      offer.discountValue,
      offer.applyTo,
      offer.targetId ?? '',
      offer.currentUsage ?? 0,
      offer.startDate.toISOString(),
      offer.endDate.toISOString(),
      offer.createdAt.toISOString(),
    ]);

    return this.toCsv(headers, rows);
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

  private formatOfferType(type: string): string {
    if (type === 'FIXED_AMOUNT') return 'Fixed amount';
    if (type === 'FREE_SHIPPING') return 'Free shipping';
    if (type === 'PERCENTAGE') return 'Percentage';
    return 'Bundle';
  }

  private getOfferStatusLabel(status: boolean, startDate: Date, endDate: Date): string {
    if (!status) return 'Draft';

    const now = new Date();
    if (startDate.getTime() > now.getTime()) return 'Scheduled';
    if (endDate.getTime() < now.getTime()) return 'Expired';
    return 'Active';
  }

  private escapeCsvValue(value: unknown): string {
    if (value === null || value === undefined) return '';
    const text = String(value);

    if (/[",\n\r]/.test(text)) {
      return `"${text.replace(/"/g, '""')}"`;
    }

    return text;
  }

  private toCsv(headers: string[], rows: unknown[][]): string {
    const lines = [
      headers.map((value) => this.escapeCsvValue(value)).join(','),
      ...rows.map((row) => row.map((value) => this.escapeCsvValue(value)).join(',')),
    ];
    return `\uFEFF${lines.join('\n')}`;
  }
}

