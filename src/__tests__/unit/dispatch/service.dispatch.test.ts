import { dispatchDelivery, markPickedUp, markDelivered } from '@/lib/orders/service'
import type { SupabaseClient } from '@supabase/supabase-js'

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
function courierUpdate(error: unknown = null) {
  return { update: jest.fn().mockReturnThis(), eq: jest.fn().mockResolvedValue({ error }) }
}
function makeClient(...calls: object[]): SupabaseClient {
  const from = jest.fn()
  calls.forEach((c) => from.mockReturnValueOnce(c))
  return { from } as unknown as SupabaseClient
}

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const readyDelivery    = { id: 'o1', status: 'ready',            fulfillment_type: 'delivery' }
const readyPickup      = { id: 'o1', status: 'ready',            fulfillment_type: 'pickup'   }
const outForDelivery   = { id: 'o1', status: 'out_for_delivery', fulfillment_type: 'delivery' }
const fullOrder        = { ...outForDelivery, items: [], order_code: '#0001', customer_name: 'Test',
                           customer_phone: '11999990000', total: 50, freight: null,
                           cep: '', street: '', street_number: '', neighborhood: '', city: '',
                           notes: null, courier_name: 'Carlos', created_at: '', updated_at: '', user_id: null }
const deliveredOrder   = { ...fullOrder, status: 'delivered' }

// ─── dispatchDelivery ─────────────────────────────────────────────────────────

describe('dispatchDelivery', () => {
  test('ready delivery → out_for_delivery succeeds', async () => {
    const client = makeClient(
      courierUpdate(),
      selectOnce(readyDelivery),
      updateOnce(fullOrder),
    )
    const result = await dispatchDelivery(client, 'o1', 'Carlos')
    expect(result.ok).toBe(true)
  })

  test('ready pickup → fails (invalid transition)', async () => {
    const client = makeClient(
      courierUpdate(),
      selectOnce(readyPickup),
    )
    const result = await dispatchDelivery(client, 'o1', 'Carlos')
    expect(result.ok).toBe(false)
    expect((result as { ok: false; error: string }).error).toMatch(/transição|inválid/i)
  })

  test('courier update DB error returns error', async () => {
    const client = makeClient(courierUpdate({ message: 'DB error' }))
    const result = await dispatchDelivery(client, 'o1', 'Carlos')
    expect(result.ok).toBe(false)
  })
})

// ─── markPickedUp ─────────────────────────────────────────────────────────────

describe('markPickedUp', () => {
  test('ready pickup → delivered succeeds', async () => {
    const client = makeClient(selectOnce(readyPickup), updateOnce(deliveredOrder))
    const result = await markPickedUp(client, 'o1')
    expect(result.ok).toBe(true)
  })

  test('ready delivery → fails (delivery cannot skip to delivered)', async () => {
    const client = makeClient(selectOnce(readyDelivery))
    const result = await markPickedUp(client, 'o1')
    expect(result.ok).toBe(false)
  })
})

// ─── markDelivered ────────────────────────────────────────────────────────────

describe('markDelivered', () => {
  test('out_for_delivery → delivered succeeds', async () => {
    const client = makeClient(selectOnce(outForDelivery), updateOnce(deliveredOrder))
    const result = await markDelivered(client, 'o1')
    expect(result.ok).toBe(true)
  })

  test('ready delivery → fails (must dispatch first)', async () => {
    const client = makeClient(selectOnce(readyDelivery))
    const result = await markDelivered(client, 'o1')
    expect(result.ok).toBe(false)
  })
})
