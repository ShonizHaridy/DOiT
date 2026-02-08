// ============================================
// Service
// ============================================

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DashboardOverviewDto } from './dto/admin-dashboard.dto';

@Injectable()
export class AdminDashboardService {
  constructor(private prisma: PrismaService) {}

  async getOverview(): Promise<DashboardOverviewDto> {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // Current period metrics
    const [
      totalProducts,
      activeOrders,
      totalCustomers,
      earningsData,
      prevEarningsData,
    ] = await Promise.all([
      this.prisma.product.count({ where: { status: 'PUBLISHED' } }),
      this.prisma.order.count({
        where: {
          status: { in: ['ORDER_PLACED', 'PROCESSED', 'SHIPPED'] },
        },
      }),
      this.prisma.customer.count(),
      this.prisma.order.aggregate({
        where: {
          status: 'DELIVERED',
          createdAt: { gte: sevenDaysAgo },
        },
        _sum: { total: true },
      }),
      this.prisma.order.aggregate({
        where: {
          status: 'DELIVERED',
          createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo },
        },
        _sum: { total: true },
      }),
    ]);

    const totalEarnings = Number(earningsData._sum.total || 0);
    const prevEarnings = Number(prevEarningsData._sum.total || 0);

    // Previous period for comparison
    const [prevProducts, prevOrders, prevCustomers] = await Promise.all([
      this.prisma.product.count({
        where: {
          status: 'PUBLISHED',
          createdAt: { lt: sevenDaysAgo },
        },
      }),
      this.prisma.order.count({
        where: {
          createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo },
        },
      }),
      this.prisma.customer.count({
        where: { createdAt: { lt: sevenDaysAgo } },
      }),
    ]);

    // Calculate percentage changes
    const metrics = {
      totalProducts,
      activeOrders,
      totalCustomers,
      totalEarnings,
      previousPeriodComparison: {
        products: this.calculatePercentageChange(totalProducts, prevProducts),
        orders: this.calculatePercentageChange(activeOrders, prevOrders),
        customers: this.calculatePercentageChange(totalCustomers, prevCustomers),
        earnings: this.calculatePercentageChange(totalEarnings, prevEarnings),
      },
    };

    // Get chart data (last 7 days)
    const charts = await this.getChartData(sevenDaysAgo, now);

    // Get top selling categories
    const topSellingCategories = await this.getTopSellingCategories();

    // Get best selling products
    const bestSellingProducts = await this.getBestSellingProducts();

    return {
      metrics,
      charts,
      topSellingCategories,
      bestSellingProducts,
    };
  }

  private async getChartData(startDate: Date, endDate: Date) {
    // Generate date range
    const dates: Date[] = [];
    let current = new Date(startDate);
    while (current <= endDate) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    // Get orders data
    const orders = await this.prisma.order.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
      },
      select: {
        createdAt: true,
        total: true,
        discount: true,
        status: true,
      },
    });

    // Aggregate by date
    const totalOrdersSeries = dates.map((date) => {
      const dateStr = date.toISOString().split('T')[0];
      const count = orders.filter(
        (o) => o.createdAt.toISOString().split('T')[0] === dateStr,
      ).length;
      return { date: dateStr, count };
    });

    const totalProfitSeries = dates.map((date) => {
      const dateStr = date.toISOString().split('T')[0];
      const profit = orders
        .filter(
          (o) =>
            o.createdAt.toISOString().split('T')[0] === dateStr &&
            o.status === 'DELIVERED',
        )
        .reduce((sum, o) => sum + Number(o.total), 0);
      return { date: dateStr, profit };
    });

    const discountedAmountSeries = dates.map((date) => {
      const dateStr = date.toISOString().split('T')[0];
      const discount = orders
        .filter((o) => o.createdAt.toISOString().split('T')[0] === dateStr)
        .reduce((sum, o) => sum + Number(o.discount), 0);
      return { date: dateStr, discount };
    });

    return {
      totalOrdersSeries,
      totalProfitSeries,
      discountedAmountSeries,
    };
  }

  private async getTopSellingCategories() {
    // Get order items with category info
    const orderItems = await this.prisma.orderItem.findMany({
      include: {
        product: {
          include: {
            productList: {
              include: {
                subCategory: {
                  include: {
                    category: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Group by category
    const categoryMap = new Map<string, number>();
    let total = 0;

    orderItems.forEach((item) => {
      const categoryName = item.product?.productList?.subCategory?.category?.nameEn;
      if (categoryName) {
        categoryMap.set(categoryName, (categoryMap.get(categoryName) || 0) + item.quantity);
        total += item.quantity;
      }
    });

    // Convert to array and calculate percentages
    const categories = Array.from(categoryMap.entries())
      .map(([name, value]) => ({
        name,
        value,
        percentage: total > 0 ? (value / total) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 3); // Top 3

    return categories;
  }

  private async getBestSellingProducts() {
    const products = await this.prisma.product.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        orderItems: true,
        images: {
          take: 1,
          orderBy: { order: 'asc' },
        },
        variants: true,
      },
      orderBy: {
        orderItems: {
          _count: 'desc',
        },
      },
      take: 5,
    });

    return products.map((product) => {
      const totalStock = product.variants.reduce((sum, v) => sum + v.quantity, 0);
      let stockStatus: string;
      if (totalStock === 0) stockStatus = 'Out of Stock';
      else if (totalStock <= 10) stockStatus = 'Low Stock';
      else stockStatus = 'In Stock';

      return {
        id: product.id,
        name: product.nameEn,
        sku: product.sku,
        totalOrders: product.orderItems.length,
        stockStatus,
        image: product.images[0]?.url || '',
      };
    });
  }

  private calculatePercentageChange(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Number((((current - previous) / previous) * 100).toFixed(2));
  }

  async getRecentActivity() {
    const [recentOrders, recentCustomers, lowStockProducts] = await Promise.all([
      this.prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: {
            select: { fullName: true, email: true },
          },
        },
      }),
      this.prisma.customer.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          fullName: true,
          email: true,
          createdAt: true,
        },
      }),
      this.prisma.product.findMany({
        where: {
          status: 'PUBLISHED',
          variants: {
            some: {
              quantity: { lte: 10 },
            },
          },
        },
        take: 5,
        include: {
          variants: true,
        },
      }),
    ]);

    return {
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customer.fullName,
        total: Number(order.total),
        status: order.status,
        createdAt: order.createdAt,
      })),
      recentCustomers,
      lowStockProducts: lowStockProducts.map((product) => ({
        id: product.id,
        name: product.nameEn,
        sku: product.sku,
        totalStock: product.variants.reduce((sum, v) => sum + v.quantity, 0),
      })),
    };
  }
}

