'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import ProductGrid from '@/components/products/ProductGrid'
import { FEATURED_PRODUCTS } from '@/config/products'

export default function SearchPage({ params }: { params: { locale: string } }) {
  const t = useTranslations()
  const searchParams = useSearchParams()
  const initialQuery = searchParams?.get('q') || ''

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [filteredProducts, setFilteredProducts] = useState(FEATURED_PRODUCTS)

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(FEATURED_PRODUCTS)
    } else {
      const filtered = FEATURED_PRODUCTS.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredProducts(filtered)
    }
  }, [searchQuery])

  return (
    <div className="min-h-screen bg-[#F5F4F4]">
      {/* Search Input */}
      <div className="sticky top-20 z-10 bg-white px-4 py-4 shadow-sm">
        <div className="flex items-center gap-2 px-4 py-3 bg-white border border-neutral-200 rounded-lg">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('search.placeholder')}
            className="flex-1 text-base text-neutral-700 placeholder:text-neutral-400 bg-transparent outline-none"
          />
          <button className="flex items-center justify-center" aria-label="Search">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z" stroke="#888787" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 22L20 20" stroke="#888787" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-4 py-6">
        <ProductGrid products={filteredProducts} />
      </div>

      {/* Pagination */}
      {filteredProducts.length > 0 && (
        <div className="px-4 pb-6">
          <div className="border-t border-neutral-200 pt-4">
            <div className="flex justify-between items-center">
              <div className="text-neutral-500 text-base">
                {filteredProducts.length} {t('search.results')}
              </div>
              <div className="flex items-center">
                <button className="flex items-center justify-center px-4 py-2 bg-neutral-400 text-neutral-900 text-base rounded-s-md border border-neutral-900">
                  1
                </button>
                <button className="flex items-center justify-center px-4 py-2 bg-white text-neutral-500 text-base border border-neutral-400">
                  2
                </button>
                <button className="flex items-center justify-center px-4 py-2 bg-white text-neutral-500 text-base border border-neutral-400">
                  ...
                </button>
                <button className="flex items-center justify-center px-4 py-2 bg-white text-neutral-500 text-base border border-neutral-400">
                  50
                </button>
                <button className="flex items-center justify-center p-2 bg-white text-neutral-500 border border-neutral-400 rounded-e-md">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M7.29289 14.7071C6.90237 14.3166 6.90237 13.6834 7.29289 13.2929L10.5858 10L7.29289 6.70711C6.90237 6.31658 6.90237 5.68342 7.29289 5.29289C7.68342 4.90237 8.31658 4.90237 8.70711 5.29289L12.7071 9.29289C13.0976 9.68342 13.0976 10.3166 12.7071 10.7071L8.70711 14.7071C8.31658 15.0976 7.68342 15.0976 7.29289 14.7071Z" fill="#888787"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
