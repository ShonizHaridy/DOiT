// ============================================
// Service (Fixed Type Safety - No 'any')
// ============================================

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryDto, SubCategoryDto, ProductListDto } from './dto/categories.dto';
import { Prisma } from 'generated/prisma/client';

// Define proper types for nested relations
type ProductListWithDetails = {
  id: string;
  nameEn: string;
  nameAr: string;
};

type SubCategoryWithLists = {
  id: string;
  nameEn: string;
  nameAr: string;
  icon: string | null;
  productLists: ProductListWithDetails[];
};

type CategoryWithRelations = {
  id: string;
  nameEn: string;
  nameAr: string;
  icon: string | null;
  status: boolean;
  subCategories: SubCategoryWithLists[];
};

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async getCategories(includeChildren = false): Promise<CategoryDto[]> {
    if (includeChildren) {
      // Fetch with nested relations
      const categories = await this.prisma.category.findMany({
        where: { status: true },
        include: {
          subCategories: {
            include: {
              productLists: true,
            },
            orderBy: { order: 'asc' },
          },
        },
        orderBy: { order: 'asc' },
      });

      // Type-safe transformation
      return categories.map((cat): CategoryDto => ({
        id: cat.id,
        nameEn: cat.nameEn,
        nameAr: cat.nameAr,
        icon: cat.icon ?? undefined,
        status: cat.status,
        subCategories: cat.subCategories.map((sub): SubCategoryDto => ({
          id: sub.id,
          nameEn: sub.nameEn,
          nameAr: sub.nameAr,
          icon: sub.icon ?? undefined,
          productLists: sub.productLists.map((list): ProductListDto => ({
            id: list.id,
            nameEn: list.nameEn,
            nameAr: list.nameAr,
          })),
        })),
      }));
    } else {
      // Fetch without relations
      const categories = await this.prisma.category.findMany({
        where: { status: true },
        orderBy: { order: 'asc' },
      });

      return categories.map((cat): CategoryDto => ({
        id: cat.id,
        nameEn: cat.nameEn,
        nameAr: cat.nameAr,
        icon: cat.icon ?? undefined,
        status: cat.status,
      }));
    }
  }

  async getCategoryById(id: string): Promise<CategoryDto> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        subCategories: {
          include: {
            productLists: true,
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!category) {
      throw new Error('Category not found');
    }

    return {
      id: category.id,
      nameEn: category.nameEn,
      nameAr: category.nameAr,
      icon: category.icon ?? undefined,
      status: category.status,
      subCategories: category.subCategories.map((sub): SubCategoryDto => ({
        id: sub.id,
        nameEn: sub.nameEn,
        nameAr: sub.nameAr,
        icon: sub.icon ?? undefined,
        productLists: sub.productLists.map((list): ProductListDto => ({
          id: list.id,
          nameEn: list.nameEn,
          nameAr: list.nameAr,
        })),
      })),
    };
  }

  async getFilterOptions() {
    const [brands, types, genders, colors, sizes] = await Promise.all([
      this.prisma.product.findMany({
        where: { status: 'PUBLISHED' },
        select: { vendor: true },
        distinct: ['vendor'],
      }),
      this.prisma.product.findMany({
        where: { status: 'PUBLISHED' },
        select: { type: true },
        distinct: ['type'],
      }),
      this.prisma.product.findMany({
        where: { status: 'PUBLISHED' },
        select: { gender: true },
        distinct: ['gender'],
      }),
      this.prisma.productVariant.findMany({
        select: { color: true },
        distinct: ['color'],
      }),
      this.prisma.productVariant.findMany({
        select: { size: true },
        distinct: ['size'],
      }),
    ]);

    return {
      brands: brands.map((b) => b.vendor).sort(),
      types: types.map((t) => t.type).sort(),
      genders: genders.map((g) => g.gender).sort(),
      colors: colors.map((c) => c.color).sort(),
      sizes: sizes.map((s) => s.size).sort(),
    };
  }
}