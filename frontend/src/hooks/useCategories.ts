import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as categoriesService from '@/services/categories';
import type {
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CreateSubCategoryRequest,
  UpdateSubCategoryRequest,
  CreateProductListRequest,
  UpdateProductListRequest,
} from '@/types/category';

export const useCategories = (includeChildren: boolean = false) => {
  return useQuery({
    queryKey: ['categories', { includeChildren }],
    queryFn: () => categoriesService.getCategories(includeChildren),
    staleTime: 1000 * 60 * 30, // 30 minutes (categories don't change often)
  });
};

export const useCategory = (id: string) => {
  return useQuery({
    queryKey: ['categories', id],
    queryFn: () => categoriesService.getCategory(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 30,
  });
};

export const useFilterOptions = () => {
  return useQuery({
    queryKey: ['categories', 'filters'],
    queryFn: () => categoriesService.getFilterOptions(),
    staleTime: 1000 * 60 * 30,
  });
};

export const useAdminCategories = () => {
  return useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: () => categoriesService.getAdminCategories(),
    staleTime: 1000 * 60 * 10,
  });
};

export const useAdminCategory = (id: string) => {
  return useQuery({
    queryKey: ['admin', 'categories', id],
    queryFn: () => categoriesService.getAdminCategory(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  });
};


// ... existing customer hooks

// ============================================
// ADMIN HOOKS
// ============================================

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => categoriesService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryRequest }) =>
      categoriesService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoriesService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
    },
  });
};

export const useReorderCategories = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orders: { id: string; order: number }[]) =>
      categoriesService.reorderCategories(orders),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
    },
  });
};

export const useCreateSubCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ categoryId, data }: { categoryId: string; data: CreateSubCategoryRequest }) =>
      categoriesService.createSubCategory(categoryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
    },
  });
};

export const useUpdateSubCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSubCategoryRequest }) =>
      categoriesService.updateSubCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
    },
  });
};

export const useDeleteSubCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoriesService.deleteSubCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
    },
  });
};

export const useCreateProductList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ subCategoryId, data }: { subCategoryId: string; data: CreateProductListRequest }) =>
      categoriesService.createProductList(subCategoryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
    },
  });
};

export const useUpdateProductList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductListRequest }) =>
      categoriesService.updateProductList(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
    },
  });
};

export const useDeleteProductList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoriesService.deleteProductList(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
    },
  });
};
