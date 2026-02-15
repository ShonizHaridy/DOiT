'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { FormPageHeader } from '@/components/admin/forms'
import StatusSelect from '@/components/admin/StatusSelect'
import OrderStatusTimeline, { StatusStep } from '@/components/admin/OrderStatusTimeline'
import { useAdminOrder, useUpdateOrderStatus } from '@/hooks/useOrders'
import type { OrderStatus } from '@/types/order'

const statusOptions = [
  { value: 'ORDER_PLACED', label: 'New' },
  { value: 'PROCESSED', label: 'In progress' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Canceled' },
]

const formatDateTime = (value?: string) => {
  if (!value) return '---'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '---' : date.toLocaleString()
}

const statusLabel = (status: OrderStatus) => {
  if (status === 'ORDER_PLACED') return 'New'
  if (status === 'PROCESSED') return 'In progress'
  if (status === 'SHIPPED') return 'Shipped'
  if (status === 'DELIVERED') return 'Completed'
  return 'Canceled'
}

export default function OrderDetailsPage() {
  const params = useParams()
  const orderId = params?.id as string
  const { data: order, isLoading } = useAdminOrder(orderId)
  const { mutateAsync, isPending } = useUpdateOrderStatus()
  const [orderStatus, setOrderStatus] = useState<OrderStatus | ''>('')

  useEffect(() => {
    if (order?.status) {
      setOrderStatus(order.status as OrderStatus)
    }
  }, [order?.status])

  const statusSteps = useMemo<StatusStep[]>(() => {
    if (!order) return []
    const historyMap = new Map(
      (order.statusHistory ?? []).map((item) => [item.status, item.createdAt])
    )
    const statuses: OrderStatus[] = order.status === 'CANCELLED'
      ? ['ORDER_PLACED', 'PROCESSED', 'SHIPPED', 'DELIVERED', 'CANCELLED']
      : ['ORDER_PLACED', 'PROCESSED', 'SHIPPED', 'DELIVERED']
    return statuses.map((status) => ({
      label: statusLabel(status),
      timestamp: formatDateTime(historyMap.get(status)),
      completed: historyMap.has(status) && status !== order.status,
      active: status === order.status,
    }))
  }, [order])

  const handleStatusChange = async (value: string) => {
    const nextStatus = value as OrderStatus
    setOrderStatus(nextStatus)
    if (!order) return
    await mutateAsync({ orderId: order.id, status: nextStatus })
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
            options={statusOptions}
            disabled={isPending}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-2 mb-6 text-sm">
          <div>
            <span className="text-neutral-500">Customer</span>
            <p className="font-medium text-neutral-900">{order.customer?.fullName ?? '---'}</p>
          </div>
          <div>
            <span className="text-neutral-500">Delivered to</span>
            <p className="font-medium text-neutral-900">{order.address?.fullAddress ?? '---'}</p>
          </div>
          <div>
            <span className="text-neutral-500">Email</span>
            <p className="font-medium text-neutral-900">{order.customer?.email ?? '---'}</p>
          </div>
          <div>
            <span className="text-neutral-500">Total</span>
            <p className="font-medium text-neutral-900">{order.total.toLocaleString()} {order.currency ?? 'EGP'}</p>
          </div>
          <div>
            <span className="text-neutral-500">Payment</span>
            <p className="font-medium text-neutral-900">{order.paymentMethod ?? '---'}</p>
          </div>
          <div>
            <span className="text-neutral-500">Tracking</span>
            <p className="font-medium text-neutral-900">{order.trackingNumber ?? '---'}</p>
          </div>
        </div>

        <div className="flex gap-6">
          <div className="flex-1">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left text-sm font-medium text-neutral-500 pb-3">Product</th>
                  <th className="text-left text-sm font-medium text-neutral-500 pb-3">Price</th>
                  <th className="text-center text-sm font-medium text-neutral-500 pb-3">Quantity</th>
                  <th className="text-right text-sm font-medium text-neutral-500 pb-3">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {order.items.map((product) => (
                  <tr key={product.id}>
                    <td className="py-4 pr-4">
                      <div className="flex items-start gap-3">
                        <div className="w-16 h-16 bg-neutral-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                          {product.productImage ? (
                            <img src={product.productImage} alt={product.productName} className="w-full h-full object-cover" />
                          ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-neutral-300">
                              <rect x="2" y="2" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" />
                              <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
                              <path d="M2 16L8 10L22 22" stroke="currentColor" strokeWidth="1.5" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-neutral-900 mb-1">{product.productName}</p>
                          <div className="text-xs text-neutral-500 space-y-0.5">
                            <p><span className="font-medium text-neutral-700">Vendor</span> {product.vendor}</p>
                            <p><span className="font-medium text-neutral-700">Type</span> {product.type ?? '---'}</p>
                            <p><span className="font-medium text-neutral-700">Size</span> {product.size}</p>
                            <p><span className="font-medium text-neutral-700">Gender</span> {product.gender ?? '---'}</p>
                            <p><span className="font-medium text-neutral-700">SKU</span> {product.sku}</p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4 align-top">
                      <div className="pt-1">
                        <p className="text-sm font-medium text-neutral-900">{product.price.toLocaleString()} EGP</p>
                        {product.originalPrice && (
                          <p className="text-xs text-neutral-400 line-through">{product.originalPrice.toLocaleString()} EGP</p>
                        )}
                        {product.discount && (
                          <p className="text-xs text-primary mt-1 flex items-center gap-1">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1" />
                              <path d="M4 6L5.5 7.5L8 4.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                            </svg>
                            {product.discount}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 text-center align-top">
                      <div className="pt-1">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-neutral-200 text-sm font-medium text-neutral-700">
                          {product.quantity}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 text-right align-top">
                      <p className="text-sm font-medium text-neutral-900 pt-1">
                        {(product.price * product.quantity).toLocaleString()} EGP
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="w-56 flex-shrink-0 border-l border-neutral-100 pl-6">
            <OrderStatusTimeline steps={statusSteps} />
          </div>
        </div>
      </div>
    </form>
  )
}

