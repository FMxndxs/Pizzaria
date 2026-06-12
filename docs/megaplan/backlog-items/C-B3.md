# C-B3: Server Action `markPickedUp` (retirada)

## Business Outcome
O operador marca um pedido pickup como retirado pelo cliente (`ready → delivered`), encerrando o ciclo sem passar por `out_for_delivery`.

## Scope
- Implementa `service.markPickedUp(client, orderId)`:
  - Valida `canTransition('ready', 'delivered', 'pickup')`.
  - Valida `fulfillment_type === 'pickup'`.
  - Atualiza status para `delivered`.
- Adiciona `markPickedUpAction(orderId)` em `src/app/actions/orders.ts`.
- Adiciona botão "Marcar como retirado" na view de despacho (C-B1) para pedidos pickup.

## Dependencies
- C-B1 (view de despacho)
- A-B5 (padrão de action guarded)

## Test Plan
### Unit
- `service.markPickedUp` com pedido `delivery` → erro.
- `service.markPickedUp` com pedido `ready` (pickup) → status `delivered`.
### Manual
- Clicar "Marcar como retirado" → status `delivered`, pedido sai da view de despacho.

## Acceptance Criteria
- [ ] Transição `ready→delivered` executada apenas para pickup.
- [ ] Delivery retorna erro ao chamar `markPickedUp`.
- [ ] Testes passam.
- [ ] Docs atualizados.

## Status
`done`

## Known Drift
Validação delivery→delivered = false coberta pela máquina de estados (delivery ready → out_for_delivery, não direto p/ delivered).

## Commits
- `red:` 3528c44 · `green:` 4d7f13f · `blue:` ce36523 · `document:` (este commit)
