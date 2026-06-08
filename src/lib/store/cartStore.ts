import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PizzaCartItem, PizzaCartFlavor, FlavorType } from '@/types'
import { maxFlavorPrice } from '@/lib/utils/pizzaPricing'

// Gera uuid simples p/ chave do item (sem dependência extra)
function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

/** Assinatura canônica de um item (formato+sabores ordenados) para detectar duplicatas */
function itemSignature(
  formatCode: string,
  type: FlavorType | null,
  flavors: PizzaCartFlavor[],
): string {
  const sortedIds = [...flavors].sort((a, b) => a.id.localeCompare(b.id)).map((f) => f.id)
  return `${formatCode}::${type ?? 'none'}::${sortedIds.join(',')}`
}

interface CartStore {
  items: PizzaCartItem[]
  total: number
  itemCount: number
  addItem: (
    formatCode: string,
    formatLabel: string,
    type: FlavorType | null,
    flavors: PizzaCartFlavor[],
    imageUrl?: string,
  ) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

function computeDerived(items: PizzaCartItem[]) {
  return {
    total: items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
    itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
  }
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      total: 0,
      itemCount: 0,

      addItem(formatCode, formatLabel, type, flavors, imageUrl) {
        set((state) => {
          const sig = itemSignature(formatCode, type, flavors)
          const existing = state.items.find(
            (i) => itemSignature(i.formatCode, i.type, i.flavors) === sig,
          )
          const unitPrice = maxFlavorPrice(flavors)
          const items = existing
            ? state.items.map((i) =>
                itemSignature(i.formatCode, i.type, i.flavors) === sig
                  ? { ...i, quantity: i.quantity + 1 }
                  : i,
              )
            : [
                ...state.items,
                {
                  id: uuid(),
                  formatCode,
                  formatLabel,
                  type,
                  flavors,
                  unitPrice,
                  quantity: 1,
                  imageUrl,
                },
              ]
          return { items, ...computeDerived(items) }
        })
      },

      removeItem(id) {
        set((state) => {
          const items = state.items.filter((i) => i.id !== id)
          return { items, ...computeDerived(items) }
        })
      },

      updateQuantity(id, quantity) {
        if (quantity <= 0) {
          set((state) => {
            const items = state.items.filter((i) => i.id !== id)
            return { items, ...computeDerived(items) }
          })
          return
        }
        set((state) => {
          const items = state.items.map((i) => (i.id === id ? { ...i, quantity } : i))
          return { items, ...computeDerived(items) }
        })
      },

      clearCart() {
        set({ items: [], total: 0, itemCount: 0 })
      },
    }),
    { name: 'pizzaria-cart' },
  ),
)
