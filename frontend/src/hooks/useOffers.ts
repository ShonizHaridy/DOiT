import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as offersService from '@/services/offers';
import type { CreateOfferRequest, UpdateOfferRequest } from '@/types/offer';

export const useOffers = (params?: {
  status?: 'all' | 'active' | 'expired' | 'inactive';
}) => {
  return useQuery({
    queryKey: ['offers', params],
    queryFn: () => offersService.getOffers(params),
  });
};

export const useOffer = (id: string) => {
  return useQuery({
    queryKey: ['offers', id],
    queryFn: () => offersService.getOffer(id),
    enabled: !!id,
  });
};

export const useCreateOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOfferRequest) => offersService.createOffer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
    },
  });
};

export const useUpdateOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOfferRequest }) =>
      offersService.updateOffer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
    },
  });
};

export const useDeleteOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => offersService.deleteOffer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
    },
  });
};

export const useToggleOfferStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: boolean }) =>
      offersService.toggleOfferStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
    },
  });
};
