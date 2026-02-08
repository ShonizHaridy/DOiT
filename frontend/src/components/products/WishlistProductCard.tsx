'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'iconsax-reactjs'
import { cn } from '@/lib/utils'
import { getLocalized, type Locale } from '@/lib/i18n-utils'
import { useAddToWishlist, useRemoveFromWishlist } from '@/hooks/useWishlist'
import { useAuthStore, useUIStore, useWishlistStore } from '@/store'
import type { WishlistItem } from '@/types/wishlist'

interface WishlistProductCardProps {
  item: WishlistItem
  locale: string
  className?: string
}

export default function WishlistProductCard({ item, locale, className }: WishlistProductCardProps) {
  const { product } = item
  const { isInWishlist } = useWishlistStore()
  const accessToken = useAuthStore((state) => state.accessToken)
  const openSignIn = useUIStore((state) => state.openSignIn)
  const addToWishlist = useAddToWishlist()
  const removeFromWishlist = useRemoveFromWishlist()
  const isFavorite = isInWishlist(product.id)
  const isPending = addToWishlist.isPending || removeFromWishlist.isPending

  const productName = getLocalized(product, 'name', locale as Locale)
  const imageUrl = product.images[0] || '/placeholder-product.png'
  const inStock = product.availability !== 'out-of-stock'

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!accessToken) {
      openSignIn()
      return
    }
    if (isFavorite) {
      removeFromWishlist.mutate(product.id)
      return
    }
    addToWishlist.mutate(product.id)
  }

  return (
    <article className={cn('flex flex-col bg-white rounded-lg overflow-hidden border border-gray-100', className)}>
      <Link href={`/${locale}/products/${product.id}`} className="relative aspect-square bg-white overflow-hidden group">
        <Image
          src={imageUrl}
          alt={productName}
          fill
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {product.discountPercentage > 0 && (
          <div className="absolute top-2 start-2 bg-secondary text-white px-2 py-1 rounded text-xs font-bold">
            -{product.discountPercentage}%
          </div>
        )}

        {!inStock && (
          <div className="absolute top-2 end-2 bg-gray-800 text-white px-2 py-1 rounded text-xs font-medium">
            Out of Stock
          </div>
        )}
      </Link>

      <div className="flex flex-col p-3 lg:p-4 gap-1">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/${locale}/products/${product.id}`} className="flex-1">
            <h3 className="font-roboto font-medium text-sm lg:text-base text-primary line-clamp-2 hover:text-secondary transition-colors">
              {productName}
            </h3>
          </Link>
          <button
            onClick={handleWishlist}
            disabled={isPending}
            className={cn(
              'w-8 h-8 lg:w-9 lg:h-9 flex items-center justify-center rounded transition-colors',
              isFavorite ? 'bg-secondary text-white' : 'bg-transparent text-text-body hover:text-secondary',
              isPending && 'opacity-60 cursor-not-allowed'
            )}
            aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={18} variant={isFavorite ? 'Bold' : 'Outline'} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {product.discountPercentage > 0 ? (
            <>
              <span className="font-rubik font-bold text-base lg:text-lg text-secondary">
                {product.finalPrice.toLocaleString()} EGP
              </span>
              <span className="font-rubik text-sm text-gray-400 line-through">
                {product.basePrice.toLocaleString()} EGP
              </span>
            </>
          ) : (
            <span className="font-rubik font-bold text-base lg:text-lg text-secondary">
              {product.basePrice.toLocaleString()} EGP
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
