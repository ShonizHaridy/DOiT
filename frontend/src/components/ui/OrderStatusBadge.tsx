import StatusBadge, { type StatusVariant } from '@/components/admin/StatusBadge'

export type OrderUiStatusKey =
  | 'new'
  | 'inProgress'
  | 'shipped'
  | 'completed'
  | 'cancelled'

interface OrderStatusBadgeProps {
  label: string
  statusKey: OrderUiStatusKey
  className?: string
}

const statusVariantMap: Record<OrderUiStatusKey, StatusVariant> = {
  new: 'default',
  inProgress: 'warning',
  shipped: 'info',
  completed: 'success',
  cancelled: 'error',
}

export default function OrderStatusBadge({
  label,
  statusKey,
  className,
}: OrderStatusBadgeProps) {
  return (
    <StatusBadge
      label={label}
      variant={statusVariantMap[statusKey]}
      className={className}
    />
  )
}
