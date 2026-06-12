import type { FulfillmentType, OrderStatus, UserRole } from '@/types'

export type { FulfillmentType, OrderStatus, UserRole }

export interface NewOrderInput {
  customer_name: string
  customer_phone: string
  cep: string
  street: string
  street_number: string
  neighborhood: string
  city: string
  notes?: string | null
  total: number
  freight: number | null
  fulfillment_type: FulfillmentType
  items: NewOrderItem[]
}

export interface NewOrderItem {
  format_code: string
  format_label: string
  flavors: NewOrderItemFlavor[]
  unit_price: number
  quantity: number
}

export interface NewOrderItemFlavor {
  name: string
  type: string | null
  price: number
}

export type OrderServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string }
