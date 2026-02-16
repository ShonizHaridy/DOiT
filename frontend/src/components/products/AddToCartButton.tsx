'use client'

import Link from 'next/link'
import { ShoppingCart } from 'iconsax-reactjs'
import { useLocale, useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { useCartStore, useUIStore } from '@/store'
import type { Product } from '@/types/product'

interface AddToCartButtonProps {
  product: Product
  disabled?: boolean
  className?: string
}

export default function AddToCartButton({
  product,
  disabled,
  className,
}: AddToCartButtonProps) {
  const { openQuickAdd } = useUIStore()
  const cartItems = useCartStore((state) => state.items)
  const locale = useLocale()
  const t = useTranslations('product')
  const isInCart = cartItems.some((item) => item.productId === product.id)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (disabled) return
    openQuickAdd(product)
  }

  if (isInCart) {
    return (
      <Link
        href={`/${locale}/checkout`}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          className,
          'inline-flex items-center justify-center rounded bg-secondary px-2 text-[10px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-secondary/90',
          'h-7 w-auto min-w-[74px]'
        )}
        aria-label={t('goToCheckout')}
      >
        {t('goToCheckout')}
      </Link>
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'w-7 h-7 flex items-center justify-center bg-primary rounded',
        'hover:bg-primary/80 transition-colors',
        disabled && 'opacity-60 cursor-not-allowed',
        className
      )}
      aria-label={t('addToCart')}
    >
      <ShoppingCart size={16} color="#FFFFFF" variant="Bulk" />
    </button>
  )
}
