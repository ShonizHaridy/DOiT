import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { serverFetch } from '@/lib/server-fetch'
import { getLocalized, type Locale } from '@/lib/i18n-utils'
import CategoryContent from './CategoryContent'
import Breadcrumb from '@/components/ui/Breadcrumb'
import type { Category } from '@/types/category'
import type { Product } from '@/types/product'

interface Props {
  params: Promise<{ locale: string; category: string }>
  searchParams: Promise<{ filters?: string; sortBy?: string }>
}

async function getCategories(): Promise<Category[]> {
  try {
    return await serverFetch<Category[]>('/categories?includeChildren=true', {
      revalidate: 3600,
      tags: ['categories'],
    })
  } catch (e) {
    console.log(e)
    return []
  }
}

function findCategoryBySlug(categories: Category[], slug: string, locale: string): Category | null {
  return categories.find(cat => 
    getLocalized(cat, 'name', locale as Locale).toLowerCase() === slug.toLowerCase()
  ) || null
}

// Parse filter string: "footwear.running" → { subCategoryId, productListId }
function parseFilters(filterString: string | undefined, category: Category) {
  if (!filterString || !category.subCategories) {
    return { subCategoryId: undefined, productListId: undefined }
  }

  const parts = filterString.split('.')
  
  // Find subcategory by name (first part)
  const subCategory = category.subCategories.find(sub => 
    sub.nameEn.toLowerCase() === parts[0]?.toLowerCase() ||
    sub.nameAr.toLowerCase() === parts[0]?.toLowerCase()
  )
  console.log(category)
  if (!subCategory) {
    return { subCategoryId: undefined, productListId: undefined }
  }

  // If there's a second part, find product list
  if (parts[1] && subCategory.productLists) {
    const productList = subCategory.productLists.find(list =>
      list.nameEn.toLowerCase() === parts[1]?.toLowerCase() ||
      list.nameAr.toLowerCase() === parts[1]?.toLowerCase()
    )
    
    return {
      subCategoryId: subCategory.id,
      productListId: productList?.id
    }
  }

  return {
    subCategoryId: subCategory.id,
    productListId: undefined
  }
}

// Build breadcrumb items from category and filters
function buildBreadcrumb(
  category: Category,
  filterString: string | undefined,
  categorySlug: string,
  locale: string
) {
  const items = [
    { label: getLocalized(category, 'name', locale as Locale), href: `/${categorySlug}` }
  ]

  if (!filterString || !category.subCategories) return items

  const parts = filterString.split('.')
  
  // Find subcategory
  const subCategory = category.subCategories.find(sub => 
    sub.nameEn.toLowerCase() === parts[0]?.toLowerCase() ||
    sub.nameAr.toLowerCase() === parts[0]?.toLowerCase()
  )

  if (subCategory) {
    items.push({
      label: getLocalized(subCategory, 'name', locale as Locale),
      href: `/${categorySlug}?filters=${parts[0]}`
    })

    // Find product list if exists
    if (parts[1] && subCategory.productLists) {
      const productList = subCategory.productLists.find(list =>
        list.nameEn.toLowerCase() === parts[1]?.toLowerCase() ||
        list.nameAr.toLowerCase() === parts[1]?.toLowerCase()
      )

      if (productList) {
        items.push({
          label: getLocalized(productList, 'name', locale as Locale),
          href: `/${categorySlug}?filters=${filterString}`
        })
      }
    }
  }

  return items
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, category } = await params
  const categories = await getCategories()
  console.log(categories)
  const categoryData = findCategoryBySlug(categories, category, locale)

  if (!categoryData) return { title: 'Not Found' }

  const title = getLocalized(categoryData, 'name', locale as Locale)

  return {
    title: `${title} | DOiT`,
    description: `Shop ${title} products at DOiT Egypt`,
    alternates: {
      canonical: `/${category}`,
    },
  }
}

export async function generateStaticParams() {
  const categories = await getCategories()
  
  return ['en', 'ar'].flatMap(locale =>
    categories.map(cat => ({
      locale,
      category: getLocalized(cat, 'name', locale as Locale).toLowerCase(),
    }))
  )
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { locale, category: categorySlug } = await params
  const { filters, sortBy = 'featured' } = await searchParams
  
  const categories = await getCategories()
  const categoryData = findCategoryBySlug(categories, categorySlug, locale)

  if (!categoryData) notFound()

  const categoryName = getLocalized(categoryData, 'name', locale as Locale)

  // Parse filters to get IDs
  const { subCategoryId, productListId } = parseFilters(filters, categoryData)

  // Build query params for products API (matching backend params)
  const queryParams = new URLSearchParams()
  
  if (productListId) {
    queryParams.append('productList', productListId)
  } else if (subCategoryId) {
    queryParams.append('subCategory', subCategoryId)
  } else {
    queryParams.append('category', categoryData.id)
  }
  
  // Add sorting
  if (sortBy) {
    queryParams.append('sortBy', sortBy)
  }

  // Fetch filtered products with pagination
  const response = await serverFetch<{
    products: Product[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }>(
    `/products?${queryParams.toString()}`,
    { 
      revalidate: 60, 
      tags: ['products', `category-${categoryData.id}`] 
    }
  ).catch(() => ({ products: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } }))

  const products = response.products

  // Build breadcrumb
  const breadcrumbItems = buildBreadcrumb(categoryData, filters, categorySlug, locale)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Only Category Name */}
      <div className="w-full h-14 lg:h-20 flex items-center justify-center bg-secondary">
        <h1 className="font-roboto-condensed font-bold text-lg lg:text-2xl text-white uppercase tracking-wider">
          {categoryName}
        </h1>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-4 lg:px-6 py-4 lg:py-8">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} className="mb-4" />

        {/* Category Content with Products */}
        <CategoryContent 
          products={products}
          locale={locale}
          categoryData={categoryData}
          activeFilters={filters}
          activeSortBy={sortBy}
          categorySlug={categorySlug}
        />
      </div>
    </div>
  )
}