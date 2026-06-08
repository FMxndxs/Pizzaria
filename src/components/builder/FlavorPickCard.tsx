'use client'

import Image from 'next/image'
import { Check } from 'lucide-react'
import { motion } from 'motion/react'
import { formatBRL } from '@/lib/utils/formatters'
import type { Flavor } from '@/types'

interface FlavorPickCardProps {
  flavor: Flavor
  formatCode: string
  selected: boolean
  disabled: boolean   // limite de sabores atingido e este não está selecionado
  onToggle: (flavor: Flavor, price: number) => void
}

export function FlavorPickCard({
  flavor,
  formatCode,
  selected,
  disabled,
  onToggle,
}: FlavorPickCardProps) {
  const priceEntry = flavor.prices?.find((p) => p.format_code === formatCode)
  const price = priceEntry?.price ?? 0
  const primaryImage = flavor.images?.find((i) => i.is_primary) ?? flavor.images?.[0]

  return (
    <motion.button
      onClick={() => !disabled && onToggle(flavor, price)}
      whileTap={disabled ? {} : { scale: 0.97 }}
      className={[
        'relative flex flex-col rounded-2xl border overflow-hidden text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400',
        selected
          ? 'flavor-card-selected'
          : disabled
          ? 'border-stone-800/40 bg-stone-900/30 opacity-40 cursor-not-allowed'
          : 'border-stone-800/70 bg-stone-900/50 hover:border-stone-700 cursor-pointer',
      ].join(' ')}
      aria-pressed={selected}
      aria-label={`${selected ? 'Remover' : 'Adicionar'} ${flavor.name}`}
      disabled={disabled}
    >
      {/* Checkmark */}
      {selected && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute top-2.5 right-2.5 z-10 w-6 h-6 rounded-full bg-brand-700 flex items-center justify-center shadow-lg"
        >
          <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
        </motion.div>
      )}

      {/* Imagem */}
      <div className="relative aspect-square bg-stone-800/50">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={flavor.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover transition-transform duration-300 ${selected ? 'scale-105' : ''}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">🍕</div>
        )}
        {selected && (
          <div className="absolute inset-0 bg-brand-700/10" />
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1">
        <span className="font-semibold text-foreground text-xs leading-tight line-clamp-1">
          {flavor.name}
        </span>
        {price > 0 && (
          <span className={`text-xs font-bold ${selected ? 'text-accent-400' : 'text-stone-400'}`}>
            {formatBRL(price)}
          </span>
        )}
      </div>
    </motion.button>
  )
}
