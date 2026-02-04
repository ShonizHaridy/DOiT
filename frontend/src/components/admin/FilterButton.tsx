'use client'

import { cn } from '@/lib/utils'

interface FilterButtonProps {
  onClick?: () => void
  className?: string
}

export default function FilterButton({ onClick, className }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 px-4 h-10 rounded-lg border border-neutral-200',
        'text-sm text-neutral-600 bg-white',
        'hover:bg-neutral-50 transition-colors',
        className
      )}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 4H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M4 8H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M6 12H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      Filter
    </button>
  )
}
