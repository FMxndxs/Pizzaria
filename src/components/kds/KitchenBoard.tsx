'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { KitchenCard } from './KitchenCard'
import type { Order } from '@/types'

const ACTIVE_STATUSES: Order['status'][] = ['confirmed', 'preparing']

interface KitchenBoardProps {
  initialOrders: Order[]
}

export function KitchenBoard({ initialOrders }: KitchenBoardProps) {
  const [orders, setOrders] = useState<Order[]>(
    initialOrders.filter((o) => ACTIVE_STATUSES.includes(o.status)),
  )

  useEffect(() => {
    const supabase = createClient()

    function refetchAll() {
      // Re-sincroniza via fetch para garantir estado correto após reconexão
      fetch('/api/kds/queue')
        .then((r) => r.json())
        .then((data: Order[]) => setOrders(data.filter((o) => ACTIVE_STATUSES.includes(o.status))))
        .catch(() => {}) // silencia erros de rede — próximo evento vai re-tentar
    }

    const channel = supabase
      .channel('kds-orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          const updated = payload.new as Order
          if (!updated?.id) return

          if (!ACTIVE_STATUSES.includes(updated.status)) {
            // Status terminal ou ready → remove do board
            setOrders((prev) => prev.filter((o) => o.id !== updated.id))
          } else {
            // Upsert na lista local
            setOrders((prev) => {
              const idx = prev.findIndex((o) => o.id === updated.id)
              if (idx >= 0) {
                const copy = [...prev]
                copy[idx] = { ...copy[idx], ...updated }
                return copy
              }
              return [...prev, updated]
            })
          }
        },
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') refetchAll()
      })

    return () => { supabase.removeChannel(channel) }
  }, [])

  const confirmed = orders.filter((o) => o.status === 'confirmed')
  const preparing = orders.filter((o) => o.status === 'preparing')

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">
      <Lane title="Confirmados" orders={confirmed} />
      <Lane title="Preparando"  orders={preparing} />
    </div>
  )
}

function Lane({ title, orders }: { title: string; orders: Order[] }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-400 px-1">
        {title}
        <span className="ml-2 text-xs rounded-full bg-stone-800 px-2 py-0.5 text-stone-300">
          {orders.length}
        </span>
      </h2>
      {orders.length === 0 ? (
        <p className="text-stone-600 text-sm text-center py-8">Nenhum pedido</p>
      ) : (
        orders.map((o) => <KitchenCard key={o.id} order={o} />)
      )}
    </div>
  )
}
