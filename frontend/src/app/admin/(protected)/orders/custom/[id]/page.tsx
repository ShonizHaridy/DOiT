'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { FormPageHeader } from '@/components/admin/forms'
import StatusSelect from '@/components/admin/StatusSelect'
import OrderStatusTimeline, { StatusStep } from '@/components/admin/OrderStatusTimeline'
import { useAdminCustomOrder, useUpdateCustomOrderStatus } from '@/hooks/useOrders'
import type { CustomOrderStatus } from '@/types/order'

type UiOrderStatus = 'NEW' | 'IN_PROGRESS' | 'SHIPPED' | 'COMPLETED' | 'CANCELED'

const STATUS_OPTIONS = [
  { value: 'NEW', label: 'New' },
  { value: 'IN_PROGRESS', label: 'In progress' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELED', label: 'Canceled' },
]

const CUSTOM_API_TO_UI: Record<CustomOrderStatus, UiOrderStatus> = {
  PENDING: 'NEW',
  APPROVED: 'IN_PROGRESS',
  IN_PRODUCTION: 'SHIPPED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELED',
}

const CUSTOM_UI_TO_API: Record<UiOrderStatus, CustomOrderStatus> = {
  NEW: 'PENDING',
  IN_PROGRESS: 'APPROVED',
  SHIPPED: 'IN_PRODUCTION',
  COMPLETED: 'COMPLETED',
  CANCELED: 'CANCELLED',
}

const formatDateTime = (value?: string) => {
  if (!value) return '---'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '---' : date.toLocaleString()
}

const labelForUiStatus = (status: UiOrderStatus) => {
  if (status === 'NEW') return 'New'
  if (status === 'IN_PROGRESS') return 'In progress'
  if (status === 'SHIPPED') return 'Shipped'
  if (status === 'COMPLETED') return 'Completed'
  return 'Canceled'
}

const imageUrlsFrom = (referenceImages: unknown) => {
  if (!Array.isArray(referenceImages)) return []
  return referenceImages.filter((url): url is string => typeof url === 'string' && !!url)
}

export default function CustomOrderDetailsPage() {
  const params = useParams()
  const orderId = params?.id as string
  const { data: order, isLoading } = useAdminCustomOrder(orderId)
  const { mutateAsync, isPending } = useUpdateCustomOrderStatus()
  const [orderStatus, setOrderStatus] = useState<UiOrderStatus | ''>('')

  useEffect(() => {
    if (!order?.status) return
    setOrderStatus(CUSTOM_API_TO_UI[order.status as CustomOrderStatus] ?? 'NEW')
  }, [order?.status])

  const imageUrls = useMemo(
    () => imageUrlsFrom(order?.referenceImages),
    [order?.referenceImages]
  )

  const statusSteps = useMemo<StatusStep[]>(() => {
    if (!order?.status) return []
    const current = CUSTOM_API_TO_UI[order.status as CustomOrderStatus] ?? 'NEW'

    const all: UiOrderStatus[] = ['NEW', 'IN_PROGRESS', 'SHIPPED', 'COMPLETED', 'CANCELED']
    return all.map((status) => {
      const currentIndex = all.indexOf(current)
      const stepIndex = all.indexOf(status)
      const isCanceledFlow = current === 'CANCELED'
      const completed = !isCanceledFlow && stepIndex < currentIndex
      const active = status === current
      let timestamp = '---'

      if (status === 'NEW') {
        timestamp = formatDateTime(order.createdAt)
      } else if (active) {
        timestamp = formatDateTime(order.updatedAt)
      }

      return {
        label: labelForUiStatus(status),
        timestamp,
        completed,
        active,
      }
    })
  }, [order])

  const handleStatusChange = async (value: string) => {
    if (!order) return
    const nextUiStatus = value as UiOrderStatus
    const nextApiStatus = CUSTOM_UI_TO_API[nextUiStatus]
    setOrderStatus(nextUiStatus)
    await mutateAsync({ orderId: order.id, status: nextApiStatus })
  }

  if (isLoading || !order) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg p-6 text-sm text-neutral-500">
          Loading order details...
        </div>
      </div>
    )
  }

  const customerName = order.customer?.fullName ?? (order.customerId.startsWith('guest-') ? 'Guest' : order.customerId)
  const customerEmail = order.customer?.email ?? '---'

  return (
    <form className="p-6">
      <FormPageHeader
        title="Order Details"
        backHref="/admin/orders"
      />

      <div className="bg-white rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-neutral-900">Order {order.orderNumber}</h2>
          <StatusSelect
            value={orderStatus}
            onChange={handleStatusChange}
            options={STATUS_OPTIONS}
            disabled={isPending}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-2 mb-6 text-sm">
          <div>
            <span className="text-neutral-500">Customer</span>
            <p className="font-medium text-neutral-900">{customerName}</p>
          </div>
          <div>
            <span className="text-neutral-500">Email</span>
            <p className="font-medium text-neutral-900">{customerEmail}</p>
          </div>
          <div>
            <span className="text-neutral-500">Quantity</span>
            <p className="font-medium text-neutral-900">{order.quantity}</p>
          </div>
          <div>
            <span className="text-neutral-500">Total</span>
            <p className="font-medium text-neutral-900">
              {order.total !== undefined ? `${order.total.toLocaleString()} EGP` : '---'}
            </p>
          </div>
          <div>
            <span className="text-neutral-500">Product Type</span>
            <p className="font-medium text-neutral-900">{order.productType}</p>
          </div>
          <div>
            <span className="text-neutral-500">Color</span>
            <p className="font-medium text-neutral-900">{order.color || '---'}</p>
          </div>
          <div>
            <span className="text-neutral-500">Size</span>
            <p className="font-medium text-neutral-900">{order.size || '---'}</p>
          </div>
          <div>
            <span className="text-neutral-500">Gender</span>
            <p className="font-medium text-neutral-900">{order.gender || '---'}</p>
          </div>
        </div>

        <div className="flex gap-6">
          <div className="flex-1 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-2">Customization Details</h3>
              <p className="text-sm text-neutral-700">
                {order.details || 'No details provided.'}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-2">Reference Images</h3>
              {imageUrls.length === 0 ? (
                <p className="text-sm text-neutral-500">No images uploaded.</p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {imageUrls.map((imageUrl, index) => (
                    <a
                      key={`${imageUrl}-${index}`}
                      href={imageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="block w-[120px] h-[96px] rounded-lg border border-neutral-200 overflow-hidden bg-neutral-100"
                    >
                      <img
                        src={imageUrl}
                        alt={`Reference ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="w-56 flex-shrink-0 border-l border-neutral-100 pl-6">
            <OrderStatusTimeline steps={statusSteps} />
          </div>
        </div>
      </div>
    </form>
  )
}
