'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import type { OrderStatus } from '@/types'

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: 'pending',          label: '⏳ Aguardando' },
  { value: 'confirmed',        label: '✅ Confirmado' },
  { value: 'preparing',        label: '👨‍🍳 Preparando' },
  { value: 'out_for_delivery', label: '🛵 Saiu p/ entrega' },
  { value: 'delivered',        label: '🏠 Entregue' },
  { value: 'cancelled',        label: '❌ Cancelado' },
]

interface OrderStatusSelectProps {
  orderId: string
  current: OrderStatus
}

export function OrderStatusSelect({ orderId, current }: OrderStatusSelectProps) {
  const [status, setStatus] = useState<OrderStatus>(current)
  const [saving, setSaving]  = useState(false)

  async function handleChange(newStatus: OrderStatus) {
    const prev = status
    setStatus(newStatus)
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)
    if (error) setStatus(prev)
    setSaving(false)
  }

  const colors: Record<OrderStatus, string> = {
    pending:          'text-stone-400',
    confirmed:        'text-accent-400',
    preparing:        'text-orange-400',
    out_for_delivery: 'text-blue-400',
    delivered:        'text-herb',
    cancelled:        'text-brand-500',
  }

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value as OrderStatus)}
      disabled={saving}
      className={`text-xs font-semibold rounded-full px-3 py-1.5 border border-stone-700/60 bg-stone-900/80 cursor-pointer focus:outline-none transition-colors ${colors[status]} disabled:opacity-50`}
    >
      {STATUS_OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}
