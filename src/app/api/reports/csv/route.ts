import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getDailyRevenue } from '@/lib/reports/service'

export async function GET(req: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'owner') return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const days = parseInt(req.nextUrl.searchParams.get('dias') ?? '30', 10) || 30
  const rows = await getDailyRevenue(supabase, days)

  const header = 'dia,pedidos,faturamento,ticket_medio\n'
  const body = rows
    .map((r) => `${r.day},${r.order_count},${r.revenue.toFixed(2)},${r.avg_ticket.toFixed(2)}`)
    .join('\n')

  return new NextResponse(header + body, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="relatorio-${days}d.csv"`,
    },
  })
}
