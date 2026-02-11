import { apiClient } from '@/lib/axios-client';
import type {
  Product,
  AdminProductsResponse,
  PaginatedProducts,
  ProductFilters,
  CreateProductRequest,
  UpdateProductRequest,
  ProductStatus,
  ProductVariant,
} from '@/types/product';

export const getProducts = async (
  filters?: ProductFilters
): Promise<PaginatedProducts> => {
  const { data } = await apiClient.get<PaginatedProducts>('/products', {
    params: filters,
  });
  return data;
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
  const { data } = await apiClient.get<Product[]>('/products/featured');
  return data;
};

export const getProduct = async (id: string): Promise<Product> => {
  const { data } = await apiClient.get<Product>(`/products/${id}`);
  return data;
};

// ... existing customer operations (getProducts, getFeaturedProducts, getProduct)

// ============================================
// ADMIN OPERATIONS
// ============================================

export const getAdminProducts = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: ProductStatus;
  category?: string;
}): Promise<AdminProductsResponse> => {
  const { data } = await apiClient.get<AdminProductsResponse>('/admin/products', {
    params,
  });
  return data;
};

export const getAdminProduct = async (id: string): Promise<Product> => {
  const { data } = await apiClient.get<Product>(`/admin/products/${id}`);
  return data;
};

export const createProduct = async (data: CreateProductRequest): Promise<Product> => {
  const response = await apiClient.post<Product>('/admin/products', data);
  return response.data;
};

export const updateProduct = async (
  id: string,
  data: UpdateProductRequest
): Promise<Product> => {
  const response = await apiClient.put<Product>(`/admin/products/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await apiClient.delete(`/admin/products/${id}`);
};

export const toggleProductStatus = async (
  id: string,
  status: ProductStatus
): Promise<Product> => {
  const response = await apiClient.patch<Product>(
    `/admin/products/${id}/status`,
    { status }
  );
  return response.data;
};

export const uploadProductImage = async (
  _productId: string,
  formData: FormData
): Promise<{ url: string }> => {
  const response = await apiClient.post<{ url: string }>(
    '/upload/product-image',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );
  return response.data;
};

export const deleteProductImage = async (
  productId: string,
  imageId: string
): Promise<void> => {
  await apiClient.delete(`/admin/products/${productId}/images/${imageId}`);
};

export const updateProductVariants = async (
  productId: string,
  variants: ProductVariant[]
): Promise<Product> => {
  const response = await apiClient.put<Product>(
    `/admin/products/${productId}/variants`,
    { variants }
  );
  return response.data;
};
