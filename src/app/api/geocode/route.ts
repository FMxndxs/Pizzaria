import { NextRequest, NextResponse } from 'next/server'
import { geocodeCep } from '@/lib/geocoding/cep'

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = req.nextUrl
  const rawCep = searchParams.get('cep') ?? ''
  const cep = rawCep.replace(/\D/g, '')

  if (cep.length !== 8) {
    return NextResponse.json({ error: 'CEP inválido' }, { status: 400 })
  }

  const result = await geocodeCep(cep)
  if (!result) {
    return NextResponse.json({ error: 'CEP não encontrado' }, { status: 404 })
  }

  return NextResponse.json(result)
}
