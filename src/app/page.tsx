import { OvenCtaLink } from '@/components/ui/OvenCtaLink'
import { CrustReveal, StaggerGroup } from '@/components/ui/MotionPrimitives'
import { ChevronRight, Flame, Clock, Leaf } from 'lucide-react'

const FORMATS = [
  {
    code: 'pizza-grande',
    label: 'Pizza Grande',
    description: 'Até 3 sabores — tradicional ou especial',
    icon: '🍕',
    badge: 'Mais pedida',
  },
  {
    code: 'pizza-broto',
    label: 'Pizza Broto',
    description: 'Até 2 sabores — ideal para 1 pessoa',
    icon: '🫓',
    badge: null,
  },
  {
    code: 'calzone',
    label: 'Calzone',
    description: '1 sabor — a pizza dobrada recheada',
    icon: '🌯',
    badge: null,
  },
]

const FEATURES = [
  {
    icon: Flame,
    title: 'Forno a Lenha',
    description: 'Massa assada em forno a lenha a 400°C para aquela borda perfeita.',
  },
  {
    icon: Leaf,
    title: 'Ingredientes Frescos',
    description: 'Tomates San Marzano, mussarela fior di latte e ervas frescas.',
  },
  {
    icon: Clock,
    title: 'Entrega Rápida',
    description: 'Saída do forno direto para a sua porta em até 40 minutos.',
  },
]

export default function HomePage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden">
        {/* Glow de fundo */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 65% 70% at 55% 50%, rgba(193,39,45,.08) 0%, transparent 65%),
              radial-gradient(ellipse 40% 60% at 75% 40%, rgba(242,166,90,.06) 0%, transparent 55%)
            `,
          }}
        />

        {/* Placeholder circular pizza — lado direito */}
        <div
          aria-hidden
          className="hidden lg:block absolute right-[6%] top-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full"
          style={{
            background:
              'radial-gradient(circle at 38% 38%, rgba(242,166,90,.14) 0%, rgba(193,39,45,.08) 40%, transparent 70%)',
            border: '1px solid rgba(242,166,90,.12)',
            boxShadow: '0 0 80px 20px rgba(193,39,45,.08)',
          }}
        >
          {/* Círculos concêntricos decorativos */}
          <div className="absolute inset-[12%] rounded-full border border-stone-800/40" />
          <div className="absolute inset-[24%] rounded-full border border-stone-800/30" />
          <div className="absolute inset-[36%] rounded-full bg-stone-900/60 flex items-center justify-center">
            <span className="text-5xl">🍕</span>
          </div>
          {/* Vapor decorativo */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="steam-wisps w-1 h-10 rounded-full bg-gradient-to-t from-stone-600/0 via-stone-500/20 to-stone-400/0"
                style={{ animationDelay: `${i * 0.5}s` }}
              />
            ))}
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 w-full py-20">
          <CrustReveal>
            {/* Tag */}
            <div className="inline-flex items-center gap-2 rounded-full border border-stone-700/60 bg-stone-900/60 px-4 py-1.5 text-xs text-stone-400 mb-6">
              <span className="ember-dot" />
              Forno a lenha desde o primeiro dia
            </div>

            {/* Título */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground max-w-xl leading-[1.1]">
              Pizza de verdade,
              <br />
              <span className="text-brand-500">do jeito</span>
              <br />
              <span className="text-accent-400">italiano.</span>
            </h1>

            <p className="mt-5 text-stone-400 text-lg max-w-md leading-relaxed">
              Monte sua pizza com até 3 sabores, escolha salgada ou doce, e finalize
              pelo WhatsApp. Simples assim.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <OvenCtaLink href="/montar/pizza-grande" variant="primary">
                Montar minha pizza
                <ChevronRight className="w-4 h-4" />
              </OvenCtaLink>
              <OvenCtaLink href="/cardapio" variant="secondary">
                Ver cardápio completo
              </OvenCtaLink>
            </div>
          </CrustReveal>
        </div>
      </section>

      {/* ── Formatos ──────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <CrustReveal>
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Escolha seu tamanho
            </h2>
            <p className="text-stone-400 mt-2">
              Cada formato tem suas próprias regras de sabores
            </p>
          </div>
        </CrustReveal>

        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {FORMATS.map((f) => (
            <a
              key={f.code}
              href={`/montar/${f.code}`}
              className="group relative flex flex-col items-center text-center gap-4 rounded-2xl border border-stone-800/70 bg-stone-900/50 p-8 hover:border-brand-700/60 hover:bg-stone-900 transition-all duration-300"
            >
              {f.badge && (
                <span className="absolute top-3 right-3 text-xs font-semibold text-accent-400 bg-accent-400/10 border border-accent-400/25 rounded-full px-2.5 py-0.5">
                  {f.badge}
                </span>
              )}
              <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
                {f.icon}
              </span>
              <div>
                <h3 className="font-bold text-foreground text-lg">{f.label}</h3>
                <p className="text-stone-400 text-sm mt-1">{f.description}</p>
              </div>
              <div className="flex items-center gap-1 text-brand-500 text-sm font-medium mt-auto">
                Montar agora
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          ))}
        </StaggerGroup>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section className="border-t border-stone-800/40 bg-stone-900/30">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <StaggerGroup className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {FEATURES.map((feat) => (
              <div key={feat.title} className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-700/15 border border-brand-700/25 flex items-center justify-center">
                  <feat.icon className="w-6 h-6 text-brand-500" />
                </div>
                <h3 className="font-semibold text-foreground">{feat.title}</h3>
                <p className="text-stone-400 text-sm leading-relaxed">{feat.description}</p>
              </div>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* ── CTA Final ─────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <CrustReveal>
          <div
            className="rounded-3xl border border-stone-800/60 p-10 sm:p-16"
            style={{
              background:
                'radial-gradient(ellipse 80% 100% at 50% 0%, rgba(193,39,45,.07) 0%, transparent 60%)',
            }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Pronto para montar?
            </h2>
            <p className="text-stone-400 mb-8 max-w-md mx-auto">
              Escolha seus sabores favoritos, combine até 3 numa pizza grande e finalize
              direto pelo WhatsApp em segundos.
            </p>
            <OvenCtaLink href="/montar/pizza-grande" variant="primary">
              Montar minha pizza agora
              <ChevronRight className="w-4 h-4" />
            </OvenCtaLink>
          </div>
        </CrustReveal>
      </section>
    </>
  )
}
