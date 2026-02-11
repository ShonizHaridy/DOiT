import Link from 'next/link'
import { ArrowDown2, CloseCircle } from 'iconsax-reactjs'
import { cn } from '@/lib/utils'
import ProductCard from '@/components/products/ProductCard'
import { CategoryMobileControls, CategorySortBar } from './CategoryControls'
import type { Product } from '@/types/product'
import type { Category } from '@/types/category'
import { getLocalized, type Locale } from '@/lib/i18n-utils'

interface CategoryContentProps {
  products: Product[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  locale: string
  categoryData: Category
  activeFilters?: string
  activeSortBy?: string
  categorySlug: string
}

export default function CategoryContent({
  products,
  pagination,
  locale,
  categoryData,
  activeFilters,
  activeSortBy = 'featured',
  categorySlug,
}: CategoryContentProps) {
  const buildHref = (filters?: string, page?: number) => {
    const params = new URLSearchParams()
    if (filters) params.append('filters', filters)
    if (activeSortBy !== 'featured') params.append('sortBy', activeSortBy)
    if (page && page > 1) params.append('page', String(page))
    const qs = params.toString()
    return qs ? `/${categorySlug}?${qs}` : `/${categorySlug}`
  }

  const activeFilterParts = (() => {
    if (!activeFilters || !categoryData.subCategories) return []

    const parts = activeFilters.split('.')
    const items: { label: string; value: string }[] = []

    const subCategory = categoryData.subCategories.find(
      (sub) =>
        sub.nameEn.toLowerCase() === parts[0]?.toLowerCase() ||
        sub.nameAr.toLowerCase() === parts[0]?.toLowerCase()
    )

    if (subCategory) {
      items.push({
        label: getLocalized(subCategory, 'name', locale as Locale),
        value: parts[0],
      })

      if (parts[1] && subCategory.productLists) {
        const productList = subCategory.productLists.find(
          (list) =>
            list.nameEn.toLowerCase() === parts[1]?.toLowerCase() ||
            list.nameAr.toLowerCase() === parts[1]?.toLowerCase()
        )

        if (productList) {
          items.push({
            label: getLocalized(productList, 'name', locale as Locale),
            value: parts[1],
          })
        }
      }
    }

    return items
  })()

  return (
    <>
      <CategoryMobileControls
        categoryData={categoryData}
        locale={locale}
        activeFilters={activeFilters}
        activeSortBy={activeSortBy}
        categorySlug={categorySlug}
        productCount={pagination.total}
      />

      {/* Active Filters - Mobile & Desktop */}
      {activeFilterParts.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap mb-4 lg:mb-6">
          <span className="text-sm font-medium text-text-body">
            Active Filters:
          </span>
          {activeFilterParts.map((filter, index) => {
            const rawParts = activeFilters?.split('.') || []
            const remaining = rawParts.slice(0, index)
            const href =
              remaining.length > 0 ? buildHref(remaining.join('.')) : buildHref()

            return (
              <Link
                key={`${filter.value}-${index}`}
                href={href}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                <span className="text-gray-700 text-sm font-medium">
                  {filter.label}
                </span>
                <CloseCircle size={16} color="#666" variant="Bold" />
              </Link>
            )
          })}
          <Link
            href={buildHref()}
            className="text-sm font-medium text-secondary underline hover:no-underline"
          >
            Clear All
          </Link>
        </div>
      )}

      <div className="flex gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block w-48 shrink-0">
          <h2 className="font-roboto font-bold text-lg mb-6 uppercase">
            Filters
          </h2>

          {categoryData.subCategories && categoryData.subCategories.length > 0 && (
            <div className="flex flex-col border-t border-gray-200">
              {categoryData.subCategories.map((subCategory) => {
                const subSlug = getLocalized(
                  subCategory,
                  'name',
                  locale as Locale
                ).toLowerCase()
                const isSubActive = activeFilters?.startsWith(subSlug)

                return (
                  <div key={subCategory.id} className="border-b border-gray-200">
                    <Link
                      href={buildHref(subSlug)}
                      className="w-full flex items-center justify-between py-4 text-start hover:text-secondary transition-colors"
                    >
                      <span className="font-roboto font-medium text-text-body">
                        {getLocalized(subCategory, 'name', locale as Locale)}
                      </span>
                      <ArrowDown2 size={18} className="text-gray-400" />
                    </Link>

                    {isSubActive &&
                      subCategory.productLists &&
                      subCategory.productLists.length > 0 && (
                        <div className="pl-4 pb-2 flex flex-col gap-2">
                          {subCategory.productLists.map((productList) => {
                            const listSlug = getLocalized(
                              productList,
                              'name',
                              locale as Locale
                            ).toLowerCase()
                            const isActive =
                              activeFilters === `${subSlug}.${listSlug}`

                            return (
                              <Link
                                key={productList.id}
                                href={buildHref(`${subSlug}.${listSlug}`)}
                                className={cn(
                                  'text-sm text-start py-1 hover:text-secondary transition-colors',
                                  isActive
                                    ? 'text-secondary font-medium'
                                    : 'text-text-body'
                                )}
                              >
                                {getLocalized(
                                  productList,
                                  'name',
                                  locale as Locale
                                )}
                              </Link>
                            )
                          })}
                        </div>
                      )}
                  </div>
                )
              })}
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <CategorySortBar
            categoryData={categoryData}
            locale={locale}
            activeFilters={activeFilters}
            activeSortBy={activeSortBy}
            categorySlug={categorySlug}
            productCount={pagination.total}
          />

          {/* Product Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-5">
              {products.map((product: Product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={getLocalized(product, 'name', locale as Locale)}
                  image={product.images[0]?.url ?? '/placeholder-product.png'}
                  price={
                    product.discountPercentage > 0
                      ? product.finalPrice
                      : product.basePrice
                  }
                  originalPrice={
                    product.discountPercentage > 0 ? product.basePrice : undefined
                  }
                  currency="EGP"
                  href={`/${locale}/products/${product.id}`}
                  availability={product.availability}
                  discountPercentage={product.discountPercentage}
                  variant="simple"
                  addToCartVariant="quick"
                  quickAddProduct={product}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-text-body">No products found</p>
              {activeFilters && (
                <Link
                  href={buildHref()}
                  className="mt-4 text-secondary underline hover:no-underline inline-flex"
                >
                  Clear filters and show all products
                </Link>
              )}
            </div>
          )}

          {pagination.totalPages > 1 && (
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-t border-neutral-200 mt-6 pt-4 text-sm text-neutral-500">
              <span>
                {pagination.total} Products
              </span>
              <div className="flex items-center gap-3">
                {pagination.page > 1 && (
                  <Link
                    href={buildHref(activeFilters, pagination.page - 1)}
                    className="text-primary underline hover:no-underline"
                  >
                    Previous
                  </Link>
                )}
                {pagination.page < pagination.totalPages && (
                  <Link
                    href={buildHref(activeFilters, pagination.page + 1)}
                    className="text-primary underline hover:no-underline"
                  >
                    Next
                  </Link>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  )
}
