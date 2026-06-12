# E-B2: View `v_lead_times`

## Business Outcome
O dono pode ver o tempo médio de cada etapa do ciclo de vida dos pedidos (confirmação→preparo, preparo→pronto, despacho→entrega), identificando gargalos operacionais.

## Scope
- Cria view `v_lead_times` usando `order_status_history`:
  - Por pedido: timestamps de `confirmed`, `preparing`, `ready`, `out_for_delivery`, `delivered`.
  - Calcula durações: `confirm_to_ready`, `ready_to_dispatched`, `dispatched_to_delivered`.
  - Agrega médias por período.
- Cria RPC `report_lead_times(period text)` owner-only.
- Atualiza `005_reports_views.sql` e `schema.sql`.

## Dependencies
- E-B1 (arquivo `005_reports_views.sql` existe)
- 0-B4 (histórico de status populado)
- B-B6 (pedidos chegam a `ready` para ter dados de preparo)
- C-B4 (pedidos chegam a `delivered` para ter dados de entrega)

## Test Plan
### Manual
- Pedido com ciclo completo → `v_lead_times` mostra as durações corretas.
- Pedidos sem `out_for_delivery` (pickup) → `dispatched_to_delivered` é null.

## Acceptance Criteria
- [ ] View retorna durações calculadas.
- [ ] Pickup retorna null em campos de delivery.
- [ ] RPC gateada por `is_owner()`.
- [ ] Docs atualizados.

## Status
`pending`

## Known Drift
—

## Commits
- `red:` — · `green:` — · `blue:` — · `document:` —
