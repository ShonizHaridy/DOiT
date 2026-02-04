'use client'

import { useState } from 'react'
import { Heart } from 'iconsax-reactjs'
import { cn } from '@/lib/utils'

interface FavoriteButtonProps {
  productId: string
  initialState?: boolean
  size?: number
  className?: string
}

export default function FavoriteButton({
  productId,
  initialState = false,
  size = 20,
  className,
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialState)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorite(!isFavorite)
    // TODO: Call API to update wishlist
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'flex items-center justify-center transition-colors',
        className
      )}
      aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        size={size}
        color={isFavorite ? '#FE0503' : '#888787'}
        variant={isFavorite ? 'Bold' : 'Linear'}
      />
    </button>
  )
}