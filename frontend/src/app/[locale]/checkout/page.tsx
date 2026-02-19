'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useForm, type FieldErrors } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowDown2, Sms, ArrowUp2 } from 'iconsax-reactjs'
import { useLocale, useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { useRouter } from '@/i18n/navigation'
import { createAddress } from '@/services/customer'
import { createGuestOrder, createOrder, createCustomOrder } from '@/services/orders'
import { useAuthStore, useCartStore } from '@/store'
import type { CreateCustomOrderRequest } from '@/types/order'
import { toAbsoluteMediaUrl } from '@/lib/media-url'
import { decodeJwtRole, getCustomerAuthSnapshot } from '@/lib/auth-storage'
import { useShippingRates } from '@/hooks/useShipping'
import { EGYPT_GOVERNORATES } from '@/data/governorates'

interface PendingCustomOrder extends CreateCustomOrderRequest {
  referenceImages: string[]
}

type TranslateFn = (key: string, values?: Record<string, string | number | Date>) => string

const buildCheckoutSchema = (t: TranslateFn) =>
  z
    .object({
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
      billingFirstName: z.string().optional(),
      billingLastName: z.string().optional(),
      billingStreet: z.string().optional(),
      billingApartment: z.string().optional(),
      billingCity: z.string().optional(),
      billingGovernorate: z.string().optional(),
      billingPostalCode: z.string().optional(),
      billingCountry: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.billingAddress !== 'different') return

      if (!data.billingFirstName?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('errors.firstNameRequired'),
          path: ['billingFirstName'],
        })
      }
      if (!data.billingLastName?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('errors.lastNameRequired'),
          path: ['billingLastName'],
        })
      }
      if (!data.billingStreet?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('errors.addressRequired'),
          path: ['billingStreet'],
        })
      }
      if (!data.billingCity?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('errors.cityRequired'),
          path: ['billingCity'],
        })
      }
      if (!data.billingGovernorate?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('errors.governorateRequired'),
          path: ['billingGovernorate'],
        })
      }
      if (!data.billingCountry?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('errors.countryRequired'),
          path: ['billingCountry'],
        })
      }
    })

const normalizeReferenceImages = (referenceImages: unknown): string[] => {
  if (!Array.isArray(referenceImages)) return []
  return referenceImages
    .filter((url): url is string => typeof url === 'string' && url.trim().length > 0)
    .map((url) => toAbsoluteMediaUrl(url))
    .filter(Boolean)
}

const resolveSessionSnapshot = (
  accessToken: string | null,
  userEmail?: string | null,
  userRole?: string | null
) => {
  const tokenRole = decodeJwtRole(accessToken)
  const storeRepresentsCustomer = Boolean(
    accessToken && (userRole === 'customer' || tokenRole === 'customer')
  )

  if (storeRepresentsCustomer) {
    const storedAuth = getCustomerAuthSnapshot()
    return {
      isAuthenticated: true,
      email: userEmail ?? storedAuth.user?.email ?? null,
    }
  }

  const storedAuth = getCustomerAuthSnapshot()
  return {
    isAuthenticated: Boolean(storedAuth.token),
    email: storedAuth.user?.email ?? null,
  }
}

const CHECKOUT_INFO_STORAGE_KEY = 'doit_checkout_info'

type StoredCheckoutInfo = {
  email?: string
  firstName?: string
  lastName?: string
  address?: string
  apartment?: string
  city?: string
  governorate?: string
  postalCode?: string
  phone?: string
  country?: string
  billingAddress?: string
  billingFirstName?: string
  billingLastName?: string
  billingStreet?: string
  billingApartment?: string
  billingCity?: string
  billingGovernorate?: string
  billingPostalCode?: string
  billingCountry?: string
}

export default function CheckoutPage() {
  const locale = useLocale()
  const t = useTranslations('checkout')
  const tProduct = useTranslations('product')
  const checkoutSchema = useMemo(() => buildCheckoutSchema(t), [t])
  type CheckoutFormData = z.infer<typeof checkoutSchema>
  const router = useRouter()
  const searchParams = useSearchParams()
  const accessToken = useAuthStore((state) => state.accessToken)
  const user = useAuthStore((state) => state.user)
  const { items, getSubtotal, couponCode, couponDiscount, couponFreeShipping, clearCart } = useCartStore()
  const { data: shippingRatesData } = useShippingRates()
  const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [successOrderNumber, setSuccessOrderNumber] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [customOrderData, setCustomOrderData] = useState<PendingCustomOrder | null>(null)
  const [customOrderChecked, setCustomOrderChecked] = useState(false)
  // Always start as false to avoid SSR/client hydration mismatch.
  // useEffect below sets the real value after client-side mount.
  const [hasSession, setHasSession] = useState(false)
  // Only show auth-conditional UI after the session check has run on the client
  const [sessionChecked, setSessionChecked] = useState(false)
  const genderLabels: Record<string, string> = {
    MEN: tProduct('genderValues.men'),
    WOMEN: tProduct('genderValues.women'),
    KIDS: tProduct('genderValues.kids'),
    UNISEX: tProduct('genderValues.unisex'),
  }
  const formatGender = (value?: string) => (value ? genderLabels[value] ?? value : '')

  const subtotal = getSubtotal()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const hasCartItems = items.length > 0
  const forcedCustomMode = searchParams.get('mode') === 'custom'
  const activeCustomOrder = forcedCustomMode ? customOrderData : (hasCartItems ? null : customOrderData)
  const isCustomCheckout = Boolean(activeCustomOrder)
  const customOrderImageUrls = useMemo(
    () => normalizeReferenceImages(activeCustomOrder?.referenceImages),
    [activeCustomOrder?.referenceImages]
  )

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setFocus,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      country: 'Egypt',
      shipping: 'standard',
      payment: 'cod',
      billingAddress: 'same',
      billingCountry: 'Egypt',
    },
  })
  const hasLoadedSavedInfoRef = useRef(false)
  const shippingGovernorate = watch('governorate')
  const billingAddressMode = watch('billingAddress')
  const shippingRates = useMemo(() => shippingRatesData ?? [], [shippingRatesData])
  const selectedShippingRate = useMemo(
    () =>
      shippingRates.find(
        (rate) =>
          rate.governorate.trim().toLowerCase() ===
          (shippingGovernorate ?? '').trim().toLowerCase()
      ),
    [shippingGovernorate, shippingRates]
  )
  const governorateOptions = useMemo(
    () =>
      EGYPT_GOVERNORATES.map((item) => ({
        value: item.value,
        label: locale === 'ar' ? item.labelAr : item.labelEn,
      })),
    [locale]
  )
  const shippingPrice = couponFreeShipping ? 0 : (selectedShippingRate?.price ?? 50)
  const couponDiscountAmount = Math.max(0, couponDiscount)
  const orderTotal = Math.max(0, subtotal - couponDiscountAmount + shippingPrice)
  const invalidFieldClass = 'border-red-500 bg-red-50/40 focus:border-red-500 focus:ring-red-500/20'

  // Runs after hydration — sets hasSession correctly from Zustand + localStorage
  useEffect(() => {
    const snapshot = resolveSessionSnapshot(accessToken, user?.email, user?.role)
    setHasSession(snapshot.isAuthenticated)
    if (snapshot.email) {
      setValue('email', snapshot.email, { shouldValidate: true })
    }
    setSessionChecked(true)
  }, [accessToken, setValue, user?.email, user?.role])

  useEffect(() => {
    if (hasLoadedSavedInfoRef.current || typeof window === 'undefined') return
    hasLoadedSavedInfoRef.current = true

    const raw = localStorage.getItem(CHECKOUT_INFO_STORAGE_KEY)
    if (!raw) return

    try {
      const saved = JSON.parse(raw) as StoredCheckoutInfo
      const authSnapshot = resolveSessionSnapshot(accessToken, user?.email, user?.role)
      const fields: Array<keyof StoredCheckoutInfo> = [
        'email',
        'firstName',
        'lastName',
        'address',
        'apartment',
        'city',
        'governorate',
        'postalCode',
        'phone',
        'country',
        'billingAddress',
        'billingFirstName',
        'billingLastName',
        'billingStreet',
        'billingApartment',
        'billingCity',
        'billingGovernorate',
        'billingPostalCode',
        'billingCountry',
      ]

      fields.forEach((field) => {
        if (field === 'email' && authSnapshot.isAuthenticated) {
          return
        }
        const value = saved[field]
        if (typeof value === 'string' && value.trim().length > 0) {
          setValue(field as keyof CheckoutFormData, value as never)
        }
      })
    } catch {
      localStorage.removeItem(CHECKOUT_INFO_STORAGE_KEY)
    }
  }, [accessToken, setValue, user?.email, user?.role])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pending = localStorage.getItem('doit_pending_custom_order')
      if (pending) {
        try {
          const parsed = JSON.parse(pending) as PendingCustomOrder
          setCustomOrderData({
            ...parsed,
            referenceImages: normalizeReferenceImages(parsed.referenceImages),
          })
        } catch {
          localStorage.removeItem('doit_pending_custom_order')
        }
      }
      setCustomOrderChecked(true)
    }
  }, [])

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

  const buildBillingAddress = (data: CheckoutFormData) => {
    if (data.billingAddress !== 'different') {
      return buildFullAddress(data)
    }

    const parts = [
      data.billingStreet,
      data.billingApartment,
      data.billingCity,
      data.billingGovernorate,
      data.billingPostalCode,
      data.billingCountry,
    ].filter(Boolean)
    return parts.join(', ')
  }

  const onInvalid = (formErrors: FieldErrors<CheckoutFormData>) => {
    setSuccessOrderNumber(null)
    setSubmitError(t('errors.fixHighlighted'))
    const focusPriority: Array<keyof CheckoutFormData> = [
      'email',
      'country',
      'firstName',
      'lastName',
      'address',
      'city',
      'governorate',
      'phone',
      'billingFirstName',
      'billingLastName',
      'billingStreet',
      'billingCity',
      'billingGovernorate',
      'billingCountry',
    ]
    const firstInvalidField =
      focusPriority.find((field) => Boolean(formErrors[field])) ??
      (Object.keys(formErrors)[0] as keyof CheckoutFormData | undefined)
    if (firstInvalidField) {
      setFocus(firstInvalidField)
    }
  }

  const onSubmit = async (data: CheckoutFormData) => {
    if (!isCustomCheckout && items.length === 0) {
      setSubmitError(t('cartEmpty'))
      return
    }

    setSubmitError(null)
    setSuccessOrderNumber(null)
    setIsSubmitting(true)
    let redirecting = false

    const paymentMethod = data.payment === 'cod' ? 'Cash on Delivery' : data.payment
    const sessionSnapshot = resolveSessionSnapshot(accessToken, user?.email, user?.role)
    const sessionAvailable = sessionSnapshot.isAuthenticated
    const effectiveEmail = sessionAvailable
      ? sessionSnapshot.email || data.email
      : data.email
    const fullAddress = buildFullAddress(data)
    const billingFullAddress = buildBillingAddress(data)
    const shippingFullName = `${data.firstName} ${data.lastName}`.trim()
    const billingFullName =
      data.billingAddress === 'different'
        ? `${data.billingFirstName ?? ''} ${data.billingLastName ?? ''}`.trim()
        : shippingFullName

    if (sessionAvailable && !hasSession) {
      setHasSession(true)
    }

    if (typeof window !== 'undefined') {
      if (data.saveInfo) {
        const savedInfo: StoredCheckoutInfo = {
          email: effectiveEmail,
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          apartment: data.apartment,
          city: data.city,
          governorate: data.governorate,
          postalCode: data.postalCode,
          phone: data.phone,
          country: data.country,
          billingAddress: data.billingAddress,
          billingFirstName: data.billingFirstName,
          billingLastName: data.billingLastName,
          billingStreet: data.billingStreet,
          billingApartment: data.billingApartment,
          billingCity: data.billingCity,
          billingGovernorate: data.billingGovernorate,
          billingPostalCode: data.billingPostalCode,
          billingCountry: data.billingCountry,
        }
        localStorage.setItem(CHECKOUT_INFO_STORAGE_KEY, JSON.stringify(savedInfo))
      } else {
        localStorage.removeItem(CHECKOUT_INFO_STORAGE_KEY)
      }
    }

    try {
      // ── Custom order flow ──────────────────────────────────────────────
      if (isCustomCheckout && activeCustomOrder) {
        const customerInfoLines = [
          '--- Checkout Info ---',
          `Customer Type: ${sessionAvailable ? 'Authenticated' : 'Guest'}`,
          `Name: ${shippingFullName}`,
          `Email: ${effectiveEmail}`,
          `Phone: ${data.phone}`,
          `Shipping Address: ${fullAddress}`,
        ]
        if (data.billingAddress === 'different') {
          customerInfoLines.push(
            `Billing Name: ${billingFullName || shippingFullName}`,
            `Billing Address: ${billingFullAddress || fullAddress}`
          )
        }
        const combinedDetails = [
          activeCustomOrder.details?.trim(),
          customerInfoLines.join('\n'),
        ]
          .filter((value): value is string => Boolean(value && value.trim().length > 0))
          .join('\n\n')

        if (sessionAvailable) {
          try {
            await createAddress({
              label: data.saveInfo ? 'Home' : 'Checkout',
              fullAddress,
            })
          } catch {
            // Do not block custom order placement if address persistence fails.
          }
        }

        const order = await createCustomOrder({
          ...activeCustomOrder,
          details: combinedDetails,
          referenceImages: normalizeReferenceImages(activeCustomOrder.referenceImages),
          email: effectiveEmail,
          fullName: shippingFullName,
          phoneNumber: data.phone,
        })

        if (typeof window !== 'undefined') {
          localStorage.removeItem('doit_pending_custom_order')
        }
        setSuccessOrderNumber(order.orderNumber)

        if (sessionAvailable) {
          redirecting = true
          router.push(`/orders`)
        } else {
          if (typeof window !== 'undefined') {
            localStorage.setItem(
              'doit_guest_order',
              JSON.stringify({
                orderNumber: order.orderNumber,
                email: effectiveEmail,
                placedAt: new Date().toISOString(),
              })
            )
          }
          redirecting = true
          router.push(`/orders/track/${encodeURIComponent(order.orderNumber)}`)
        }
        return
      }

      // ── Normal cart order flow ─────────────────────────────────────────
      const orderItems = items.map((item) => ({
        productId: item.productId,
        color: item.color,
        size: item.size,
        quantity: item.quantity,
      }))
      const billingNotes =
        data.billingAddress === 'different'
          ? `Billing address differs from shipping.\nBilling Name: ${billingFullName || shippingFullName}\nBilling Address: ${billingFullAddress || fullAddress}`
          : undefined

      if (sessionAvailable) {
        const address = await createAddress({
          label: data.saveInfo ? 'Home' : 'Checkout',
          fullAddress,
        })

        const order = await createOrder({
          items: orderItems,
          addressId: address.id,
          paymentMethod,
          notes: billingNotes,
          couponCode: couponCode || undefined,
          governorate: data.governorate,
        })

        setSuccessOrderNumber(order.orderNumber)
        clearCart()
        redirecting = true
        router.push(`/orders`)
      } else {
        const order = await createGuestOrder({
          items: orderItems,
          email: effectiveEmail,
          fullName: `${data.firstName} ${data.lastName}`.trim(),
          phoneNumber: data.phone,
          addressLabel: data.saveInfo ? 'Home' : 'Checkout',
          fullAddress,
          paymentMethod,
          notes: billingNotes,
          couponCode: couponCode || undefined,
          governorate: data.governorate,
        })

        setSuccessOrderNumber(order.orderNumber)
        clearCart()
        if (typeof window !== 'undefined') {
          localStorage.setItem(
            'doit_guest_order',
            JSON.stringify({
              orderNumber: order.orderNumber,
              email: effectiveEmail,
              placedAt: new Date().toISOString(),
            })
          )
        }
        redirecting = true
        router.push(`/orders/track/${encodeURIComponent(order.orderNumber)}`)
      }
    } catch {
      setSubmitError(t('submitError'))
    } finally {
      if (!redirecting) {
        setIsSubmitting(false)
      }
    }
  }

  const showEmptyCheckoutState =
    sessionChecked && customOrderChecked && !isCustomCheckout && items.length === 0
  if (showEmptyCheckoutState) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="flex justify-center mb-8">
            <Link href={`/${locale}`}>
              <Image src="/logo.svg" alt="DOiT" width={150} height={50} />
            </Link>
          </div>

          <div className="rounded-lg border border-gray-200 p-6 md:p-8 text-center">
            <h1 className="font-rubik font-medium text-xl mb-3">{t('emptyCheckoutTitle')}</h1>
            <p className="text-text-body mb-6">{t('cartEmpty')}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={`/${locale}/cart`}
                className="px-5 py-3 rounded bg-primary text-white font-rubik font-medium hover:bg-primary/90 transition-colors"
              >
                {t('backToCart')}
              </Link>
              <Link
                href={`/${locale}`}
                className="px-5 py-3 rounded border border-border-light text-primary font-rubik font-medium hover:bg-bg-card transition-colors"
              >
                {t('continueShopping')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
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
            {!isCustomCheckout && (
              <span className="font-bold">{subtotal.toLocaleString()} EGP</span>
            )}
          </button>

          {/* Mobile Order Summary */}
          {isOrderSummaryOpen && (
            <div className="lg:hidden mb-6 pb-4 border-b border-gray-200">
              {isCustomCheckout && activeCustomOrder ? (
                /* Custom order summary – mobile */
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-text-body">{t('customOrderProductType')}</span>
                    <span className="font-medium capitalize">{activeCustomOrder.productType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-body">{t('customOrderColor')}</span>
                    <span className="font-medium capitalize">{activeCustomOrder.color}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-body">{t('customOrderGender')}</span>
                    <span className="font-medium capitalize">{activeCustomOrder.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-body">{t('customOrderSize')}</span>
                    <span className="font-medium capitalize">{activeCustomOrder.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-body">{t('customOrderQuantity')}</span>
                    <span className="font-medium">{activeCustomOrder.quantity}</span>
                  </div>
                  {activeCustomOrder.details && (
                    <div className="flex flex-col gap-1">
                      <span className="text-text-body">{t('customOrderDetailsLabel')}</span>
                      <span className="font-medium text-xs">{activeCustomOrder.details}</span>
                    </div>
                  )}
                  {customOrderImageUrls.length > 0 && (
                    <div>
                      <p className="text-text-body mb-2">{t('customOrderImages')}</p>
                      <div className="flex gap-2 flex-wrap">
                        {customOrderImageUrls.map((url, i) => (
                          <div key={i} className="w-16 h-16 rounded border border-gray-200 overflow-hidden bg-white shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt={`ref ${i + 1}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Normal cart summary – mobile */
                <>
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
                    <span className="font-medium">
                      {shippingPrice <= 0 ? t('free') : `${shippingPrice.toLocaleString()} EGP`}
                    </span>
                  </div>
                  {couponDiscountAmount > 0 && (
                    <div className="flex justify-between text-sm mt-1">
                      <span>{t('coupon')}:</span>
                      <span className="font-medium text-green-700">- {couponDiscountAmount.toLocaleString()} EGP</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold mt-2 pt-2 border-t border-gray-100">
                    <span>{t('total')}:</span>
                    <span>{orderTotal.toLocaleString()} EGP</span>
                  </div>
                </>
              )}
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
              {hasSession && (
                <Link href={`/${locale}/orders`} className="underline text-green-700">
                  {t('viewOrders')}
                </Link>
              )}
              {!hasSession && (
                <p className="mt-2 text-xs text-green-700">
                  {t('guestOrderNote')}
                </p>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate>
            {/* Email Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-rubik font-medium text-lg">{t('email')}</h2>
                {/* Only render after session check to avoid flash for logged-in users */}
                {sessionChecked && !hasSession && (
                  <Link href={`/${locale}/sign-in`} className="text-sm underline">
                    {t('signIn')}
                  </Link>
                )}
              </div>
              <div className="relative">
                <Sms size={20} className="absolute start-3 top-1/2 -translate-y-1/2 text-text-placeholder" />
                <input
                  type="email"
                  {...register('email')}
                  placeholder={t('enterEmail')}
                  readOnly={hasSession}
                  aria-invalid={Boolean(errors.email)}
                  className={cn(
                    "w-full ps-10 pe-4 py-3 border border-border-light rounded text-sm outline-none focus:border-primary",
                    hasSession && "bg-bg-card text-text-body cursor-default",
                    errors.email && !hasSession && invalidFieldClass
                  )}
                />
              </div>
              {typeof errors.email?.message === 'string' && !hasSession && (
                <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Delivery Section */}
            <div className="mb-6">
              <h2 className="font-rubik font-medium text-lg mb-3">{t('delivery')}</h2>

              {/* Country */}
              <div className="mb-3">
                <div className="relative">
                  <select
                    {...register('country')}
                    aria-invalid={Boolean(errors.country)}
                    className={cn(
                      "w-full px-4 py-3 border border-border-light rounded text-sm appearance-none outline-none focus:border-primary",
                      errors.country && invalidFieldClass
                    )}
                  >
                    <option value="">{t('countryRegion')}</option>
                    <option value="Egypt">{t('countries.egypt')}</option>
                    <option value="Saudi Arabia">{t('countries.saudiArabia')}</option>
                    <option value="UAE">{t('countries.uae')}</option>
                  </select>
                  <ArrowDown2
                    size={16}
                    className={cn(
                      "absolute end-3 top-1/2 -translate-y-1/2 text-text-placeholder pointer-events-none",
                      errors.country && 'text-red-500'
                    )}
                  />
                </div>
                {typeof errors.country?.message === 'string' && (
                  <p className="text-xs text-red-600 mt-1">{errors.country.message}</p>
                )}
              </div>

              {/* Name Row */}
              <div className="flex gap-3 mb-3">
                <div className="flex-1">
                  <input
                    type="text"
                    {...register('firstName')}
                    placeholder={t('firstName')}
                    aria-invalid={Boolean(errors.firstName)}
                    className={cn(
                      "w-full px-4 py-3 border border-border-light rounded text-sm outline-none focus:border-primary",
                      errors.firstName && invalidFieldClass
                    )}
                  />
                  {typeof errors.firstName?.message === 'string' && (
                    <p className="text-xs text-red-600 mt-1">{errors.firstName.message}</p>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    {...register('lastName')}
                    placeholder={t('lastName')}
                    aria-invalid={Boolean(errors.lastName)}
                    className={cn(
                      "w-full px-4 py-3 border border-border-light rounded text-sm outline-none focus:border-primary",
                      errors.lastName && invalidFieldClass
                    )}
                  />
                  {typeof errors.lastName?.message === 'string' && (
                    <p className="text-xs text-red-600 mt-1">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="mb-3">
                <input
                  type="text"
                  {...register('address')}
                  placeholder={t('address')}
                  aria-invalid={Boolean(errors.address)}
                  className={cn(
                    "w-full px-4 py-3 border border-border-light rounded text-sm outline-none focus:border-primary",
                    errors.address && invalidFieldClass
                  )}
                />
                {typeof errors.address?.message === 'string' && (
                  <p className="text-xs text-red-600 mt-1">{errors.address.message}</p>
                )}
              </div>

              {/* Apartment */}
              <input
                type="text"
                {...register('apartment')}
                placeholder={t('apartment')}
                className="w-full px-4 py-3 border border-border-light rounded text-sm outline-none focus:border-primary mb-3"
              />

              {/* City, Governorate, Postal */}
              <div className="flex gap-3 mb-3">
                <div className="flex-1">
                  <input
                    type="text"
                    {...register('city')}
                    placeholder={t('city')}
                    aria-invalid={Boolean(errors.city)}
                    className={cn(
                      "w-full px-4 py-3 border border-border-light rounded text-sm outline-none focus:border-primary",
                      errors.city && invalidFieldClass
                    )}
                  />
                  {typeof errors.city?.message === 'string' && (
                    <p className="text-xs text-red-600 mt-1">{errors.city.message}</p>
                  )}
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <select
                      {...register('governorate')}
                      aria-invalid={Boolean(errors.governorate)}
                      className={cn(
                        "w-full px-4 py-3 border border-border-light rounded text-sm appearance-none outline-none focus:border-primary",
                        errors.governorate && invalidFieldClass
                      )}
                    >
                      <option value="">{t('governorate')}</option>
                      {governorateOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ArrowDown2
                      size={16}
                      className={cn(
                        "absolute end-3 top-1/2 -translate-y-1/2 text-text-placeholder pointer-events-none",
                        errors.governorate && 'text-red-500'
                      )}
                    />
                  </div>
                  {typeof errors.governorate?.message === 'string' && (
                    <p className="text-xs text-red-600 mt-1">{errors.governorate.message}</p>
                  )}
                </div>
                <input
                  type="text"
                  {...register('postalCode')}
                  placeholder={t('postalCode')}
                  className="flex-1 px-4 py-3 border border-border-light rounded text-sm outline-none focus:border-primary"
                />
              </div>

              {/* Phone */}
              <div className="mb-3">
                <div className="relative">
                  <input
                    type="tel"
                    {...register('phone')}
                    placeholder={t('phone')}
                    aria-invalid={Boolean(errors.phone)}
                    className={cn(
                      "w-full px-4 pe-20 py-3 border border-border-light rounded text-sm outline-none focus:border-primary",
                      errors.phone && invalidFieldClass
                    )}
                  />
                  <div className="absolute end-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <span className="text-text-placeholder">|</span>
                    <Image src="/flags/ar.svg" alt="EG" width={20} height={20} className="rounded-sm" />
                    <ArrowDown2 size={14} className="text-text-placeholder" />
                  </div>
                </div>
                {typeof errors.phone?.message === 'string' && (
                  <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>
                )}
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

              {billingAddressMode === 'different' && (
                <div className="mt-4 space-y-3 rounded border border-border-light p-4">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        {...register('billingFirstName')}
                        placeholder={t('firstName')}
                        aria-invalid={Boolean(errors.billingFirstName)}
                        className={cn(
                          "w-full px-4 py-3 border border-border-light rounded text-sm outline-none focus:border-primary",
                          errors.billingFirstName && invalidFieldClass
                        )}
                      />
                      {typeof errors.billingFirstName?.message === 'string' && (
                        <p className="text-xs text-red-600 mt-1">{errors.billingFirstName.message}</p>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        {...register('billingLastName')}
                        placeholder={t('lastName')}
                        aria-invalid={Boolean(errors.billingLastName)}
                        className={cn(
                          "w-full px-4 py-3 border border-border-light rounded text-sm outline-none focus:border-primary",
                          errors.billingLastName && invalidFieldClass
                        )}
                      />
                      {typeof errors.billingLastName?.message === 'string' && (
                        <p className="text-xs text-red-600 mt-1">{errors.billingLastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      {...register('billingStreet')}
                      placeholder={t('address')}
                      aria-invalid={Boolean(errors.billingStreet)}
                      className={cn(
                        "w-full px-4 py-3 border border-border-light rounded text-sm outline-none focus:border-primary",
                        errors.billingStreet && invalidFieldClass
                      )}
                    />
                    {typeof errors.billingStreet?.message === 'string' && (
                      <p className="text-xs text-red-600 mt-1">{errors.billingStreet.message}</p>
                    )}
                  </div>

                  <input
                    type="text"
                    {...register('billingApartment')}
                    placeholder={t('apartment')}
                    className="w-full px-4 py-3 border border-border-light rounded text-sm outline-none focus:border-primary"
                  />

                  <div className="flex gap-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        {...register('billingCity')}
                        placeholder={t('city')}
                        aria-invalid={Boolean(errors.billingCity)}
                        className={cn(
                          "w-full px-4 py-3 border border-border-light rounded text-sm outline-none focus:border-primary",
                          errors.billingCity && invalidFieldClass
                        )}
                      />
                      {typeof errors.billingCity?.message === 'string' && (
                        <p className="text-xs text-red-600 mt-1">{errors.billingCity.message}</p>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="relative">
                        <select
                          {...register('billingGovernorate')}
                          aria-invalid={Boolean(errors.billingGovernorate)}
                          className={cn(
                            "w-full px-4 py-3 border border-border-light rounded text-sm appearance-none outline-none focus:border-primary",
                            errors.billingGovernorate && invalidFieldClass
                          )}
                        >
                          <option value="">{t('governorate')}</option>
                          {governorateOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <ArrowDown2
                          size={16}
                          className={cn(
                            "absolute end-3 top-1/2 -translate-y-1/2 text-text-placeholder pointer-events-none",
                            errors.billingGovernorate && 'text-red-500'
                          )}
                        />
                      </div>
                      {typeof errors.billingGovernorate?.message === 'string' && (
                        <p className="text-xs text-red-600 mt-1">{errors.billingGovernorate.message}</p>
                      )}
                    </div>
                    <input
                      type="text"
                      {...register('billingPostalCode')}
                      placeholder={t('postalCode')}
                      className="flex-1 px-4 py-3 border border-border-light rounded text-sm outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <div className="relative">
                      <select
                        {...register('billingCountry')}
                        aria-invalid={Boolean(errors.billingCountry)}
                        className={cn(
                          "w-full px-4 py-3 border border-border-light rounded text-sm appearance-none outline-none focus:border-primary",
                          errors.billingCountry && invalidFieldClass
                        )}
                      >
                        <option value="">{t('countryRegion')}</option>
                        <option value="Egypt">{t('countries.egypt')}</option>
                        <option value="Saudi Arabia">{t('countries.saudiArabia')}</option>
                        <option value="UAE">{t('countries.uae')}</option>
                      </select>
                      <ArrowDown2
                        size={16}
                        className={cn(
                          "absolute end-3 top-1/2 -translate-y-1/2 text-text-placeholder pointer-events-none",
                          errors.billingCountry && 'text-red-500'
                        )}
                      />
                    </div>
                    {typeof errors.billingCountry?.message === 'string' && (
                      <p className="text-xs text-red-600 mt-1">{errors.billingCountry.message}</p>
                    )}
                  </div>
                </div>
              )}
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
            {isCustomCheckout && activeCustomOrder ? (
              /* ── Custom order details panel (screenshot 1) ── */
              <div>
                <h3 className="font-rubik font-medium text-base text-text-body mb-4">
                  {t('customOrderDetails')}:
                </h3>
                <table className="w-full text-sm mb-6">
                  <tbody className="space-y-2">
                    <tr>
                      <td className="text-text-body py-1 pe-6 whitespace-nowrap">{t('customOrderProductType')}</td>
                      <td className="font-medium capitalize">{activeCustomOrder.productType}</td>
                    </tr>
                    <tr>
                      <td className="text-text-body py-1 pe-6 whitespace-nowrap">{t('customOrderColor')}</td>
                      <td className="font-medium capitalize">{activeCustomOrder.color}</td>
                    </tr>
                    <tr>
                      <td className="text-text-body py-1 pe-6 whitespace-nowrap">{t('customOrderGender')}</td>
                      <td className="font-medium capitalize">{activeCustomOrder.gender}</td>
                    </tr>
                    <tr>
                      <td className="text-text-body py-1 pe-6 whitespace-nowrap">{t('customOrderSize')}</td>
                      <td className="font-medium capitalize">{activeCustomOrder.size}</td>
                    </tr>
                    <tr>
                      <td className="text-text-body py-1 pe-6 whitespace-nowrap">{t('customOrderQuantity')}</td>
                      <td className="font-medium">{activeCustomOrder.quantity}</td>
                    </tr>
                    {activeCustomOrder.details && (
                      <tr>
                        <td className="text-text-body py-1 pe-6 whitespace-nowrap align-top">{t('customOrderDetailsLabel')}</td>
                        <td className="font-medium">{activeCustomOrder.details}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {customOrderImageUrls.length > 0 && (
                  <div>
                    <p className="text-sm text-text-body mb-3">{t('customOrderImages')}:</p>
                    <div className="flex gap-3 flex-wrap">
                      {customOrderImageUrls.map((url, i) => (
                        <div key={i} className="w-24 h-24 rounded border border-gray-200 overflow-hidden bg-white shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt={`ref ${i + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ── Normal cart items panel (screenshot 2) ── */
              <>
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
                    <span className="font-medium">
                      {shippingPrice <= 0 ? t('free') : `${shippingPrice.toLocaleString()} EGP`}
                    </span>
                  </div>
                  {couponDiscountAmount > 0 && (
                    <div className="flex justify-between mb-4">
                      <span className="text-text-body">{t('coupon')}:</span>
                      <span className="font-medium text-green-700">- {couponDiscountAmount.toLocaleString()} EGP</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-300">
                    <span>{t('total')}:</span>
                    <span>{orderTotal.toLocaleString()} EGP</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
