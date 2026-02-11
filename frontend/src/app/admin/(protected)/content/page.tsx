'use client'

import DataTable, { Column } from '@/components/admin/DataTable'
import { useRouter } from 'next/navigation'

interface ContentSection {
  id: string
  name: string
}

// Sample data
const contentSections: ContentSection[] = [
  { id: '1', name: 'Hero Section' },
  { id: '2', name: 'Vendors Section' },
  { id: '3', name: 'Banner Ads' },
  { id: '4', name: 'Featured Products' },
  { id: '5', name: 'Styles Section' },
]

// Edit button
function EditButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="p-1.5 text-neutral-400 hover:text-neutral-600 transition-colors"
      title="Edit"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.25 3H3C2.60218 3 2.22064 3.15804 1.93934 3.43934C1.65804 3.72064 1.5 4.10218 1.5 4.5V15C1.5 15.3978 1.65804 15.7794 1.93934 16.0607C2.22064 16.342 2.60218 16.5 3 16.5H13.5C13.8978 16.5 14.2794 16.342 14.5607 16.0607C14.842 15.7794 15 15.3978 15 15V9.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M13.875 1.87499C14.1734 1.57662 14.578 1.40901 15 1.40901C15.422 1.40901 15.8266 1.57662 16.125 1.87499C16.4234 2.17336 16.591 2.57802 16.591 2.99999C16.591 3.42196 16.4234 3.82662 16.125 4.12499L9 11.25L6 12L6.75 9L13.875 1.87499Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  )
}

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
        <EditButton onClick={() => {
          const routes: Record<string, string> = {
            '1': '/admin/content/hero',
            '2': '/admin/content/vendors',
            '3': '/admin/content/banner-ads',
            '4': '/admin/content/featured-products',
            '5': '/admin/content/styles',
          }
          const route = routes[section.id]
          if (route) {
            router.push(route)
          }
        }} />
      )
    }
  ]

  return (
      <div className="p-6">
        {/* Content Card */}
        <div className="bg-white rounded-lg">
          {/* Title */}
          <div className="p-6 pb-4">
            <h1 className="text-2xl font-semibold text-neutral-900">Content Management</h1>
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
