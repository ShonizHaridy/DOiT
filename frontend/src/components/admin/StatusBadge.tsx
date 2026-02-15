import { cn } from '@/lib/utils'

export type StatusVariant = 
  | 'success'      // Green - In stock, Published, Completed
  | 'warning'      // Yellow/Orange - Low stock, In progress
  | 'error'        // Red - Out of stock, Unpublished, Canceled
  | 'info'         // Blue - Shipped
  | 'default'      // Gray - New, etc.

interface StatusBadgeProps {
  label: string
  variant?: StatusVariant
  className?: string
}

const variantStyles: Record<StatusVariant, string> = {
  success: 'bg-green-100 text-green-800 border-green-200',
  warning: 'bg-amber-100 text-amber-800 border-amber-200',
  error: 'bg-red-100 text-red-700 border-red-200',
  info: 'bg-blue-100 text-blue-700 border-blue-200',
  default: 'bg-neutral-100 text-neutral-800 border-neutral-200',
}

export default function StatusBadge({ 
  label, 
  variant = 'default',
  className 
}: StatusBadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
      variantStyles[variant],
      className
    )}>
      {label}
    </span>
  )
}

// Helper function to get variant from status string
export function getStatusVariant(status: string): StatusVariant {
  const statusLower = status.toLowerCase()
  
  // Success states
  if (['in stock', 'published', 'completed', 'active'].includes(statusLower)) {
    return 'success'
  }
  
  // Warning states
  if (['low stock', 'in progress', 'pending', 'processing', 'scheduled'].includes(statusLower)) {
    return 'warning'
  }
  
  // Error states
  if (['out of stock', 'out fo stock', 'unpublished', 'canceled', 'cancelled', 'inactive', 'expired'].includes(statusLower)) {
    return 'error'
  }
  
  // Info states
  if (['shipped', 'delivering'].includes(statusLower)) {
    return 'info'
  }
  
  return 'default'
}
