// ============================================
// Service
// ============================================

import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WishlistItemDto, AddToWishlistDto } from './dto/wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async getWishlist(customerId: string): Promise<WishlistItemDto[]> {
    const items = await this.prisma.wishlistItem.findMany({
      where: { customerId },
      include: {
        product: {
          include: {
            images: {
              orderBy: { order: 'asc' },
              take: 1,
            },
            variants: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return items.map((item) => {
      const totalStock = item.product.variants.reduce((sum, v) => sum + v.quantity, 0);
      let availability: string;
      if (totalStock === 0) availability = 'out-of-stock';
      else if (totalStock <= 10) availability = 'low-stock';
      else availability = 'in-stock';

      const finalPrice =
        Number(item.product.basePrice) * (1 - item.product.discountPercentage / 100);

      return {
        id: item.id,
        productId: item.productId,
        product: {
          id: item.product.id,
          nameEn: item.product.nameEn,
          nameAr: item.product.nameAr,
          basePrice: Number(item.product.basePrice),
          discountPercentage: item.product.discountPercentage,
          finalPrice,
          images: item.product.images.map((img) => img.url),
          vendor: item.product.vendor,
          availability,
        },
        createdAt: item.createdAt,
      };
    });
  }

  async addToWishlist(customerId: string, dto: AddToWishlistDto): Promise<WishlistItemDto> {
    const { productId } = dto;

    // Check if product exists
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || product.status !== 'PUBLISHED') {
      throw new NotFoundException('Product not found');
    }

    // Check if already in wishlist
    const existing = await this.prisma.wishlistItem.findUnique({
      where: {
        customerId_productId: {
          customerId,
          productId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Product already in wishlist');
    }

    // Add to wishlist
    await this.prisma.wishlistItem.create({
      data: {
        customerId,
        productId,
      },
    });

    // Return updated wishlist item
    const items = await this.getWishlist(customerId);
    return items.find((item) => item.productId === productId)!;
  }

  async removeFromWishlist(customerId: string, productId: string): Promise<void> {
    const item = await this.prisma.wishlistItem.findUnique({
      where: {
        customerId_productId: {
          customerId,
          productId,
        },
      },
    });

    if (!item) {
      throw new NotFoundException('Item not found in wishlist');
    }

    await this.prisma.wishlistItem.delete({
      where: { id: item.id },
    });
  }

  async clearWishlist(customerId: string): Promise<void> {
    await this.prisma.wishlistItem.deleteMany({
      where: { customerId },
    });
  }
}

