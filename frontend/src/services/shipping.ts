import { apiClient } from '@/lib/axios-client'
import type { ShippingRate } from '@/types/order'

export type CreateShippingRateRequest = {
  governorate: string
  price: number
  status?: boolean
}

export type UpdateShippingRateRequest = {
  governorate?: string
  price?: number
  status?: boolean
}

export type BulkUpsertShippingRatesRequest = {
  governorates: string[]
  price: number
  status?: boolean
}

export const getAdminShippingRates = async (): Promise<ShippingRate[]> => {
  const { data } = await apiClient.get<ShippingRate[]>('/admin/shipping-rates')
  return data
}

export const createShippingRate = async (
  payload: CreateShippingRateRequest
): Promise<ShippingRate> => {
  const { data } = await apiClient.post<ShippingRate>('/admin/shipping-rates', payload)
  return data
}

export const updateShippingRate = async (
  id: string,
  payload: UpdateShippingRateRequest
): Promise<ShippingRate> => {
  const { data } = await apiClient.put<ShippingRate>(`/admin/shipping-rates/${id}`, payload)
  return data
}

export const deleteShippingRate = async (id: string): Promise<void> => {
  await apiClient.delete(`/admin/shipping-rates/${id}`)
}

export const upsertShippingRates = async (
  payload: BulkUpsertShippingRatesRequest
): Promise<ShippingRate[]> => {
  const { data } = await apiClient.post<ShippingRate[]>('/admin/shipping-rates/bulk', payload)
  return data
}
