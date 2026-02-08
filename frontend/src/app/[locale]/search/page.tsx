import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { serverFetch } from '@/lib/server-fetch'
import { getLocalized, type Locale } from '@/lib/i18n-utils'
import ProductCard from '@/components/products/ProductCard'
import type { PaginatedProducts, Product } from '@/types/product'

interface Props {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string; page?: string }>
}

const buildSearchQuery = (query: string, page: number) => {
  const params = new URLSearchParams()
  if (query) params.set('search', query)
  params.set('page', String(page))
  params.set('limit', '20')
  return params.toString()
}

const buildSearchHref = (query: string, page: number) => {
  const params = new URLSearchParams()
  if (query) params.set('q', query)
  if (page > 1) params.set('page', String(page))
  const qs = params.toString()
  return qs ? `/search?${qs}` : '/search'
}

export default async function SearchPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { q = '', page = '1' } = await searchParams
  const t = await getTranslations('search')
  const tProduct = await getTranslations('product')
  const query = Array.isArray(q) ? q[0] : q
  const pageValue = Array.isArray(page) ? page[0] : page
  const currentPage = Math.max(1, Number.parseInt(pageValue, 10) || 1)
  const trimmedQuery = query.trim()

  let response: PaginatedProducts = {
    products: [],
    pagination: { page: currentPage, limit: 20, total: 0, totalPages: 0 },
  }

  if (trimmedQuery) {
    const queryString = buildSearchQuery(trimmedQuery, currentPage)
    response = await serverFetch<PaginatedProducts>(`/products?${queryString}`, {
      revalidate: 30,
      tags: ['products', `search-${trimmedQuery}`],
    }).catch(() => response)
  }

  const products = response.products ?? []
  const total = response.pagination?.total ?? products.length
  const totalPages = response.pagination?.totalPages ?? 1
  const hasResults = products.length > 0
  const hasQuery = trimmedQuery.length > 0
  const productCardLabels = {
    colors: tProduct('colors'),
    sizes: tProduct('sizes'),
    gender: tProduct('gender'),
    price: tProduct('price'),
    genderValues: {
      MEN: tProduct('genderValues.men'),
      WOMEN: tProduct('genderValues.women'),
      KIDS: tProduct('genderValues.kids'),
      UNISEX: tProduct('genderValues.unisex'),
    },
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-6 py-6 lg:py-10">
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="font-roboto-condensed font-bold text-2xl lg:text-4xl text-primary uppercase">
            {t('title')}
          </h1>
          {hasQuery ? (
            <p className="text-sm lg:text-base text-neutral-500">
              "{trimmedQuery}"
            </p>
          ) : (
            <p className="text-sm lg:text-base text-neutral-500">
              {t('placeholder')}
            </p>
          )}
        </div>

        {hasResults ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {products.map((product: Product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={getLocalized(product, 'name', locale as Locale)}
                image={product.images[0]?.url ?? '/products/red.png'}
                price={product.finalPrice || product.basePrice}
                currency="EGP"
                href={`/${locale}/products/${product.id}`}
                colors={product.colors}
                sizes={product.sizes}
                gender={product.gender}
                labels={productCardLabels}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center text-neutral-500">
            {hasQuery ? t('noResults') : t('placeholder')}
          </div>
        )}

        {hasResults && (
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-t border-neutral-200 mt-6 pt-4 text-sm text-neutral-500">
            <span>
              {total} {t('results')}
            </span>
            {hasQuery && totalPages > 1 && (
              <div className="flex items-center gap-3">
                {currentPage > 1 && (
                  <Link
                    href={buildSearchHref(trimmedQuery, currentPage - 1)}
                    className="text-primary underline hover:no-underline"
                  >
                    {t('pagination.previous')}
                  </Link>
                )}
                {currentPage < totalPages && (
                  <Link
                    href={buildSearchHref(trimmedQuery, currentPage + 1)}
                    className="text-primary underline hover:no-underline"
                  >
                    {t('pagination.next')}
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
