import type { Order } from '@/types'
import type { NotificationEvent } from '@/lib/orders/messages'

export type { NotificationEvent }

export type NotificationResult =
  | { kind: 'wa_link'; url: string }
  | { kind: 'sent' }

export interface NotificationProvider {
  notifyCustomer(order: Order, event: NotificationEvent): Promise<NotificationResult>
}
