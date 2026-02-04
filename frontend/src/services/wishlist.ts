import { apiClient } from '@/lib/axios-client';
import type { WishlistItem, AddToWishlistRequest } from '@/types/wishlist';

export const getWishlist = async (): Promise<WishlistItem[]> => {
  const { data } = await apiClient.get<WishlistItem[]>('/api/wishlist');
  return data;
};

export const addToWishlist = async (productId: string): Promise<WishlistItem> => {
  const response = await apiClient.post<WishlistItem>('/api/wishlist', {
    productId,
  } as AddToWishlistRequest);
  return response.data;
};

export const removeFromWishlist = async (productId: string): Promise<void> => {
  await apiClient.delete(`/api/wishlist/${productId}`);
};

export const clearWishlist = async (): Promise<void> => {
  await apiClient.delete('/api/wishlist');
};