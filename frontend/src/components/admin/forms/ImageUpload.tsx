'use client'

import { cn } from '@/lib/utils'
import { GalleryAdd, CloseCircle, Trash } from 'iconsax-reactjs'
import { useRef } from 'react'
import { FieldError } from 'react-hook-form'

export interface UploadedImage {
  id: string
  url: string
  name: string
}

interface ImageUploadProps {
  label?: string
  value?: UploadedImage[]
  onChange?: (images: UploadedImage[]) => void
  error?: FieldError
  maxImages?: number
  maxSizeMB?: number
  allowedTypes?: string[]
  className?: string
  single?: boolean
}

export default function ImageUpload({
  label,
  value = [],
  onChange,
  error,
  maxImages = 5,
  maxSizeMB = 50,
  allowedTypes = ['jpg', 'png', 'xls'],
  className,
  single = false
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSelectFile = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newImages: UploadedImage[] = Array.from(files).map((file, index) => ({
      id: `${Date.now()}-${index}`,
      url: URL.createObjectURL(file),
      name: file.name
    }))

    if (single) {
      onChange?.(newImages.slice(0, 1))
    } else {
      onChange?.([...value, ...newImages].slice(0, maxImages))
    }
    
    e.target.value = ''
  }

  const handleRemoveImage = (id: string) => {
    onChange?.(value.filter(img => img.id !== id))
  }

  const emptySlots = single ? (value.length === 0 ? 1 : 0) : Math.max(0, maxImages - value.length)

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && (
        <label className="text-sm font-medium text-neutral-900">{label}</label>
      )}
      
      <div className="flex items-center gap-2 text-sm text-neutral-500">
        <span>Drag the image here</span>
        <span>Or</span>
        <button
          type="button"
          onClick={handleSelectFile}
          className="px-3 py-1.5 border border-neutral-300 rounded text-neutral-700 hover:bg-neutral-50 transition-colors"
        >
          Select File
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={!single}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div className={cn('flex gap-3 flex-wrap', single && 'max-w-[120px]')}>
        {/* Uploaded images */}
        {value.map((image) => (
          <div
            key={image.id}
            className="relative w-[100px] h-[80px] rounded-lg border border-neutral-200 overflow-hidden group"
          >
            <img
              src={image.url}
              alt={image.name}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(image.id)}
              className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
            >
              <CloseCircle size={14} className="text-neutral-500" />
            </button>
          </div>
        ))}

        {/* Empty slots */}
        {Array.from({ length: emptySlots }).map((_, index) => (
          <button
            key={`empty-${index}`}
            type="button"
            onClick={handleSelectFile}
            className={cn(
              'w-[100px] h-[80px] rounded-lg border-2 border-dashed',
              'flex items-center justify-center hover:border-neutral-300 transition-colors',
              error ? 'border-red-200' : 'border-neutral-200'
            )}
          >
            <GalleryAdd size={24} className={error ? 'text-red-300' : 'text-neutral-300'} />
          </button>
        ))}
      </div>

      <p className="text-xs text-neutral-400">
        Maximum size {maxSizeMB}MB&nbsp;&nbsp;&nbsp;Allowed files: {allowedTypes.join(', ')}
      </p>
      
      {error && (
        <p className="text-xs text-red-500">{error.message}</p>
      )}
    </div>
  )
}
