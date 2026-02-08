'use client'

import { Heart } from 'iconsax-reactjs'
import { cn } from '@/lib/utils'
import { useAddToWishlist, useRemoveFromWishlist } from '@/hooks/useWishlist'
import { useAuthStore, useUIStore, useWishlistStore } from '@/store'

interface FavoriteButtonProps {
  productId: string
  size?: number
  className?: string
}

export default function FavoriteButton({
  productId,
  size = 20,
  className,
}: FavoriteButtonProps) {
  const { isInWishlist } = useWishlistStore()
  const accessToken = useAuthStore((state) => state.accessToken)
  const openSignIn = useUIStore((state) => state.openSignIn)
  const addToWishlist = useAddToWishlist()
  const removeFromWishlist = useRemoveFromWishlist()
  const isFavorite = isInWishlist(productId)
  const isPending = addToWishlist.isPending || removeFromWishlist.isPending

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!accessToken) {
      openSignIn()
      return
    }
    if (isFavorite) {
      removeFromWishlist.mutate(productId)
      return
    }
    addToWishlist.mutate(productId)
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        'flex items-center justify-center transition-colors',
        isPending && 'opacity-60 cursor-not-allowed',
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
