import ProductCard from '@/components/products/ProductCard'
import { getLocalized, type Locale } from '@/lib/i18n-utils'
import type { Product } from '@/types/product'

interface RecommendedProductsProps {
  products: Product[]
  locale: string
}

export default function RecommendedProducts({ products, locale }: RecommendedProductsProps) {
  if (products.length === 0) return null

  return (
    <section className="bg-white py-8 lg:py-12">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
        <h2 className="font-roboto font-medium text-xl lg:text-2xl text-primary mb-6">
          You may also like
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={getLocalized(product, 'name', locale as Locale)}
              image={product.images[0]?.url ?? '/placeholder-product.png'}
              price={product.discountPercentage > 0 ? product.finalPrice : product.basePrice}
              currency="EGP"
              href={`/${locale}/products/${product.id}`}
              variant="minimal"
              className="shrink-0 w-40 lg:w-48"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
