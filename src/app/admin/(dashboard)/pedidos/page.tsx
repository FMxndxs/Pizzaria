import { createClient } from '@/lib/supabase/server'
import { OrderCard } from '@/components/admin/OrderCard'
import type { Order } from '@/types'

export const metadata = { title: 'Pedidos — Admin' }
export const revalidate = 0

export default async function PedidosPage() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('orders')
    .select(`*, items:order_items(*)`)
    .order('created_at', { ascending: false })
    .limit(100)

  const orders: Order[] = (data ?? []) as Order[]

  const counts = {
    total:     orders.length,
    pending:   orders.filter((o) => o.status === 'pending').length,
    preparing: orders.filter((o) => o.status === 'preparing').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Pedidos</h1>
        <p className="text-stone-400 text-sm mt-1">
          Gerencie e registre os pedidos no sistema de controle
        </p>
      </div>

      {/* Cards de contagem */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Total',      value: counts.total,     color: 'text-foreground' },
          { label: 'Aguardando', value: counts.pending,   color: 'text-stone-400' },
          { label: 'Preparando', value: counts.preparing, color: 'text-orange-400' },
          { label: 'Entregues',  value: counts.delivered, color: 'text-herb' },
        ].map((c) => (
          <div key={c.label} className="rounded-xl border border-stone-800/60 bg-stone-900/40 px-4 py-3">
            <p className="text-xs text-stone-500 uppercase tracking-wider">{c.label}</p>
            <p className={`text-2xl font-bold mt-0.5 ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Dica dChef */}
      <div className="rounded-xl border border-accent-500/20 bg-accent-500/5 px-4 py-3 mb-6 text-sm text-stone-300 flex items-start gap-2">
        <span className="text-accent-400 mt-0.5 shrink-0">💡</span>
        <span>
          Clique em <strong className="text-foreground">▼ Ver detalhes</strong> para acessar os dados formatados prontos para registro no dChef.
          Use os botões de cópia para transferir campos sem redigitar.
        </span>
      </div>

      {/* Lista de pedidos */}
      {error && (
        <p className="text-brand-400 text-sm text-center py-8">
          Erro ao carregar pedidos. Verifique as permissões no Supabase.
        </p>
      )}

      {orders.length === 0 && !error && (
        <div className="text-center py-16 text-stone-500">
          Nenhum pedido ainda. Os pedidos feitos pelo site aparecerão aqui.
        </div>
      )}

      <div className="flex flex-col gap-3">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  )
}
