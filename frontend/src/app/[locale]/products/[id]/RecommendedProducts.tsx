'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'iconsax-reactjs'
import { cn } from '@/lib/utils'
import { getLocalized, type Locale } from '@/lib/i18n-utils'
import { useAddToWishlist, useRemoveFromWishlist } from '@/hooks/useWishlist'
import { useAuthStore, useUIStore, useWishlistStore } from '@/store'
import type { Product } from '@/types/product'

interface RecommendedProductsProps {
  products: Product[]
  locale: string
}

function RecommendedCard({ product, locale }: { product: Product; locale: string }) {
  const { isInWishlist } = useWishlistStore()
  const accessToken = useAuthStore((state) => state.accessToken)
  const openSignIn = useUIStore((state) => state.openSignIn)
  const addToWishlist = useAddToWishlist()
  const removeFromWishlist = useRemoveFromWishlist()
  const isFavorite = isInWishlist(product.id)
  const isPending = addToWishlist.isPending || removeFromWishlist.isPending
  const productName = getLocalized(product, 'name', locale as Locale)
  const imageUrl = product.images[0]?.url || '/placeholder-product.png'
  const displayPrice = product.discountPercentage > 0 ? product.finalPrice : product.basePrice

  return (
    <article className="flex flex-col shrink-0 w-40 lg:w-48">
      <Link href={`/${locale}/products/${product.id}`} className="relative aspect-square bg-bg-card rounded-lg overflow-hidden mb-2">
        <Image
          src={imageUrl}
          alt={productName}
          fill
          className="object-contain p-3"
          sizes="200px"
        />
      </Link>
      <Link href={`/${locale}/products/${product.id}`}>
        <h3 className="font-roboto text-sm text-primary line-clamp-2 mb-1 hover:text-secondary transition-colors">
          {productName}
        </h3>
      </Link>
      <div className="flex items-center justify-between">
        <span className="font-rubik font-bold text-base text-secondary">
          {displayPrice.toLocaleString()} <span className="text-xs font-normal">EGP</span>
        </span>
        <button
          onClick={() => {
            if (!accessToken) {
              openSignIn()
              return
            }
            if (isFavorite) {
              removeFromWishlist.mutate(product.id)
              return
            }
            addToWishlist.mutate(product.id)
          }}
          disabled={isPending}
          className={cn(
            'w-7 h-7 flex items-center justify-center rounded transition-colors',
            isFavorite ? 'text-secondary' : 'text-text-body hover:text-secondary',
            isPending && 'opacity-60 cursor-not-allowed'
          )}
        >
          <Heart size={18} variant={isFavorite ? 'Bold' : 'Outline'} />
        </button>
      </div>
    </article>
  )
}

export default function RecommendedProducts({ products, locale }: RecommendedProductsProps) {
  if (products.length === 0) return null

  return (
    <section className="bg-white py-8 lg:py-12">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
        <h2 className="font-roboto font-medium text-xl lg:text-2xl text-primary mb-6">
          You may also like
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {products.map((product) => (
            <RecommendedCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  )
}
