'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ArrowDown2, ArrowUp2 } from 'iconsax-reactjs'
import { cn } from '@/lib/utils'
import { useCustomOrders, useOrders } from '@/hooks/useOrders'
import { useAuthStore } from '@/store'
import type { CustomOrder, Order } from '@/types/order'
import OrderStatusBadge, { type OrderUiStatusKey } from '@/components/ui/OrderStatusBadge'
import { toAbsoluteMediaUrl } from '@/lib/media-url'

type OrderTab = 'all' | OrderUiStatusKey

type UnifiedOrder =
  | { kind: 'standard'; data: Order }
  | { kind: 'custom'; data: CustomOrder }

interface OrdersContentProps {
  locale: string
}

const getStatusKey = (status: string): OrderUiStatusKey => {
  const value = status.toUpperCase()
  if (value === 'ORDER_PLACED' || value === 'PENDING') return 'new'
  if (value === 'PROCESSED' || value === 'APPROVED') return 'inProgress'
  if (value === 'SHIPPED' || value === 'IN_PRODUCTION') return 'shipped'
  if (value === 'DELIVERED' || value === 'COMPLETED') return 'completed'
  return 'cancelled'
}

const formatDateTime = (value: string, locale: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '---'

  return date.toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function StandardOrderDetails({ order, locale }: { order: Order; locale: string }) {
  const t = useTranslations('orders')
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0)
  const statusKey = getStatusKey(order.status)

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-2 gap-x-4 text-sm">
        <div className="flex gap-2">
          <span className="text-text-body">{t('status')}</span>
          <OrderStatusBadge label={t(`statusValues.${statusKey}`)} statusKey={statusKey} />
        </div>
        <div className="flex gap-2 col-span-2 lg:col-span-1">
          <span className="text-text-body">{t('deliveredTo')}</span>
          <span className="font-medium text-primary truncate">
            {order.address?.fullAddress ?? '---'}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="text-text-body">{t('date')}</span>
          <span className="font-medium text-primary">{formatDateTime(order.createdAt, locale)}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-text-body">{t('total')}</span>
          <span className="font-medium text-primary">
            {order.total.toLocaleString()} {order.currency}
          </span>
        </div>
      </div>

      <div className="mt-4 border-t border-gray-200 pt-4">
        <p className="text-sm text-text-body mb-3">
          {t('items')}: {itemCount}
        </p>
        <div className="space-y-3">
          {order.items.map((item) => {
            const productImageUrl =
              toAbsoluteMediaUrl(item.productImage) || '/placeholder-product.png'

            return (
              <div key={item.id} className="flex gap-3">
                <div className="relative w-16 h-16 bg-bg-card rounded shrink-0">
                  <Image src={productImageUrl} alt={item.productName} fill className="object-contain p-1" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-roboto font-bold text-sm line-clamp-1 mb-1">{item.productName}</h4>
                  <p className="text-xs text-text-body">
                    {item.color} / {item.size} / {item.quantity}
                  </p>
                  <p className="text-xs text-text-body">
                    {t('vendor')}: {item.vendor} | {t('type')}: {item.type} | {t('sku')}: {item.sku}
                  </p>
                </div>
                <div className="text-end">
                  <p className="font-medium text-sm">{item.price.toLocaleString()} {order.currency}</p>
                  {typeof item.originalPrice === 'number' && (
                    <p className="text-xs text-text-placeholder line-through">
                      {item.originalPrice.toLocaleString()} {order.currency}
                    </p>
                  )}
                  <p className="font-bold text-sm">
                    {(item.price * item.quantity).toLocaleString()} {order.currency}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

function CustomOrderDetails({ order, locale }: { order: CustomOrder; locale: string }) {
  const t = useTranslations('orders')
  const statusKey = getStatusKey(order.status)
  const referenceImages = order.referenceImages
    .map((imageUrl) => toAbsoluteMediaUrl(imageUrl))
    .filter(Boolean)

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-2 gap-x-4 text-sm">
        <div className="flex gap-2">
          <span className="text-text-body">{t('status')}</span>
          <OrderStatusBadge label={t(`statusValues.${statusKey}`)} statusKey={statusKey} />
        </div>
        <div className="flex gap-2">
          <span className="text-text-body">{t('date')}</span>
          <span className="font-medium text-primary">{formatDateTime(order.createdAt, locale)}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-text-body">{t('quantity')}</span>
          <span className="font-medium text-primary">{order.quantity}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-text-body">{t('total')}</span>
          <span className="font-medium text-primary">
            {typeof order.total === 'number' ? `${order.total.toLocaleString()} EGP` : '---'}
          </span>
        </div>
      </div>

      <div className="mt-4 border-t border-gray-200 pt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <p><span className="text-text-body">{t('productType')}:</span> <span className="font-medium">{order.productType}</span></p>
        <p><span className="text-text-body">{t('color')}:</span> <span className="font-medium">{order.color || '---'}</span></p>
        <p><span className="text-text-body">{t('gender')}:</span> <span className="font-medium">{order.gender}</span></p>
        <p><span className="text-text-body">{t('size')}:</span> <span className="font-medium">{order.size || '---'}</span></p>
      </div>

      <div className="mt-3">
        <p className="text-sm text-text-body">{t('details')}</p>
        <p className="text-sm text-primary mt-1">{order.details || '---'}</p>
      </div>

      {referenceImages.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-text-body mb-2">{t('referenceImages')}</p>
          <div className="flex flex-wrap gap-2">
            {referenceImages.map((imageUrl) => (
              <a
                key={imageUrl}
                href={imageUrl}
                target="_blank"
                rel="noreferrer"
                className="relative w-16 h-16 bg-bg-card rounded border border-gray-200 overflow-hidden"
              >
                <Image src={imageUrl} alt={t('referenceImages')} fill className="object-cover" />
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

function UnifiedOrderCard({
  order,
  locale,
  isExpanded,
  onToggle,
}: {
  order: UnifiedOrder
  locale: string
  isExpanded: boolean
  onToggle: () => void
}) {
  const t = useTranslations('orders')
  const data = order.data
  const createdAt = order.kind === 'standard' ? data.createdAt : data.createdAt
  const statusKey = getStatusKey(data.status)
  const orderNumber = data.orderNumber
  const total =
    order.kind === 'standard'
      ? `${order.data.total.toLocaleString()} ${order.data.currency}`
      : typeof order.data.total === 'number'
        ? `${order.data.total.toLocaleString()} EGP`
        : '---'

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="p-4 lg:p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-roboto font-bold text-lg">
              {t('order')} {orderNumber}
            </h3>
            <p className="text-sm text-text-body">
              {order.kind === 'standard' ? t('typeStandard') : t('typeCustom')} | {formatDateTime(createdAt, locale)}
            </p>
          </div>
          <button onClick={onToggle} className="p-1 text-text-body hover:text-primary">
            {isExpanded ? <ArrowUp2 size={20} /> : <ArrowDown2 size={20} />}
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-2 gap-x-4 text-sm">
          <div className="flex gap-2">
            <span className="text-text-body">{t('status')}</span>
            <OrderStatusBadge label={t(`statusValues.${statusKey}`)} statusKey={statusKey} />
          </div>
          <div className="flex gap-2">
            <span className="text-text-body">{t('date')}</span>
            <span className="font-medium text-primary">{formatDateTime(createdAt, locale)}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-text-body">{t('total')}</span>
            <span className="font-medium text-primary">{total}</span>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 p-4 lg:p-6">
          {order.kind === 'standard' ? (
            <StandardOrderDetails order={order.data} locale={locale} />
          ) : (
            <CustomOrderDetails order={order.data} locale={locale} />
          )}
        </div>
      )}
    </div>
  )
}

export default function OrdersContent({ locale }: OrdersContentProps) {
  const t = useTranslations('orders')
  const tAuth = useTranslations('auth')
  const accessToken = useAuthStore((state) => state.accessToken)
  const hasSession = useMemo(() => {
    if (accessToken) return true
    if (typeof window === 'undefined') return false
    return Boolean(localStorage.getItem('access_token'))
  }, [accessToken])
  const [activeTab, setActiveTab] = useState<OrderTab>('all')
  const [expandedOrders, setExpandedOrders] = useState<string[]>([])
  const isSignedIn = hasSession

  const { data: standardOrdersData, isLoading: isLoadingStandard } = useOrders({
    page: 1,
    limit: 100,
  }, { enabled: hasSession })
  const { data: customOrdersData, isLoading: isLoadingCustom } = useCustomOrders({
    page: 1,
    limit: 100,
  }, { enabled: hasSession })

  const unifiedOrders = useMemo<UnifiedOrder[]>(() => {
    const standard = (standardOrdersData?.orders ?? []).map((order) => ({
      kind: 'standard' as const,
      data: order,
    }))
    const custom = (customOrdersData?.orders ?? []).map((order) => ({
      kind: 'custom' as const,
      data: order,
    }))

    return [...standard, ...custom].sort((a, b) => {
      const left = new Date(a.data.createdAt).getTime()
      const right = new Date(b.data.createdAt).getTime()
      return right - left
    })
  }, [customOrdersData?.orders, standardOrdersData?.orders])

  const filteredOrders = useMemo(() => {
    if (activeTab === 'all') return unifiedOrders
    return unifiedOrders.filter((order) => getStatusKey(order.data.status) === activeTab)
  }, [activeTab, unifiedOrders])

  const tabs: Array<{ key: OrderTab; label: string }> = [
    { key: 'all', label: t('tabs.all') },
    { key: 'new', label: t('tabs.new') },
    { key: 'inProgress', label: t('tabs.inProgress') },
    { key: 'shipped', label: t('tabs.shipped') },
    { key: 'completed', label: t('tabs.completed') },
    { key: 'cancelled', label: t('tabs.cancelled') },
  ]

  const toggleOrder = (orderId: string) => {
    setExpandedOrders((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    )
  }

  if (!isSignedIn) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 lg:px-6 py-10">
        <div className="rounded-lg border border-neutral-200 p-6 text-center">
          <p className="text-text-body mb-4">{t('signInPrompt')}</p>
          <Link
            href={`/${locale}/sign-in`}
            className="inline-flex px-6 py-2.5 bg-primary text-white font-rubik font-medium rounded hover:bg-primary/90 transition-colors"
          >
            {tAuth('signIn')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 lg:px-6 py-6 lg:py-10">
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
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

      <div className="space-y-4">
        {(isLoadingStandard || isLoadingCustom) && (
          <p className="text-center text-text-body py-12">{t('loading')}</p>
        )}

        {!isLoadingStandard && !isLoadingCustom && filteredOrders.map((order) => (
          <UnifiedOrderCard
            key={`${order.kind}-${order.data.id}`}
            order={order}
            locale={locale}
            isExpanded={expandedOrders.includes(order.data.id)}
            onToggle={() => toggleOrder(order.data.id)}
          />
        ))}

        {!isLoadingStandard && !isLoadingCustom && filteredOrders.length === 0 && (
          <p className="text-center text-text-body py-12">{t('noOrders')}</p>
        )}
      </div>
    </div>
  )
}
