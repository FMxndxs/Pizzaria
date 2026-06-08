'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

const TABS = [
  { code: 'pizza-grande', label: 'Pizza Grande', emoji: '🍕' },
  { code: 'pizza-broto',  label: 'Pizza Broto',  emoji: '🫓' },
  { code: 'calzone',      label: 'Calzone',       emoji: '🌯' },
]

export function FormatTabs() {
  const searchParams = useSearchParams()
  const active = searchParams.get('formato') ?? 'pizza-grande'

  return (
    <div className="flex gap-2 flex-wrap">
      {TABS.map((tab) => {
        const isActive = tab.code === active
        return (
          <Link
            key={tab.code}
            href={`/cardapio?formato=${tab.code}`}
            className={[
              'flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200',
              isActive
                ? 'bg-brand-700 text-white shadow-[0_2px_12px_rgba(193,39,45,.35)]'
                : 'border border-stone-700/60 text-stone-300 hover:border-stone-600 hover:text-foreground',
            ].join(' ')}
          >
            <span>{tab.emoji}</span>
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}
