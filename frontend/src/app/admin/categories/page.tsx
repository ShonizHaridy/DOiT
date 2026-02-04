'use client'

import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import DataTable, { Column } from '@/components/admin/DataTable'
import Pagination from '@/components/admin/Pagination'
import SearchInput from '@/components/admin/SearchInput'
import ActionButtons from '@/components/admin/ActionButtons'

interface Category {
  id: string
  name: string
  subCategories: number
  productsLists: number
  totalProducts: number
}

// Sample data
const sampleCategories: Category[] = [
  {
    id: '1',
    name: 'Men',
    subCategories: 5,
    productsLists: 41,
    totalProducts: 520
  },
  {
    id: '2',
    name: 'Women',
    subCategories: 5,
    productsLists: 44,
    totalProducts: 670
  },
  {
    id: '3',
    name: 'Kids',
    subCategories: 4,
    productsLists: 20,
    totalProducts: 230
  },
  {
    id: '4',
    name: 'Accessories',
    subCategories: 6,
    productsLists: 12,
    totalProducts: 90
  },
  {
    id: '5',
    name: 'Sports',
    subCategories: 12,
    productsLists: 32,
    totalProducts: 1200
  },
]

export default function CategoriesPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')

  const columns: Column<Category>[] = [
    {
      key: 'name',
      header: 'Name',
      width: 'min-w-[200px]',
    },
    {
      key: 'subCategories',
      header: 'Sub Categories',
      width: 'w-[150px]',
    },
    {
      key: 'productsLists',
      header: 'Products lists',
      width: 'w-[150px]',
    },
    {
      key: 'totalProducts',
      header: 'Total Products',
      width: 'w-[150px]',
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
        {/* Content Card */}
        <div className="bg-white rounded-lg">
          {/* Title and Search */}
          <div className="flex items-center justify-between p-6 pb-4">
            <h1 className="text-2xl font-semibold text-neutral-900">All Categories</h1>
            <SearchInput 
              placeholder="Search" 
              value={searchQuery}
              onChange={setSearchQuery}
              className="w-72"
            />
          </div>

          {/* Table */}
          <DataTable
            columns={columns}
            data={sampleCategories}
            keyExtractor={(category) => category.id}
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
