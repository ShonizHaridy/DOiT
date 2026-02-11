import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import * as customerService from '@/services/customer';
import type {
  UpdateProfileRequest,
  CreateAddressRequest,
  UpdateAddressRequest,
  CustomerProfile,
  Address,
} from '@/types/customer';

// ============================================
// PROFILE
// ============================================

export const useCustomerProfile = (options?: UseQueryOptions<CustomerProfile>) => {
  return useQuery({
    queryKey: ['customer', 'profile'],
    queryFn: () => customerService.getCustomerProfile(),
    ...options,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => 
      customerService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer', 'profile'] });
    },
  });
};

// ============================================
// ADDRESSES
// ============================================

export const useAddresses = (options?: UseQueryOptions<Address[]>) => {
  return useQuery({
    queryKey: ['customer', 'addresses'],
    queryFn: () => customerService.getAddresses(),
    ...options,
  });
};

export const useCreateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAddressRequest) => 
      customerService.createAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer', 'addresses'] });
    },
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAddressRequest }) => 
      customerService.updateAddress(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer', 'addresses'] });
    },
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => customerService.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer', 'addresses'] });
    },
  });
};



// ... existing customer hooks

// ============================================
// ADMIN HOOKS
// ============================================

export const useAllCustomers = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'all' | 'active' | 'blocked';
}) => {
  return useQuery({
    queryKey: ['customers', 'all', params],
    queryFn: () => customerService.getAllCustomers(params),
  });
};

export const useCustomerById = (id: string) => {
  return useQuery({
    queryKey: ['customers', id],
    queryFn: () => customerService.getCustomerById(id),
    enabled: !!id,
  });
};

export const useUpdateCustomerStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'ACTIVE' | 'BLOCKED' }) =>
      customerService.updateCustomerStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};

export const useCustomerStatistics = () => {
  return useQuery({
    queryKey: ['customers', 'statistics'],
    queryFn: () => customerService.getCustomerStatistics(),
  });
};

export const useCustomerOrders = (id: string, params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['customers', id, 'orders', params],
    queryFn: () => customerService.getCustomerOrders(id, params),
    enabled: !!id,
  });
};
