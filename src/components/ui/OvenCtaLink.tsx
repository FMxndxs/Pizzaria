'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import type { ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'

interface OvenCtaLinkProps {
  href: string
  children: ReactNode
  variant?: Variant
  className?: string
  external?: boolean
}

const baseClasses =
  'relative inline-flex items-center justify-center gap-2 rounded-full font-semibold text-sm tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background pizza-crust-sheen select-none'

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-brand-700 text-stone-50 hover:bg-brand-600 px-6 py-3 shadow-[0_2px_16px_rgba(193,39,45,.35)]',
  secondary:
    'border border-accent-400/50 text-accent-400 hover:bg-accent-400/10 px-6 py-3',
  ghost:
    'text-stone-300 hover:text-foreground px-4 py-2',
}

const MotionLink = motion.create(Link)

export function OvenCtaLink({
  href,
  children,
  variant = 'primary',
  className = '',
  external = false,
}: OvenCtaLinkProps) {
  return (
    <MotionLink
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
    >
      <span className="pizza-crust-filament" aria-hidden />
      {children}
    </MotionLink>
  )
}
