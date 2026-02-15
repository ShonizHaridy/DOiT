import { useCallback, useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getDashboardNotifications } from '@/services/analytics';

const STORAGE_KEY = 'admin_notifications_last_read_at';
const DEFAULT_LAST_READ_AT = '1970-01-01T00:00:00.000Z';

const nowIso = () => new Date().toISOString();

const getLatestIso = (a: string, b?: string) => {
  if (!b) return a;
  const aDate = new Date(a);
  const bDate = new Date(b);
  if (Number.isNaN(aDate.getTime())) return b;
  if (Number.isNaN(bDate.getTime())) return a;
  return aDate >= bDate ? a : b;
};

export const useAdminNotifications = () => {
  const queryClient = useQueryClient();
  const [lastReadAt, setLastReadAt] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setLastReadAt(stored);
      return;
    }
    setLastReadAt(DEFAULT_LAST_READ_AT);
  }, []);

  const query = useQuery({
    queryKey: ['admin', 'dashboard', 'notifications', lastReadAt ?? 'init'],
    queryFn: () => getDashboardNotifications(lastReadAt ?? undefined),
    enabled: lastReadAt !== null,
    refetchInterval: 30000,
  });

  const markAllAsRead = useCallback(() => {
    const now = nowIso();
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, now);
    }
    setLastReadAt(now);
    queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard', 'notifications'] });
  }, [queryClient]);

  const markAsRead = useCallback(
    (createdAt?: string) => {
      const next = getLatestIso(nowIso(), createdAt);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, next);
      }
      setLastReadAt(next);
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard', 'notifications'] });
    },
    [queryClient]
  );

  return {
    ...query,
    unread: query.data?.unread ?? { orders: 0, customers: 0, offers: 0, total: 0 },
    items: query.data?.items ?? [],
    markAllAsRead,
    markAsRead,
    lastReadAt,
  };
};
