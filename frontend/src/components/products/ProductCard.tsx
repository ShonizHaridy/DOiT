import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import FavoriteButton from '@/components/products/FavoriteButton'
import AddToCartButton from '@/components/products/AddToCartButton'
import { cn } from '@/lib/utils'
import type { Product } from '@/types/product'

export type ProductCardVariant = 'full' | 'simple' | 'minimal'

export interface ProductCardProps {
  id: string
  title: string
  image: string
  href: string
  price: number
  currency?: string
  variant?: ProductCardVariant
  colors?: string[]
  sizes?: string[]
  gender?: string
  availability?: string
  discountPercentage?: number
  originalPrice?: number
  addToCartVariant?: 'direct' | 'quick'
  quickAddProduct?: Product
  showImage?: boolean
  showFavorite?: boolean
  showPriceLabel?: boolean
  className?: string
}

export default function ProductCard({
  id,
  title,
  image,
  href,
  price,
  currency = 'EGP',
  variant = 'full',
  colors = [],
  sizes = [],
  gender,
  availability,
  discountPercentage,
  originalPrice,
  addToCartVariant,
  quickAddProduct,
  showImage,
  showFavorite,
  showPriceLabel,
  className,
}: ProductCardProps) {
  const t = useTranslations('product')
  const resolvedShowImage = showImage ?? true
  const resolvedShowFavorite = showFavorite ?? true
  const resolvedShowPriceLabel = showPriceLabel ?? variant !== 'minimal'
  const showAddToCart =
    variant === 'full' ||
    addToCartVariant === 'quick' ||
    addToCartVariant === 'direct'

  const genderLabels: Record<string, string> = {
    MEN: t('genderValues.men'),
    WOMEN: t('genderValues.women'),
    KIDS: t('genderValues.kids'),
    UNISEX: t('genderValues.unisex'),
  }
  const genderLabel = gender ? genderLabels[gender] ?? gender : ''

  const formattedPrice = price.toLocaleString()
  const formattedOriginalPrice =
    typeof originalPrice === 'number' ? originalPrice.toLocaleString() : ''
  const hasDiscount =
    typeof originalPrice === 'number' && originalPrice > price
  const isOutOfStock = availability === 'out-of-stock'

  if (variant === 'minimal') {
    return (
      <article className={cn('flex flex-col', className)}>
        {resolvedShowImage && (
          <Link
            href={href}
            className="relative aspect-square bg-bg-card rounded-lg overflow-hidden mb-2"
          >
            <Image
              src={image}
              alt={title}
              fill
              className="object-contain p-3"
              sizes="200px"
            />
          </Link>
        )}
        <Link href={href}>
          <h3 className="font-roboto text-sm text-primary line-clamp-2 mb-1 hover:text-secondary transition-colors">
            {title}
          </h3>
        </Link>
        <div className="flex items-center justify-between">
          <span className="font-rubik font-bold text-base text-secondary">
            {formattedPrice}{' '}
            <span className="text-xs font-normal">{currency}</span>
          </span>
          {resolvedShowFavorite && (
            <FavoriteButton productId={id} size={18} />
          )}
        </div>
      </article>
    )
  }

  if (variant === 'simple') {
    return (
      <article
        className={cn(
          'flex flex-col bg-white rounded-lg overflow-hidden border border-gray-100',
          className
        )}
      >
        {resolvedShowImage && (
          <Link
            href={href}
            className="relative aspect-square bg-white overflow-hidden group"
          >
            <Image
              src={image}
              alt={title}
              fill
              className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />

            {typeof discountPercentage === 'number' &&
              discountPercentage > 0 && (
                <div className="absolute top-2 start-2 bg-secondary text-white px-2 py-1 rounded text-xs font-bold">
                  -{discountPercentage}%
                </div>
              )}

            {isOutOfStock && (
              <div className="absolute top-2 end-2 bg-gray-800 text-white px-2 py-1 rounded text-xs font-medium">
                {t('outOfStock')}
              </div>
            )}
          </Link>
        )}

        <div className="flex flex-col p-3 lg:p-4 gap-1">
          <div className="flex items-start justify-between gap-2">
            <Link href={href} className="flex-1">
              <h3 className="font-roboto font-medium text-sm lg:text-base text-primary line-clamp-2 hover:text-secondary transition-colors">
                {title}
              </h3>
            </Link>
            <div className="flex items-center gap-1.5 shrink-0">
              {showAddToCart && quickAddProduct && (
                <AddToCartButton
                  product={quickAddProduct}
                  disabled={isOutOfStock}
                  className="w-8 h-8 lg:w-9 lg:h-9"
                />
              )}
              {resolvedShowFavorite && (
                <FavoriteButton productId={id} size={18} />
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {resolvedShowPriceLabel && (
              <span className="font-rubik font-normal text-text-body">
                {t('price')}:
              </span>
            )}
            <span className="font-rubik font-bold text-base lg:text-lg text-secondary">
              {formattedPrice} {currency}
            </span>
            {hasDiscount && (
              <span className="font-rubik text-sm text-gray-400 line-through">
                {formattedOriginalPrice} {currency}
              </span>
            )}
          </div>
        </div>
      </article>
    )
  }

  return (
    <article
      className={cn(
        'flex flex-col bg-bg-search rounded-lg overflow-hidden shadow-card-40 z-(--z-content)',
        className
      )}
    >
      {/* Image with Heart Icon */}
      <Link
        href={href}
        className="relative aspect-video bg-bg-search overflow-hidden group"
      >
        <Image
          src={image}
          alt={title}
          fill
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Heart Icon - Top Right */}
        {resolvedShowFavorite && (
          <div className="absolute top-2 right-2 lg:hidden">
            <FavoriteButton productId={id} size={24} className="" />
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col gap-1.5 p-3 bg-bg-search">
        {/* Title Row with Add to Cart */}
        <div className="flex items-start justify-between gap-2">
          <Link href={href} className="flex-1">
            <h3 className="font-roboto font-medium text-sm md:text-base leading-6 tracking-[0.15px] text-text-card-title hover:text-secondary transition-colors">
              {title}
            </h3>
          </Link>

          {/* Add to Cart Button */}
          <div className="flex items-center gap-2 shrink-0">
            {showAddToCart && quickAddProduct && (
              <AddToCartButton
                product={quickAddProduct}
                className="w-7 h-7"
              />
            )}
            {resolvedShowFavorite && (
              <div className="hidden lg:block">
                <FavoriteButton productId={id} />
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-1 lg:gap-4 text-sm lg:text-xl">
          {/* Colors */}
          {colors.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="font-rubik font-normal text-text-body">
                {t('colors')}:
              </span>
              <div className="flex gap-1">
                {colors.slice(0, 4).map((color, index) => (
                  <div
                    key={index}
                    className="w-4 h-4 rounded-sm border border-gray-300"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {sizes.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="font-rubik font-normal text-text-body">
                {t('sizes')}:
              </span>
              <span className="font-rubik font-normal text-text-body">
                {sizes.join('/ ')}
              </span>
            </div>
          )}

          {/* Gender */}
          {genderLabel && (
            <div className="flex items-center gap-2">
              <span className="font-rubik font-normal text-text-body">
                {t('gender')}:
              </span>
              <span className="font-rubik font-normal text-text-body">
                {genderLabel}
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-rubik font-normal text-text-body">
              {t('price')}:
            </span>
            <span className="font-rubik font-semibold text-secondary">
              {formattedPrice} {currency}
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}
