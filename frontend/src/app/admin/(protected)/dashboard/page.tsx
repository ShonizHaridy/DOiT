'use client'

import StatCard from '@/components/admin/StatCard'
import MetricCard from '@/components/admin/MetricCard'
import TopSellingCategory from '@/components/admin/TopSellingCategory'
import BestSellingProducts from '@/components/admin/BestSellingProducts'
import { useDashboardOverview } from '@/hooks/useAnalytics'

export default function DashboardPage() {
  const { data, isLoading } = useDashboardOverview()
  const metrics = data?.metrics
  const ordersSeries = data?.charts.totalOrdersSeries ?? []
  const profitSeries = data?.charts.totalProfitSeries ?? []
  const discountSeries = data?.charts.discountedAmountSeries ?? []

  const ordersChartData = ordersSeries.map((item) => ({ value: item.count }))
  const profitChartData = profitSeries.map((item) => ({ value: item.profit }))
  const discountChartData = discountSeries.map((item) => ({ value: item.discount }))

  const totalOrdersValue = ordersSeries.reduce((sum, item) => sum + item.count, 0)
  const totalProfitValue = profitSeries.reduce((sum, item) => sum + item.profit, 0)
  const totalDiscountValue = discountSeries.reduce((sum, item) => sum + item.discount, 0)

  const ordersChange = metrics?.previousPeriodComparison.orders ?? 0
  const profitChange = metrics?.previousPeriodComparison.earnings ?? 0

  return (
      <div className="flex flex-col gap-6">
        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            value={metrics ? metrics.totalProducts.toLocaleString() : (isLoading ? '...' : '0')}
            label="Total products" 
          />
          <StatCard 
            value={metrics ? metrics.activeOrders.toLocaleString() : (isLoading ? '...' : '0')}
            label="Active Orders" 
          />
          <StatCard 
            value={metrics ? metrics.totalCustomers.toLocaleString() : (isLoading ? '...' : '0')}
            label="Total customers" 
          />
          <StatCard 
            value={metrics ? metrics.totalEarnings.toLocaleString() : (isLoading ? '...' : '0')}
            suffix="EPG"
            label="Total Earnings" 
            variant="highlight"
          />
        </div>

        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            title="Total Orders"
            subtitle="Last 7 days"
            value={totalOrdersValue ? totalOrdersValue.toLocaleString() : (isLoading ? '...' : '0')}
            percentChange={ordersChange}
            chartData={ordersChartData}
            chartColor="green"
          />
          <MetricCard
            title="Total Profit"
            subtitle="Last 7 days"
            value={totalProfitValue ? totalProfitValue.toLocaleString() : (isLoading ? '...' : '0')}
            percentChange={profitChange}
            chartData={profitChartData}
            chartColor={profitChange >= 0 ? 'green' : 'red'}
          />
          <MetricCard
            title="Discounted Amount"
            subtitle="Last 7 days"
            value={totalDiscountValue ? totalDiscountValue.toLocaleString() : (isLoading ? '...' : '0')}
            percentChange={0}
            chartData={discountChartData}
            chartColor="red"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TopSellingCategory categories={data?.topSellingCategories ?? []} />
          <BestSellingProducts
            products={(data?.bestSellingProducts ?? []).map((product) => ({
              id: product.id,
              name: product.name,
              totalOrders: product.totalOrders,
              stockStatus: product.stockStatus,
            }))}
          />
        </div>
      </div>
  )
}
