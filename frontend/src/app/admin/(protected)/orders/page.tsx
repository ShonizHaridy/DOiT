'use client'

import { useState } from 'react'
import DataTable, { Column } from '@/components/admin/DataTable'
import Pagination from '@/components/admin/Pagination'
import SearchInput from '@/components/admin/SearchInput'
import FilterButton from '@/components/admin/FilterButton'
import ExportButton from '@/components/admin/ExportButton'
import StatusBadge, { getStatusVariant } from '@/components/admin/StatusBadge'

interface Order {
  id: string
  orderId: string
  customerName: string
  customerDetail: string
  customerAvatar: string
  status: string
  createdDate: string
  items: number
  total: string
  phoneNumber?: string
}

// Sample data for All Orders
const allOrders: Order[] = [
  {
    id: '1',
    orderId: '#3776426',
    customerName: 'User Name',
    customerDetail: 'User details',
    customerAvatar: '/avatars/user1.jpg',
    status: 'Completed',
    createdDate: '22/11/2025',
    items: 2,
    total: '2500 EGP'
  },
  {
    id: '2',
    orderId: '#3776426',
    customerName: 'User Name',
    customerDetail: 'User details',
    customerAvatar: '/avatars/user2.jpg',
    status: 'Shipped',
    createdDate: '22/11/2025',
    items: 4,
    total: '2500 EGP'
  },
  {
    id: '3',
    orderId: '#3776426',
    customerName: 'User Name',
    customerDetail: 'User details',
    customerAvatar: '/avatars/user3.jpg',
    status: 'In progress',
    createdDate: '22/11/2025',
    items: 1,
    total: '2500 EGP'
  },
  {
    id: '4',
    orderId: '#3776426',
    customerName: 'User Name',
    customerDetail: 'User details',
    customerAvatar: '/avatars/user4.jpg',
    status: 'In progress',
    createdDate: '22/11/2025',
    items: 4,
    total: '2500 EGP'
  },
  {
    id: '5',
    orderId: '#3776426',
    customerName: 'User Name',
    customerDetail: 'User details',
    customerAvatar: '/avatars/user5.jpg',
    status: 'Canceled',
    createdDate: '22/11/2025',
    items: 2,
    total: '2500 EGP'
  },
  {
    id: '6',
    orderId: '#3776426',
    customerName: 'User Name',
    customerDetail: 'User details',
    customerAvatar: '/avatars/user6.jpg',
    status: 'Completed',
    createdDate: '22/11/2025',
    items: 3,
    total: '2500 EGP'
  },
]

// Sample data for Custom Made Orders
const customOrders: Order[] = [
  {
    id: '1',
    orderId: '#3776426',
    customerName: 'User Name',
    customerDetail: 'User details',
    customerAvatar: '/avatars/user1.jpg',
    status: 'Completed',
    phoneNumber: '01228769804',
    createdDate: '22/11/2025',
    items: 0,
    total: '2500 EGP'
  },
  {
    id: '2',
    orderId: '#3776426',
    customerName: 'User Name',
    customerDetail: 'User details',
    customerAvatar: '/avatars/user2.jpg',
    status: 'Shipped',
    phoneNumber: '01228769804',
    createdDate: '22/11/2025',
    items: 0,
    total: '2500 EGP'
  },
  {
    id: '3',
    orderId: '#3776426',
    customerName: 'User Name',
    customerDetail: 'User details',
    customerAvatar: '/avatars/user3.jpg',
    status: 'New',
    phoneNumber: '01228769804',
    createdDate: '22/11/2025',
    items: 0,
    total: 'NA'
  },
  {
    id: '4',
    orderId: '#3776426',
    customerName: 'User Name',
    customerDetail: 'User details',
    customerAvatar: '/avatars/user4.jpg',
    status: 'In progress',
    phoneNumber: '01228769804',
    createdDate: '22/11/2025',
    items: 0,
    total: '2500 EGP'
  },
  {
    id: '5',
    orderId: '#3776426',
    customerName: 'User Name',
    customerDetail: 'User details',
    customerAvatar: '/avatars/user5.jpg',
    status: 'In progress',
    phoneNumber: '01228769804',
    createdDate: '22/11/2025',
    items: 0,
    total: '2500 EGP'
  },
  {
    id: '6',
    orderId: '#3776426',
    customerName: 'User Name',
    customerDetail: 'User details',
    customerAvatar: '/avatars/user6.jpg',
    status: 'Completed',
    phoneNumber: '01228769804',
    createdDate: '22/11/2025',
    items: 0,
    total: '2500 EGP'
  },
]

// Customer cell component
function CustomerCell({ name, detail }: { name: string; detail: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-neutral-200 rounded-full overflow-hidden flex-shrink-0">
        {/* Placeholder avatar */}
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

export default function OrdersPage() {
  const [allOrdersPage, setAllOrdersPage] = useState(1)
  const [customOrdersPage, setCustomOrdersPage] = useState(1)
  const [allOrdersSearch, setAllOrdersSearch] = useState('')
  const [customOrdersSearch, setCustomOrdersSearch] = useState('')

  // Columns for All Orders table
  const allOrdersColumns: Column<Order>[] = [
    {
      key: 'orderId',
      header: 'Order ID',
      width: 'w-[100px]',
    },
    {
      key: 'customer',
      header: 'Customer',
      width: 'min-w-[180px]',
      render: (order) => (
        <CustomerCell name={order.customerName} detail={order.customerDetail} />
      )
    },
    {
      key: 'status',
      header: 'Status',
      width: 'w-[120px]',
      render: (order) => (
        <StatusBadge 
          label={order.status} 
          variant={getStatusVariant(order.status)}
        />
      )
    },
    {
      key: 'createdDate',
      header: 'Created',
      width: 'w-[110px]',
    },
    {
      key: 'items',
      header: 'Items',
      width: 'w-[80px]',
    },
    {
      key: 'total',
      header: 'Total',
      width: 'w-[100px]',
    },
    {
      key: 'details',
      header: 'Details',
      width: 'w-[80px]',
      render: () => <ShowLink onClick={() => console.log('Show details')} />
    }
  ]

  // Columns for Custom Made Orders table
  const customOrdersColumns: Column<Order>[] = [
    {
      key: 'orderId',
      header: 'Order ID',
      width: 'w-[100px]',
    },
    {
      key: 'customer',
      header: 'Customer',
      width: 'min-w-[180px]',
      render: (order) => (
        <CustomerCell name={order.customerName} detail={order.customerDetail} />
      )
    },
    {
      key: 'status',
      header: 'Status',
      width: 'w-[120px]',
      render: (order) => (
        <StatusBadge 
          label={order.status} 
          variant={getStatusVariant(order.status)}
        />
      )
    },
    {
      key: 'phoneNumber',
      header: 'Phone Number',
      width: 'w-[130px]',
    },
    {
      key: 'createdDate',
      header: 'Created',
      width: 'w-[110px]',
    },
    {
      key: 'total',
      header: 'Total',
      width: 'w-[100px]',
    },
    {
      key: 'details',
      header: 'Details',
      width: 'w-[80px]',
      render: () => <ShowLink onClick={() => console.log('Show details')} />
    }
  ]

  return (
      <div className="p-6 space-y-8">
        {/* All Orders Section */}
        <div className="bg-white rounded-lg">
          {/* Title and Actions */}
          <div className="flex items-center justify-between p-6 pb-4">
            <h1 className="text-2xl font-semibold text-neutral-900">All Orders</h1>
            <div className="flex items-center gap-3">
              <SearchInput 
                placeholder="Search" 
                value={allOrdersSearch}
                onChange={setAllOrdersSearch}
                className="w-56"
              />
              <FilterButton onClick={() => console.log('Filter')} />
              <ExportButton onClick={() => console.log('Export')} />
            </div>
          </div>

          {/* Table */}
          <DataTable
            columns={allOrdersColumns}
            data={allOrders}
            keyExtractor={(order, index) => `${order.id}-${index}`}
          />

          {/* Pagination */}
          <div className="p-6 pt-4">
            <Pagination
              currentPage={allOrdersPage}
              totalPages={10}
              totalItems={99}
              itemsPerPage={10}
              onPageChange={setAllOrdersPage}
            />
          </div>
        </div>

        {/* Custom Made Orders Section */}
        <div className="bg-white rounded-lg">
          {/* Title and Actions */}
          <div className="flex items-center justify-between p-6 pb-4">
            <h1 className="text-2xl font-semibold text-neutral-900">Custom Made Orders</h1>
            <div className="flex items-center gap-3">
              <SearchInput 
                placeholder="Search" 
                value={customOrdersSearch}
                onChange={setCustomOrdersSearch}
                className="w-56"
              />
              <FilterButton onClick={() => console.log('Filter')} />
              <ExportButton onClick={() => console.log('Export')} />
            </div>
          </div>

          {/* Table */}
          <DataTable
            columns={customOrdersColumns}
            data={customOrders}
            keyExtractor={(order, index) => `custom-${order.id}-${index}`}
          />

          {/* Pagination */}
          <div className="p-6 pt-4">
            <Pagination
              currentPage={customOrdersPage}
              totalPages={10}
              totalItems={99}
              itemsPerPage={10}
              onPageChange={setCustomOrdersPage}
            />
          </div>
        </div>
      </div>
  )
}
