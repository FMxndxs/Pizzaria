import type { WhatsAppOrderPayload } from '@/types'
import { formatBRL } from './formatters'

export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? 'Forno & Lenha'
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '5511989525014'

export function buildWhatsAppMessage(payload: WhatsAppOrderPayload): string {
  const { customer, items, total, deliveryQuote } = payload
  const freight = deliveryQuote?.freight ?? 0
  const grandTotal = total + freight

  const itemLines = items
    .map((item) => {
      const flavorNames = item.flavors.map((f) => f.name).join(' + ')
      const typeLabel = item.type ? ` ${item.type.charAt(0).toUpperCase() + item.type.slice(1)}` : ''
      const label = `${item.formatLabel}${typeLabel} (${flavorNames})`
      return `- ${label} x${item.quantity} — ${formatBRL(item.unitPrice * item.quantity)}`
    })
    .join('\n')

  const lines = [
    `Novo Pedido — ${SITE_NAME}`,
    '',
    `Cliente: ${customer.name}`,
    `Telefone: ${customer.phone}`,
    `CEP: ${customer.cep}`,
    `Endereço: ${customer.street}, ${customer.number}`,
    `Bairro: ${customer.neighborhood} / ${customer.city}`,
    '',
    'Itens:',
    itemLines,
    '',
    `Subtotal: ${formatBRL(total)}`,
  ]

  if (customer.notes) lines.push(`Obs: ${customer.notes}`)

  if (deliveryQuote?.mode === 'delivery' && freight > 0) {
    lines.push(
      `Frete: ${formatBRL(freight)} (entrega própria · ${deliveryQuote.distanceKm?.toFixed(1)} km · R$ ${deliveryQuote.perKm.toFixed(2).replace('.', ',')}/km)`,
      `Total: ${formatBRL(grandTotal)}`,
    )
  } else if (deliveryQuote?.mode === 'pickup_or_courier') {
    lines.push(
      'Frete: a combinar (retirada na loja ou Uber Flash / 99 Entregas)',
      `Total: ${formatBRL(total)} + frete`,
    )
  } else {
    lines.push('Frete: a combinar', `Total: ${formatBRL(total)} + frete`)
  }

  lines.push('', `Pedido gerado pelo site ${SITE_NAME}`)
  return lines.join('\n')
}

export function buildWhatsAppUrl(payload: WhatsAppOrderPayload): string {
  const message = buildWhatsAppMessage(payload)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export function buildSupportMessage(issue: string): string {
  return `Olá! Gostaria de saber mais sobre: ${issue}`
}

export function buildSupportUrl(issue: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildSupportMessage(issue))}`
}
