import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { KitchenTicket } from '@/components/print/KitchenTicket'
import { TicketShell } from '@/components/print/TicketShell'
import type { Order } from '@/types'

export default async function TicketCozinhaPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .eq('id', params.id)
    .single()

  if (!data) notFound()

  return (
    <TicketShell>
      <KitchenTicket order={data as Order} />
    </TicketShell>
  )
}
