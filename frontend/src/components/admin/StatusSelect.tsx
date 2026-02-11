'use client'

import { cn } from '@/lib/utils'
import { ArrowDown2 } from 'iconsax-reactjs'

interface StatusSelectProps {
  value?: string
  onChange?: (value: string) => void
  options: { value: string; label: string }[]
  className?: string
  disabled?: boolean
}

export default function StatusSelect({ value, onChange, options, className, disabled }: StatusSelectProps) {
  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <span className="text-sm font-medium text-neutral-600">Change Status</span>
      <div className="relative">
        <select
          value={value || ''}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className="h-9 pl-3 pr-8 rounded-lg border border-neutral-200 bg-white text-sm text-neutral-700 appearance-none focus:outline-none focus:ring-2 focus:ring-neutral-200 cursor-pointer"
        >
          <option value="">Select Status</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ArrowDown2
          size={14}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
        />
      </div>
    </div>
  )
}
