'use client'

import { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams } from 'next/navigation'
import { FormPageHeader } from '@/components/admin/forms'
import { categorySchema, CategoryFormData } from '@/lib/schemas/admin'
import { Add, Category2 } from 'iconsax-reactjs'
import {
  useAdminCategory,
  useUpdateCategory,
  useCreateSubCategory,
  useUpdateSubCategory,
  useCreateProductList,
  useUpdateProductList,
} from '@/hooks/useCategories'

function ProductListsFields({
  subCategoryIndex,
  control,
  register,
  isEnglish
}: {
  subCategoryIndex: number
  control: any
  register: any
  isEnglish: boolean
}) {
  const { fields, append } = useFieldArray({
    control,
    name: `subCategories.${subCategoryIndex}.productLists`
  })

  return (
    <div className="grid grid-cols-4 gap-4">
      {fields.map((field, index) => (
        <div key={field.id}>
          <label className={`block text-xs font-medium text-neutral-500 mb-1 ${!isEnglish ? 'text-right' : ''}`}>
            {isEnglish ? `Product list ${index + 1}` : `Product list ${index + 1}`}
          </label>
          <input
            type="text"
            dir={isEnglish ? 'ltr' : 'rtl'}
            className={`w-full h-9 px-3 rounded-lg border border-neutral-200 bg-white text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-200 ${!isEnglish ? 'text-right' : ''}`}
            {...register(`subCategories.${subCategoryIndex}.productLists.${index}.${isEnglish ? 'valueEn' : 'valueAr'}`)}
          />
        </div>
      ))}

      <div className="flex items-end">
        <button
          type="button"
          onClick={() => append({ id: `temp-${Date.now()}`, valueEn: '', valueAr: '' })}
          className="w-full h-9 flex items-center justify-center gap-1.5 border-2 border-dashed border-neutral-200 rounded-lg text-sm text-neutral-500 hover:border-neutral-300 hover:text-neutral-600 transition-colors"
        >
          <Add size={16} />
          {isEnglish ? 'Add' : 'Add'}
        </button>
      </div>
    </div>
  )
}

export default function EditCategoryPage() {
  const params = useParams()
  const categoryId = params?.id as string
  const [currentLang, setCurrentLang] = useState<'en' | 'ar'>('en')
  const isEnglish = currentLang === 'en'
  const [saving, setSaving] = useState(false)

  const { data: category, isLoading } = useAdminCategory(categoryId)
  const { mutateAsync: updateCategory } = useUpdateCategory()
  const { mutateAsync: createSubCategory } = useCreateSubCategory()
  const { mutateAsync: updateSubCategory } = useUpdateSubCategory()
  const { mutateAsync: createProductList } = useCreateProductList()
  const { mutateAsync: updateProductList } = useUpdateProductList()

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      nameEn: '',
      nameAr: '',
      subCategories: [],
    }
  })

  const { fields: subCategoryFields, append: appendSubCategory } = useFieldArray({
    control,
    name: 'subCategories'
  })

  useEffect(() => {
    if (!category) return
    reset({
      nameEn: category.nameEn,
      nameAr: category.nameAr,
      subCategories: (category.subCategories ?? []).map((sub) => ({
        id: sub.id,
        nameEn: sub.nameEn,
        nameAr: sub.nameAr,
        productLists: (sub.productLists ?? []).map((list) => ({
          id: list.id,
          valueEn: list.nameEn,
          valueAr: list.nameAr,
        })),
      })),
    })
  }, [category, reset])

  const onSubmit = async (data: CategoryFormData) => {
    if (!category) return
    setSaving(true)

    await updateCategory({ id: category.id, data: { nameEn: data.nameEn, nameAr: data.nameAr } })

    const existingSubIds = new Set((category.subCategories ?? []).map((sub) => sub.id))
    const existingProductListIds = new Set(
      (category.subCategories ?? [])
        .flatMap((sub) => sub.productLists ?? [])
        .map((list) => list.id)
    )

    for (const subCategory of data.subCategories) {
      const isNewSub = !existingSubIds.has(subCategory.id) || subCategory.id.startsWith('temp-')
      let subCategoryId = subCategory.id

      if (isNewSub) {
        const created = await createSubCategory({
          categoryId: category.id,
          data: { nameEn: subCategory.nameEn, nameAr: subCategory.nameAr }
        })
        subCategoryId = created.id
      } else {
        await updateSubCategory({
          id: subCategoryId,
          data: { nameEn: subCategory.nameEn, nameAr: subCategory.nameAr }
        })
      }

      for (const productList of subCategory.productLists) {
        const isNewList = !existingProductListIds.has(productList.id) || productList.id.startsWith('temp-')
        if (isNewList) {
          await createProductList({
            subCategoryId: subCategoryId,
            data: { nameEn: productList.valueEn, nameAr: productList.valueAr }
          })
        } else {
          await updateProductList({
            id: productList.id,
            data: { nameEn: productList.valueEn, nameAr: productList.valueAr }
          })
        }
      }
    }

    setSaving(false)
  }

  if (isLoading || !category) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg p-6 text-sm text-neutral-500">
          Loading category...
        </div>
      </div>
    )
  }

  const handleNext = () => setCurrentLang('ar')
  const handlePrevious = () => setCurrentLang('en')

  return (
      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        <FormPageHeader
          title="Edit Category"
          backHref="/admin/categories"
          isSubmitting={saving}
        />

        <div className="bg-white rounded-lg p-6">
          <div className={`flex items-center gap-2 text-sm text-neutral-600 mb-6 ${!isEnglish ? 'justify-end' : ''}`}>
            {isEnglish ? (
              <>
                <span className="text-base">EN</span>
                <span>English</span>
              </>
            ) : (
              <>
                <span>AR</span>
                <span className="text-base">Arabic</span>
              </>
            )}
          </div>

          <div className="mb-6">
            <label className={`block text-sm font-medium text-neutral-900 mb-1.5 ${!isEnglish ? 'text-right' : ''}`}>
              {isEnglish ? 'Name' : 'Name'}
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

          <div className="space-y-6">
            {subCategoryFields.map((subCat, subIndex) => (
              <div key={subCat.id} className="border border-neutral-200 rounded-lg p-4">
                <h3 className={`text-sm font-semibold text-primary mb-3 ${!isEnglish ? 'text-right' : ''}`}>
                  {isEnglish ? `Sub category ${subIndex + 1}` : `Sub category ${subIndex + 1}`}
                </h3>

                <div className="relative mb-4">
                  <Category2 size={18} className={`absolute ${isEnglish ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-neutral-400`} />
                  <input
                    type="text"
                    dir={isEnglish ? 'ltr' : 'rtl'}
                    className={`w-full h-10 ${isEnglish ? 'pl-10 pr-3' : 'pr-10 pl-3 text-right'} rounded-lg border border-neutral-200 bg-neutral-50 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-200`}
                    {...register(`subCategories.${subIndex}.${isEnglish ? 'nameEn' : 'nameAr'}`)}
                  />
                </div>

                <ProductListsFields
                  subCategoryIndex={subIndex}
                  control={control}
                  register={register}
                  isEnglish={isEnglish}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-6 pt-6 border-t border-neutral-100">
            <button
              type="button"
              onClick={() => appendSubCategory({
                id: `temp-${Date.now()}`,
                nameEn: '',
                nameAr: '',
                productLists: [{ id: `temp-${Date.now()}-1`, valueEn: '', valueAr: '' }]
              })}
              className="inline-flex items-center gap-2 px-4 h-10 border border-neutral-200 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              <Add size={18} />
              Add Subcategory
            </button>

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
  )
}
