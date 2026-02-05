'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowDown2, CloseCircle } from 'iconsax-reactjs'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/store'
import type { Category } from '@/types/category'
import { getLocalized, type Locale } from '@/lib/i18n-utils'

interface FilterDrawerProps {
  categoryData: Category
  locale: string
  categorySlug: string
  activeFilters?: string
}

export default function FilterDrawer({ 
  categoryData, 
  locale, 
  categorySlug,
  activeFilters 
}: FilterDrawerProps) {
  const router = useRouter()
  const { isFilterDrawerOpen, closeFilterDrawer } = useUIStore()
  const [expandedSubCategory, setExpandedSubCategory] = useState<string | null>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeFilterDrawer()
    }
    if (isFilterDrawerOpen) document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isFilterDrawerOpen, closeFilterDrawer])

  useEffect(() => {
    document.body.style.overflow = isFilterDrawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isFilterDrawerOpen])

  const handleSubCategoryClick = (subCategoryName: string) => {
    const subSlug = subCategoryName.toLowerCase()
    router.push(`/${categorySlug}?filters=${subSlug}`)
    closeFilterDrawer()
  }

  const handleProductListClick = (subCategoryName: string, productListName: string) => {
    const subSlug = subCategoryName.toLowerCase()
    const listSlug = productListName.toLowerCase()
    router.push(`/${categorySlug}?filters=${subSlug}.${listSlug}`)
    closeFilterDrawer()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-modal-backdrop transition-opacity lg:hidden',
          isFilterDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={closeFilterDrawer}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed top-0 start-0 bottom-0 w-[280px] bg-white z-modal transition-transform duration-300 lg:hidden',
          isFilterDrawerOpen ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="font-roboto font-bold text-lg uppercase">Filters</h2>
          <button
            onClick={closeFilterDrawer}
            className="text-text-body hover:text-primary"
            aria-label="Close filters"
          >
            <CloseCircle size={24} />
          </button>
        </div>

        {/* Filter Sections */}
        <div className="flex flex-col overflow-y-auto h-[calc(100%-60px)]">
          {categoryData.subCategories && categoryData.subCategories.map((subCategory) => {
            const subCategoryName = getLocalized(subCategory, 'name', locale as Locale)
            const isExpanded = expandedSubCategory === subCategory.id

            return (
              <div key={subCategory.id} className="border-b border-gray-200">
                <button 
                  onClick={() => {
                    if (subCategory.productLists && subCategory.productLists.length > 0) {
                      setExpandedSubCategory(isExpanded ? null : subCategory.id)
                    } else {
                      handleSubCategoryClick(subCategoryName)
                    }
                  }}
                  className="w-full flex items-center justify-between px-4 py-4 text-start"
                >
                  <span className="font-roboto font-medium text-text-body">
                    {subCategoryName}
                  </span>
                  {subCategory.productLists && subCategory.productLists.length > 0 && (
                    <ArrowDown2 
                      size={18} 
                      className={cn(
                        'text-gray-400 transition-transform',
                        isExpanded && 'rotate-180'
                      )} 
                    />
                  )}
                </button>

                {/* Product Lists */}
                {isExpanded && subCategory.productLists && (
                  <div className="px-4 pb-2 flex flex-col gap-2">
                    {subCategory.productLists.map((productList) => (
                      <button
                        key={productList.id}
                        onClick={() => handleProductListClick(
                          subCategoryName,
                          getLocalized(productList, 'name', locale as Locale)
                        )}
                        className="text-sm text-start py-2 px-2 hover:bg-gray-50 rounded text-text-body"
                      >
                        {getLocalized(productList, 'name', locale as Locale)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}