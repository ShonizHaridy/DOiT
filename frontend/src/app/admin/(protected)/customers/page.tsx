'use client'

import { useState } from 'react'
import DataTable, { Column } from '@/components/admin/DataTable'
import Pagination from '@/components/admin/Pagination'
import SearchInput from '@/components/admin/SearchInput'
import FilterButton from '@/components/admin/FilterButton'
import StatusBadge, { getStatusVariant } from '@/components/admin/StatusBadge'

interface Customer {
  id: string
  name: string
  detail: string
  avatar: string
  lastLogin: string
  status: string
  createdDate: string
  orders: number
  spending: string
}

// Sample data
const sampleCustomers: Customer[] = [
  {
    id: '1',
    name: 'User Name',
    detail: 'User details',
    avatar: '/avatars/user1.jpg',
    lastLogin: '13:45 Nov 10,2025',
    status: 'Active',
    createdDate: '22/11/2024',
    orders: 2,
    spending: '2500 EGP'
  },
  {
    id: '2',
    name: 'User Name',
    detail: 'User details',
    avatar: '/avatars/user2.jpg',
    lastLogin: '13:45 Nov 10,2025',
    status: 'Active',
    createdDate: '22/11/2024',
    orders: 11,
    spending: '2500 EGP'
  },
  {
    id: '3',
    name: 'User Name',
    detail: 'User details',
    avatar: '/avatars/user3.jpg',
    lastLogin: '13:45 Nov 10,2025',
    status: 'Blocked',
    createdDate: '22/11/2024',
    orders: 4,
    spending: '2500 EGP'
  },
  {
    id: '4',
    name: 'User Name',
    detail: 'User details',
    avatar: '/avatars/user4.jpg',
    lastLogin: '13:45 Nov 10,2025',
    status: 'Active',
    createdDate: '22/11/2024',
    orders: 1,
    spending: '2500 EGP'
  },
  {
    id: '5',
    name: 'User Name',
    detail: 'User details',
    avatar: '/avatars/user5.jpg',
    lastLogin: '13:45 Nov 10,2025',
    status: 'Active',
    createdDate: '22/11/2024',
    orders: 2,
    spending: '2500 EGP'
  },
  {
    id: '6',
    name: 'User Name',
    detail: 'User details',
    avatar: '/avatars/user6.jpg',
    lastLogin: '13:45 Nov 10,2025',
    status: 'Active',
    createdDate: '22/11/2024',
    orders: 6,
    spending: '2500 EGP'
  },
]

// Customer cell component
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

// Block/Unblock action button
function BlockButton({ isBlocked, onClick }: { isBlocked: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="p-1.5 text-red-500 hover:text-red-600 transition-colors"
      title={isBlocked ? 'Unblock user' : 'Block user'}
    >
      {isBlocked ? (
        // User add icon for unblock
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="6" r="3" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M2 17C2 14.2386 4.23858 12 7 12H9C11.7614 12 14 14.2386 14 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M16 10V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M14 12H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ) : (
        // Block icon (circle with slash)
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M5 15L15 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )}
    </button>
  )
}

// Show link component
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
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')

  const columns: Column<Customer>[] = [
    {
      key: 'customer',
      header: 'Customer',
      width: 'min-w-[180px]',
      render: (customer) => (
        <CustomerCell name={customer.name} detail={customer.detail} />
      )
    },
    {
      key: 'lastLogin',
      header: 'Last Log in',
      width: 'w-[150px]',
    },
    {
      key: 'status',
      header: 'Status',
      width: 'w-[100px]',
      render: (customer) => (
        <StatusBadge 
          label={customer.status} 
          variant={getStatusVariant(customer.status)}
        />
      )
    },
    {
      key: 'createdDate',
      header: 'Created',
      width: 'w-[110px]',
    },
    {
      key: 'orders',
      header: 'Orders',
      width: 'w-[80px]',
    },
    {
      key: 'spending',
      header: 'Spending',
      width: 'w-[100px]',
    },
    {
      key: 'action',
      header: 'Action',
      width: 'w-[80px]',
      render: (customer) => (
        <BlockButton 
          isBlocked={customer.status === 'Blocked'} 
          onClick={() => console.log('Toggle block', customer.id)}
        />
      )
    },
    {
      key: 'details',
      header: 'Details',
      width: 'w-[80px]',
      render: () => <ShowLink onClick={() => console.log('Show details')} />
    }
  ]

  return (
      <div className="p-6">
        {/* Content Card */}
        <div className="bg-white rounded-lg">
          {/* Title and Search */}
          <div className="flex items-center justify-between p-6 pb-4">
            <h1 className="text-2xl font-semibold text-neutral-900">All Customers</h1>
            <div className="flex items-center gap-3">
              <SearchInput 
                placeholder="Search" 
                value={searchQuery}
                onChange={setSearchQuery}
                className="w-64"
              />
              <FilterButton onClick={() => console.log('Filter')} />
            </div>
          </div>

          {/* Table */}
          <DataTable
            columns={columns}
            data={sampleCustomers}
            keyExtractor={(customer) => customer.id}
          />

          {/* Pagination */}
          <div className="p-6 pt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={10}
              totalItems={99}
              itemsPerPage={10}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
  )
}
