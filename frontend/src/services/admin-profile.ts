import { apiClient } from '@/lib/axios-client'
import type { AdminProfile, UpdateAdminProfileRequest } from '@/types/admin-profile'

export const getAdminProfile = async (): Promise<AdminProfile> => {
  const { data } = await apiClient.get<AdminProfile>('/admin/profile')
  return data
}

export const updateAdminProfile = async (
  payload: UpdateAdminProfileRequest
): Promise<AdminProfile> => {
  const { data } = await apiClient.put<AdminProfile>('/admin/profile', payload)
  return data
}
