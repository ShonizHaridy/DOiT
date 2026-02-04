// ============================================
// DTOs
// ============================================

export class CategoryDto {
  id: string;
  nameEn: string;
  nameAr: string;
  icon?: string;
  status: boolean;
  subCategories?: SubCategoryDto[];
}

export class SubCategoryDto {
  id: string;
  nameEn: string;
  nameAr: string;
  icon?: string;
  productLists?: ProductListDto[];
}

export class ProductListDto {
  id: string;
  nameEn: string;
  nameAr: string;
}

