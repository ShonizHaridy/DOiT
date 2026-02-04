'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line } from 'recharts'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  title: string
  subtitle: string
  value: string
  percentChange: number
  chartData: { value: number }[]
  chartColor?: 'green' | 'red'
}

export default function MetricCard({
  title,
  subtitle,
  value,
  percentChange,
  chartData,
  chartColor = 'green'
}: MetricCardProps) {
  const [mounted, setMounted] = useState(false)
  const isPositive = percentChange >= 0
  const strokeColor = chartColor === 'green' ? '#22C55E' : '#EF4444'

  // Only render chart after component mounts (client-side)
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="flex flex-col p-5 bg-white rounded-lg">
      {/* Header */}
      <div className="mb-3">
        <h3 className="text-base font-semibold text-neutral-900">{title}</h3>
        <p className="text-xs text-neutral-400">{subtitle}</p>
      </div>

      {/* Value and Chart Row */}
      <div className="flex items-end justify-between">
        <div className="flex flex-col">
          <span className="text-3xl font-bold text-neutral-900">{value}</span>
          <div className="flex items-center gap-1 mt-2">
            <span className={cn(
              'text-sm font-medium flex items-center gap-0.5',
              isPositive ? 'text-green-500' : 'text-red-500'
            )}>
              {isPositive ? (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9.5V2.5M6 2.5L2.5 6M6 2.5L9.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 2.5V9.5M6 9.5L9.5 6M6 9.5L2.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
              {Math.abs(percentChange)}%
            </span>
            <span className="text-xs text-neutral-400">vs last 7 days</span>
          </div>
        </div>

        {/* Mini Chart - only render on client */}
        <div className="w-[100px] h-[50px]">
          {mounted && (
            <LineChart width={100} height={50} data={chartData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={strokeColor}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          )}
        </div>
      </div>
    </div>
  )
}
