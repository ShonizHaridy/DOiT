'use client'

import { forwardRef, TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      resize = 'none',
      className,
      id,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-')

    const resizeClasses = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize',
    }

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block font-inter font-medium text-xl text-primary mb-2"
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={cn(
            'w-full px-4 py-3 bg-white border border-border-light rounded',
            'font-roboto font-normal text-base text-primary',
            'placeholder:text-text-placeholder',
            'focus:outline-none focus:ring-2 focus:ring-sign-title/20 focus:border-sign-title',
            'disabled:bg-gray-100 disabled:cursor-not-allowed',
            'transition-colors duration-200',
            resizeClasses[resize],
            error && 'border-secondary focus:border-secondary focus:ring-secondary/20',
            className
          )}
          {...props}
        />

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

Textarea.displayName = 'Textarea'

export default Textarea