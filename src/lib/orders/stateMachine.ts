import type { FulfillmentType, OrderStatus } from '@/types'

// ─── Status metadata ──────────────────────────────────────────────────────────

export interface OrderStatusMeta {
  label: string
  color: string      // badge completo: "bg-X text-Y" — usar em badges de status
  textClass: string  // só texto: "text-X" — usar em <select> e elementos inline
  emoji: string
}

export const ORDER_STATUS_META: Record<OrderStatus, OrderStatusMeta> = {
  pending:          { label: 'Aguardando',       color: 'bg-stone-700/40 text-stone-300',   textClass: 'text-stone-300',  emoji: '⏳' },
  confirmed:        { label: 'Confirmado',        color: 'bg-accent-500/20 text-accent-400', textClass: 'text-accent-400', emoji: '✅' },
  preparing:        { label: 'Em preparo',        color: 'bg-orange-500/20 text-orange-400', textClass: 'text-orange-400', emoji: '👨‍🍳' },
  ready:            { label: 'Pronto',            color: 'bg-green-500/20 text-green-400',   textClass: 'text-green-400',  emoji: '🔔' },
  out_for_delivery: { label: 'Saiu para entrega', color: 'bg-blue-500/20 text-blue-400',     textClass: 'text-blue-400',   emoji: '🛵' },
  delivered:        { label: 'Entregue',          color: 'bg-herb/20 text-herb',             textClass: 'text-herb',       emoji: '🏁' },
  cancelled:        { label: 'Cancelado',         color: 'bg-brand-700/20 text-brand-400',   textClass: 'text-brand-400',  emoji: '❌' },
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
