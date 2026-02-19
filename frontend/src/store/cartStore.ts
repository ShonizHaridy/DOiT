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
  couponFreeShipping: boolean
  isOpen: boolean
  
  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  applyCoupon: (code: string, discountAmount: number, freeShipping?: boolean) => void
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
      couponFreeShipping: false,
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

      clearCart: () => set({ items: [], couponCode: '', couponDiscount: 0, couponFreeShipping: false }),

      applyCoupon: (code, discountAmount, freeShipping = false) => {
        const normalizedCode = code.trim().toUpperCase()
        if (!normalizedCode) return
        set({
          couponCode: normalizedCode,
          couponDiscount: Math.max(0, discountAmount),
          couponFreeShipping: Boolean(freeShipping),
        })
      },

      removeCoupon: () => set({ couponCode: '', couponDiscount: 0, couponFreeShipping: false }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      },

      getTotal: () => {
        const subtotal = get().getSubtotal()
        const discount = get().couponDiscount
        return Math.max(0, subtotal - discount)
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
        couponFreeShipping: state.couponFreeShipping,
      }),
    }
  )
)
