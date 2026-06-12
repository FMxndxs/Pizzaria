import { confirmOrder, advanceStatus, cancelOrder, createOrder } from '@/lib/orders/service'
import type { SupabaseClient } from '@supabase/supabase-js'

// ─── Helpers para mock do Supabase ────────────────────────────────────────────

function selectOnce(data: unknown, error: unknown = null) {
  return {
    select: jest.fn().mockReturnThis(),
    eq:     jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data, error }),
  }
}

function updateOnce(data: unknown, error: unknown = null) {
  return {
    update: jest.fn().mockReturnThis(),
    eq:     jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data, error }),
  }
}

function insertOnce(data: unknown, error: unknown = null) {
  return {
    insert: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data, error }),
  }
}

function makeClient(...calls: object[]): SupabaseClient {
  const from = jest.fn()
  calls.forEach((call) => from.mockReturnValueOnce(call))
  return { from } as unknown as SupabaseClient
}

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const pendingDelivery = { id: 'ord-1', status: 'pending',    fulfillment_type: 'delivery' }
const confirmed       = { id: 'ord-1', status: 'confirmed',  fulfillment_type: 'delivery' }
const preparing       = { id: 'ord-1', status: 'preparing',  fulfillment_type: 'delivery' }
const ready           = { id: 'ord-1', status: 'ready',      fulfillment_type: 'delivery' }
const readyPickup     = { id: 'ord-1', status: 'ready',      fulfillment_type: 'pickup'   }
const delivered       = { id: 'ord-1', status: 'delivered',  fulfillment_type: 'delivery' }
const fullOrder       = { ...confirmed, items: [], order_code: '#0001', order_seq: 1, customer_name: 'Test', customer_phone: '11999999999', total: 50, freight: null, cep: '', street: '', street_number: '', neighborhood: '', city: '', notes: null, courier_name: null, created_at: '', updated_at: '', user_id: null }

// ─── confirmOrder ─────────────────────────────────────────────────────────────

describe('confirmOrder', () => {
  test('pending → confirmed succeeds', async () => {
    const client = makeClient(selectOnce(pendingDelivery), updateOnce(fullOrder))
    const result = await confirmOrder(client, 'ord-1')
    expect(result.ok).toBe(true)
  })

  test('already confirmed → confirmed fails (invalid transition)', async () => {
    const client = makeClient(selectOnce(confirmed))
    const result = await confirmOrder(client, 'ord-1')
    expect(result.ok).toBe(false)
    expect((result as { ok: false; error: string }).error).toMatch(/transição|inválid/i)
  })

  test('preparing → confirmed fails', async () => {
    const client = makeClient(selectOnce(preparing))
    const result = await confirmOrder(client, 'ord-1')
    expect(result.ok).toBe(false)
  })

  test('order not found returns error', async () => {
    const client = makeClient(selectOnce(null, { message: 'not found' }))
    const result = await confirmOrder(client, 'ord-1')
    expect(result.ok).toBe(false)
  })
})

// ─── advanceStatus ────────────────────────────────────────────────────────────

describe('advanceStatus', () => {
  test('confirmed → preparing succeeds', async () => {
    const client = makeClient(selectOnce(confirmed), updateOnce(fullOrder))
    const result = await advanceStatus(client, 'ord-1', 'preparing')
    expect(result.ok).toBe(true)
  })

  test('ready (delivery) → out_for_delivery succeeds', async () => {
    const client = makeClient(selectOnce(ready), updateOnce(fullOrder))
    const result = await advanceStatus(client, 'ord-1', 'out_for_delivery')
    expect(result.ok).toBe(true)
  })

  test('ready (pickup) → out_for_delivery fails', async () => {
    const client = makeClient(selectOnce(readyPickup))
    const result = await advanceStatus(client, 'ord-1', 'out_for_delivery')
    expect(result.ok).toBe(false)
  })

  test('delivered → any transition fails (terminal)', async () => {
    const client = makeClient(selectOnce(delivered))
    const result = await advanceStatus(client, 'ord-1', 'cancelled')
    expect(result.ok).toBe(false)
  })

  test('DB update error returns error', async () => {
    const client = makeClient(
      selectOnce(confirmed),
      updateOnce(null, { message: 'DB error' }),
    )
    const result = await advanceStatus(client, 'ord-1', 'preparing')
    expect(result.ok).toBe(false)
  })
})

// ─── cancelOrder ──────────────────────────────────────────────────────────────

describe('cancelOrder', () => {
  test('pending → cancelled succeeds', async () => {
    const client = makeClient(selectOnce(pendingDelivery), updateOnce(fullOrder))
    const result = await cancelOrder(client, 'ord-1')
    expect(result.ok).toBe(true)
  })

  test('delivered → cancelled fails (terminal)', async () => {
    const client = makeClient(selectOnce(delivered))
    const result = await cancelOrder(client, 'ord-1')
    expect(result.ok).toBe(false)
  })
})

// ─── createOrder ──────────────────────────────────────────────────────────────

const validInput = {
  customer_name:    'João',
  customer_phone:   '11999990000',
  cep:              '01310100',
  street:           'Av. Paulista',
  street_number:    '1000',
  neighborhood:     'Bela Vista',
  city:             'São Paulo',
  notes:            null,
  total:            49.9,
  freight:          null,
  fulfillment_type: 'delivery' as const,
  items: [{
    format_code: 'pizza-grande', format_label: 'Pizza Grande',
    flavors: [{ name: 'Calabresa', price: 49.9, type: 'salgada' }],
    unit_price: 49.9, quantity: 1,
  }],
}

describe('createOrder', () => {
  test('returns ok with full order on success', async () => {
    const insertedId = { id: 'ord-new' }
    const client = makeClient(
      { insert: jest.fn().mockReturnThis(), select: jest.fn().mockReturnThis(), single: jest.fn().mockResolvedValue({ data: insertedId, error: null }) },
      { insert: jest.fn().mockResolvedValue({ data: null, error: null }) },
      selectOnce({ ...fullOrder, id: 'ord-new' }),
    )
    const result = await createOrder(client, validInput)
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.data.id).toBe('ord-new')
  })

  test('returns error when order insert fails', async () => {
    const client = makeClient(
      { insert: jest.fn().mockReturnThis(), select: jest.fn().mockReturnThis(), single: jest.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } }) },
    )
    const result = await createOrder(client, validInput)
    expect(result.ok).toBe(false)
  })

  test('deletes orphan order and returns error when items insert fails', async () => {
    const deleteMock = { delete: jest.fn().mockReturnThis(), eq: jest.fn().mockResolvedValue({}) }
    const from = jest.fn()
      .mockReturnValueOnce({ insert: jest.fn().mockReturnThis(), select: jest.fn().mockReturnThis(), single: jest.fn().mockResolvedValue({ data: { id: 'ord-new' }, error: null }) })
      .mockReturnValueOnce({ insert: jest.fn().mockResolvedValue({ data: null, error: { message: 'items failed' } }) })
      .mockReturnValueOnce(deleteMock)
    const client = { from } as unknown as SupabaseClient

    const result = await createOrder(client, validInput)
    expect(result.ok).toBe(false)
    expect(deleteMock.delete).toHaveBeenCalled()
  })
})
