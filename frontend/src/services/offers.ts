import { apiClient } from '@/lib/axios-client';
import type {
  Offer,
  CreateOfferRequest,
  UpdateOfferRequest,
} from '@/types/offer';

const toNumberValue = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') return null
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  if (typeof value === 'string') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  if (typeof value === 'object') {
    const candidate = value as {
      toNumber?: () => number
      toJSON?: () => unknown
      toString?: () => string
      $numberDecimal?: string
      value?: unknown
    }
    if (typeof candidate.toNumber === 'function') {
      const parsed = candidate.toNumber()
      return Number.isFinite(parsed) ? parsed : null
    }
    if (typeof candidate.$numberDecimal === 'string') {
      const parsed = Number(candidate.$numberDecimal)
      return Number.isFinite(parsed) ? parsed : null
    }
    if (candidate.value !== undefined) {
      return toNumberValue(candidate.value)
    }
    if (typeof candidate.toJSON === 'function') {
      return toNumberValue(candidate.toJSON())
    }
    if (typeof candidate.toString === 'function') {
      const text = candidate.toString()
      if (text && text !== '[object Object]') {
        const parsed = Number(text)
        return Number.isFinite(parsed) ? parsed : null
      }
    }
  }
  return null
}

const toOptionalString = (value: unknown): string | null => {
  if (value === null || value === undefined) return null
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (typeof value === 'object') {
    const candidate = value as { toString?: () => string; value?: unknown }
    if (candidate.value !== undefined) {
      return toOptionalString(candidate.value)
    }
    if (typeof candidate.toString === 'function') {
      const text = candidate.toString()
      if (text && text !== '[object Object]') return text
    }
  }
  return null
}

const toStringValue = (value: unknown): string => toOptionalString(value) ?? ''

const normalizeOffer = (offer: Offer): Offer => ({
  ...offer,
  id: toStringValue(offer.id),
  code: toStringValue(offer.code),
  nameEn: toStringValue(offer.nameEn),
  nameAr: toStringValue(offer.nameAr),
  startDate: toStringValue(offer.startDate),
  endDate: toStringValue(offer.endDate),
  startTime: toOptionalString(offer.startTime),
  endTime: toOptionalString(offer.endTime),
  discountValue: toNumberValue(offer.discountValue) ?? 0,
  minCartValue: toNumberValue(offer.minCartValue),
  maxDiscount: toNumberValue(offer.maxDiscount),
  totalUsageLimit: toNumberValue(offer.totalUsageLimit),
  perUserLimit: toNumberValue(offer.perUserLimit),
  currentUsage: toNumberValue(offer.currentUsage) ?? 0,
  targetId: toOptionalString(offer.targetId),
})

export const getOffers = async (params?: {
  status?: 'all' | 'active' | 'expired' | 'inactive';
}): Promise<Offer[]> => {
  const { data } = await apiClient.get<Offer[]>('/admin/offers', {
    params,
  });
  return data.map(normalizeOffer);
};

export const getOffer = async (id: string): Promise<Offer> => {
  const { data } = await apiClient.get<Offer>(`/admin/offers/${id}`);
  return normalizeOffer(data);
};

export const createOffer = async (data: CreateOfferRequest): Promise<Offer> => {
  const response = await apiClient.post<Offer>('/admin/offers', data);
  return normalizeOffer(response.data);
};

export const updateOffer = async (
  id: string,
  data: UpdateOfferRequest
): Promise<Offer> => {
  const response = await apiClient.put<Offer>(`/admin/offers/${id}`, data);
  return normalizeOffer(response.data);
};

export const deleteOffer = async (id: string): Promise<void> => {
  await apiClient.delete(`/admin/offers/${id}`);
};

export const toggleOfferStatus = async (id: string, status: boolean): Promise<Offer> => {
  const response = await apiClient.put<Offer>(`/admin/offers/${id}`, { status });
  return normalizeOffer(response.data);
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
