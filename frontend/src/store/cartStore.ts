import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  productId: string
  title: string
  image: string
  price: number
  originalPrice?: number
  currency: string
  quantity: number
  maxQuantity?: number
  size: string
  color: string
  vendor?: string
  type?: string
  gender?: string
  sku?: string
  discount?: string
}

interface CartState {
  items: CartItem[]
  couponCode: string
  couponDiscount: number
  isOpen: boolean
  
  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  applyCoupon: (code: string) => boolean
  removeCoupon: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  
  // Computed
  getSubtotal: () => number
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: '',
      couponDiscount: 0,
      isOpen: false,

      addItem: (item) => {
        const id = `${item.productId}-${item.size}-${item.color}`
        set((state) => {
          const maxQuantity =
            typeof item.maxQuantity === 'number' && item.maxQuantity > 0
              ? item.maxQuantity
              : undefined
          const existingIndex = state.items.findIndex((i) => i.id === id)
          if (existingIndex > -1) {
            const newItems = [...state.items]
            const existingItem = newItems[existingIndex]
            const effectiveMax = maxQuantity ?? existingItem.maxQuantity
            const nextQuantityRaw = existingItem.quantity + item.quantity
            const nextQuantity =
              typeof effectiveMax === 'number'
                ? Math.min(nextQuantityRaw, effectiveMax)
                : nextQuantityRaw
            newItems[existingIndex] = {
              ...existingItem,
              ...item,
              quantity: nextQuantity,
              maxQuantity: effectiveMax,
            }
            return { items: newItems }
          }
          const initialQuantity =
            typeof maxQuantity === 'number'
              ? Math.min(item.quantity, maxQuantity)
              : item.quantity
          return {
            items: [...state.items, { ...item, id, quantity: initialQuantity, maxQuantity }],
          }
        })
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }))
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) return
        set((state) => ({
          ...state,
          items: state.items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  quantity:
                    typeof item.maxQuantity === 'number'
                      ? Math.min(quantity, item.maxQuantity)
                      : quantity,
                }
              : item
          ),
        }))
      },

      clearCart: () => set({ items: [], couponCode: '', couponDiscount: 0 }),

      applyCoupon: (code) => {
        // Mock coupon validation
        const validCoupons: Record<string, number> = {
          'SAVE10': 10,
          'SAVE20': 20,
          'SUMMER25': 25,
        }
        const discount = validCoupons[code.toUpperCase()]
        if (discount) {
          set({ couponCode: code.toUpperCase(), couponDiscount: discount })
          return true
        }
        return false
      },

      removeCoupon: () => set({ couponCode: '', couponDiscount: 0 }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      },

      getTotal: () => {
        const subtotal = get().getSubtotal()
        const discount = get().couponDiscount
        return subtotal - (subtotal * discount) / 100
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },
    }),
    {
      name: 'doit-cart',
      partialize: (state) => ({
        items: state.items,
        couponCode: state.couponCode,
        couponDiscount: state.couponDiscount,
      }),
    }
  )
)
