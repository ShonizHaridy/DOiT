'use client'

import { forwardRef, SelectHTMLAttributes, ReactNode } from 'react'
import { ArrowDown2 } from 'iconsax-reactjs'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
  options: SelectOption[]
  placeholder?: string
  leftIcon?: ReactNode
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      placeholder,
      leftIcon,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block font-inter font-medium text-xl text-primary mb-2"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-text-placeholder">
              {leftIcon}
            </div>
          )}

          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full px-4 py-3 pe-10 bg-white border border-border-light rounded appearance-none',
              'font-roboto font-normal text-base text-primary',
              'focus:outline-none focus:ring-2 focus:ring-sign-title/20 focus:border-sign-title',
              'disabled:bg-gray-100 disabled:cursor-not-allowed',
              'transition-colors duration-200',
              leftIcon && 'ps-12',
              error && 'border-secondary focus:border-secondary focus:ring-secondary/20',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Custom Arrow */}
          <div className="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none text-text-placeholder">
            <ArrowDown2 size={20} />
          </div>
        </div>

        {(helperText || error) && (
          <p
            className={cn(
              'mt-1.5 font-roboto font-normal text-sm',
              error ? 'text-secondary' : 'text-text-placeholder'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

export default Select