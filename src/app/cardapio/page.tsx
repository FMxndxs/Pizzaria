import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getFlavorsByFormat } from '@/lib/supabase/queries'
import { FlavorCard } from '@/components/catalog/FlavorCard'
import { FormatTabs } from '@/components/catalog/FormatTabs'
import { OvenSkeletonGrid } from '@/components/ui/OvenSkeleton'
import { CrustReveal } from '@/components/ui/MotionPrimitives'
import { OvenCtaLink } from '@/components/ui/OvenCtaLink'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Cardápio',
  description: 'Explore todos os sabores de pizza grande, broto e calzone. Monte sua combinação favorita.',
}

const FORMAT_META: Record<string, { label: string; description: string; max: number }> = {
  'pizza-grande': { label: 'Pizza Grande', description: 'Escolha até 3 sabores', max: 3 },
  'pizza-broto':  { label: 'Pizza Broto',  description: 'Escolha até 2 sabores', max: 2 },
  'calzone':      { label: 'Calzone',       description: '1 sabor à sua escolha', max: 1 },
}

interface PageProps {
  searchParams: Promise<{ formato?: string }>
}

export default async function CardapioPage({ searchParams }: PageProps) {
  const { formato = 'pizza-grande' } = await searchParams
  const formatCode = ['pizza-grande', 'pizza-broto', 'calzone'].includes(formato)
    ? formato
    : 'pizza-grande'

  const flavors = await getFlavorsByFormat(formatCode)
  const meta = FORMAT_META[formatCode]

  const salgados = flavors.filter((f) => f.type === 'salgada')
  const doces    = flavors.filter((f) => f.type === 'doce')

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Cabeçalho */}
      <CrustReveal>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-1">Cardápio</h1>
          <p className="text-stone-400">
            {meta.label} — {meta.description}
          </p>
        </div>

        {/* Tabs de formato */}
        <Suspense fallback={null}>
          <FormatTabs />
        </Suspense>
      </CrustReveal>

      {/* CTA montar */}
      <div className="mt-6 mb-10 flex items-center justify-between gap-4 flex-wrap">
        <p className="text-stone-400 text-sm">
          {flavors.length} sabor{flavors.length !== 1 ? 'es' : ''} disponíve{flavors.length !== 1 ? 'is' : 'l'}
        </p>
        <OvenCtaLink href={`/montar/${formatCode}`} variant="primary">
          Montar {meta.label}
          <ChevronRight className="w-4 h-4" />
        </OvenCtaLink>
      </div>

      {/* Sabores salgados */}
      {salgados.length > 0 && (
        <section className="mb-12">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-stone-400 mb-4">
            <span className="herb-tag">salgada</span>
            {salgados.length} opções
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {salgados.map((f) => (
              <FlavorCard key={f.id} flavor={f} formatCode={formatCode} />
            ))}
          </div>
        </section>
      )}

      {/* Sabores doces */}
      {doces.length > 0 && (
        <section>
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-stone-400 mb-4">
            <span className="sweet-tag">doce</span>
            {doces.length} opções
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {doces.map((f) => (
              <FlavorCard key={f.id} flavor={f} formatCode={formatCode} />
            ))}
          </div>
        </section>
      )}

      {flavors.length === 0 && (
        <div className="text-center py-20 text-stone-500">
          Nenhum sabor disponível para este formato no momento.
        </div>
      )}
    </div>
  )
}
