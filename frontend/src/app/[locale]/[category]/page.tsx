import { getTranslations } from 'next-intl/server'
import { PRODUCTS } from '@/data/products'
import CategoryContent from './CategoryContent'

interface CategoryPageProps {
  params: Promise<{ locale: string; category: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { locale, category } = await params
  const search = await searchParams
  const t = await getTranslations('category')

  // Get category display name
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1)

  return (
    <div className="min-h-screen bg-white">
      {/* Red Category Banner */}
      <div className="w-full h-14 lg:h-20 flex items-center justify-center bg-secondary">
        <h1 className="font-roboto-condensed font-bold text-lg lg:text-2xl text-white uppercase tracking-wider">
          {categoryName}
        </h1>
      </div>

      {/* Main Content */}
      <CategoryContent 
        products={PRODUCTS} 
        locale={locale} 
        category={category}
      />
    </div>
  )
}