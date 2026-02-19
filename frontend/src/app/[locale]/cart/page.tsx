'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { Add, Minus, Trash, TicketDiscount } from 'iconsax-reactjs'
import { useCartStore } from '@/store'
import { validateCoupon } from '@/services/orders'

export default function CartPage() {
  const locale = useLocale()
  const t = useTranslations('cart')
  const tProduct = useTranslations('product')
  const {
    items,
    removeItem,
    updateQuantity,
    couponCode,
    applyCoupon,
    removeCoupon,
    getSubtotal,
  } = useCartStore()

  const [couponInput, setCouponInput] = useState('')
  const [couponError, setCouponError] = useState('')
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)

  const subtotal = getSubtotal()
  const currency = items[0]?.currency ?? 'EGP'
  const genderLabels: Record<string, string> = {
    MEN: tProduct('genderValues.men'),
    WOMEN: tProduct('genderValues.women'),
    KIDS: tProduct('genderValues.kids'),
    UNISEX: tProduct('genderValues.unisex'),
  }
  const formatGender = (value?: string) => (value ? genderLabels[value] ?? value : '')

  const handleApplyCoupon = async () => {
    const code = couponInput.trim()
    if (!code) return

    setCouponError('')
    setIsApplyingCoupon(true)
    try {
      const result = await validateCoupon({
        code,
        subtotal,
      })
      if (!result.valid) {
        setCouponError(result.message || t('invalidCoupon'))
        return
      }
      applyCoupon(result.code || code, result.discount, result.freeShipping)
      setCouponInput('')
    } catch {
      setCouponError(t('invalidCoupon'))
    } finally {
      setIsApplyingCoupon(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        {/* Red Banner */}
        <div className="w-full h-14 lg:h-20 flex items-center justify-center bg-secondary">
          <h1 className="font-roboto-condensed font-bold text-lg lg:text-2xl text-white uppercase tracking-wider">
            {t('title')}
          </h1>
        </div>

        <div className="max-w-[1200px] mx-auto px-4 lg:px-6 py-16 text-center">
          <p className="text-lg text-text-body mb-6">{t('empty')}</p>
          <Link
            href={`/${locale}`}
            className="inline-block px-8 py-3 bg-primary text-white font-medium rounded hover:bg-primary/90 transition-colors"
          >
            {t('continueShopping')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Red Banner */}
      <div className="w-full h-14 lg:h-20 flex items-center justify-center bg-secondary">
        <h1 className="font-roboto-condensed font-bold text-lg lg:text-2xl text-white uppercase tracking-wider">
          {t('title')}
        </h1>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 lg:px-6 py-6 lg:py-10">
        {/* Desktop Table View */}
        <div className="hidden lg:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-start py-4 font-roboto font-medium text-sm text-text-body">{t('product')}</th>
                <th className="text-start py-4 font-roboto font-medium text-sm text-text-body">{t('price')}</th>
                <th className="text-start py-4 font-roboto font-medium text-sm text-text-body">{t('quantity')}</th>
                <th className="text-end py-4 font-roboto font-medium text-sm text-text-body">{t('total')}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="py-6">
                    <div className="flex gap-4">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-text-placeholder hover:text-secondary transition-colors self-start mt-2"
                      >
                        <Trash size={20} />
                      </button>
                      <div className="relative w-24 h-24 bg-bg-card rounded shrink-0">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                      <div>
                        <h3 className="font-roboto font-bold text-base text-primary mb-2">
                          {item.title}
                        </h3>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-0.5 text-sm text-text-body">
                          <div className="flex gap-2">
                            <span>{t('vendor')}</span>
                            <span className="font-medium text-primary">{item.vendor}</span>
                          </div>
                          <div className="flex gap-2">
                            <span>{t('type')}</span>
                            <span className="font-medium text-primary">{item.type}</span>
                          </div>
                          <div className="flex gap-2">
                            <span>{t('size')}</span>
                            <span className="font-medium text-primary">{item.size}</span>
                          </div>
                          <div className="flex gap-2">
                            <span>{t('gender')}</span>
                            <span className="font-medium text-primary">{formatGender(item.gender)}</span>
                          </div>
                          <div className="flex gap-2">
                            <span>{t('sku')}</span>
                            <span className="font-medium text-primary">{item.sku}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-6">
                    <div className="flex flex-col">
                      <span className="font-medium text-primary">
                        {item.price.toLocaleString()} {item.currency}
                      </span>
                      {item.originalPrice && (
                        <span className="text-sm text-text-placeholder line-through">
                          {item.originalPrice.toLocaleString()} {item.currency}
                        </span>
                      )}
                      {item.discount && (
                        <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                          <span className="text-secondary">&bull;</span>
                          <span>{item.discount}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-7 h-7 flex items-center justify-center border border-border-light rounded-full hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 h-8 flex items-center justify-center border border-border-light rounded-full text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={typeof item.maxQuantity === 'number' && item.quantity >= item.maxQuantity}
                        className="w-7 h-7 flex items-center justify-center border border-border-light rounded-full hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Add size={14} />
                      </button>
                    </div>
                  </td>
                  <td className="py-6 text-end">
                    <span className="font-bold text-primary">
                      {(item.price * item.quantity).toLocaleString()} {item.currency}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3 pb-4 border-b border-gray-100">
              <div className="relative w-16 h-16 bg-bg-card rounded shrink-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-roboto font-bold text-sm text-primary line-clamp-2 mb-1">
                  {item.title}
                </h3>
                <div className="grid grid-cols-2 gap-x-3 text-xs text-text-body mb-2">
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

                {/* Price & Quantity Row */}
                <div className="flex items-center justify-between">
                  <div>
                    {item.originalPrice && (
                      <span className="text-xs text-text-placeholder line-through me-2">
                        {item.originalPrice.toLocaleString()} {item.currency}
                      </span>
                    )}
                    <span className="font-bold text-sm text-primary">
                      {item.price.toLocaleString()} {item.currency}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-6 h-6 flex items-center justify-center border border-border-light rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-6 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={typeof item.maxQuantity === 'number' && item.quantity >= item.maxQuantity}
                      className="w-6 h-6 flex items-center justify-center border border-border-light rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Add size={12} />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="text-sm text-text-body underline mt-2"
                >
                  {t('remove')}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Coupon & Summary Section */}
        <div className="mt-8 flex flex-col lg:flex-row lg:justify-end gap-6">
          <div className="lg:w-96">
            {/* Coupon */}
            <div className="mb-4">
              <label className="font-roboto font-medium text-base mb-2 block">{t('applyCoupon')}</label>
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
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={isApplyingCoupon}
                    className="px-4 py-2 bg-primary text-white text-sm rounded hover:bg-primary/90 transition-colors disabled:opacity-60"
                  >
                    {isApplyingCoupon ? '...' : t('apply')}
                  </button>
                </div>
              )}
              {couponError && <p className="text-xs text-red-500 mt-1">{couponError}</p>}
            </div>

            {/* Subtotal */}
            <div className="flex items-center justify-between py-3 border-t border-gray-200 mb-2">
              <span className="text-text-body">{t('subtotal')} :</span>
              <span className="font-bold text-lg text-primary">{subtotal.toLocaleString()} {currency}</span>
            </div>

            <p className="text-xs text-text-placeholder mb-4">
              {t('taxesAndShipping')}
            </p>

            {/* Checkout Button */}
            <Link
              href={`/${locale}/checkout`}
              className="block w-full py-3 bg-primary text-white text-center font-rubik font-medium rounded hover:bg-primary/90 transition-colors"
            >
              {t('checkout')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
