'use client'

import { cn } from '@/lib/utils'
import { ArrowLeft2, ArrowRight2 } from 'iconsax-reactjs'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  className?: string
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    
    if (totalPages <= 7) {
      // Show all pages if 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first 3 pages
      pages.push(1, 2, 3)
      
      if (currentPage > 4) {
        pages.push('...')
      }
      
      // Show pages around current page
      if (currentPage > 3 && currentPage < totalPages - 2) {
        if (currentPage > 4) {
          pages.push(currentPage)
        }
      }
      
      if (currentPage < totalPages - 3) {
        pages.push('...')
      }
      
      // Always show last 3 pages
      if (totalPages > 3) {
        const lastPages = [totalPages - 2, totalPages - 1, totalPages].filter(p => p > 3)
        pages.push(...lastPages)
      }
    }
    
    // Remove duplicates and sort
    return [...new Set(pages)]
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className={cn('flex items-center justify-between', className)}>
      <p className="text-sm text-neutral-500">
        Showing {startItem} to {endItem} of {totalItems}
      </p>
      
      <div className="flex items-center gap-1">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            'w-8 h-8 flex items-center justify-center rounded border text-sm',
            currentPage === 1
              ? 'border-neutral-200 text-neutral-300 cursor-not-allowed'
              : 'border-neutral-300 text-neutral-600 hover:bg-neutral-50'
          )}
        >
          <ArrowLeft2 size={16} />
        </button>

        {/* Page Numbers */}
        {pageNumbers.map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
            className={cn(
              'w-8 h-8 flex items-center justify-center rounded text-sm',
              page === currentPage
                ? 'bg-neutral-900 text-white'
                : page === '...'
                ? 'cursor-default text-neutral-400'
                : 'border border-neutral-300 text-neutral-600 hover:bg-neutral-50'
            )}
          >
            {page}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            'w-8 h-8 flex items-center justify-center rounded border text-sm',
            currentPage === totalPages
              ? 'border-neutral-200 text-neutral-300 cursor-not-allowed'
              : 'border-neutral-300 text-neutral-600 hover:bg-neutral-50'
          )}
        >
          <ArrowRight2 size={16} />
        </button>
      </div>
    </div>
  )
}
