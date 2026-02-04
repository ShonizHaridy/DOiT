'use client'

import { ShoppingCart } from 'iconsax-reactjs'
import { cn } from '@/lib/utils'

interface AddToCartButtonProps {
  productId: string
  className?: string
}

export default function AddToCartButton({
  productId,
  className,
}: AddToCartButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // TODO: Call cart store/API to add product
    console.log('Add to cart:', productId)
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'w-7 h-7 flex items-center justify-center bg-primary rounded',
        'hover:bg-primary/80 transition-colors',
        className
      )}
      aria-label="Add to cart"
    >
      <ShoppingCart size={16} color="#FFFFFF" variant="Bulk" />
    </button>
  )
}