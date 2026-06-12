import { createClient } from '@/lib/supabase/server'
import { DispatchCard } from '@/components/admin/DispatchCard'
import type { Order } from '@/types'

export const metadata = { title: 'Despacho — Admin' }
export const revalidate = 0

export default async function DespachoPage() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .in('status', ['ready', 'out_for_delivery'])
    .order('created_at', { ascending: true })

  const orders: Order[] = (data ?? []) as Order[]

  const deliveryReady    = orders.filter((o) => o.status === 'ready'            && o.fulfillment_type === 'delivery')
  const pickupReady      = orders.filter((o) => o.status === 'ready'            && o.fulfillment_type === 'pickup')
  const outForDelivery   = orders.filter((o) => o.status === 'out_for_delivery')

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Despacho</h1>
        <p className="text-stone-400 text-sm mt-1">Pedidos prontos aguardando despacho ou retirada</p>
      </div>

      {error && (
        <p className="text-brand-400 text-sm text-center py-8">Erro ao carregar pedidos.</p>
      )}

      <div className="flex flex-col gap-8">
        <Section title="Entregas" emoji="🛵" orders={deliveryReady} emptyText="Nenhum pedido de delivery aguardando despacho" />
        <Section title="Retiradas" emoji="🏪" orders={pickupReady} emptyText="Nenhum pedido de retirada aguardando" />
        <Section title="Em rota" emoji="📍" orders={outForDelivery} emptyText="Nenhum pedido em rota" />
      </div>
    </div>
  )
}

function Section({ title, emoji, orders, emptyText }: {
  title: string; emoji: string; orders: Order[]; emptyText: string
}) {
  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-400 mb-3 flex items-center gap-2">
        <span>{emoji}</span> {title}
        <span className="rounded-full bg-stone-800 text-stone-300 text-xs px-2 py-0.5">{orders.length}</span>
      </h2>
      {orders.length === 0 ? (
        <p className="text-stone-600 text-sm py-4 text-center border border-stone-800/40 rounded-xl">{emptyText}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {orders.map((o) => <DispatchCard key={o.id} order={o} />)}
        </div>
      )}
    </div>
  )
}
