export interface DashboardStats {
  // Revenue stats
  totalRevenue: number;
  revenueGrowth: number; // percentage
  
  // Order stats
  totalOrders: number;
  ordersGrowth: number;
  pendingOrders: number;
  
  // Customer stats
  totalCustomers: number;
  customersGrowth: number;
  activeCustomers: number;
  
  // Product stats
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  
  // Period comparison
  comparisonPeriod: 'day' | 'week' | 'month' | 'year';
}

export interface SalesDataPoint {
  date: string;
  sales: number;
  orders: number;
}

export interface SalesChart {
  period: 'week' | 'month' | 'year';
  data: SalesDataPoint[];
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
}

export interface TopProduct {
  id: string;
  nameEn: string;
  nameAr: string;
  sku: string;
  vendor: string;
  totalSold: number;
  revenue: number;
  imageUrl: string;
}

export interface TopProducts {
  products: TopProduct[];
  period: {
    dateFrom?: string;
    dateTo?: string;
  };
}

export interface RecentOrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: string;
  createdAt: Date;
}

export interface RecentOrders {
  orders: RecentOrderItem[];
  limit: number;
}