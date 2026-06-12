// ─── Domínio de pizzaria ───────────────────────────────────────────────────

export type FlavorType = 'salgada' | 'doce'

export interface Format {
  code: string           // 'pizza-grande' | 'pizza-broto' | 'calzone'
  label: string          // 'Pizza Grande'
  max_flavors: number    // 3 | 2 | 1
  sort: number
}

export interface FlavorPrice {
  id: string
  flavor_id: string
  format_code: string
  price: number
}

export interface FlavorImage {
  id: string
  flavor_id: string
  url: string
  alt: string
  is_primary: boolean
  sort_order: number
}

export interface Flavor {
  id: string
  name: string
  slug: string
  description: string
  type: FlavorType
  is_available: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
  // relações (opcionais, preenchidas pelos joins)
  prices?: FlavorPrice[]
  images?: FlavorImage[]
}

// ─── Carrinho ─────────────────────────────────────────────────────────────

export interface PizzaCartFlavor {
  id: string
  name: string
  price: number          // preço para o formato atual
}

export interface PizzaCartItem {
  id: string             // uuid local (chave do item)
  formatCode: string
  formatLabel: string
  type: FlavorType | null   // null para calzone sem filtro de tipo
  flavors: PizzaCartFlavor[]
  unitPrice: number      // = max(flavors[].price)
  quantity: number
  imageUrl?: string      // foto do 1º sabor p/ exibição no carrinho
}

// ─── Pedido ───────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'

export type FulfillmentType = 'delivery' | 'pickup'

export type UserRole = 'owner' | 'operator' | 'kitchen'

export interface OrderItemFlavor {
  name: string
  type: FlavorType | null
  price: number
}

export interface OrderItem {
  id: string
  order_id: string
  format_code: string
  format_label: string
  flavors: OrderItemFlavor[]   // snapshot jsonb
  unit_price: number
  quantity: number
}

export interface Order {
  id: string
  user_id: string | null
  status: OrderStatus
  order_code: string
  order_seq: number
  customer_name: string
  customer_phone: string
  total: number
  freight: number | null
  cep: string
  street: string
  street_number: string
  neighborhood: string
  city: string
  notes: string | null
  fulfillment_type: FulfillmentType
  courier_name: string | null
  created_at: string
  updated_at: string
  items?: OrderItem[]
}

// ─── Checkout ─────────────────────────────────────────────────────────────

export interface CustomerInfo {
  name: string
  phone: string
  cep: string
  street: string
  number: string
  neighborhood: string
  city: string
  notes?: string
}

export type DeliveryMode = 'delivery' | 'pickup_or_courier' | 'unknown'

export interface DeliveryQuote {
  distanceKm: number | null
  withinRadius: boolean
  freight: number
  mode: DeliveryMode
  perKm: number
  radiusKm: number
  address?: {
    cep: string
    street: string
    neighborhood: string
    city: string
    state: string
  }
}

export interface WhatsAppOrderPayload {
  customer: CustomerInfo
  items: PizzaCartItem[]
  total: number
  deliveryQuote?: DeliveryQuote
}

// ─── Auth / Perfil ────────────────────────────────────────────────────────

export interface UserProfile {
  id: string
  first_name: string
  last_name: string
  phone: string
  is_admin: boolean
  role: UserRole
  neighborhood: string
  city: string
  created_at: string
  updated_at: string
}

// ─── Settings (frete) ─────────────────────────────────────────────────────

export interface FreightConfig {
  hq_cep?: string
  hq_lat?: number
  hq_lng?: number
  hq_label?: string
  freight_per_km: number
  delivery_radius_km: number
}
