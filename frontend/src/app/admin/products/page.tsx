'use client'

import { useState } from 'react'
import Image from 'next/image'
import AdminLayout from '@/components/admin/AdminLayout'
import DataTable, { Column } from '@/components/admin/DataTable'
import Pagination from '@/components/admin/Pagination'
import SearchInput from '@/components/admin/SearchInput'
import FilterButton from '@/components/admin/FilterButton'
import AddButton from '@/components/admin/AddButton'
import StatusBadge, { getStatusVariant } from '@/components/admin/StatusBadge'
import ActionButtons from '@/components/admin/ActionButtons'

interface Product {
  id: string
  name: string
  sku: string
  image: string
  price: number
  currency: string
  availability: string
  status: string
  totalOrders: number
  category: string
}

// Sample data
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Product Name',
    sku: 'SKU: 5840383',
    image: '/products/jacket.jpg',
    price: 1200,
    currency: 'EGP',
    availability: 'In stock',
    status: 'Published',
    totalOrders: 120,
    category: 'Men'
  },
  {
    id: '2',
    name: 'Product Name',
    sku: 'SKU: 5840383',
    image: '/products/suit.jpg',
    price: 1200,
    currency: 'EGP',
    availability: 'In stock',
    status: 'Published',
    totalOrders: 213,
    category: 'Women'
  },
  {
    id: '3',
    name: 'Product Name',
    sku: 'SKU: 5840383',
    image: '/products/pants.jpg',
    price: 1200,
    currency: 'EGP',
    availability: 'Out of stock',
    status: 'Unpublished',
    totalOrders: 310,
    category: 'Kids'
  },
  {
    id: '4',
    name: 'Product Name',
    sku: 'SKU: 5840383',
    image: '/products/dress.jpg',
    price: 1200,
    currency: 'EGP',
    availability: 'In stock',
    status: 'Published',
    totalOrders: 90,
    category: 'Accessories'
  },
  {
    id: '5',
    name: 'Product Name',
    sku: 'SKU: 5840383',
    image: '/products/watch.jpg',
    price: 1200,
    currency: 'EGP',
    availability: 'Low stock',
    status: 'Published',
    totalOrders: 801,
    category: 'Sports'
  },
  {
    id: '6',
    name: 'Product Name',
    sku: 'SKU: 5840383',
    image: '/products/shoes.jpg',
    price: 1200,
    currency: 'EGP',
    availability: 'In stock',
    status: 'Published',
    totalOrders: 450,
    category: 'Women'
  },
]

export default function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')

  const columns: Column<Product>[] = [
    {
      key: 'name',
      header: 'Name',
      width: 'min-w-[280px]',
      render: (product) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
            {/* Placeholder for image */}
            <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-neutral-400">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div>
            <p className="font-medium text-neutral-900">{product.name}</p>
            <p className="text-xs text-neutral-400">{product.sku}</p>
          </div>
        </div>
      )
    },
    {
      key: 'price',
      header: 'Price',
      width: 'w-[120px]',
      render: (product) => (
        <span>{product.price} {product.currency}</span>
      )
    },
    {
      key: 'availability',
      header: 'Availability',
      width: 'w-[130px]',
      render: (product) => (
        <StatusBadge 
          label={product.availability} 
          variant={getStatusVariant(product.availability)}
        />
      )
    },
    {
      key: 'status',
      header: 'Status',
      width: 'w-[120px]',
      render: (product) => (
        <StatusBadge 
          label={product.status} 
          variant={getStatusVariant(product.status)}
        />
      )
    },
    {
      key: 'totalOrders',
      header: 'Total Orders',
      width: 'w-[120px]',
    },
    {
      key: 'category',
      header: 'Category',
      width: 'w-[120px]',
    },
    {
      key: 'actions',
      header: '',
      width: 'w-[80px]',
      render: () => (
        <ActionButtons 
          onEdit={() => console.log('Edit')}
          onView={() => console.log('View')}
        />
      )
    }
  ]

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-end mb-6">
          <AddButton label="Add Product" href="/admin/products/add" />
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-lg">
          {/* Title and Search */}
          <div className="flex items-center justify-between p-6 pb-4">
            <h1 className="text-2xl font-semibold text-neutral-900">All Products</h1>
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
            data={sampleProducts}
            keyExtractor={(product) => product.id}
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
    </AdminLayout>
  )
}
