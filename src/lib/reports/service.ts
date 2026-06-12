import type { SupabaseClient } from '@supabase/supabase-js'

export interface DailyRevenueRow {
  day: string
  order_count: number
  revenue: number
  avg_ticket: number
}

export interface TopProductRow {
  flavor_name: string
  format_label: string
  order_count: number
  total_qty: number
}

export interface PeakHourRow {
  hour: number
  order_count: number
}

export interface LeadTimeRow {
  order_id: string
  order_code: string
  ordered_at: string
  confirmed_at: string
  ready_at: string
  lead_minutes: number
}

async function callRpc<T>(client: SupabaseClient, fn: string, params: Record<string, unknown>): Promise<T[]> {
  const { data, error } = await client.rpc(fn, params)
  if (error) throw new Error(error.message)
  return (data ?? []) as T[]
}

export function getDailyRevenue(client: SupabaseClient, daysBack = 30): Promise<DailyRevenueRow[]> {
  return callRpc(client, 'get_revenue_daily', { days_back: daysBack })
}

export function getTopProducts(client: SupabaseClient, daysBack = 30): Promise<TopProductRow[]> {
  return callRpc(client, 'get_top_products', { days_back: daysBack })
}

export function getPeakHours(client: SupabaseClient, daysBack = 30): Promise<PeakHourRow[]> {
  return callRpc(client, 'get_peak_hours', { days_back: daysBack })
}

export function getLeadTimes(client: SupabaseClient, daysBack = 30): Promise<LeadTimeRow[]> {
  return callRpc(client, 'get_lead_times', { days_back: daysBack })
}
