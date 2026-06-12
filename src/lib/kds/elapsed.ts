export function getElapsedMinutes(confirmedAt: string, now: Date = new Date()): number {
  return Math.floor((now.getTime() - new Date(confirmedAt).getTime()) / 60_000)
}

export function elapsedBadgeColor(minutes: number): 'green' | 'yellow' | 'red' {
  if (minutes < 10) return 'green'
  if (minutes < 20) return 'yellow'
  return 'red'
}
