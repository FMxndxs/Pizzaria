'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Menu, X, Pizza } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useCartStore } from '@/lib/store/cartStore'

const navLinks = [
  { href: '/cardapio', label: 'Cardápio' },
  { href: '/montar/pizza-grande', label: 'Monte sua Pizza' },
  { href: '/nossa-historia', label: 'Nossa História' },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const itemCount = useCartStore((s) => s.itemCount)

  return (
    <header className="sticky top-0 z-50 oven-header-glow bg-stone-950/90 backdrop-blur-md border-b border-stone-800/60">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="relative w-9 h-9 rounded-full overflow-hidden bg-stone-800 ring-1 ring-stone-700 group-hover:ring-brand-700 transition-all duration-300">
            {/* Placeholder logo — trocar por <Image src="/logo.png" ... /> */}
            <div className="w-full h-full flex items-center justify-center">
              <Pizza className="w-5 h-5 text-brand-500" />
            </div>
          </div>
          <span className="font-bold text-lg tracking-tight text-foreground group-hover:text-accent-400 transition-colors duration-200">
            {/* SITE_NAME placeholder */}
            Forno & Lenha
          </span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm text-stone-300 hover:text-foreground rounded-full hover:bg-stone-800/60 transition-all duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Ações direita */}
        <div className="flex items-center gap-2">
          {/* Carrinho */}
          <Link
            href="/carrinho"
            className="relative p-2.5 rounded-full text-stone-300 hover:text-foreground hover:bg-stone-800/60 transition-all duration-200"
            aria-label="Carrinho"
          >
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-brand-700 text-white text-[10px] font-bold flex items-center justify-center px-1"
              >
                {itemCount > 99 ? '99+' : itemCount}
              </motion.span>
            )}
          </Link>

          {/* Menu mobile */}
          <button
            className="md:hidden p-2.5 rounded-full text-stone-300 hover:text-foreground hover:bg-stone-800/60 transition-all duration-200"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Nav mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-t border-stone-800/60 bg-stone-950/95"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-sm text-stone-300 hover:text-foreground rounded-xl hover:bg-stone-800/60 transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
