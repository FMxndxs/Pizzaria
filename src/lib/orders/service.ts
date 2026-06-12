import type { SupabaseClient } from '@supabase/supabase-js'
import type { Order, OrderStatus } from '@/types'
import type { NewOrderInput, OrderServiceResult } from './types'
import { canTransition } from './stateMachine'

// Camada de serviço de pedidos.
// Todas as funções recebem SupabaseClient como 1º parâmetro (ADR-002):
// Server Actions passam createServerClient(); futuros route handlers passam
// um client autenticado por Bearer token — a lógica de negócio não distingue.

export async function createOrder(
  client: SupabaseClient,
  input: NewOrderInput,
): Promise<OrderServiceResult<Order>> {
  const { data: orderRow, error: orderError } = await client
    .from('orders')
    .insert({
      user_id:          null,
      status:           'pending',
      customer_name:    input.customer_name,
      customer_phone:   input.customer_phone,
      total:            input.total,
      freight:          input.freight,
      cep:              input.cep,
      street:           input.street,
      street_number:    input.street_number,
      neighborhood:     input.neighborhood,
      city:             input.city,
      notes:            input.notes ?? null,
      fulfillment_type: input.fulfillment_type,
    })
    .select('id')
    .single()

  if (orderError || !orderRow) {
    return { ok: false, error: orderError?.message ?? 'Erro ao criar pedido' }
  }

  const { error: itemsError } = await client
    .from('order_items')
    .insert(
      input.items.map((item) => ({
        order_id:     orderRow.id,
        format_code:  item.format_code,
        format_label: item.format_label,
        flavors:      item.flavors,
        unit_price:   item.unit_price,
        quantity:     item.quantity,
      })),
    )

  if (itemsError) {
    // Remove o pedido órfão se os itens falharem
    await client.from('orders').delete().eq('id', orderRow.id)
    return { ok: false, error: itemsError.message }
  }

  // Busca o pedido completo — order_code é gerado pelo trigger de INSERT
  const { data: fullOrder, error: fetchError } = await client
    .from('orders')
    .select('*, items:order_items(*)')
    .eq('id', orderRow.id)
    .single()

  if (fetchError || !fullOrder) {
    return { ok: false, error: 'Pedido criado, erro ao buscar detalhes' }
  }

  return { ok: true, data: fullOrder as Order }
}

export async function advanceStatus(
  client: SupabaseClient,
  orderId: string,
  toStatus: OrderStatus,
): Promise<OrderServiceResult<Order>> {
  const { data: current, error: fetchError } = await client
    .from('orders')
    .select('id, status, fulfillment_type')
    .eq('id', orderId)
    .single()

  if (fetchError || !current) {
    return { ok: false, error: 'Pedido não encontrado' }
  }

  if (!canTransition(current.status, toStatus, current.fulfillment_type)) {
    return {
      ok: false,
      error: `Transição inválida: ${current.status} → ${toStatus}`,
    }
  }

  const { data: updated, error: updateError } = await client
    .from('orders')
    .update({ status: toStatus })
    .eq('id', orderId)
    .select('*, items:order_items(*)')
    .single()

  if (updateError || !updated) {
    return { ok: false, error: updateError?.message ?? 'Erro ao atualizar status' }
  }

  return { ok: true, data: updated as Order }
}

export async function confirmOrder(
  client: SupabaseClient,
  orderId: string,
): Promise<OrderServiceResult<Order>> {
  return advanceStatus(client, orderId, 'confirmed')
}

export async function cancelOrder(
  client: SupabaseClient,
  orderId: string,
): Promise<OrderServiceResult<Order>> {
  return advanceStatus(client, orderId, 'cancelled')
}

export async function dispatchDelivery(
  client: SupabaseClient,
  orderId: string,
  courierName: string,
): Promise<OrderServiceResult<Order>> {
  // Registra o nome do entregador antes de avançar o status
  const { error: courierError } = await client
    .from('orders')
    .update({ courier_name: courierName })
    .eq('id', orderId)

  if (courierError) return { ok: false, error: courierError.message }

  return advanceStatus(client, orderId, 'out_for_delivery')
}

export async function markPickedUp(
  client: SupabaseClient,
  orderId: string,
): Promise<OrderServiceResult<Order>> {
  return advanceStatus(client, orderId, 'delivered')
}

export async function markDelivered(
  client: SupabaseClient,
  orderId: string,
): Promise<OrderServiceResult<Order>> {
  return advanceStatus(client, orderId, 'delivered')
}

export async function getOrders(
  client: SupabaseClient,
): Promise<OrderServiceResult<Order[]>> {
  const { data, error } = await client
    .from('orders')
    .select('*, items:order_items(*)')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) return { ok: false, error: error.message }
  return { ok: true, data: (data ?? []) as Order[] }
}

export async function getKitchenQueue(
  client: SupabaseClient,
): Promise<OrderServiceResult<Order[]>> {
  const { data, error } = await client
    .from('orders')
    .select('*, items:order_items(*)')
    .in('status', ['confirmed', 'preparing', 'ready'])
    .order('created_at', { ascending: true })

  if (error) return { ok: false, error: error.message }
  return { ok: true, data: (data ?? []) as Order[] }
}

export async function getOrderHistory(
  client: SupabaseClient,
  orderId: string,
): Promise<OrderServiceResult<{ status: string; changed_at: string; changed_by: string | null }[]>> {
  const { data, error } = await client
    .from('order_status_history')
    .select('status, changed_at, changed_by')
    .eq('order_id', orderId)
    .order('changed_at', { ascending: true })

  if (error) return { ok: false, error: error.message }
  return { ok: true, data: data ?? [] }
}
