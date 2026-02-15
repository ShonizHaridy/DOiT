'use client'

import { cn } from '@/lib/utils'
import { ArrowDown2, Filter } from 'iconsax-reactjs'
import { useEffect, useMemo, useRef, useState } from 'react'
import StatusBadge, { getStatusVariant, type StatusVariant } from '@/components/admin/StatusBadge'

export interface FilterOption {
  value: string
  label: string
  badgeVariant?: StatusVariant
}

export interface FilterSection {
  key: string
  title: string
  options: FilterOption[]
  showBadge?: boolean
  multi?: boolean
  defaultOpen?: boolean
}

export type FilterValues = Record<string, string[]>

interface FilterButtonProps {
  onClick?: () => void
  className?: string
  sections?: FilterSection[]
  value?: FilterValues
  onApply?: (value: FilterValues) => void
  onReset?: () => void
  panelClassName?: string
}

const getInitialExpandedState = (sections: FilterSection[]) => {
  return sections.reduce<Record<string, boolean>>((acc, section) => {
    acc[section.key] = section.defaultOpen ?? true
    return acc
  }, {})
}

export default function FilterButton({
  onClick,
  className,
  sections,
  value,
  onApply,
  onReset,
  panelClassName,
}: FilterButtonProps) {
  const panelSections = useMemo(() => sections ?? [], [sections])
  const [isOpen, setIsOpen] = useState(false)
  const [draftValue, setDraftValue] = useState<FilterValues>(value ?? {})
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    () => getInitialExpandedState(panelSections)
  )
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setDraftValue(value ?? {})
  }, [value])

  useEffect(() => {
    setExpandedSections((prev) => ({
      ...getInitialExpandedState(panelSections),
      ...prev,
    }))
  }, [panelSections])

  useEffect(() => {
    if (!isOpen) return
    const onClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [isOpen])

  const hasPanel = panelSections.length > 0
  const selectedCount = useMemo(
    () => Object.values(value ?? {}).reduce((acc, list) => acc + list.length, 0),
    [value]
  )

  const toggleOption = (section: FilterSection, optionValue: string) => {
    setDraftValue((prev) => {
      const current = prev[section.key] ?? []
      const exists = current.includes(optionValue)
      const allowMulti = section.multi ?? true

      const next = exists
        ? current.filter((item) => item !== optionValue)
        : allowMulti
        ? [...current, optionValue]
        : [optionValue]

      return { ...prev, [section.key]: next }
    })
  }

  const handleReset = () => {
    const cleared: FilterValues = {}
    setDraftValue(cleared)
    onReset?.()
  }

  const handleApply = () => {
    onApply?.(draftValue)
    setIsOpen(false)
  }

  const button = (
    <button
      onClick={hasPanel ? () => setIsOpen((prev) => !prev) : onClick}
      className={cn(
        'inline-flex items-center gap-2 px-4 h-10 rounded-lg border border-neutral-200',
        'text-sm text-neutral-600 bg-white',
        'hover:bg-neutral-50 transition-colors',
        selectedCount > 0 && 'border-neutral-400 text-neutral-800',
        className
      )}
      type="button"
    >
      <Filter size={16} className="text-neutral-500" />
      Filter
      {selectedCount > 0 && <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />}
    </button>
  )

  if (!hasPanel) {
    return button
  }

  return (
    <div className="relative" ref={containerRef}>
      {button}

      {isOpen && (
        <div
          className={cn(
            'absolute right-0 top-full mt-2 z-30 w-[240px] rounded-xl border border-neutral-300 bg-white p-3 shadow-lg',
            panelClassName
          )}
        >
          <div className="space-y-3">
            {panelSections.map((section) => {
              const isExpanded = expandedSections[section.key] ?? true
              const selected = draftValue[section.key] ?? []
              return (
                <div key={section.key}>
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedSections((prev) => ({
                        ...prev,
                        [section.key]: !(prev[section.key] ?? true),
                      }))
                    }
                    className="w-full flex items-center justify-between text-left"
                  >
                    <span className="text-xl leading-none font-semibold text-neutral-500">
                      {section.title}
                    </span>
                    <ArrowDown2
                      size={18}
                      className={cn(
                        'text-neutral-500 transition-transform',
                        isExpanded && 'rotate-180'
                      )}
                    />
                  </button>

                  {isExpanded && (
                    <div className="mt-2 space-y-1.5">
                      {section.options.map((option) => (
                        <label
                          key={`${section.key}-${option.value}`}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selected.includes(option.value)}
                            onChange={() => toggleOption(section, option.value)}
                            className="h-4 w-4 rounded border-neutral-400 text-neutral-900 focus:ring-neutral-300"
                          />
                          {section.showBadge ? (
                            <StatusBadge
                              label={option.label}
                              variant={option.badgeVariant ?? getStatusVariant(option.label)}
                              className="border-0 text-sm font-medium px-3 py-0.5"
                            />
                          ) : (
                            <span className="text-base leading-none text-neutral-600">
                              {option.label}
                            </span>
                          )}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="mt-4 space-y-2">
            <button
              type="button"
              onClick={handleReset}
              className="w-full h-10 rounded-md border border-neutral-300 text-neutral-800 hover:bg-neutral-50 transition-colors"
            >
              Reset All
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="w-full h-10 rounded-md bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
