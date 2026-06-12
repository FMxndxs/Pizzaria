import type { SupabaseClient } from '@supabase/supabase-js'
import type { UserRole } from '@/types'

export class UnauthorizedError extends Error {
  constructor(required: UserRole[], actual: UserRole | null) {
    super(
      `Unauthorized: requires ${required.join(' or ')}, got ${actual ?? 'unauthenticated'}`,
    )
    this.name = 'UnauthorizedError'
  }
}

export async function assertRole(
  client: SupabaseClient,
  allowed: UserRole[],
): Promise<void> {
  const { data: { user } } = await client.auth.getUser()
  if (!user) throw new UnauthorizedError(allowed, null)

  const { data, error } = await client
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (error || !data) throw new UnauthorizedError(allowed, null)

  const role = data.role as UserRole
  if (!allowed.includes(role)) throw new UnauthorizedError(allowed, role)
}
