import { apiClient } from '@/lib/axios-client';
import { ProductVariant } from '@/lib/schemas/admin';
import type {
  Product,
  PaginatedProducts,
  ProductFilters,
  CreateProductRequest,
  UpdateProductRequest,
} from '@/types/product';

export const getProducts = async (
  filters?: ProductFilters
): Promise<PaginatedProducts> => {
  const { data } = await apiClient.get<PaginatedProducts>('/api/products', {
    params: filters,
  });
  return data;
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
  const { data } = await apiClient.get<Product[]>('/api/products/featured');
  return data;
};

export const getProduct = async (id: string): Promise<Product> => {
  const { data } = await apiClient.get<Product>(`/api/products/${id}`);
  return data;
};

// ... existing customer operations (getProducts, getFeaturedProducts, getProduct)

// ============================================
// ADMIN OPERATIONS
// ============================================

export const createProduct = async (data: CreateProductRequest): Promise<Product> => {
  const response = await apiClient.post<Product>('/api/admin/products', data);
  return response.data;
};

export const updateProduct = async (
  id: string,
  data: UpdateProductRequest
): Promise<Product> => {
  const response = await apiClient.put<Product>(`/api/admin/products/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/admin/products/${id}`);
};

export const toggleProductStatus = async (
  id: string,
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'
): Promise<Product> => {
  const response = await apiClient.patch<Product>(
    `/api/admin/products/${id}/status`,
    { status }
  );
  return response.data;
};

export const uploadProductImage = async (
  productId: string,
  formData: FormData
): Promise<{ url: string }> => {
  const response = await apiClient.post<{ url: string }>(
    `/api/admin/products/${productId}/images`,
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
  await apiClient.delete(`/api/admin/products/${productId}/images/${imageId}`);
};

export const updateProductVariants = async (
  productId: string,
  variants: ProductVariant[]
): Promise<Product> => {
  const response = await apiClient.put<Product>(
    `/api/admin/products/${productId}/variants`,
    { variants }
  );
  return response.data;
};