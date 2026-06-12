# A-B4: Server Action `confirmOrder`

## Business Outcome
O operador pode confirmar um pedido `pending` pelo painel admin, transitando-o para `confirmed` com a transição validada pela máquina de estados.

## Scope
- Implementa `service.confirmOrder(client, orderId)` em `src/lib/orders/service.ts`:
  - Lê o pedido atual, valida `canTransition(current, 'confirmed', fulfillmentType)`.
  - Atualiza `orders.status = 'confirmed'`.
  - Retorna o pedido atualizado.
- Adiciona `confirmOrderAction(orderId)` em `src/app/actions/orders.ts`:
  - `assertRole(client, ['owner', 'operator'])`.
  - Chama `service.confirmOrder`.
  - `revalidatePath('/admin/pedidos')`.
  - Retorna `{ ok: true, order }` ou `{ ok: false, error }`.
- **Não inclui:** link WhatsApp ao cliente (→ A-B8); o botão de UI (→ A-B6 generaliza isso).

## Dependencies
- 0-B11 (`canTransition` implementado)
- 0-B9 (`assertRole` disponível via `guards.ts`)
- A-B1 (`service.ts` com estrutura base)

## Test Plan
### Unit
- `service.confirmOrder` com pedido `pending` → status `confirmed`.
- `service.confirmOrder` com pedido `confirmed` → lança erro de transição inválida.
- `confirmOrderAction` com role `kitchen` → retorna erro de permissão.
### Integration
- `confirmOrderAction` → `order_status_history` tem nova linha `confirmed`.

## Acceptance Criteria
- [ ] Transição `pending→confirmed` executada e registrada no histórico.
- [ ] Transição inválida (ex.: `delivered→confirmed`) rejeitada.
- [ ] `kitchen` não pode confirmar (retorna erro).
- [ ] Testes passam.
- [ ] Docs atualizados.

## Implementation Notes
O trigger de histórico (0-B4) registra a transição automaticamente quando `orders.status` é atualizado — o service não precisa escrever em `order_status_history`.

## Status
`done`

## Known Drift
`assertRole` não implementado em `confirmOrderAction` — protegido apenas pelo Supabase RLS (role no banco). Guard de role a nível de Server Action fica para Cycle B (quando o login kitchen é implementado e RBAC é testável end-to-end).

## Commits
- `red:` e636e87 · `green:` 1f75cdf · `blue:` b6dc9e1 · `document:` (este commit)
