// ============================================
// Service
// ============================================

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateHeroSectionDto,
  UpdateHeroSectionDto,
  CreateVendorDto,
  UpdateVendorDto,
  CreateBannerDto,
  UpdateBannerDto,
  UpdateFeaturedProductsDto,
  CreateSitePageDto,
  UpdateSitePageDto,
} from './dto/admin-content.dto';

@Injectable()
export class AdminContentService {
  constructor(private prisma: PrismaService) {}

  // ============ HERO SECTIONS ============

  async createHeroSection(dto: CreateHeroSectionDto) {
    return this.prisma.heroSection.create({
      data: {
        headlineEn: dto.headlineEn,
        headlineAr: dto.headlineAr,
        descriptionEn: dto.descriptionEn,
        descriptionAr: dto.descriptionAr,
        price: dto.price,
        mainImageUrl: dto.mainImageUrl,
        variantImages: dto.variantImages,
        ctaTextEn: dto.ctaTextEn,
        ctaTextAr: dto.ctaTextAr,
        ctaLink: dto.ctaLink,
        order: dto.order ?? 0,
        status: dto.status ?? true,
      },
    });
  }

  async updateHeroSection(id: string, dto: UpdateHeroSectionDto) {
    const hero = await this.prisma.heroSection.findUnique({
      where: { id },
    });

    if (!hero) {
      throw new NotFoundException('Hero section not found');
    }

    return this.prisma.heroSection.update({
      where: { id },
      data: {
        headlineEn: dto.headlineEn,
        headlineAr: dto.headlineAr,
        descriptionEn: dto.descriptionEn,
        descriptionAr: dto.descriptionAr,
        price: dto.price,
        mainImageUrl: dto.mainImageUrl,
        variantImages: dto.variantImages,
        ctaTextEn: dto.ctaTextEn,
        ctaTextAr: dto.ctaTextAr,
        ctaLink: dto.ctaLink,
        order: dto.order,
        status: dto.status,
      },
    });
  }

  async deleteHeroSection(id: string): Promise<void> {
    const hero = await this.prisma.heroSection.findUnique({
      where: { id },
    });

    if (!hero) {
      throw new NotFoundException('Hero section not found');
    }

    await this.prisma.heroSection.delete({ where: { id } });
  }

  async getHeroSections() {
    return this.prisma.heroSection.findMany({
      orderBy: { order: 'asc' },
    });
  }

  // ============ VENDORS ============

  async createVendor(dto: CreateVendorDto) {
    return this.prisma.vendor.create({
      data: {
        name: dto.name,
        logoUrl: dto.logoUrl,
        order: dto.order ?? 0,
        status: dto.status ?? true,
      },
    });
  }

  async updateVendor(id: string, dto: UpdateVendorDto) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { id },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    return this.prisma.vendor.update({
      where: { id },
      data: {
        name: dto.name,
        logoUrl: dto.logoUrl,
        order: dto.order,
        status: dto.status,
      },
    });
  }

  async deleteVendor(id: string): Promise<void> {
    const vendor = await this.prisma.vendor.findUnique({
      where: { id },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    await this.prisma.vendor.delete({ where: { id } });
  }

  async getVendors() {
    return this.prisma.vendor.findMany({
      orderBy: { order: 'asc' },
    });
  }

  // ============ BANNERS ============

  async createBanner(dto: CreateBannerDto) {
    return this.prisma.bannerAd.create({
      data: {
        imageUrl: dto.imageUrl,
        titleEn: dto.titleEn,
        titleAr: dto.titleAr,
        link: dto.link,
        order: dto.order ?? 0,
        status: dto.status ?? true,
      },
    });
  }

  async updateBanner(id: string, dto: UpdateBannerDto) {
    const banner = await this.prisma.bannerAd.findUnique({
      where: { id },
    });

    if (!banner) {
      throw new NotFoundException('Banner not found');
    }

    return this.prisma.bannerAd.update({
      where: { id },
      data: {
        imageUrl: dto.imageUrl,
        titleEn: dto.titleEn,
        titleAr: dto.titleAr,
        link: dto.link,
        order: dto.order,
        status: dto.status,
      },
    });
  }

  async deleteBanner(id: string): Promise<void> {
    const banner = await this.prisma.bannerAd.findUnique({
      where: { id },
    });

    if (!banner) {
      throw new NotFoundException('Banner not found');
    }

    await this.prisma.bannerAd.delete({ where: { id } });
  }

  async getBanners() {
    return this.prisma.bannerAd.findMany({
      orderBy: { order: 'asc' },
    });
  }

  // ============ FEATURED PRODUCTS ============

  async getFeaturedProductsConfig() {
    let config = await this.prisma.featuredProducts.findFirst();

    if (!config) {
      config = await this.prisma.featuredProducts.create({
        data: { autoChoose: true },
      });
    }

    return config;
  }

  async updateFeaturedProductsConfig(dto: UpdateFeaturedProductsDto) {
    let config = await this.prisma.featuredProducts.findFirst();

    if (!config) {
      return this.prisma.featuredProducts.create({
        data: {
          autoChoose: dto.autoChoose,
          selectedProducts: dto.selectedProducts,
        },
      });
    }

    return this.prisma.featuredProducts.update({
      where: { id: config.id },
      data: {
        autoChoose: dto.autoChoose,
        selectedProducts: dto.selectedProducts,
      },
    });
  }

  // ============ SITE PAGES ============

  async getSitePages() {
    return this.prisma.sitePage.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async createSitePage(dto: CreateSitePageDto) {
    const normalizedSlug = this.normalizeSlug(dto.slug);
    await this.assertUniqueSlug(normalizedSlug);

    return this.prisma.sitePage.create({
      data: {
        slug: normalizedSlug,
        titleEn: dto.titleEn.trim(),
        titleAr: dto.titleAr.trim(),
        contentEn: dto.contentEn.trim(),
        contentAr: dto.contentAr.trim(),
        showInFooter: dto.showInFooter ?? true,
        order: dto.order ?? 0,
        status: dto.status ?? true,
      },
    });
  }

  async updateSitePage(id: string, dto: UpdateSitePageDto) {
    const existing = await this.prisma.sitePage.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Site page not found');
    }

    const normalizedSlug = dto.slug ? this.normalizeSlug(dto.slug) : undefined;
    if (normalizedSlug && normalizedSlug !== existing.slug) {
      await this.assertUniqueSlug(normalizedSlug, id);
    }

    return this.prisma.sitePage.update({
      where: { id },
      data: {
        slug: normalizedSlug,
        titleEn: dto.titleEn?.trim(),
        titleAr: dto.titleAr?.trim(),
        contentEn: dto.contentEn?.trim(),
        contentAr: dto.contentAr?.trim(),
        showInFooter: dto.showInFooter,
        order: dto.order,
        status: dto.status,
      },
    });
  }

  async deleteSitePage(id: string): Promise<void> {
    const existing = await this.prisma.sitePage.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Site page not found');
    }

    await this.prisma.sitePage.delete({
      where: { id },
    });
  }

  private normalizeSlug(rawSlug: string): string {
    return rawSlug.trim().toLowerCase();
  }

  private async assertUniqueSlug(slug: string, excludeId?: string) {
    const duplicate = await this.prisma.sitePage.findFirst({
      where: {
        slug,
        ...(excludeId
          ? {
              id: {
                not: excludeId,
              },
            }
          : {}),
      },
      select: { id: true },
    });

    if (duplicate) {
      throw new BadRequestException('A page with this slug already exists');
    }
  }
}

