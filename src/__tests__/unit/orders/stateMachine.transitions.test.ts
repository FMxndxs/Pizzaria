import { canTransition, nextStatuses } from '@/lib/orders/stateMachine'

describe('canTransition — happy paths (delivery)', () => {
  test('pending → confirmed', () =>
    expect(canTransition('pending', 'confirmed', 'delivery')).toBe(true))
  test('confirmed → preparing', () =>
    expect(canTransition('confirmed', 'preparing', 'delivery')).toBe(true))
  test('preparing → ready', () =>
    expect(canTransition('preparing', 'ready', 'delivery')).toBe(true))
  test('ready → out_for_delivery', () =>
    expect(canTransition('ready', 'out_for_delivery', 'delivery')).toBe(true))
  test('out_for_delivery → delivered', () =>
    expect(canTransition('out_for_delivery', 'delivered', 'delivery')).toBe(true))
})

describe('canTransition — happy paths (pickup)', () => {
  test('ready → delivered (pickup bypasses out_for_delivery)', () =>
    expect(canTransition('ready', 'delivered', 'pickup')).toBe(true))
})

describe('canTransition — cancellations', () => {
  test('pending → cancelled', () =>
    expect(canTransition('pending', 'cancelled', 'delivery')).toBe(true))
  test('confirmed → cancelled', () =>
    expect(canTransition('confirmed', 'cancelled', 'delivery')).toBe(true))
  test('preparing → cancelled', () =>
    expect(canTransition('preparing', 'cancelled', 'delivery')).toBe(true))
  test('ready → cancelled', () =>
    expect(canTransition('ready', 'cancelled', 'delivery')).toBe(true))
  test('out_for_delivery → cancelled', () =>
    expect(canTransition('out_for_delivery', 'cancelled', 'delivery')).toBe(true))
})

describe('canTransition — illegal transitions', () => {
  test('pending → delivered is invalid (skip)', () =>
    expect(canTransition('pending', 'delivered', 'delivery')).toBe(false))
  test('pending → preparing is invalid (skip)', () =>
    expect(canTransition('pending', 'preparing', 'delivery')).toBe(false))
  test('ready → out_for_delivery is blocked for pickup', () =>
    expect(canTransition('ready', 'out_for_delivery', 'pickup')).toBe(false))
  test('ready → delivered is blocked for delivery (must go via out_for_delivery)', () =>
    expect(canTransition('ready', 'delivered', 'delivery')).toBe(false))
  test('delivered → cancelled is invalid (terminal)', () =>
    expect(canTransition('delivered', 'cancelled', 'delivery')).toBe(false))
  test('cancelled → confirmed is invalid (terminal)', () =>
    expect(canTransition('cancelled', 'confirmed', 'delivery')).toBe(false))
})

describe('nextStatuses', () => {
  test('pending (delivery) → [confirmed, cancelled]', () =>
    expect(nextStatuses('pending', 'delivery').sort()).toEqual(['cancelled', 'confirmed']))

  test('preparing (delivery) → [ready, cancelled]', () =>
    expect(nextStatuses('preparing', 'delivery')).toEqual(['ready', 'cancelled']))

  test('ready (delivery) → [out_for_delivery, cancelled]', () =>
    expect(nextStatuses('ready', 'delivery')).toEqual(['out_for_delivery', 'cancelled']))

  test('ready (pickup) → [delivered, cancelled]', () =>
    expect(nextStatuses('ready', 'pickup')).toEqual(['delivered', 'cancelled']))

  test('delivered (delivery) → [] (terminal)', () =>
    expect(nextStatuses('delivered', 'delivery')).toEqual([]))

  test('cancelled (pickup) → [] (terminal)', () =>
    expect(nextStatuses('cancelled', 'pickup')).toEqual([]))

  test('pickup never has out_for_delivery in any state', () => {
    const statuses = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery'] as const
    for (const s of statuses) {
      expect(nextStatuses(s, 'pickup')).not.toContain('out_for_delivery')
    }
  })
})
