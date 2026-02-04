import { apiClient } from '@/lib/axios-client';
import { ProductList } from '@/lib/schemas/admin';
import type { Category, CreateCategoryRequest, CreateProductListRequest, CreateSubCategoryRequest, SubCategory, UpdateCategoryRequest, UpdateProductListRequest, UpdateSubCategoryRequest } from '@/types/category';

export const getCategories = async (
  includeChildren: boolean = false
): Promise<Category[]> => {
  const { data } = await apiClient.get<Category[]>('/api/categories', {
    params: { includeChildren: includeChildren.toString() },
  });
  return data;
};

export const getCategory = async (id: string): Promise<Category> => {
  const { data } = await apiClient.get<Category>(`/api/categories/${id}`);
  return data;
};

export const getFilterOptions = async (): Promise<{
  brands: string[];
  types: string[];
  genders: string[];
  colors: string[];
  sizes: string[];
}> => {
  const { data } = await apiClient.get('/api/categories/filters');
  return data;
};

// ... existing customer operations

// ============================================
// ADMIN OPERATIONS
// ============================================

export const createCategory = async (data: CreateCategoryRequest): Promise<Category> => {
  const response = await apiClient.post<Category>('/api/admin/categories', data);
  return response.data;
};

export const updateCategory = async (
  id: string,
  data: UpdateCategoryRequest
): Promise<Category> => {
  const response = await apiClient.put<Category>(`/api/admin/categories/${id}`, data);
  return response.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/admin/categories/${id}`);
};

export const reorderCategories = async (
  orders: { id: string; order: number }[]
): Promise<void> => {
  await apiClient.patch('/api/admin/categories/reorder', { orders });
};

export const createSubCategory = async (
  categoryId: string,
  data: CreateSubCategoryRequest
): Promise<SubCategory> => {
  const response = await apiClient.post<SubCategory>(
    `/api/admin/categories/${categoryId}/sub-categories`,
    data
  );
  return response.data;
};

export const updateSubCategory = async (
  id: string,
  data: UpdateSubCategoryRequest
): Promise<SubCategory> => {
  const response = await apiClient.put<SubCategory>(
    `/api/admin/sub-categories/${id}`,
    data
  );
  return response.data;
};

export const deleteSubCategory = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/admin/sub-categories/${id}`);
};

export const createProductList = async (
  subCategoryId: string,
  data: CreateProductListRequest
): Promise<ProductList> => {
  const response = await apiClient.post<ProductList>(
    `/api/admin/sub-categories/${subCategoryId}/product-lists`,
    data
  );
  return response.data;
};

export const updateProductList = async (
  id: string,
  data: UpdateProductListRequest
): Promise<ProductList> => {
  const response = await apiClient.put<ProductList>(
    `/api/admin/product-lists/${id}`,
    data
  );
  return response.data;
};

export const deleteProductList = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/admin/product-lists/${id}`);
};