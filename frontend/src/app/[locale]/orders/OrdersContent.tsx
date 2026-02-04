'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ArrowDown2, ArrowUp2 } from 'iconsax-reactjs'
import { cn } from '@/lib/utils'
import { MOCK_ORDERS, ORDER_TABS, type Order } from '@/data/orders'

interface OrdersContentProps {
  locale: string
}

function StatusBadge({ status }: { status: Order['status'] }) {
  const styles = {
    'in progress': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'shipped': 'bg-blue-100 text-blue-700 border-blue-200',
    'completed': 'bg-green-100 text-green-700 border-green-200',
    'cancelled': 'bg-red-100 text-red-700 border-red-200',
  }

  return (
    <span className={cn('px-2 py-0.5 text-xs font-medium rounded border', styles[status])}>
      {status}
    </span>
  )
}

function OrderCard({ order, isExpanded, onToggle }: { order: Order; isExpanded: boolean; onToggle: () => void }) {
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Order Header */}
      <div className="p-4 lg:p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-roboto font-bold text-lg">Order {order.orderNumber}</h3>
            <p className="text-sm text-text-body">{itemCount} Items | {order.time},{order.date}</p>
          </div>
          <button onClick={onToggle} className="p-1 text-text-body hover:text-primary">
            {isExpanded ? <ArrowUp2 size={20} /> : <ArrowDown2 size={20} />}
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-2 gap-x-4 text-sm">
          <div className="flex gap-2">
            <span className="text-text-body">Status</span>
            <StatusBadge status={order.status} />
          </div>
          <div className="flex gap-2 col-span-2 lg:col-span-1">
            <span className="text-text-body">Delivered to</span>
            <span className="font-medium text-primary truncate">{order.deliveredTo}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-text-body">Date of delivery</span>
            <span className="font-medium text-primary">{order.dateOfDelivery}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-text-body">Total</span>
            <span className="font-medium text-primary">{order.total.toLocaleString()} {order.currency}</span>
          </div>
        </div>
      </div>

      {/* Expanded Items Table */}
      {isExpanded && (
        <div className="border-t border-gray-200">
          {/* Desktop Table */}
          <div className="hidden lg:block">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-start py-3 px-6 font-roboto font-medium text-sm text-text-body">Product</th>
                  <th className="text-start py-3 px-4 font-roboto font-medium text-sm text-text-body">Price</th>
                  <th className="text-start py-3 px-4 font-roboto font-medium text-sm text-text-body">Quantity</th>
                  <th className="text-end py-3 px-6 font-roboto font-medium text-sm text-text-body">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 last:border-b-0">
                    <td className="py-4 px-6">
                      <div className="flex gap-4">
                        <div className="relative w-20 h-20 bg-bg-card rounded shrink-0">
                          <Image src={item.image} alt={item.title} fill className="object-contain p-2" />
                        </div>
                        <div>
                          <h4 className="font-roboto font-bold text-sm mb-1">{item.title}</h4>
                          <div className="grid grid-cols-2 gap-x-6 text-xs text-text-body">
                            <div className="flex gap-1">
                              <span>Vendor</span>
                              <span className="font-medium text-primary">{item.vendor}</span>
                            </div>
                            <div className="flex gap-1">
                              <span>Type</span>
                              <span className="font-medium text-primary">{item.type}</span>
                            </div>
                            <div className="flex gap-1">
                              <span>Size</span>
                              <span className="font-medium text-primary">{item.size}</span>
                            </div>
                            <div className="flex gap-1">
                              <span>Gender</span>
                              <span className="font-medium text-primary">{item.gender}</span>
                            </div>
                            <div className="flex gap-1">
                              <span>SKU</span>
                              <span className="font-medium text-primary">{item.sku}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <span className="font-medium">{item.price.toLocaleString()} {item.currency}</span>
                        {item.originalPrice && (
                          <span className="block text-sm text-text-placeholder line-through">
                            {item.originalPrice.toLocaleString()} {item.currency}
                          </span>
                        )}
                        {item.discount && (
                          <span className="block text-xs text-green-600">⊛ {item.discount}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="w-8 h-8 inline-flex items-center justify-center border border-border-light rounded-full">
                        {item.quantity}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-end">
                      <span className="font-bold">{(item.price * item.quantity).toLocaleString()} {item.currency}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden p-4 space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="relative w-16 h-16 bg-bg-card rounded shrink-0">
                  <Image src={item.image} alt={item.title} fill className="object-contain p-1" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-roboto font-bold text-sm line-clamp-1 mb-1">{item.title}</h4>
                  <p className="text-xs text-text-body mb-1">
                    {item.vendor} • {item.size} • Qty: {item.quantity}
                  </p>
                  <span className="font-bold text-sm">{(item.price * item.quantity).toLocaleString()} {item.currency}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function OrdersContent({ locale }: OrdersContentProps) {
  const [activeTab, setActiveTab] = useState('all')
  const [expandedOrders, setExpandedOrders] = useState<string[]>([MOCK_ORDERS[0]?.id || ''])

  const filteredOrders = MOCK_ORDERS.filter((order) => {
    if (activeTab === 'all') return true
    if (activeTab === 'in-progress') return order.status === 'in progress'
    return order.status === activeTab
  })

  const toggleOrder = (orderId: string) => {
    setExpandedOrders((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    )
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 lg:px-6 py-6 lg:py-10">
      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
        {ORDER_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded border whitespace-nowrap transition-colors',
              activeTab === tab.key
                ? 'border-primary bg-primary text-white'
                : 'border-gray-200 text-text-body hover:border-primary'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            isExpanded={expandedOrders.includes(order.id)}
            onToggle={() => toggleOrder(order.id)}
          />
        ))}

        {filteredOrders.length === 0 && (
          <p className="text-center text-text-body py-12">No orders found</p>
        )}
      </div>
    </div>
  )
}