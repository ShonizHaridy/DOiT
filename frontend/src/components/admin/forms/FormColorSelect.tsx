'use client'

import { cn } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'
import { FieldError } from 'react-hook-form'
import { ArrowDown2 } from 'iconsax-reactjs'

interface ColorOption {
  value: string
  label: string
  colorHex: string
}

interface FormColorSelectProps {
  label?: string
  error?: FieldError
  options: ColorOption[]
  placeholder?: string
  className?: string
  value?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  disabled?: boolean
}

export default function FormColorSelect({
  label,
  error,
  options,
  placeholder = 'Select color',
  className,
  value,
  onChange,
  onBlur,
  disabled = false,
}: FormColorSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const normalizedValue = value?.trim().toLowerCase()
  const isValueMatch = (option: ColorOption) => {
    if (!normalizedValue) return false

    const optionValue = option.value.trim().toLowerCase()
    const optionLabel = option.label.trim().toLowerCase()
    return optionValue === normalizedValue || optionLabel === normalizedValue
  }

  const selectedOption = options.find(isValueMatch)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
        onBlur?.()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onBlur])

  const handleSelect = (nextValue: string) => {
    onChange?.(nextValue)
    onBlur?.()
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label className="text-sm font-medium text-neutral-900">{label}</label>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          className={cn(
            'w-full h-10 px-3 pe-10 rounded-lg border bg-white',
            'text-sm text-neutral-900 transition-colors cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-neutral-200 focus:border-neutral-300',
            disabled && 'bg-neutral-50 text-neutral-500 cursor-not-allowed',
            error ? 'border-red-300 focus:ring-red-100' : 'border-neutral-200'
          )}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          disabled={disabled}
        >
          {selectedOption ? (
            <span className="flex items-center gap-2">
              <span
                className="h-6 w-6 shrink-0 rounded-[4px] border border-neutral-200"
                style={{ backgroundColor: selectedOption.colorHex }}
              />
              <span>{selectedOption.label}</span>
            </span>
          ) : (
            <span className="text-neutral-400">{placeholder}</span>
          )}
        </button>

        <ArrowDown2
          size={16}
          className={cn(
            'absolute end-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none transition-transform',
            isOpen && 'rotate-180'
          )}
        />

        {isOpen && !disabled && (
          <div className="absolute z-20 mt-1 w-full max-h-72 overflow-y-auto rounded-lg border border-neutral-200 bg-white shadow-lg">
            <ul role="listbox" className="py-1">
              {options.map((option) => {
                const isSelected = isValueMatch(option)
                return (
                  <li key={option.value}>
                    <button
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      className={cn(
                        'w-full px-3 py-2 text-sm text-left transition-colors cursor-pointer',
                        'flex items-center gap-2 hover:bg-neutral-50',
                        isSelected && 'bg-neutral-50'
                      )}
                    >
                      <span
                        className="h-6 w-6 shrink-0 rounded-[4px] border border-neutral-200"
                        style={{ backgroundColor: option.colorHex }}
                      />
                      <span className="text-neutral-900">{option.label}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500">{error.message}</p>
      )}
    </div>
  )
}
