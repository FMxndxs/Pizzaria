import type { PizzaCartItem } from '@/types'
import type { NewOrderItem } from './types'

// Converte itens do carrinho para o formato de snapshot gravado no banco.
// Corrige o bug de clientQueries.ts:54-57 que descartava flavor.type:
// o tipo pertence ao PizzaCartItem (nível do item), mas deve ser copiado
// para cada flavor snapshot — porque no banco cada flavor precisa do type.
export function cartItemsToOrderItems(items: PizzaCartItem[]): NewOrderItem[] {
  return items.map((item) => ({
    format_code: item.formatCode,
    format_label: item.formatLabel,
    unit_price: item.unitPrice,
    quantity: item.quantity,
    flavors: item.flavors.map((f) => ({
      name: f.name,
      price: f.price,
      type: item.type,
    })),
  }))
}
