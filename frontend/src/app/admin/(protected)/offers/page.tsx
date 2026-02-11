'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import DataTable, { Column } from '@/components/admin/DataTable'
import Pagination from '@/components/admin/Pagination'
import SearchInput from '@/components/admin/SearchInput'
import FilterButton from '@/components/admin/FilterButton'
import ExportButton from '@/components/admin/ExportButton'
import AddButton from '@/components/admin/AddButton'
import StatusBadge, { getStatusVariant } from '@/components/admin/StatusBadge'
import { useOffers, useToggleOfferStatus } from '@/hooks/useOffers'
import type { Offer } from '@/types/offer'

const getOfferStatus = (offer: Offer) => {
  if (!offer.status) return 'Inactive'
  const now = new Date()
  const start = new Date(offer.startDate)
  const end = new Date(offer.endDate)
  if (!Number.isNaN(start.getTime()) && start > now) return 'Scheduled'
  if (!Number.isNaN(end.getTime()) && end < now) return 'Expired'
  return 'Active'
}

const formatDate = (value: string) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '---' : date.toLocaleDateString()
}

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

function ToggleButton({ isActive, onClick }: { isActive: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`p-1.5 transition-colors ${isActive ? 'text-primary hover:text-red-700' : 'text-neutral-400 hover:text-neutral-600'}`}
      title={isActive ? 'Pause offer' : 'Activate offer'}
    >
      {isActive ? (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="3" width="3" height="12" rx="1" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="11" y="3" width="3" height="12" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 3.80385C5 3.01191 5.86395 2.52404 6.53 2.9381L14.2298 7.73425C14.8536 8.12216 14.8536 9.07784 14.2298 9.46575L6.53 14.2619C5.86395 14.676 5 14.1881 5 13.3962V3.80385Z" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      )}
    </button>
  )
}

function OfferActions({ isActive, onEdit, onToggle }: { isActive: boolean; onEdit?: () => void; onToggle?: () => void }) {
  return (
    <div className="flex items-center gap-1">
      <EditButton onClick={onEdit} />
      <ToggleButton isActive={isActive} onClick={onToggle} />
    </div>
  )
}

export default function OffersPage() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const pageSize = 10

  const { data, isLoading, isError } = useOffers()
  const { mutateAsync } = useToggleOfferStatus()

  const filteredOffers = useMemo(() => {
    const list = data ?? []
    if (!searchQuery) return list
    return list.filter((offer) => {
      const haystack = `${offer.nameEn} ${offer.nameAr} ${offer.code}`.toLowerCase()
      return haystack.includes(searchQuery.toLowerCase())
    })
  }, [data, searchQuery])

  const totalPages = Math.max(1, Math.ceil(filteredOffers.length / pageSize))
  const pagedOffers = filteredOffers.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const columns: Column<Offer>[] = [
    {
      key: 'nameEn',
      header: 'Offer Name',
      width: 'min-w-[200px]',
      render: (offer) => offer.nameEn,
    },
    {
      key: 'type',
      header: 'Type',
      width: 'w-[140px]',
      render: (offer) => offer.type.replace('_', ' '),
    },
    {
      key: 'status',
      header: 'Status',
      width: 'w-[110px]',
      render: (offer) => {
        const status = getOfferStatus(offer)
        return (
          <StatusBadge
            label={status}
            variant={getStatusVariant(status)}
          />
        )
      }
    },
    {
      key: 'startDate',
      header: 'Start date',
      width: 'w-[110px]',
      render: (offer) => formatDate(offer.startDate),
    },
    {
      key: 'endDate',
      header: 'End date',
      width: 'w-[110px]',
      render: (offer) => formatDate(offer.endDate),
    },
    {
      key: 'timesUsed',
      header: 'Times Used',
      width: 'w-[100px]',
      render: (offer) => offer.currentUsage ?? 0,
    },
    {
      key: 'actions',
      header: 'Action',
      width: 'w-[80px]',
      render: (offer) => (
        <OfferActions
          isActive={offer.status}
          onEdit={() => router.push(`/admin/offers/${offer.id}/edit`)}
          onToggle={() => mutateAsync({ id: offer.id, status: !offer.status })}
        />
      )
    }
  ]

  return (
      <div className="p-6">
        <div className="flex items-center justify-end mb-6">
          <AddButton label="Create New Offer" onClick={() => router.push('/admin/offers/new')} />
        </div>

        <div className="bg-white rounded-lg">
          <div className="flex items-center justify-between p-6 pb-4">
            <h1 className="text-2xl font-semibold text-neutral-900">All Offers</h1>
            <div className="flex items-center gap-3">
              <SearchInput
                placeholder="Search"
                value={searchQuery}
                onChange={setSearchQuery}
                className="w-56"
              />
              <FilterButton onClick={() => undefined} />
              <ExportButton onClick={() => undefined} />
            </div>
          </div>

          <DataTable
            columns={columns}
            data={pagedOffers}
            keyExtractor={(offer) => offer.id}
            emptyMessage={isLoading ? 'Loading offers...' : isError ? 'Failed to load offers' : 'No offers found'}
          />

          <div className="p-6 pt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredOffers.length}
              itemsPerPage={pageSize}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
  )
}
