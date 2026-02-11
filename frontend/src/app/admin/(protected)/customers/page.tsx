'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DataTable, { Column } from '@/components/admin/DataTable'
import Pagination from '@/components/admin/Pagination'
import SearchInput from '@/components/admin/SearchInput'
import FilterButton from '@/components/admin/FilterButton'
import StatusBadge, { getStatusVariant } from '@/components/admin/StatusBadge'
import { useAllCustomers, useUpdateCustomerStatus } from '@/hooks/useCustomer'
import type { CustomerListItem } from '@/types/customer'

const statusLabel = (status: string) => {
  if (status === 'ACTIVE') return 'Active'
  if (status === 'BLOCKED') return 'Blocked'
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

function BlockButton({ isBlocked, onClick }: { isBlocked: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="p-1.5 text-red-500 hover:text-red-600 transition-colors"
      title={isBlocked ? 'Unblock user' : 'Block user'}
    >
      {isBlocked ? (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="6" r="3" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M2 17C2 14.2386 4.23858 12 7 12H9C11.7614 12 14 14.2386 14 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M16 10V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M14 12H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M5 15L15 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )}
    </button>
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

export default function CustomersPage() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const pageSize = 10

  const { data, isLoading, isError } = useAllCustomers({
    page: currentPage,
    limit: pageSize,
    search: searchQuery || undefined,
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
      width: 'w-[80px]',
      render: (customer) => (
        <BlockButton
          isBlocked={customer.status === 'BLOCKED'}
          onClick={() => handleToggleBlock(customer)}
        />
      )
    },
    {
      key: 'details',
      header: 'Details',
      width: 'w-[80px]',
      render: (customer) => (
        <ShowLink onClick={() => router.push(`/admin/customers/${customer.id}`)} />
      )
    }
  ]

  return (
      <div className="p-6">
        <div className="bg-white rounded-lg">
          <div className="flex items-center justify-between p-6 pb-4">
            <h1 className="text-2xl font-semibold text-neutral-900">All Customers</h1>
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
            data={customers}
            keyExtractor={(customer) => customer.id}
            emptyMessage={isLoading ? 'Loading customers...' : isError ? 'Failed to load customers' : 'No customers found'}
          />

          <div className="p-6 pt-4">
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
