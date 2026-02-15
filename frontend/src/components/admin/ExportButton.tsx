'use client'

import { cn } from '@/lib/utils'
import { ExportSquare } from 'iconsax-reactjs'

interface ExportButtonProps {
  onClick?: () => void
  className?: string
}

export default function ExportButton({ onClick, className }: ExportButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 px-4 h-10 rounded-lg',
        'text-sm text-white bg-neutral-900',
        'hover:bg-neutral-800 transition-colors',
        className
      )}
    >
      <ExportSquare size={16} className="text-white" />
      Export
    </button>
  )
}
