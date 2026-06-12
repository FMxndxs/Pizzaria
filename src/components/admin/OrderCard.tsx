'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Copy, Check, Phone, Printer, MessageSquare } from 'lucide-react'
import { OrderStatusSelect } from './OrderStatusSelect'
import { formatBRL } from '@/lib/utils/formatters'
import { buildWhatsAppUrl } from '@/lib/utils/whatsapp'
import { ORDER_STATUS_META } from '@/lib/orders/stateMachine'
import type { Order, OrderItemFlavor } from '@/types'

interface OrderCardProps {
  order: Order
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <button
      onClick={copy}
      className="p-1 rounded text-stone-500 hover:text-accent-400 transition-colors"
      title="Copiar"
    >
      {copied ? <Check className="w-3 h-3 text-herb" /> : <Copy className="w-3 h-3" />}
    </button>
  )
}

export function OrderCard({ order }: OrderCardProps) {
  const [expanded, setExpanded] = useState(false)

  const grandTotal = (order.total ?? 0)
  const createdAt = new Date(order.created_at).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
  })

  // Monta payload mínimo para link do WhatsApp
  const whatsappUrl = `https://wa.me/${order.customer_phone?.replace(/\D/g, '')}`

  return (
    <div className="rounded-2xl border border-stone-800/60 bg-stone-900/50 overflow-hidden">
      {/* Header do card */}
      <div className="flex items-center gap-3 px-4 py-3 flex-wrap">
        {/* Status badge */}
        <span className={`text-xs font-semibold rounded-full px-2.5 py-1 ${ORDER_STATUS_META[order.status].color}`}>
          {ORDER_STATUS_META[order.status].emoji} {ORDER_STATUS_META[order.status].label}
        </span>

        {/* Nome + código + hora */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-foreground text-sm truncate">{order.customer_name}</p>
            {order.order_code && (
              <span className="text-xs font-mono text-stone-400 shrink-0">#{order.order_code}</span>
            )}
          </div>
          <p className="text-stone-500 text-xs">{createdAt}</p>
        </div>

        {/* Total */}
        <span className="text-accent-400 font-bold text-sm shrink-0">{formatBRL(grandTotal)}</span>

        {/* Expandir */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="p-1.5 rounded-xl text-stone-400 hover:text-foreground hover:bg-stone-800 transition-colors"
          aria-label={expanded ? 'Fechar detalhes' : 'Ver detalhes'}
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Detalhes expandidos */}
      {expanded && (
        <div className="border-t border-stone-800/60 px-4 py-4 flex flex-col gap-5">

          {/* ── Bloco dChef — formatado para entrada manual ─────────────────
              Campos na ordem e nomenclatura do fluxo de registro */}
          <div className="rounded-xl border border-stone-700/40 bg-stone-950/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-400 inline-block" />
              Dados para registro no sistema
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {/* Cliente */}
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-stone-500 uppercase tracking-wider">Cliente</span>
                <div className="flex items-center gap-1">
                  <span className="text-foreground font-medium">{order.customer_name}</span>
                  <CopyButton text={order.customer_name} />
                </div>
              </div>

              {/* Telefone */}
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-stone-500 uppercase tracking-wider">Telefone</span>
                <div className="flex items-center gap-1">
                  <span className="text-foreground font-medium">{order.customer_phone}</span>
                  <CopyButton text={order.customer_phone} />
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 rounded text-stone-500 hover:text-herb transition-colors"
                    title="Abrir no WhatsApp"
                  >
                    <Phone className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Endereço */}
              {order.street && (
                <div className="flex flex-col gap-0.5 sm:col-span-2">
                  <span className="text-xs text-stone-500 uppercase tracking-wider">Endereço</span>
                  <div className="flex items-start gap-1">
                    <span className="text-foreground">
                      {order.street}, {order.street_number} — {order.neighborhood}, {order.city}
                      {order.cep ? ` (CEP ${order.cep})` : ''}
                    </span>
                    <CopyButton text={`${order.street}, ${order.street_number}, ${order.neighborhood}, ${order.city}`} />
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-stone-500 uppercase tracking-wider">Total</span>
                <div className="flex items-center gap-1">
                  <span className="text-accent-400 font-bold">{formatBRL(grandTotal)}</span>
                  <CopyButton text={grandTotal.toFixed(2)} />
                </div>
              </div>

              {/* Frete */}
              {order.freight != null && order.freight > 0 && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-stone-500 uppercase tracking-wider">Frete</span>
                  <span className="text-foreground">{formatBRL(order.freight)}</span>
                </div>
              )}
            </div>
          </div>

          {/* ── Itens do pedido ──────────────────────────────────────────── */}
          {order.items && order.items.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
                Itens ({order.items.length})
              </p>
              <div className="flex flex-col gap-2">
                {order.items.map((item) => {
                  const flavors = item.flavors as OrderItemFlavor[]
                  const flavorNames = flavors.map((f) => f.name).join(' + ')
                  return (
                    <div
                      key={item.id}
                      className="flex items-start justify-between gap-3 rounded-xl bg-stone-800/40 px-3 py-2.5"
                    >
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {item.format_label}
                          {item.quantity > 1 && (
                            <span className="ml-1.5 text-xs bg-stone-700 text-stone-300 rounded-full px-2 py-0.5">
                              x{item.quantity}
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-stone-400 mt-0.5">{flavorNames}</p>
                      </div>
                      <span className="text-accent-400 font-semibold text-sm shrink-0">
                        {formatBRL(item.unit_price * item.quantity)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Observações */}
          {order.notes && (
            <div className="rounded-xl bg-stone-800/30 px-3 py-2.5 flex items-start gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
              <p className="text-sm text-stone-300">{order.notes}</p>
            </div>
          )}

          {/* ── Ações ─────────────────────────────────────────────────────── */}
          <div className="flex items-center justify-between gap-3 flex-wrap border-t border-stone-800/40 pt-3">
            <OrderStatusSelect
              orderId={order.id}
              current={order.status}
              fulfillmentType={order.fulfillment_type ?? 'delivery'}
            />
            <div className="flex items-center gap-3">
              <a
                href={`/admin/pedidos/${order.id}/ticket-cozinha`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-stone-400 hover:text-foreground transition-colors"
                title="Ticket cozinha"
              >
                <Printer className="w-3.5 h-3.5" />
                Cozinha
              </a>
              <a
                href={`/admin/pedidos/${order.id}/ticket-entrega`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-stone-400 hover:text-foreground transition-colors"
                title="Ticket entrega/retirada"
              >
                <Printer className="w-3.5 h-3.5" />
                {order.fulfillment_type === 'pickup' ? 'Retirada' : 'Entrega'}
              </a>
              <a
                href={`https://wa.me/${order.customer_phone?.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-herb hover:text-herb/80 transition-colors font-medium"
              >
                <Phone className="w-3.5 h-3.5" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
