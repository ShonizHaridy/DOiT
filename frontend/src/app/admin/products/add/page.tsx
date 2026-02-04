'use client'

import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import AdminLayout from '@/components/admin/AdminLayout'
import { FormInput, FormTextarea, FormSelect, ImageUpload, FormPageHeader, UploadedImage } from '@/components/admin/forms'
import { productSchema, ProductFormData } from '@/lib/schemas/admin'
import { Add, Trash } from 'iconsax-reactjs'
import { useState } from 'react'

const statusOptions = [
  { value: 'published', label: 'Published' },
  { value: 'unpublished', label: 'Unpublished' },
  { value: 'draft', label: 'Draft' }
]

const vendorOptions = [
  { value: 'bounce', label: 'Bounce' },
  { value: 'nike', label: 'Nike' },
  { value: 'adidas', label: 'Adidas' }
]

const genderOptions = [
  { value: 'men', label: 'Men' },
  { value: 'women', label: 'Women' },
  { value: 'unisex', label: 'Unisex' },
  { value: 'kids', label: 'Kids' }
]

const categoryOptions = [
  { value: 'men', label: 'Men' },
  { value: 'women', label: 'Women' },
  { value: 'kids', label: 'Kids' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'sports', label: 'Sports' }
]

const subCategoryOptions = [
  { value: 'footwear', label: 'Footwear' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'accessories', label: 'Accessories' }
]

const productListOptions = [
  { value: 'running', label: 'Running' },
  { value: 'training', label: 'Training' },
  { value: 'lifestyle', label: 'Lifestyle' }
]

const typeOptions = [
  { value: 'running-shoes', label: 'Running Shoes' },
  { value: 'sneakers', label: 'Sneakers' },
  { value: 'boots', label: 'Boots' }
]

const colorOptions = [
  { value: 'black', label: 'Black' },
  { value: 'white', label: 'White' },
  { value: 'grey', label: 'Grey' },
  { value: 'blue', label: 'Blue' },
  { value: 'red', label: 'Red' }
]

const sizeOptions = [
  { value: '40', label: '40' },
  { value: '41', label: '41' },
  { value: '42', label: '42' },
  { value: '43', label: '43' },
  { value: '44', label: '44' },
  { value: '45', label: '45' }
]

export default function AddProductPage() {
  const [mediaImages, setMediaImages] = useState<UploadedImage[]>([])
  const [sizeChartImages, setSizeChartImages] = useState<UploadedImage[]>([])

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
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
      status: 'published',
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants'
  })

  const onSubmit = async (data: ProductFormData) => {
    console.log('Submitting product:', { ...data, mediaImages, sizeChartImages })
    // API call here
  }

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        <FormPageHeader
          title="Add Product"
          backHref="/admin/products"
          isSubmitting={isSubmitting}
        />

        <div className="bg-white rounded-lg p-6">
          {/* Bilingual Content Section */}
          <div className="grid grid-cols-2 gap-8 pb-6 border-b border-neutral-100">
            {/* English Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-neutral-600 mb-4">
                <span className="text-base">🇺🇸</span>
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
                placeholder="• Detail 1&#10;• Detail 2&#10;• Detail 3"
                rows={6}
                error={errors.detailsEn}
                {...register('detailsEn')}
              />
            </div>

            {/* Arabic Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-neutral-600 mb-4 justify-end">
                <span>عربي</span>
                <span className="text-base">🇪🇬</span>
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
                placeholder="• تفصيل 1&#10;• تفصيل 2&#10;• تفصيل 3"
                rows={6}
                dir="rtl"
                textareaClassName="text-right"
                error={errors.detailsAr}
                {...register('detailsAr')}
              />
            </div>
          </div>

          {/* Media and Pricing Section */}
          <div className="grid grid-cols-3 gap-8 py-6">
            {/* Left: Media + SKU/Quantity/Status + Variants */}
            <div className="col-span-2 space-y-6">
              {/* Media Upload */}
              <ImageUpload
                label="Media"
                value={mediaImages}
                onChange={setMediaImages}
                maxImages={5}
              />

              {/* SKU, Quantity, Status */}
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

              {/* Variants */}
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

            {/* Right: Pricing & Categories */}
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

              {/* Size Chart */}
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
    </AdminLayout>
  )
}
