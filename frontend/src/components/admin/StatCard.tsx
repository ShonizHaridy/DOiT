import { cn } from '@/lib/utils'

interface StatCardProps {
  value: string
  label: string
  suffix?: string
  variant?: 'default' | 'highlight'
}

export default function StatCard({ value, label, suffix, variant = 'default' }: StatCardProps) {
  return (
    <div className="flex flex-col justify-center p-5 rounded-lg bg-white shadow-sm">
      <div className="flex items-baseline gap-1">
        <span className={cn(
          'text-4xl font-bold',
          variant === 'highlight' ? 'text-primary' : 'text-neutral-900'
        )}>
          {value}
        </span>
        {suffix && (
          <span className={cn(
            'text-sm font-medium',
            variant === 'highlight' ? 'text-primary' : 'text-neutral-600'
          )}>
            {suffix}
          </span>
        )}
      </div>
      {/* Underline bar */}
      <div className={cn(
        'h-1 w-24 mt-2 mb-2',
        variant === 'highlight' ? 'bg-primary' : 'bg-secondary'
      )} />
      <span className="text-sm text-neutral-500">{label}</span>
    </div>
  )
}
