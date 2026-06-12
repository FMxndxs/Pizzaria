import { getElapsedMinutes, elapsedBadgeColor } from '@/lib/kds/elapsed'

// Fixa "agora" como 2026-06-12T12:30:00Z em todos os testes
const NOW = new Date('2026-06-12T12:30:00Z')

describe('getElapsedMinutes', () => {
  test('returns 0 when confirmedAt is the same as now', () => {
    expect(getElapsedMinutes('2026-06-12T12:30:00Z', NOW)).toBe(0)
  })

  test('returns 5 for 5 minutes ago', () => {
    expect(getElapsedMinutes('2026-06-12T12:25:00Z', NOW)).toBe(5)
  })

  test('returns 15 for 15 minutes ago', () => {
    expect(getElapsedMinutes('2026-06-12T12:15:00Z', NOW)).toBe(15)
  })

  test('returns 25 for 25 minutes ago', () => {
    expect(getElapsedMinutes('2026-06-12T12:05:00Z', NOW)).toBe(25)
  })

  test('floors to integer minutes (no fractional minutes)', () => {
    expect(getElapsedMinutes('2026-06-12T12:28:45Z', NOW)).toBe(1)
  })
})

describe('elapsedBadgeColor', () => {
  test('green for < 10 minutes', () => {
    expect(elapsedBadgeColor(0)).toBe('green')
    expect(elapsedBadgeColor(9)).toBe('green')
  })

  test('yellow for 10–19 minutes', () => {
    expect(elapsedBadgeColor(10)).toBe('yellow')
    expect(elapsedBadgeColor(19)).toBe('yellow')
  })

  test('red for >= 20 minutes', () => {
    expect(elapsedBadgeColor(20)).toBe('red')
    expect(elapsedBadgeColor(45)).toBe('red')
  })
})
