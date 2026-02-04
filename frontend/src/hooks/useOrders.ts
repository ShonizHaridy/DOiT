import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as ordersService from '@/services/orders';
import { useCartStore } from '@/store';
import type { CreateOrderRequest, OrderStatus } from '@/types/order';

export const useCreateGuestOrder = () => {
  return useMutation({
    mutationFn: (data: CreateOrderRequest) => ordersService.createGuestOrder(data),
  });
};

export const useTrackGuestOrder = () => {
  return useMutation({
    mutationFn: ({ orderId, email }: { orderId: string; email: string }) =>
      ordersService.getGuestOrder(orderId, email),
  });
};

export const useOrders = (params?: {
  page?: number;
  limit?: number;
  status?: string;
}) => {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => ordersService.getOrders(params),
  });
};

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => ordersService.getOrder(id),
    enabled: !!id,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const clearCart = useCartStore((state) => state.clearCart);

  return useMutation({
    mutationFn: (data: CreateOrderRequest) => ordersService.createOrder(data),
    onSuccess: () => {
      // Clear cart after successful order
      clearCart();
      
      // Refresh orders list
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      
      // Refresh customer profile (to update totalOrders and totalSpending)
      queryClient.invalidateQueries({ queryKey: ['customer', 'profile'] });
    },
  });
};


// ... existing customer hooks

// ============================================
// ADMIN HOOKS
// ============================================

export const useAllOrders = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}) => {
  return useQuery({
    queryKey: ['orders', 'all', params],
    queryFn: () => ordersService.getAllOrders(params),
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status, notes }: { orderId: string; status: OrderStatus; notes?: string }) =>
      ordersService.updateOrderStatus(orderId, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useUpdateTrackingNumber = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, trackingNumber }: { orderId: string; trackingNumber: string }) =>
      ordersService.updateTrackingNumber(orderId, trackingNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useOrderStatistics = (params?: {
  dateFrom?: string;
  dateTo?: string;
}) => {
  return useQuery({
    queryKey: ['orders', 'statistics', params],
    queryFn: () => ordersService.getOrderStatistics(params),
  });
};