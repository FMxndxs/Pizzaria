import { WaLinkProvider } from '@/lib/notifications/waLink'
import { getNotificationProvider } from '@/lib/notifications'
import type { Order } from '@/types'

const mockOrder: Order = {
  id: 'ord-uuid-1',
  user_id: null,
  status: 'confirmed',
  order_code: '#0001',
  order_seq: 1,
  customer_name: 'João Silva',
  customer_phone: '5511999990000',
  total: 79.9,
  freight: 8.0,
  cep: '01310-100',
  street: 'Av. Paulista',
  street_number: '1000',
  neighborhood: 'Bela Vista',
  city: 'São Paulo',
  notes: null,
  fulfillment_type: 'delivery',
  courier_name: null,
  created_at: '2026-06-12T12:00:00Z',
  updated_at: '2026-06-12T12:00:00Z',
}

describe('WaLinkProvider', () => {
  const provider = new WaLinkProvider()

  test('returns kind: wa_link', async () => {
    const result = await provider.notifyCustomer(mockOrder, 'order_confirmed')
    expect(result.kind).toBe('wa_link')
  })

  test('url starts with https://wa.me/', async () => {
    const result = await provider.notifyCustomer(mockOrder, 'order_confirmed')
    expect(result.url).toMatch(/^https:\/\/wa\.me\//)
  })

  test('url contains customer phone number', async () => {
    const result = await provider.notifyCustomer(mockOrder, 'order_confirmed')
    expect(result.url).toContain(mockOrder.customer_phone)
  })

  test('url contains url-encoded text query param', async () => {
    const result = await provider.notifyCustomer(mockOrder, 'order_confirmed')
    expect(result.url).toContain('?text=')
  })

  test('supports order_ready event', async () => {
    const result = await provider.notifyCustomer(mockOrder, 'order_ready')
    expect(result.kind).toBe('wa_link')
    expect(result.url).toContain(mockOrder.customer_phone)
  })

  test('supports order_dispatched event', async () => {
    const result = await provider.notifyCustomer(mockOrder, 'order_dispatched')
    expect(result.kind).toBe('wa_link')
    expect(result.url).toContain(mockOrder.customer_phone)
  })
})

describe('getNotificationProvider', () => {
  test('returns a WaLinkProvider by default', () => {
    const provider = getNotificationProvider()
    expect(provider).toBeInstanceOf(WaLinkProvider)
  })
})
