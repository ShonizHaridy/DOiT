import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import * as wishlistService from '@/services/wishlist';
import { useAuthStore, useWishlistStore } from '@/store';
import type { WishlistItem } from '@/types/wishlist';

export const useWishlist = (options?: UseQueryOptions<WishlistItem[]>) => {
  const setItems = useWishlistStore((state) => state.setItems);

  return useQuery({
    queryKey: ['wishlist'],
    queryFn: () => wishlistService.getWishlist(),
    ...options,
    onSuccess: (items) => {
      setItems(items.map((item) => item.productId));
      options?.onSuccess?.(items);
    },
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
      // eslint-disable-next-line no-console
      console.error('Wishlist add failed', err);
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
      
      if (process.env.NODE_ENV !== 'production') {
        const token = useAuthStore.getState().accessToken ??
          (typeof window !== 'undefined' ? localStorage.getItem('access_token') : null);
        // eslint-disable-next-line no-console
        console.log('Wishlist remove mutate', {
          productId,
          hasToken: Boolean(token),
        });
      }
      queryClient.setQueryData<WishlistItem[]>(
        ['wishlist'],
        (current) => current?.filter((item) => item.productId !== productId) ?? current
      );
      removeFromLocalWishlist(productId);
      
      return { previousWishlist };
    },
    onError: (err, productId, context) => {
      const status = (err as any)?.response?.status;
      // eslint-disable-next-line no-console
      console.error('Wishlist remove failed', { status, err, productId });
      if (status === 404) {
        // Item already gone on the server; keep optimistic removal
        queryClient.invalidateQueries({ queryKey: ['wishlist'] });
        return;
      }
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
