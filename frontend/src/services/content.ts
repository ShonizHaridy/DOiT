import { apiClient } from '@/lib/axios-client';
import type { Banner, CreateBannerAdRequest, CreateHeroSectionRequest, CreatePopupOfferRequest, CreateVendorRequest, HeroSection, HomeContent, PopupOffer, UpdateBannerAdRequest, UpdateHeroSectionRequest, UpdatePopupOfferRequest, UpdateVendorRequest, Vendor } from '@/types/content';

export const getHomeContent = async (): Promise<HomeContent> => {
  const { data } = await apiClient.get<HomeContent>('/api/content/home');
  return data;
};

export const getPopupOffer = async (): Promise<PopupOffer | null> => {
  const { data } = await apiClient.get<PopupOffer | null>('/api/content/popup-offer');
  return data;
};

// ... existing customer operations

// ============================================
// ADMIN OPERATIONS
// ============================================

// Hero Sections
export const createHeroSection = async (
  data: CreateHeroSectionRequest
): Promise<HeroSection> => {
  const response = await apiClient.post<HeroSection>(
    '/api/admin/content/hero-sections',
    data
  );
  return response.data;
};

export const updateHeroSection = async (
  id: string,
  data: UpdateHeroSectionRequest
): Promise<HeroSection> => {
  const response = await apiClient.put<HeroSection>(
    `/api/admin/content/hero-sections/${id}`,
    data
  );
  return response.data;
};

export const deleteHeroSection = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/admin/content/hero-sections/${id}`);
};

export const reorderHeroSections = async (
  orders: { id: string; order: number }[]
): Promise<void> => {
  await apiClient.patch('/api/admin/content/hero-sections/reorder', { orders });
};

// Vendors
export const createVendor = async (data: CreateVendorRequest): Promise<Vendor> => {
  const response = await apiClient.post<Vendor>('/api/admin/content/vendors', data);
  return response.data;
};

export const updateVendor = async (
  id: string,
  data: UpdateVendorRequest
): Promise<Vendor> => {
  const response = await apiClient.put<Vendor>(
    `/api/admin/content/vendors/${id}`,
    data
  );
  return response.data;
};

export const deleteVendor = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/admin/content/vendors/${id}`);
};

// Banner Ads
export const createBannerAd = async (data: CreateBannerAdRequest): Promise<Banner> => {
  const response = await apiClient.post<Banner>(
    '/api/admin/content/banners',
    data
  );
  return response.data;
};

export const updateBannerAd = async (
  id: string,
  data: UpdateBannerAdRequest
): Promise<Banner> => {
  const response = await apiClient.put<Banner>(
    `/api/admin/content/banners/${id}`,
    data
  );
  return response.data;
};

export const deleteBannerAd = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/admin/content/banners/${id}`);
};

// Popup Offers
export const createPopupOffer = async (
  data: CreatePopupOfferRequest
): Promise<PopupOffer> => {
  const response = await apiClient.post<PopupOffer>(
    '/api/admin/content/popup-offers',
    data
  );
  return response.data;
};

export const updatePopupOffer = async (
  id: string,
  data: UpdatePopupOfferRequest
): Promise<PopupOffer> => {
  const response = await apiClient.put<PopupOffer>(
    `/api/admin/content/popup-offers/${id}`,
    data
  );
  return response.data;
};

export const deletePopupOffer = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/admin/content/popup-offers/${id}`);
};