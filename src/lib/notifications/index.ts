import type { NotificationProvider } from './provider'
import { WaLinkProvider } from './waLink'

export type { NotificationProvider, NotificationResult, NotificationEvent } from './provider'

export function getNotificationProvider(): NotificationProvider {
  // Env-switchable: set NOTIFICATION_PROVIDER=evolution para trocar no futuro.
  // No MVP, sempre WaLinkProvider.
  const provider = process.env.NOTIFICATION_PROVIDER ?? 'wa_link'
  switch (provider) {
    case 'wa_link':
    default:
      return new WaLinkProvider()
  }
}
