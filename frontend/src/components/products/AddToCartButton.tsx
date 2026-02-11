'use client'

import { ShoppingCart } from 'iconsax-reactjs'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/store'
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
  const t = useTranslations('product')

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (disabled) return
    openQuickAdd(product)
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
