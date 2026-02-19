import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as contentService from '@/services/content';
import type {
  CreateSitePageRequest,
  CreateHeroSectionRequest,
  UpdateHeroSectionRequest,
  CreateVendorRequest,
  UpdateVendorRequest,
  CreateBannerAdRequest,
  UpdateBannerAdRequest,
  CreatePopupOfferRequest,
  UpdateSitePageRequest,
  UpdatePopupOfferRequest,
  FeaturedProductsConfig,
} from '@/types/content';

export const useHomeContent = () => {
  return useQuery({
    queryKey: ['content', 'home'],
    queryFn: () => contentService.getHomeContent(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const usePopupOffer = () => {
  return useQuery({
    queryKey: ['content', 'popup-offer'],
    queryFn: () => contentService.getPopupOffer(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useClaimPopupOffer = () => {
  return useMutation({
    mutationFn: (payload: { email: string; locale?: 'en' | 'ar' }) =>
      contentService.claimPopupOffer(payload),
  });
};

export const useInformationPages = () => {
  return useQuery({
    queryKey: ['content', 'information-pages'],
    queryFn: () => contentService.getInformationPages(),
    staleTime: 1000 * 60 * 10,
  })
}

export const useInformationPage = (slug: string, enabled = true) => {
  return useQuery({
    queryKey: ['content', 'information-pages', slug],
    queryFn: () => contentService.getInformationPageBySlug(slug),
    enabled: enabled && Boolean(slug),
    staleTime: 1000 * 60 * 10,
  })
}

export const useHeroSections = () => {
  return useQuery({
    queryKey: ['admin', 'content', 'hero-sections'],
    queryFn: () => contentService.getHeroSections(),
  });
};

export const useVendors = () => {
  return useQuery({
    queryKey: ['admin', 'content', 'vendors'],
    queryFn: () => contentService.getVendors(),
  });
};

export const useBannerAds = () => {
  return useQuery({
    queryKey: ['admin', 'content', 'banners'],
    queryFn: () => contentService.getBannerAds(),
  });
};

export const usePopupOffers = () => {
  return useQuery({
    queryKey: ['admin', 'content', 'popup-offers'],
    queryFn: () => contentService.getPopupOffers(),
  });
};

export const useFeaturedProductsConfig = () => {
  return useQuery({
    queryKey: ['admin', 'content', 'featured-products'],
    queryFn: () => contentService.getFeaturedProductsConfig(),
  });
};

export const useAdminSitePages = () => {
  return useQuery({
    queryKey: ['admin', 'content', 'site-pages'],
    queryFn: () => contentService.getAdminSitePages(),
  })
}


// ... existing customer hooks

// ============================================
// ADMIN HOOKS - HERO SECTIONS
// ============================================

export const useCreateHeroSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateHeroSectionRequest) => contentService.createHeroSection(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', 'home'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'content', 'hero-sections'] });
    },
  });
};

export const useUpdateHeroSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateHeroSectionRequest }) =>
      contentService.updateHeroSection(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', 'home'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'content', 'hero-sections'] });
    },
  });
};

export const useDeleteHeroSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => contentService.deleteHeroSection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', 'home'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'content', 'hero-sections'] });
    },
  });
};

export const useReorderHeroSections = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orders: { id: string; order: number }[]) =>
      contentService.reorderHeroSections(orders),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', 'home'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'content', 'hero-sections'] });
    },
  });
};

// ============================================
// ADMIN HOOKS - VENDORS
// ============================================

export const useCreateVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateVendorRequest) => contentService.createVendor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', 'home'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'content', 'vendors'] });
    },
  });
};

export const useUpdateVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateVendorRequest }) =>
      contentService.updateVendor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', 'home'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'content', 'vendors'] });
    },
  });
};

export const useDeleteVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => contentService.deleteVendor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', 'home'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'content', 'vendors'] });
    },
  });
};

// ============================================
// ADMIN HOOKS - BANNER ADS
// ============================================

export const useCreateBannerAd = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBannerAdRequest) => contentService.createBannerAd(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', 'home'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'content', 'banners'] });
    },
  });
};

export const useUpdateBannerAd = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBannerAdRequest }) =>
      contentService.updateBannerAd(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', 'home'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'content', 'banners'] });
    },
  });
};

export const useDeleteBannerAd = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => contentService.deleteBannerAd(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', 'home'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'content', 'banners'] });
    },
  });
};

// ============================================
// ADMIN HOOKS - POPUP OFFERS
// ============================================

export const useCreatePopupOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePopupOfferRequest) => contentService.createPopupOffer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', 'popup-offer'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'content', 'popup-offers'] });
    },
  });
};

export const useUpdatePopupOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePopupOfferRequest }) =>
      contentService.updatePopupOffer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', 'popup-offer'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'content', 'popup-offers'] });
    },
  });
};

export const useDeletePopupOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => contentService.deletePopupOffer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', 'popup-offer'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'content', 'popup-offers'] });
    },
  });
};

export const useUpdateFeaturedProductsConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FeaturedProductsConfig) =>
      contentService.updateFeaturedProductsConfig(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'content', 'featured-products'] });
    },
  });
};

export const useCreateSitePage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateSitePageRequest) => contentService.createSitePage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'content', 'site-pages'] })
      queryClient.invalidateQueries({ queryKey: ['content', 'information-pages'] })
    },
  })
}

export const useUpdateSitePage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSitePageRequest }) =>
      contentService.updateSitePage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'content', 'site-pages'] })
      queryClient.invalidateQueries({ queryKey: ['content', 'information-pages'] })
    },
  })
}

export const useDeleteSitePage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => contentService.deleteSitePage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'content', 'site-pages'] })
      queryClient.invalidateQueries({ queryKey: ['content', 'information-pages'] })
    },
  })
}
