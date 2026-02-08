// ============================================
// Service
// ============================================

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto, CreateSubCategoryDto, UpdateSubCategoryDto, CreateProductListDto, UpdateProductListDto, AdminCategoryDto } from './dto/admin-categories.dto';

@Injectable()
export class AdminCategoriesService {
  constructor(private prisma: PrismaService) {}

  // ============ CATEGORIES ============

  async createCategory(dto: CreateCategoryDto) {
    const category = await this.prisma.category.create({
      data: {
        nameEn: dto.nameEn,
        nameAr: dto.nameAr,
        icon: dto.icon,
        status: dto.status ?? true,
        order: dto.order ?? 0,
      },
      include: {
        subCategories: {
          include: {
            productLists: {
              include: {
                products: true,
              },
            },
          },
        },
      },
    });

    return this.transformCategory(category);
  }

  async updateCategory(id: string, dto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const updated = await this.prisma.category.update({
      where: { id },
      data: {
        nameEn: dto.nameEn,
        nameAr: dto.nameAr,
        icon: dto.icon,
        status: dto.status,
        order: dto.order,
      },
      include: {
        subCategories: {
          include: {
            productLists: {
              include: {
                products: true,
              },
            },
          },
        },
      },
    });

    return this.transformCategory(updated);
  }

  async deleteCategory(id: string): Promise<void> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        subCategories: {
          include: {
            productLists: {
              include: {
                products: true,
              },
            },
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Check if category has products
    const hasProducts = category.subCategories.some((sub) =>
      sub.productLists.some((list) => list.products.length > 0),
    );

    if (hasProducts) {
      throw new ConflictException('Cannot delete category with existing products');
    }

    await this.prisma.category.delete({ where: { id } });
  }

  async getCategories() {
    const categories = await this.prisma.category.findMany({
      include: {
        subCategories: {
          include: {
            productLists: {
              include: {
                products: true,
              },
            },
          },
        },
      },
      orderBy: { order: 'asc' },
    });

    return categories.map((cat) => this.transformCategory(cat));
  }

  async getCategoryById(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        subCategories: {
          include: {
            productLists: {
              include: {
                products: true,
              },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  // ============ SUBCATEGORIES ============

  async createSubCategory(dto: CreateSubCategoryDto) {
    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.prisma.subCategory.create({
      data: {
        categoryId: dto.categoryId,
        nameEn: dto.nameEn,
        nameAr: dto.nameAr,
        icon: dto.icon,
        order: dto.order ?? 0,
      },
      include: {
        category: true,
        productLists: true,
      },
    });
  }

  async updateSubCategory(id: string, dto: UpdateSubCategoryDto) {
    const subCategory = await this.prisma.subCategory.findUnique({
      where: { id },
    });

    if (!subCategory) {
      throw new NotFoundException('SubCategory not found');
    }

    return this.prisma.subCategory.update({
      where: { id },
      data: {
        nameEn: dto.nameEn,
        nameAr: dto.nameAr,
        icon: dto.icon,
        order: dto.order,
      },
      include: {
        category: true,
        productLists: true,
      },
    });
  }

  async deleteSubCategory(id: string): Promise<void> {
    const subCategory = await this.prisma.subCategory.findUnique({
      where: { id },
      include: {
        productLists: {
          include: {
            products: true,
          },
        },
      },
    });

    if (!subCategory) {
      throw new NotFoundException('SubCategory not found');
    }

    const hasProducts = subCategory.productLists.some((list) => list.products.length > 0);

    if (hasProducts) {
      throw new ConflictException('Cannot delete subcategory with existing products');
    }

    await this.prisma.subCategory.delete({ where: { id } });
  }

  // ============ PRODUCT LISTS ============

  async createProductList(dto: CreateProductListDto) {
    const subCategory = await this.prisma.subCategory.findUnique({
      where: { id: dto.subCategoryId },
    });

    if (!subCategory) {
      throw new NotFoundException('SubCategory not found');
    }

    return this.prisma.productList.create({
      data: {
        subCategoryId: dto.subCategoryId,
        nameEn: dto.nameEn,
        nameAr: dto.nameAr,
        order: dto.order ?? 0,
      },
      include: {
        subCategory: {
          include: {
            category: true,
          },
        },
        products: true,
      },
    });
  }

  async updateProductList(id: string, dto: UpdateProductListDto) {
    const productList = await this.prisma.productList.findUnique({
      where: { id },
    });

    if (!productList) {
      throw new NotFoundException('ProductList not found');
    }

    return this.prisma.productList.update({
      where: { id },
      data: {
        nameEn: dto.nameEn,
        nameAr: dto.nameAr,
        order: dto.order,
      },
      include: {
        subCategory: {
          include: {
            category: true,
          },
        },
        products: true,
      },
    });
  }

  async deleteProductList(id: string): Promise<void> {
    const productList = await this.prisma.productList.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });

    if (!productList) {
      throw new NotFoundException('ProductList not found');
    }

    if (productList.products.length > 0) {
      throw new ConflictException('Cannot delete product list with existing products');
    }

    await this.prisma.productList.delete({ where: { id } });
  }

  // ============ HELPERS ============

  private transformCategory(category: any): AdminCategoryDto {
    const totalProducts = category.subCategories.reduce(
      (sum, sub) =>
        sum + sub.productLists.reduce((s, list) => s + list.products.length, 0),
      0,
    );

    return {
      id: category.id,
      nameEn: category.nameEn,
      nameAr: category.nameAr,
      icon: category.icon,
      status: category.status,
      order: category.order,
      totalSubCategories: category.subCategories.length,
      totalProducts,
      createdAt: category.createdAt,
    };
  }
}

