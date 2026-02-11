'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DataTable, { Column } from '@/components/admin/DataTable'
import Pagination from '@/components/admin/Pagination'
import SearchInput from '@/components/admin/SearchInput'
import FilterButton from '@/components/admin/FilterButton'
import ExportButton from '@/components/admin/ExportButton'
import StatusBadge, { getStatusVariant } from '@/components/admin/StatusBadge'
import { useAllOrders } from '@/hooks/useOrders'
import type { AdminOrder, OrderStatus } from '@/types/order'

const statusLabel = (status: string) => {
  const value = status.toUpperCase()
  if (value === 'ORDER_PLACED') return 'Order Placed'
  if (value === 'PROCESSED') return 'Processed'
  if (value === 'SHIPPED') return 'Shipped'
  if (value === 'DELIVERED') return 'Delivered'
  if (value === 'CANCELLED') return 'Cancelled'
  return status
}

const formatDate = (value?: string) => {
  if (!value) return '---'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '---' : date.toLocaleDateString()
}

function CustomerCell({ name, detail }: { name: string; detail: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-neutral-200 rounded-full overflow-hidden flex-shrink-0">
        <div className="w-full h-full bg-neutral-300 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-neutral-500">
            <circle cx="10" cy="8" r="3" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M4 18C4 14.6863 6.68629 12 10 12C13.3137 12 16 14.6863 16 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
      <div>
        <p className="font-medium text-neutral-900">{name}</p>
        <p className="text-xs text-neutral-400">{detail}</p>
      </div>
    </div>
  )
}

function ShowLink({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-sm text-primary hover:text-red-700 font-medium"
    >
      Show
    </button>
  )
}

export default function OrdersPage() {
  const router = useRouter()
  const [allOrdersPage, setAllOrdersPage] = useState(1)
  const [allOrdersSearch, setAllOrdersSearch] = useState('')
  const pageSize = 10

  const { data, isLoading, isError } = useAllOrders({
    page: allOrdersPage,
    limit: pageSize,
    search: allOrdersSearch || undefined,
  })

  const allOrders = data?.orders ?? []
  const pagination = data?.pagination

  const allOrdersColumns: Column<AdminOrder>[] = [
    {
      key: 'orderNumber',
      header: 'Order ID',
      width: 'w-[120px]',
    },
    {
      key: 'customer',
      header: 'Customer',
      width: 'min-w-[180px]',
      render: (order) => (
        <CustomerCell
          name={order.customer?.fullName ?? '---'}
          detail={order.customer?.email ?? '---'}
        />
      )
    },
    {
      key: 'status',
      header: 'Status',
      width: 'w-[120px]',
      render: (order) => {
        const label = statusLabel(order.status)
        return (
          <StatusBadge
            label={label}
            variant={getStatusVariant(label)}
          />
        )
      }
    },
    {
      key: 'createdAt',
      header: 'Created',
      width: 'w-[110px]',
      render: (order) => formatDate(order.createdAt),
    },
    {
      key: 'itemsCount',
      header: 'Items',
      width: 'w-[80px]',
      render: (order) => order.itemsCount ?? order.items?.length ?? 0,
    },
    {
      key: 'total',
      header: 'Total',
      width: 'w-[120px]',
      render: (order) => `${order.total.toLocaleString()} ${order.currency ?? 'EGP'}`,
    },
    {
      key: 'details',
      header: 'Details',
      width: 'w-[80px]',
      render: (order) => <ShowLink onClick={() => router.push(`/admin/orders/${order.id}`)} />
    }
  ]

  return (
      <div className="p-6 space-y-8">
        <div className="bg-white rounded-lg">
          <div className="flex items-center justify-between p-6 pb-4">
            <h1 className="text-2xl font-semibold text-neutral-900">All Orders</h1>
            <div className="flex items-center gap-3">
              <SearchInput
                placeholder="Search"
                value={allOrdersSearch}
                onChange={setAllOrdersSearch}
                className="w-56"
              />
              <FilterButton onClick={() => undefined} />
              <ExportButton onClick={() => undefined} />
            </div>
          </div>

          <DataTable
            columns={allOrdersColumns}
            data={allOrders}
            keyExtractor={(order) => order.id}
            emptyMessage={isLoading ? 'Loading orders...' : isError ? 'Failed to load orders' : 'No orders found'}
          />

          <div className="p-6 pt-4">
            <Pagination
              currentPage={pagination?.page ?? allOrdersPage}
              totalPages={pagination?.totalPages ?? 1}
              totalItems={pagination?.total ?? 0}
              itemsPerPage={pagination?.limit ?? pageSize}
              onPageChange={setAllOrdersPage}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg">
          <div className="flex items-center justify-between p-6 pb-4">
            <h1 className="text-2xl font-semibold text-neutral-900">Custom Made Orders</h1>
            <div className="flex items-center gap-3">
              <SearchInput placeholder="Search" value="" onChange={() => undefined} className="w-56" />
              <FilterButton onClick={() => undefined} />
              <ExportButton onClick={() => undefined} />
            </div>
          </div>

          <DataTable
            columns={allOrdersColumns}
            data={[]}
            keyExtractor={(order) => order.id}
            emptyMessage="Custom orders are not available yet"
          />

          <div className="p-6 pt-4">
            <Pagination
              currentPage={1}
              totalPages={1}
              totalItems={0}
              itemsPerPage={pageSize}
              onPageChange={() => undefined}
            />
          </div>
        </div>
      </div>
  )
}
