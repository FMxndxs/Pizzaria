import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DeliveryTicket } from '@/components/print/DeliveryTicket'
import { TicketShell } from '@/components/print/TicketShell'
import type { Order } from '@/types'

export default async function TicketEntregaPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .eq('id', params.id)
    .single()

  if (!data) notFound()

  return (
    <TicketShell>
      <DeliveryTicket order={data as Order} />
    </TicketShell>
  )
}
