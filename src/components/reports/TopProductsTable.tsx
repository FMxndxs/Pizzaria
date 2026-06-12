import type { TopProductRow } from '@/lib/reports/service'

export function TopProductsTable({ rows }: { rows: TopProductRow[] }) {
  if (rows.length === 0) {
    return <p className="text-stone-500 text-sm py-4 text-center">Sem dados no período.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-800 text-stone-400 text-xs uppercase">
            <th className="text-left py-2 pr-4">Sabor</th>
            <th className="text-left py-2 pr-4">Formato</th>
            <th className="text-right py-2 pr-4">Pedidos</th>
            <th className="text-right py-2">Qtd total</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={`${r.flavor_name}-${r.format_label}`} className="border-b border-stone-800/40 hover:bg-stone-800/20">
              <td className="py-2 pr-4 text-foreground font-medium">{r.flavor_name}</td>
              <td className="py-2 pr-4 text-stone-300">{r.format_label}</td>
              <td className="py-2 pr-4 text-right text-stone-300">{r.order_count}</td>
              <td className="py-2 text-right font-semibold text-accent-400">{r.total_qty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
