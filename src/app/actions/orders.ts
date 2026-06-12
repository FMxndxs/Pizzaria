'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import {
  createOrder as svcCreateOrder,
  confirmOrder as svcConfirmOrder,
  advanceStatus as svcAdvanceStatus,
  cancelOrder as svcCancelOrder,
} from '@/lib/orders/service'
import { newOrderSchema } from '@/lib/orders/schemas'
import { getNotificationProvider } from '@/lib/notifications'
import type { OrderServiceResult } from '@/lib/orders/types'
import type { Order } from '@/types'

export async function createOrderAction(
  raw: unknown,
): Promise<OrderServiceResult<{ orderId: string; waUrl: string | null }>> {
  const parsed = newOrderSchema.safeParse(raw)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Dados inválidos' }
  }

  const client = await createClient()
  const result = await svcCreateOrder(client, parsed.data)
  if (!result.ok) return result

  revalidatePath('/admin/pedidos')

  let waUrl: string | null = null
  try {
    const provider = getNotificationProvider()
    const notif = await provider.notifyCustomer(result.data, 'order_confirmed')
    if (notif.kind === 'wa_link') waUrl = notif.url
  } catch {}

  return { ok: true, data: { orderId: result.data.id, waUrl } }
}

export async function confirmOrderAction(
  orderId: string,
): Promise<OrderServiceResult<Order>> {
  const client = await createClient()
  const result = await svcConfirmOrder(client, orderId)
  if (result.ok) revalidatePath('/admin/pedidos')
  return result
}

export async function advanceOrderStatusAction(
  orderId: string,
  toStatus: string,
): Promise<OrderServiceResult<Order>> {
  const client = await createClient()
  const result = await svcAdvanceStatus(client, orderId, toStatus as Order['status'])
  if (result.ok) revalidatePath('/admin/pedidos')
  return result
}

export async function cancelOrderAction(
  orderId: string,
): Promise<OrderServiceResult<Order>> {
  const client = await createClient()
  const result = await svcCancelOrder(client, orderId)
  if (result.ok) revalidatePath('/admin/pedidos')
  return result
}
