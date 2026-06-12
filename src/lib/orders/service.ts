import type { SupabaseClient } from '@supabase/supabase-js'
import type { Order } from '@/types'
import type { NewOrderInput, OrderServiceResult } from './types'

// Camada de serviço de pedidos.
// Todas as funções recebem SupabaseClient como 1º parâmetro (ADR-002):
// Server Actions passam createServerClient(); futuros route handlers passam
// um client autenticado por Bearer token. A lógica de negócio não distingue.

export async function createOrder(
  _client: SupabaseClient,
  _input: NewOrderInput,
): Promise<OrderServiceResult<Order>> {
  // TODO: implement in A-B1
  throw new Error('TODO: implement in A-B1')
}

export async function confirmOrder(
  _client: SupabaseClient,
  _orderId: string,
): Promise<OrderServiceResult<Order>> {
  // TODO: implement in A-B4
  throw new Error('TODO: implement in A-B4')
}

export async function advanceStatus(
  _client: SupabaseClient,
  _orderId: string,
): Promise<OrderServiceResult<Order>> {
  // TODO: implement in A-B5
  throw new Error('TODO: implement in A-B5')
}

export async function dispatchDelivery(
  _client: SupabaseClient,
  _orderId: string,
  _courierName: string,
): Promise<OrderServiceResult<Order>> {
  // TODO: implement in C-B2
  throw new Error('TODO: implement in C-B2')
}

export async function markPickedUp(
  _client: SupabaseClient,
  _orderId: string,
): Promise<OrderServiceResult<Order>> {
  // TODO: implement in C-B3
  throw new Error('TODO: implement in C-B3')
}

export async function markDelivered(
  _client: SupabaseClient,
  _orderId: string,
): Promise<OrderServiceResult<Order>> {
  // TODO: implement in C-B4
  throw new Error('TODO: implement in C-B4')
}

export async function cancelOrder(
  _client: SupabaseClient,
  _orderId: string,
): Promise<OrderServiceResult<Order>> {
  // TODO: implement in A-B7
  throw new Error('TODO: implement in A-B7')
}

export async function getOrders(
  _client: SupabaseClient,
): Promise<OrderServiceResult<Order[]>> {
  // TODO: implement in A-B9
  throw new Error('TODO: implement in A-B9')
}

export async function getKitchenQueue(
  _client: SupabaseClient,
): Promise<OrderServiceResult<Order[]>> {
  // TODO: implement in B-B2
  throw new Error('TODO: implement in B-B2')
}

export async function getOrderHistory(
  _client: SupabaseClient,
  _orderId: string,
): Promise<OrderServiceResult<{ status: string; changed_at: string }[]>> {
  // TODO: implement in A-B9
  throw new Error('TODO: implement in A-B9')
}
