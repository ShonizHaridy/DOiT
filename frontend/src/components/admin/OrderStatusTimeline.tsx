'use client'

import { cn } from '@/lib/utils'

export interface StatusStep {
  label: string
  timestamp: string
  completed: boolean
  active: boolean
}

interface OrderStatusTimelineProps {
  steps: StatusStep[]
  className?: string
}

export default function OrderStatusTimeline({ steps, className }: OrderStatusTimelineProps) {
  return (
    <div className={cn('flex flex-col gap-0', className)}>
      <h3 className="text-base font-semibold text-neutral-900 mb-4">Order Status</h3>
      <div className="relative flex flex-col">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1
          return (
            <div key={step.label} className="flex gap-3 relative">
              {/* Line + Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 z-10',
                    step.completed
                      ? 'bg-neutral-700 border-neutral-700'
                      : step.active
                      ? 'bg-white border-neutral-400'
                      : 'bg-white border-neutral-200'
                  )}
                >
                  {step.completed && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  {step.active && !step.completed && (
                    <div className="w-2 h-2 bg-neutral-400 rounded-full" />
                  )}
                </div>
                {!isLast && (
                  <div className={cn(
                    'w-0.5 flex-1 min-h-[40px]',
                    step.completed ? 'bg-neutral-700' : 'bg-neutral-200'
                  )} />
                )}
              </div>

              {/* Label + Timestamp */}
              <div className="pb-6">
                <p className={cn(
                  'text-sm font-medium',
                  step.completed || step.active ? 'text-neutral-900' : 'text-neutral-400'
                )}>
                  {step.label}
                </p>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {step.timestamp}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
