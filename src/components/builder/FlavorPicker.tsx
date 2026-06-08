'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { TypeToggle } from './TypeToggle'
import { FlavorPickCard } from './FlavorPickCard'
import { BuilderSummaryBar } from './BuilderSummaryBar'
import { useCartStore } from '@/lib/store/cartStore'
import { validateFlavorSelection } from '@/lib/utils/pizzaPricing'
import type { Flavor, FlavorType, PizzaCartFlavor } from '@/types'

interface FlavorPickerProps {
  formatCode: string
  formatLabel: string
  maxFlavors: number
  flavors: Flavor[]
  // calzone não tem tipo — null desativa o toggle
  defaultType: FlavorType | null
}

export function FlavorPicker({
  formatCode,
  formatLabel,
  maxFlavors,
  flavors,
  defaultType,
}: FlavorPickerProps) {
  const router = useRouter()
  const addItem = useCartStore((s) => s.addItem)

  const [type, setType] = useState<FlavorType>(defaultType ?? 'salgada')
  const [selected, setSelected] = useState<PizzaCartFlavor[]>([])
  const [error, setError] = useState<string | null>(null)

  // Filtra sabores pelo tipo (calzone mostra todos os disponíveis)
  const visibleFlavors = defaultType === null
    ? flavors
    : flavors.filter((f) => f.type === type)

  const toggleFlavor = useCallback(
    (flavor: Flavor, price: number) => {
      setError(null)
      setSelected((prev) => {
        const already = prev.find((s) => s.id === flavor.id)
        if (already) return prev.filter((s) => s.id !== flavor.id)
        if (prev.length >= maxFlavors) {
          setError(`Máximo de ${maxFlavors} sabor${maxFlavors > 1 ? 'es' : ''} para este tamanho.`)
          return prev
        }
        return [...prev, { id: flavor.id, name: flavor.name, price }]
      })
    },
    [maxFlavors],
  )

  const handleTypeChange = (newType: FlavorType) => {
    setType(newType)
    setSelected([])
    setError(null)
  }

  const handleAddToCart = () => {
    const validationError = validateFlavorSelection(selected.length, maxFlavors)
    if (validationError) { setError(validationError); return }

    const primaryImage = flavors
      .find((f) => f.id === selected[0]?.id)
      ?.images?.find((i) => i.is_primary)?.url

    addItem(
      formatCode,
      formatLabel,
      defaultType === null ? null : type,
      selected,
      primaryImage,
    )

    router.push('/carrinho')
  }

  return (
    <>
      {/* Toggle salgada/doce — só para grande e broto */}
      {defaultType !== null && (
        <div className="mb-8">
          <TypeToggle value={type} onChange={handleTypeChange} />
        </div>
      )}

      {/* Mensagem de erro */}
      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl border border-brand-700/50 bg-brand-700/10 text-brand-400 text-sm">
          {error}
        </div>
      )}

      {/* Grid de sabores */}
      {visibleFlavors.length === 0 ? (
        <div className="text-center py-16 text-stone-500">
          Nenhum sabor disponível.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pb-40">
          {visibleFlavors.map((flavor) => {
            const isSelected = selected.some((s) => s.id === flavor.id)
            const isDisabled = !isSelected && selected.length >= maxFlavors
            return (
              <FlavorPickCard
                key={flavor.id}
                flavor={flavor}
                formatCode={formatCode}
                selected={isSelected}
                disabled={isDisabled}
                onToggle={toggleFlavor}
              />
            )
          })}
        </div>
      )}

      {/* Barra fixa de resumo */}
      <BuilderSummaryBar
        formatLabel={formatLabel}
        maxFlavors={maxFlavors}
        selectedFlavors={selected}
        onAddToCart={handleAddToCart}
        onRemoveFlavor={(id) => setSelected((prev) => prev.filter((s) => s.id !== id))}
      />
    </>
  )
}
