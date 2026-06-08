'use client'

import { Minus, Plus, Trash2 } from 'lucide-react'
import { motion } from 'motion/react'
import { formatBRL } from '@/lib/utils/formatters'
import { useCartStore } from '@/lib/store/cartStore'
import type { PizzaCartItem } from '@/types'

interface CartItemRowProps {
  item: PizzaCartItem
}

export function CartItemRow({ item }: CartItemRowProps) {
  const { updateQuantity, removeItem } = useCartStore()

  const flavorNames = item.flavors.map((f) => f.name).join(' + ')
  const typeLabel = item.type
    ? item.type.charAt(0).toUpperCase() + item.type.slice(1)
    : null

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      className="flex gap-4 py-4 border-b border-stone-800/60 last:border-0"
    >
      {/* Emoji / imagem placeholder */}
      <div className="w-14 h-14 rounded-xl bg-stone-800/60 flex items-center justify-center shrink-0 text-2xl border border-stone-700/40">
        {item.formatCode === 'pizza-grande' ? '🍕' : item.formatCode === 'pizza-broto' ? '🫓' : '🌯'}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-foreground text-sm">
              {item.formatLabel}
              {typeLabel && <span className="text-stone-400 font-normal"> · {typeLabel}</span>}
            </p>
            <p className="text-stone-400 text-xs mt-0.5 line-clamp-2">{flavorNames}</p>
          </div>
          <span className="text-accent-400 font-bold text-sm shrink-0">
            {formatBRL(item.unitPrice * item.quantity)}
          </span>
        </div>

        {/* Controles de quantidade */}
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center gap-2 rounded-full border border-stone-700/60 bg-stone-900/60 px-2 py-1">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-stone-800 text-stone-400 hover:text-foreground transition-colors"
              aria-label="Diminuir quantidade"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-sm font-semibold text-foreground w-5 text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-stone-800 text-stone-400 hover:text-foreground transition-colors"
              aria-label="Aumentar quantidade"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <button
            onClick={() => removeItem(item.id)}
            className="p-1.5 rounded-full text-stone-600 hover:text-brand-500 hover:bg-brand-700/10 transition-colors"
            aria-label="Remover item"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
