export interface ProductListItem {
  id: string;
  nameEn: string;
  nameAr: string;
}

export interface SubCategory {
  id: string;
  nameEn: string;
  nameAr: string;
  icon?: string;
  productLists?: ProductListItem[];
}

export interface Category {
  id: string;
  nameEn: string;
  nameAr: string;
  icon?: string;
  status: boolean;
  subCategories?: SubCategory[];
}

// ... existing types

// ============================================
// ADMIN REQUEST TYPES
// ============================================

export interface CreateCategoryRequest {
  nameEn: string;
  nameAr: string;
  icon?: string;
  order?: number;
  status?: boolean;
}

export interface UpdateCategoryRequest {
  nameEn?: string;
  nameAr?: string;
  icon?: string;
  order?: number;
  status?: boolean;
}

export interface CreateSubCategoryRequest {
  nameEn: string;
  nameAr: string;
  icon?: string;
  order?: number;
}

export interface UpdateSubCategoryRequest {
  nameEn?: string;
  nameAr?: string;
  icon?: string;
  order?: number;
}

export interface CreateProductListRequest {
  nameEn: string;
  nameAr: string;
  order?: number;
}

export interface UpdateProductListRequest {
  nameEn?: string;
  nameAr?: string;
  order?: number;
}