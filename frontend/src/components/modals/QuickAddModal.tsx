'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CloseCircle, Add, Minus, Heart } from 'iconsax-reactjs'
import { cn } from '@/lib/utils'
import { useUIStore, useCartStore, useWishlistStore } from '@/store'
import type { Product } from '@/data/products'

export default function QuickAddModal() {
  const { quickAdd, closeQuickAdd } = useUIStore()
  const { addItem } = useCartStore()
  const { toggleItem, isInWishlist } = useWishlistStore()

  const { isOpen, product } = quickAdd

  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || '')
      setSelectedColor(product.colors[0]?.name || '')
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
    addItem({
      productId: product.id,
      title: product.title,
      image: product.images[0],
      price: product.price,
      originalPrice: product.originalPrice,
      currency: product.currency,
      quantity,
      size: selectedSize,
      color: selectedColor,
      vendor: product.vendor,
      type: product.type,
      gender: product.gender,
      sku: product.sku,
      discount: product.discount,
    })
    closeQuickAdd()
  }, [product, selectedSize, selectedColor, quantity, addItem, closeQuickAdd])

  if (!isOpen || !product) return null

  const isFavorite = isInWishlist(product.id)

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
            aria-label="Close"
          >
            <CloseCircle size={28} variant="Bold" />
          </button>

          <div className="flex flex-col lg:flex-row">
            {/* Image Section */}
            <div className="lg:w-1/2 p-4 lg:p-6">
              {/* Main Image */}
              <div className="relative aspect-square bg-bg-card rounded-lg overflow-hidden mb-3">
                <Image
                  src={product.images[currentImageIndex]}
                  alt={product.title}
                  fill
                  className="object-contain p-4"
                />
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                  {product.images.map((img, idx) => (
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
                {product.title}
              </h2>

              {/* Price */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm text-text-body">Price:</span>
                <span className="font-roboto-condensed font-bold text-2xl lg:text-3xl text-secondary">
                  {product.price.toLocaleString()}
                </span>
                <span className="text-lg text-text-body">{product.currency}</span>
                {product.originalPrice && (
                  <span className="text-lg text-text-placeholder line-through">
                    {product.originalPrice.toLocaleString()} {product.currency}
                  </span>
                )}
              </div>

              {/* View Details Link */}
              <Link
                href={`/products/${product.id}`}
                onClick={closeQuickAdd}
                className="text-sm text-primary underline hover:text-secondary transition-colors mb-5 inline-block"
              >
                View Details
              </Link>

              {/* Sizes */}
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm text-text-body">Sizes:</span>
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
                  <span className="text-sm text-text-body">Colors:</span>
                  <div className="flex gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={cn(
                          'w-7 h-7 rounded border-2 transition-all',
                          selectedColor === color.name ? 'border-primary scale-110' : 'border-transparent'
                        )}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-text-body">Quantity:</span>
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
                  onClick={() => toggleItem(product.id)}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 py-3 border border-primary rounded-lg font-rubik font-medium transition-colors',
                    isFavorite ? 'bg-primary text-white' : 'bg-white text-primary hover:bg-gray-50'
                  )}
                >
                  <Heart size={20} variant={isFavorite ? 'Bold' : 'Outline'} />
                  <span>Add to wishlist</span>
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
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}