'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DataTable, { Column } from '@/components/admin/DataTable'
import Pagination from '@/components/admin/Pagination'
import SearchInput from '@/components/admin/SearchInput'
import FilterButton, { type FilterSection, type FilterValues } from '@/components/admin/FilterButton'
import ExportButton from '@/components/admin/ExportButton'
import StatusBadge, { getStatusVariant } from '@/components/admin/StatusBadge'
import { useAllOrders, useAdminCustomOrders } from '@/hooks/useOrders'
import { downloadCsvBlob, exportCsv } from '@/lib/export-csv'
import { exportAllCustomOrdersCsv, exportAllOrdersCsv } from '@/services/orders'
import type { AdminOrder, AdminCustomOrder, OrderStatus, CustomOrderStatus } from '@/types/order'
import { User } from 'iconsax-reactjs'

type UiOrderStatus = 'NEW' | 'IN_PROGRESS' | 'SHIPPED' | 'COMPLETED' | 'CANCELED'

const UI_STATUS_BADGES: Array<{
  value: UiOrderStatus
  label: string
  badgeVariant: 'success' | 'default' | 'warning' | 'info' | 'error'
}> = [
  { value: 'COMPLETED', label: 'Completed', badgeVariant: 'success' },
  { value: 'NEW', label: 'New', badgeVariant: 'default' },
  { value: 'IN_PROGRESS', label: 'In progress', badgeVariant: 'warning' },
  { value: 'SHIPPED', label: 'Shipped', badgeVariant: 'info' },
  { value: 'CANCELED', label: 'Canceled', badgeVariant: 'error' },
]

const ORDER_UI_TO_API: Record<UiOrderStatus, OrderStatus> = {
  NEW: 'ORDER_PLACED',
  IN_PROGRESS: 'PROCESSED',
  SHIPPED: 'SHIPPED',
  COMPLETED: 'DELIVERED',
  CANCELED: 'CANCELLED',
}

const CUSTOM_UI_TO_API: Record<UiOrderStatus, CustomOrderStatus> = {
  NEW: 'PENDING',
  IN_PROGRESS: 'APPROVED',
  SHIPPED: 'IN_PRODUCTION',
  COMPLETED: 'COMPLETED',
  CANCELED: 'CANCELLED',
}

const statusLabel = (status: string) => {
  const value = status.toUpperCase()
  if (value === 'ORDER_PLACED' || value === 'PENDING') return 'New'
  if (value === 'PROCESSED' || value === 'APPROVED') return 'In progress'
  if (value === 'SHIPPED' || value === 'IN_PRODUCTION') return 'Shipped'
  if (value === 'DELIVERED' || value === 'COMPLETED') return 'Completed'
  if (value === 'CANCELLED') return 'Canceled'
  return status
}

const orderFilterSections: FilterSection[] = [
  {
    key: 'status',
    title: 'Status',
    showBadge: true,
    options: UI_STATUS_BADGES,
  },
]

const customOrderFilterSections: FilterSection[] = [
  {
    key: 'status',
    title: 'Status',
    showBadge: true,
    options: UI_STATUS_BADGES,
  },
]

const formatDate = (value?: string) => {
  if (!value) return '---'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '---' : date.toLocaleDateString()
}

const createExportFilename = (prefix: string) => {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  return `${prefix}-${stamp}.csv`
}

function CustomerCell({ name, detail }: { name: string; detail: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-neutral-200 rounded-full overflow-hidden flex-shrink-0">
        <div className="w-full h-full bg-neutral-300 flex items-center justify-center">
          <User size={22} className="text-neutral-500" />
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
      type="button"
      onClick={onClick}
      className="text-sm text-blue-500 underline hover:text-red-700 font-medium cursor-pointer"
    >
      Show
    </button>
  )
}

export default function OrdersPage() {
  const router = useRouter()
  const [allOrdersPage, setAllOrdersPage] = useState(1)
  const [allOrdersSearch, setAllOrdersSearch] = useState('')
  const [allOrdersFilters, setAllOrdersFilters] = useState<FilterValues>({})
  const [customOrdersPage, setCustomOrdersPage] = useState(1)
  const [customOrdersSearch, setCustomOrdersSearch] = useState('')
  const [customOrdersFilters, setCustomOrdersFilters] = useState<FilterValues>({})
  const [isExportingAllOrders, setIsExportingAllOrders] = useState(false)
  const [isExportingCustomOrders, setIsExportingCustomOrders] = useState(false)
  const pageSize = 10

  const selectedStatuses = (allOrdersFilters.status ?? []) as UiOrderStatus[]
  const selectedCustomStatuses = (customOrdersFilters.status ?? []) as UiOrderStatus[]
  const apiStatus = selectedStatuses.length === 1 ? ORDER_UI_TO_API[selectedStatuses[0]] : undefined
  const customApiStatus = selectedCustomStatuses.length === 1
    ? CUSTOM_UI_TO_API[selectedCustomStatuses[0]]
    : undefined

  const { data, isLoading, isError } = useAllOrders({
    page: allOrdersPage,
    limit: pageSize,
    search: allOrdersSearch || undefined,
    status: apiStatus,
  })
  const {
    data: customData,
    isLoading: isCustomLoading,
    isError: isCustomError,
  } = useAdminCustomOrders({
    page: customOrdersPage,
    limit: pageSize,
    search: customOrdersSearch || undefined,
    status: customApiStatus,
  })

  const allOrders = data?.orders ?? []
  const filteredAllOrders = selectedStatuses.length
    ? allOrders.filter((order) =>
      selectedStatuses.some((status) => ORDER_UI_TO_API[status] === order.status)
    )
    : allOrders
  const usingLocalStatusFilter = selectedStatuses.length > 1
  const pagination = data?.pagination

  const customOrders = customData?.orders ?? []
  const filteredCustomOrders = selectedCustomStatuses.length
    ? customOrders.filter((order) =>
      selectedCustomStatuses.some((status) => CUSTOM_UI_TO_API[status] === order.status)
    )
    : customOrders
  const usingLocalCustomStatusFilter = selectedCustomStatuses.length > 1
  const customPagination = customData?.pagination

  const exportCurrentAllOrdersPage = () => {
    const headers = [
      'Order Number',
      'Customer Name',
      'Customer Email',
      'Status',
      'Items',
      'Total',
      'Currency',
      'Created',
    ]
    const rows = filteredAllOrders.map((order) => [
      order.orderNumber,
      order.customer?.fullName ?? '',
      order.customer?.email ?? '',
      statusLabel(order.status),
      order.itemsCount ?? order.items?.length ?? 0,
      Number(order.total).toFixed(2),
      order.currency ?? 'EGP',
      order.createdAt ? new Date(order.createdAt).toISOString() : '',
    ])

    exportCsv(createExportFilename('orders-current-page'), headers, rows)
  }

  const exportCurrentCustomOrdersPage = () => {
    const headers = [
      'Order Number',
      'Customer Name',
      'Customer Email',
      'Status',
      'Product Type',
      'Color',
      'Gender',
      'Size',
      'Quantity',
      'Total',
      'Created',
    ]
    const rows = filteredCustomOrders.map((order) => [
      order.orderNumber,
      order.customer?.fullName ?? (order.customerId.startsWith('guest-') ? 'Guest' : order.customerId),
      order.customer?.email ?? '',
      statusLabel(order.status),
      order.productType,
      order.color,
      order.gender,
      order.size,
      order.quantity,
      order.total ?? '',
      order.createdAt ? new Date(order.createdAt).toISOString() : '',
    ])

    exportCsv(createExportFilename('custom-orders-current-page'), headers, rows)
  }

  const exportAllOrdersFiltered = async () => {
    setIsExportingAllOrders(true)
    try {
      const statusParam = selectedStatuses.length
        ? selectedStatuses.map((status) => ORDER_UI_TO_API[status]).join(',')
        : undefined
      const blob = await exportAllOrdersCsv({
        search: allOrdersSearch || undefined,
        status: statusParam,
      })
      downloadCsvBlob(createExportFilename('orders-all-filtered'), blob)
    } finally {
      setIsExportingAllOrders(false)
    }
  }

  const exportAllCustomOrdersFiltered = async () => {
    setIsExportingCustomOrders(true)
    try {
      const statusParam = selectedCustomStatuses.length
        ? selectedCustomStatuses.map((status) => CUSTOM_UI_TO_API[status]).join(',')
        : undefined
      const blob = await exportAllCustomOrdersCsv({
        search: customOrdersSearch || undefined,
        status: statusParam,
      })
      downloadCsvBlob(createExportFilename('custom-orders-all-filtered'), blob)
    } finally {
      setIsExportingCustomOrders(false)
    }
  }

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

  const customOrdersColumns: Column<AdminCustomOrder>[] = [
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
          name={order.customer?.fullName ?? (order.customerId.startsWith('guest-') ? 'Guest' : order.customerId)}
          detail={order.customer?.email ?? order.customerId}
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
      key: 'quantity',
      header: 'Qty',
      width: 'w-[80px]',
    },
    {
      key: 'total',
      header: 'Total',
      width: 'w-[120px]',
      render: (order) =>
        order.total !== undefined ? `${order.total.toLocaleString()} EGP` : '---',
    },
    {
      key: 'details',
      header: 'Details',
      width: 'w-[80px]',
      render: (order) => <ShowLink onClick={() => router.push(`/admin/orders/custom/${order.id}`)} />
    }
  ]

  return (
    <div className="p-6 space-y-8">
      <div className="bg-white rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-neutral-900">All Orders</h1>
          <div className="flex items-center gap-3">
            <SearchInput
              placeholder="Search"
              value={allOrdersSearch}
              onChange={setAllOrdersSearch}
              className="w-56"
            />
            <FilterButton
              sections={orderFilterSections}
              value={allOrdersFilters}
              onApply={(next) => {
                setAllOrdersFilters(next)
                setAllOrdersPage(1)
              }}
              onReset={() => {
                setAllOrdersFilters({})
                setAllOrdersPage(1)
              }}
            />
            <ExportButton
              onExportCurrentPage={exportCurrentAllOrdersPage}
              onExportAllFiltered={exportAllOrdersFiltered}
              allFilteredLabel={isExportingAllOrders ? 'All (filtered) - exporting...' : 'All (filtered)'}
            />
          </div>
        </div>

        <DataTable
          columns={allOrdersColumns}
          data={filteredAllOrders}
          keyExtractor={(order) => order.id}
          emptyMessage={isLoading ? 'Loading orders...' : isError ? 'Failed to load orders' : 'No orders found'}
        />

        <div className="pt-4">
          <Pagination
            currentPage={usingLocalStatusFilter ? 1 : (pagination?.page ?? allOrdersPage)}
            totalPages={usingLocalStatusFilter ? 1 : (pagination?.totalPages ?? 1)}
            totalItems={usingLocalStatusFilter ? filteredAllOrders.length : (pagination?.total ?? 0)}
            itemsPerPage={pagination?.limit ?? pageSize}
            onPageChange={setAllOrdersPage}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-neutral-900">Custom Made Orders</h1>
          <div className="flex items-center gap-3">
            <SearchInput
              placeholder="Search"
              value={customOrdersSearch}
              onChange={setCustomOrdersSearch}
              className="w-56"
            />
            <FilterButton
              sections={customOrderFilterSections}
              value={customOrdersFilters}
              onApply={(next) => {
                setCustomOrdersFilters(next)
                setCustomOrdersPage(1)
              }}
              onReset={() => {
                setCustomOrdersFilters({})
                setCustomOrdersPage(1)
              }}
            />
            <ExportButton
              onExportCurrentPage={exportCurrentCustomOrdersPage}
              onExportAllFiltered={exportAllCustomOrdersFiltered}
              allFilteredLabel={isExportingCustomOrders ? 'All (filtered) - exporting...' : 'All (filtered)'}
            />
          </div>
        </div>

        <DataTable
          columns={customOrdersColumns}
          data={filteredCustomOrders}
          keyExtractor={(order) => order.id}
          emptyMessage={isCustomLoading ? 'Loading custom orders...' : isCustomError ? 'Failed to load custom orders' : 'No custom orders found'}
        />

        <div className="pt-4">
          <Pagination
            currentPage={usingLocalCustomStatusFilter ? 1 : (customPagination?.page ?? customOrdersPage)}
            totalPages={usingLocalCustomStatusFilter ? 1 : (customPagination?.totalPages ?? 1)}
            totalItems={usingLocalCustomStatusFilter ? filteredCustomOrders.length : (customPagination?.total ?? 0)}
            itemsPerPage={customPagination?.limit ?? pageSize}
            onPageChange={setCustomOrdersPage}
          />
        </div>
      </div>
    </div>
  )
}
