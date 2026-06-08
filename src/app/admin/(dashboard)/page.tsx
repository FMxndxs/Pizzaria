import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ClipboardList, Pizza, TrendingUp, Clock } from 'lucide-react'

export const metadata = { title: 'Visão Geral — Admin' }
export const revalidate = 0

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const [
    { count: totalOrders },
    { count: pendingOrders },
    { count: preparingOrders },
    { count: totalFlavors },
  ] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'preparing'),
    supabase.from('flavors').select('*', { count: 'exact', head: true }),
  ])

  const cards = [
    { label: 'Pedidos hoje',    value: totalOrders ?? 0,    icon: ClipboardList, href: '/admin/pedidos',   color: 'text-accent-400',  bg: 'bg-accent-500/10' },
    { label: 'Aguardando',      value: pendingOrders ?? 0,  icon: Clock,         href: '/admin/pedidos',   color: 'text-stone-300',   bg: 'bg-stone-700/20' },
    { label: 'Em preparo',      value: preparingOrders ?? 0,icon: TrendingUp,    href: '/admin/pedidos',   color: 'text-orange-400',  bg: 'bg-orange-500/10' },
    { label: 'Sabores ativos',  value: totalFlavors ?? 0,   icon: Pizza,         href: '/admin/sabores',   color: 'text-brand-400',   bg: 'bg-brand-700/10' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Visão Geral</h1>
        <p className="text-stone-400 text-sm mt-1">Resumo da operação</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-2xl border border-stone-800/60 bg-stone-900/40 p-5 hover:border-stone-700 transition-colors group"
          >
            <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center mb-3`}>
              <c.icon className={`w-4 h-4 ${c.color}`} />
            </div>
            <p className={`text-3xl font-bold ${c.color}`}>{c.value}</p>
            <p className="text-stone-500 text-xs mt-1">{c.label}</p>
          </Link>
        ))}
      </div>

      {/* Atalho rápido */}
      <div className="rounded-2xl border border-stone-800/60 bg-stone-900/40 p-6">
        <h2 className="text-base font-semibold text-foreground mb-4">Acesso rápido</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/admin/pedidos"
            className="flex items-center gap-3 p-4 rounded-xl border border-stone-700/40 hover:border-brand-700/50 hover:bg-brand-700/5 transition-colors"
          >
            <ClipboardList className="w-5 h-5 text-brand-500 shrink-0" />
            <div>
              <p className="font-medium text-foreground text-sm">Gerenciar pedidos</p>
              <p className="text-stone-500 text-xs">Ver e registrar no dChef</p>
            </div>
          </Link>
          <Link
            href="/admin/sabores"
            className="flex items-center gap-3 p-4 rounded-xl border border-stone-700/40 hover:border-brand-700/50 hover:bg-brand-700/5 transition-colors"
          >
            <Pizza className="w-5 h-5 text-brand-500 shrink-0" />
            <div>
              <p className="font-medium text-foreground text-sm">Gerenciar sabores</p>
              <p className="text-stone-500 text-xs">Adicionar, editar e preços</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
