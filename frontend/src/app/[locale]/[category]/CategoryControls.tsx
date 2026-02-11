'use client'

import { useRouter } from 'next/navigation'
import { ArrowDown2, HamburgerMenu } from 'iconsax-reactjs'
import { useUIStore } from '@/store'
import FilterDrawer from './FilterDrawer'
import SortDrawer from './SortDrawer'
import type { Category } from '@/types/category'
import { SORT_OPTIONS } from '@/data/products'

interface CategoryControlsProps {
  categoryData: Category
  locale: string
  activeFilters?: string
  activeSortBy?: string
  categorySlug: string
  productCount: number
}

export function CategoryMobileControls({
  categoryData,
  locale,
  activeFilters,
  activeSortBy = 'featured',
  categorySlug,
}: CategoryControlsProps) {
  const router = useRouter()
  const { openFilterDrawer, openSortDrawer } = useUIStore()

  const sortLabel =
    SORT_OPTIONS.find((o) => o.key === activeSortBy)?.label || 'Featured'

  const handleSortChange = (newSortBy: string) => {
    const params = new URLSearchParams()
    if (activeFilters) params.append('filters', activeFilters)
    if (newSortBy !== 'featured') params.append('sortBy', newSortBy)

    const url = params.toString()
      ? `/${categorySlug}?${params.toString()}`
      : `/${categorySlug}`
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

        <button className="p-1" type="button">
          <HamburgerMenu size={20} />
        </button>
      </div>

      {/* Mobile Drawers */}
      <FilterDrawer
        categoryData={categoryData}
        locale={locale}
        categorySlug={categorySlug}
        activeFilters={activeFilters}
      />
      <SortDrawer sortBy={activeSortBy} onSortChange={handleSortChange} />
    </>
  )
}

export function CategorySortBar({
  activeSortBy = 'featured',
  productCount,
}: CategoryControlsProps) {
  const { openSortDrawer } = useUIStore()
  const sortLabel =
    SORT_OPTIONS.find((o) => o.key === activeSortBy)?.label || 'Featured'

  return (
    <div className="hidden lg:flex items-center justify-between mb-6">
      <button
        onClick={openSortDrawer}
        className="flex items-center gap-2 font-roboto font-bold text-sm uppercase"
      >
        SORT: {sortLabel.toUpperCase()}
        <ArrowDown2 size={16} />
      </button>

      <span className="text-sm text-text-body">{productCount} Products</span>
    </div>
  )
}
