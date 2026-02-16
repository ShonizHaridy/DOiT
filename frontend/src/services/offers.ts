import { apiClient } from '@/lib/axios-client';
import type {
  Offer,
  CreateOfferRequest,
  UpdateOfferRequest,
} from '@/types/offer';

export const getOffers = async (params?: {
  status?: 'all' | 'active' | 'expired' | 'inactive';
}): Promise<Offer[]> => {
  const { data } = await apiClient.get<Offer[]>('/admin/offers', {
    params,
  });
  return data;
};

export const getOffer = async (id: string): Promise<Offer> => {
  const { data } = await apiClient.get<Offer>(`/admin/offers/${id}`);
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
  const response = await apiClient.put<Offer>(`/admin/offers/${id}`, data);
  return response.data;
};

export const deleteOffer = async (id: string): Promise<void> => {
  await apiClient.delete(`/admin/offers/${id}`);
};

export const toggleOfferStatus = async (id: string, status: boolean): Promise<Offer> => {
  const response = await apiClient.put<Offer>(`/admin/offers/${id}`, { status });
  return response.data;
};

export const exportAllOffersCsv = async (params?: {
  search?: string;
  type?: string;
  status?: string;
}): Promise<Blob> => {
  const { data } = await apiClient.get<Blob>('/admin/offers/export', {
    params,
    responseType: 'blob',
  });
  return data;
};
