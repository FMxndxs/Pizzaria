import { getDailyRevenue, getTopProducts, getPeakHours, getLeadTimes } from '@/lib/reports/service'
import type { SupabaseClient } from '@supabase/supabase-js'

function rpcOnce(data: unknown, error: unknown = null) {
  return jest.fn().mockResolvedValueOnce({ data, error })
}
function makeClient(rpcMock: jest.Mock): SupabaseClient {
  return { rpc: rpcMock } as unknown as SupabaseClient
}

// ─── getDailyRevenue ──────────────────────────────────────────────────────────

describe('getDailyRevenue', () => {
  test('chama get_revenue_daily com days_back correto', async () => {
    const rpc = rpcOnce([{ day: '2026-06-12', order_count: 5, revenue: 400, avg_ticket: 80 }])
    const client = makeClient(rpc)
    const result = await getDailyRevenue(client, 30)
    expect(rpc).toHaveBeenCalledWith('get_revenue_daily', { days_back: 30 })
    expect(result).toHaveLength(1)
    expect(result[0].revenue).toBe(400)
  })

  test('retorna array vazio quando sem dados', async () => {
    const rpc = rpcOnce([])
    const client = makeClient(rpc)
    const result = await getDailyRevenue(client, 30)
    expect(result).toEqual([])
  })

  test('lança erro quando RPC falha', async () => {
    const rpc = rpcOnce(null, { message: 'not_owner' })
    const client = makeClient(rpc)
    await expect(getDailyRevenue(client, 30)).rejects.toThrow()
  })
})

// ─── getTopProducts ───────────────────────────────────────────────────────────

describe('getTopProducts', () => {
  test('chama get_top_products com days_back', async () => {
    const rpc = rpcOnce([{ flavor_name: 'Calabresa', format_label: 'Pizza Grande', order_count: 10, total_qty: 12 }])
    const client = makeClient(rpc)
    const result = await getTopProducts(client, 30)
    expect(rpc).toHaveBeenCalledWith('get_top_products', { days_back: 30 })
    expect(result[0].flavor_name).toBe('Calabresa')
  })
})

// ─── getPeakHours ─────────────────────────────────────────────────────────────

describe('getPeakHours', () => {
  test('chama get_peak_hours com days_back', async () => {
    const rpc = rpcOnce([{ hour: 19, order_count: 8 }, { hour: 20, order_count: 12 }])
    const client = makeClient(rpc)
    const result = await getPeakHours(client, 30)
    expect(rpc).toHaveBeenCalledWith('get_peak_hours', { days_back: 30 })
    expect(result).toHaveLength(2)
  })
})

// ─── getLeadTimes ─────────────────────────────────────────────────────────────

describe('getLeadTimes', () => {
  test('chama get_lead_times com days_back', async () => {
    const rpc = rpcOnce([{
      order_id: 'o1', order_code: '#0001',
      ordered_at: '2026-06-12T18:00:00Z',
      confirmed_at: '2026-06-12T18:05:00Z',
      ready_at: '2026-06-12T18:25:00Z',
      lead_minutes: 20,
    }])
    const client = makeClient(rpc)
    const result = await getLeadTimes(client, 30)
    expect(rpc).toHaveBeenCalledWith('get_lead_times', { days_back: 30 })
    expect(result[0].lead_minutes).toBe(20)
  })
})
