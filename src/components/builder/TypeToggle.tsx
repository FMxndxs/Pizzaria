'use client'

import { motion } from 'motion/react'
import type { FlavorType } from '@/types'

interface TypeToggleProps {
  value: FlavorType
  onChange: (type: FlavorType) => void
}

export function TypeToggle({ value, onChange }: TypeToggleProps) {
  return (
    <div className="relative flex rounded-full border border-stone-700/60 bg-stone-900/60 p-1 w-fit">
      {(['salgada', 'doce'] as FlavorType[]).map((type) => {
        const isActive = value === type
        return (
          <button
            key={type}
            onClick={() => onChange(type)}
            className={[
              'relative z-10 px-6 py-2 rounded-full text-sm font-semibold transition-colors duration-200',
              isActive ? 'text-white' : 'text-stone-400 hover:text-stone-200',
            ].join(' ')}
          >
            {isActive && (
              <motion.span
                layoutId="type-pill"
                className="absolute inset-0 rounded-full"
                style={{
                  background: type === 'salgada'
                    ? 'rgba(62,124,79,0.55)'
                    : 'rgba(155,94,155,0.55)',
                  border: `1px solid ${type === 'salgada' ? 'rgba(62,124,79,0.6)' : 'rgba(155,94,155,0.6)'}`,
                }}
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              />
            )}
            <span className="relative">
              {type === 'salgada' ? '🧄 Salgada' : '🍫 Doce'}
            </span>
          </button>
        )
      })}
    </div>
  )
}
