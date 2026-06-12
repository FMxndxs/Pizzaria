import { newOrderSchema } from '@/lib/orders/schemas'

const validInput = {
  customer_name:   'João Silva',
  customer_phone:  '11999990000',
  cep:             '01310100',
  street:          'Av. Paulista',
  street_number:   '1000',
  neighborhood:    'Bela Vista',
  city:            'São Paulo',
  notes:           null,
  total:           79.9,
  freight:         8.0,
  fulfillment_type: 'delivery' as const,
  items: [
    {
      format_code:  'pizza-grande',
      format_label: 'Pizza Grande',
      flavors:      [{ name: 'Calabresa', price: 49.9, type: 'salgada' }],
      unit_price:   49.9,
      quantity:     1,
    },
  ],
}

describe('newOrderSchema', () => {
  test('valid input passes', () => {
    expect(newOrderSchema.safeParse(validInput).success).toBe(true)
  })

  test('pickup fulfillment_type passes', () => {
    expect(newOrderSchema.safeParse({ ...validInput, fulfillment_type: 'pickup' }).success).toBe(true)
  })

  test('empty customer_name fails', () => {
    expect(newOrderSchema.safeParse({ ...validInput, customer_name: '' }).success).toBe(false)
  })

  test('empty items array fails', () => {
    expect(newOrderSchema.safeParse({ ...validInput, items: [] }).success).toBe(false)
  })

  test('invalid fulfillment_type fails', () => {
    expect(newOrderSchema.safeParse({ ...validInput, fulfillment_type: 'unknown' }).success).toBe(false)
  })

  test('negative total fails', () => {
    expect(newOrderSchema.safeParse({ ...validInput, total: -1 }).success).toBe(false)
  })

  test('zero total fails', () => {
    expect(newOrderSchema.safeParse({ ...validInput, total: 0 }).success).toBe(false)
  })

  test('negative freight fails', () => {
    expect(newOrderSchema.safeParse({ ...validInput, freight: -1 }).success).toBe(false)
  })

  test('null freight passes', () => {
    expect(newOrderSchema.safeParse({ ...validInput, freight: null }).success).toBe(true)
  })

  test('item with empty flavors array fails', () => {
    const badItem = { ...validInput.items[0], flavors: [] }
    expect(newOrderSchema.safeParse({ ...validInput, items: [badItem] }).success).toBe(false)
  })

  test('item with zero quantity fails', () => {
    const badItem = { ...validInput.items[0], quantity: 0 }
    expect(newOrderSchema.safeParse({ ...validInput, items: [badItem] }).success).toBe(false)
  })
})
