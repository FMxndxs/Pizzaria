import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Configurações — Admin' }

export default async function ConfiguracoesPage() {
  const supabase = await createClient()
  const { data: settings } = await supabase
    .from('settings')
    .select('*')
    .eq('id', 1)
    .single()

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
        <p className="text-stone-400 text-sm mt-1">Parâmetros de frete e entrega</p>
      </div>

      <div className="rounded-2xl border border-stone-800/60 bg-stone-900/40 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-stone-300 uppercase tracking-wider">Frete</h2>
        {[
          { label: 'CEP da sede',         value: settings?.hq_cep ?? 'Não configurado' },
          { label: 'R$/km',               value: settings ? `R$ ${Number(settings.freight_per_km).toFixed(2).replace('.', ',')}` : '—' },
          { label: 'Raio de entrega',     value: settings ? `${settings.delivery_radius_km} km` : '—' },
        ].map((row) => (
          <div key={row.label} className="flex justify-between items-center py-2 border-b border-stone-800/40 last:border-0">
            <span className="text-stone-400 text-sm">{row.label}</span>
            <span className="text-foreground font-medium text-sm">{row.value}</span>
          </div>
        ))}
        <p className="text-xs text-stone-600 pt-2">
          Para editar, atualize diretamente na tabela <code>settings</code> do Supabase (id=1).
        </p>
      </div>
    </div>
  )
}
