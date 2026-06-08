'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, ClipboardList, Pizza, Settings, LogOut, ExternalLink } from 'lucide-react'
import { useAuth } from '@/lib/context/AuthContext'

const NAV = [
  { href: '/admin',               label: 'Visão Geral',  icon: LayoutDashboard },
  { href: '/admin/pedidos',       label: 'Pedidos',      icon: ClipboardList },
  { href: '/admin/sabores',       label: 'Sabores',      icon: Pizza },
  { href: '/admin/configuracoes', label: 'Configurações',icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router   = useRouter()
  const { signOut } = useAuth()

  async function handleSignOut() {
    await signOut()
    router.push('/')
  }

  return (
    <aside className="w-56 shrink-0 flex flex-col border-r border-stone-800/60 bg-stone-950/80 min-h-screen sticky top-0">
      {/* Marca */}
      <div className="px-5 py-5 border-b border-stone-800/40">
        <p className="font-bold text-foreground text-sm">Forno & Lenha</p>
        <p className="text-stone-500 text-xs">Painel Admin</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={[
                'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors',
                active
                  ? 'bg-brand-700/20 text-brand-400 font-medium'
                  : 'text-stone-400 hover:text-foreground hover:bg-stone-800/60',
              ].join(' ')}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-stone-800/40 flex flex-col gap-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-stone-400 hover:text-foreground hover:bg-stone-800/60 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Ver site
        </Link>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-stone-400 hover:text-brand-400 hover:bg-brand-700/10 transition-colors text-left"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </aside>
  )
}
