'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowDown2, CloseCircle, HamburgerMenu } from 'iconsax-reactjs'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/store'
import CategoryProductCard from '@/components/products/CategoryProductCard'
import FilterDrawer from './FilterDrawer'
import SortDrawer from './SortDrawer'
import type { Product } from '@/types/product'
import type { Category } from '@/types/category'
import { SORT_OPTIONS } from '@/data/products'
import { getLocalized, type Locale } from '@/lib/i18n-utils'

interface CategoryContentProps {
  products: Product[]
  locale: string
  categoryData: Category
  activeFilters?: string
  activeSortBy?: string
  categorySlug: string
}

export default function CategoryContent({ 
  products, 
  locale, 
  categoryData,
  activeFilters,
  activeSortBy = 'featured',
  categorySlug
}: CategoryContentProps) {
  const router = useRouter()
  const { openFilterDrawer, openSortDrawer } = useUIStore()

  const sortLabel = SORT_OPTIONS.find(o => o.key === activeSortBy)?.label || 'Featured'

  // Handle sort change - update URL params
  const handleSortChange = (newSortBy: string) => {
    const params = new URLSearchParams()
    if (activeFilters) params.append('filters', activeFilters)
    if (newSortBy !== 'featured') params.append('sortBy', newSortBy)
    
    const url = params.toString() ? `/${categorySlug}?${params.toString()}` : `/${categorySlug}`
    router.push(url)
  }

  // Parse active filters for display
  const activeFilterParts = useMemo(() => {
    if (!activeFilters || !categoryData.subCategories) return []
    
    const parts = activeFilters.split('.')
    const items: { label: string; value: string }[] = []

    // Find subcategory
    const subCategory = categoryData.subCategories.find(sub => 
      sub.nameEn.toLowerCase() === parts[0]?.toLowerCase() ||
      sub.nameAr.toLowerCase() === parts[0]?.toLowerCase()
    )

    if (subCategory) {
      items.push({
        label: getLocalized(subCategory, 'name', locale as Locale),
        value: parts[0]
      })

      // Find product list if exists
      if (parts[1] && subCategory.productLists) {
        const productList = subCategory.productLists.find(list =>
          list.nameEn.toLowerCase() === parts[1]?.toLowerCase() ||
          list.nameAr.toLowerCase() === parts[1]?.toLowerCase()
        )

        if (productList) {
          items.push({
            label: getLocalized(productList, 'name', locale as Locale),
            value: parts[1]
          })
        }
      }
    }

    return items
  }, [activeFilters, categoryData, locale])

  // Remove specific filter part
  const removeFilter = (index: number) => {
    const parts = activeFilters?.split('.') || []
    parts.splice(index, parts.length - index) // Remove from this index onwards
    
    const params = new URLSearchParams()
    if (parts.length > 0) params.append('filters', parts.join('.'))
    if (activeSortBy !== 'featured') params.append('sortBy', activeSortBy)
    
    const url = params.toString() ? `/${categorySlug}?${params.toString()}` : `/${categorySlug}`
    router.push(url)
  }

  // Clear all filters
  const clearAllFilters = () => {
    const params = new URLSearchParams()
    if (activeSortBy !== 'featured') params.append('sortBy', activeSortBy)
    
    const url = params.toString() ? `/${categorySlug}?${params.toString()}` : `/${categorySlug}`
    router.push(url)
  }

  return (
    <>
      {/* Mobile: Filter & Sort Bar */}
      <div className="lg:hidden flex items-center justify-between mb-4">
        <button
          onClick={openFilterDrawer}
          className="flex items-center gap-1 font-roboto font-bold text-sm uppercase"
        >
          FILTER
          <ArrowDown2 size={16} />
        </button>

        <button
          onClick={openSortDrawer}
          className="flex items-center gap-1 font-roboto font-bold text-sm uppercase"
        >
          {sortLabel.toUpperCase()}
          <ArrowDown2 size={16} />
        </button>

        <button className="p-1">
          <HamburgerMenu size={20} />
        </button>
      </div>

      {/* Active Filters - Mobile & Desktop */}
      {activeFilterParts.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap mb-4 lg:mb-6">
          <span className="text-sm font-medium text-text-body">Active Filters:</span>
          {activeFilterParts.map((filter, index) => (
            <button
              key={index}
              onClick={() => removeFilter(index)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              <span className="text-gray-700 text-sm font-medium">{filter.label}</span>
              <CloseCircle size={16} color="#666" variant="Bold" />
            </button>
          ))}
          <button
            onClick={clearAllFilters}
            className="text-sm font-medium text-secondary underline hover:no-underline"
          >
            Clear All
          </button>
        </div>
      )}

      <div className="flex gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block w-48 shrink-0">
          <h2 className="font-roboto font-bold text-lg mb-6 uppercase">Filters</h2>
          
          {categoryData.subCategories && categoryData.subCategories.length > 0 && (
            <div className="flex flex-col border-t border-gray-200">
              {categoryData.subCategories.map((subCategory) => (
                <div key={subCategory.id} className="border-b border-gray-200">
                  <button
                    onClick={() => {
                      const subSlug = getLocalized(subCategory, 'name', locale as Locale).toLowerCase()
                      router.push(`/${categorySlug}?filters=${subSlug}`)
                    }}
                    className="w-full flex items-center justify-between py-4 text-start hover:text-secondary transition-colors"
                  >
                    <span className="font-roboto font-medium text-text-body">
                      {getLocalized(subCategory, 'name', locale as Locale)}
                    </span>
                    <ArrowDown2 size={18} className="text-gray-400" />
                  </button>
                  
                  {/* Show product lists if this subcategory is active */}
                  {activeFilters?.startsWith(getLocalized(subCategory, 'name', locale as Locale).toLowerCase()) && 
                   subCategory.productLists && subCategory.productLists.length > 0 && (
                    <div className="pl-4 pb-2 flex flex-col gap-2">
                      {subCategory.productLists.map((productList) => (
                        <button
                          key={productList.id}
                          onClick={() => {
                            const subSlug = getLocalized(subCategory, 'name', locale as Locale).toLowerCase()
                            const listSlug = getLocalized(productList, 'name', locale as Locale).toLowerCase()
                            router.push(`/${categorySlug}?filters=${subSlug}.${listSlug}`)
                          }}
                          className={cn(
                            "text-sm text-start py-1 hover:text-secondary transition-colors",
                            activeFilters === `${getLocalized(subCategory, 'name', locale as Locale).toLowerCase()}.${getLocalized(productList, 'name', locale as Locale).toLowerCase()}` 
                              ? "text-secondary font-medium" 
                              : "text-text-body"
                          )}
                        >
                          {getLocalized(productList, 'name', locale as Locale)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Desktop: Sort Bar */}
          <div className="hidden lg:flex items-center justify-between mb-6">
            <button
              onClick={openSortDrawer}
              className="flex items-center gap-2 font-roboto font-bold text-sm uppercase"
            >
              SORT: {sortLabel.toUpperCase()}
              <ArrowDown2 size={16} />
            </button>

            <span className="text-sm text-text-body">
              {products.length} Products
            </span>
          </div>

          {/* Product Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-5">
              {products.map((product) => (
                <CategoryProductCard
                  key={product.id}
                  product={product}
                  locale={locale}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-text-body">No products found</p>
              {activeFilterParts.length > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="mt-4 text-secondary underline hover:no-underline"
                >
                  Clear filters and show all products
                </button>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Drawers */}
      <FilterDrawer 
        categoryData={categoryData}
        locale={locale}
        categorySlug={categorySlug}
        activeFilters={activeFilters}
      />
      <SortDrawer 
        sortBy={activeSortBy} 
        onSortChange={handleSortChange} 
      />
    </>
  )
}