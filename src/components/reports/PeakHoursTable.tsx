import type { PeakHourRow } from '@/lib/reports/service'

function padHour(h: number) {
  return `${String(h).padStart(2, '0')}:00`
}

export function PeakHoursTable({ rows }: { rows: PeakHourRow[] }) {
  if (rows.length === 0) {
    return <p className="text-stone-500 text-sm py-4 text-center">Sem dados no período.</p>
  }

  const max = Math.max(...rows.map((r) => r.order_count))

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-800 text-stone-400 text-xs uppercase">
            <th className="text-left py-2 pr-4">Hora</th>
            <th className="text-right py-2">Pedidos</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const isPeak = r.order_count === max
            return (
              <tr
                key={r.hour}
                data-testid={isPeak ? 'peak-row' : undefined}
                className={`border-b border-stone-800/40 ${isPeak ? 'bg-accent-400/10' : 'hover:bg-stone-800/20'}`}
              >
                <td className={`py-2 pr-4 font-mono ${isPeak ? 'text-accent-400 font-bold' : 'text-foreground'}`}>
                  {padHour(r.hour)}
                </td>
                <td className={`py-2 text-right ${isPeak ? 'text-accent-400 font-bold' : 'text-stone-300'}`}>
                  {r.order_count}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
