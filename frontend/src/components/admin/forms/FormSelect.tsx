'use client'

import { cn } from '@/lib/utils'
import { forwardRef } from 'react'
import { FieldError } from 'react-hook-form'
import { ArrowDown2 } from 'iconsax-reactjs'

interface SelectOption {
  value: string
  label: string
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: FieldError
  options: SelectOption[]
  placeholder?: string
  selectClassName?: string
}

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(({
  label,
  error,
  options,
  placeholder = 'Select...',
  className,
  selectClassName,
  ...props
}, ref) => {
  const isRtl = props.dir === 'rtl'

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label className={cn('text-sm font-medium text-neutral-900', isRtl && 'text-right')}>{label}</label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            'w-full h-10 px-3 pe-10 rounded-lg border bg-white',
            'text-sm text-neutral-900 appearance-none',
            'focus:outline-none focus:ring-2 focus:ring-neutral-200 focus:border-neutral-300',
            'disabled:bg-neutral-50 disabled:text-neutral-500',
            'transition-colors cursor-pointer',
            error ? 'border-red-300 focus:ring-red-100' : 'border-neutral-200',
            selectClassName
          )}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ArrowDown2 
          size={16} 
          className="absolute end-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" 
        />
      </div>
      {error && (
        <p className="text-xs text-red-500">{error.message}</p>
      )}
    </div>
  )
})

FormSelect.displayName = 'FormSelect'

export default FormSelect
