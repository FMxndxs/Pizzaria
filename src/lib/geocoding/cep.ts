import type { DeliveryQuote } from '@/types'

interface Coords {
  lat: number
  lng: number
}

export interface GeoResult {
  coords: Coords | null
  address: DeliveryQuote['address']
}

interface BrasilApiResponse {
  cep: string
  state: string
  city: string
  neighborhood: string
  street: string
  location?: {
    type?: string
    coordinates?: {
      longitude?: string
      latitude?: string
    }
  }
}

/**
 * Geocodifica um CEP brasileiro.
 * 1. BrasilAPI v2 → endereço + coordenadas (quando disponíveis)
 * 2. Fallback Nominatim/OSM → coordenadas (quando BrasilAPI não retorna lat/lng)
 */
export async function geocodeCep(cep: string, number?: string): Promise<GeoResult | null> {
  const digits = cep.replace(/\D/g, '')

  try {
    const res = await fetch(`https://brasilapi.com.br/api/cep/v2/${digits}`, {
      signal: AbortSignal.timeout(6000),
      next: { revalidate: 86400 },
    })

    if (res.ok) {
      const data: BrasilApiResponse = await res.json()

      const address: DeliveryQuote['address'] = {
        cep: digits,
        street: data.street ?? '',
        neighborhood: data.neighborhood ?? '',
        city: data.city ?? '',
        state: data.state ?? '',
      }

      const latStr = data.location?.coordinates?.latitude
      const lngStr = data.location?.coordinates?.longitude

      if (latStr && lngStr) {
        return { coords: { lat: parseFloat(latStr), lng: parseFloat(lngStr) }, address }
      }

      const coords = await nominatimGeocode(data.street, number, data.city, data.state)
      return { coords, address }
    }
  } catch {
    // BrasilAPI indisponível
  }

  return null
}

async function nominatimGeocode(
  street: string,
  number: string | undefined,
  city: string,
  state: string,
): Promise<Coords | null> {
  try {
    const parts = [street, number, city, state, 'Brasil'].filter(Boolean)
    const q = parts.join(', ')
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1&countrycodes=br`

    const res = await fetch(url, {
      headers: { 'User-Agent': 'PizzariaFornoLenha/1.0 (felipemendescampos40@gmail.com)' },
      signal: AbortSignal.timeout(6000),
    })

    if (!res.ok) return null
    const data: Array<{ lat: string; lon: string }> = await res.json()
    if (!data[0]) return null
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
  } catch {
    return null
  }
}
