'use client'

import { createClient } from './browser'
import type { Order, PizzaCartItem } from '@/types'

// ─── Pedidos ───────────────────────────────────────────────────────────────

interface CreateOrderParams {
  userId: string | null        // null = guest
  items: PizzaCartItem[]
  total: number
  freight?: number
  cep?: string
  street?: string
  streetNumber?: string
  neighborhood: string
  city: string
  notes?: string
  customerName: string
  customerPhone: string
}

/** @deprecated Use createOrderAction (src/app/actions/orders.ts) */
export async function createOrder(params: CreateOrderParams): Promise<string | null> {
  const supabase = createClient()

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id:        params.userId,
      status:         'pending',
      customer_name:  params.customerName,
      customer_phone: params.customerPhone,
      total:          params.total,
      freight:        params.freight ?? null,
      cep:            params.cep ?? '',
      street:         params.street ?? '',
      street_number:  params.streetNumber ?? '',
      neighborhood:   params.neighborhood,
      city:           params.city,
      notes:          params.notes ?? null,
    })
    .select('id')
    .single()

  if (orderError || !order) {
    console.error('createOrder:', orderError)
    return null
  }

  const orderItemRows = params.items.map((item) => ({
    order_id:     order.id,
    format_code:  item.formatCode,
    format_label: item.formatLabel,
    flavors:      item.flavors.map((f) => ({
      name:  f.name,
      price: f.price,
    })),
    unit_price: item.unitPrice,
    quantity:   item.quantity,
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItemRows)

  if (itemsError) console.error('createOrder items:', itemsError)

  return order.id
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('orders')
    .select(`*, items:order_items(*)`)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) { console.error('getUserOrders:', error); return [] }
  return (data ?? []) as Order[]
}
