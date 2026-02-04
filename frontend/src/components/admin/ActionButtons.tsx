'use client'

import { cn } from '@/lib/utils'

interface ActionButtonsProps {
  onEdit?: () => void
  onView?: () => void
  onDelete?: () => void
  showEdit?: boolean
  showView?: boolean
  showDelete?: boolean
  className?: string
}

export default function ActionButtons({
  onEdit,
  onView,
  onDelete,
  showEdit = true,
  showView = true,
  showDelete = false,
  className
}: ActionButtonsProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {showEdit && (
        <button
          onClick={onEdit}
          className="p-1.5 text-neutral-400 hover:text-neutral-600 transition-colors"
          title="Edit"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.25 3H3C2.60218 3 2.22064 3.15804 1.93934 3.43934C1.65804 3.72064 1.5 4.10218 1.5 4.5V15C1.5 15.3978 1.65804 15.7794 1.93934 16.0607C2.22064 16.342 2.60218 16.5 3 16.5H13.5C13.8978 16.5 14.2794 16.342 14.5607 16.0607C14.842 15.7794 15 15.3978 15 15V9.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.875 1.87499C14.1734 1.57662 14.578 1.40901 15 1.40901C15.422 1.40901 15.8266 1.57662 16.125 1.87499C16.4234 2.17336 16.591 2.57802 16.591 2.99999C16.591 3.42196 16.4234 3.82662 16.125 4.12499L9 11.25L6 12L6.75 9L13.875 1.87499Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
      
      {showView && (
        <button
          onClick={onView}
          className="p-1.5 text-neutral-400 hover:text-neutral-600 transition-colors"
          title="View"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.75 9C0.75 9 3.75 3 9 3C14.25 3 17.25 9 17.25 9C17.25 9 14.25 15 9 15C3.75 15 0.75 9 0.75 9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 11.25C10.2426 11.25 11.25 10.2426 11.25 9C11.25 7.75736 10.2426 6.75 9 6.75C7.75736 6.75 6.75 7.75736 6.75 9C6.75 10.2426 7.75736 11.25 9 11.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}

      {showDelete && (
        <button
          onClick={onDelete}
          className="p-1.5 text-neutral-400 hover:text-red-500 transition-colors"
          title="Delete"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.25 4.5H15.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 4.5V3C6 2.60218 6.15804 2.22064 6.43934 1.93934C6.72064 1.65804 7.10218 1.5 7.5 1.5H10.5C10.8978 1.5 11.2794 1.65804 11.5607 1.93934C11.842 2.22064 12 2.60218 12 3V4.5M14.25 4.5V15C14.25 15.3978 14.092 15.7794 13.8107 16.0607C13.5294 16.342 13.1478 16.5 12.75 16.5H5.25C4.85218 16.5 4.47064 16.342 4.18934 16.0607C3.90804 15.7794 3.75 15.3978 3.75 15V4.5H14.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
    </div>
  )
}
