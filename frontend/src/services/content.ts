import { apiClient } from '@/lib/axios-client';
import type {
  Banner,
  CreateBannerAdRequest,
  CreateHeroSectionRequest,
  CreateSitePageRequest,
  CreatePopupOfferRequest,
  CreateVendorRequest,
  InformationPage,
  InformationPageSummary,
  HeroSection,
  HomeContent,
  PopupOffer,
  UpdateSitePageRequest,
  UpdateBannerAdRequest,
  UpdateHeroSectionRequest,
  UpdatePopupOfferRequest,
  UpdateVendorRequest,
  Vendor,
  FeaturedProductsConfig,
} from '@/types/content';

export const getHomeContent = async (): Promise<HomeContent> => {
  const { data } = await apiClient.get<HomeContent>('/content/home');
  return data;
};

export const getPopupOffer = async (): Promise<PopupOffer | null> => {
  const { data } = await apiClient.get<PopupOffer | null>('/content/popup-offer');
  return data;
};

export const claimPopupOffer = async (payload: {
  email: string;
  locale?: 'en' | 'ar';
}): Promise<{ success: boolean }> => {
  const { data } = await apiClient.post<{ success: boolean }>(
    '/content/popup-offer/claim',
    payload
  );
  return data;
};

export const getInformationPages = async (): Promise<InformationPageSummary[]> => {
  const { data } = await apiClient.get<InformationPageSummary[]>('/content/information-pages')
  return data
}

export const getInformationPageBySlug = async (slug: string): Promise<InformationPage> => {
  const { data } = await apiClient.get<InformationPage>(`/content/information-pages/${slug}`)
  return data
}

// ... existing customer operations

// ============================================
// ADMIN OPERATIONS
// ============================================

// Hero Sections
export const getHeroSections = async (): Promise<HeroSection[]> => {
  const { data } = await apiClient.get<HeroSection[]>('/admin/content/hero-sections');
  return data;
};

export const createHeroSection = async (
  data: CreateHeroSectionRequest
): Promise<HeroSection> => {
  const response = await apiClient.post<HeroSection>(
    '/admin/content/hero-sections',
    data
  );
  return response.data;
};

export const updateHeroSection = async (
  id: string,
  data: UpdateHeroSectionRequest
): Promise<HeroSection> => {
  const response = await apiClient.put<HeroSection>(
    `/admin/content/hero-sections/${id}`,
    data
  );
  return response.data;
};

export const deleteHeroSection = async (id: string): Promise<void> => {
  await apiClient.delete(`/admin/content/hero-sections/${id}`);
};

export const reorderHeroSections = async (
  orders: { id: string; order: number }[]
): Promise<void> => {
  await apiClient.patch('/admin/content/hero-sections/reorder', { orders });
};

// Vendors
export const getVendors = async (): Promise<Vendor[]> => {
  const { data } = await apiClient.get<Vendor[]>('/admin/content/vendors');
  return data;
};

export const createVendor = async (data: CreateVendorRequest): Promise<Vendor> => {
  const response = await apiClient.post<Vendor>('/admin/content/vendors', data);
  return response.data;
};

export const updateVendor = async (
  id: string,
  data: UpdateVendorRequest
): Promise<Vendor> => {
  const response = await apiClient.put<Vendor>(
    `/admin/content/vendors/${id}`,
    data
  );
  return response.data;
};

export const deleteVendor = async (id: string): Promise<void> => {
  await apiClient.delete(`/admin/content/vendors/${id}`);
};

// Banner Ads
export const getBannerAds = async (): Promise<Banner[]> => {
  const { data } = await apiClient.get<Banner[]>('/admin/content/banners');
  return data;
};

export const createBannerAd = async (data: CreateBannerAdRequest): Promise<Banner> => {
  const response = await apiClient.post<Banner>(
    '/admin/content/banners',
    data
  );
  return response.data;
};

export const updateBannerAd = async (
  id: string,
  data: UpdateBannerAdRequest
): Promise<Banner> => {
  const response = await apiClient.put<Banner>(
    `/admin/content/banners/${id}`,
    data
  );
  return response.data;
};

export const deleteBannerAd = async (id: string): Promise<void> => {
  await apiClient.delete(`/admin/content/banners/${id}`);
};

// Popup Offers
export const getPopupOffers = async (): Promise<PopupOffer[]> => {
  const { data } = await apiClient.get<PopupOffer[]>('/admin/content/popup-offers');
  return data;
};

export const createPopupOffer = async (
  data: CreatePopupOfferRequest
): Promise<PopupOffer> => {
  const response = await apiClient.post<PopupOffer>(
    '/admin/content/popup-offers',
    data
  );
  return response.data;
};

export const updatePopupOffer = async (
  id: string,
  data: UpdatePopupOfferRequest
): Promise<PopupOffer> => {
  const response = await apiClient.put<PopupOffer>(
    `/admin/content/popup-offers/${id}`,
    data
  );
  return response.data;
};

export const deletePopupOffer = async (id: string): Promise<void> => {
  await apiClient.delete(`/admin/content/popup-offers/${id}`);
};

// Featured Products
export const getFeaturedProductsConfig = async (): Promise<FeaturedProductsConfig> => {
  const { data } = await apiClient.get<FeaturedProductsConfig>(
    '/admin/content/featured-products'
  );
  return data;
};

export const updateFeaturedProductsConfig = async (
  data: FeaturedProductsConfig
): Promise<FeaturedProductsConfig> => {
  const response = await apiClient.put<FeaturedProductsConfig>(
    '/admin/content/featured-products',
    data
  );
  return response.data;
};

export const getAdminSitePages = async (): Promise<InformationPage[]> => {
  const { data } = await apiClient.get<InformationPage[]>('/admin/content/site-pages')
  return data
}

export const createSitePage = async (data: CreateSitePageRequest): Promise<InformationPage> => {
  const response = await apiClient.post<InformationPage>('/admin/content/site-pages', data)
  return response.data
}

export const updateSitePage = async (
  id: string,
  data: UpdateSitePageRequest
): Promise<InformationPage> => {
  const response = await apiClient.put<InformationPage>(`/admin/content/site-pages/${id}`, data)
  return response.data
}

export const deleteSitePage = async (id: string): Promise<void> => {
  await apiClient.delete(`/admin/content/site-pages/${id}`)
}
