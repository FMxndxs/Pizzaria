import type { Order } from '@/types'
import { SITE_NAME } from '@/lib/utils/whatsapp'

export type NotificationEvent = 'order_confirmed' | 'order_ready' | 'order_dispatched'

export function buildNotificationMessage(order: Order, event: NotificationEvent): string {
  const { order_code, customer_name } = order

  switch (event) {
    case 'order_confirmed':
      return [
        `Olá, ${customer_name}! 🍕`,
        '',
        `Seu pedido *${order_code}* foi *confirmado* e está sendo preparado.`,
        'Em breve você receberá uma atualização.',
        '',
        `— ${SITE_NAME}`,
      ].join('\n')

    case 'order_ready':
      return [
        `Olá, ${customer_name}! 🔔`,
        '',
        `Seu pedido *${order_code}* está *pronto*!`,
        order.fulfillment_type === 'pickup'
          ? 'Pode vir retirar no balcão quando quiser.'
          : 'Em instantes o motoboy sairá para entrega.',
        '',
        `— ${SITE_NAME}`,
      ].join('\n')

    case 'order_dispatched':
      return [
        `Olá, ${customer_name}! 🛵`,
        '',
        `Seu pedido *${order_code}* *saiu para entrega*!`,
        order.courier_name ? `Entregador: ${order.courier_name}` : '',
        '',
        `— ${SITE_NAME}`,
      ]
        .filter(Boolean)
        .join('\n')
  }
}
