'use client'

import { cn } from '@/lib/utils'
import { forwardRef } from 'react'
import { FieldError } from 'react-hook-form'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: FieldError
  inputClassName?: string
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(({
  label,
  error,
  className,
  inputClassName,
  ...props
}, ref) => {
  const isRtl = props.dir === 'rtl'

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label className={cn('font-rubik text-xl font-medium text-neutral-900', isRtl && 'text-right')}>{label}</label>
      )}
      <input
        ref={ref}
        className={cn(
          'h-10 px-3 rounded-lg border bg-white',
          'text-sm text-neutral-900 placeholder:text-neutral-400',
          'focus:outline-none focus:ring-2 focus:ring-neutral-200 focus:border-neutral-300',
          'disabled:bg-neutral-50 disabled:text-neutral-500',
          'transition-colors',
          error ? 'border-red-300 focus:ring-red-100' : 'border-neutral-200',
          inputClassName
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-500">{error.message}</p>
      )}
    </div>
  )
})

FormInput.displayName = 'FormInput'

export default FormInput
