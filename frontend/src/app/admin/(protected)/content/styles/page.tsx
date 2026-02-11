'use client'

import { useState } from 'react'
import { FormInput, FormSelect, FormPageHeader, ImageUpload, UploadedImage } from '@/components/admin/forms'
import { Add } from 'iconsax-reactjs'

interface StyleCategory {
  id: string
  titleEn: string
  titleAr: string
  category: string
  subCategory: string
  image: UploadedImage[]
}

const categoryOptions = [
  { value: 'men', label: 'Men' },
  { value: 'women', label: 'Women' },
  { value: 'kids', label: 'Kids' },
  { value: 'sport', label: 'Sport' },
  { value: 'accessories', label: 'Accessories' },
]

const subCategoryOptions: Record<string, { value: string; label: string }[]> = {
  men: [
    { value: 'clothing', label: 'clothing' },
    { value: 'footwear', label: 'footwear' },
    { value: 'accessories', label: 'accessories' },
    { value: 'running_shoes', label: 'Running Shoes' },
  ],
  sport: [
    { value: 'footwear', label: 'footwear' },
    { value: 'training', label: 'training' },
  ],
  women: [
    { value: 'clothing', label: 'clothing' },
    { value: 'footwear', label: 'footwear' },
  ],
  kids: [
    { value: 'clothing', label: 'clothing' },
    { value: 'footwear', label: 'footwear' },
  ],
  accessories: [
    { value: 'bags', label: 'bags' },
    { value: 'bottles', label: 'bottles' },
  ],
}

// Sample pre-filled data
const initialCategories: StyleCategory[] = [
  { id: '1', titleEn: 'Lifestyle', titleAr: 'أناقة', category: 'men', subCategory: 'clothing', image: [] },
  { id: '2', titleEn: 'Training', titleAr: 'تمرين', category: 'sport', subCategory: 'footwear', image: [] },
  { id: '3', titleEn: 'Running', titleAr: 'الجري', category: 'men', subCategory: 'running_shoes', image: [] },
]

export default function EditStyleSectionPage() {
  const [categories, setCategories] = useState<StyleCategory[]>(initialCategories)

  const updateCategory = (index: number, field: keyof StyleCategory, value: string | UploadedImage[]) => {
    const updated = [...categories]
    updated[index] = { ...updated[index], [field]: value }
    // Reset subcategory when category changes
    if (field === 'category') {
      updated[index].subCategory = ''
    }
    setCategories(updated)
  }

  const addCategory = () => {
    setCategories([
      ...categories,
      {
        id: Date.now().toString(),
        titleEn: '',
        titleAr: '',
        category: '',
        subCategory: '',
        image: [],
      },
    ])
  }

  const removeCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    console.log('Save style section:', categories)
  }

  return (
    <div className="p-6">
      <FormPageHeader
        title="Edit Style Section"
        backHref="/admin/content"
        onSave={handleSave}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat, index) => (
          <div key={cat.id} className="bg-white rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-primary">category {index + 1}</h3>
              {categories.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCategory(index)}
                  className="text-xs text-neutral-400 hover:text-red-500 transition-colors"
                >
                  Remove
                </button>
              )}
            </div>

            {/* Bilingual Title Row */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-medium text-neutral-500 mb-1 block">Title:</label>
                <input
                  type="text"
                  value={cat.titleEn}
                  onChange={(e) => updateCategory(index, 'titleEn', e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-neutral-200 bg-white text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                  placeholder="English title"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-500 mb-1 block text-right">العنوان</label>
                <input
                  type="text"
                  dir="rtl"
                  value={cat.titleAr}
                  onChange={(e) => updateCategory(index, 'titleAr', e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-neutral-200 bg-white text-sm text-neutral-900 text-right focus:outline-none focus:ring-2 focus:ring-neutral-200"
                  placeholder="عنوان عربي"
                />
              </div>
            </div>

            {/* Category */}
            <div className="mb-3">
              <label className="text-sm font-medium text-neutral-900 mb-1.5 block">Category</label>
              <select
                value={cat.category}
                onChange={(e) => updateCategory(index, 'category', e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-neutral-200 bg-white text-sm text-neutral-900 appearance-none focus:outline-none focus:ring-2 focus:ring-neutral-200 cursor-pointer"
              >
                <option value="">Select category</option>
                {categoryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Sub Category */}
            <div className="mb-4">
              <label className="text-sm font-medium text-neutral-900 mb-1.5 block">Sub category</label>
              <select
                value={cat.subCategory}
                onChange={(e) => updateCategory(index, 'subCategory', e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-neutral-200 bg-white text-sm text-neutral-900 appearance-none focus:outline-none focus:ring-2 focus:ring-neutral-200 cursor-pointer"
                disabled={!cat.category}
              >
                <option value="">Select sub category</option>
                {(subCategoryOptions[cat.category] || []).map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Image */}
            <ImageUpload
              value={cat.image}
              onChange={(imgs) => updateCategory(index, 'image', imgs)}
              maxImages={1}
              single
              maxSizeMB={50}
              allowedTypes={['png', 'jpg']}
            />
          </div>
        ))}

        {/* Add New Category Card */}
        <button
          type="button"
          onClick={addCategory}
          className="bg-white rounded-lg border-2 border-dashed border-neutral-200 p-6 flex items-center justify-center gap-2 text-sm text-neutral-500 hover:border-neutral-300 hover:text-neutral-600 transition-colors min-h-[200px]"
        >
          <Add size={20} />
          Add
        </button>
      </div>
    </div>
  )
}
