'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MapPin, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { checkoutSchema, type CheckoutFormData } from '@/lib/validations/checkout'
import { formatPhoneBR } from '@/lib/utils/phoneMask'
import type { DeliveryQuote } from '@/types'

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData, quote: DeliveryQuote | null) => void
  loading?: boolean
}

function Field({
  label, error, children,
}: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-stone-300 uppercase tracking-wider">{label}</label>
      {children}
      {error && <p className="text-xs text-brand-400">{error}</p>}
    </div>
  )
}

const inputCls =
  'w-full px-3.5 py-2.5 rounded-xl bg-stone-900/60 border border-stone-700/60 text-foreground text-sm placeholder:text-stone-500 focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600/50 transition-colors'

export function CheckoutForm({ onSubmit, loading = false }: CheckoutFormProps) {
  const {
    register, handleSubmit, setValue, watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({ resolver: zodResolver(checkoutSchema) })

  const [quote, setQuote] = useState<DeliveryQuote | null>(null)
  const [freightLoading, setFreightLoading] = useState(false)
  const cepValue = watch('cep')
  const cepRef = useRef<string>('')

  // Busca frete quando CEP atingir 8 dígitos
  useEffect(() => {
    const digits = (cepValue ?? '').replace(/\D/g, '')
    if (digits.length !== 8 || digits === cepRef.current) return
    cepRef.current = digits

    setFreightLoading(true)
    fetch(`/api/freight?cep=${digits}`)
      .then((r) => r.json())
      .then((data: DeliveryQuote) => {
        setQuote(data)
        if (data.address) {
          setValue('street',       data.address.street,       { shouldValidate: true })
          setValue('neighborhood', data.address.neighborhood, { shouldValidate: true })
          setValue('city',         data.address.city,         { shouldValidate: true })
        }
      })
      .catch(() => setQuote(null))
      .finally(() => setFreightLoading(false))
  }, [cepValue, setValue])

  const handleFormSubmit = (data: CheckoutFormData) => onSubmit(data, quote)

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-5">
      <h2 className="text-lg font-bold text-foreground">Dados para entrega</h2>

      {/* Nome e telefone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Seu nome" error={errors.name?.message}>
          <input {...register('name')} placeholder="João Silva" className={inputCls} />
        </Field>
        <Field label="Telefone / WhatsApp" error={errors.phone?.message}>
          <input
            {...register('phone')}
            placeholder="(11) 99999-9999"
            className={inputCls}
            onChange={(e) => {
              const masked = formatPhoneBR(e.target.value)
              setValue('phone', masked, { shouldValidate: true })
            }}
            maxLength={15}
          />
        </Field>
      </div>

      {/* CEP */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="CEP" error={errors.cep?.message}>
          <div className="relative">
            <input
              {...register('cep')}
              placeholder="00000000"
              className={inputCls}
              maxLength={8}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '').slice(0, 8)
                setValue('cep', digits, { shouldValidate: true })
              }}
            />
            {freightLoading && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-stone-400" />
            )}
          </div>
        </Field>
        <Field label="Número" error={errors.number?.message}>
          <input {...register('number')} placeholder="123" className={inputCls} />
        </Field>
      </div>

      {/* Endereço auto-preenchido */}
      <Field label="Rua" error={errors.street?.message}>
        <input {...register('street')} placeholder="Preenchido pelo CEP" className={inputCls} />
      </Field>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Bairro" error={errors.neighborhood?.message}>
          <input {...register('neighborhood')} placeholder="Centro" className={inputCls} />
        </Field>
        <Field label="Cidade" error={errors.city?.message}>
          <input {...register('city')} placeholder="São Paulo" className={inputCls} />
        </Field>
      </div>

      {/* Observações */}
      <Field label="Observações (opcional)">
        <textarea
          {...register('notes')}
          placeholder="Ex: sem cebola, campainha não funciona..."
          className={`${inputCls} resize-none h-20`}
        />
      </Field>

      {/* Painel de frete */}
      {quote && (
        <div className={`rounded-xl border p-4 text-sm flex items-start gap-3 ${
          quote.mode === 'delivery'
            ? 'border-herb/30 bg-herb/10 text-stone-300'
            : 'border-accent-500/30 bg-accent-500/10 text-stone-300'
        }`}>
          {quote.mode === 'delivery' ? (
            <CheckCircle className="w-4 h-4 text-herb mt-0.5 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-accent-400 mt-0.5 shrink-0" />
          )}
          <div>
            {quote.mode === 'delivery' && (
              <>
                <p className="font-semibold text-foreground">Entrega disponível</p>
                <p>Frete: R$ {quote.freight?.toFixed(2).replace('.', ',')} ({quote.distanceKm?.toFixed(1)} km)</p>
              </>
            )}
            {quote.mode === 'pickup_or_courier' && (
              <>
                <p className="font-semibold text-foreground">Fora da área de entrega própria</p>
                <p>Retirada na loja ou Uber Flash / 99 Entregas (a combinar)</p>
              </>
            )}
            {quote.mode === 'unknown' && (
              <p>Frete a combinar</p>
            )}
          </div>
        </div>
      )}

      {/* Botão */}
      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 rounded-full bg-brand-700 text-white font-semibold py-3.5 px-6 hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed pizza-crust-sheen shadow-[0_2px_16px_rgba(193,39,45,.35)]"
      >
        <span className="pizza-crust-filament" aria-hidden />
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
        Finalizar pelo WhatsApp
      </button>
    </form>
  )
}
