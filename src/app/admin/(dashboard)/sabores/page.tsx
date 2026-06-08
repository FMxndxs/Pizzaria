import { createClient } from '@/lib/supabase/server'
import { formatBRL } from '@/lib/utils/formatters'

export const metadata = { title: 'Sabores — Admin' }
export const revalidate = 0

const FORMATS = ['pizza-grande', 'pizza-broto', 'calzone'] as const

export default async function SaboresAdminPage() {
  const supabase = await createClient()
  const { data: flavors } = await supabase
    .from('flavors')
    .select(`*, prices:flavor_prices(*), images:flavor_images(*)`)
    .order('type')
    .order('name')

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Sabores</h1>
          <p className="text-stone-400 text-sm mt-1">{flavors?.length ?? 0} sabores cadastrados</p>
        </div>
        {/* Futuro: botão "Novo sabor" */}
      </div>

      <div className="rounded-2xl border border-stone-800/60 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-800/60 bg-stone-900/60">
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500">Sabor</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500">Tipo</th>
              <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500">Grande</th>
              <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500">Broto</th>
              <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500">Calzone</th>
              <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {(flavors ?? []).map((flavor) => {
              const price = (code: string) =>
                flavor.prices?.find((p: { format_code: string; price: number }) => p.format_code === code)?.price

              return (
                <tr key={flavor.id} className="border-b border-stone-800/40 last:border-0 hover:bg-stone-800/20 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{flavor.name}</td>
                  <td className="px-4 py-3">
                    <span className={flavor.type === 'salgada' ? 'herb-tag' : 'sweet-tag'}>
                      {flavor.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-accent-400">
                    {price('pizza-grande') ? formatBRL(price('pizza-grande')!) : <span className="text-stone-600">—</span>}
                  </td>
                  <td className="px-4 py-3 text-right text-accent-400">
                    {price('pizza-broto') ? formatBRL(price('pizza-broto')!) : <span className="text-stone-600">—</span>}
                  </td>
                  <td className="px-4 py-3 text-right text-accent-400">
                    {price('calzone') ? formatBRL(price('calzone')!) : <span className="text-stone-600">—</span>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs rounded-full px-2.5 py-1 font-medium ${flavor.is_available ? 'bg-herb/15 text-herb' : 'bg-stone-700/40 text-stone-500'}`}>
                      {flavor.is_available ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
