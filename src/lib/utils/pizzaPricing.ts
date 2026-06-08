import type { PizzaCartFlavor } from '@/types'

/**
 * Retorna o maior preço entre os sabores selecionados.
 * Regra de negócio: pizza multi-sabor cobra o sabor mais caro.
 */
export function maxFlavorPrice(flavors: PizzaCartFlavor[]): number {
  if (flavors.length === 0) return 0
  return Math.max(...flavors.map((f) => f.price))
}

/**
 * Valida se a seleção de sabores é válida para um formato.
 * Retorna null se OK, ou uma mensagem de erro.
 */
export function validateFlavorSelection(
  selectedCount: number,
  maxFlavors: number,
): string | null {
  if (selectedCount === 0) return 'Selecione pelo menos 1 sabor.'
  if (selectedCount > maxFlavors)
    return `Máximo de ${maxFlavors} sabor${maxFlavors > 1 ? 'es' : ''} para este tamanho.`
  return null
}
