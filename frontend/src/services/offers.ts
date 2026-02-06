import { apiClient } from '@/lib/axios-client';
import type {
  Offer,
  PaginatedOffers,
  CreateOfferRequest,
  UpdateOfferRequest,
} from '@/types/offer';

export const getOffers = async (params?: {
  page?: number;
  limit?: number;
  status?: boolean;
  type?: 'PERCENTAGE' | 'FIXED_AMOUNT';
}): Promise<PaginatedOffers> => {
  const { data } = await apiClient.get<PaginatedOffers>('/admin/offers', {
    params,
  });
  return data;
};

export const getOffer = async (id: string): Promise<Offer> => {
  const { data } = await apiClient.get<Offer>(`/api/admin/offers/${id}`);
  return data;
};

export const createOffer = async (data: CreateOfferRequest): Promise<Offer> => {
  const response = await apiClient.post<Offer>('/admin/offers', data);
  return response.data;
};

export const updateOffer = async (
  id: string,
  data: UpdateOfferRequest
): Promise<Offer> => {
  const response = await apiClient.put<Offer>(`/api/admin/offers/${id}`, data);
  return response.data;
};

export const deleteOffer = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/admin/offers/${id}`);
};

export const toggleOfferStatus = async (id: string, status: boolean): Promise<Offer> => {
  const response = await apiClient.patch<Offer>(`/api/admin/offers/${id}/status`, {
    status,
  });
  return response.data;
};