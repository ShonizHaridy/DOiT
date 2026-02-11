'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormInput, FormTextarea, FormSelect, ImageUpload, FormPageHeader, UploadedImage } from '@/components/admin/forms'
import { productSchema, ProductFormData } from '@/lib/schemas/admin'
import { Add, Trash } from 'iconsax-reactjs'
import { useAdminProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useProducts'
import { useCategories, useFilterOptions } from '@/hooks/useCategories'
import { uploadProductImage, uploadProductImages } from '@/services/upload'

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

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params?.id as string

  const { data: product, isLoading } = useAdminProduct(productId)
  const { mutateAsync: updateProduct, isPending } = useUpdateProduct()
  const { mutateAsync: deleteProduct } = useDeleteProduct()
  const { data: categories } = useCategories(true)
  const { data: filterOptions } = useFilterOptions()

  const [mediaImages, setMediaImages] = useState<UploadedImage[]>([])
  const [sizeChartImages, setSizeChartImages] = useState<UploadedImage[]>([])

  const statusOptions = [
    { value: 'PUBLISHED', label: 'Published' },
    { value: 'UNPUBLISHED', label: 'Unpublished' },
    { value: 'DRAFT', label: 'Draft' },
  ]

  const vendorOptions = (filterOptions?.brands ?? []).map((brand) => ({ value: brand, label: brand }))
  const genderOptions = (filterOptions?.genders ?? []).map((gender) => ({ value: gender, label: gender }))
  const typeOptions = (filterOptions?.types ?? []).map((type) => ({ value: type, label: type }))
  const colorOptions = (filterOptions?.colors ?? []).map((color) => ({ value: color, label: color }))
  const sizeOptions = (filterOptions?.sizes ?? []).map((size) => ({ value: size, label: size }))

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
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
    if (!product) return

    const categoryMatch = categories?.find((category) =>
      category.subCategories?.some((sub) =>
        sub.productLists?.some((list) => list.id === product.productListId)
      )
    )

    const subCategoryMatch = categoryMatch?.subCategories?.find((sub) =>
      sub.productLists?.some((list) => list.id === product.productListId)
    )

    reset({
      nameEn: product.nameEn,
      descriptionEn: product.descriptionEn ?? '',
      detailsEn: (product.detailsEn ?? []).join('\n'),
      nameAr: product.nameAr,
      descriptionAr: product.descriptionAr ?? '',
      detailsAr: (product.detailsAr ?? []).join('\n'),
      sku: product.sku,
      quantity: product.totalStock?.toString() ?? '',
      status: product.status as 'PUBLISHED' | 'UNPUBLISHED' | 'DRAFT',
      basePrice: product.basePrice.toString(),
      discountPercentage: product.discountPercentage?.toString() ?? '',
      vendor: product.vendor,
      gender: product.gender,
      category: categoryMatch?.id ?? '',
      subCategory: subCategoryMatch?.id ?? '',
      productList: product.productListId ?? '',
      type: product.type,
      variants: (product.variants ?? []).map((variant) => ({
        id: variant.id ?? `${variant.color}-${variant.size}`,
        color: variant.color,
        size: variant.size,
        quantity: variant.quantity.toString(),
      })),
    })

    setMediaImages(
      (product.images ?? []).map((image) => ({
        id: image.id,
        url: image.url,
        name: image.url.split('/').pop() ?? 'image',
      }))
    )

    if (product.sizeChartUrl) {
      setSizeChartImages([
        {
          id: 'size-chart',
          url: product.sizeChartUrl,
          name: product.sizeChartUrl.split('/').pop() ?? 'size-chart',
        },
      ])
    }
  }, [product, categories, reset])

  const onSubmit = async (data: ProductFormData) => {
    if (!product) return

    const newMediaFiles = mediaImages.filter((img) => img.file).map((img) => img.file!)
    const newMediaUrls = newMediaFiles.length ? await uploadProductImages(newMediaFiles) : []
    const existingMediaUrls = mediaImages.filter((img) => !img.file).map((img) => img.url)
    const allMediaUrls = [...existingMediaUrls, ...newMediaUrls]

    let sizeChartUrl = sizeChartImages[0]?.url
    if (sizeChartImages[0]?.file) {
      sizeChartUrl = await uploadProductImage(sizeChartImages[0].file)
    }

    await updateProduct({
      id: product.id,
      data: {
        nameEn: data.nameEn,
        descriptionEn: data.descriptionEn,
        detailsEn: parseDetails(data.detailsEn),
        nameAr: data.nameAr,
        descriptionAr: data.descriptionAr,
        detailsAr: parseDetails(data.detailsAr),
        basePrice: parseNumber(data.basePrice) ?? product.basePrice,
        discountPercentage: parseNumber(data.discountPercentage),
        vendor: data.vendor,
        gender: data.gender as 'MEN' | 'WOMEN' | 'KIDS' | 'UNISEX',
        type: data.type,
        status: data.status as 'PUBLISHED' | 'UNPUBLISHED' | 'DRAFT',
        productListId: data.productList,
        sizeChartUrl: sizeChartUrl,
        imageUrls: allMediaUrls,
        variants: data.variants.map((variant) => ({
          color: variant.color,
          size: variant.size,
          quantity: parseNumber(variant.quantity) ?? 0,
        })),
      }
    })

    router.push('/admin/products')
  }

  const handleDelete = async () => {
    if (!product) return
    if (confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(product.id)
      router.push('/admin/products')
    }
  }

  if (isLoading || !product) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg p-6 text-sm text-neutral-500">
          Loading product...
        </div>
      </div>
    )
  }

  return (
      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        <FormPageHeader
          title="Edit Product"
          backHref="/admin/products"
          showDelete
          onDelete={handleDelete}
          isSubmitting={isPending}
        />

        <div className="bg-white rounded-lg p-6">
          <div className="grid grid-cols-2 gap-8 pb-6 border-b border-neutral-100">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-neutral-600 mb-4">
                <span className="text-base">EN</span>
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
                <span className="text-base">AR</span>
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
                  {...register('quantity')}
                />
                <FormSelect
                  label="Status"
                  options={statusOptions}
                  error={errors.status}
                  {...register('status')}
                />
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-end gap-4">
                    <span className="text-sm font-medium text-neutral-500 pb-2.5 w-16">
                      Variant {index + 1}:
                    </span>
                    <FormSelect
                      label={index === 0 ? 'Color' : undefined}
                      options={colorOptions}
                      placeholder="Color"
                      className="flex-1"
                      error={errors.variants?.[index]?.color}
                      {...register(`variants.${index}.color`)}
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

