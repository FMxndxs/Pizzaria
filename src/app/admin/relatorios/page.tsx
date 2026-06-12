import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getDailyRevenue, getTopProducts, getPeakHours, getLeadTimes } from '@/lib/reports/service'
import { RevenueTable } from '@/components/reports/RevenueTable'
import { TopProductsTable } from '@/components/reports/TopProductsTable'
import { PeakHoursTable } from '@/components/reports/PeakHoursTable'

export const revalidate = 0

interface Props {
  searchParams: { dias?: string }
}

export default async function RelatoriosPage({ searchParams }: Props) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'owner') redirect('/admin')

  const days = Math.min(Math.max(parseInt(searchParams.dias ?? '30', 10) || 30, 1), 365)

  const [revenue, topProducts, peakHours, leadTimes] = await Promise.all([
    getDailyRevenue(supabase, days).catch(() => []),
    getTopProducts(supabase, days).catch(() => []),
    getPeakHours(supabase, days).catch(() => []),
    getLeadTimes(supabase, days).catch(() => []),
  ])

  const avgLead = leadTimes.length > 0
    ? leadTimes.reduce((s, r) => s + r.lead_minutes, 0) / leadTimes.length
    : null

  return (
    <div className="flex flex-col gap-8 p-6 max-w-5xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-foreground">Relatórios</h1>
        <div className="flex items-center gap-2">
          {[15, 30, 90].map((d) => (
            <a
              key={d}
              href={`/admin/relatorios?dias=${d}`}
              className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-colors ${
                days === d
                  ? 'bg-accent-400 text-stone-900'
                  : 'border border-stone-700 text-stone-400 hover:text-foreground'
              }`}
            >
              {d} dias
            </a>
          ))}
          <a
            href={`/api/reports/csv?dias=${days}`}
            className="text-xs px-3 py-1.5 rounded-xl border border-stone-700 text-stone-400 hover:text-foreground transition-colors ml-2"
          >
            ↓ CSV
          </a>
        </div>
      </div>

      {/* KPIs */}
      {revenue.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <KpiCard
            label="Pedidos"
            value={String(revenue.reduce((s, r) => s + r.order_count, 0))}
          />
          <KpiCard
            label="Faturamento"
            value={`R$ ${revenue.reduce((s, r) => s + r.revenue, 0).toFixed(2).replace('.', ',')}`}
          />
          <KpiCard
            label="Ticket médio"
            value={`R$ ${(revenue.reduce((s, r) => s + r.avg_ticket, 0) / revenue.length).toFixed(2).replace('.', ',')}`}
          />
          {avgLead !== null && (
            <KpiCard label="Lead time médio" value={`${avgLead.toFixed(1)} min`} />
          )}
        </div>
      )}

      {/* Faturamento diário */}
      <Section title="Faturamento por dia">
        <RevenueTable rows={revenue} />
      </Section>

      {/* Produtos mais vendidos */}
      <Section title="Produtos mais vendidos">
        <TopProductsTable rows={topProducts} />
      </Section>

      {/* Horários de pico */}
      <Section title="Horários de pico">
        <PeakHoursTable rows={peakHours} />
      </Section>
    </div>
  )
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-stone-800/60 bg-stone-900/50 p-4 flex flex-col gap-1">
      <p className="text-xs text-stone-500 uppercase tracking-wider">{label}</p>
      <p className="text-xl font-bold text-accent-400">{value}</p>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-stone-800/60 bg-stone-900/50 p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-400 mb-4">{title}</h2>
      {children}
    </div>
  )
}
