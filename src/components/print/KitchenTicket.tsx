import { formatBRL } from '@/lib/utils/formatters'
import type { Order, OrderItemFlavor } from '@/types'

interface KitchenTicketProps {
  order: Order
}

export function KitchenTicket({ order }: KitchenTicketProps) {
  const printedAt = new Date(order.created_at).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

  return (
    <div className="print-ticket font-mono text-black bg-white p-4 max-w-xs mx-auto">
      {/* Cabeçalho */}
      <div className="text-center border-b border-black pb-2 mb-3">
        <p className="font-bold text-lg">Forno &amp; Lenha</p>
        <p className="font-bold text-2xl tracking-widest">{order.order_code}</p>
        <p className="text-xs">{printedAt}</p>
      </div>

      {/* Cliente */}
      <p className="text-sm font-semibold mb-2">{order.customer_name}</p>

      {/* Itens */}
      <div className="mb-3">
        {order.items?.map((item) => {
          const flavors = item.flavors as OrderItemFlavor[]
          return (
            <div key={item.id} className="mb-2 border-b border-dashed border-gray-400 pb-2">
              <div className="flex justify-between text-sm font-bold">
                <span>{item.format_label}{item.quantity > 1 && ` x${item.quantity}`}</span>
                <span>{formatBRL(item.unit_price * item.quantity)}</span>
              </div>
              <p className="text-xs text-gray-700">{flavors.map((f) => f.name).join(' + ')}</p>
            </div>
          )
        })}
      </div>

      {/* Total */}
      <div className="flex justify-between font-bold border-t border-black pt-2 mb-3">
        <span>TOTAL</span>
        <span>{formatBRL(order.total)}</span>
      </div>

      {/* Observações */}
      {order.notes && (
        <div className="border border-black p-2 text-xs">
          <p className="font-bold uppercase">Obs:</p>
          <p>{order.notes}</p>
        </div>
      )}
    </div>
  )
}
