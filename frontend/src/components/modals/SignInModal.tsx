'use client'

import { useEffect } from 'react'
import { CloseCircle } from 'iconsax-reactjs'
import SignInForm from '@/components/auth/SignInForm'
import { cn } from '@/lib/utils'

interface SignInModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function SignInModal({ isOpen, onClose, onSuccess }: SignInModalProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const handleSuccess = () => {
    onSuccess?.() // Run custom logic (e.g., refresh user data)
    onClose()      // Close the modal
  }

  if (!isOpen) return null

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex items-center justify-center p-4',
        'bg-black/50 backdrop-blur-sm transition-opacity duration-300'
      )}
      onClick={onClose}
    >
      <div
        className="relative scale-100 transition-transform duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-2 -end-2 z-10 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
        >
          <CloseCircle size={24} variant="Bold" className="text-primary" />
        </button>

        {/* The Shared Form */}
        <SignInForm onSuccess={handleSuccess} />
      </div>
    </div>
  )
}