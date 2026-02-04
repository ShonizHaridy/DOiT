'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Heart, Add, Minus, TruckFast, SearchZoomIn1 } from 'iconsax-reactjs'
import { cn } from '@/lib/utils'
import { useCartStore, useWishlistStore, useUIStore } from '@/store'
import type { Product } from '@/data/products'

interface ProductDetailProps {
  product: Product
  locale: string
}

export default function ProductDetail({ product, locale }: ProductDetailProps) {
  const { addItem, openCart } = useCartStore()
  const { toggleItem, isInWishlist } = useWishlistStore()
  const { openSizeChart } = useUIStore()

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || '')
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '')
  const [quantity, setQuantity] = useState(1)

  const isFavorite = isInWishlist(product.id)

  const handleAddToCart = () => {
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
    openCart()
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 lg:px-6 py-6 lg:py-10">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
        {/* Image Gallery */}
        <div className="lg:w-1/2">
          {/* Main Image */}
          <div className="relative aspect-square bg-bg-card rounded-lg overflow-hidden mb-3 group">
            <Image
              src={product.images[currentImageIndex]}
              alt={product.title}
              fill
              className="object-contain p-6"
              priority
            />
            {/* Mobile: Heart & Zoom buttons */}
            <div className="absolute top-3 end-3 flex flex-col gap-2 lg:hidden">
              <button
                onClick={() => toggleItem(product.id)}
                className={cn(
                  'w-10 h-10 flex items-center justify-center rounded-full transition-colors',
                  isFavorite ? 'bg-secondary text-white' : 'bg-white text-text-body shadow'
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
            {product.images.map((img, idx) => (
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
            {product.title}
          </h1>

          {/* Price */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-text-body">Price:</span>
            <span className="font-roboto-condensed font-bold text-3xl lg:text-4xl text-secondary">
              {product.price.toLocaleString()}
            </span>
            <span className="text-lg text-text-body">{product.currency}</span>
            {product.originalPrice && (
              <span className="text-lg text-text-placeholder line-through">
                {product.originalPrice.toLocaleString()} {product.currency}
              </span>
            )}
          </div>

          {/* Discount Badge */}
          {product.discount && (
            <div className="flex items-center gap-1 text-sm text-green-600 mb-4">
              <span className="text-secondary">⊛</span>
              <span>{product.discount}</span>
            </div>
          )}

          {/* Product Meta */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm mb-4">
            <div className="flex gap-2">
              <span className="text-text-body">Vendor</span>
              <span className="font-medium text-primary">{product.vendor}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-text-body">Type</span>
              <span className="font-medium text-primary">{product.type}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-text-body">Availability</span>
              <span className={cn('font-medium', product.inStock ? 'text-green-600' : 'text-red-500')}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            <div className="flex gap-2">
              <span className="text-text-body">Gender</span>
              <span className="font-medium text-primary">{product.gender}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-text-body">SKU</span>
              <span className="font-medium text-primary">{product.sku}</span>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-sm text-text-body mb-6 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Sizes */}
          <div className="mb-4">
            <div className="flex items-center flex-wrap gap-3 mb-2">
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
              <button
                onClick={() => openSizeChart(product.id)}
                className="px-3 py-1.5 text-sm border border-primary text-primary rounded hover:bg-primary hover:text-white transition-colors"
              >
                Size Chart
              </button>
            </div>
          </div>

          {/* Colors & Quantity Row - Desktop */}
          <div className="hidden lg:flex items-center gap-8 mb-6">
            {/* Colors */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-text-body">Colors:</span>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={cn(
                      'w-8 h-8 rounded border-2 transition-all',
                      selectedColor === color.name ? 'border-primary scale-110' : 'border-gray-300'
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
                  className="w-7 h-7 flex items-center justify-center border border-border-light rounded-full hover:border-primary transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
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
                Size Chart
              </button>
              <div className="flex items-center gap-3">
                <span className="text-sm text-text-body">Quantity:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 flex items-center justify-center border border-border-light rounded-full"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center border border-border-light rounded-full"
                  >
                    <Add size={14} />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm text-text-body">Colors:</span>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={cn(
                      'w-8 h-8 rounded border-2 transition-all',
                      selectedColor === color.name ? 'border-primary scale-110' : 'border-gray-300'
                    )}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Mobile: Add to Cart Button (Full Width) */}
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="lg:hidden w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded font-rubik font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-6"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            <span>ADD TO CART</span>
          </button>

          {/* Desktop: Action Buttons */}
          <div className="hidden lg:flex gap-4 mb-6">
            <button
              onClick={() => toggleItem(product.id)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-3 border border-primary rounded-lg font-rubik font-medium transition-colors',
                isFavorite ? 'bg-primary text-white' : 'text-primary hover:bg-gray-50'
              )}
            >
              <Heart size={20} variant={isFavorite ? 'Bold' : 'Outline'} />
              <span>Add to wishlist</span>
            </button>
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
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

          {/* Details */}
          {product.details && (
            <div className="mb-6">
              <h3 className="font-roboto font-bold text-base mb-3">DETAILS:</h3>
              <ul className="list-disc list-inside text-sm text-text-body space-y-1">
                {product.details.map((detail, idx) => (
                  <li key={idx}>{detail}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Free Delivery Notice */}
          <div className="flex items-center gap-2 text-sm text-green-600 mb-4">
            <TruckFast size={18} />
            <span>Free Delivery over 999 EGP</span>
          </div>

          {/* Return Policy */}
          <div className="text-sm">
            <p className="font-bold text-primary mb-1">NOT THE RIGHT SIZE OR COLOR?</p>
            <p className="text-text-body">
              No problem, we offer free size exchanges for 60 days and we have free return service.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}