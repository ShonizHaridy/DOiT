export interface DashboardOverviewMetrics {
  totalProducts: number;
  activeOrders: number;
  totalCustomers: number;
  totalEarnings: number;
  previousPeriodComparison: {
    products: number;
    orders: number;
    customers: number;
    earnings: number;
  };
}

export interface DashboardOverviewCharts {
  totalOrdersSeries: Array<{
    date: string;
    count: number;
  }>;
  totalProfitSeries: Array<{
    date: string;
    profit: number;
  }>;
  discountedAmountSeries: Array<{
    date: string;
    discount: number;
  }>;
}

export interface DashboardOverview {
  metrics: DashboardOverviewMetrics;
  charts: DashboardOverviewCharts;
  topSellingCategories: Array<{
    name: string;
    value: number;
    percentage: number;
  }>;
  bestSellingProducts: Array<{
    id: string;
    name: string;
    sku: string;
    totalOrders: number;
    stockStatus: string;
    image: string;
  }>;
}

export interface DashboardRecentActivity {
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customerName: string;
    total: number;
    status: string;
    createdAt: string;
  }>;
  recentCustomers: Array<{
    id: string;
    fullName: string;
    email: string;
    createdAt: string;
  }>;
  lowStockProducts: Array<{
    id: string;
    name: string;
    sku: string;
    totalStock: number;
  }>;
}

export interface AdminNotificationItem {
  id: string;
  type: 'order' | 'customer' | 'offer';
  title: string;
  description: string;
  href: string;
  createdAt: string;
}

export interface AdminNotifications {
  unread: {
    orders: number;
    customers: number;
    offers: number;
    total: number;
  };
  items: AdminNotificationItem[];
}
