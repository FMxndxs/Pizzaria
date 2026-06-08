'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence } from 'motion/react'
import { ShoppingCart, ArrowLeft, ChevronRight } from 'lucide-react'
import { useCartStore } from '@/lib/store/cartStore'
import { CartItemRow } from '@/components/cart/CartItemRow'
import { CheckoutForm } from '@/components/cart/CheckoutForm'
import { createOrder } from '@/lib/supabase/clientQueries'
import { buildWhatsAppUrl } from '@/lib/utils/whatsapp'
import { formatBRL } from '@/lib/utils/formatters'
import type { CheckoutFormData } from '@/lib/validations/checkout'
import type { DeliveryQuote } from '@/types'

export default function CarrinhoPage() {
  const { items, total, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)

  const handleCheckout = async (data: CheckoutFormData, quote: DeliveryQuote | null) => {
    setLoading(true)

    const freight = quote?.mode === 'delivery' ? (quote.freight ?? 0) : 0
    const grandTotal = total + freight

    // Persiste o pedido no Supabase (best-effort — não bloqueia o WhatsApp)
    await createOrder({
      userId:        null,  // guest checkout
      items,
      total:         grandTotal,
      freight:       freight || undefined,
      cep:           data.cep,
      street:        data.street,
      streetNumber:  data.number,
      neighborhood:  data.neighborhood,
      city:          data.city,
      notes:         data.notes,
      customerName:  data.name,
      customerPhone: data.phone,
    }).catch(() => {})

    // Abre WhatsApp
    const url = buildWhatsAppUrl({
      customer: {
        name:         data.name,
        phone:        data.phone,
        cep:          data.cep,
        street:       data.street,
        number:       data.number,
        neighborhood: data.neighborhood,
        city:         data.city,
        notes:        data.notes,
      },
      items,
      total,
      deliveryQuote: quote ?? undefined,
    })

    clearCart()
    setLoading(false)
    window.open(url, '_blank')
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">🛒</div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Carrinho vazio</h1>
        <p className="text-stone-400 mb-8">Adicione pizzas ao seu pedido para continuar.</p>
        <Link
          href="/montar/pizza-grande"
          className="inline-flex items-center gap-2 rounded-full bg-brand-700 text-white font-semibold px-6 py-3 hover:bg-brand-600 transition-colors"
        >
          Montar minha pizza
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  const freightInfo = '(calculado no checkout)'

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Voltar */}
      <Link
        href="/cardapio"
        className="inline-flex items-center gap-1.5 text-stone-400 hover:text-foreground text-sm mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Continuar comprando
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <ShoppingCart className="w-6 h-6 text-brand-500" />
        <h1 className="text-2xl font-bold text-foreground">Seu pedido</h1>
        <span className="text-stone-500 text-sm">({items.length} {items.length === 1 ? 'item' : 'itens'})</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Lista de itens */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-stone-800/60 bg-stone-900/40 px-4">
            <AnimatePresence>
              {items.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </AnimatePresence>
          </div>

          {/* Resumo */}
          <div className="mt-4 rounded-2xl border border-stone-800/60 bg-stone-900/40 p-4 space-y-2">
            <div className="flex justify-between text-sm text-stone-400">
              <span>Subtotal</span>
              <span>{formatBRL(total)}</span>
            </div>
            <div className="flex justify-between text-sm text-stone-400">
              <span>Frete</span>
              <span>{freightInfo}</span>
            </div>
            <div className="flex justify-between font-bold text-foreground border-t border-stone-800 pt-2 mt-2">
              <span>Total</span>
              <span className="text-accent-400">{formatBRL(total)} + frete</span>
            </div>
          </div>
        </div>

        {/* Formulário de checkout */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-stone-800/60 bg-stone-900/40 p-6">
            <CheckoutForm onSubmit={handleCheckout} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  )
}
