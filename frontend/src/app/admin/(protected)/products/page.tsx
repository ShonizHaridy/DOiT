'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import DataTable, { Column } from '@/components/admin/DataTable'
import Pagination from '@/components/admin/Pagination'
import SearchInput from '@/components/admin/SearchInput'
import FilterButton, { type FilterSection, type FilterValues } from '@/components/admin/FilterButton'
import AddButton from '@/components/admin/AddButton'
import StatusBadge, { getStatusVariant } from '@/components/admin/StatusBadge'
import ActionButtons from '@/components/admin/ActionButtons'
import { useAdminProducts, useToggleProductStatus } from '@/hooks/useProducts'
import type { AdminProductListItem, ProductStatus } from '@/types/product'
import { GallerySlash } from 'iconsax-reactjs'
import { toAbsoluteMediaUrl } from '@/lib/media-url'

const formatStatus = (status: ProductStatus) => {
  if (status === 'PUBLISHED') return 'Published'
  if (status === 'UNPUBLISHED') return 'Unpublished'
  return 'Draft'
}

const productFilterSections: FilterSection[] = [
  {
    key: 'availability',
    title: 'Availability',
    showBadge: true,
    options: [
      { value: 'In Stock', label: 'In stock', badgeVariant: 'success' },
      { value: 'Low Stock', label: 'Low stock', badgeVariant: 'warning' },
      { value: 'Out of Stock', label: 'Out of stock', badgeVariant: 'error' },
    ],
  },
  {
    key: 'status',
    title: 'Status',
    showBadge: true,
    options: [
      { value: 'PUBLISHED', label: 'Published', badgeVariant: 'success' },
      { value: 'UNPUBLISHED', label: 'Unpublished', badgeVariant: 'error' },
      { value: 'DRAFT', label: 'Draft', badgeVariant: 'default' },
    ],
  },
]

const getProductImageUrl = (product: AdminProductListItem) => {
  if (product.imageUrl) return toAbsoluteMediaUrl(product.imageUrl)
  if (product.image) return toAbsoluteMediaUrl(product.image)
  if (!product.images?.length) return null

  const firstImage = product.images[0]
  if (typeof firstImage === 'string') return toAbsoluteMediaUrl(firstImage)

  return toAbsoluteMediaUrl(firstImage.url) || null
}

function ProductThumbnail({ product }: { product: AdminProductListItem }) {
  const [imageFailed, setImageFailed] = useState(false)
  const imageUrl = getProductImageUrl(product)
  const showFallback = !imageUrl || imageFailed

  if (showFallback) {
    return (
      <div className="w-12 h-12 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
        <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
          <GallerySlash size={20} variant="Linear" className="text-neutral-400" />
        </div>
      </div>
    )
  }

  return (
    <div className="w-12 h-12 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt={product.nameEn}
        className="w-full h-full object-cover"
        onError={() => setImageFailed(true)}
      />
    </div>
  )
}

export default function ProductsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchFromUrl = searchParams.get('search') ?? ''
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [productFilters, setProductFilters] = useState<FilterValues>({})
  const [togglingProductId, setTogglingProductId] = useState<string | null>(null)
  const pageSize = 10
  const selectedStatuses = productFilters.status ?? []
  const selectedAvailability = productFilters.availability ?? []
  const apiStatus = selectedStatuses.length === 1 ? selectedStatuses[0] as ProductStatus : undefined
  const { mutateAsync: toggleProductStatus } = useToggleProductStatus()

  useEffect(() => {
    setSearchQuery(searchFromUrl)
    setCurrentPage(1)
  }, [searchFromUrl])

  const { data, isLoading, isError } = useAdminProducts({
    page: currentPage,
    limit: pageSize,
    search: searchQuery || undefined,
    status: apiStatus,
  })

  const products = data?.products ?? []
  const filteredProducts = products.filter((product) => {
    const statusMatch = selectedStatuses.length === 0 || selectedStatuses.includes(product.status)
    const availabilityMatch = selectedAvailability.length === 0 || selectedAvailability.includes(product.availability)
    return statusMatch && availabilityMatch
  })
  const usingLocalFilter = selectedStatuses.length > 1 || selectedAvailability.length > 0
  const pagination = data?.pagination

  const columns: Column<AdminProductListItem>[] = [
    {
      key: 'name',
      header: 'Name',
      width: 'min-w-[280px]',
      render: (product) => (
        <div className="flex items-center gap-3">
          <ProductThumbnail product={product} />
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
      key: 'totalStock',
      header: 'Stock Qty',
      width: 'w-[100px]',
      render: (product) => product.totalStock,
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
          showView={false}
          showToggleVisibility
          isVisible={product.status === 'PUBLISHED'}
          onToggleVisibility={async () => {
            const nextStatus: ProductStatus =
              product.status === 'PUBLISHED' ? 'UNPUBLISHED' : 'PUBLISHED'
            try {
              setTogglingProductId(product.id)
              await toggleProductStatus({ id: product.id, status: nextStatus })
            } finally {
              setTogglingProductId(null)
            }
          }}
          className={togglingProductId === product.id ? 'opacity-60 pointer-events-none' : undefined}
        />
      )
    }
  ]

  return (
      <div className="p-6">
        <div className="flex items-center justify-end mb-6">
          <AddButton label="Add Product" href="/admin/products/add" />
        </div>

        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold text-neutral-900">All Products</h1>
            <div className="flex items-center gap-3">
              <SearchInput
                placeholder="Search"
                value={searchQuery}
                onChange={(value) => {
                  setSearchQuery(value)
                  setCurrentPage(1)
                }}
                className="w-64"
              />
              <FilterButton
                sections={productFilterSections}
                value={productFilters}
                onApply={(next) => {
                  setProductFilters(next)
                  setCurrentPage(1)
                }}
                onReset={() => {
                  setProductFilters({})
                  setCurrentPage(1)
                }}
              />
            </div>
          </div>

          <DataTable
            columns={columns}
            data={filteredProducts}
            keyExtractor={(product) => product.id}
            emptyMessage={isLoading ? 'Loading products...' : isError ? 'Failed to load products' : 'No products found'}
          />

          <div className="pt-4">
            <Pagination
              currentPage={usingLocalFilter ? 1 : (pagination?.page ?? currentPage)}
              totalPages={usingLocalFilter ? 1 : (pagination?.totalPages ?? 1)}
              totalItems={usingLocalFilter ? filteredProducts.length : (pagination?.total ?? 0)}
              itemsPerPage={pagination?.limit ?? pageSize}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
  )
}
