'use client'

import AdminLayout from '@/components/admin/AdminLayout'
import StatCard from '@/components/admin/StatCard'
import MetricCard from '@/components/admin/MetricCard'
import TopSellingCategory from '@/components/admin/TopSellingCategory'
import BestSellingProducts from '@/components/admin/BestSellingProducts'

// Sample chart data
const ordersChartData = [
  { value: 20 }, { value: 35 }, { value: 25 }, { value: 45 }, 
  { value: 40 }, { value: 55 }, { value: 50 }, { value: 60 }
]

const profitChartData = [
  { value: 30 }, { value: 45 }, { value: 35 }, { value: 50 }, 
  { value: 45 }, { value: 55 }, { value: 60 }, { value: 65 }
]

const discountChartData = [
  { value: 50 }, { value: 45 }, { value: 55 }, { value: 40 }, 
  { value: 35 }, { value: 45 }, { value: 30 }, { value: 25 }
]

export default function DashboardPage() {
  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            value="510" 
            label="Total products" 
          />
          <StatCard 
            value="350" 
            label="Active Orders" 
          />
          <StatCard 
            value="2370" 
            label="Total customers" 
          />
          <StatCard 
            value="120,365" 
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
            value="25.7K"
            percentChange={6}
            chartData={ordersChartData}
            chartColor="green"
          />
          <MetricCard
            title="Total Profit"
            subtitle="Last 7 days"
            value="50K"
            percentChange={12}
            chartData={profitChartData}
            chartColor="green"
          />
          <MetricCard
            title="Discounted Amount"
            subtitle="Last 7 days"
            value="12K"
            percentChange={2}
            chartData={discountChartData}
            chartColor="red"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TopSellingCategory />
          <BestSellingProducts />
        </div>
      </div>
    </AdminLayout>
  )
}
