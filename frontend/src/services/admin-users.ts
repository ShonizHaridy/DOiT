import { apiClient } from '@/lib/axios-client'
import type {
  AdminUser,
  CreateAdminUserRequest,
  UpdateAdminUserRequest,
} from '@/types/admin-user'

export const getAdminUsers = async (): Promise<AdminUser[]> => {
  const { data } = await apiClient.get<AdminUser[]>('/admin/admin-users')
  return data
}

export const createAdminUser = async (payload: CreateAdminUserRequest): Promise<AdminUser> => {
  const { data } = await apiClient.post<AdminUser>('/admin/admin-users', payload)
  return data
}

export const updateAdminUser = async (
  id: string,
  payload: UpdateAdminUserRequest
): Promise<AdminUser> => {
  const { data } = await apiClient.put<AdminUser>(`/admin/admin-users/${id}`, payload)
  return data
}

export const deleteAdminUser = async (id: string): Promise<void> => {
  await apiClient.delete(`/admin/admin-users/${id}`)
}
