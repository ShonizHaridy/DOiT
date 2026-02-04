import { useQuery } from '@tanstack/react-query';
import * as analyticsService from '@/services/analytics';

export const useDashboardStats = (params?: {
  dateFrom?: string;
  dateTo?: string;
}) => {
  return useQuery({
    queryKey: ['analytics', 'dashboard', params],
    queryFn: () => analyticsService.getDashboardStats(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useSalesChart = (period: 'week' | 'month' | 'year') => {
  return useQuery({
    queryKey: ['analytics', 'sales', period],
    queryFn: () => analyticsService.getSalesChart({ period }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useTopProducts = (params?: {
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
}) => {
  return useQuery({
    queryKey: ['analytics', 'top-products', params],
    queryFn: () => analyticsService.getTopProducts(params),
    staleTime: 1000 * 60 * 5,
  });
};

export const useRecentOrders = (limit: number = 10) => {
  return useQuery({
    queryKey: ['analytics', 'recent-orders', limit],
    queryFn: () => analyticsService.getRecentOrders(limit),
    staleTime: 1000 * 60, // 1 minute
  });
};