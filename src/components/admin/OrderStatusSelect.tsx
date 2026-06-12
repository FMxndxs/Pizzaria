'use client'

import { useState, useTransition } from 'react'
import { ORDER_STATUS_META, nextStatuses } from '@/lib/orders/stateMachine'
import { advanceOrderStatusAction } from '@/app/actions/orders'
import type { FulfillmentType, OrderStatus } from '@/types'

interface OrderStatusSelectProps {
  orderId: string
  current: OrderStatus
  fulfillmentType: FulfillmentType
}

export function OrderStatusSelect({ orderId, current, fulfillmentType }: OrderStatusSelectProps) {
  const [status, setStatus] = useState<OrderStatus>(current)
  const [isPending, startTransition] = useTransition()

  const options = nextStatuses(status, fulfillmentType)

  async function handleChange(newStatus: OrderStatus) {
    const prev = status
    setStatus(newStatus)
    startTransition(async () => {
      const result = await advanceOrderStatusAction(orderId, newStatus)
      if (!result.ok) setStatus(prev)
    })
  }

  const { textClass, emoji, label } = ORDER_STATUS_META[status]

  return (
    <div className="flex items-center gap-2">
      <span className={`text-xs font-semibold rounded-full px-2.5 py-1 ${ORDER_STATUS_META[status].color}`}>
        {emoji} {label}
      </span>
      {options.length > 0 && (
        <select
          value=""
          onChange={(e) => handleChange(e.target.value as OrderStatus)}
          disabled={isPending}
          className={`text-xs font-semibold rounded-full px-3 py-1.5 border border-stone-700/60 bg-stone-900/80 cursor-pointer focus:outline-none transition-colors ${textClass} disabled:opacity-50`}
        >
          <option value="" disabled>Avançar →</option>
          {options.map((s) => (
            <option key={s} value={s}>
              {ORDER_STATUS_META[s].emoji} {ORDER_STATUS_META[s].label}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}
