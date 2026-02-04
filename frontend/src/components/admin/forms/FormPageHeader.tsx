'use client'

import { cn } from '@/lib/utils'
import { ArrowLeft, ArchiveTick, Trash } from 'iconsax-reactjs'
import { useRouter } from 'next/navigation'

interface FormPageHeaderProps {
  title: string
  onSave?: () => void
  onCancel?: () => void
  onDelete?: () => void
  showDelete?: boolean
  saveLabel?: string
  cancelLabel?: string
  deleteLabel?: string
  backHref?: string
  isSubmitting?: boolean
  className?: string
}

export default function FormPageHeader({
  title,
  onSave,
  onCancel,
  onDelete,
  showDelete = false,
  saveLabel = 'Save',
  cancelLabel = 'Cancel',
  deleteLabel = 'Delete',
  backHref,
  isSubmitting = false,
  className
}: FormPageHeaderProps) {
  const router = useRouter()

  const handleBack = () => {
    if (backHref) {
      router.push(backHref)
    } else {
      router.back()
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      handleBack()
    }
  }

  return (
    <div className={cn('flex items-center justify-between py-4', className)}>
      {/* Left: Back arrow + Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleBack}
          className="p-1 text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-semibold text-neutral-900">{title}</h1>
      </div>

      {/* Right: Action buttons */}
      <div className="flex items-center gap-3">
        {showDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center gap-2 px-4 h-10 rounded-lg border border-neutral-200 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            <Trash size={18} />
            {deleteLabel}
          </button>
        )}
        <button
          type="button"
          onClick={handleCancel}
          className="inline-flex items-center gap-2 px-4 h-10 rounded-lg border border-neutral-200 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
        >
          {cancelLabel}
        </button>
        <button
          type="submit"
          onClick={onSave}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-4 h-10 rounded-lg bg-neutral-900 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ArchiveTick size={18} />
          {isSubmitting ? 'Saving...' : saveLabel}
        </button>
      </div>
    </div>
  )
}
