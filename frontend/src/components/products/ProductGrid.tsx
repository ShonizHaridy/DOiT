'use client'

import ProductCardSimple from './ProductCardSimple'
import { Product } from '@/config/products'

interface ProductGridProps {
  products: Product[]
  className?: string
}

export default function ProductGrid({ products, className = '' }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <p className="text-neutral-500 text-base md:text-lg">No products found</p>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-2 gap-2 md:gap-4 ${className}`}>
      {products.map((product) => (
        <ProductCardSimple key={product.id} {...product} />
      ))}
    </div>
  )
}
