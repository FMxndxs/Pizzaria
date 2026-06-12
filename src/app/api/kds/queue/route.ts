import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getKitchenQueue } from '@/lib/orders/service'

export async function GET() {
  const supabase = await createClient()
  const result = await getKitchenQueue(supabase)
  if (!result.ok) return NextResponse.json([], { status: 500 })
  return NextResponse.json(result.data)
}
