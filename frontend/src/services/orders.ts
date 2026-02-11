import { apiClient } from '@/lib/axios-client';
import type {
  Order,
  PaginatedOrders,
  CreateOrderRequest,
  CreateGuestOrderRequest,
  OrderStatistics,
  OrderStatus,
  AdminOrdersResponse,
  AdminOrder,
} from '@/types/order';

// Guest order creation (no auth required)
export const createGuestOrder = async (data: CreateGuestOrderRequest): Promise<Order> => {
  const response = await apiClient.post<Order>('/orders/guest', data);
  return response.data;
};

// Track guest order by ID
export const getGuestOrder = async (orderId: string, email: string): Promise<Order> => {
  const { data } = await apiClient.post<Order>(`/orders/guest/${orderId}/track`, {
    email,
  });
  return data;
};

// Authenticated User Orders

export const getOrders = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<PaginatedOrders> => {
  const { data } = await apiClient.get<PaginatedOrders>('/orders', {
    params,
  });
  return data;
};

export const getOrder = async (id: string): Promise<Order> => {
  const { data } = await apiClient.get<Order>(`/orders/${id}`);
  return data;
};

export const createOrder = async (data: CreateOrderRequest): Promise<Order> => {
  const response = await apiClient.post<Order>('/orders', data);
  return response.data;
};

// ... existing customer operations

// ============================================
// ADMIN OPERATIONS
// ============================================

export const getAllOrders = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<AdminOrdersResponse> => {
  const { data } = await apiClient.get<AdminOrdersResponse>('/admin/orders', {
    params,
  });
  return data;
};

export const getAdminOrder = async (id: string): Promise<AdminOrder> => {
  const { data } = await apiClient.get<AdminOrder>(`/admin/orders/${id}`);
  return data;
};

export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus,
  notes?: string,
  trackingNumber?: string
): Promise<AdminOrder> => {
  const response = await apiClient.put<AdminOrder>(
    `/admin/orders/${orderId}/status`,
    { status, notes, trackingNumber }
  );
  return response.data;
};

export const updateTrackingNumber = async (
  orderId: string,
  trackingNumber: string
): Promise<Order> => {
  const response = await apiClient.patch<Order>(
    `/admin/orders/${orderId}/tracking`,
    { trackingNumber }
  );
  return response.data;
};

export const getOrderStatistics = async (params?: {
  dateFrom?: string;
  dateTo?: string;
}): Promise<OrderStatistics> => {
  const { data } = await apiClient.get<OrderStatistics>(
    '/admin/orders/statistics',
    { params }
  );
  return data;
};

