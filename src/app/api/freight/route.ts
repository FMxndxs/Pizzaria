import { NextRequest, NextResponse } from 'next/server'
import { geocodeCep } from '@/lib/geocoding/cep'
import { quoteFreight } from '@/lib/utils/freight'
import { getFreightConfig } from '@/lib/supabase/queries'

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = req.nextUrl
  const rawCep = searchParams.get('cep') ?? ''
  const number = searchParams.get('number') ?? undefined

  const cep = rawCep.replace(/\D/g, '')
  if (cep.length !== 8) {
    return NextResponse.json({ error: 'CEP inválido — informe 8 dígitos' }, { status: 400 })
  }

  const [geo, config] = await Promise.all([
    geocodeCep(cep, number),
    getFreightConfig(),
  ])

  // Adapta FreightConfig do banco para o shape esperado por quoteFreight
  const freightConfig = {
    hqCoords: {
      lat: config.hq_lat ?? -23.4442,
      lng: config.hq_lng ?? -46.9178,
    },
    perKm: config.freight_per_km,
    radiusKm: config.delivery_radius_km,
  }

  const quote = quoteFreight(geo?.coords ?? null, geo?.address, freightConfig)
  return NextResponse.json(quote)
}
