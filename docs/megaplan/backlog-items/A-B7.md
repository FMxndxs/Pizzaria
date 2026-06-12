# A-B7: Server Action `cancelOrder`

## Business Outcome
O operador pode cancelar um pedido em qualquer estado não-terminal com um único clique, registrando o cancelamento no histórico.

## Scope
- Implementa `service.cancelOrder(client, orderId, reason?)` em `src/lib/orders/service.ts`:
  - Valida `canTransition(current, 'cancelled', fulfillmentType)`.
  - Atualiza `orders.status = 'cancelled'`.
  - Opcionalmente salva `reason` em `orders.notes` (concatenado).
- Adiciona `cancelOrderAction(orderId, reason?)` em `src/app/actions/orders.ts`:
  - `assertRole(client, ['owner', 'operator'])`.
  - `revalidatePath('/admin/pedidos')` e `revalidatePath('/cozinha')`.
- **Não inclui:** botão de UI dedicado (pode ser adicionado ao `OrderCard`); notificação ao cliente.

## Dependencies
- 0-B11 (`canTransition` inclui `→cancelled`)
- A-B5 (padrão de action guarded)

## Test Plan
### Unit
- `service.cancelOrder` com pedido `delivered` → lança erro (terminal).
- `service.cancelOrder` com pedido `preparing` → status `cancelled`.
- `cancelOrderAction` com kitchen → erro de permissão.

## Acceptance Criteria
- [ ] `cancelled` bloqueado para estados terminais (`delivered`, `cancelled`).
- [ ] Histórico registra a transição.
- [ ] `kitchen` não pode cancelar.
- [ ] Testes passam.
- [ ] Docs atualizados.

## Implementation Notes
Pedidos `delivered` são terminais — cancelamento após entrega não faz sentido operacionalmente. Se o negócio precisar de "estorno" no futuro, isso é um estado/fluxo separado.

## Status
`done`

## Known Drift
`cancelOrder` delega a `advanceStatus` com `'cancelled'` — sem campo `reason` por enquanto (MVP). `assertRole` não implementado neste cycle (ver A-B4 drift).

## Commits
- `red:` e636e87 · `green:` 1f75cdf · `blue:` b6dc9e1 · `document:` (este commit)
