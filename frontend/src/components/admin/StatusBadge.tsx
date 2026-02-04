import { cn } from '@/lib/utils'

type StatusVariant = 
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
  success: 'bg-green-50 text-green-600 border-green-200',
  warning: 'bg-orange-50 text-orange-600 border-orange-200',
  error: 'bg-red-50 text-red-600 border-red-200',
  info: 'bg-blue-50 text-blue-600 border-blue-200',
  default: 'bg-neutral-50 text-neutral-600 border-neutral-200',
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
  if (['low stock', 'in progress', 'pending', 'processing'].includes(statusLower)) {
    return 'warning'
  }
  
  // Error states
  if (['out of stock', 'out fo stock', 'unpublished', 'canceled', 'cancelled', 'inactive'].includes(statusLower)) {
    return 'error'
  }
  
  // Info states
  if (['shipped', 'delivering'].includes(statusLower)) {
    return 'info'
  }
  
  return 'default'
}
