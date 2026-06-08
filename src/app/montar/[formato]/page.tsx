import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getFormatByCode, getFlavorsByFormat } from '@/lib/supabase/queries'
import { FlavorPicker } from '@/components/builder/FlavorPicker'
import { CrustReveal } from '@/components/ui/MotionPrimitives'
import type { FlavorType } from '@/types'

interface PageProps {
  params: Promise<{ formato: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { formato } = await params
  const format = await getFormatByCode(formato)
  if (!format) return {}
  return {
    title: `Montar ${format.label}`,
    description: `Monte sua ${format.label} escolhendo até ${format.max_flavors} sabor${format.max_flavors > 1 ? 'es' : ''}. Preço pelo sabor mais caro.`,
  }
}

const FORMAT_DESCRIPTIONS: Record<string, string> = {
  'pizza-grande': 'Escolha até 3 sabores. O preço será o do sabor mais caro.',
  'pizza-broto':  'Escolha até 2 sabores. O preço será o do sabor mais caro.',
  'calzone':      'Escolha 1 sabor para o seu calzone recheado.',
}

export default async function MontarPage({ params }: PageProps) {
  const { formato } = await params
  const [format, flavors] = await Promise.all([
    getFormatByCode(formato),
    getFlavorsByFormat(formato),
  ])

  if (!format) notFound()

  // Calzone não tem toggle de tipo
  const defaultType: FlavorType | null =
    format.code === 'calzone' ? null : 'salgada'

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <CrustReveal>
        {/* Cabeçalho */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">
              {format.code === 'pizza-grande' ? '🍕' : format.code === 'pizza-broto' ? '🫓' : '🌯'}
            </span>
            <h1 className="text-3xl font-bold text-foreground">{format.label}</h1>
          </div>
          <p className="text-stone-400">{FORMAT_DESCRIPTIONS[format.code] ?? ''}</p>
        </div>
      </CrustReveal>

      {/* Picker interativo (client component) */}
      <FlavorPicker
        formatCode={format.code}
        formatLabel={format.label}
        maxFlavors={format.max_flavors}
        flavors={flavors}
        defaultType={defaultType}
      />
    </div>
  )
}
