import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetProductsQueryDto, SortBy, ProductResponseDto, PaginatedProductsDto } from './dto/product.dto';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async getProducts(query: GetProductsQueryDto): Promise<PaginatedProductsDto> {
    const {
      page = 1,
      limit = 20,
      sortBy = SortBy.FEATURED,
      category,
      subCategory,
      productList,
      vendor,
      gender,
      type,
      search,
      minPrice,
      maxPrice,
      colors,
      sizes,
      availability,
    } = query;

    // Build where clause
    const where: Prisma.ProductWhereInput = {
      status: 'PUBLISHED',
    };

    // Category filters (hierarchical)
    if (productList) {
      where.productListId = productList;
    } else if (subCategory) {
      where.productList = {
        subCategoryId: subCategory,
      };
    } else if (category) {
      where.productList = {
        subCategory: {
          categoryId: category,
        },
      };
    }

    // Other filters
    if (vendor) where.vendor = vendor;
    if (gender) where.gender = gender as any;
    if (type) where.type = type;

    if (search) {
      where.OR = [
        { nameEn: { contains: search, mode: 'insensitive' } },
        { nameAr: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.basePrice = {};
      if (minPrice !== undefined) where.basePrice.gte = minPrice;
      if (maxPrice !== undefined) where.basePrice.lte = maxPrice;
    }

    if (colors) {
      const colorArray = colors.split(',');
      where.variants = {
        some: {
          color: { in: colorArray },
        },
      };
    }

    if (sizes) {
      const sizeArray = sizes.split(',');
      where.variants = {
        some: {
          size: { in: sizeArray },
        },
      };
    }

    // Availability filter
    if (availability) {
      const variantsFilter = this.getAvailabilityFilter(availability);
      if (variantsFilter) {
        where.variants = {
          ...(where.variants || {}),
          some: variantsFilter,
        };
      }
    }

    // Build order by clause
    const orderBy = this.getOrderBy(sortBy);

    // Execute query with pagination
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          images: {
            orderBy: { order: 'asc' },
          },
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
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    // Transform products
    const transformedProducts = products.map((product) => this.transformProduct(product));

    return {
      products: transformedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getProductById(id: string): Promise<ProductResponseDto> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
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

    if (!product || product.status !== 'PUBLISHED') {
      throw new NotFoundException('Product not found');
    }

    // Increment view count
    await this.prisma.product.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return this.transformProduct(product);
  }

  async getFeaturedProducts(): Promise<ProductResponseDto[]> {
    // Check if auto-choose is enabled
    const featuredConfig = await this.prisma.featuredProducts.findFirst();

    let products;

    if (featuredConfig?.autoChoose) {
      // Get most viewed products
      products = await this.prisma.product.findMany({
        where: { status: 'PUBLISHED' },
        include: {
          images: { orderBy: { order: 'asc' } },
          variants: true,
          productList: {
            include: {
              subCategory: {
                include: { category: true },
              },
            },
          },
        },
        orderBy: { viewCount: 'desc' },
        take: 9,
      });
    } else if (featuredConfig?.selectedProducts) {
      // Get manually selected products
      const productIds = featuredConfig.selectedProducts as string[];
      
      products = await this.prisma.product.findMany({
        where: {
          id: { in: productIds },
          status: 'PUBLISHED',
        },
        include: {
          images: { orderBy: { order: 'asc' } },
          variants: true,
          productList: {
            include: {
              subCategory: {
                include: { category: true },
              },
            },
          },
        },
      });
    } else {
      // Default: get latest products
      products = await this.prisma.product.findMany({
        where: { status: 'PUBLISHED' },
        include: {
          images: { orderBy: { order: 'asc' } },
          variants: true,
          productList: {
            include: {
              subCategory: {
                include: { category: true },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 9,
      });
    }

    return products.map((product) => this.transformProduct(product));
  }

  // ============================================
  // HELPER METHODS
  // ============================================

  private transformProduct(product: any): ProductResponseDto {
    const totalStock = product.variants.reduce((sum, v) => sum + v.quantity, 0);
    
    let availability: 'in-stock' | 'low-stock' | 'out-of-stock';
    if (totalStock === 0) {
      availability = 'out-of-stock';
    } else if (totalStock <= 10) {
      availability = 'low-stock';
    } else {
      availability = 'in-stock';
    }

    const finalPrice = Number(product.basePrice) * (1 - product.discountPercentage / 100);

    // Get unique colors and sizes
    const colors = [...new Set(product.variants.map((v) => v.color))] as string[];
    const sizes = [...new Set(product.variants.map((v) => v.size))] as string[];

    return {
      id: product.id,
      sku: product.sku,
      nameEn: product.nameEn,
      nameAr: product.nameAr,
      descriptionEn: product.descriptionEn,
      descriptionAr: product.descriptionAr,
      detailsEn: product.detailsEn ? (product.detailsEn as string[]) : undefined,
      detailsAr: product.detailsAr ? (product.detailsAr as string[]) : undefined,
      basePrice: Number(product.basePrice),
      discountPercentage: product.discountPercentage,
      finalPrice,
      vendor: product.vendor,
      gender: product.gender,
      type: product.type,
      status: product.status,
      sizeChartUrl: product.sizeChartUrl,
      images: product.images.map((img) => ({
        id: img.id,
        url: img.url,
        order: img.order,
      })),
      colors,
      sizes,
      availability,
      totalStock,
      viewCount: product.viewCount,
      createdAt: product.createdAt,
      category: product.productList?.subCategory?.category
        ? {
            id: product.productList.subCategory.category.id,
            nameEn: product.productList.subCategory.category.nameEn,
            nameAr: product.productList.subCategory.category.nameAr,
          }
        : undefined,
      subCategory: product.productList?.subCategory
        ? {
            id: product.productList.subCategory.id,
            nameEn: product.productList.subCategory.nameEn,
            nameAr: product.productList.subCategory.nameAr,
          }
        : undefined,
      productList: product.productList
        ? {
            id: product.productList.id,
            nameEn: product.productList.nameEn,
            nameAr: product.productList.nameAr,
          }
        : undefined,
    };
  }

  private getOrderBy(sortBy: SortBy): Prisma.ProductOrderByWithRelationInput {
    const orderByMap: Record<SortBy, Prisma.ProductOrderByWithRelationInput> = {
      [SortBy.FEATURED]: { viewCount: 'desc' },
      [SortBy.BEST_SELLING]: { orderItems: { _count: 'desc' } },
      [SortBy.A_Z]: { nameEn: 'asc' },
      [SortBy.Z_A]: { nameEn: 'desc' },
      [SortBy.PRICE_LOW]: { basePrice: 'asc' },
      [SortBy.PRICE_HIGH]: { basePrice: 'desc' },
      [SortBy.DATE_OLD]: { createdAt: 'asc' },
      [SortBy.DATE_NEW]: { createdAt: 'desc' },
    };

    return orderByMap[sortBy] || orderByMap[SortBy.FEATURED];
  }

  private getAvailabilityFilter(availability: string): Prisma.ProductVariantWhereInput | null {
    switch (availability) {
      case 'in-stock':
        return { quantity: { gt: 10 } };
      case 'low-stock':
        return { quantity: { gt: 0, lte: 10 } };
      case 'out-of-stock':
        return { quantity: 0 };
      default:
        return null;
    }
  }
}