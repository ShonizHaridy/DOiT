import { apiClient } from '@/lib/axios-client';
import type {
  DashboardOverview,
  DashboardRecentActivity,
} from '@/types/analytics';

export const getDashboardOverview = async (): Promise<DashboardOverview> => {
  const { data } = await apiClient.get<DashboardOverview>(
    '/admin/dashboard/overview'
  );
  return data;
};

export const getDashboardRecentActivity = async (): Promise<DashboardRecentActivity> => {
  const { data } = await apiClient.get<DashboardRecentActivity>(
    '/admin/dashboard/recent-activity'
  );
  return data;
};
