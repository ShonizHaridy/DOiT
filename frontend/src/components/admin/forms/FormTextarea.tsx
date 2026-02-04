'use client'

import { cn } from '@/lib/utils'
import { forwardRef } from 'react'
import { FieldError } from 'react-hook-form'

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: FieldError
  textareaClassName?: string
}

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(({
  label,
  error,
  className,
  textareaClassName,
  rows = 4,
  ...props
}, ref) => {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label className="text-sm font-medium text-neutral-900">{label}</label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          'px-3 py-2.5 rounded-lg border bg-white',
          'text-sm text-neutral-900 placeholder:text-neutral-400',
          'focus:outline-none focus:ring-2 focus:ring-neutral-200 focus:border-neutral-300',
          'disabled:bg-neutral-50 disabled:text-neutral-500',
          'transition-colors resize-none',
          error ? 'border-red-300 focus:ring-red-100' : 'border-neutral-200',
          textareaClassName
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-500">{error.message}</p>
      )}
    </div>
  )
})

FormTextarea.displayName = 'FormTextarea'

export default FormTextarea
