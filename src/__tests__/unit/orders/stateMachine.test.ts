import { ORDER_STATUS_META } from '@/lib/orders/stateMachine'
import type { OrderStatus } from '@/types'

const ALL_STATUSES: OrderStatus[] = [
  'pending',
  'confirmed',
  'preparing',
  'ready',
  'out_for_delivery',
  'delivered',
  'cancelled',
]

describe('ORDER_STATUS_META', () => {
  test('has exactly 7 statuses', () => {
    expect(Object.keys(ORDER_STATUS_META)).toHaveLength(7)
  })

  test.each(ALL_STATUSES)('"%s" has non-empty label', (status) => {
    expect(typeof ORDER_STATUS_META[status].label).toBe('string')
    expect(ORDER_STATUS_META[status].label.length).toBeGreaterThan(0)
  })

  test.each(ALL_STATUSES)('"%s" has non-empty color', (status) => {
    expect(typeof ORDER_STATUS_META[status].color).toBe('string')
    expect(ORDER_STATUS_META[status].color.length).toBeGreaterThan(0)
  })

  test.each(ALL_STATUSES)('"%s" has non-empty emoji', (status) => {
    expect(typeof ORDER_STATUS_META[status].emoji).toBe('string')
    expect(ORDER_STATUS_META[status].emoji.length).toBeGreaterThan(0)
  })

  test('covers every OrderStatus value — no missing entries', () => {
    for (const s of ALL_STATUSES) {
      expect(ORDER_STATUS_META).toHaveProperty(s)
    }
  })
})
