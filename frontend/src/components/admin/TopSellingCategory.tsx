'use client'

interface CategoryData {
  name: string
  value: number
  perDay: string
  color: string
  size: 'large' | 'medium' | 'small'
}

const categories: CategoryData[] = [
  { name: 'Women', value: 4567, perDay: '4.567', color: '#E31837', size: 'large' },
  { name: 'Kids', value: 3167, perDay: '3.167', color: '#1A1A1A', size: 'medium' },
  { name: 'Sports', value: 1845, perDay: '1.845', color: '#6B7280', size: 'small' },
]

export default function TopSellingCategory() {
  return (
    <div className="bg-white rounded-lg border border-neutral-100 p-4 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-neutral-900">Top Selling Category</h3>
          <p className="text-xs text-neutral-400">Total 10.4k Visitors</p>
        </div>
        <button className="text-neutral-400 hover:text-neutral-600 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 10C3.9 10 3 10.9 3 12C3 13.1 3.9 14 5 14C6.1 14 7 13.1 7 12C7 10.9 6.1 10 5 10Z" fill="currentColor"/>
            <path d="M19 10C17.9 10 17 10.9 17 12C17 13.1 17.9 14 19 14C20.1 14 21 13.1 21 12C21 10.9 20.1 10 19 10Z" fill="currentColor"/>
            <path d="M12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z" fill="currentColor"/>
          </svg>
        </button>
      </div>

      {/* Bubble Chart */}
      <div className="relative h-[280px] flex items-center justify-center">
        {/* Women - Large Circle */}
        <div 
          className="absolute flex flex-col items-center justify-center rounded-full"
          style={{ 
            width: '180px', 
            height: '180px', 
            backgroundColor: '#E31837',
            left: '10%',
            top: '20%'
          }}
        >
          <span className="text-white text-xs font-medium">Women</span>
          <span className="text-white text-2xl font-bold">4.567</span>
          <span className="text-white/80 text-xs">Per Day</span>
        </div>

        {/* Kids - Medium Circle */}
        <div 
          className="absolute flex flex-col items-center justify-center rounded-full"
          style={{ 
            width: '130px', 
            height: '130px', 
            backgroundColor: '#1A1A1A',
            right: '15%',
            top: '35%'
          }}
        >
          <span className="text-white text-xs font-medium">Kids</span>
          <span className="text-white text-xl font-bold">3.167</span>
          <span className="text-white/80 text-xs">Per Day</span>
        </div>

        {/* Sports - Small Circle */}
        <div 
          className="absolute flex flex-col items-center justify-center rounded-full"
          style={{ 
            width: '100px', 
            height: '100px', 
            backgroundColor: '#6B7280',
            left: '25%',
            bottom: '5%'
          }}
        >
          <span className="text-white text-xs font-medium">Sports</span>
          <span className="text-white text-lg font-bold">1.845</span>
          <span className="text-white/80 text-[10px]">Per Day</span>
        </div>
      </div>
    </div>
  )
}
