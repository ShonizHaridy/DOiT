'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DataTable, { Column } from '@/components/admin/DataTable'
import Pagination from '@/components/admin/Pagination'
import SearchInput from '@/components/admin/SearchInput'
import FilterButton, { type FilterSection, type FilterValues } from '@/components/admin/FilterButton'
import ActionButtons from '@/components/admin/ActionButtons'
import StatusBadge, { getStatusVariant } from '@/components/admin/StatusBadge'
import { useAllCustomers, useUpdateCustomerStatus } from '@/hooks/useCustomer'
import type { CustomerListItem } from '@/types/customer'
import { Slash, UserTick } from 'iconsax-reactjs'

const statusLabel = (status: string) => {
  if (status === 'ACTIVE') return 'Active'
  if (status === 'BLOCKED') return 'Blocked'
  return status
}

const customerFilterSections: FilterSection[] = [
  {
    key: 'status',
    title: 'Status',
    showBadge: true,
    options: [
      { value: 'active', label: 'Active', badgeVariant: 'success' },
      { value: 'blocked', label: 'Blocked', badgeVariant: 'error' },
    ],
  },
]

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

function BlockButton({ isBlocked, onClick }: { isBlocked: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer p-1.5 text-red-500 hover:text-red-600 transition-colors"
      title={isBlocked ? 'Unblock user' : 'Block user'}
    >
      {isBlocked ? (
        <UserTick size={20} color='green' />
      ) : (
        <Slash size={20} color='red' />
      )}
    </button>
  )
}

export default function CustomersPage() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [customerFilters, setCustomerFilters] = useState<FilterValues>({})
  const pageSize = 10
  const selectedStatuses = customerFilters.status ?? []
  const apiStatus = selectedStatuses.length === 1 ? selectedStatuses[0] as 'active' | 'blocked' : 'all'

  const { data, isLoading, isError } = useAllCustomers({
    page: currentPage,
    limit: pageSize,
    search: searchQuery || undefined,
    status: apiStatus,
  })

  const { mutateAsync } = useUpdateCustomerStatus()
  const customers = data?.customers ?? []
  const pagination = data?.pagination

  const handleToggleBlock = async (customer: CustomerListItem) => {
    const nextStatus = customer.status === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED'
    await mutateAsync({ id: customer.id, status: nextStatus })
  }

  const columns: Column<CustomerListItem>[] = [
    {
      key: 'customer',
      header: 'Customer',
      width: 'min-w-[180px]',
      render: (customer) => (
        <CustomerCell name={customer.fullName} detail={customer.email} />
      )
    },
    {
      key: 'lastLogin',
      header: 'Last Log in',
      width: 'w-[150px]',
      render: (customer) => formatDate(customer.lastLogin),
    },
    {
      key: 'status',
      header: 'Status',
      width: 'w-[100px]',
      render: (customer) => {
        const label = statusLabel(customer.status)
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
      render: (customer) => formatDate(customer.createdAt),
    },
    {
      key: 'totalOrders',
      header: 'Orders',
      width: 'w-[80px]',
    },
    {
      key: 'totalSpending',
      header: 'Spending',
      width: 'w-[120px]',
      render: (customer) => `${customer.totalSpending.toLocaleString()} EGP`,
    },
    {
      key: 'action',
      header: 'Action',
      width: 'w-[120px]',
      render: (customer) => (
        <ActionButtons
          showEdit={false}
          showDelete={false}
          onView={() => router.push(`/admin/customers/${customer.id}`)}
          extraActions={
            <BlockButton
              isBlocked={customer.status === 'BLOCKED'}
              onClick={() => handleToggleBlock(customer)}
            />
          }
        />
      )
    }
  ]

  return (
      <div className="p-6">
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold text-neutral-900">All Customers</h1>
            <div className="flex items-center gap-3">
              <SearchInput
                placeholder="Search"
                value={searchQuery}
                onChange={setSearchQuery}
                className="w-64"
              />
              <FilterButton
                sections={customerFilterSections}
                value={customerFilters}
                onApply={(next) => {
                  setCustomerFilters(next)
                  setCurrentPage(1)
                }}
                onReset={() => {
                  setCustomerFilters({})
                  setCurrentPage(1)
                }}
              />
            </div>
          </div>

          <DataTable
            columns={columns}
            data={customers}
            keyExtractor={(customer) => customer.id}
            emptyMessage={isLoading ? 'Loading customers...' : isError ? 'Failed to load customers' : 'No customers found'}
          />

          <div className="pt-4">
            <Pagination
              currentPage={pagination?.page ?? currentPage}
              totalPages={pagination?.totalPages ?? 1}
              totalItems={pagination?.total ?? 0}
              itemsPerPage={pagination?.limit ?? pageSize}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
  )
}
