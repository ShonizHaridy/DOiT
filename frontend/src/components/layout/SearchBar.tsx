'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { SearchNormal1 } from 'iconsax-reactjs'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  className?: string
  isLight?: boolean
}

export default function SearchBar({ className, isLight = false }: SearchBarProps) {
  const t = useTranslations('header')
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      console.log('Search:', query)
      // Later: router.push(`/search?q=${query}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn('relative', className)}>
      <div
        className={cn(
          'flex items-center w-full rounded-lg border transition-colors',
          isLight ? 'bg-surface-hover border-border' : 'bg-transparent border-neutral-700',
          isFocused && 'border-primary'
        )}
      >
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={t('searchPlaceholder')}
          className={cn(
            'w-full px-4 py-3 bg-transparent text-base outline-none',
            isLight ? 'text-text-primary placeholder:text-neutral-400' : 'text-text-inverse placeholder:text-neutral-400'
          )}
        />
        <button
          type="submit"
          className={cn(
            'absolute inset-y-0 end-4 flex items-center transition-colors',
            isLight ? 'text-text-tertiary hover:text-primary' : 'text-text-tertiary hover:text-text-inverse'
          )}
          aria-label={t('search')}
        >
          <SearchNormal1 size={20} />
        </button>
      </div>
    </form>
  )
}
