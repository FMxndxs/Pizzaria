# Docs-B6: API spec — webhooks para gateways de pagamento

## Business Outcome
Um desenvolvedor que for integrar gateway de pagamento encontra o formato canônico de webhook e a arquitetura de adaptadores esperada.

## Scope
- `guides/api-spec.md` seção 5 (webhooks): endpoint `POST /api/v1/webhooks/payment`, verificação HMAC-SHA256, formato canônico de evento, fluxo de transição `pending → confirmed`, arquitetura de adaptadores por gateway.

## Acceptance Criteria
- [x] Endpoint de webhook documentado com headers, body e implementação esperada.
- [x] Padrão de adaptadores por gateway explicado.
- [x] Docs atualizados.

## Status
`done`

## Known Drift
Webhook não implementado no MVP (ADR-002: Server Actions para mutações). Documentado como especificação futura.

## Commits
- `red:` — · `green:` 1001afc · `blue:` fcc159c · `document:` (este)
