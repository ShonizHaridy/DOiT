'use client'

import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

export interface Column<T> {
  key: string
  header: string
  width?: string
  render?: (item: T, index: number) => ReactNode
  headerClassName?: string
  cellClassName?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (item: T, index: number) => string | number
  className?: string
  headerClassName?: string
  rowClassName?: string | ((item: T, index: number) => string)
  emptyMessage?: string
  onRowClick?: (item: T, index: number) => void
}

export default function DataTable<T>({
  columns,
  data,
  keyExtractor,
  className,
  headerClassName,
  rowClassName,
  emptyMessage = 'No data available',
  onRowClick
}: DataTableProps<T>) {
  return (
    <div className={cn('w-full', className)}>
      <div className="overflow-x-auto rounded-lg border border-neutral-200">
        <table className="w-full">
          <thead>
            <tr className={cn('bg-neutral-50 border-b border-neutral-200', headerClassName)}>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-4 py-3 text-left text-sm font-medium text-primary',
                    column.width,
                    column.headerClassName
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-sm text-neutral-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={keyExtractor(item, index)}
                  onClick={() => onRowClick?.(item, index)}
                  className={cn(
                    'border-b border-neutral-100 hover:bg-neutral-50 transition-colors last:border-b-0',
                    onRowClick && 'cursor-pointer',
                    typeof rowClassName === 'function'
                      ? rowClassName(item, index)
                      : rowClassName
                  )}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        'px-4 py-4 text-sm text-neutral-900',
                        column.width,
                        column.cellClassName
                      )}
                    >
                      {column.render
                        ? column.render(item, index)
                        : (item as Record<string, unknown>)[column.key] as ReactNode}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
