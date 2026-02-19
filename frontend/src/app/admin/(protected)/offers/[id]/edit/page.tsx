'use client'

import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams, useRouter } from 'next/navigation'
import { FormInput, FormSelect, FormPageHeader } from '@/components/admin/forms'
import StatusSelect from '@/components/admin/StatusSelect'
import { useOffer, useUpdateOffer, useDeleteOffer } from '@/hooks/useOffers'
import { useCategories, useFilterOptions } from '@/hooks/useCategories'
import type { OfferScope, OfferType } from '@/types/offer'

interface OfferFormData {
  offerName: string
  offerNameAr: string
  offerCode: string
  offerType: OfferType
  discountValue: string
  minimumCartValue: string
  maximumDiscount: string
  applyCategory: string
  applySubCategory: string
  applyProductList: string
  applyProductType: string
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  usageLimitTotal: string
  usageLimitPerUser: string
}

const offerTypeOptions = [
  { value: 'PERCENTAGE', label: 'Percentage' },
  { value: 'FIXED_AMOUNT', label: 'Fixed Amount' },
  { value: 'BUNDLE', label: 'Bundle' },
  { value: 'FREE_SHIPPING', label: 'Free Shipping' },
]

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'draft', label: 'Draft' },
]

const parseNumber = (value: string) => {
  if (!value) return undefined
  const parsed = Number(value.replace(/[^\d.]/g, ''))
  return Number.isNaN(parsed) ? undefined : parsed
}

const toInputNumber = (value: unknown) => {
  if (value === null || value === undefined) return ''
  if (typeof value === 'number') return value.toString()
  if (typeof value === 'string') return value
  if (typeof value === 'object') {
    const candidate = value as {
      toNumber?: () => number
      toString?: () => string
      $numberDecimal?: string
    }
    if (typeof candidate.toNumber === 'function') {
      const parsed = candidate.toNumber()
      return Number.isFinite(parsed) ? parsed.toString() : ''
    }
    if (typeof candidate.$numberDecimal === 'string') {
      return candidate.$numberDecimal
    }
    if (typeof candidate.toString === 'function') {
      const text = candidate.toString()
      if (text && text !== '[object Object]') return text
    }
  }
  return ''
}

const toIsoDate = (value: string) => {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : date.toISOString()
}

const toInputDate = (value?: string) => {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10)
}

type SelectOption = { value: string; label: string }

const ensureSelectedOption = (
  options: SelectOption[],
  selectedValue: string,
  fallbackLabel: string
): SelectOption[] => {
  if (!selectedValue) return options
  if (options.some((option) => option.value === selectedValue)) return options
  return [{ value: selectedValue, label: `${fallbackLabel}: ${selectedValue}` }, ...options]
}

export default function EditOfferPage() {
  const router = useRouter()
  const params = useParams()
  const offerId = params?.id as string
  const { data: offer, isLoading } = useOffer(offerId)
  const { mutateAsync: updateOffer, isPending } = useUpdateOffer()
  const { mutateAsync: deleteOffer } = useDeleteOffer()
  const { data: categories } = useCategories(true)
  const { data: filters } = useFilterOptions()

  const [applyTo, setApplyTo] = useState<OfferScope>('ALL')
  const [offerStatus, setOfferStatus] = useState('active')

  const categoryOptions = useMemo(() => (
    categories?.map((category) => ({
      value: category.id,
      label: category.nameEn,
    })) ?? []
  ), [categories])

  const subCategoryOptions = useMemo(() => {
    const list = categories?.flatMap((category) => category.subCategories ?? []) ?? []
    return list.map((sub) => ({
      value: sub.id,
      label: sub.nameEn,
    }))
  }, [categories])

  const productListOptions = useMemo(() => {
    const list = categories?.flatMap((category) =>
      (category.subCategories ?? []).flatMap((sub) => sub.productLists ?? [])
    ) ?? []
    return list.map((item) => ({
      value: item.id,
      label: item.nameEn,
    }))
  }, [categories])

  const productTypeOptions = useMemo(() => (
    filters?.types?.map((type) => ({ value: type, label: type })) ?? []
  ), [filters])

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<OfferFormData>()

  const selectedApplyCategory = watch('applyCategory') ?? ''
  const selectedApplySubCategory = watch('applySubCategory') ?? ''
  const selectedApplyProductList = watch('applyProductList') ?? ''
  const selectedApplyProductType = watch('applyProductType') ?? ''

  const categorySelectOptions = useMemo(
    () => ensureSelectedOption(categoryOptions, selectedApplyCategory, 'Current category'),
    [categoryOptions, selectedApplyCategory]
  )
  const subCategorySelectOptions = useMemo(
    () => ensureSelectedOption(subCategoryOptions, selectedApplySubCategory, 'Current sub category'),
    [subCategoryOptions, selectedApplySubCategory]
  )
  const productListSelectOptions = useMemo(
    () => ensureSelectedOption(productListOptions, selectedApplyProductList, 'Current product list'),
    [productListOptions, selectedApplyProductList]
  )
  const productTypeSelectOptions = useMemo(
    () => ensureSelectedOption(productTypeOptions, selectedApplyProductType, 'Current product type'),
    [productTypeOptions, selectedApplyProductType]
  )

  useEffect(() => {
    if (!offer) return
    setApplyTo(offer.applyTo)
    setOfferStatus(offer.status ? 'active' : 'draft')
    reset({
      offerName: offer.nameEn,
      offerNameAr: offer.nameAr,
      offerCode: offer.code,
      offerType: offer.type,
      discountValue: toInputNumber(offer.discountValue),
      minimumCartValue: toInputNumber(offer.minCartValue),
      maximumDiscount: toInputNumber(offer.maxDiscount),
      applyCategory: offer.applyTo === 'CATEGORY' ? offer.targetId ?? '' : '',
      applySubCategory: offer.applyTo === 'SUB_CATEGORY' ? offer.targetId ?? '' : '',
      applyProductList: offer.applyTo === 'PRODUCT_LIST' ? offer.targetId ?? '' : '',
      applyProductType: offer.applyTo === 'PRODUCT_TYPE' ? offer.targetId ?? '' : '',
      startDate: toInputDate(offer.startDate),
      startTime: offer.startTime ?? '',
      endDate: toInputDate(offer.endDate),
      endTime: offer.endTime ?? '',
      usageLimitTotal: toInputNumber(offer.totalUsageLimit),
      usageLimitPerUser: toInputNumber(offer.perUserLimit),
    })
  }, [offer, reset])

  const onSubmit = async (data: OfferFormData) => {
    if (!offer) return
    const targetId = applyTo === 'CATEGORY'
      ? data.applyCategory
      : applyTo === 'SUB_CATEGORY'
      ? data.applySubCategory
      : applyTo === 'PRODUCT_LIST'
      ? data.applyProductList
      : applyTo === 'PRODUCT_TYPE'
      ? data.applyProductType
      : null

    await updateOffer({
      id: offer.id,
      data: {
        nameEn: data.offerName.trim(),
        nameAr: (data.offerNameAr || data.offerName).trim(),
        type: data.offerType,
        discountValue: parseNumber(data.discountValue) ?? offer.discountValue,
        minCartValue: parseNumber(data.minimumCartValue) ?? null,
        maxDiscount: parseNumber(data.maximumDiscount) ?? null,
        applyTo,
        targetId: targetId || null,
        startDate: toIsoDate(data.startDate),
        endDate: toIsoDate(data.endDate),
        startTime: data.startTime || null,
        endTime: data.endTime || null,
        totalUsageLimit: parseNumber(data.usageLimitTotal) ?? null,
        perUserLimit: parseNumber(data.usageLimitPerUser) ?? null,
        status: offerStatus === 'active',
      },
    })

    router.push('/admin/offers')
  }

  const handleDelete = async () => {
    if (!offer) return
    await deleteOffer(offer.id)
    router.push('/admin/offers')
  }

  if (isLoading || !offer) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg p-6 text-sm text-neutral-500">
          Loading offer...
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6">
      <FormPageHeader
        title="Edit Offer"
        backHref="/admin/offers"
        isSubmitting={isPending}
        showDelete
        onDelete={handleDelete}
      />

      <div className="flex justify-end mb-4">
        <StatusSelect
          value={offerStatus}
          onChange={setOfferStatus}
          options={statusOptions}
        />
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <FormInput
                label="Offer Name (EN)"
                placeholder="e.g. Running Shoes 50%"
                error={errors.offerName}
                {...register('offerName', { required: 'Offer name is required' })}
              />
              <FormInput
                label="Offer Name (AR)"
                placeholder="Arabic name"
                error={errors.offerNameAr}
                {...register('offerNameAr')}
              />
              <FormInput
                label="Offer Code"
                placeholder="e.g. RUN50"
                error={errors.offerCode}
                disabled
                {...register('offerCode', { required: 'Offer code is required' })}
              />
              <FormSelect
                label="Offer Type"
                options={offerTypeOptions}
                placeholder="Select type"
                error={errors.offerType}
                {...register('offerType')}
              />
            </div>

            <div className="space-y-4">
              <FormInput
                label="Discount Value"
                placeholder="e.g. 50"
                error={errors.discountValue}
                {...register('discountValue', { required: 'Discount value is required' })}
              />
              <FormInput
                label="Minimum Cart value"
                placeholder="e.g. 2000 EGP"
                error={errors.minimumCartValue}
                {...register('minimumCartValue')}
              />
              <FormInput
                label="Maximum Discount"
                placeholder="e.g. 3000 EGP"
                error={errors.maximumDiscount}
                {...register('maximumDiscount')}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6">
            <label className="text-sm font-medium text-neutral-900 mb-3 block">Apply To:</label>
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="applyTo"
                  value="ALL"
                  checked={applyTo === 'ALL'}
                  onChange={() => setApplyTo('ALL')}
                  className="w-4 h-4 accent-neutral-900"
                />
                <span className="text-sm text-neutral-700">All Products</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="applyTo"
                  value="CATEGORY"
                  checked={applyTo === 'CATEGORY'}
                  onChange={() => setApplyTo('CATEGORY')}
                  className="w-4 h-4 accent-neutral-900"
                />
                <span className="text-sm text-neutral-700">Categories</span>
              </label>
              {applyTo === 'CATEGORY' && (
                <div className="ml-6">
                  <FormSelect
                    options={categorySelectOptions}
                    placeholder="Select category"
                    value={selectedApplyCategory}
                    {...register('applyCategory')}
                  />
                </div>
              )}

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="applyTo"
                  value="SUB_CATEGORY"
                  checked={applyTo === 'SUB_CATEGORY'}
                  onChange={() => setApplyTo('SUB_CATEGORY')}
                  className="w-4 h-4 accent-neutral-900"
                />
                <span className="text-sm text-neutral-700">Sub Categories</span>
              </label>
              {applyTo === 'SUB_CATEGORY' && (
                <div className="ml-6">
                  <FormSelect
                    options={subCategorySelectOptions}
                    placeholder="Select sub category"
                    value={selectedApplySubCategory}
                    {...register('applySubCategory')}
                  />
                </div>
              )}

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="applyTo"
                  value="PRODUCT_LIST"
                  checked={applyTo === 'PRODUCT_LIST'}
                  onChange={() => setApplyTo('PRODUCT_LIST')}
                  className="w-4 h-4 accent-neutral-900"
                />
                <span className="text-sm text-neutral-700">Product List</span>
              </label>
              {applyTo === 'PRODUCT_LIST' && (
                <div className="ml-6">
                  <FormSelect
                    options={productListSelectOptions}
                    placeholder="Select product list"
                    value={selectedApplyProductList}
                    {...register('applyProductList')}
                  />
                </div>
              )}

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="applyTo"
                  value="PRODUCT_TYPE"
                  checked={applyTo === 'PRODUCT_TYPE'}
                  onChange={() => setApplyTo('PRODUCT_TYPE')}
                  className="w-4 h-4 accent-neutral-900"
                />
                <span className="text-sm text-neutral-700">Product Type</span>
              </label>
              {applyTo === 'PRODUCT_TYPE' && (
                <div className="ml-6">
                  <FormSelect
                    options={productTypeSelectOptions}
                    placeholder="Select product type"
                    value={selectedApplyProductType}
                    {...register('applyProductType')}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg p-6">
            <div className="space-y-4">
              <FormInput
                label="Start date"
                type="date"
                error={errors.startDate}
                {...register('startDate')}
              />
              <FormInput
                label="Start Time"
                type="time"
                error={errors.startTime}
                {...register('startTime')}
              />
              <FormInput
                label="End Date"
                type="date"
                error={errors.endDate}
                {...register('endDate')}
              />
              <FormInput
                label="End Time"
                type="time"
                error={errors.endTime}
                {...register('endTime')}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6">
            <label className="text-sm font-medium text-neutral-900 mb-3 block">Usage Limit:</label>
            <div className="space-y-4">
              <FormInput
                label="Total"
                type="number"
                placeholder="e.g. 2000"
                error={errors.usageLimitTotal}
                {...register('usageLimitTotal')}
              />
              <FormInput
                label="Per User"
                type="number"
                placeholder="e.g. 3"
                error={errors.usageLimitPerUser}
                {...register('usageLimitPerUser')}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
