'use client'

import { useEffect } from 'react'
import { ArrowDown2, CloseCircle } from 'iconsax-reactjs'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/store'

const FILTER_SECTIONS = [
  { key: 'availability', label: 'Availability' },
  { key: 'price', label: 'Price' },
  { key: 'productType', label: 'Product Type' },
  { key: 'brand', label: 'Brand' },
  { key: 'size', label: 'Size' },
  { key: 'gender', label: 'Gender' },
  { key: 'color', label: 'Color' },
]

export default function FilterDrawer() {
  const { isFilterDrawerOpen, closeFilterDrawer } = useUIStore()

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

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-(--z-modal-backdrop) transition-opacity lg:hidden',
          isFilterDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={closeFilterDrawer}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed top-0 start-0 bottom-0 w-[280px] bg-white z-(--z-modal) transition-transform duration-300 lg:hidden',
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
          {FILTER_SECTIONS.map((section) => (
            <div key={section.key} className="border-b border-gray-200">
              <button className="w-full flex items-center justify-between px-4 py-4 text-start">
                <span className="font-roboto font-medium text-text-body">{section.label}</span>
                <ArrowDown2 size={18} className="text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}