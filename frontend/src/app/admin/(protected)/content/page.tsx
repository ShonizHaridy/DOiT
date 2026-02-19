'use client'

import DataTable, { Column } from '@/components/admin/DataTable'
import ActionButtons from '@/components/admin/ActionButtons'
import { useRouter } from 'next/navigation'

interface ContentSection {
  id: string
  name: string
}

// Sample data
const contentSections: ContentSection[] = [
  { id: '1', name: 'Home Hero Section' },
  { id: '2', name: 'Home Vendors Section' },
  { id: '3', name: 'Banner Ads' },
  { id: '4', name: 'Featured Products' },
  { id: '5', name: 'Styles Section' },
  { id: '6', name: 'Information Pages' },
]

export default function ContentPage() {
  const router = useRouter()
  const columns: Column<ContentSection>[] = [
    {
      key: 'name',
      header: 'Section Name',
      width: 'min-w-[300px]',
    },
    {
      key: 'action',
      header: 'Action',
      width: 'w-[100px]',
      render: (section) => (
        <ActionButtons
          showView={false}
          showDelete={false}
          onEdit={() => {
            const routes: Record<string, string> = {
              '1': '/admin/content/hero',
              '2': '/admin/content/vendors',
              '3': '/admin/content/banner-ads',
              '4': '/admin/content/featured-products',
              '5': '/admin/content/styles',
              '6': '/admin/content/information-pages',
            }
            const route = routes[section.id]
            if (route) {
              router.push(route)
            }
          }}
        />
      )
    }
  ]

  return (
      <div className="p-6">
        {/* Content Card */}
        <div className="bg-white rounded-lg p-4">
          {/* Title */}
          <div className="mb-4">
            <h1 className="text-2xl font-semibold text-neutral-900">Content & Pages Management</h1>
          </div>

          {/* Table */}
          <DataTable
            columns={columns}
            data={contentSections}
            keyExtractor={(section) => section.id}
          />
        </div>
      </div>
  )
}
