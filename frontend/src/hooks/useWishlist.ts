import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as wishlistService from '@/services/wishlist';
import { useWishlistStore } from '@/store';
import type { WishlistItem } from '@/types/wishlist';

export const useWishlist = () => {
  return useQuery({
    queryKey: ['wishlist'],
    queryFn: () => wishlistService.getWishlist(),
  });
};

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();
  const addToLocalWishlist = useWishlistStore((state) => state.addItem);

  return useMutation({
    mutationFn: (productId: string) => wishlistService.addToWishlist(productId),
    // Optimistic update
    onMutate: async (productId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['wishlist'] });

      // Snapshot previous value
      const previousWishlist = queryClient.getQueryData<WishlistItem[]>(['wishlist']);

      // Optimistically update local store
      addToLocalWishlist(productId);

      return { previousWishlist };
    },
    onError: (err, productId, context) => {
      // Rollback on error
      if (context?.previousWishlist) {
        queryClient.setQueryData(['wishlist'], context.previousWishlist);
        useWishlistStore.getState().removeItem(productId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();
  const removeFromLocalWishlist = useWishlistStore((state) => state.removeItem);

  return useMutation({
    mutationFn: (productId: string) => wishlistService.removeFromWishlist(productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ['wishlist'] });
      const previousWishlist = queryClient.getQueryData<WishlistItem[]>(['wishlist']);
      
      removeFromLocalWishlist(productId);
      
      return { previousWishlist };
    },
    onError: (err, productId, context) => {
      if (context?.previousWishlist) {
        queryClient.setQueryData(['wishlist'], context.previousWishlist);
        useWishlistStore.getState().addItem(productId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
};

export const useClearWishlist = () => {
  const queryClient = useQueryClient();
  const clearLocalWishlist = useWishlistStore((state) => state.clearWishlist);

  return useMutation({
    mutationFn: () => wishlistService.clearWishlist(),
    onSuccess: () => {
      clearLocalWishlist();
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
};