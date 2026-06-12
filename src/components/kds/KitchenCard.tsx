'use client'

import { useState, useTransition, useEffect } from 'react'
import { advanceOrderStatusAction } from '@/app/actions/orders'
import { getElapsedMinutes, elapsedBadgeColor } from '@/lib/kds/elapsed'
import type { Order, OrderItemFlavor } from '@/types'

const BADGE_CLASSES = {
  green:  'bg-green-500/20 text-green-400',
  yellow: 'bg-yellow-500/20 text-yellow-300',
  red:    'bg-red-500/20 text-red-400 animate-pulse',
}

interface KitchenCardProps {
  order: Order
}

export function KitchenCard({ order }: KitchenCardProps) {
  const [isPending, startTransition] = useTransition()
  const [elapsed, setElapsed] = useState(() => getElapsedMinutes(order.created_at))

  // Atualiza o badge a cada 60 s sem re-renderizar o resto
  useEffect(() => {
    const id = setInterval(() => setElapsed(getElapsedMinutes(order.created_at)), 60_000)
    return () => clearInterval(id)
  }, [order.created_at])

  function advance(toStatus: 'preparing' | 'ready') {
    startTransition(async () => {
      await advanceOrderStatusAction(order.id, toStatus)
    })
  }

  const color = elapsedBadgeColor(elapsed)

  return (
    <div className="rounded-2xl border border-stone-700/60 bg-stone-900/70 p-4 flex flex-col gap-3">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-accent-400 text-base">#{order.order_code}</span>
          <span className="text-stone-400 text-xs truncate max-w-[120px]">{order.customer_name}</span>
        </div>
        <span
          data-testid="elapsed-badge"
          className={`text-xs font-semibold rounded-full px-2.5 py-1 shrink-0 ${BADGE_CLASSES[color]}`}
        >
          {elapsed} min
        </span>
      </div>

      {/* Itens */}
      {order.items && order.items.length > 0 && (
        <div className="flex flex-col gap-1">
          {order.items.map((item) => {
            const flavors = item.flavors as OrderItemFlavor[]
            return (
              <div key={item.id} className="text-sm">
                <span className="text-foreground font-medium">{item.format_label}</span>
                {item.quantity > 1 && (
                  <span className="ml-1 text-xs text-stone-400">x{item.quantity}</span>
                )}
                <span className="text-stone-400 ml-1">— {flavors.map((f) => f.name).join(' + ')}</span>
              </div>
            )
          })}
        </div>
      )}

      {/* Observações */}
      {order.notes && (
        <p className="text-xs text-stone-400 italic border-t border-stone-800/60 pt-2">
          {order.notes}
        </p>
      )}

      {/* Ações */}
      <div className="flex gap-2 border-t border-stone-800/60 pt-3">
        {order.status === 'confirmed' && (
          <button
            onClick={() => advance('preparing')}
            disabled={isPending}
            className="flex-1 rounded-xl bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 font-semibold text-sm py-2 transition-colors disabled:opacity-50"
          >
            {isPending ? '…' : 'Iniciar preparo'}
          </button>
        )}
        {order.status === 'preparing' && (
          <button
            onClick={() => advance('ready')}
            disabled={isPending}
            className="flex-1 rounded-xl bg-green-500/20 text-green-400 hover:bg-green-500/30 font-semibold text-sm py-2 transition-colors disabled:opacity-50"
          >
            {isPending ? '…' : 'Marcar pronto'}
          </button>
        )}
        <a
          href={`/admin/pedidos/${order.id}/ticket-cozinha`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-stone-700/60 text-stone-400 hover:text-foreground hover:border-stone-600 text-xs px-3 py-2 transition-colors"
          title="Imprimir ticket"
        >
          🖨️
        </a>
      </div>
    </div>
  )
}
