import { apiClient } from '@/lib/axios-client';
import type {
  CustomerProfile,
  UpdateProfileRequest,
  Address,
  CreateAddressRequest,
  UpdateAddressRequest,
  CustomerStatistics,
  PaginatedCustomers,
} from '@/types/customer';

// ============================================
// PROFILE
// ============================================

export const getCustomerProfile = async (): Promise<CustomerProfile> => {
  const { data } = await apiClient.get<CustomerProfile>('/api/customer/profile');
  return data;
};

export const updateProfile = async (
  data: UpdateProfileRequest
): Promise<CustomerProfile> => {
  const response = await apiClient.put<CustomerProfile>(
    '/api/customer/profile',
    data
  );
  return response.data;
};

// ============================================
// ADDRESSES
// ============================================

export const getAddresses = async (): Promise<Address[]> => {
  const { data } = await apiClient.get<Address[]>('/api/customer/addresses');
  return data;
};

export const createAddress = async (
  data: CreateAddressRequest
): Promise<Address> => {
  const response = await apiClient.post<Address>('/api/customer/addresses', data);
  return response.data;
};

export const updateAddress = async (
  id: string,
  data: UpdateAddressRequest
): Promise<Address> => {
  const response = await apiClient.put<Address>(
    `/api/customer/addresses/${id}`,
    data
  );
  return response.data;
};

export const deleteAddress = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/customer/addresses/${id}`);
};

// ... existing customer profile/address operations

// ============================================
// ADMIN OPERATIONS
// ============================================

export const getAllCustomers = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
}): Promise<PaginatedCustomers> => {
  const { data } = await apiClient.get<PaginatedCustomers>('/api/admin/customers', {
    params,
  });
  return data;
};

export const getCustomerById = async (id: string): Promise<CustomerProfile> => {
  const { data } = await apiClient.get<CustomerProfile>(`/api/admin/customers/${id}`);
  return data;
};

export const updateCustomerStatus = async (
  id: string,
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED'
): Promise<CustomerProfile> => {
  const response = await apiClient.patch<CustomerProfile>(
    `/api/admin/customers/${id}/status`,
    { status }
  );
  return response.data;
};

export const getCustomerStatistics = async (): Promise<CustomerStatistics> => {
  const { data } = await apiClient.get<CustomerStatistics>(
    '/api/admin/customers/statistics'
  );
  return data;
};