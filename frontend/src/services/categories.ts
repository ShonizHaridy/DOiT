import { apiClient } from '@/lib/axios-client';
import type {
  Category,
  CreateCategoryRequest,
  CreateProductListRequest,
  CreateSubCategoryRequest,
  SubCategory,
  UpdateCategoryRequest,
  UpdateProductListRequest,
  UpdateSubCategoryRequest,
  ProductListItem,
} from '@/types/category';

export const getCategories = async (
  includeChildren: boolean = false
): Promise<Category[]> => {
  const { data } = await apiClient.get<Category[]>('/categories', {
    params: { includeChildren: includeChildren.toString() },
  });
  return data;
};

export const getCategory = async (id: string): Promise<Category> => {
  const { data } = await apiClient.get<Category>(`/categories/${id}`);
  return data;
};

export const getFilterOptions = async (): Promise<{
  brands: string[];
  types: string[];
  genders: string[];
  colors: string[];
  sizes: string[];
}> => {
  const { data } = await apiClient.get('/categories/filters');
  return data;
};

// ... existing customer operations

// ============================================
// ADMIN OPERATIONS
// ============================================

export const getAdminCategories = async (): Promise<Category[]> => {
  const { data } = await apiClient.get<Category[]>('/admin/categories');
  return data;
};

export const getAdminCategory = async (id: string): Promise<Category> => {
  const { data } = await apiClient.get<Category>(`/admin/categories/${id}`);
  return data;
};

export const createCategory = async (data: CreateCategoryRequest): Promise<Category> => {
  const response = await apiClient.post<Category>('/admin/categories', data);
  return response.data;
};

export const updateCategory = async (
  id: string,
  data: UpdateCategoryRequest
): Promise<Category> => {
  const response = await apiClient.put<Category>(`/admin/categories/${id}`, data);
  return response.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await apiClient.delete(`/admin/categories/${id}`);
};

export const reorderCategories = async (
  orders: { id: string; order: number }[]
): Promise<void> => {
  await apiClient.patch('/admin/categories/reorder', { orders });
};

export const createSubCategory = async (
  categoryId: string,
  data: CreateSubCategoryRequest
): Promise<SubCategory> => {
  const response = await apiClient.post<SubCategory>(
    '/admin/categories/subcategories',
    { ...data, categoryId }
  );
  return response.data;
};

export const updateSubCategory = async (
  id: string,
  data: UpdateSubCategoryRequest
): Promise<SubCategory> => {
  const response = await apiClient.put<SubCategory>(
    `/admin/categories/subcategories/${id}`,
    data
  );
  return response.data;
};

export const deleteSubCategory = async (id: string): Promise<void> => {
  await apiClient.delete(`/admin/categories/subcategories/${id}`);
};

export const createProductList = async (
  subCategoryId: string,
  data: CreateProductListRequest
): Promise<ProductListItem> => {
  const response = await apiClient.post<ProductListItem>(
    '/admin/categories/product-lists',
    { ...data, subCategoryId }
  );
  return response.data;
};

export const updateProductList = async (
  id: string,
  data: UpdateProductListRequest
): Promise<ProductListItem> => {
  const response = await apiClient.put<ProductListItem>(
    `/admin/categories/product-lists/${id}`,
    data
  );
  return response.data;
};

export const deleteProductList = async (id: string): Promise<void> => {
  await apiClient.delete(`/admin/categories/product-lists/${id}`);
};
