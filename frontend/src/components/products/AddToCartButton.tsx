'use client'

import { ShoppingCart } from 'iconsax-reactjs'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/store'

interface AddToCartButtonProps {
  productId: string
  title: string
  image: string
  price: number
  currency?: string
  sizes?: string[]
  colors?: string[]
  vendor?: string
  type?: string
  gender?: string
  sku?: string
  discount?: string
  quantity?: number
  className?: string
}

export default function AddToCartButton({
  productId,
  title,
  image,
  price,
  currency = 'EGP',
  sizes = [],
  colors = [],
  vendor,
  type,
  gender,
  sku,
  discount,
  quantity = 1,
  className,
}: AddToCartButtonProps) {
  const { addItem, openCart } = useCartStore()
  const t = useTranslations('product')

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const size = sizes[0] || t('oneSize')
    const color = colors[0] || t('defaultColor')
    addItem({
      productId,
      title,
      image,
      price,
      currency,
      quantity,
      size,
      color,
      vendor,
      type,
      gender,
      sku,
      discount,
    })
    openCart()
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'w-7 h-7 flex items-center justify-center bg-primary rounded',
        'hover:bg-primary/80 transition-colors',
        className
      )}
      aria-label={t('addToCart')}
    >
      <ShoppingCart size={16} color="#FFFFFF" variant="Bulk" />
    </button>
  )
}
