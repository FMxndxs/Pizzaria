'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { ORDER_STATUS_META } from '@/lib/orders/stateMachine'
import type { OrderStatus } from '@/types'

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

  const { textClass } = ORDER_STATUS_META[status]

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value as OrderStatus)}
      disabled={saving}
      className={`text-xs font-semibold rounded-full px-3 py-1.5 border border-stone-700/60 bg-stone-900/80 cursor-pointer focus:outline-none transition-colors ${textClass} disabled:opacity-50`}
    >
      {(Object.entries(ORDER_STATUS_META) as [OrderStatus, typeof ORDER_STATUS_META[OrderStatus]][]).map(([value, meta]) => (
        <option key={value} value={value}>{meta.emoji} {meta.label}</option>
      ))}
    </select>
  )
}
