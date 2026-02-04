'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingCart } from 'iconsax-reactjs'
import { cn } from '@/lib/utils'
import { useWishlistStore, useUIStore } from '@/store'
import type { Product } from '@/data/products'

interface CategoryProductCardProps {
  product: Product
  locale: string
  className?: string
}

export default function CategoryProductCard({ product, locale, className }: CategoryProductCardProps) {
  const { toggleItem, isInWishlist } = useWishlistStore()
  const { openQuickAdd } = useUIStore()

  const isFavorite = isInWishlist(product.id)

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    openQuickAdd(product)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleItem(product.id)
  }

  return (
    <article className={cn('flex flex-col bg-white rounded-lg overflow-hidden border border-gray-100', className)}>
      {/* Image */}
      <Link href={`/${locale}/products/${product.id}`} className="relative aspect-square bg-white overflow-hidden group">
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </Link>

      {/* Content */}
      <div className="flex flex-col p-3 lg:p-4 gap-1">
        {/* Title Row with Actions */}
        <div className="flex items-start justify-between gap-2">
          <Link href={`/${locale}/products/${product.id}`} className="flex-1">
            <h3 className="font-roboto font-medium text-sm lg:text-base text-primary line-clamp-2 hover:text-secondary transition-colors">
              {product.title}
            </h3>
          </Link>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleQuickAdd}
              className="w-8 h-8 lg:w-9 lg:h-9 flex items-center justify-center bg-bg-card rounded hover:bg-primary hover:text-white text-text-body transition-colors"
              aria-label="Quick add to cart"
            >
              <ShoppingCart size={18} variant="Outline" />
            </button>
            <button
              onClick={handleWishlist}
              className={cn(
                'w-8 h-8 lg:w-9 lg:h-9 flex items-center justify-center rounded transition-colors',
                isFavorite ? 'bg-secondary text-white' : 'bg-transparent text-text-body hover:text-secondary'
              )}
              aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart size={18} variant={isFavorite ? 'Bold' : 'Outline'} />
            </button>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-body">Price:</span>
          <span className="font-rubik font-bold text-base lg:text-lg text-secondary">
            {product.price.toLocaleString()} {product.currency}
          </span>
        </div>
      </div>
    </article>
  )
}