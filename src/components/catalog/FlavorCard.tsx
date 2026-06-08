'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { motion } from 'motion/react'
import { OvenLineHover } from '@/components/ui/MotionPrimitives'
import { formatBRL } from '@/lib/utils/formatters'
import type { Flavor } from '@/types'

interface FlavorCardProps {
  flavor: Flavor
  formatCode: string
}

export function FlavorCard({ flavor, formatCode }: FlavorCardProps) {
  const priceEntry = flavor.prices?.find((p) => p.format_code === formatCode)
  const primaryImage = flavor.images?.find((i) => i.is_primary) ?? flavor.images?.[0]

  return (
    <OvenLineHover className="rounded-2xl">
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ type: 'spring', stiffness: 320, damping: 20 }}
        className="group flex flex-col rounded-2xl border border-stone-800/70 bg-stone-900/60 overflow-hidden hover:border-stone-700 transition-colors duration-300"
      >
        {/* Imagem */}
        <div className="relative aspect-square bg-stone-800/50 overflow-hidden">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt || flavor.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">🍕</div>
          )}
          {/* Tag tipo */}
          <span
            className={`absolute top-2.5 left-2.5 ${flavor.type === 'salgada' ? 'herb-tag' : 'sweet-tag'}`}
          >
            {flavor.type}
          </span>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-2 p-4 flex-1">
          <h3 className="font-semibold text-foreground text-sm leading-tight">{flavor.name}</h3>
          {flavor.description && (
            <p className="text-stone-400 text-xs leading-relaxed line-clamp-2">
              {flavor.description}
            </p>
          )}

          <div className="flex items-center justify-between mt-auto pt-2">
            {priceEntry ? (
              <span className="text-accent-400 font-bold text-sm">
                {formatBRL(priceEntry.price)}
              </span>
            ) : (
              <span className="text-stone-500 text-xs">—</span>
            )}
            <Link
              href={`/montar/${formatCode}?sabor=${flavor.slug}`}
              className="flex items-center gap-0.5 text-brand-500 text-xs font-medium hover:text-brand-400 transition-colors"
            >
              Montar
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </motion.div>
    </OvenLineHover>
  )
}
