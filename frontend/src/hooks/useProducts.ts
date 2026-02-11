import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as productsService from '@/services/products';
import type {
  ProductFilters,
  CreateProductRequest,
  UpdateProductRequest,
  ProductVariant,
  ProductStatus,
} from '@/types/product';

export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsService.getProducts(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => productsService.getFeaturedProducts(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => productsService.getProduct(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

// ... existing customer hooks (useProducts, useFeaturedProducts, useProduct)

// ============================================
// ADMIN HOOKS
// ============================================

export const useAdminProducts = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: ProductStatus;
  category?: string;
}) => {
  return useQuery({
    queryKey: ['admin', 'products', params],
    queryFn: () => productsService.getAdminProducts(params),
  });
};

export const useAdminProduct = (id: string) => {
  return useQuery({
    queryKey: ['admin', 'products', id],
    queryFn: () => productsService.getAdminProduct(id),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductRequest) => productsService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductRequest }) =>
      productsService.updateProduct(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'products', variables.id] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productsService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
  });
};

export const useToggleProductStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ProductStatus }) =>
      productsService.toggleProductStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'products', variables.id] });
    },
  });
};

export const useUploadProductImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, formData }: { productId: string; formData: FormData }) =>
      productsService.uploadProductImage(productId, formData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'products', variables.productId] });
    },
  });
};

export const useDeleteProductImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, imageId }: { productId: string; imageId: string }) =>
      productsService.deleteProductImage(productId, imageId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'products', variables.productId] });
    },
  });
};

export const useUpdateProductVariants = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, variants }: { productId: string; variants: ProductVariant[] }) =>
      productsService.updateProductVariants(productId, variants),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'products', variables.productId] });
    },
  });
};
