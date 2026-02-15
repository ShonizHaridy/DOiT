// Matching ProductResponseDto and GetProductsQueryDto from backend

export type SortBy =
  | 'featured'
  | 'best-selling'
  | 'a-z'
  | 'z-a'
  | 'price-low'
  | 'price-high'
  | 'date-old'
  | 'date-new';

export type Availability = 'in-stock' | 'low-stock' | 'out-of-stock';
export type AdminAvailability = 'In Stock' | 'Low Stock' | 'Out of Stock';
export type ProductStatus = 'PUBLISHED' | 'UNPUBLISHED' | 'DRAFT';

// Query params for GET /api/products
export interface ProductFilters {
  page?: number;
  limit?: number;
  sortBy?: SortBy;
  category?: string;
  subCategory?: string;
  productList?: string;
  vendor?: string;
  gender?: string;
  type?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  colors?: string; // comma-separated
  sizes?: string; // comma-separated
  availability?: string;
}

// Response from backend
export interface Product {
  id: string;
  sku: string;
  productListId?: string;
  nameEn: string;
  nameAr: string;
  descriptionEn?: string;
  descriptionAr?: string;
  detailsEn?: string[];
  detailsAr?: string[];
  basePrice: number;
  discountPercentage: number;
  finalPrice: number;
  vendor: string;
  gender: string;
  type: string;
  status: ProductStatus | string;
  sizeChartUrl?: string;
  images: Array<{
    id: string;
    url: string;
    order: number;
  }>;
  colors: string[];
  sizes: string[];
  availability: Availability;
  totalStock: number;
  viewCount: number;
  createdAt: Date;
  category?: {
    id: string;
    nameEn: string;
    nameAr: string;
  };
  subCategory?: {
    id: string;
    nameEn: string;
    nameAr: string;
  };
  productList?: {
    id: string;
    nameEn: string;
    nameAr: string;
  };
  variants?: ProductVariant[];
  updatedAt?: string;
}

export interface PaginatedProducts {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ... existing types

// ============================================
// ADMIN TYPES
// ============================================

export interface ProductVariant {
  id?: string;
  color: string;
  size: string;
  quantity: number;
}

export interface AdminProductListItem {
  id: string;
  sku: string;
  nameEn: string;
  nameAr: string;
  basePrice: number;
  discountPercentage: number;
  vendor: string;
  type: string;
  status: ProductStatus;
  totalStock: number;
  availability: AdminAvailability;
  viewCount: number;
  totalOrders: number;
  createdAt: string;
  image?: string;
  imageUrl?: string;
  images?: Array<
    | string
    | {
        id?: string;
        url: string;
        order?: number;
      }
  >;
  category?: string;
  subCategory?: string;
  productList?: string;
}

export interface AdminProductsResponse {
  products: AdminProductListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateProductRequest {
  // English fields
  nameEn: string;
  descriptionEn: string;
  detailsEn?: string[];
  
  // Arabic fields
  nameAr: string;
  descriptionAr: string;
  detailsAr?: string[];
  
  // Product details
  sku: string;
  quantity: number;
  basePrice: number;
  discountPercentage: number;
  vendor: string;
  gender: 'MEN' | 'WOMEN' | 'KIDS' | 'UNISEX';
  type: string;
  status: ProductStatus;
  
  // Category relations
  productListId: string;
  
  // Optional
  sizeChartUrl?: string;
  
  // Images (URLs)
  imageUrls: string[];
  
  // Variants
  variants: ProductVariant[];
}

export interface UpdateProductRequest {
  nameEn?: string;
  descriptionEn?: string;
  detailsEn?: string[];
  nameAr?: string;
  descriptionAr?: string;
  detailsAr?: string[];
  sku?: string;
  quantity?: number;
  basePrice?: number;
  discountPercentage?: number;
  vendor?: string;
  gender?: 'MEN' | 'WOMEN' | 'KIDS' | 'UNISEX';
  type?: string;
  status?: ProductStatus;
  productListId?: string;
  sizeChartUrl?: string;
  imageUrls?: string[];
  variants?: ProductVariant[];
}




