'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { CloseCircle, Add, Minus, TicketDiscount } from 'iconsax-reactjs'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/store'

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    couponCode,
    applyCoupon,
    removeCoupon,
    getSubtotal,
  } = useCartStore()

  const [couponInput, setCouponInput] = useState('')
  const [couponError, setCouponError] = useState('')
  const locale = useLocale()
  const t = useTranslations('cart')
  const tProduct = useTranslations('product')

  const subtotal = getSubtotal()
  const currency = items[0]?.currency ?? 'EGP'
  const genderLabels: Record<string, string> = {
    MEN: tProduct('genderValues.men'),
    WOMEN: tProduct('genderValues.women'),
    KIDS: tProduct('genderValues.kids'),
    UNISEX: tProduct('genderValues.unisex'),
  }
  const formatGender = (value?: string) => (value ? genderLabels[value] ?? value : '')

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart()
    }
    if (isOpen) document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, closeCart])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return
    const success = applyCoupon(couponInput)
    if (success) {
      setCouponError('')
      setCouponInput('')
    } else {
      setCouponError(t('invalidCoupon'))
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-(--z-modal-backdrop) transition-opacity',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed top-0 end-0 bottom-0 w-full max-w-md bg-white z-(--z-modal) transition-transform duration-300 flex flex-col shadow-xl',
          isOpen ? 'translate-x-0' : 'translate-x-full rtl:-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="font-roboto font-bold text-lg">{t('orderDetails')}</h2>
          <button
            onClick={closeCart}
            className="text-text-body hover:text-primary transition-colors"
            aria-label={t('closeCart')}
          >
            <CloseCircle size={28} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-text-body mb-4">{t('empty')}</p>
              <button
                onClick={closeCart}
                className="px-6 py-2 bg-primary text-white rounded font-medium hover:bg-primary/90 transition-colors"
              >
                {t('continueShopping')}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 pb-4 border-b border-gray-100">
                  {/* Image */}
                  <div className="relative w-20 h-20 bg-bg-card rounded shrink-0">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="absolute -top-2 -start-2 z-10 w-5 h-5 flex items-center justify-center bg-white rounded-full shadow text-text-body hover:text-secondary"
                    >
                      <CloseCircle size={16} variant="Bold" />
                    </button>
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-contain p-2"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-roboto font-bold text-sm text-primary line-clamp-2 mb-1">
                      {item.title}
                    </h3>
                    <div className="grid grid-cols-2 gap-x-4 text-xs text-text-body mb-2">
                      <div className="flex gap-1">
                        <span>{t('vendor')}</span>
                        <span className="font-medium text-primary">{item.vendor}</span>
                      </div>
                      <div className="flex gap-1">
                        <span>{t('type')}</span>
                        <span className="font-medium text-primary">{item.type}</span>
                      </div>
                      <div className="flex gap-1">
                        <span>{t('size')}</span>
                        <span className="font-medium text-primary">{item.size}</span>
                      </div>
                      <div className="flex gap-1">
                        <span>{t('gender')}</span>
                        <span className="font-medium text-primary">{formatGender(item.gender)}</span>
                      </div>
                      <div className="flex gap-1">
                        <span>{t('sku')}</span>
                        <span className="font-medium text-primary">{item.sku}</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-2">
                      {item.originalPrice && (
                        <span className="text-xs text-text-placeholder line-through">
                          {item.originalPrice.toLocaleString()} {item.currency}
                        </span>
                      )}
                      <span className="font-bold text-sm text-primary">
                        {item.price.toLocaleString()} {item.currency}
                      </span>
                    </div>

                    {/* Discount Badge */}
                    {item.discount && (
                      <div className="flex items-center gap-1 text-xs text-green-600 mb-2">
                        <span className="text-secondary">⊛</span>
                        <span>{item.discount}</span>
                      </div>
                    )}

                    {/* Quantity & Remove */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-text-body">{t('quantity')}:</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-6 h-6 flex items-center justify-center border border-border-light rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={typeof item.maxQuantity === 'number' && item.quantity >= item.maxQuantity}
                          className="w-6 h-6 flex items-center justify-center border border-border-light rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Add size={12} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-sm text-text-body underline hover:text-secondary"
                      >
                        {t('remove')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-gray-200">
            {/* Coupon */}
            <div className="mb-4">
              <label className="font-roboto font-medium text-sm mb-2 block">{t('applyCoupon')}</label>
              {couponCode ? (
                <div className="flex items-center justify-between p-3 bg-green-50 rounded border border-green-200">
                  <span className="text-sm text-green-700">{t('couponApplied', { code: couponCode })}</span>
                  <button
                    onClick={removeCoupon}
                    className="text-sm text-red-500 hover:underline"
                  >
                    {t('remove')}
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <TicketDiscount size={18} className="absolute start-3 top-1/2 -translate-y-1/2 text-text-placeholder" />
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder={t('couponPlaceholder')}
                      className="w-full ps-10 pe-3 py-2.5 border border-border-light rounded text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <button
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-primary text-white text-sm rounded hover:bg-primary/90 transition-colors"
                  >
                    {t('apply')}
                  </button>
                </div>
              )}
              {couponError && <p className="text-xs text-red-500 mt-1">{couponError}</p>}
            </div>

            {/* Subtotal */}
            <div className="flex items-center justify-between py-3 border-t border-gray-200 mb-4">
              <span className="text-text-body">{t('subtotal')} :</span>
              <span className="font-bold text-lg text-primary">{subtotal.toLocaleString()} {currency}</span>
            </div>

            <p className="text-xs text-text-placeholder mb-4">
              {t('taxesAndShipping')}
            </p>

            {/* Buttons */}
            <Link
              href={`/${locale}/checkout`}
              onClick={closeCart}
              className="block w-full py-3 bg-primary text-white text-center font-rubik font-medium rounded hover:bg-primary/90 transition-colors mb-3"
            >
              {t('checkout')}
            </Link>
            <Link
              href={`/${locale}/cart`}
              onClick={closeCart}
              className="block w-full py-2 text-center font-rubik font-medium text-primary underline"
            >
              {t('viewCart')}
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
