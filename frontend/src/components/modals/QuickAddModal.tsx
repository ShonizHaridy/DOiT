'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { CloseCircle, Add, Minus, Heart } from 'iconsax-reactjs'
import { cn } from '@/lib/utils'
import { getLocalized, type Locale } from '@/lib/i18n-utils'
import { resolveProductColorHex } from '@/data/product-variant-options'
import { useAddToWishlist, useRemoveFromWishlist } from '@/hooks/useWishlist'
import { useAuthStore, useUIStore, useCartStore, useWishlistStore } from '@/store'
import type { Product } from '@/types/product'

export default function QuickAddModal() {
  const { quickAdd, closeQuickAdd } = useUIStore()
  const { addItem } = useCartStore()
  const { isInWishlist } = useWishlistStore()
  const accessToken = useAuthStore((state) => state.accessToken)
  const openSignIn = useUIStore((state) => state.openSignIn)
  const addToWishlist = useAddToWishlist()
  const removeFromWishlist = useRemoveFromWishlist()
  const locale = useLocale()
  const t = useTranslations('product')

  const { isOpen, product } = quickAdd

  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || '')
      setSelectedColor(product.colors[0] || '')
      setQuantity(1)
      setCurrentImageIndex(0)
    }
  }, [product])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeQuickAdd()
    }
    if (isOpen) document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, closeQuickAdd])

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const handleAddToCart = useCallback(() => {
    if (!product || !selectedSize || !selectedColor) return
    const hasDiscount = product.discountPercentage > 0 && product.finalPrice < product.basePrice
    addItem({
      productId: product.id,
      title: getLocalized(product, 'name', locale as Locale),
      image: product.images[0]?.url || '/placeholder-product.png',
      price: product.finalPrice,
      originalPrice: hasDiscount ? product.basePrice : undefined,
      currency: 'EGP',
      quantity,
      size: selectedSize,
      color: selectedColor,
      vendor: product.vendor,
      type: product.type,
      gender: product.gender,
      sku: product.sku,
      discount: hasDiscount ? t('discountOff', { value: product.discountPercentage }) : undefined,
    })
    closeQuickAdd()
  }, [product, selectedSize, selectedColor, quantity, addItem, closeQuickAdd, locale, t])

  if (!isOpen || !product) return null

  const isFavorite = isInWishlist(product.id)
  const isPending = addToWishlist.isPending || removeFromWishlist.isPending
  const productName = getLocalized(product, 'name', locale as Locale)
  const imageUrls = product.images.map((image) => image.url)
  const hasDiscount = product.discountPercentage > 0 && product.finalPrice < product.basePrice

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-(--z-modal-backdrop)"
        onClick={closeQuickAdd}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-(--z-modal) flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-[850px] max-h-[90vh] overflow-auto">
          {/* Close Button */}
          <button
            onClick={closeQuickAdd}
            className="absolute top-3 end-3 z-10 text-text-body hover:text-primary transition-colors"
            aria-label={t('close')}
          >
            <CloseCircle size={28} variant="Bold" />
          </button>

          <div className="flex flex-col lg:flex-row">
            {/* Image Section */}
            <div className="lg:w-1/2 p-4 lg:p-6">
              {/* Main Image */}
              <div className="relative aspect-square bg-bg-card rounded-lg overflow-hidden mb-3">
                <Image
                  src={imageUrls[currentImageIndex] || '/placeholder-product.png'}
                  alt={productName}
                  fill
                  className="object-contain p-4"
                />
              </div>

              {/* Thumbnails */}
              {imageUrls.length > 1 && (
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                  {imageUrls.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={cn(
                        'relative w-16 h-16 lg:w-20 lg:h-20 shrink-0 rounded border-2 overflow-hidden transition-colors',
                        currentImageIndex === idx ? 'border-primary' : 'border-transparent'
                      )}
                    >
                      <Image src={img} alt="" fill className="object-contain p-1" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="lg:w-1/2 p-4 lg:p-6 lg:ps-0">
              <h2 className="font-roboto font-bold text-lg lg:text-xl text-primary uppercase mb-3">
                {productName}
              </h2>

              {/* Price */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm text-text-body">{t('price')}:</span>
                <span className="font-roboto-condensed font-bold text-2xl lg:text-3xl text-secondary">
                  {product.finalPrice.toLocaleString()}
                </span>
                <span className="text-lg text-text-body">EGP</span>
                {hasDiscount && (
                  <span className="text-lg text-text-placeholder line-through">
                    {product.basePrice.toLocaleString()} EGP
                  </span>
                )}
              </div>

              {/* View Details Link */}
              <Link
                href={`/${locale}/products/${product.id}`}
                onClick={closeQuickAdd}
                className="text-sm text-primary underline hover:text-secondary transition-colors mb-5 inline-block"
              >
                {t('viewDetails')}
              </Link>

              {/* Sizes */}
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-2">
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
                </div>
              </div>

              {/* Colors & Quantity Row */}
              <div className="flex items-center gap-6 mb-6">
                {/* Colors */}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-text-body">{t('colors')}:</span>
                  <div className="flex gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={cn(
                          'w-7 h-7 rounded border-2 transition-all',
                          selectedColor === color ? 'border-primary scale-110' : 'border-transparent'
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
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-7 h-7 flex items-center justify-center border border-border-light rounded-full text-text-body hover:border-primary transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center border border-border-light rounded-full text-text-body hover:border-primary transition-colors"
                    >
                      <Add size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
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
                    'flex-1 flex items-center justify-center gap-2 py-3 border border-primary rounded-lg font-rubik font-medium transition-colors',
                    isFavorite ? 'bg-primary text-white' : 'bg-white text-primary hover:bg-gray-50',
                    isPending && 'opacity-60 cursor-not-allowed'
                  )}
                >
                  <Heart size={20} variant={isFavorite ? 'Bold' : 'Outline'} />
                  <span>{t('addToWishlist')}</span>
                </button>

                <button
                  onClick={handleAddToCart}
                  disabled={!selectedSize || !selectedColor}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-lg font-rubik font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 01-8 0"/>
                  </svg>
                  <span>{t('addToCart')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
