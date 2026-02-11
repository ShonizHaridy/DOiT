'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DataTable, { Column } from '@/components/admin/DataTable'
import Pagination from '@/components/admin/Pagination'
import SearchInput from '@/components/admin/SearchInput'
import FilterButton from '@/components/admin/FilterButton'
import AddButton from '@/components/admin/AddButton'
import StatusBadge, { getStatusVariant } from '@/components/admin/StatusBadge'
import ActionButtons from '@/components/admin/ActionButtons'
import { useAdminProducts } from '@/hooks/useProducts'
import type { AdminProductListItem, ProductStatus } from '@/types/product'

const formatStatus = (status: ProductStatus) => {
  if (status === 'PUBLISHED') return 'Published'
  if (status === 'UNPUBLISHED') return 'Unpublished'
  return 'Draft'
}

export default function ProductsPage() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const pageSize = 10

  const { data, isLoading, isError } = useAdminProducts({
    page: currentPage,
    limit: pageSize,
    search: searchQuery || undefined,
  })

  const products = data?.products ?? []
  const pagination = data?.pagination

  const columns: Column<AdminProductListItem>[] = [
    {
      key: 'name',
      header: 'Name',
      width: 'min-w-[280px]',
      render: (product) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
            <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-neutral-400">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div>
            <p className="font-medium text-neutral-900">{product.nameEn}</p>
            <p className="text-xs text-neutral-400">SKU: {product.sku}</p>
          </div>
        </div>
      )
    },
    {
      key: 'price',
      header: 'Price',
      width: 'w-[120px]',
      render: (product) => (
        <span>{product.basePrice.toLocaleString()} EGP</span>
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
          label={formatStatus(product.status)}
          variant={getStatusVariant(formatStatus(product.status))}
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
      render: (product) => (
        <ActionButtons
          onEdit={() => router.push(`/admin/products/${product.id}/edit`)}
          onView={() => router.push(`/admin/products/${product.id}/edit`)}
        />
      )
    }
  ]

  return (
      <div className="p-6">
        <div className="flex items-center justify-end mb-6">
          <AddButton label="Add Product" href="/admin/products/add" />
        </div>

        <div className="bg-white rounded-lg">
          <div className="flex items-center justify-between p-6 pb-4">
            <h1 className="text-2xl font-semibold text-neutral-900">All Products</h1>
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
            data={products}
            keyExtractor={(product) => product.id}
            emptyMessage={isLoading ? 'Loading products...' : isError ? 'Failed to load products' : 'No products found'}
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
