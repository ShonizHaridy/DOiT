'use client'

import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'
import { Edit2, Eye, EyeSlash, Trash } from 'iconsax-reactjs'

interface ActionButtonsProps {
  onEdit?: () => void
  onView?: () => void
  onToggleVisibility?: () => void
  onDelete?: () => void
  showEdit?: boolean
  showView?: boolean
  showToggleVisibility?: boolean
  isVisible?: boolean
  showDelete?: boolean
  extraActions?: ReactNode
  className?: string
}

export default function ActionButtons({
  onEdit,
  onView,
  onToggleVisibility,
  onDelete,
  showEdit = true,
  showView = true,
  showToggleVisibility = false,
  isVisible = true,
  showDelete = false,
  extraActions,
  className
}: ActionButtonsProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {showEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="cursor-pointer p-1.5 text-neutral-400 hover:text-neutral-600 transition-colors"
          title="Edit"
        >
          {/* <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.25 3H3C2.60218 3 2.22064 3.15804 1.93934 3.43934C1.65804 3.72064 1.5 4.10218 1.5 4.5V15C1.5 15.3978 1.65804 15.7794 1.93934 16.0607C2.22064 16.342 2.60218 16.5 3 16.5H13.5C13.8978 16.5 14.2794 16.342 14.5607 16.0607C14.842 15.7794 15 15.3978 15 15V9.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.875 1.87499C14.1734 1.57662 14.578 1.40901 15 1.40901C15.422 1.40901 15.8266 1.57662 16.125 1.87499C16.4234 2.17336 16.591 2.57802 16.591 2.99999C16.591 3.42196 16.4234 3.82662 16.125 4.12499L9 11.25L6 12L6.75 9L13.875 1.87499Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg> */}
          {/* <Edit2 size={18} className="text-[#888787] hover:text-neutral-600 transition-colors" /> */}
          <Edit2 size={18} className="text-neutral-500 hover:text-neutral-700 transition-colors" />
        </button>
      )}
      
      {showView && (
        <button
          type="button"
          onClick={onView}
          className="cursor-pointer p-1.5 text-neutral-400 hover:text-neutral-600 transition-colors"
          title="View"
        >
          {/* <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.75 9C0.75 9 3.75 3 9 3C14.25 3 17.25 9 17.25 9C17.25 9 14.25 15 9 15C3.75 15 0.75 9 0.75 9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 11.25C10.2426 11.25 11.25 10.2426 11.25 9C11.25 7.75736 10.2426 6.75 9 6.75C7.75736 6.75 6.75 7.75736 6.75 9C6.75 10.2426 7.75736 11.25 9 11.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg> */}
          <Eye size={18} className="text-neutral-500 hover:text-neutral-700 transition-colors" />
        </button>
      )}

      {showToggleVisibility && (
        <button
          type="button"
          onClick={onToggleVisibility}
          className="cursor-pointer p-1.5 text-neutral-400 hover:text-neutral-600 transition-colors"
          title={isVisible ? 'Hide' : 'Show'}
        >
          {isVisible ? (
            <Eye size={18} className="text-neutral-500 hover:text-neutral-700 transition-colors" />
          ) : (
            <EyeSlash size={18} className="text-neutral-500 hover:text-neutral-700 transition-colors" />
          )}
        </button>
      )}

      {showDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="cursor-pointer p-1.5 text-neutral-400 hover:text-red-500 transition-colors"
          title="Delete"
        >
          <Trash size={18} className="text-neutral-500 hover:text-red-500 transition-colors" />
        </button>
      )}

      {extraActions}
    </div>
  )
}
