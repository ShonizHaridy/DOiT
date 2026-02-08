// ============================================
// DTOs
// ============================================

export class DashboardOverviewDto {
  metrics: {
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
  };
  charts: {
    totalOrdersSeries: { date: string; count: number }[];
    totalProfitSeries: { date: string; profit: number }[];
    discountedAmountSeries: { date: string; discount: number }[];
  };
  topSellingCategories: {
    name: string;
    value: number;
    percentage: number;
  }[];
  bestSellingProducts: {
    id: string;
    name: string;
    sku: string;
    totalOrders: number;
    stockStatus: string;
    image: string;
  }[];
}

