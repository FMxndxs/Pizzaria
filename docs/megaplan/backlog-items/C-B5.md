# C-B5: Captura `courier_name` no despacho

## Business Outcome
O nome do motoboy é registrado no pedido no momento do despacho, aparecendo no ticket de entrega e no histórico.

## Scope
- Adiciona coluna `orders.courier_name text NULL` na migration de despacho (novo arquivo `007_dispatch_fields.sql` ou parte de `002`).
- Atualiza `src/types/index.ts`: `Order` inclui `courier_name?: string`.
- `dispatchDeliveryAction` (C-B2) persiste `courier_name` em `orders.courier_name`.
- UI na view de despacho: campo de texto opcional "Nome do motoboy" antes do botão "Despachar".
- Atualiza `schema.sql`.

## Dependencies
- C-B2 (`dispatchDeliveryAction` usa o campo)

## Test Plan
### Unit
- `service.dispatchDelivery` persiste `courier_name` no banco.
### Manual
- Despachar com nome "Carlos" → `orders.courier_name = 'Carlos'`.
- Despachar sem nome → `courier_name = null` (campo opcional).

## Acceptance Criteria
- [ ] Coluna `courier_name` nullable em `orders`.
- [ ] Campo salvo corretamente.
- [ ] `schema.sql` atualizado.
- [ ] Testes passam.
- [ ] Docs atualizados.

## Status
`pending`

## Known Drift
—

## Commits
- `red:` — · `green:` — · `blue:` — · `document:` —
