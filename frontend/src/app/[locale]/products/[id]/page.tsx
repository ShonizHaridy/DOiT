import { notFound } from 'next/navigation'
import { PRODUCTS } from '@/data/products'
import ProductDetail from './ProductDetail'
import RecommendedProducts from './RecommendedProducts'

interface ProductPageProps {
  params: Promise<{ locale: string; id: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, id } = await params

  const product = PRODUCTS.find((p) => p.id === id)

  if (!product) {
    notFound()
  }

  // Get recommended products (excluding current)
  const recommended = PRODUCTS.filter((p) => p.id !== id).slice(0, 6)

  return (
    <div className="min-h-screen bg-white">
      <ProductDetail product={product} locale={locale} />
      <RecommendedProducts products={recommended} locale={locale} />
    </div>
  )
}