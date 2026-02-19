import { apiClient } from '@/lib/axios-client';
import type {
  Order,
  PaginatedOrders,
  PaginatedCustomOrders,
  CreateOrderRequest,
  CreateGuestOrderRequest,
  CreateCustomOrderRequest,
  CouponValidationRequest,
  CouponValidationResponse,
  ShippingRate,
  OrderStatistics,
  OrderStatus,
  AdminOrdersResponse,
  AdminOrder,
  AdminCustomOrdersResponse,
  AdminCustomOrder,
  CustomOrderStatus,
  CustomOrder,
} from '@/types/order';

// Guest order creation (no auth required)
export const createGuestOrder = async (data: CreateGuestOrderRequest): Promise<Order> => {
  const response = await apiClient.post<Order>('/orders/guest', data);
  return response.data;
};

// Track guest order by order number
export const getGuestOrder = async (orderNumber: string): Promise<Order> => {
  const { data } = await apiClient.get<Order>(`/orders/track/${encodeURIComponent(orderNumber)}`);
  return data;
};

export const createCustomOrder = async (
  data: CreateCustomOrderRequest
): Promise<CustomOrder> => {
  const response = await apiClient.post<CustomOrder>('/orders/custom', data);
  return response.data;
};

export const validateCoupon = async (
  data: CouponValidationRequest
): Promise<CouponValidationResponse> => {
  const response = await apiClient.post<CouponValidationResponse>('/orders/coupon/validate', data);
  return response.data;
};

export const getShippingRates = async (): Promise<ShippingRate[]> => {
  const { data } = await apiClient.get<ShippingRate[]>('/orders/shipping-rates');
  return data;
};

export const getCustomOrder = async (orderNumber: string): Promise<CustomOrder> => {
  const { data } = await apiClient.get<CustomOrder>(
    `/orders/custom/track/${encodeURIComponent(orderNumber)}`
  );
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

export const getCustomOrders = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<PaginatedCustomOrders> => {
  const { data } = await apiClient.get<PaginatedCustomOrders>('/orders/custom', {
    params,
  });
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

export const getAdminCustomOrders = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}): Promise<AdminCustomOrdersResponse> => {
  const { data } = await apiClient.get<AdminCustomOrdersResponse>(
    '/admin/orders/custom',
    { params }
  );
  return data;
};

export const getAdminCustomOrder = async (id: string): Promise<AdminCustomOrder> => {
  const { data } = await apiClient.get<AdminCustomOrder>(`/admin/orders/custom/${id}`);
  return data;
};

export const updateCustomOrderStatus = async (
  orderId: string,
  status: CustomOrderStatus
): Promise<AdminCustomOrder> => {
  const response = await apiClient.put<AdminCustomOrder>(
    `/admin/orders/custom/${orderId}/status`,
    { status }
  );
  return response.data;
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

export const exportAllOrdersCsv = async (params?: {
  status?: string;
  search?: string;
}): Promise<Blob> => {
  const { data } = await apiClient.get<Blob>('/admin/orders/export', {
    params,
    responseType: 'blob',
  });
  return data;
};

export const exportAllCustomOrdersCsv = async (params?: {
  status?: string;
  search?: string;
}): Promise<Blob> => {
  const { data } = await apiClient.get<Blob>('/admin/orders/custom/export', {
    params,
    responseType: 'blob',
  });
  return data;
};

