'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingCart } from 'iconsax-reactjs'
import { cn } from '@/lib/utils'
import { useAddToWishlist, useRemoveFromWishlist } from '@/hooks/useWishlist'
import { useAuthStore, useUIStore, useWishlistStore } from '@/store'
import { getLocalized, type Locale } from '@/lib/i18n-utils'
import type { Product } from '@/types/product'

interface CategoryProductCardProps {
  product: Product
  locale: string
  className?: string
}

export default function CategoryProductCard({ product, locale, className }: CategoryProductCardProps) {
  const { isInWishlist } = useWishlistStore()
  const { openQuickAdd, openSignIn } = useUIStore()
  const accessToken = useAuthStore((state) => state.accessToken)
  const addToWishlist = useAddToWishlist()
  const removeFromWishlist = useRemoveFromWishlist()

  const isFavorite = isInWishlist(product.id)
  const isPending = addToWishlist.isPending || removeFromWishlist.isPending

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    openQuickAdd(product)
  }

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

  // Get localized product name
  const productName = getLocalized(product, 'name', locale as Locale)
  
  // Get first image URL
  const imageUrl = product.images[0]?.url || '/placeholder-product.png'
  
  // Check if in stock
  const inStock = product.availability !== 'out-of-stock'

  return (
    <article className={cn('flex flex-col bg-white rounded-lg overflow-hidden border border-gray-100', className)}>
      {/* Image */}
      <Link href={`/${locale}/products/${product.id}`} className="relative aspect-square bg-white overflow-hidden group">
        <Image
          src={imageUrl}
          alt={productName}
          fill
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        
        {/* Discount Badge */}
        {product.discountPercentage > 0 && (
          <div className="absolute top-2 start-2 bg-secondary text-white px-2 py-1 rounded text-xs font-bold">
            -{product.discountPercentage}%
          </div>
        )}
        
        {/* Out of Stock Badge */}
        {!inStock && (
          <div className="absolute top-2 end-2 bg-gray-800 text-white px-2 py-1 rounded text-xs font-medium">
            Out of Stock
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col p-3 lg:p-4 gap-1">
        {/* Title Row with Actions */}
        <div className="flex items-start justify-between gap-2">
          <Link href={`/${locale}/products/${product.id}`} className="flex-1">
            <h3 className="font-roboto font-medium text-sm lg:text-base text-primary line-clamp-2 hover:text-secondary transition-colors">
              {productName}
            </h3>
          </Link>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleQuickAdd}
              disabled={!inStock}
              className={cn(
                "w-8 h-8 lg:w-9 lg:h-9 flex items-center justify-center bg-bg-card rounded transition-colors",
                inStock 
                  ? "hover:bg-primary hover:text-white text-text-body" 
                  : "opacity-50 cursor-not-allowed"
              )}
              aria-label="Quick add to cart"
            >
              <ShoppingCart size={18} variant="Outline" />
            </button>
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
        </div>

        {/* Price */}
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
