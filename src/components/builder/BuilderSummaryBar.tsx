'use client'

import { motion, AnimatePresence } from 'motion/react'
import { ShoppingCart, X } from 'lucide-react'
import { formatBRL } from '@/lib/utils/formatters'
import { maxFlavorPrice } from '@/lib/utils/pizzaPricing'
import type { PizzaCartFlavor } from '@/types'

interface BuilderSummaryBarProps {
  formatLabel: string
  maxFlavors: number
  selectedFlavors: PizzaCartFlavor[]
  onAddToCart: () => void
  onRemoveFlavor: (id: string) => void
}

export function BuilderSummaryBar({
  formatLabel,
  maxFlavors,
  selectedFlavors,
  onAddToCart,
  onRemoveFlavor,
}: BuilderSummaryBarProps) {
  const count = selectedFlavors.length
  const price = maxFlavorPrice(selectedFlavors)
  const canAdd = count > 0

  return (
    <div className="builder-bar fixed bottom-0 inset-x-0 z-40 px-4 py-3 safe-area-bottom">
      <div className="max-w-2xl mx-auto">
        {/* Sabores selecionados */}
        <AnimatePresence>
          {count > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="flex gap-2 flex-wrap mb-3"
            >
              {selectedFlavors.map((f) => (
                <motion.div
                  key={f.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex items-center gap-1.5 bg-stone-800/80 border border-stone-700/60 rounded-full px-3 py-1 text-xs text-foreground"
                >
                  {f.name}
                  <button
                    onClick={() => onRemoveFlavor(f.id)}
                    className="text-stone-400 hover:text-foreground transition-colors"
                    aria-label={`Remover ${f.name}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Barra principal */}
        <div className="flex items-center justify-between gap-4">
          {/* Contador + info */}
          <div className="flex flex-col min-w-0">
            <span className="text-xs text-stone-400">
              {formatLabel} — {count}/{maxFlavors} sabor{maxFlavors > 1 ? 'es' : ''}
            </span>
            {count > 0 && (
              <motion.span
                key={price}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg font-bold text-accent-400"
              >
                {formatBRL(price)}
              </motion.span>
            )}
            {count === 0 && (
              <span className="text-stone-500 text-sm">Selecione um sabor para começar</span>
            )}
          </div>

          {/* Botão */}
          <motion.button
            onClick={onAddToCart}
            disabled={!canAdd}
            whileTap={canAdd ? { scale: 0.97 } : {}}
            className={[
              'flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-sm transition-all duration-200 shrink-0',
              canAdd
                ? 'bg-brand-700 text-white hover:bg-brand-600 shadow-[0_2px_16px_rgba(193,39,45,.35)]'
                : 'bg-stone-800 text-stone-500 cursor-not-allowed',
            ].join(' ')}
          >
            <ShoppingCart className="w-4 h-4" />
            Adicionar ao carrinho
          </motion.button>
        </div>

        {/* Barra de progresso */}
        <div className="mt-3 h-1 rounded-full bg-stone-800 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-brand-700"
            animate={{ width: `${(count / maxFlavors) * 100}%` }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          />
        </div>
      </div>
    </div>
  )
}
