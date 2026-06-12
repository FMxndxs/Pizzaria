import { formatBRL } from '@/lib/utils/formatters'
import type { DailyRevenueRow } from '@/lib/reports/service'

function formatDay(iso: string) {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

export function RevenueTable({ rows }: { rows: DailyRevenueRow[] }) {
  if (rows.length === 0) {
    return <p className="text-stone-500 text-sm py-4 text-center">Sem dados no período.</p>
  }

  const totalRevenue = rows.reduce((s, r) => s + r.revenue, 0)
  const totalOrders = rows.reduce((s, r) => s + r.order_count, 0)

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-800 text-stone-400 text-xs uppercase">
            <th className="text-left py-2 pr-4">Dia</th>
            <th className="text-right py-2 pr-4">Pedidos</th>
            <th className="text-right py-2 pr-4">Faturamento</th>
            <th className="text-right py-2">Ticket médio</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.day} className="border-b border-stone-800/40 hover:bg-stone-800/20">
              <td className="py-2 pr-4 text-foreground font-mono">{formatDay(r.day)}</td>
              <td className="py-2 pr-4 text-right text-stone-300">{r.order_count}</td>
              <td className="py-2 pr-4 text-right text-accent-400 font-semibold">{formatBRL(r.revenue)}</td>
              <td className="py-2 text-right text-stone-300">{formatBRL(r.avg_ticket)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-stone-700 font-bold text-foreground">
            <td className="pt-2">Total</td>
            <td className="pt-2 text-right pr-4">{totalOrders}</td>
            <td className="pt-2 text-right pr-4 text-accent-400">{formatBRL(totalRevenue)}</td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
