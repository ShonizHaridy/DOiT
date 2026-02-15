import { apiClient } from '@/lib/axios-client';
import type {
  DashboardOverview,
  DashboardRecentActivity,
  AdminNotifications,
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

export const getDashboardNotifications = async (
  since?: string
): Promise<AdminNotifications> => {
  const { data } = await apiClient.get<AdminNotifications>(
    '/admin/dashboard/notifications',
    {
      params: since ? { since } : undefined,
    }
  );
  return data;
};
