'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useForm, useFieldArray, Controller, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormInput, FormTextarea, FormSelect, FormColorSelect, ImageUpload, FormPageHeader, UploadedImage } from '@/components/admin/forms'
import { productSchema, ProductFormData } from '@/lib/schemas/admin'
import { Add, Trash } from 'iconsax-reactjs'
import { useCreateProduct } from '@/hooks/useProducts'
import { useCategories, useFilterOptions } from '@/hooks/useCategories'
import { uploadProductImage, uploadProductImages } from '@/services/upload'
import {
  DEFAULT_PRODUCT_SIZE_VALUES,
  buildProductColorOptions,
  mergeProductOptionValues,
  normalizeProductColorValue,
} from '@/data/product-variant-options'

const parseNumber = (value?: string) => {
  if (!value) return undefined
  const parsed = Number(value.replace(/[^\d.]/g, ''))
  return Number.isNaN(parsed) ? undefined : parsed
}

const parseDetails = (value?: string) => {
  if (!value) return undefined
  return value
    .split('\n')
    .map((line) => line.replace(/^[\u2022\-*]+\s?/, '').trim())
    .filter(Boolean)
}

export default function AddProductPage() {
  const router = useRouter()
  const [mediaImages, setMediaImages] = useState<UploadedImage[]>([])
  const [sizeChartImages, setSizeChartImages] = useState<UploadedImage[]>([])

  const { mutateAsync, isPending } = useCreateProduct()
  const { data: categories } = useCategories(true)
  const { data: filterOptions } = useFilterOptions()

  const statusOptions = [
    { value: 'PUBLISHED', label: 'Published' },
    { value: 'UNPUBLISHED', label: 'Unpublished' },
    { value: 'DRAFT', label: 'Draft' },
  ]

  const vendorOptions = (filterOptions?.brands ?? []).map((brand) => ({ value: brand, label: brand }))
  const genderOptions = (filterOptions?.genders ?? []).map((gender) => ({ value: gender, label: gender }))
  const typeOptions = (filterOptions?.types ?? []).map((type) => ({ value: type, label: type }))
  const colorOptions = buildProductColorOptions(filterOptions?.colors)
  const sizeOptions = mergeProductOptionValues(DEFAULT_PRODUCT_SIZE_VALUES, filterOptions?.sizes)
    .map((size) => ({ value: size, label: size }))

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      nameEn: '',
      descriptionEn: '',
      detailsEn: '',
      nameAr: '',
      descriptionAr: '',
      detailsAr: '',
      sku: '',
      quantity: '',
      status: 'PUBLISHED',
      basePrice: '',
      discountPercentage: '',
      vendor: '',
      gender: '',
      category: '',
      subCategory: '',
      productList: '',
      type: '',
      variants: [{ id: '1', color: '', size: '', quantity: '' }]
    }
  })

  const selectedCategory = watch('category')
  const selectedSubCategory = watch('subCategory')
  const watchedVariants = useWatch({ control, name: 'variants' })
  const [isQuantityManuallyEdited, setIsQuantityManuallyEdited] = useState(false)

  const variantQuantityTotal = useMemo(() => (
    (watchedVariants ?? []).reduce((sum, variant) => sum + (parseNumber(variant.quantity) ?? 0), 0)
  ), [watchedVariants])

  const categoryOptions = useMemo(() => (
    categories?.map((category) => ({ value: category.id, label: category.nameEn })) ?? []
  ), [categories])

  const subCategoryOptions = useMemo(() => {
    const category = categories?.find((item) => item.id === selectedCategory)
    return category?.subCategories?.map((sub) => ({ value: sub.id, label: sub.nameEn })) ?? []
  }, [categories, selectedCategory])

  const productListOptions = useMemo(() => {
    const category = categories?.find((item) => item.id === selectedCategory)
    const subCategory = category?.subCategories?.find((sub) => sub.id === selectedSubCategory)
    return subCategory?.productLists?.map((list) => ({ value: list.id, label: list.nameEn })) ?? []
  }, [categories, selectedCategory, selectedSubCategory])

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants'
  })

  useEffect(() => {
    if (isQuantityManuallyEdited) return

    setValue('quantity', variantQuantityTotal > 0 ? String(variantQuantityTotal) : '', {
      shouldValidate: true,
      shouldDirty: false,
    })
  }, [isQuantityManuallyEdited, setValue, variantQuantityTotal])

  const quantityRegister = register('quantity', {
    onChange: () => {
      setIsQuantityManuallyEdited(true)
    },
  })

  const onSubmit = async (data: ProductFormData) => {
    const quantity = parseNumber(data.quantity) ?? 0
    const variantsTotal = data.variants.reduce(
      (sum, variant) => sum + (parseNumber(variant.quantity) ?? 0),
      0
    )

    if (variantsTotal > quantity) {
      setError('quantity', {
        type: 'manual',
        message: 'Quantity must be greater than or equal to variants total',
      })
      return
    }
    clearErrors('quantity')

    const newMediaFiles = mediaImages.filter((img) => img.file).map((img) => img.file!) 
    const newMediaUrls = newMediaFiles.length ? await uploadProductImages(newMediaFiles) : []
    const existingMediaUrls = mediaImages.filter((img) => !img.file).map((img) => img.url)
    const allMediaUrls = [...existingMediaUrls, ...newMediaUrls]

    let sizeChartUrl = sizeChartImages[0]?.url
    if (sizeChartImages[0]?.file) {
      sizeChartUrl = await uploadProductImage(sizeChartImages[0].file)
    }

    await mutateAsync({
      nameEn: data.nameEn,
      descriptionEn: data.descriptionEn,
      detailsEn: parseDetails(data.detailsEn),
      nameAr: data.nameAr,
      descriptionAr: data.descriptionAr,
      detailsAr: parseDetails(data.detailsAr),
      sku: data.sku,
      quantity,
      basePrice: parseNumber(data.basePrice) ?? 0,
      discountPercentage: parseNumber(data.discountPercentage) ?? 0,
      vendor: data.vendor,
      gender: data.gender as 'MEN' | 'WOMEN' | 'KIDS' | 'UNISEX',
      type: data.type,
      status: data.status as 'PUBLISHED' | 'UNPUBLISHED' | 'DRAFT',
      productListId: data.productList,
      sizeChartUrl: sizeChartUrl,
      imageUrls: allMediaUrls,
      variants: data.variants.map((variant) => ({
        color: normalizeProductColorValue(variant.color),
        size: variant.size,
        quantity: parseNumber(variant.quantity) ?? 0,
      })),
    })

    router.push('/admin/products')
  }

  return (
      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        <FormPageHeader
          title="Add Product"
          backHref="/admin/products"
          isSubmitting={isPending}
        />

        <div className="bg-white rounded-lg p-6">
          <div className="grid grid-cols-2 gap-8 pb-6 border-b border-neutral-100">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-neutral-600 mb-4">
                <Image src="/flags/en.svg" alt="English" width={20} height={20} className="rounded-sm" />
                <span>English</span>
              </div>

              <FormInput
                label="Product Name"
                placeholder="Enter product name"
                error={errors.nameEn}
                {...register('nameEn')}
              />

              <FormTextarea
                label="Description"
                placeholder="Enter product description"
                rows={3}
                error={errors.descriptionEn}
                {...register('descriptionEn')}
              />

              <FormTextarea
                label="Details"
                placeholder="• Detail 1"
                rows={6}
                error={errors.detailsEn}
                {...register('detailsEn')}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-neutral-600 mb-4 justify-end">
                <span>Arabic</span>
                <Image src="/flags/ar.svg" alt="Arabic" width={20} height={20} className="rounded-sm" />
              </div>

              <FormInput
                label="اسم المنتج"
                placeholder="أدخل اسم المنتج"
                dir="rtl"
                inputClassName="text-right"
                error={errors.nameAr}
                {...register('nameAr')}
              />

              <FormTextarea
                label="الوصف"
                placeholder="أدخل وصف المنتج"
                rows={3}
                dir="rtl"
                textareaClassName="text-right"
                error={errors.descriptionAr}
                {...register('descriptionAr')}
              />

              <FormTextarea
                label="التفاصيل"
                placeholder="• تفاصيل 1"
                rows={6}
                dir="rtl"
                textareaClassName="text-right"
                error={errors.detailsAr}
                {...register('detailsAr')}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8 py-6">
            <div className="col-span-2 space-y-6">
              <ImageUpload
                label="Media"
                value={mediaImages}
                onChange={setMediaImages}
                maxImages={5}
              />

              <div className="grid grid-cols-3 gap-4">
                <FormInput
                  label="SKU"
                  placeholder="Enter SKU"
                  error={errors.sku}
                  {...register('sku')}
                />
                <FormInput
                  label="Quantity"
                  type="number"
                  placeholder="0"
                  error={errors.quantity}
                  {...quantityRegister}
                />
                <FormSelect
                  label="Status"
                  options={statusOptions}
                  error={errors.status}
                  {...register('status')}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-neutral-500 -mt-1">
                <span>Variants total: {variantQuantityTotal}</span>
                <button
                  type="button"
                  onClick={() => {
                    setIsQuantityManuallyEdited(false)
                    setValue('quantity', variantQuantityTotal > 0 ? String(variantQuantityTotal) : '', {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }}
                  className="text-neutral-700 underline hover:text-neutral-900 transition-colors"
                >
                  Use derived quantity
                </button>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-end gap-4">
                    <span className="text-sm font-medium text-neutral-500 pb-2.5 w-16">
                      Variant {index + 1}:
                    </span>
                    <Controller
                      control={control}
                      name={`variants.${index}.color` as const}
                      render={({ field: colorField }) => (
                        <FormColorSelect
                          label={index === 0 ? 'Color' : undefined}
                          options={colorOptions}
                          placeholder="Color"
                          className="flex-1"
                          error={errors.variants?.[index]?.color}
                          value={colorField.value}
                          onChange={colorField.onChange}
                          onBlur={colorField.onBlur}
                        />
                      )}
                    />
                    <FormSelect
                      label={index === 0 ? 'Size' : undefined}
                      options={sizeOptions}
                      placeholder="Size"
                      className="flex-1"
                      error={errors.variants?.[index]?.size}
                      {...register(`variants.${index}.size`)}
                    />
                    <FormInput
                      label={index === 0 ? 'Quantity' : undefined}
                      type="number"
                      placeholder="0"
                      className="flex-1"
                      error={errors.variants?.[index]?.quantity}
                      {...register(`variants.${index}.quantity`)}
                    />
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="p-2 text-neutral-400 hover:text-red-500 transition-colors mb-0.5"
                      >
                        <Trash size={18} />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => append({ id: Date.now().toString(), color: '', size: '', quantity: '' })}
                  className="inline-flex items-center gap-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors"
                >
                  <Add size={18} />
                  Add Variant
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <FormInput
                label="Base Price"
                placeholder="0 EGP"
                error={errors.basePrice}
                {...register('basePrice')}
              />
              <FormInput
                label="Discount Percentage"
                placeholder="0%"
                error={errors.discountPercentage}
                {...register('discountPercentage')}
              />
              <FormSelect
                label="Vendor"
                options={vendorOptions}
                placeholder="Select vendor"
                error={errors.vendor}
                {...register('vendor')}
              />
              <FormSelect
                label="Gender"
                options={genderOptions}
                placeholder="Select gender"
                error={errors.gender}
                {...register('gender')}
              />
              <FormSelect
                label="Category"
                options={categoryOptions}
                placeholder="Select category"
                error={errors.category}
                {...register('category')}
              />
              <FormSelect
                label="Sub category"
                options={subCategoryOptions}
                placeholder="Select sub category"
                error={errors.subCategory}
                {...register('subCategory')}
              />
              <FormSelect
                label="Product List"
                options={productListOptions}
                placeholder="Select product list"
                error={errors.productList}
                {...register('productList')}
              />
              <FormSelect
                label="Type"
                options={typeOptions}
                placeholder="Select type"
                error={errors.type}
                {...register('type')}
              />

              <ImageUpload
                label="Size chart"
                value={sizeChartImages}
                onChange={setSizeChartImages}
                maxImages={1}
                single
              />
            </div>
          </div>
        </div>
      </form>
  )
}

