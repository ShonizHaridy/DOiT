'use client'

import { cn } from '@/lib/utils'
import { SearchNormal1 } from 'iconsax-reactjs'

interface SearchInputProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  className?: string
}

export default function SearchInput({
  placeholder = 'Search',
  value = '',
  onChange,
  className
}: SearchInputProps) {
  return (
    <div className={cn('relative', className)}>
      <SearchNormal1 size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn(
          'w-full h-10 pl-10 pr-4 rounded-lg border border-neutral-200',
          'text-sm text-neutral-900 placeholder:text-neutral-400',
          'focus:outline-none focus:ring-2 focus:ring-neutral-200 focus:border-neutral-300',
          'transition-colors'
        )}
      />
    </div>
  )
}
