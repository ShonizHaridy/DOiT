'use client'

import ProductCard from './ProductCard'
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
      {products.map((product) => {
        const [rawPrice, rawCurrency] = product.price.split(' ')
        const numericPrice = Number.parseFloat(rawPrice?.replace(/,/g, '')) || 0
        const currency = rawCurrency || 'EGP'

        return (
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.title}
            image={product.image}
            price={numericPrice}
            currency={currency}
            href={product.href}
            variant="minimal"
          />
        )
      })}
    </div>
  )
}
