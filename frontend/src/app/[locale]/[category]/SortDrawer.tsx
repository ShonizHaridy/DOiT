'use client'

import { useEffect } from 'react'
import { CloseCircle } from 'iconsax-reactjs'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/store'
import { SORT_OPTIONS } from '@/data/products'

interface SortDrawerProps {
  sortBy: string
  onSortChange: (value: string) => void
}

export default function SortDrawer({ sortBy, onSortChange }: SortDrawerProps) {
  const { isSortDrawerOpen, closeSortDrawer } = useUIStore()

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSortDrawer()
    }
    if (isSortDrawerOpen) document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isSortDrawerOpen, closeSortDrawer])

  useEffect(() => {
    document.body.style.overflow = isSortDrawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isSortDrawerOpen])

  const handleSelect = (key: string) => {
    onSortChange(key)
    closeSortDrawer()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-(--z-modal-backdrop) transition-opacity lg:hidden',
          isSortDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={closeSortDrawer}
        aria-hidden="true"
      />

      {/* Bottom Sheet */}
      <div
        className={cn(
          'fixed bottom-0 inset-x-0 bg-white z-(--z-modal) rounded-t-2xl transition-transform duration-300 lg:hidden',
          isSortDrawerOpen ? 'translate-y-0' : 'translate-y-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="font-roboto font-bold text-base uppercase">
            PRICE: {SORT_OPTIONS.find(o => o.key === sortBy)?.label?.toUpperCase()}
          </h2>
          <button
            onClick={closeSortDrawer}
            className="text-text-body hover:text-primary"
            aria-label="Close sort options"
          >
            <CloseCircle size={24} />
          </button>
        </div>

        {/* Sort Options */}
        <div className="flex flex-col py-2 max-h-[60vh] overflow-y-auto">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.key}
              onClick={() => handleSelect(option.key)}
              className={cn(
                'w-full px-4 py-3 text-start text-sm transition-colors',
                sortBy === option.key
                  ? 'font-bold text-primary'
                  : 'text-text-body hover:bg-gray-50'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}