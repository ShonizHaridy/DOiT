'use client'

interface TopCategory {
  name: string
  value: number
}

const bubbleColors = ['#E31837', '#1A1A1A', '#6B7280']
const bubbleTransforms = ['translate(-26%, 2%)', 'translate(36%, -16%)', 'translate(4%, 48%)']

export default function TopSellingCategory({ categories }: { categories: TopCategory[] }) {
  const topCategories = categories.slice(0, 3)
  const maxValue = Math.max(...topCategories.map((item) => item.value), 1)
  const total = categories.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="bg-white rounded-lg border border-neutral-100 p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-neutral-900">Top Selling Category</h3>
          <p className="text-xs text-neutral-400">Total {total.toLocaleString()} Visitors</p>
        </div>
        <button className="text-neutral-400 hover:text-neutral-600 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 10C3.9 10 3 10.9 3 12C3 13.1 3.9 14 5 14C6.1 14 7 13.1 7 12C7 10.9 6.1 10 5 10Z" fill="currentColor"/>
            <path d="M19 10C17.9 10 17 10.9 17 12C17 13.1 17.9 14 19 14C20.1 14 21 13.1 21 12C21 10.9 20.1 10 19 10Z" fill="currentColor"/>
            <path d="M12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z" fill="currentColor"/>
          </svg>
        </button>
      </div>

      <div className="grid place-items-center h-[320px]">
        {topCategories.length === 0 && (
          <p className="text-sm text-neutral-400">No data yet</p>
        )}

        {topCategories.map((category, index) => {
          const size = 210 * Math.sqrt(category.value / maxValue)
          const fontSize = size > 180 ? 'text-3xl' : size > 150 ? 'text-2xl' : 'text-xl'
          return (
            <div
              key={category.name}
              className="rounded-full flex flex-col items-center justify-center"
              style={{
                gridArea: '1 / 1',
                width: size,
                height: size,
                backgroundColor: bubbleColors[index] || '#6B7280',
                transform: bubbleTransforms[index] || 'translate(0, 0)',
              }}
            >
              <span className="text-white text-xs font-medium">{category.name}</span>
              <span className={`text-white ${fontSize} font-bold`}>
                {category.value.toLocaleString()}
              </span>
              <span className="text-white/80 text-xs">Per Day</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
