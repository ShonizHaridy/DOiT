'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, Add, Minus, TruckFast, SearchZoomIn1 } from 'iconsax-reactjs'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { getLocalized, getLocalizedArray, type Locale } from '@/lib/i18n-utils'
import { resolveProductColorHex } from '@/data/product-variant-options'
import { useAddToWishlist, useRemoveFromWishlist } from '@/hooks/useWishlist'
import { useAuthStore, useCartStore, useUIStore, useWishlistStore } from '@/store'
import type { Product } from '@/types/product'

interface ProductDetailProps {
  product: Product
  locale: string
}

export default function ProductDetail({ product, locale }: ProductDetailProps) {
  const t = useTranslations('product')
  const { addItem, openCart } = useCartStore()
  const cartItems = useCartStore((state) => state.items)
  const { isInWishlist } = useWishlistStore()
  const { openSizeChart, openSignIn } = useUIStore()
  const accessToken = useAuthStore((state) => state.accessToken)
  const addToWishlist = useAddToWishlist()
  const removeFromWishlist = useRemoveFromWishlist()

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || '')
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || '')
  const [quantity, setQuantity] = useState(1)

  const isFavorite = isInWishlist(product.id)
  const isPending = addToWishlist.isPending || removeFromWishlist.isPending
  const productName = getLocalized(product, 'name', locale as Locale)
  const description = getLocalized(product, 'description', locale as Locale)
  const details = getLocalizedArray(product, 'details', locale as Locale)
  const imageUrls = product.images.map((image) => image.url)
  const selectedVariantStock = product.variants?.find(
    (variant) => variant.size === selectedSize && variant.color === selectedColor
  )?.quantity
  const quantityLimit = Math.max(
    0,
    typeof selectedVariantStock === 'number' ? selectedVariantStock : product.totalStock
  )
  const effectiveQuantity = quantityLimit < 1 ? 1 : Math.min(quantity, quantityLimit)
  const inStock = product.availability !== 'out-of-stock' && quantityLimit > 0
  const hasDiscount = product.discountPercentage > 0 && product.finalPrice < product.basePrice
  const productInCart = useMemo(
    () => cartItems.some((item) => item.productId === product.id),
    [cartItems, product.id]
  )
  const genderLabelMap: Record<string, string> = {
    MEN: t('genderValues.men'),
    WOMEN: t('genderValues.women'),
    KIDS: t('genderValues.kids'),
    UNISEX: t('genderValues.unisex'),
  }
  const genderLabel = genderLabelMap[product.gender] ?? product.gender
  const availabilityLabel = product.availability === 'in-stock'
    ? t('inStock')
    : product.availability === 'low-stock'
      ? t('lowStock')
      : t('outOfStock')

  const handleAddToCart = () => {
    if (quantityLimit < 1) return
    addItem({
      productId: product.id,
      title: productName,
      image: imageUrls[0] || '/placeholder-product.png',
      price: product.finalPrice,
      originalPrice: hasDiscount ? product.basePrice : undefined,
      currency: 'EGP',
      quantity: effectiveQuantity,
      maxQuantity: quantityLimit,
      size: selectedSize,
      color: selectedColor,
      vendor: product.vendor,
      type: product.type,
      gender: product.gender,
      sku: product.sku,
      discount: hasDiscount ? t('discountOff', { value: product.discountPercentage }) : undefined,
    })
    openCart()
  }

  const handleWishlist = () => {
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
    <div className="max-w-[1200px] mx-auto px-4 lg:px-6 py-6 lg:py-10">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
        {/* Image Gallery */}
        <div className="lg:w-1/2">
          {/* Main Image */}
          <div className="relative aspect-square bg-bg-card rounded-lg overflow-hidden mb-3 group">
            <Image
              src={imageUrls[currentImageIndex] || '/placeholder-product.png'}
              alt={productName}
              fill
              className="object-contain p-6"
              priority
            />
            {/* Mobile: Heart & Zoom buttons */}
            <div className="absolute top-3 end-3 flex flex-col gap-2 lg:hidden">
              <button
                onClick={handleWishlist}
                disabled={isPending}
                className={cn(
                  'w-10 h-10 flex items-center justify-center rounded-full transition-colors',
                  isFavorite ? 'bg-secondary text-white' : 'bg-white text-text-body shadow',
                  isPending && 'opacity-60 cursor-not-allowed'
                )}
              >
                <Heart size={20} variant={isFavorite ? 'Bold' : 'Outline'} />
              </button>
              <button className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow text-text-body">
                <SearchZoomIn1 size={20} />
              </button>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {imageUrls.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={cn(
                  'relative w-16 h-16 lg:w-20 lg:h-20 shrink-0 rounded-lg border-2 overflow-hidden bg-bg-card transition-colors',
                  currentImageIndex === idx ? 'border-primary' : 'border-transparent'
                )}
              >
                <Image src={img} alt="" fill className="object-contain p-1" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:w-1/2">
          <h1 className="font-roboto font-bold text-xl lg:text-2xl text-primary uppercase mb-4">
            {productName}
          </h1>

          {/* Price */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-text-body">{t('price')}:</span>
            <span className="font-roboto-condensed font-bold text-3xl lg:text-4xl text-secondary">
              {product.finalPrice.toLocaleString()}
            </span>
            <span className="text-lg text-text-body">EGP</span>
            {hasDiscount && (
              <span className="text-lg text-text-placeholder line-through">
                {product.basePrice.toLocaleString()} EGP
              </span>
            )}
          </div>

          {/* Discount Badge */}
          {hasDiscount && (
            <div className="flex items-center gap-1 text-sm text-green-600 mb-4">
              <span className="text-secondary">&bull;</span>
              <span>{t('discountOff', { value: product.discountPercentage })}</span>
            </div>
          )}

          {/* Product Meta */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm mb-4">
            <div className="flex gap-2">
              <span className="text-text-body">{t('vendor')}</span>
              <span className="font-medium text-primary">{product.vendor}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-text-body">{t('type')}</span>
              <span className="font-medium text-primary">{product.type}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-text-body">{t('availability')}</span>
              <span className={cn('font-medium', inStock ? 'text-green-600' : 'text-red-500')}>
                {availabilityLabel}
              </span>
            </div>
            <div className="flex gap-2">
              <span className="text-text-body">{t('gender')}</span>
              <span className="font-medium text-primary">{genderLabel}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-text-body">{t('sku')}</span>
              <span className="font-medium text-primary">{product.sku}</span>
            </div>
          </div>

          {/* Description */}
          {description && (
            <p className="text-sm text-text-body mb-6 leading-relaxed">
              {description}
            </p>
          )}

          {/* Sizes */}
          <div className="mb-4">
            <div className="flex items-center flex-wrap gap-3 mb-2">
              <span className="text-sm text-text-body">{t('sizes')}:</span>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      'px-3 py-1.5 text-sm border rounded transition-colors',
                      selectedSize === size
                        ? 'border-primary bg-primary text-white'
                        : 'border-border-light text-text-body hover:border-primary'
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <button
                onClick={() => openSizeChart(product.id)}
                className="px-3 py-1.5 text-sm border border-primary text-primary rounded hover:bg-primary hover:text-white transition-colors"
              >
                {t('sizeChart')}
              </button>
            </div>
          </div>

          {/* Colors & Quantity Row - Desktop */}
          <div className="hidden lg:flex items-center gap-8 mb-6">
            {/* Colors */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-text-body">{t('colors')}:</span>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      'w-8 h-8 rounded border-2 transition-all',
                      selectedColor === color ? 'border-primary scale-110' : 'border-gray-300'
                    )}
                    style={{ backgroundColor: resolveProductColorHex(color) }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-text-body">{t('quantity')}:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, effectiveQuantity - 1))}
                  disabled={effectiveQuantity <= 1}
                  className="w-7 h-7 flex items-center justify-center border border-border-light rounded-full hover:border-primary transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center font-medium">{effectiveQuantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(quantityLimit, effectiveQuantity + 1))}
                  disabled={quantityLimit < 1 || effectiveQuantity >= quantityLimit}
                  className="w-7 h-7 flex items-center justify-center border border-border-light rounded-full hover:border-primary transition-colors"
                >
                  <Add size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile: Colors, Size Chart, Quantity */}
          <div className="lg:hidden mb-4">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => openSizeChart(product.id)}
                className="px-4 py-2 text-sm border border-primary text-primary rounded hover:bg-primary hover:text-white transition-colors"
              >
                {t('sizeChart')}
              </button>
              <div className="flex items-center gap-3">
                <span className="text-sm text-text-body">{t('quantity')}:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, effectiveQuantity - 1))}
                    disabled={effectiveQuantity <= 1}
                    className="w-7 h-7 flex items-center justify-center border border-border-light rounded-full"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center font-medium">{effectiveQuantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(quantityLimit, effectiveQuantity + 1))}
                    disabled={quantityLimit < 1 || effectiveQuantity >= quantityLimit}
                    className="w-7 h-7 flex items-center justify-center border border-border-light rounded-full"
                  >
                    <Add size={14} />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm text-text-body">{t('colors')}:</span>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      'w-8 h-8 rounded border-2 transition-all',
                      selectedColor === color ? 'border-primary scale-110' : 'border-gray-300'
                    )}
                    style={{ backgroundColor: resolveProductColorHex(color) }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Mobile: Add to Cart Button (Full Width) */}
          {productInCart ? (
            <Link
              href={`/${locale}/checkout`}
              className="lg:hidden w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded font-rubik font-medium hover:bg-primary/90 transition-colors mb-6"
            >
              <span>{t('goToCheckout')}</span>
            </Link>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className="lg:hidden w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded font-rubik font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-6"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              <span>{t('addToCart')}</span>
            </button>
          )}

          {/* Desktop: Action Buttons */}
          <div className="hidden lg:flex gap-4 mb-6">
            <button
              onClick={handleWishlist}
              disabled={isPending}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-3 border border-primary rounded-lg font-rubik font-medium transition-colors',
                isFavorite ? 'bg-primary text-white' : 'text-primary hover:bg-gray-50',
                isPending && 'opacity-60 cursor-not-allowed'
              )}
            >
              <Heart size={20} variant={isFavorite ? 'Bold' : 'Outline'} />
              <span>{t('addToWishlist')}</span>
            </button>
            {productInCart ? (
              <Link
                href={`/${locale}/checkout`}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-lg font-rubik font-medium hover:bg-primary/90 transition-colors"
              >
                <span>{t('goToCheckout')}</span>
              </Link>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-lg font-rubik font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
                <span>{t('addToCart')}</span>
              </button>
            )}
          </div>

          {/* Details */}
          {details.length > 0 && (
            <div className="mb-6">
              <h3 className="font-roboto font-bold text-base mb-3">{t('detailsTitle')}:</h3>
              <ul className="list-disc list-inside text-sm text-text-body space-y-1">
                {details.map((detail, idx) => (
                  <li key={idx}>{detail}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Free Delivery Notice */}
          <div className="flex items-center gap-2 text-sm text-green-600 mb-4">
            <TruckFast size={18} />
            <span>{t('freeDelivery', { amount: '999' })}</span>
          </div>

          {/* Return Policy */}
          <div className="text-sm">
            <p className="font-bold text-primary mb-1">{t('returnTitle')}</p>
            <p className="text-text-body">
              {t('returnBody')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
