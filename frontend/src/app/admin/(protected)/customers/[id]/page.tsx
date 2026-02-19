'use client'

import { useMemo, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Slash } from 'iconsax-reactjs'
import DataTable, { Column } from '@/components/admin/DataTable'
import Pagination from '@/components/admin/Pagination'
import SearchInput from '@/components/admin/SearchInput'
import FilterButton from '@/components/admin/FilterButton'
import StatusBadge, { getStatusVariant } from '@/components/admin/StatusBadge'
import { useCustomerById, useCustomerOrders, useUpdateCustomerStatus } from '@/hooks/useCustomer'

const formatDate = (value?: string | Date | null) => {
  if (!value) return '---'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '---' : date.toLocaleDateString()
}

const statusLabel = (status: string) => {
  if (status === 'ACTIVE') return 'Active'
  if (status === 'BLOCKED') return 'Blocked'
  return status
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

export default function CustomerDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const customerId = params?.id as string
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const pageSize = 10

  const { data: customer, isLoading } = useCustomerById(customerId)
  const { data: ordersData, isLoading: isOrdersLoading } = useCustomerOrders(customerId, {
    page: currentPage,
    limit: pageSize,
  })
  const { mutateAsync } = useUpdateCustomerStatus()

  const orders = useMemo(() => {
    const list = ordersData?.orders ?? []
    if (!searchQuery) return list
    return list.filter((order) =>
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [ordersData?.orders, searchQuery])

  const columns: Column<typeof orders[number]>[] = [
    { key: 'orderNumber', header: 'Order ID', width: 'w-[120px]' },
    {
      key: 'status',
      header: 'Status',
      width: 'w-[120px]',
      render: (order) => {
        const label = order.status.replace('_', ' ')
        return <StatusBadge label={label} variant={getStatusVariant(label)} />
      },
    },
    { key: 'createdAt', header: 'Created', width: 'w-[120px]', render: (order) => formatDate(order.createdAt) },
    { key: 'itemsCount', header: 'Items', width: 'w-[80px]' },
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
      render: (order) => <ShowLink onClick={() => router.push(`/admin/orders/${order.id}`)} />,
    },
  ]

  const handleToggleBlock = async () => {
    if (!customer) return
    const nextStatus = customer.status === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED'
    await mutateAsync({ id: customer.id, status: nextStatus })
  }

  if (isLoading || !customer) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg p-6 text-sm text-neutral-500">
          Loading customer details...
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/customers')}
            className="p-1 text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold text-neutral-900">Customer Details</h1>
        </div>
        <button
          onClick={handleToggleBlock}
          className="inline-flex items-center gap-2 px-4 h-10 rounded-lg border border-secondary text-sm font-medium text-secondary hover:bg-red-50 transition-colors cursor-pointer"
        >
          {/* <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5" />
            <path d="M4 14L14 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg> */}
          <Slash size={16} className="text-secondary" />
          {customer.status === 'BLOCKED' ? 'Unblock Customer' : 'Block Customer'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-neutral-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-sm font-semibold text-neutral-900">Name</div>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-neutral-200 rounded-full flex items-center justify-center flex-shrink-0">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-neutral-500">
                <circle cx="6" cy="4.5" r="2" stroke="currentColor" strokeWidth="1" />
                <path d="M2 11C2 8.79 3.79 7 6 7C8.21 7 10 8.79 10 11" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-sm text-neutral-700">{customer.fullName}</span>
          </div>
          <div className="text-sm font-semibold text-neutral-900 mb-1">Email</div>
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-neutral-400 flex-shrink-0">
              <rect x="1" y="2.5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1" />
              <path d="M1 4L7 8L13 4" stroke="currentColor" strokeWidth="1" />
            </svg>
            <span className="text-sm text-neutral-500">{customer.email}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-neutral-200 p-4 md:col-span-1">
          <div className="text-sm font-semibold text-neutral-900 mb-2">Addresses</div>
          {customer.addresses?.length ? (
            customer.addresses.map((address) => (
              <div key={address.id} className="mb-2">
                <span className="text-sm font-semibold text-neutral-900">{address.label}</span>
                <p className="text-xs text-neutral-500 mt-0.5">{address.fullAddress}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-neutral-500">No addresses</p>
          )}
        </div>

        <div className="bg-white rounded-lg border border-neutral-200 p-4">
          <div className="text-sm font-semibold text-neutral-900 mb-1">Created</div>
          <p className="text-sm text-neutral-500 mb-3">{formatDate(customer.createdAt)}</p>
          <div className="text-sm font-semibold text-neutral-900 mb-1">Last Log in</div>
          <p className="text-sm text-neutral-500">{formatDate(customer.lastLogin)}</p>
        </div>

        <div className="bg-white rounded-lg border border-neutral-200 p-4">
          <div className="text-sm font-semibold text-neutral-900 mb-1">Total Orders</div>
          <p className="text-sm text-neutral-500 mb-3">{customer.totalOrders}</p>
          <div className="text-sm font-semibold text-neutral-900 mb-1">Spending</div>
          <p className="text-sm text-neutral-500">{customer.totalSpending.toLocaleString()} EGP</p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-neutral-900">Orders History</h2>
          <div className="flex items-center gap-3">
            <SearchInput
              placeholder="Search"
              value={searchQuery}
              onChange={setSearchQuery}
              className="w-64"
            />
            <FilterButton onClick={() => undefined} />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={orders}
          keyExtractor={(order) => order.id}
          emptyMessage={isOrdersLoading ? 'Loading orders...' : 'No orders found'}
        />

        <div className="pt-4">
          <Pagination
            currentPage={ordersData?.pagination.page ?? currentPage}
            totalPages={ordersData?.pagination.totalPages ?? 1}
            totalItems={ordersData?.pagination.total ?? 0}
            itemsPerPage={ordersData?.pagination.limit ?? pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  )
}
