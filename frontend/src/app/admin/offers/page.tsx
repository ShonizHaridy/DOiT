'use client'

import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import DataTable, { Column } from '@/components/admin/DataTable'
import Pagination from '@/components/admin/Pagination'
import SearchInput from '@/components/admin/SearchInput'
import FilterButton from '@/components/admin/FilterButton'
import ExportButton from '@/components/admin/ExportButton'
import AddButton from '@/components/admin/AddButton'
import StatusBadge, { getStatusVariant } from '@/components/admin/StatusBadge'

interface Offer {
  id: string
  name: string
  type: string
  status: string
  startDate: string
  endDate: string
  timesUsed: string
}

// Sample data
const sampleOffers: Offer[] = [
  {
    id: '1',
    name: 'Running Shoes 50%',
    type: 'Percentage',
    status: 'Active',
    startDate: '22/11/2024',
    endDate: '22/12/2024',
    timesUsed: '300'
  },
  {
    id: '2',
    name: 'Al Ahly Jercy offer',
    type: 'Buy one get one',
    status: 'Draft',
    startDate: '22/11/2024',
    endDate: '22/12/2024',
    timesUsed: 'NA'
  },
  {
    id: '3',
    name: '500 EGP on accessories',
    type: 'fixed amount',
    status: 'Expired',
    startDate: '22/11/2024',
    endDate: '22/12/2024',
    timesUsed: '500'
  },
  {
    id: '4',
    name: 'Ball + bottle + socks 20% off',
    type: 'Bundle',
    status: 'Scheduled',
    startDate: '22/11/2024',
    endDate: '22/12/2024',
    timesUsed: 'NA'
  },
  {
    id: '5',
    name: 'free shipping Over 1000 EGP',
    type: 'free shipping',
    status: 'Active',
    startDate: '22/11/2024',
    endDate: '22/12/2024',
    timesUsed: '230'
  },
  {
    id: '6',
    name: '30% on Kids',
    type: 'Percentage',
    status: 'Active',
    startDate: '22/11/2024',
    endDate: '22/12/2024',
    timesUsed: '400'
  },
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

// Toggle (Play/Pause) button for active/inactive offers
function ToggleButton({ isActive, onClick }: { isActive: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`p-1.5 transition-colors ${isActive ? 'text-primary hover:text-red-700' : 'text-neutral-400 hover:text-neutral-600'}`}
      title={isActive ? 'Pause offer' : 'Activate offer'}
    >
      {isActive ? (
        // Pause icon (two vertical bars)
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="3" width="3" height="12" rx="1" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="11" y="3" width="3" height="12" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      ) : (
        // Play icon
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 3.80385C5 3.01191 5.86395 2.52404 6.53 2.9381L14.2298 7.73425C14.8536 8.12216 14.8536 9.07784 14.2298 9.46575L6.53 14.2619C5.86395 14.676 5 14.1881 5 13.3962V3.80385Z" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      )}
    </button>
  )
}

// Action buttons container
function OfferActions({ status, onEdit, onToggle }: { status: string; onEdit?: () => void; onToggle?: () => void }) {
  const isActive = status.toLowerCase() === 'active'
  
  return (
    <div className="flex items-center gap-1">
      <EditButton onClick={onEdit} />
      <ToggleButton isActive={isActive} onClick={onToggle} />
    </div>
  )
}

export default function OffersPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')

  const columns: Column<Offer>[] = [
    {
      key: 'name',
      header: 'Offer Name',
      width: 'min-w-[200px]',
    },
    {
      key: 'type',
      header: 'Type',
      width: 'w-[140px]',
    },
    {
      key: 'status',
      header: 'Status',
      width: 'w-[110px]',
      render: (offer) => (
        <StatusBadge 
          label={offer.status} 
          variant={getStatusVariant(offer.status)}
        />
      )
    },
    {
      key: 'startDate',
      header: 'Start date',
      width: 'w-[110px]',
    },
    {
      key: 'endDate',
      header: 'End date',
      width: 'w-[110px]',
    },
    {
      key: 'timesUsed',
      header: 'Times Used',
      width: 'w-[100px]',
    },
    {
      key: 'actions',
      header: 'Action',
      width: 'w-[80px]',
      render: (offer) => (
        <OfferActions 
          status={offer.status}
          onEdit={() => console.log('Edit', offer.id)}
          onToggle={() => console.log('Toggle', offer.id)}
        />
      )
    }
  ]

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-end mb-6">
          <AddButton label="Create New Offer" onClick={() => console.log('Create new offer')} />
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-lg">
          {/* Title and Search */}
          <div className="flex items-center justify-between p-6 pb-4">
            <h1 className="text-2xl font-semibold text-neutral-900">All Offers</h1>
            <div className="flex items-center gap-3">
              <SearchInput 
                placeholder="Search" 
                value={searchQuery}
                onChange={setSearchQuery}
                className="w-56"
              />
              <FilterButton onClick={() => console.log('Filter')} />
              <ExportButton onClick={() => console.log('Export')} />
            </div>
          </div>

          {/* Table */}
          <DataTable
            columns={columns}
            data={sampleOffers}
            keyExtractor={(offer) => offer.id}
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
