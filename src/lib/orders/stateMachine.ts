import type { FulfillmentType, OrderStatus } from '@/types'

// ─── Status metadata ──────────────────────────────────────────────────────────

export interface OrderStatusMeta {
  label: string
  color: string   // classe Tailwind de cor de texto/fundo
  emoji: string
}

export const ORDER_STATUS_META: Record<OrderStatus, OrderStatusMeta> = {
  pending:          { label: 'Aguardando',       color: 'text-yellow-700 bg-yellow-100',  emoji: '⏳' },
  confirmed:        { label: 'Confirmado',        color: 'text-blue-700 bg-blue-100',     emoji: '✅' },
  preparing:        { label: 'Em preparo',        color: 'text-orange-700 bg-orange-100', emoji: '👨‍🍳' },
  ready:            { label: 'Pronto',            color: 'text-green-700 bg-green-100',   emoji: '🔔' },
  out_for_delivery: { label: 'Saiu para entrega', color: 'text-purple-700 bg-purple-100', emoji: '🛵' },
  delivered:        { label: 'Entregue',          color: 'text-gray-700 bg-gray-100',     emoji: '🏁' },
  cancelled:        { label: 'Cancelado',         color: 'text-red-700 bg-red-100',       emoji: '❌' },
}

// ─── Transitions ──────────────────────────────────────────────────────────────

// Fonte única de verdade sobre transições legais.
// Qualquer UI (dropdown), Server Action ou REST deve chamar canTransition/nextStatuses.
const TRANSITIONS: Record<OrderStatus, Record<FulfillmentType, OrderStatus[]>> = {
  pending:          { delivery: ['confirmed', 'cancelled'],            pickup: ['confirmed', 'cancelled'] },
  confirmed:        { delivery: ['preparing', 'cancelled'],            pickup: ['preparing', 'cancelled'] },
  preparing:        { delivery: ['ready', 'cancelled'],                pickup: ['ready', 'cancelled'] },
  ready:            { delivery: ['out_for_delivery', 'cancelled'],     pickup: ['delivered', 'cancelled'] },
  out_for_delivery: { delivery: ['delivered', 'cancelled'],            pickup: [] },
  delivered:        { delivery: [],                                    pickup: [] },
  cancelled:        { delivery: [],                                    pickup: [] },
}

export function canTransition(
  from: OrderStatus,
  to: OrderStatus,
  fulfillmentType: FulfillmentType,
): boolean {
  return TRANSITIONS[from][fulfillmentType].includes(to)
}

export function nextStatuses(
  from: OrderStatus,
  fulfillmentType: FulfillmentType,
): OrderStatus[] {
  return TRANSITIONS[from][fulfillmentType]
}
