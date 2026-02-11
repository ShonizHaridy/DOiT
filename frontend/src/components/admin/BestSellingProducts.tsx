'use client'

import { cn } from '@/lib/utils'

interface BestSellingProduct {
  id: string
  name: string
  totalOrders: number
  stockStatus: string
  price?: number
}

const getStockLabel = (status: string) => {
  const value = status.toLowerCase()
  if (value.includes('out')) return 'Out'
  return 'Stock'
}

export default function BestSellingProducts({ products }: { products: BestSellingProduct[] }) {
  return (
    <div className="bg-white rounded-lg border border-neutral-100 p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-neutral-900">Best Selling Products</h3>
        <button className="text-neutral-400 hover:text-neutral-600 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 10C3.9 10 3 10.9 3 12C3 13.1 3.9 14 5 14C6.1 14 7 13.1 7 12C7 10.9 6.1 10 5 10Z" fill="currentColor"/>
            <path d="M19 10C17.9 10 17 10.9 17 12C17 13.1 17.9 14 19 14C20.1 14 21 13.1 21 12C21 10.9 20.1 10 19 10Z" fill="currentColor"/>
            <path d="M12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z" fill="currentColor"/>
          </svg>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-100">
              <th className="text-left text-xs font-medium text-neutral-400 uppercase tracking-wider pb-3 pr-4">
                Product
              </th>
              <th className="text-left text-xs font-medium text-neutral-400 uppercase tracking-wider pb-3 pr-4">
                Total Order
              </th>
              <th className="text-left text-xs font-medium text-neutral-400 uppercase tracking-wider pb-3 pr-4">
                Status
              </th>
              <th className="text-right text-xs font-medium text-neutral-400 uppercase tracking-wider pb-3">
                Price
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50">
            {products.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-sm text-neutral-400">
                  No data yet
                </td>
              </tr>
            )}
            {products.map((product) => {
              const status = getStockLabel(product.stockStatus)
              return (
                <tr key={product.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="py-3 pr-4">
                    <span className="text-sm font-medium text-neutral-900">
                      {product.name}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="text-sm text-neutral-600">
                      {product.totalOrders}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-1.5">
                      <span className={cn(
                        'w-2 h-2 rounded-full',
                        status === 'Stock' ? 'bg-green-500' : 'bg-red-500'
                      )} />
                      <span className={cn(
                        'text-sm font-medium',
                        status === 'Stock' ? 'text-green-500' : 'text-red-500'
                      )}>
                        {status}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    <span className="text-sm font-medium text-neutral-900">
                      {product.price != null ? `${product.price.toFixed(2)} EGP` : '---'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
