import { assertRole, UnauthorizedError } from '@/lib/orders/guards'
import type { SupabaseClient } from '@supabase/supabase-js'

function makeMockClient(role: string | null): SupabaseClient {
  return {
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { user: role !== null ? { id: 'user-1' } : null },
      }),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue(
            role !== null
              ? { data: { role }, error: null }
              : { data: null, error: { message: 'not found' } },
          ),
        })),
      })),
    })),
  } as unknown as SupabaseClient
}

describe('assertRole', () => {
  test('passes when role is in allowed list', async () => {
    const client = makeMockClient('owner')
    await expect(assertRole(client, ['owner', 'operator'])).resolves.toBeUndefined()
  })

  test('throws UnauthorizedError when role is not allowed', async () => {
    const client = makeMockClient('kitchen')
    await expect(assertRole(client, ['owner', 'operator'])).rejects.toThrow(UnauthorizedError)
  })

  test('throws UnauthorizedError when user has no session', async () => {
    const client = makeMockClient(null)
    await expect(assertRole(client, ['owner'])).rejects.toThrow(UnauthorizedError)
  })

  test('UnauthorizedError message includes required roles', async () => {
    const client = makeMockClient('kitchen')
    await expect(assertRole(client, ['owner', 'operator'])).rejects.toThrow(/owner.*operator|operator.*owner/i)
  })
})
