'use client'

import { useTranslations } from 'next-intl'
import CategoryProductCard from '@/components/products/CategoryProductCard'
import { useWishlistStore } from '@/store'
import { PRODUCTS } from '@/data/products'
import PageTitleBanner from '@/components/layout/PageTitleBanner'
// import RedBlockText from '@/components/layout/RedBlockText'

interface WishlistContentProps {
  locale: string
}

export default function WishlistContent({ locale }: WishlistContentProps) {
  const t = useTranslations('wishlist')
  const { items } = useWishlistStore()

  const wishlistProducts = PRODUCTS.filter(product => items.includes(product.id))

  return (
    <div className="min-h-screen bg-white">
      {/* Page Title */}
      <PageTitleBanner title={t('title')} />

      {/* Products Grid */}
      <div className="container-doit py-6 lg:py-12">
        {wishlistProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 lg:py-24">
            <p className="font-rubik text-lg lg:text-xl text-text-body text-center">
              {t('empty')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {wishlistProducts.map((product) => (
              <CategoryProductCard
                key={product.id}
                product={product}
                locale={locale}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}