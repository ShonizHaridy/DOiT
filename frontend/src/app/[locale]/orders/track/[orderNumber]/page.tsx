'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import PageTitleBanner from '@/components/layout/PageTitleBanner'
import { getCustomOrder, getGuestOrder } from '@/services/orders'
import type { CustomOrder, Order } from '@/types/order'

type TrackState =
  | { type: 'standard'; order: Order }
  | { type: 'custom'; order: CustomOrder }
  | null

const getStatusLabel = (status: string) => {
  const value = status.toUpperCase()
  if (value === 'ORDER_PLACED' || value === 'PENDING') return 'New'
  if (value === 'PROCESSED' || value === 'APPROVED') return 'In progress'
  if (value === 'SHIPPED' || value === 'IN_PRODUCTION') return 'Shipped'
  if (value === 'DELIVERED' || value === 'COMPLETED') return 'Completed'
  if (value === 'CANCELLED') return 'Canceled'
  return status
}

export default function TrackOrderPage() {
  const params = useParams<{ orderNumber?: string }>()
  const [data, setData] = useState<TrackState>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const orderNumberParam = typeof params?.orderNumber === 'string' ? params.orderNumber : ''

  const decodedOrderNumber = useMemo(
    () => (orderNumberParam ? decodeURIComponent(orderNumberParam) : ''),
    [orderNumberParam]
  )

  useEffect(() => {
    let mounted = true

    const loadOrder = async () => {
      if (!decodedOrderNumber) {
        setError('Order not found. Please check the tracking link and try again.')
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const standardOrder = await getGuestOrder(decodedOrderNumber)
        if (!mounted) return
        setData({ type: 'standard', order: standardOrder })
        return
      } catch {
        // Try custom order tracking as fallback
      }

      try {
        const customOrder = await getCustomOrder(decodedOrderNumber)
        if (!mounted) return
        setData({ type: 'custom', order: customOrder })
      } catch {
        if (!mounted) return
        setError('Order not found. Please check the tracking link and try again.')
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    loadOrder()

    return () => {
      mounted = false
    }
  }, [decodedOrderNumber])

  const handleCopyLink = async () => {
    if (typeof window === 'undefined') return
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <PageTitleBanner title="Track Order" />

      <div className="container-doit py-8 md:py-12">
        <div className="mx-auto max-w-3xl rounded-2xl border border-neutral-200 bg-white p-6 md:p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h2 className="text-xl md:text-2xl font-semibold text-neutral-900">
              Order {decodedOrderNumber}
            </h2>
            <button
              type="button"
              onClick={handleCopyLink}
              className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 cursor-pointer"
            >
              {copied ? 'Copied' : 'Copy tracking URL'}
            </button>
          </div>

          <p className="text-sm text-neutral-600">
            You can copy this URL and keep tracking your order status anytime.
          </p>

          {isLoading && (
            <p className="text-neutral-500">Loading order details...</p>
          )}

          {!isLoading && error && (
            <div className="space-y-3">
              <p className="text-red-600">{error}</p>
              <Link
                href="/"
                className="inline-flex rounded-md bg-secondary px-4 py-2 text-sm font-medium text-white"
              >
                Back to Home
              </Link>
            </div>
          )}

          {!isLoading && data?.type === 'standard' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-neutral-500">Status</p>
                  <p className="font-medium text-neutral-900">{getStatusLabel(data.order.status)}</p>
                </div>
                <div>
                  <p className="text-neutral-500">Total</p>
                  <p className="font-medium text-neutral-900">
                    {data.order.total.toLocaleString()} {data.order.currency}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-neutral-500 text-sm">Items</p>
                {data.order.items.map((item) => (
                  <div key={item.id} className="rounded-lg border border-neutral-200 px-3 py-2 text-sm">
                    <p className="font-medium text-neutral-900">{item.productName}</p>
                    <p className="text-neutral-600">
                      {item.color} / {item.size} x {item.quantity}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isLoading && data?.type === 'custom' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-neutral-500">Status</p>
                  <p className="font-medium text-neutral-900">{getStatusLabel(data.order.status)}</p>
                </div>
                <div>
                  <p className="text-neutral-500">Quantity</p>
                  <p className="font-medium text-neutral-900">{data.order.quantity}</p>
                </div>
                <div>
                  <p className="text-neutral-500">Product Type</p>
                  <p className="font-medium text-neutral-900">{data.order.productType}</p>
                </div>
                <div>
                  <p className="text-neutral-500">Variant</p>
                  <p className="font-medium text-neutral-900">
                    {data.order.color || '-'} / {data.order.size || '-'}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-neutral-500 text-sm">Customization Details</p>
                <p className="text-neutral-900 text-sm mt-1">
                  {data.order.details || 'No details provided.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
