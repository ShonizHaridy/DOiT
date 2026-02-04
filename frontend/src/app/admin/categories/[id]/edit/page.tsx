'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import AdminLayout from '@/components/admin/AdminLayout'
import { FormInput, FormPageHeader } from '@/components/admin/forms'
import { categorySchema, CategoryFormData } from '@/lib/schemas/admin'
import { Add, Category2 } from 'iconsax-reactjs'

// Sample pre-filled data
const sampleCategoryData: CategoryFormData = {
  nameEn: 'Men',
  nameAr: 'رجالي',
  subCategories: [
    {
      id: '1',
      nameEn: 'footwear',
      nameAr: 'أحذية',
      productLists: [
        { id: '1-1', valueEn: 'Running', valueAr: 'الجري' },
        { id: '1-2', valueEn: 'Training', valueAr: 'التمرين' },
        { id: '1-3', valueEn: 'Lifestyle', valueAr: 'اناقة' },
        { id: '1-4', valueEn: 'Slides & Flip flops', valueAr: 'شباشب بحر' },
        { id: '1-5', valueEn: 'football', valueAr: 'كرة قدم' },
        { id: '1-6', valueEn: 'basketball', valueAr: 'كرة سلة' },
        { id: '1-7', valueEn: 'indoor', valueAr: 'داخلي' },
      ]
    },
    {
      id: '2',
      nameEn: 'accessories',
      nameAr: 'اكسسوارات',
      productLists: [
        { id: '2-1', valueEn: 'bags', valueAr: 'حقائب' },
        { id: '2-2', valueEn: 'bottles', valueAr: 'زجاجات' },
        { id: '2-3', valueEn: 'socks', valueAr: 'جوارب' },
        { id: '2-4', valueEn: 'head wear', valueAr: 'قبعات' },
      ]
    },
    {
      id: '3',
      nameEn: 'clothing',
      nameAr: 'ملابس',
      productLists: [
        { id: '3-1', valueEn: 'jackets', valueAr: 'جاكيتات' },
        { id: '3-2', valueEn: 'pants', valueAr: 'بنطلونات' },
        { id: '3-3', valueEn: 'swimwear', valueAr: 'ملابس سباحة' },
        { id: '3-4', valueEn: 't.shirts', valueAr: 'تيشيرتات' },
        { id: '3-5', valueEn: 'hoodie', valueAr: 'هودي' },
        { id: '3-6', valueEn: 'tights', valueAr: 'تايتس' },
        { id: '3-7', valueEn: 'tracksuit', valueAr: 'بدلة رياضية' },
        { id: '3-8', valueEn: 'tracktop', valueAr: 'جاكيت رياضي' },
        { id: '3-9', valueEn: 'shorts', valueAr: 'شورتات' },
      ]
    },
    {
      id: '4',
      nameEn: 'brands',
      nameAr: 'علامة تجارية',
      productLists: [
        { id: '4-1', valueEn: 'adidas', valueAr: 'اديداس' },
        { id: '4-2', valueEn: 'nike', valueAr: 'نايك' },
        { id: '4-3', valueEn: 'Reebok', valueAr: 'ريبوك' },
        { id: '4-4', valueEn: 'puma', valueAr: 'بوما' },
        { id: '4-5', valueEn: 'body sculpture', valueAr: 'بودي سكلبتر' },
        { id: '4-6', valueEn: 'Wilson', valueAr: 'ويلسون' },
        { id: '4-7', valueEn: 'jan sport', valueAr: 'جان سبورت' },
        { id: '4-8', valueEn: 'liveup', valueAr: 'لايف اب' },
        { id: '4-9', valueEn: 'babolat', valueAr: 'بابولات' },
        { id: '4-10', valueEn: 'technofibre', valueAr: 'تكنوفايبر' },
        { id: '4-11', valueEn: 'asics', valueAr: 'اسيكس' },
      ]
    },
    {
      id: '5',
      nameEn: 'sports',
      nameAr: 'رياضة',
      productLists: [
        { id: '5-1', valueEn: 'football', valueAr: 'كرة قدم' },
        { id: '5-2', valueEn: 'basketball', valueAr: 'كرة سلة' },
        { id: '5-3', valueEn: 'tennis', valueAr: 'تنس' },
        { id: '5-4', valueEn: 'running', valueAr: 'جري' },
        { id: '5-5', valueEn: 'training', valueAr: 'تدريب' },
        { id: '5-6', valueEn: 'squash', valueAr: 'اسكواش' },
        { id: '5-7', valueEn: 'padle', valueAr: 'بادل' },
        { id: '5-8', valueEn: 'swimming', valueAr: 'سباحة' },
        { id: '5-9', valueEn: 'fitness', valueAr: 'فيتنس' },
        { id: '5-10', valueEn: 'motor sport', valueAr: 'رياضة السيارات' },
      ]
    },
  ]
}

// Nested ProductLists component
function ProductListsFields({ 
  subCategoryIndex, 
  control, 
  register, 
  errors,
  isEnglish 
}: { 
  subCategoryIndex: number
  control: any
  register: any
  errors: any
  isEnglish: boolean
}) {
  const { fields, append } = useFieldArray({
    control,
    name: `subCategories.${subCategoryIndex}.productLists`
  })

  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        {fields.map((field, index) => (
          <div key={field.id}>
            <label className={`block text-xs font-medium text-neutral-500 mb-1 ${!isEnglish ? 'text-right' : ''}`}>
              {isEnglish ? `Product list ${index + 1}` : `قائمة منتجات ${index + 1}`}
            </label>
            <input
              type="text"
              dir={isEnglish ? 'ltr' : 'rtl'}
              className={`w-full h-9 px-3 rounded-lg border border-neutral-200 bg-white text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-200 ${!isEnglish ? 'text-right' : ''}`}
              {...register(`subCategories.${subCategoryIndex}.productLists.${index}.${isEnglish ? 'valueEn' : 'valueAr'}`)}
            />
          </div>
        ))}

        {/* Add Product List Button */}
        <div className="flex items-end">
          <button
            type="button"
            onClick={() => append({ id: `${Date.now()}`, valueEn: '', valueAr: '' })}
            className="w-full h-9 flex items-center justify-center gap-1.5 border-2 border-dashed border-neutral-200 rounded-lg text-sm text-neutral-500 hover:border-neutral-300 hover:text-neutral-600 transition-colors"
          >
            <Add size={16} />
            {isEnglish ? 'Add' : 'إضافة'}
          </button>
        </div>
      </div>
    </>
  )
}

export default function EditCategoryPage() {
  const [currentLang, setCurrentLang] = useState<'en' | 'ar'>('en')
  const isEnglish = currentLang === 'en'

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: sampleCategoryData
  })

  const { fields: subCategoryFields, append: appendSubCategory } = useFieldArray({
    control,
    name: 'subCategories'
  })

  const onSubmit = async (data: CategoryFormData) => {
    console.log('Saving category:', data)
    // API call here
  }

  const handleNext = () => setCurrentLang('ar')
  const handlePrevious = () => setCurrentLang('en')

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        <FormPageHeader
          title="Edit Category"
          backHref="/admin/categories"
          isSubmitting={isSubmitting}
        />

        <div className="bg-white rounded-lg p-6">
          {/* Language Indicator */}
          <div className={`flex items-center gap-2 text-sm text-neutral-600 mb-6 ${!isEnglish ? 'justify-end' : ''}`}>
            {isEnglish ? (
              <>
                <span className="text-base">🇺🇸</span>
                <span>English</span>
              </>
            ) : (
              <>
                <span>عربي</span>
                <span className="text-base">🇪🇬</span>
              </>
            )}
          </div>

          {/* Category Name */}
          <div className="mb-6">
            <label className={`block text-sm font-medium text-neutral-900 mb-1.5 ${!isEnglish ? 'text-right' : ''}`}>
              {isEnglish ? 'Name' : 'اسم الفئة'}
            </label>
            <div className="relative">
              <Category2 size={18} className={`absolute ${isEnglish ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-neutral-400`} />
              <input
                type="text"
                dir={isEnglish ? 'ltr' : 'rtl'}
                className={`w-full h-10 ${isEnglish ? 'pl-10 pr-3' : 'pr-10 pl-3 text-right'} rounded-lg border border-neutral-200 bg-white text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-200`}
                {...register(isEnglish ? 'nameEn' : 'nameAr')}
              />
            </div>
            {(isEnglish ? errors.nameEn : errors.nameAr) && (
              <p className="text-xs text-red-500 mt-1">
                {isEnglish ? errors.nameEn?.message : errors.nameAr?.message}
              </p>
            )}
          </div>

          {/* Sub Categories */}
          <div className="space-y-6">
            {subCategoryFields.map((subCat, subIndex) => (
              <div key={subCat.id} className="border border-neutral-200 rounded-lg p-4">
                {/* Sub Category Header */}
                <h3 className={`text-sm font-semibold text-primary mb-3 ${!isEnglish ? 'text-right' : ''}`}>
                  {isEnglish ? `sub category ${subIndex + 1}` : `الفئة الفرعية ${subIndex + 1}`}
                </h3>

                {/* Sub Category Name */}
                <div className="relative mb-4">
                  <Category2 size={18} className={`absolute ${isEnglish ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-neutral-400`} />
                  <input
                    type="text"
                    dir={isEnglish ? 'ltr' : 'rtl'}
                    className={`w-full h-10 ${isEnglish ? 'pl-10 pr-3' : 'pr-10 pl-3 text-right'} rounded-lg border border-neutral-200 bg-neutral-50 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-200`}
                    {...register(`subCategories.${subIndex}.${isEnglish ? 'nameEn' : 'nameAr'}`)}
                  />
                </div>

                {/* Product Lists Grid */}
                <ProductListsFields
                  subCategoryIndex={subIndex}
                  control={control}
                  register={register}
                  errors={errors}
                  isEnglish={isEnglish}
                />
              </div>
            ))}
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-neutral-100">
            {/* Add Subcategory */}
            <button
              type="button"
              onClick={() => appendSubCategory({
                id: Date.now().toString(),
                nameEn: '',
                nameAr: '',
                productLists: [{ id: `${Date.now()}-1`, valueEn: '', valueAr: '' }]
              })}
              className="inline-flex items-center gap-2 px-4 h-10 border border-neutral-200 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              <Add size={18} />
              Add Subcategory
            </button>

            {/* Navigation */}
            {isEnglish ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 h-10 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePrevious}
                className="px-6 h-10 border border-neutral-200 text-neutral-700 text-sm font-medium rounded-lg hover:bg-neutral-50 transition-colors"
              >
                Previous
              </button>
            )}
          </div>
        </div>
      </form>
    </AdminLayout>
  )
}
