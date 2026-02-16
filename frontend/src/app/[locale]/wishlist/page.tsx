'use client'

import { useLocale, useTranslations } from 'next-intl'
import ProductCard from '@/components/products/ProductCard'
import { useWishlist } from '@/hooks/useWishlist'
import { useAuthStore, useUIStore } from '@/store'
import PageTitleBanner from '@/components/layout/PageTitleBanner'
import { getLocalized, type Locale } from '@/lib/i18n-utils'
// import RedBlockText from '@/components/layout/RedBlockText'

export default function WishlistPage() {
  const locale = useLocale()
  const t = useTranslations('wishlist')
  const tAuth = useTranslations('auth')
  const accessToken = useAuthStore((state) => state.accessToken)
  const openSignIn = useUIStore((state) => state.openSignIn)
  const isSignedIn = Boolean(accessToken)
  const { data: wishlistItems = [], isLoading } = useWishlist({ enabled: isSignedIn })

  return (
    <div className="min-h-screen bg-white">
      {/* Page Title */}
      <PageTitleBanner title={t('title')} />

      {/* Products Grid */}
      <div className="container-doit py-6 lg:py-12">
        {!isSignedIn ? (
          <div className="flex flex-col items-center justify-center py-16 lg:py-24 gap-4">
            <p className="font-rubik text-lg lg:text-xl text-text-body text-center">
              {t('signInPrompt')}
            </p>
            <button
              onClick={openSignIn}
              className="px-6 py-2.5 bg-primary text-white font-rubik font-medium rounded hover:bg-primary/90 transition-colors"
            >
              {tAuth('signIn')}
            </button>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 lg:py-24">
            <p className="font-rubik text-lg lg:text-xl text-text-body text-center">
              Loading...
            </p>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 lg:py-24">
            <p className="font-rubik text-lg lg:text-xl text-text-body text-center">
              {t('empty')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {wishlistItems.map((item) => {
              const product = item.product
              const price =
                product.discountPercentage > 0 ? product.finalPrice : product.basePrice
              const originalPrice =
                product.discountPercentage > 0 ? product.basePrice : undefined

              return (
                <ProductCard
                  key={item.id}
                  id={product.id}
                  title={getLocalized(product, 'name', locale as Locale)}
                  image={product.images[0] ?? '/placeholder-product.png'}
                  price={price}
                  originalPrice={originalPrice}
                  currency="EGP"
                  href={`/${locale}/products/${product.id}`}
                  variant="simple"
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
