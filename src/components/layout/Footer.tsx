import Link from 'next/link'
import { Pizza, MapPin, Phone, ExternalLink } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-stone-800/60 bg-stone-950/80 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center ring-1 ring-stone-700">
                <Pizza className="w-4 h-4 text-brand-500" />
              </div>
              <span className="font-bold text-foreground">Forno & Lenha</span>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed max-w-xs">
              Pizzas artesanais assadas em forno a lenha. Ingredientes frescos,
              receitas com alma.
            </p>
            {/* Placeholder redes sociais */}
            <a
              href="#"
              className="inline-flex items-center gap-1.5 text-stone-400 hover:text-accent-400 transition-colors text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              @fornolenha
            </a>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h3 className="text-stone-200 font-semibold text-sm uppercase tracking-wider">
              Cardápio
            </h3>
            <nav className="flex flex-col gap-2">
              {[
                { href: '/montar/pizza-grande', label: 'Pizza Grande' },
                { href: '/montar/pizza-broto', label: 'Pizza Broto' },
                { href: '/montar/calzone', label: 'Calzone' },
                { href: '/cardapio', label: 'Ver tudo' },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-stone-400 hover:text-foreground text-sm transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contato */}
          <div className="space-y-3">
            <h3 className="text-stone-200 font-semibold text-sm uppercase tracking-wider">
              Contato
            </h3>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2 text-stone-400 text-sm">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-brand-600" />
                {/* Placeholder endereço */}
                <span>Rua Exemplo, 123 — Santana de Parnaíba, SP</span>
              </div>
              <div className="flex items-center gap-2 text-stone-400 text-sm">
                <Phone className="w-4 h-4 text-brand-600" />
                <a
                  href="https://wa.me/5511989525014"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  (11) 98952-5014
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-stone-800/60 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-stone-500 text-xs">
            © {new Date().getFullYear()} Forno & Lenha. Todos os direitos reservados.
          </p>
          <p className="text-stone-600 text-xs">
            Pedidos finalizados via WhatsApp
          </p>
        </div>
      </div>
    </footer>
  )
}
