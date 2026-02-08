// ============================================
// Service
// ============================================

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto, AdminProductDto, UpdateProductDto, PaginatedAdminProductsDto } from './dto/admin-products.dto';

@Injectable()
export class AdminProductsService {
  constructor(private prisma: PrismaService) {}

  async createProduct(dto: CreateProductDto): Promise<AdminProductDto> {
    // Check if SKU already exists
    const existingSku = await this.prisma.product.findUnique({
      where: { sku: dto.sku },
    });

    if (existingSku) {
      throw new ConflictException('SKU already exists');
    }

    // Verify product list exists
    const productList = await this.prisma.productList.findUnique({
      where: { id: dto.productListId },
    });

    if (!productList) {
      throw new NotFoundException('Product list not found');
    }

    // Create product with images and variants
    const product = await this.prisma.product.create({
      data: {
        productListId: dto.productListId,
        sku: dto.sku,
        nameEn: dto.nameEn,
        nameAr: dto.nameAr,
        descriptionEn: dto.descriptionEn,
        descriptionAr: dto.descriptionAr,
        detailsEn: dto.detailsEn,
        detailsAr: dto.detailsAr,
        basePrice: dto.basePrice,
        discountPercentage: dto.discountPercentage,
        vendor: dto.vendor,
        gender: dto.gender,
        type: dto.type,
        status: dto.status,
        sizeChartUrl: dto.sizeChartUrl,
        images: {
          create: dto.imageUrls.map((url, index) => ({
            url,
            order: index,
          })),
        },
        variants: {
          create: dto.variants.map((variant) => ({
            color: variant.color,
            size: variant.size,
            quantity: variant.quantity,
          })),
        },
      },
      include: {
        images: true,
        variants: true,
        productList: {
          include: {
            subCategory: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    return this.transformAdminProduct(product);
  }

  async updateProduct(id: string, dto: UpdateProductDto): Promise<AdminProductDto> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Update product in transaction
    const updated = await this.prisma.$transaction(async (tx) => {
      // Update basic product info
      const updatedProduct = await tx.product.update({
        where: { id },
        data: {
          productListId: dto.productListId,
          nameEn: dto.nameEn,
          nameAr: dto.nameAr,
          descriptionEn: dto.descriptionEn,
          descriptionAr: dto.descriptionAr,
          detailsEn: dto.detailsEn,
          detailsAr: dto.detailsAr,
          basePrice: dto.basePrice,
          discountPercentage: dto.discountPercentage,
          vendor: dto.vendor,
          gender: dto.gender,
          type: dto.type,
          status: dto.status,
          sizeChartUrl: dto.sizeChartUrl,
        },
      });

      // Update images if provided
      if (dto.imageUrls) {
        await tx.productImage.deleteMany({ where: { productId: id } });
        await tx.productImage.createMany({
          data: dto.imageUrls.map((url, index) => ({
            productId: id,
            url,
            order: index,
          })),
        });
      }

      // Update variants if provided
      if (dto.variants) {
        await tx.productVariant.deleteMany({ where: { productId: id } });
        await tx.productVariant.createMany({
          data: dto.variants.map((variant) => ({
            productId: id,
            color: variant.color,
            size: variant.size,
            quantity: variant.quantity,
          })),
        });
      }

      return tx.product.findUnique({
        where: { id },
        include: {
          images: true,
          variants: true,
          productList: {
            include: {
              subCategory: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      });
    });

    return this.transformAdminProduct(updated);
  }

  async deleteProduct(id: string): Promise<void> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        orderItems: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Don't allow deletion if product has orders
    if (product.orderItems.length > 0) {
      throw new ConflictException(
        'Cannot delete product with existing orders. Set status to UNPUBLISHED instead.',
      );
    }

    await this.prisma.product.delete({ where: { id } });
  }

  async getProducts(
    page = 1,
    limit = 20,
    search?: string,
    status?: string,
    category?: string,
  ): Promise<PaginatedAdminProductsDto> {
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { nameEn: { contains: search, mode: 'insensitive' } },
        { nameAr: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { vendor: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (category) {
      where.productList = {
        subCategory: {
          categoryId: category,
        },
      };
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          images: { take: 1, orderBy: { order: 'asc' } },
          variants: true,
          orderItems: true,
          productList: {
            include: {
              subCategory: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      products: products.map((p) => this.transformAdminProduct(p)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getProductById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { order: 'asc' } },
        variants: true,
        productList: {
          include: {
            subCategory: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  private transformAdminProduct(product: any): AdminProductDto {
    const totalStock = product.variants.reduce((sum, v) => sum + v.quantity, 0);
    let availability: string;
    if (totalStock === 0) availability = 'Out of Stock';
    else if (totalStock <= 10) availability = 'Low Stock';
    else availability = 'In Stock';

    return {
      id: product.id,
      sku: product.sku,
      nameEn: product.nameEn,
      nameAr: product.nameAr,
      basePrice: Number(product.basePrice),
      discountPercentage: product.discountPercentage,
      vendor: product.vendor,
      type: product.type,
      status: product.status,
      totalStock,
      availability,
      viewCount: product.viewCount,
      totalOrders: product.orderItems?.length || 0,
      createdAt: product.createdAt,
      category: product.productList?.subCategory?.category?.nameEn,
      subCategory: product.productList?.subCategory?.nameEn,
      productList: product.productList?.nameEn,
    };
  }
}

