'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import DataTable, { Column } from '@/components/admin/DataTable'
import Pagination from '@/components/admin/Pagination'
import SearchInput from '@/components/admin/SearchInput'
import ActionButtons from '@/components/admin/ActionButtons'
import { useAdminCategories, useCategories, useUpdateCategory } from '@/hooks/useCategories'
import type { Category } from '@/types/category'

export default function CategoriesPage() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [togglingCategoryId, setTogglingCategoryId] = useState<string | null>(null)
  const pageSize = 10

  const { data: adminCategories, isLoading, isError } = useAdminCategories()
  const { data: categoriesWithChildren } = useCategories(true)
  const { mutateAsync: updateCategory } = useUpdateCategory()

  const productListsCountMap = useMemo(() => {
    const map = new Map<string, number>()
    categoriesWithChildren?.forEach((category) => {
      const count = category.subCategories?.reduce((sum, sub) => {
        return sum + (sub.productLists?.length ?? 0)
      }, 0) ?? 0
      map.set(category.id, count)
    })
    return map
  }, [categoriesWithChildren])

  const filteredCategories = (adminCategories ?? []).filter((category) => {
    if (!searchQuery) return true
    const value = `${category.nameEn} ${category.nameAr}`.toLowerCase()
    return value.includes(searchQuery.toLowerCase())
  })

  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / pageSize))
  const pagedCategories = filteredCategories.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const columns: Column<Category>[] = [
    {
      key: 'nameEn',
      header: 'Name',
      width: 'min-w-[200px]',
      render: (category) => category.nameEn,
    },
    {
      key: 'totalSubCategories',
      header: 'Sub Categories',
      width: 'w-[150px]',
      render: (category) => category.totalSubCategories ?? 0,
    },
    {
      key: 'productLists',
      header: 'Products lists',
      width: 'w-[150px]',
      render: (category) => productListsCountMap.get(category.id) ?? 0,
    },
    {
      key: 'totalProducts',
      header: 'Total Products',
      width: 'w-[150px]',
      render: (category) => category.totalProducts ?? 0,
    },
    {
      key: 'actions',
      header: '',
      width: 'w-[80px]',
      render: (category) => (
        <ActionButtons
          onEdit={() => router.push(`/admin/categories/${category.id}/edit`)}
          showView={false}
          showToggleVisibility
          isVisible={category.status}
          onToggleVisibility={async () => {
            try {
              setTogglingCategoryId(category.id)
              await updateCategory({ id: category.id, data: { status: !category.status } })
            } finally {
              setTogglingCategoryId(null)
            }
          }}
          className={togglingCategoryId === category.id ? 'opacity-60 pointer-events-none' : undefined}
        />
      )
    }
  ]

  return (
      <div className="p-6">
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold text-neutral-900">All Categories</h1>
            <SearchInput
              placeholder="Search"
              value={searchQuery}
              onChange={(value) => {
                setSearchQuery(value)
                setCurrentPage(1)
              }}
              className="w-72"
            />
          </div>

          <DataTable
            columns={columns}
            data={pagedCategories}
            keyExtractor={(category) => category.id}
            emptyMessage={isLoading ? 'Loading categories...' : isError ? 'Failed to load categories' : 'No categories found'}
          />

          <div className="pt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredCategories.length}
              itemsPerPage={pageSize}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
  )
}
