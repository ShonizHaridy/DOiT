'use client'

import { useState, useMemo } from 'react'
import { ArrowDown2, CloseCircle, HamburgerMenu } from 'iconsax-reactjs'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/store'
import CategoryProductCard from '@/components/products/CategoryProductCard'
import FilterDrawer from './FilterDrawer'
import SortDrawer from './SortDrawer'
import type { Product } from '@/data/products'
import { FILTER_OPTIONS, SORT_OPTIONS } from '@/data/products'

interface CategoryContentProps {
  products: Product[]
  locale: string
  category: string
}

const FILTER_SECTIONS = [
  { key: 'availability', label: 'Availability' },
  { key: 'price', label: 'Price' },
  { key: 'productType', label: 'Product Type' },
  { key: 'brand', label: 'Brand' },
  { key: 'size', label: 'Size' },
  { key: 'gender', label: 'Gender' },
  { key: 'color', label: 'Color' },
]

export default function CategoryContent({ products, locale, category }: CategoryContentProps) {
  const { openFilterDrawer, openSortDrawer } = useUIStore()
  
  const [sortBy, setSortBy] = useState('price-low')
  const [activeFilters, setActiveFilters] = useState<string[]>(['white', 'black', 'teal'])
  const [expandedFilters, setExpandedFilters] = useState<string[]>([])

  const sortLabel = SORT_OPTIONS.find(o => o.key === sortBy)?.label || 'Price: Low to High'

  const removeFilter = (filter: string) => {
    setActiveFilters(prev => prev.filter(f => f !== filter))
  }

  const clearAllFilters = () => {
    setActiveFilters([])
  }

  const toggleFilterSection = (key: string) => {
    setExpandedFilters(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    )
  }

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...products]
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price)
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price)
      case 'a-z':
        return sorted.sort((a, b) => a.title.localeCompare(b.title))
      case 'z-a':
        return sorted.sort((a, b) => b.title.localeCompare(a.title))
      default:
        return sorted
    }
  }, [products, sortBy])

  return (
    <>
      <div className="max-w-[1440px] mx-auto px-4 lg:px-6 py-4 lg:py-8">
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
            PRICE: {sortBy === 'price-low' ? 'LOW TO HIGH' : 'HIGH TO LOW'}
            <ArrowDown2 size={16} />
          </button>

          <button className="p-1">
            <HamburgerMenu size={20} />
          </button>
        </div>

        {/* Mobile: Active Filters */}
        {activeFilters.length > 0 && (
          <div className="lg:hidden flex items-center gap-2 flex-wrap mb-4">
            {activeFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => removeFilter(filter)}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded text-sm"
              >
                <span className="text-gray-400">×</span>
                <span>{filter}</span>
              </button>
            ))}
            <button
              onClick={clearAllFilters}
              className="text-sm font-medium underline"
            >
              Clear All
            </button>
          </div>
        )}

        <div className="flex gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-48 shrink-0">
            <h2 className="font-roboto font-bold text-lg mb-6 uppercase">Filters</h2>
            <div className="flex flex-col border-t border-gray-200">
              {FILTER_SECTIONS.map((section) => (
                <div key={section.key} className="border-b border-gray-200">
                  <button
                    onClick={() => toggleFilterSection(section.key)}
                    className="w-full flex items-center justify-between py-4 text-start"
                  >
                    <span className="font-roboto font-medium text-text-body">{section.label}</span>
                    <ArrowDown2
                      size={18}
                      className={cn(
                        'text-gray-400 transition-transform',
                        expandedFilters.includes(section.key) && 'rotate-180'
                      )}
                    />
                  </button>
                  {/* Filter options would expand here */}
                </div>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Desktop: Sort & Filters Bar */}
            <div className="hidden lg:flex flex-col gap-4 mb-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={openSortDrawer}
                  className="flex items-center gap-2 font-roboto font-bold text-sm uppercase"
                >
                  PRICE: {sortLabel.toUpperCase()}
                  <ArrowDown2 size={16} />
                </button>

                <button className="p-2 bg-gray-100 rounded">
                  <HamburgerMenu size={20} />
                </button>
              </div>

              {/* Active Filter Chips */}
              {activeFilters.length > 0 && (
                <div className="flex items-center gap-3 flex-wrap">
                  {activeFilters.map((filter) => (
                    <button
                      key={filter}
                      onClick={() => removeFilter(filter)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      <span className="text-gray-400">×</span>
                      <span className="text-gray-700 text-sm font-medium">{filter}</span>
                    </button>
                  ))}
                  <button
                    onClick={clearAllFilters}
                    className="text-sm font-medium underline ms-2"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-5">
              {sortedProducts.map((product) => (
                <CategoryProductCard
                  key={product.id}
                  product={product}
                  locale={locale}
                />
              ))}
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Drawers */}
      <FilterDrawer />
      <SortDrawer sortBy={sortBy} onSortChange={setSortBy} />
    </>
  )
}