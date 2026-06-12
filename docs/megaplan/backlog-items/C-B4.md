# C-B4: Server Action `markDelivered`

## Business Outcome
O operador registra a entrega de um pedido delivery (`out_for_delivery → delivered`), encerrando o ciclo de vida completo do pedido.

## Scope
- Implementa `service.markDelivered(client, orderId)`:
  - Valida `canTransition('out_for_delivery', 'delivered', 'delivery')`.
  - Atualiza status para `delivered`.
- Adiciona `markDeliveredAction(orderId)` em `src/app/actions/orders.ts`.
- Adiciona botão "Confirmar entrega" na view de despacho / painel para pedidos `out_for_delivery`.

## Dependencies
- C-B2 (despacho cria pedidos `out_for_delivery`)

## Test Plan
### Unit
- `service.markDelivered` com pedido `out_for_delivery` → status `delivered`.
- `service.markDelivered` com pedido `ready` (sem despacho) → erro.
### Integration
- Histórico completo de um pedido delivery: `pending → confirmed → preparing → ready → out_for_delivery → delivered`.

## Acceptance Criteria
- [ ] Transição `out_for_delivery→delivered` executada.
- [ ] Histórico completo registrado.
- [ ] Testes passam.
- [ ] Docs atualizados.

## Implementation Notes
Com C-B4 `done`, o ciclo de vida completo de um pedido delivery está implementado — este é o pré-requisito para E-B2 (`v_lead_times`) ter dados reais do ciclo completo.

## Status
`pending`

## Known Drift
—

## Commits
- `red:` — · `green:` — · `blue:` — · `document:` —
