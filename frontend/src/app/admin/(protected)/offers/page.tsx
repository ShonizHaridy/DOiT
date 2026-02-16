'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import DataTable, { Column } from '@/components/admin/DataTable'
import Pagination from '@/components/admin/Pagination'
import SearchInput from '@/components/admin/SearchInput'
import FilterButton, { type FilterSection, type FilterValues } from '@/components/admin/FilterButton'
import ActionButtons from '@/components/admin/ActionButtons'
import ExportButton from '@/components/admin/ExportButton'
import AddButton from '@/components/admin/AddButton'
import StatusBadge, { getStatusVariant } from '@/components/admin/StatusBadge'
import { downloadCsvBlob, exportCsv } from '@/lib/export-csv'
import { useOffers, useToggleOfferStatus } from '@/hooks/useOffers'
import { exportAllOffersCsv } from '@/services/offers'
import type { Offer } from '@/types/offer'
import { Pause, Play } from 'iconsax-reactjs'

const getOfferStatus = (offer: Offer) => {
  if (!offer.status) return 'Draft'
  const now = new Date()
  const start = new Date(offer.startDate)
  const end = new Date(offer.endDate)
  if (!Number.isNaN(start.getTime()) && start > now) return 'Scheduled'
  if (!Number.isNaN(end.getTime()) && end < now) return 'Expired'
  return 'Active'
}

const formatOfferType = (type: Offer['type']) => {
  if (type === 'PERCENTAGE') return 'Percentage'
  if (type === 'FIXED_AMOUNT') return 'Fixed amount'
  if (type === 'FREE_SHIPPING') return 'Free shipping'
  return 'Bundle'
}

const offerFilterSections: FilterSection[] = [
  {
    key: 'type',
    title: 'Type',
    options: [
      { value: 'PERCENTAGE', label: 'Percentage' },
      { value: 'BOGO', label: 'Buy one get one' },
      { value: 'FIXED_AMOUNT', label: 'Fixed amount' },
      { value: 'BUNDLE', label: 'Bundle' },
      { value: 'FREE_SHIPPING', label: 'Free shipping' },
    ],
  },
  {
    key: 'status',
    title: 'Status',
    showBadge: true,
    options: [
      { value: 'Active', label: 'Active', badgeVariant: 'success' },
      { value: 'Expired', label: 'Expired', badgeVariant: 'error' },
      { value: 'Scheduled', label: 'Scheduled', badgeVariant: 'warning' },
      { value: 'Draft', label: 'Draft', badgeVariant: 'default' },
    ],
  },
]

/*
For quick local UI testing, replace `const offersSource = data ?? []` with:

const offersSource: Offer[] = [
  {
    id: 'off-1',
    code: 'SAVE20',
    nameEn: 'Spring 20%',
    nameAr: 'خصم الربيع 20%',
    type: 'PERCENTAGE',
    discountValue: 20,
    minCartValue: 500,
    maxDiscount: 400,
    applyTo: 'ALL',
    targetId: null,
    startDate: '2026-02-01T00:00:00.000Z',
    endDate: '2026-03-01T00:00:00.000Z',
    startTime: null,
    endTime: null,
    totalUsageLimit: 500,
    perUserLimit: 1,
    currentUsage: 12,
    status: true,
    createdAt: '2026-02-01T00:00:00.000Z',
    updatedAt: '2026-02-01T00:00:00.000Z',
  },
]
*/

const formatDate = (value: string) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '---' : date.toLocaleDateString()
}

const createExportFilename = (prefix: string) => {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  return `${prefix}-${stamp}.csv`
}

function ToggleButton({ isActive, onClick }: { isActive: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer p-1.5 transition-colors ${isActive ? 'text-primary hover:text-red-700' : 'text-neutral-400 hover:text-neutral-600'}`}
      title={isActive ? 'Pause offer' : 'Activate offer'}
    >
      {isActive ? (
        <Pause size={18} color="red" />
      ) : (
        <Play size={18} color="green" />
      )}
    </button>
  )
}

export default function OffersPage() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [offerFilters, setOfferFilters] = useState<FilterValues>({})
  const [isExportingAllOffers, setIsExportingAllOffers] = useState(false)
  const pageSize = 10

  const { data, isLoading, isError } = useOffers()
  const { mutateAsync } = useToggleOfferStatus()
  const selectedTypes = (offerFilters.type ?? []) as string[]
  const selectedStatuses = (offerFilters.status ?? []) as string[]
  const offersSource = data ?? []

  const filteredOffers = useMemo(() => {
    return offersSource.filter((offer) => {
      const haystack = `${offer.nameEn} ${offer.nameAr} ${offer.code}`.toLowerCase()
      const matchesSearch = !searchQuery || haystack.includes(searchQuery.toLowerCase())

      const matchesType =
        selectedTypes.length === 0 ||
        selectedTypes.some((type) => {
          if (type === 'BOGO') return offer.type === 'BUNDLE'
          return offer.type === type
        })

      const computedStatus = getOfferStatus(offer)
      const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(computedStatus)

      return matchesSearch && matchesType && matchesStatus
    })
  }, [offersSource, searchQuery, selectedTypes, selectedStatuses])

  const totalPages = Math.max(1, Math.ceil(filteredOffers.length / pageSize))
  const pagedOffers = filteredOffers.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const exportCurrentOffersPage = () => {
    const headers = [
      'Code',
      'Name (EN)',
      'Name (AR)',
      'Type',
      'Status',
      'Discount Value',
      'Apply To',
      'Target',
      'Times Used',
      'Start Date',
      'End Date',
    ]

    const rows = pagedOffers.map((offer) => [
      offer.code,
      offer.nameEn,
      offer.nameAr,
      formatOfferType(offer.type),
      getOfferStatus(offer),
      offer.discountValue,
      offer.applyTo,
      offer.targetId ?? '',
      offer.currentUsage ?? 0,
      offer.startDate,
      offer.endDate,
    ])

    exportCsv(createExportFilename('offers-current-page'), headers, rows)
  }

  const exportAllOffersFiltered = async () => {
    setIsExportingAllOffers(true)
    try {
      const mappedTypes = selectedTypes.map((type) => (type === 'BOGO' ? 'BUNDLE' : type))
      const uniqueTypes = Array.from(new Set(mappedTypes))
      const blob = await exportAllOffersCsv({
        search: searchQuery || undefined,
        type: uniqueTypes.length ? uniqueTypes.join(',') : undefined,
        status: selectedStatuses.length ? selectedStatuses.join(',') : undefined,
      })
      downloadCsvBlob(createExportFilename('offers-all-filtered'), blob)
    } finally {
      setIsExportingAllOffers(false)
    }
  }

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
      render: (offer) => formatOfferType(offer.type),
    },
    {
      key: 'status',
      header: 'Status',
      width: 'w-[110px]',
      render: (offer) => {
        const status = getOfferStatus(offer)
        return <StatusBadge label={status} variant={getStatusVariant(status)} />
      },
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
        <ActionButtons
          showView={false}
          showDelete={false}
          onEdit={() => router.push(`/admin/offers/${offer.id}/edit`)}
          extraActions={
            <ToggleButton
              isActive={offer.status}
              onClick={() => mutateAsync({ id: offer.id, status: !offer.status })}
            />
          }
        />
      ),
    },
  ]

  return (
    <div className="p-6">
      <div className="flex items-center justify-end mb-6">
        <AddButton label="Create New Offer" onClick={() => router.push('/admin/offers/new')} />
      </div>

      <div className="bg-white rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-neutral-900">All Offers</h1>
          <div className="flex items-center gap-3">
            <SearchInput
              placeholder="Search"
              value={searchQuery}
              onChange={setSearchQuery}
              className="w-56"
            />
            <FilterButton
              sections={offerFilterSections}
              value={offerFilters}
              onApply={(next) => {
                setOfferFilters(next)
                setCurrentPage(1)
              }}
              onReset={() => {
                setOfferFilters({})
                setCurrentPage(1)
              }}
            />
            <ExportButton
              onExportCurrentPage={exportCurrentOffersPage}
              onExportAllFiltered={exportAllOffersFiltered}
              allFilteredLabel={isExportingAllOffers ? 'All (filtered) - exporting...' : 'All (filtered)'}
            />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={pagedOffers}
          keyExtractor={(offer) => offer.id}
          emptyMessage={isLoading ? 'Loading offers...' : isError ? 'Failed to load offers' : 'No offers found'}
        />

        <div className="pt-4">
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
