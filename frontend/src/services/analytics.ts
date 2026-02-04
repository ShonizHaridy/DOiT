import { apiClient } from '@/lib/axios-client';
import type {
  DashboardStats,
  SalesChart,
  TopProducts,
  RecentOrders,
} from '@/types/analytics';

export const getDashboardStats = async (params?: {
  dateFrom?: string;
  dateTo?: string;
}): Promise<DashboardStats> => {
  const { data } = await apiClient.get<DashboardStats>(
    '/api/admin/analytics/dashboard',
    { params }
  );
  return data;
};

export const getSalesChart = async (params: {
  period: 'week' | 'month' | 'year';
}): Promise<SalesChart> => {
  const { data } = await apiClient.get<SalesChart>(
    '/api/admin/analytics/sales',
    { params }
  );
  return data;
};

export const getTopProducts = async (params?: {
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
}): Promise<TopProducts> => {
  const { data } = await apiClient.get<TopProducts>(
    '/api/admin/analytics/top-products',
    { params }
  );
  return data;
};

export const getRecentOrders = async (limit: number = 10): Promise<RecentOrders> => {
  const { data } = await apiClient.get<RecentOrders>(
    '/api/admin/analytics/recent-orders',
    { params: { limit } }
  );
  return data;
};