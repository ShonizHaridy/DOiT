'use client'

import { useEffect, useMemo, useState } from 'react'
import { FormPageHeader, FormSelect } from '@/components/admin/forms'
import { useFeaturedProductsConfig, useUpdateFeaturedProductsConfig } from '@/hooks/useContent'
import { useAdminProducts } from '@/hooks/useProducts'

export default function EditFeaturedProductsPage() {
  const slots = 9
  const { data: config } = useFeaturedProductsConfig()
  const { mutateAsync, isPending } = useUpdateFeaturedProductsConfig()
  const { data: productsData } = useAdminProducts({ page: 1, limit: 100 })

  const [selectedProducts, setSelectedProducts] = useState<string[]>(Array(slots).fill(''))
  const [autoChoose, setAutoChoose] = useState(false)

  useEffect(() => {
    if (!config) return
    setAutoChoose(config.autoChoose)
    const base = [...config.selectedProducts]
    while (base.length < slots) base.push('')
    setSelectedProducts(base.slice(0, slots))
  }, [config])

  const productOptions = useMemo(() => (
    productsData?.products.map((product) => ({
      value: product.id,
      label: product.nameEn,
    })) ?? []
  ), [productsData])

  const handleProductChange = (index: number, value: string) => {
    const updated = [...selectedProducts]
    updated[index] = value
    setSelectedProducts(updated)
  }

  const handleSave = async () => {
    await mutateAsync({
      autoChoose,
      selectedProducts: selectedProducts.filter(Boolean),
    })
  }

  return (
    <div className="p-6">
      <FormPageHeader
        title="Edit Featured Products Section"
        backHref="/admin/content"
        onSave={handleSave}
        isSubmitting={isPending}
      />

      <div className="bg-white rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-neutral-900">Featured Products</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-600">Auto choose</span>
            <button
              type="button"
              onClick={() => setAutoChoose(!autoChoose)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                autoChoose ? 'bg-neutral-900' : 'bg-neutral-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  autoChoose ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-xs text-neutral-400">Most viewed Products</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {selectedProducts.map((productId, index) => (
            <div key={`slot-${index}`} className="flex items-center gap-3">
              <div className="relative w-[72px] h-[72px] bg-neutral-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden border border-neutral-200">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-neutral-300">
                  <rect x="2" y="2" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M2 16L8 10L22 22" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>

              <div className="flex-1">
                <label className="text-sm font-semibold text-neutral-900 mb-1.5 block">
                  Product {index + 1}
                </label>
                <FormSelect
                  options={productOptions}
                  placeholder="Select product"
                  value={productId}
                  onChange={(e) => handleProductChange(index, (e.target as HTMLSelectElement).value)}
                  disabled={autoChoose}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
