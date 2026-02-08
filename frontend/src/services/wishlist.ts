import { apiClient } from '@/lib/axios-client';
import type { WishlistItem, AddToWishlistRequest } from '@/types/wishlist';

export const getWishlist = async (): Promise<WishlistItem[]> => {
  const { data } = await apiClient.get<WishlistItem[]>('/wishlist');
  return data;
};

export const addToWishlist = async (productId: string): Promise<WishlistItem> => {
  const response = await apiClient.post<WishlistItem>('/wishlist', {
    productId,
  } as AddToWishlistRequest);
  return response.data;
};

export const removeFromWishlist = async (productId: string): Promise<void> => {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log('Wishlist remove request', {
      productId,
      baseURL: apiClient.defaults.baseURL,
    });
  }
  const response = await apiClient.delete(`/wishlist/${productId}`);
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log('Wishlist remove response', {
      productId,
      status: response.status,
      statusText: response.statusText,
    });
  }
};

export const clearWishlist = async (): Promise<void> => {
  await apiClient.delete('/wishlist');
};
