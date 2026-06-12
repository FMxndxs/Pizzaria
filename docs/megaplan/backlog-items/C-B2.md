# C-B2: Server Action `dispatchDelivery`

## Business Outcome
O operador despacha um pedido delivery pronto (`ready → out_for_delivery`), registrando o nome do courier.

## Scope
- Implementa `service.dispatchDelivery(client, orderId, courierName)`:
  - Valida `canTransition('ready', 'out_for_delivery', 'delivery')`.
  - Valida `fulfillment_type === 'delivery'` (rejeita pickup).
  - Salva `courier_name` (campo a adicionar em `orders` — ver C-B5 — ou em `order_status_history.notes`).
  - Atualiza status para `out_for_delivery`.
- Adiciona `dispatchDeliveryAction(orderId, courierName)` em `src/app/actions/orders.ts`.
- Adiciona botão "Despachar" na view de despacho (C-B1) para pedidos delivery.

## Dependencies
- C-B1 (view de despacho)
- A-B5 (`advanceOrderStatus` como referência de padrão)
- C-B5 (`courier_name` no schema — pode ser implementado em conjunto)

## Test Plan
### Unit
- `service.dispatchDelivery` com pedido `pickup` → erro.
- `service.dispatchDelivery` com pedido `ready` (delivery) → status `out_for_delivery`.
### Manual
- Clicar "Despachar" na view → status muda para `out_for_delivery`, courier registrado.

## Acceptance Criteria
- [ ] Transição `ready→out_for_delivery` executada apenas para delivery.
- [ ] Pickup retorna erro ao chamar `dispatchDelivery`.
- [ ] Courier registrado no pedido ou no histórico.
- [ ] Testes passam.
- [ ] Docs atualizados.

## Status
`done`

## Known Drift
`courier_name` salvo em `orders.courier_name` (coluna já existia na migration 002). Validação de fulfillment_type coberta pela máquina de estados (canTransition pickup→out_for_delivery = false).

## Commits
- `red:` 3528c44 · `green:` 4d7f13f · `blue:` ce36523 · `document:` (este commit)
