import { cartItemsToOrderItems } from '@/lib/orders/mappers'
import type { PizzaCartItem } from '@/types'

const baseItem: PizzaCartItem = {
  id: 'cart-item-1',
  formatCode: 'pizza-grande',
  formatLabel: 'Pizza Grande',
  type: 'salgada',
  flavors: [
    { id: 'f1', name: 'Calabresa', price: 49.9 },
    { id: 'f2', name: 'Mussarela', price: 44.9 },
  ],
  unitPrice: 49.9,
  quantity: 2,
}

describe('cartItemsToOrderItems', () => {
  test('stamps each flavor with the parent item type', () => {
    const result = cartItemsToOrderItems([baseItem])
    expect(result[0].flavors[0].type).toBe('salgada')
    expect(result[0].flavors[1].type).toBe('salgada')
  })

  test('maps format_code, format_label, unit_price, quantity', () => {
    const result = cartItemsToOrderItems([baseItem])
    expect(result[0].format_code).toBe('pizza-grande')
    expect(result[0].format_label).toBe('Pizza Grande')
    expect(result[0].unit_price).toBe(49.9)
    expect(result[0].quantity).toBe(2)
  })

  test('maps flavor name and price', () => {
    const result = cartItemsToOrderItems([baseItem])
    expect(result[0].flavors[0].name).toBe('Calabresa')
    expect(result[0].flavors[0].price).toBe(49.9)
  })

  test('handles item with null type (calzone)', () => {
    const calzone: PizzaCartItem = { ...baseItem, type: null }
    const result = cartItemsToOrderItems([calzone])
    expect(result[0].flavors[0].type).toBeNull()
    expect(result[0].flavors[1].type).toBeNull()
  })

  test('handles multiple items', () => {
    const doce: PizzaCartItem = {
      ...baseItem,
      id: 'cart-item-2',
      type: 'doce',
      flavors: [{ id: 'f3', name: 'Chocolate', price: 39.9 }],
    }
    const result = cartItemsToOrderItems([baseItem, doce])
    expect(result).toHaveLength(2)
    expect(result[1].flavors[0].type).toBe('doce')
  })

  test('returns empty array for empty input', () => {
    expect(cartItemsToOrderItems([])).toEqual([])
  })
})
