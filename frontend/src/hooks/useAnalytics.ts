import { useQuery } from '@tanstack/react-query';
import * as analyticsService from '@/services/analytics';

export const useDashboardOverview = () => {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'overview'],
    queryFn: () => analyticsService.getDashboardOverview(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useDashboardRecentActivity = () => {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'recent-activity'],
    queryFn: () => analyticsService.getDashboardRecentActivity(),
    staleTime: 1000 * 60, // 1 minute
  });
};
