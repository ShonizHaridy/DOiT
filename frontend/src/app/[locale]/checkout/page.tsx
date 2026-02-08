'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowDown2, Sms, ArrowUp2 } from 'iconsax-reactjs'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { useRouter } from '@/i18n/navigation'
import { createAddress } from '@/services/customer'
import { createGuestOrder, createOrder } from '@/services/orders'
import { useAuthStore, useCartStore } from '@/store'

type TranslateFn = (key: string, values?: Record<string, unknown>) => string

const buildCheckoutSchema = (t: TranslateFn) =>
  z.object({
    email: z
      .string()
      .min(1, t('errors.emailRequired'))
      .email(t('errors.emailInvalid')),
    firstName: z.string().min(1, t('errors.firstNameRequired')),
    lastName: z.string().min(1, t('errors.lastNameRequired')),
    address: z.string().min(1, t('errors.addressRequired')),
    apartment: z.string().optional(),
    city: z.string().min(1, t('errors.cityRequired')),
    governorate: z.string().min(1, t('errors.governorateRequired')),
    postalCode: z.string().optional(),
    phone: z
      .string()
      .min(1, t('errors.phoneRequired'))
      .min(10, t('errors.phoneInvalid')),
    country: z.string().min(1, t('errors.countryRequired')),
    saveInfo: z.boolean().optional(),
    shipping: z.string(),
    payment: z.string(),
    billingAddress: z.string(),
  })

interface CheckoutPageProps {
  params: { locale: string }
}

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const { locale } = params
  const t = useTranslations('checkout')
  const tProduct = useTranslations('product')
  const checkoutSchema = useMemo(() => buildCheckoutSchema(t), [t])
  type CheckoutFormData = z.infer<typeof checkoutSchema>
  const router = useRouter()
  const accessToken = useAuthStore((state) => state.accessToken)
  const { items, getSubtotal, couponCode, clearCart } = useCartStore()
  const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [successOrderNumber, setSuccessOrderNumber] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const genderLabels: Record<string, string> = {
    MEN: tProduct('genderValues.men'),
    WOMEN: tProduct('genderValues.women'),
    KIDS: tProduct('genderValues.kids'),
    UNISEX: tProduct('genderValues.unisex'),
  }
  const formatGender = (value?: string) => (value ? genderLabels[value] ?? value : '')

  const subtotal = getSubtotal()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      country: 'Egypt',
      shipping: 'standard',
      payment: 'cod',
      billingAddress: 'same',
    },
  })

  const buildFullAddress = (data: CheckoutFormData) => {
    const parts = [
      data.address,
      data.apartment,
      data.city,
      data.governorate,
      data.postalCode,
      data.country,
    ].filter(Boolean)
    return parts.join(', ')
  }

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      setSubmitError(t('cartEmpty'))
      return
    }

    setSubmitError(null)
    setSuccessOrderNumber(null)
    setIsSubmitting(true)

    const orderItems = items.map((item) => ({
      productId: item.productId,
      color: item.color,
      size: item.size,
      quantity: item.quantity,
    }))

    const paymentMethod = data.payment === 'cod' ? 'Cash on Delivery' : data.payment

    try {
      if (accessToken) {
        const address = await createAddress({
          label: data.saveInfo ? 'Home' : 'Checkout',
          fullAddress: buildFullAddress(data),
        })

        const order = await createOrder({
          items: orderItems,
          addressId: address.id,
          paymentMethod,
          couponCode: couponCode || undefined,
        })

        setSuccessOrderNumber(order.orderNumber)
        clearCart()
        router.push(`/${locale}/orders`)
      } else {
        const order = await createGuestOrder({
          items: orderItems,
          email: data.email,
          fullName: `${data.firstName} ${data.lastName}`.trim(),
          phoneNumber: data.phone,
          addressLabel: data.saveInfo ? 'Home' : 'Checkout',
          fullAddress: buildFullAddress(data),
          paymentMethod,
          couponCode: couponCode || undefined,
        })

        setSuccessOrderNumber(order.orderNumber)
        clearCart()
        if (typeof window !== 'undefined') {
          localStorage.setItem(
            'doit_guest_order',
            JSON.stringify({
              orderNumber: order.orderNumber,
              email: data.email,
              placedAt: new Date().toISOString(),
            })
          )
        }
      }
    } catch (error) {
      setSubmitError(t('submitError'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Header with Logo */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200">
        <Link href={`/${locale}`}>
          <Image src="/logo.svg" alt="DOiT" width={120} height={40} />
        </Link>
        <Link href={`/${locale}/cart`} className="relative">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          {itemCount > 0 && (
            <span className="absolute -top-1 -end-1 w-5 h-5 bg-secondary text-white text-xs rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Left Side - Form */}
        <div className="lg:w-1/2 lg:min-h-screen p-4 lg:p-8 lg:pe-16">
          {/* Desktop Logo */}
          <div className="hidden lg:block mb-8">
            <Link href={`/${locale}`}>
              <Image src="/logo.svg" alt="DOiT" width={150} height={50} />
            </Link>
          </div>

          {/* Mobile Order Summary Toggle */}
          <button
            onClick={() => setIsOrderSummaryOpen(!isOrderSummaryOpen)}
            className="lg:hidden w-full flex items-center justify-between py-3 mb-4"
          >
            <div className="flex items-center gap-2">
              <span className="font-medium">{t('orderSummary')}</span>
              {isOrderSummaryOpen ? <ArrowUp2 size={16} /> : <ArrowDown2 size={16} />}
            </div>
            <span className="font-bold">{subtotal.toLocaleString()} EGP</span>
          </button>

          {/* Mobile Order Summary */}
          {isOrderSummaryOpen && (
            <div className="lg:hidden mb-6 pb-4 border-b border-gray-200">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 mb-3">
                  <div className="relative w-14 h-14 bg-bg-card rounded shrink-0">
                    <Image src={item.image} alt={item.title} fill className="object-contain p-1" />
                    <span className="absolute -top-1 -end-1 w-5 h-5 bg-text-body text-white text-xs rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm line-clamp-1">{item.title}</h4>
                    <p className="text-xs text-text-body">
                      {item.color}/ {item.size}/ {formatGender(item.gender)}
                    </p>
                    {item.discount && (
                      <p className="text-xs text-green-600">&bull; {item.discount}</p>
                    )}
                  </div>
                  <div className="text-end">
                    <p className="font-medium text-sm">{item.price.toLocaleString()} EGP</p>
                    {item.originalPrice && (
                      <p className="text-xs text-text-placeholder line-through">
                        {item.originalPrice.toLocaleString()} EGP
                      </p>
                    )}
                  </div>
                </div>
              ))}
              <div className="flex justify-between text-sm pt-3 border-t border-gray-100">
                <span>{t('subtotal')}:</span>
                <span>{t('items', { count: itemCount })}</span>
                <span className="font-bold">{subtotal.toLocaleString()} EGP</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span>{t('shipping')}:</span>
                <span className="font-medium">{t('free')}</span>
              </div>
              <div className="flex justify-between font-bold mt-2 pt-2 border-t border-gray-100">
                <span>{t('total')}:</span>
                <span>{subtotal.toLocaleString()} EGP</span>
              </div>
            </div>
          )}

          {submitError && (
            <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {submitError}
            </div>
          )}

          {successOrderNumber && (
            <div className="mb-4 rounded border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              <p className="font-medium">{t('orderSuccessTitle')}</p>
              <p>{t('orderNumber', { number: successOrderNumber })}</p>
              {accessToken && (
                <Link href={`/${locale}/orders`} className="underline text-green-700">
                  {t('viewOrders')}
                </Link>
              )}
              {!accessToken && (
                <p className="mt-2 text-xs text-green-700">
                  {t('guestOrderNote')}
                </p>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-rubik font-medium text-lg">{t('email')}</h2>
                <Link href={`/${locale}/sign-in`} className="text-sm underline">
                  {t('signIn')}
                </Link>
              </div>
              <div className="relative">
                <Sms size={20} className="absolute start-3 top-1/2 -translate-y-1/2 text-text-placeholder" />
                <input
                  type="email"
                  {...register('email')}
                  placeholder={t('enterEmail')}
                  className="w-full ps-10 pe-4 py-3 border border-border-light rounded text-sm outline-none focus:border-primary"
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            {/* Delivery Section */}
            <div className="mb-6">
              <h2 className="font-rubik font-medium text-lg mb-3">{t('delivery')}</h2>

              {/* Country */}
              <div className="relative mb-3">
                <select
                  {...register('country')}
                  className="w-full px-4 py-3 border border-border-light rounded text-sm appearance-none outline-none focus:border-primary"
                >
                  <option value="">{t('countryRegion')}</option>
                  <option value="Egypt">{t('countries.egypt')}</option>
                  <option value="Saudi Arabia">{t('countries.saudiArabia')}</option>
                  <option value="UAE">{t('countries.uae')}</option>
                </select>
                <ArrowDown2 size={16} className="absolute end-3 top-1/2 -translate-y-1/2 text-text-placeholder pointer-events-none" />
              </div>

              {/* Name Row */}
              <div className="flex gap-3 mb-3">
                <input
                  type="text"
                  {...register('firstName')}
                  placeholder={t('firstName')}
                  className="flex-1 px-4 py-3 border border-border-light rounded text-sm outline-none focus:border-primary"
                />
                <input
                  type="text"
                  {...register('lastName')}
                  placeholder={t('lastName')}
                  className="flex-1 px-4 py-3 border border-border-light rounded text-sm outline-none focus:border-primary"
                />
              </div>

              {/* Address */}
              <input
                type="text"
                {...register('address')}
                placeholder={t('address')}
                className="w-full px-4 py-3 border border-border-light rounded text-sm outline-none focus:border-primary mb-3"
              />

              {/* Apartment */}
              <input
                type="text"
                {...register('apartment')}
                placeholder={t('apartment')}
                className="w-full px-4 py-3 border border-border-light rounded text-sm outline-none focus:border-primary mb-3"
              />

              {/* City, Governorate, Postal */}
              <div className="flex gap-3 mb-3">
                <input
                  type="text"
                  {...register('city')}
                  placeholder={t('city')}
                  className="flex-1 px-4 py-3 border border-border-light rounded text-sm outline-none focus:border-primary"
                />
                <div className="relative flex-1">
                  <select
                    {...register('governorate')}
                    className="w-full px-4 py-3 border border-border-light rounded text-sm appearance-none outline-none focus:border-primary"
                  >
                    <option value="">{t('governorate')}</option>
                    <option value="Cairo">{t('governorates.cairo')}</option>
                    <option value="Giza">{t('governorates.giza')}</option>
                    <option value="Alexandria">{t('governorates.alexandria')}</option>
                  </select>
                  <ArrowDown2 size={16} className="absolute end-3 top-1/2 -translate-y-1/2 text-text-placeholder pointer-events-none" />
                </div>
                <input
                  type="text"
                  {...register('postalCode')}
                  placeholder={t('postalCode')}
                  className="flex-1 px-4 py-3 border border-border-light rounded text-sm outline-none focus:border-primary"
                />
              </div>

              {/* Phone */}
              <div className="relative mb-3">
                <input
                  type="tel"
                  {...register('phone')}
                  placeholder={t('phone')}
                  className="w-full px-4 pe-20 py-3 border border-border-light rounded text-sm outline-none focus:border-primary"
                />
                <div className="absolute end-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <span className="text-text-placeholder">|</span>
                  <Image src="/flags/ar.svg" alt="EG" width={20} height={20} className="rounded-sm" />
                  <ArrowDown2 size={14} className="text-text-placeholder" />
                </div>
              </div>

              {/* Save Info Checkbox */}
              <label className="flex items-center gap-2 text-sm text-text-body cursor-pointer">
                <input
                  type="checkbox"
                  {...register('saveInfo')}
                  className="w-4 h-4 border border-border-light rounded"
                />
                {t('saveInfo')}
              </label>
            </div>

            {/* Shipping */}
            <div className="mb-6">
              <h2 className="font-rubik font-medium text-lg mb-3">{t('shipping')}</h2>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  {...register('shipping')}
                  value="standard"
                  defaultChecked
                  className="w-5 h-5"
                />
                <span className="text-sm">{t('shippingStandard')}</span>
              </label>
            </div>

            {/* Payment */}
            <div className="mb-6">
              <h2 className="font-rubik font-medium text-lg mb-3">{t('payment')}</h2>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  {...register('payment')}
                  value="cod"
                  defaultChecked
                  className="w-5 h-5"
                />
                <span className="text-sm">{t('paymentCod')}</span>
              </label>
            </div>

            {/* Billing Address */}
            <div className="mb-6">
              <h2 className="font-rubik font-medium text-lg mb-3">{t('billingAddress')}</h2>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    {...register('billingAddress')}
                    value="same"
                    defaultChecked
                    className="w-5 h-5"
                  />
                  <span className="text-sm">{t('billingSame')}</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    {...register('billingAddress')}
                    value="different"
                    className="w-5 h-5"
                  />
                  <span className="text-sm">{t('billingDifferent')}</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "w-full py-4 bg-primary text-white font-rubik font-medium rounded hover:bg-primary/90 transition-colors",
                isSubmitting && "opacity-60 cursor-not-allowed"
              )}
            >
              {isSubmitting ? t('processing') : t('confirmOrder')}
            </button>
          </form>
        </div>

        {/* Right Side - Order Summary (Desktop) */}
        <div className="hidden lg:block lg:w-1/2 bg-bg-card min-h-screen p-8 ps-16">
          <div className="max-w-md">
            {/* Items */}
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-20 h-20 bg-white rounded border border-gray-200 shrink-0">
                    <Image src={item.image} alt={item.title} fill className="object-contain p-2" />
                    <span className="absolute -top-2 -end-2 w-6 h-6 bg-text-body text-white text-xs rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-roboto font-bold text-sm mb-1">{item.title}</h4>
                    <p className="text-xs text-text-body">
                      {item.color}/ {item.size}/ {formatGender(item.gender)}
                    </p>
                    {item.discount && (
                      <p className="text-xs text-green-600 mt-1">&bull; {item.discount}</p>
                    )}
                  </div>
                  <div className="text-end">
                    <p className="font-bold">{item.price.toLocaleString()} EGP</p>
                    {item.originalPrice && (
                      <p className="text-sm text-text-placeholder line-through">
                        {item.originalPrice.toLocaleString()} EGP
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="border-t border-gray-300 pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-text-body">{t('subtotal')}:</span>
                <div className="flex gap-4">
                  <span className="text-text-body">{t('items', { count: itemCount })}</span>
                  <span className="font-bold">{subtotal.toLocaleString()} EGP</span>
                </div>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-text-body">{t('shipping')}:</span>
                <span className="font-medium">{t('free')}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-300">
                <span>{t('total')}:</span>
                <span>{subtotal.toLocaleString()} EGP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
