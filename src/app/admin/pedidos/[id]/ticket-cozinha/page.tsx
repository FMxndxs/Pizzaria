import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { KitchenTicket } from '@/components/print/KitchenTicket'
import { PrintButton } from '@/components/print/PrintButton'
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
    <>
      <style>{`
        @media print {
          body > *:not(.print-root) { display: none !important; }
          .print-root { display: block !important; }
          .print-ticket { page-break-inside: avoid; }
        }
        @media screen {
          body { background: #f5f5f5; }
          .print-root { padding: 2rem; }
        }
      `}</style>
      <div className="print-root">
        <div className="mb-4 flex gap-3 justify-center">
          <PrintButton label="🖨️ Imprimir ticket" />
        </div>
        <KitchenTicket order={data as Order} />
      </div>
    </>
  )
}
