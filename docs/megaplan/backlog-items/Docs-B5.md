# Docs-B5: API spec — endpoints do ciclo de pedido

## Business Outcome
Um desenvolvedor externo sabe exatamente como criar pedidos, listar, consultar e avançar o status via API REST, com exemplos cURL e payloads completos.

## Scope
- Documenta em `guides/api-spec.md` (seção 3):
  - `POST /api/v1/orders` — criar pedido (payload = `NewOrderInput`, resposta = `Order` com `order_code`).
  - `GET /api/v1/orders?status=&period=` — listar com filtros.
  - `GET /api/v1/orders/:id` — detalhe.
  - `PATCH /api/v1/orders/:id/status` — `{ toStatus }` + regras da máquina de estados.
  - `DELETE /api/v1/orders/:id` — cancelar.
  - Endpoints de relatório (owner-only): `GET /api/v1/reports/revenue`, `top-products`, `lead-times`.
- Exemplos cURL para cada endpoint.

## Dependencies
- Docs-B4
- A-B5 (`advanceOrderStatus` como referência dos contratos)

## Test Plan
### Manual
- Verificar que cada endpoint documentado bate com a assinatura correspondente em `service.ts`.

## Acceptance Criteria
- [ ] 5 endpoints de pedidos documentados com exemplos.
- [ ] 3 endpoints de relatório documentados.
- [ ] Payloads batem com os contratos do service layer.
- [ ] Docs atualizados.

## Status
`pending`

## Known Drift
—

## Commits
- `red:` — · `green:` — · `blue:` — · `document:` —
