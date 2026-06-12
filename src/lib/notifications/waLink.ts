import type { Order } from '@/types'
import type { NotificationEvent, NotificationResult, NotificationProvider } from './provider'
import { buildNotificationMessage } from '@/lib/orders/messages'

// WaLinkProvider: retorna um link wa.me pré-preenchido endereçado ao
// customer_phone do pedido. O operador clica para abrir o WhatsApp e envia.
// Substituível por Evolution API / Meta em getNotificationProvider() sem
// alterar a camada de serviço (ver ADR-002 e 0-B12 implementation note).
export class WaLinkProvider implements NotificationProvider {
  async notifyCustomer(
    order: Order,
    event: NotificationEvent,
  ): Promise<NotificationResult> {
    const message = buildNotificationMessage(order, event)
    const url = `https://wa.me/${order.customer_phone}?text=${encodeURIComponent(message)}`
    return { kind: 'wa_link', url }
  }
}
