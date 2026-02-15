'use client'

import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { Add, Category2 } from 'iconsax-reactjs'
import { FormPageHeader } from '@/components/admin/forms'
import { categorySchema, CategoryFormData } from '@/lib/schemas/admin'
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
  isEnglish,
}: {
  subCategoryIndex: number
  control: any
  register: any
  isEnglish: boolean
}) {
  const { fields, append } = useFieldArray({
    control,
    name: `subCategories.${subCategoryIndex}.productLists`,
  })

  return (
    <div dir={isEnglish ? 'ltr' : 'rtl'} className="grid grid-cols-4 gap-4">
      {fields.map((field, index) => (
        <div key={`${field.id}-${isEnglish ? 'en' : 'ar'}`}>
          <label
            className={`block font-rubik text-lg font-medium text-neutral-500 mb-1 ${!isEnglish ? 'text-right' : ''}`}
          >
            {isEnglish ? `Product list ${index + 1}` : `قائمة منتجات ${index + 1}`}
          </label>
          <input
            key={`${field.id}-${isEnglish ? 'en' : 'ar'}-input`}
            type="text"
            dir={isEnglish ? 'ltr' : 'rtl'}
            className={`w-full h-9 px-3 rounded-lg border border-neutral-200 bg-white text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-200 ${!isEnglish ? 'text-right' : ''}`}
            placeholder={isEnglish ? `Product list ${index + 1}` : `قائمة منتجات ${index + 1}`}
            {...register(
              `subCategories.${subCategoryIndex}.productLists.${index}.${isEnglish ? 'valueEn' : 'valueAr'}`
            )}
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
          {isEnglish ? 'Add' : 'إضافة'}
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
  const [saveWarning, setSaveWarning] = useState<{
    isOpen: boolean
    editedLanguage: 'English' | 'Arabic'
    data: CategoryFormData | null
  }>({
    isOpen: false,
    editedLanguage: 'English',
    data: null,
  })

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
    formState: { errors, dirtyFields },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      nameEn: '',
      nameAr: '',
      subCategories: [],
    },
  })

  const { fields: subCategoryFields, append: appendSubCategory } = useFieldArray({
    control,
    name: 'subCategories',
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

  const hasDirtyForLanguage = (value: unknown, suffix: 'En' | 'Ar'): boolean => {
    if (!value || typeof value !== 'object') return false

    if (Array.isArray(value)) {
      return value.some((item) => hasDirtyForLanguage(item, suffix))
    }

    return Object.entries(value as Record<string, unknown>).some(([key, nested]) => {
      if (key.endsWith(suffix) && typeof nested === 'boolean') {
        return nested
      }
      return hasDirtyForLanguage(nested, suffix)
    })
  }

  const executeSave = async (data: CategoryFormData) => {
    if (!category) return
    setSaving(true)

    try {
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
            data: { nameEn: subCategory.nameEn, nameAr: subCategory.nameAr },
          })
          subCategoryId = created.id
        } else {
          await updateSubCategory({
            id: subCategoryId,
            data: { nameEn: subCategory.nameEn, nameAr: subCategory.nameAr },
          })
        }

        for (const productList of subCategory.productLists ?? []) {
          const isNewList =
            !existingProductListIds.has(productList.id) || productList.id.startsWith('temp-')

          if (isNewList) {
            await createProductList({
              subCategoryId,
              data: { nameEn: productList.valueEn, nameAr: productList.valueAr },
            })
          } else {
            await updateProductList({
              id: productList.id,
              data: { nameEn: productList.valueEn, nameAr: productList.valueAr },
            })
          }
        }
      }
    } finally {
      setSaving(false)
    }
  }

  const onSubmit = async (data: CategoryFormData) => {
    if (!category) return

    const hasEnglishChanges = hasDirtyForLanguage(dirtyFields, 'En')
    const hasArabicChanges = hasDirtyForLanguage(dirtyFields, 'Ar')

    if (hasEnglishChanges !== hasArabicChanges) {
      setSaveWarning({
        isOpen: true,
        editedLanguage: hasEnglishChanges ? 'English' : 'Arabic',
        data,
      })
      return
    }

    await executeSave(data)
  }

  const handleProceedSave = async () => {
    if (!saveWarning.data) {
      setSaveWarning((prev) => ({ ...prev, isOpen: false }))
      return
    }

    const pendingData = saveWarning.data
    setSaveWarning({ isOpen: false, editedLanguage: 'English', data: null })
    await executeSave(pendingData)
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
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        <FormPageHeader
          title="Edit Category"
          backHref="/admin/categories"
          isSubmitting={saving}
        />

        <div className="bg-white rounded-lg p-6">
        <div className={`flex items-center justify-between gap-4 mb-6 ${!isEnglish ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-2 text-sm text-neutral-600 ${!isEnglish ? 'justify-end' : ''}`}>
            {isEnglish ? (
              <>
                <Image src="/flags/en.svg" alt="English" width={20} height={20} className="rounded-sm" />
                <span>English</span>
              </>
            ) : (
              <>
                <span>عربي</span>
                <Image src="/flags/ar.svg" alt="Arabic" width={20} height={20} className="rounded-sm" />
              </>
            )}
          </div>

          <div className="inline-flex h-10 rounded-lg border border-neutral-200 overflow-hidden">
            <button
              type="button"
              onClick={() => setCurrentLang('en')}
              className={`px-4 text-sm font-medium transition-colors ${
                isEnglish ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setCurrentLang('ar')}
              className={`px-4 text-sm font-medium transition-colors ${
                !isEnglish ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              العربية
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className={`block text-sm font-medium text-neutral-900 mb-1.5 ${!isEnglish ? 'text-right' : ''}`}>
            {isEnglish ? 'Name' : 'اسم الفئة'}
          </label>
          <div className="relative">
            <Category2
              size={18}
              className={`absolute ${isEnglish ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-neutral-400`}
            />
            <input
              key={`category-name-${isEnglish ? 'en' : 'ar'}`}
              type="text"
              dir={isEnglish ? 'ltr' : 'rtl'}
              className={`w-full h-10 ${isEnglish ? 'pl-10 pr-3' : 'pr-10 pl-3 text-right'} rounded-lg border border-neutral-200 bg-white text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-200`}
              placeholder={isEnglish ? 'Enter category name' : 'ادخل اسم الفئة'}
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
              <h3 className={`font-rubik text-2xl font-bold text-red-600 mb-3 ${!isEnglish ? 'text-right' : ''}`}>
                {isEnglish ? `Sub category ${subIndex + 1}` : `الفئة الفرعية ${subIndex + 1}`}
              </h3>

              <div className="relative mb-4">
                <Category2
                  size={18}
                  className={`absolute ${isEnglish ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-neutral-400`}
                />
                <input
                  key={`${subCat.id}-${isEnglish ? 'en' : 'ar'}-name`}
                  type="text"
                  dir={isEnglish ? 'ltr' : 'rtl'}
                  className={`w-full h-10 ${isEnglish ? 'pl-10 pr-3' : 'pr-10 pl-3 text-right'} rounded-lg border border-neutral-200 bg-white text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-200`}
                  placeholder={isEnglish ? `Sub category ${subIndex + 1}` : `الفئة الفرعية ${subIndex + 1}`}
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
            onClick={() =>
              appendSubCategory({
                id: `temp-${Date.now()}`,
                nameEn: '',
                nameAr: '',
                productLists: [{ id: `temp-${Date.now()}-1`, valueEn: '', valueAr: '' }],
              })
            }
            className="inline-flex items-center gap-2 px-4 h-10 border border-neutral-200 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            <Add size={18} />
            {isEnglish ? 'Add Subcategory' : 'إضافة فئة فرعية'}
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

      {saveWarning.isOpen && (
        <div className="fixed inset-0 z-(--z-modal) flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSaveWarning((prev) => ({ ...prev, isOpen: false, data: null }))}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-neutral-900">Proceed with Partial Language Update?</h3>
            <p className="mt-2 text-sm text-neutral-600">
              You edited only <span className="font-medium text-neutral-800">{saveWarning.editedLanguage}</span>{' '}
              fields. This may leave the other language outdated.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSaveWarning({ isOpen: false, editedLanguage: 'English', data: null })}
                className="px-4 h-10 rounded-lg border border-neutral-200 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleProceedSave}
                className="px-4 h-10 rounded-lg bg-neutral-900 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
              >
                Proceed Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
