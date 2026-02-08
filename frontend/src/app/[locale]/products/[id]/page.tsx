import { notFound } from 'next/navigation'
import { serverFetch } from '@/lib/server-fetch'
import ProductDetail from './ProductDetail'
import RecommendedProducts from './RecommendedProducts'
import type { Product } from '@/types/product'

interface ProductPageProps {
  params: Promise<{ locale: string; id: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, id } = await params

  const product = await serverFetch<Product>(`/products/${id}`, {
    revalidate: 60,
    tags: ['products', id],
  }).catch(() => null)

  if (!product) {
    notFound()
  }

  // Get recommended products (excluding current)
  const featuredProducts = await serverFetch<Product[]>('/products/featured', {
    revalidate: 60,
    tags: ['products', 'featured'],
  }).catch(() => [])
  const recommended = featuredProducts.filter((p) => p.id !== id).slice(0, 6)

  return (
    <div className="min-h-screen bg-white">
      <ProductDetail product={product} locale={locale} />
      <RecommendedProducts products={recommended} locale={locale} />
    </div>
  )
}
