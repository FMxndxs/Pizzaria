import { createClient } from './server'
import type { Flavor, FlavorPrice, FlavorImage, Format, FreightConfig } from '@/types'

// ─── Formatos ──────────────────────────────────────────────────────────────

export async function getFormats(): Promise<Format[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('formats')
    .select('*')
    .order('sort', { ascending: true })
  if (error) { console.error('getFormats:', error); return [] }
  return data ?? []
}

export async function getFormatByCode(code: string): Promise<Format | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('formats')
    .select('*')
    .eq('code', code)
    .single()
  if (error) return null
  return data
}

// ─── Sabores ───────────────────────────────────────────────────────────────

export async function getFlavors(type?: 'salgada' | 'doce'): Promise<Flavor[]> {
  const supabase = await createClient()
  let query = supabase
    .from('flavors')
    .select(`
      *,
      prices:flavor_prices(*),
      images:flavor_images(*)
    `)
    .eq('is_available', true)
    .order('name', { ascending: true })

  if (type) query = query.eq('type', type)

  const { data, error } = await query
  if (error) { console.error('getFlavors:', error); return [] }
  return data ?? []
}

export async function getFlavorsByFormat(formatCode: string): Promise<Flavor[]> {
  const supabase = await createClient()

  // Busca IDs de sabores que têm preço para este formato
  const { data: priceRows, error: priceError } = await supabase
    .from('flavor_prices')
    .select('flavor_id')
    .eq('format_code', formatCode)
  if (priceError || !priceRows) return []

  const flavorIds = priceRows.map((r) => r.flavor_id)
  if (flavorIds.length === 0) return []

  const { data, error } = await supabase
    .from('flavors')
    .select(`
      *,
      prices:flavor_prices(*),
      images:flavor_images(*)
    `)
    .in('id', flavorIds)
    .eq('is_available', true)
    .order('name', { ascending: true })

  if (error) { console.error('getFlavorsByFormat:', error); return [] }
  return data ?? []
}

export async function getFlavorBySlug(slug: string): Promise<Flavor | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('flavors')
    .select(`*, prices:flavor_prices(*), images:flavor_images(*)`)
    .eq('slug', slug)
    .single()
  if (error) return null
  return data
}

export async function getFeaturedFlavors(): Promise<Flavor[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('flavors')
    .select(`*, prices:flavor_prices(*), images:flavor_images(*)`)
    .eq('is_available', true)
    .eq('is_featured', true)
    .limit(8)
  if (error) { console.error('getFeaturedFlavors:', error); return [] }
  return data ?? []
}

// ─── Configurações de frete ────────────────────────────────────────────────

const DEFAULT_FREIGHT: FreightConfig = {
  freight_per_km: 2.5,
  delivery_radius_km: 8,
}

export async function getFreightConfig(): Promise<FreightConfig> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('id', 1)
    .single()
  if (error || !data) return DEFAULT_FREIGHT
  return data as FreightConfig
}
