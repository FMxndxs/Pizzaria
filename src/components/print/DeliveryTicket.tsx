import { formatBRL } from '@/lib/utils/formatters'
import type { Order } from '@/types'

interface DeliveryTicketProps {
  order: Order
}

export function DeliveryTicket({ order }: DeliveryTicketProps) {
  const isPickup = order.fulfillment_type === 'pickup'
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
      <div className="mb-3 text-sm">
        <p className="font-bold">{order.customer_name}</p>
        <p>{order.customer_phone}</p>
      </div>

      {/* Entrega ou Retirada */}
      <div className="mb-3 text-sm border border-black p-2">
        {isPickup ? (
          <p className="font-bold text-center uppercase">Retirada no balcão</p>
        ) : (
          <>
            <p className="font-bold uppercase mb-1">Endereço de entrega:</p>
            <p>{order.street}, {order.street_number}</p>
            <p>{order.neighborhood} — {order.city}</p>
            {order.cep && <p>CEP: {order.cep}</p>}
          </>
        )}
      </div>

      {/* Courier */}
      {!isPickup && order.courier_name && (
        <div className="mb-3 text-sm">
          <span className="font-bold">Motoboy: </span>
          <span>{order.courier_name}</span>
        </div>
      )}

      {/* Total */}
      <div className="flex justify-between font-bold border-t border-black pt-2">
        <span>TOTAL</span>
        <span>{formatBRL(order.total)}</span>
      </div>
      {order.freight != null && order.freight > 0 && (
        <div className="flex justify-between text-xs text-gray-600">
          <span>Frete incluído</span>
          <span>{formatBRL(order.freight)}</span>
        </div>
      )}
    </div>
  )
}
