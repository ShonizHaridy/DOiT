import { create } from 'zustand'
import type { Product } from '@/types/product'

interface QuickAddState {
  isOpen: boolean
  product: Product | null
}

interface SizeChartState {
  isOpen: boolean
  productId: string | null
}

interface UIState {
  // Quick Add Modal
  quickAdd: QuickAddState
  openQuickAdd: (product: Product) => void
  closeQuickAdd: () => void

  // Size Chart Modal
  sizeChart: SizeChartState
  openSizeChart: (productId: string) => void
  closeSizeChart: () => void

  // Filter Drawer (Mobile)
  isFilterDrawerOpen: boolean
  openFilterDrawer: () => void
  closeFilterDrawer: () => void

  // Sort Drawer (Mobile)
  isSortDrawerOpen: boolean
  openSortDrawer: () => void
  closeSortDrawer: () => void
}

export const useUIStore = create<UIState>((set) => ({
  // Quick Add Modal
  quickAdd: { isOpen: false, product: null },
  openQuickAdd: (product) => set({ quickAdd: { isOpen: true, product } }),
  closeQuickAdd: () => set({ quickAdd: { isOpen: false, product: null } }),

  // Size Chart Modal
  sizeChart: { isOpen: false, productId: null },
  openSizeChart: (productId) => set({ sizeChart: { isOpen: true, productId } }),
  closeSizeChart: () => set({ sizeChart: { isOpen: false, productId: null } }),

  // Filter Drawer
  isFilterDrawerOpen: false,
  openFilterDrawer: () => set({ isFilterDrawerOpen: true }),
  closeFilterDrawer: () => set({ isFilterDrawerOpen: false }),

  // Sort Drawer
  isSortDrawerOpen: false,
  openSortDrawer: () => set({ isSortDrawerOpen: true }),
  closeSortDrawer: () => set({ isSortDrawerOpen: false }),
}))