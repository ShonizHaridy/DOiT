'use client'

import { useMemo, useState } from 'react'
import DataTable, { Column } from '@/components/admin/DataTable'
import StatusBadge, { getStatusVariant } from '@/components/admin/StatusBadge'
import {
  useAdminShippingRates,
  useBulkUpsertShippingRates,
  useDeleteShippingRate,
  useUpdateShippingRate,
} from '@/hooks/useShipping'
import type { ShippingRate } from '@/types/order'
import { EGYPT_GOVERNORATES } from '@/data/governorates'

const governorateValues = EGYPT_GOVERNORATES.map((item) => item.value)

export default function ShippingRatesPage() {
  const { data, isLoading, isError } = useAdminShippingRates()
  const { mutateAsync: bulkUpsertRates, isPending: isBulkSaving } = useBulkUpsertShippingRates()
  const { mutateAsync: updateRate, isPending: isUpdating } = useUpdateShippingRate()
  const { mutateAsync: deleteRate, isPending: isDeleting } = useDeleteShippingRate()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [governorate, setGovernorate] = useState('Cairo')
  const [selectedGovernorates, setSelectedGovernorates] = useState<string[]>([])
  const [price, setPrice] = useState('')
  const [status, setStatus] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const rates = useMemo(() => data ?? [], [data])
  const isBusy = isBulkSaving || isUpdating || isDeleting
  const isEditMode = Boolean(editingId)

  const governorateSetWithRate = useMemo(
    () => new Set(rates.map((rate) => rate.governorate)),
    [rates]
  )

  const getErrorMessage = (error: unknown, fallback: string) => {
    if (typeof error === 'object' && error !== null) {
      const responseData = (error as { response?: { data?: { message?: unknown } } }).response?.data
      const apiMessage = responseData?.message
      if (Array.isArray(apiMessage)) return apiMessage.join(', ')
      if (typeof apiMessage === 'string' && apiMessage.trim().length > 0) return apiMessage
    }
    if (error instanceof Error && error.message) return error.message
    return fallback
  }

  const resetForm = () => {
    setEditingId(null)
    setGovernorate('Cairo')
    setSelectedGovernorates([])
    setPrice('')
    setStatus(true)
    setErrorMessage(null)
  }

  const toggleGovernorateSelection = (value: string) => {
    setSelectedGovernorates((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
    )
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setErrorMessage(null)

    const parsedPrice = Number(price)
    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      setErrorMessage('Price must be a valid number greater than or equal to zero.')
      return
    }

    try {
      if (isEditMode && editingId) {
        await updateRate({
          id: editingId,
          payload: {
            governorate,
            price: parsedPrice,
            status,
          },
        })
      } else {
        if (selectedGovernorates.length === 0) {
          setErrorMessage('Select at least one governorate.')
          return
        }
        await bulkUpsertRates({
          governorates: selectedGovernorates,
          price: parsedPrice,
          status,
        })
      }
      resetForm()
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Failed to save shipping rates.'))
    }
  }

  const handleEdit = (rate: ShippingRate) => {
    const canEditGovernorate = governorateValues.includes(rate.governorate)
    setEditingId(rate.id)
    setGovernorate(canEditGovernorate ? rate.governorate : 'Cairo')
    setSelectedGovernorates([])
    setPrice(String(rate.price))
    setStatus(Boolean(rate.status))
    setErrorMessage(
      canEditGovernorate
        ? null
        : 'This record has a non-standard governorate value. Select a valid governorate then save.'
    )
  }

  const handleDelete = async (id: string) => {
    setErrorMessage(null)
    try {
      await deleteRate(id)
      if (editingId === id) {
        resetForm()
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Failed to delete shipping rate.'))
    }
  }

  const selectAllGovernorates = () => {
    setSelectedGovernorates(governorateValues)
  }

  const clearGovernoratesSelection = () => {
    setSelectedGovernorates([])
  }

  const columns: Column<ShippingRate>[] = [
    {
      key: 'governorate',
      header: 'Governorate',
      width: 'min-w-[220px]',
    },
    {
      key: 'price',
      header: 'Shipping Price',
      width: 'w-[180px]',
      render: (rate) => `${Number(rate.price).toLocaleString()} EGP`,
    },
    {
      key: 'status',
      header: 'Status',
      width: 'w-[140px]',
      render: (rate) => {
        const label = rate.status ? 'Active' : 'Inactive'
        return <StatusBadge label={label} variant={getStatusVariant(label)} />
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      width: 'w-[180px]',
      render: (rate) => (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleEdit(rate)}
            className="text-sm text-blue-600 hover:underline disabled:opacity-50"
            disabled={isBusy}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => handleDelete(rate.id)}
            className="text-sm text-red-600 hover:underline disabled:opacity-50"
            disabled={isBusy}
          >
            Delete
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Shipping Rates</h1>
        <p className="text-sm text-neutral-500 mb-4">
          {isEditMode
            ? 'Edit a single governorate rate.'
            : 'Set one shipping price for one or many governorates at once.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isEditMode ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <select
                value={governorate}
                onChange={(event) => setGovernorate(event.target.value)}
                className="h-11 rounded border border-neutral-200 px-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                disabled={isBusy}
              >
                {EGYPT_GOVERNORATES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.labelEn}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                placeholder="Shipping price"
                className="h-11 rounded border border-neutral-200 px-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                disabled={isBusy}
              />
              <label className="h-11 px-3 rounded border border-neutral-200 text-sm text-neutral-700 inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={status}
                  onChange={(event) => setStatus(event.target.checked)}
                  disabled={isBusy}
                />
                Active
              </label>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  placeholder="Shipping price"
                  className="h-11 rounded border border-neutral-200 px-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                  disabled={isBusy}
                />
                <label className="h-11 px-3 rounded border border-neutral-200 text-sm text-neutral-700 inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={status}
                    onChange={(event) => setStatus(event.target.checked)}
                    disabled={isBusy}
                  />
                  Active
                </label>
                <div className="h-11 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={selectAllGovernorates}
                    className="px-3 py-2 rounded border border-neutral-300 text-sm text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
                    disabled={isBusy}
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={clearGovernoratesSelection}
                    className="px-3 py-2 rounded border border-neutral-300 text-sm text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
                    disabled={isBusy}
                  >
                    Clear
                  </button>
                  <span className="text-xs text-neutral-500">
                    {selectedGovernorates.length} selected
                  </span>
                </div>
              </div>

              <div className="rounded border border-neutral-200 p-3 max-h-60 overflow-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {EGYPT_GOVERNORATES.map((item) => {
                    const selected = selectedGovernorates.includes(item.value)
                    const hasRate = governorateSetWithRate.has(item.value)
                    return (
                      <label
                        key={item.value}
                        className="flex items-center gap-2 text-sm text-neutral-700"
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleGovernorateSelection(item.value)}
                          disabled={isBusy}
                        />
                        <span>{item.labelEn}</span>
                        {hasRate && <span className="text-xs text-neutral-400">(configured)</span>}
                      </label>
                    )
                  })}
                </div>
              </div>
            </>
          )}

          {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isBusy}
              className="h-11 px-5 rounded bg-neutral-900 text-white text-sm font-medium disabled:opacity-50"
            >
              {isEditMode ? 'Update Rate' : 'Apply Price To Selected Governorates'}
            </button>
            {isEditMode && (
              <button
                type="button"
                onClick={resetForm}
                disabled={isBusy}
                className="h-11 px-5 rounded border border-neutral-900 text-neutral-900 text-sm font-medium disabled:opacity-50"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg p-4">
        <DataTable
          columns={columns}
          data={rates}
          keyExtractor={(rate) => rate.id}
          emptyMessage={
            isLoading
              ? 'Loading shipping rates...'
              : isError
                ? 'Failed to load shipping rates'
                : 'No shipping rates found'
          }
        />
      </div>
    </div>
  )
}
