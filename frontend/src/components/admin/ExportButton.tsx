'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { ExportSquare } from 'iconsax-reactjs'

interface ExportButtonProps {
  onClick?: () => void | Promise<void>
  onExportCurrentPage?: () => void | Promise<void>
  onExportAllFiltered?: () => void | Promise<void>
  currentPageLabel?: string
  allFilteredLabel?: string
  className?: string
}

export default function ExportButton({
  onClick,
  onExportCurrentPage,
  onExportAllFiltered,
  currentPageLabel = 'Current page',
  allFilteredLabel = 'All (filtered)',
  className,
}: ExportButtonProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const hasMenuActions = Boolean(onExportCurrentPage || onExportAllFiltered)

  useEffect(() => {
    if (!isMenuOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMenuOpen])

  const handlePrimaryClick = async () => {
    if (hasMenuActions) {
      setIsMenuOpen((prev) => !prev)
      return
    }
    await onClick?.()
  }

  const handleMenuAction = async (action?: () => void | Promise<void>) => {
    setIsMenuOpen(false)
    await action?.()
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={handlePrimaryClick}
        className={cn(
          'inline-flex items-center gap-2 px-4 h-10 rounded-lg cursor-pointer',
          'text-sm text-white bg-neutral-900',
          'hover:bg-neutral-800 transition-colors',
          className
        )}
      >
        <ExportSquare size={16} className="text-white" />
        Export
      </button>

      {hasMenuActions && isMenuOpen ? (
        <div className="absolute right-0 top-12 z-20 min-w-[170px] rounded-lg border border-neutral-200 bg-white shadow-lg p-1">
          {onExportCurrentPage ? (
            <button
              type="button"
              className="w-full text-left px-3 py-2 text-sm text-neutral-800 rounded-md hover:bg-neutral-100 cursor-pointer"
              onClick={() => handleMenuAction(onExportCurrentPage)}
            >
              {currentPageLabel}
            </button>
          ) : null}
          {onExportAllFiltered ? (
            <button
              type="button"
              className="w-full text-left px-3 py-2 text-sm text-neutral-800 rounded-md hover:bg-neutral-100 cursor-pointer"
              onClick={() => handleMenuAction(onExportAllFiltered)}
            >
              {allFilteredLabel}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
