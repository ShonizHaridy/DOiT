import { useQuery } from '@tanstack/react-query';
import * as contentService from '@/services/content';

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
    },
  });
};

export const useDeleteHeroSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => contentService.deleteHeroSection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', 'home'] });
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
    },
  });
};

export const useDeleteVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => contentService.deleteVendor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', 'home'] });
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
    },
  });
};

export const useDeleteBannerAd = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => contentService.deleteBannerAd(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', 'home'] });
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
    },
  });
};

export const useDeletePopupOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => contentService.deletePopupOffer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', 'popup-offer'] });
    },
  });
};