'use client'

import { useState, useTransition } from 'react'
import { Truck, PackageCheck, CheckCircle } from 'lucide-react'
import { dispatchDeliveryAction, markPickedUpAction, markDeliveredAction } from '@/app/actions/orders'
import { formatBRL } from '@/lib/utils/formatters'
import type { Order } from '@/types'

interface DispatchCardProps {
  order: Order
}

export function DispatchCard({ order }: DispatchCardProps) {
  const [courier, setCourier]        = useState(order.courier_name ?? '')
  const [isPending, startTransition] = useTransition()
  const [error, setError]            = useState<string | null>(null)

  function run(fn: () => Promise<{ ok: boolean; error?: string }>) {
    setError(null)
    startTransition(async () => {
      const result = await fn()
      if (!result.ok) setError((result as { ok: false; error: string }).error)
    })
  }

  return (
    <div className="rounded-2xl border border-stone-800/60 bg-stone-900/50 p-4 flex flex-col gap-3">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3">
        <span className="font-mono font-bold text-accent-400">#{order.order_code}</span>
        <span className="text-foreground font-medium text-sm flex-1 truncate">{order.customer_name}</span>
        <span className="text-accent-400 font-bold text-sm shrink-0">{formatBRL(order.total)}</span>
      </div>

      {/* Endereço */}
      {order.street && (
        <p className="text-xs text-stone-400">
          {order.street}, {order.street_number} — {order.neighborhood}, {order.city}
        </p>
      )}

      {/* Ações por estado */}
      {order.status === 'ready' && order.fulfillment_type === 'delivery' && (
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={courier}
            onChange={(e) => setCourier(e.target.value)}
            placeholder="Nome do motoboy"
            className="flex-1 rounded-xl bg-stone-800/60 border border-stone-700/60 px-3 py-2 text-sm text-foreground placeholder:text-stone-600 focus:outline-none focus:border-accent-500/60"
          />
          <button
            onClick={() => run(() => dispatchDeliveryAction(order.id, courier))}
            disabled={isPending}
            className="flex items-center gap-1.5 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 font-semibold text-sm px-4 py-2 transition-colors disabled:opacity-50 shrink-0"
          >
            <Truck className="w-3.5 h-3.5" />
            Despachar
          </button>
        </div>
      )}

      {order.status === 'ready' && order.fulfillment_type === 'pickup' && (
        <button
          onClick={() => run(() => markPickedUpAction(order.id))}
          disabled={isPending}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-herb/20 text-herb hover:bg-herb/30 font-semibold text-sm py-2 transition-colors disabled:opacity-50"
        >
          <PackageCheck className="w-3.5 h-3.5" />
          Marcar como retirado
        </button>
      )}

      {order.status === 'out_for_delivery' && (
        <div className="flex flex-col gap-2">
          {order.courier_name && (
            <p className="text-xs text-stone-400">
              Motoboy: <span className="text-foreground font-medium">{order.courier_name}</span>
            </p>
          )}
          <button
            onClick={() => run(() => markDeliveredAction(order.id))}
            disabled={isPending}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-green-500/20 text-green-400 hover:bg-green-500/30 font-semibold text-sm py-2 transition-colors disabled:opacity-50"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Confirmar entrega
          </button>
        </div>
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
