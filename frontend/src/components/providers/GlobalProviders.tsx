'use client'

import { QuickAddModal, SizeChartModal } from '@/components/modals'
import CartDrawer from '@/components/cart/CartDrawer'

export default function GlobalProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <QuickAddModal />
      <SizeChartModal />
      <CartDrawer />
    </>
  )
}