import { createClient } from '@/lib/supabase/server'
import { getKitchenQueue } from '@/lib/orders/service'
import { KitchenBoard } from '@/components/kds/KitchenBoard'
import type { Order } from '@/types'

export const metadata = { title: 'Cozinha — KDS' }
export const revalidate = 0

export default async function CozinhaPage() {
  const supabase = await createClient()
  const result = await getKitchenQueue(supabase)
  const initialOrders: Order[] = result.ok ? result.data : []

  return (
    <div className="min-h-screen bg-stone-950">
      <header className="px-6 py-4 border-b border-stone-800/60 flex items-center gap-3">
        <span className="text-2xl">👨‍🍳</span>
        <h1 className="text-xl font-bold text-foreground">Cozinha</h1>
      </header>
      <KitchenBoard initialOrders={initialOrders} />
    </div>
  )
}
