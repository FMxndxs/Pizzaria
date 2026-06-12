# A-B6: `OrderStatusSelect` consume `advanceOrderStatus`

## Business Outcome
O dropdown de status no painel admin usa `advanceOrderStatusAction` (server-side, guarded) e exibe apenas as transições legais para o estado atual, eliminando o update client-side direto.

## Scope
- Atualiza `src/components/admin/OrderStatusSelect.tsx`:
  - Substitui `supabase.from('orders').update({ status })` por chamada a `advanceOrderStatusAction`.
  - Popula as opções via `nextStatuses(currentStatus, fulfillmentType)` (apenas transições legais).
  - Exibe estado de loading durante a action.
  - Exibe erro se a transição falhar.
- Recebe `fulfillment_type` como prop (adicionado ao `OrderCard`).
- Remove qualquer opção inválida do select (ex.: `out_for_delivery` para pedidos `pickup`).
- **Não inclui:** o botão de confirmação dedicado (A-B4 cobre o fluxo; este item só atualiza o componente existente).

## Dependencies
- A-B5 (`advanceOrderStatusAction`)
- 0-B11 (`nextStatuses` para popular o dropdown)
- 0-B2 (labels/cores já centralizados em `stateMachine.ts`)

## Test Plan
### Unit (RTL)
- Dropdown exibe apenas as transições legais para o status atual.
- Para `fulfillment_type='pickup'` e `status='ready'`, dropdown NÃO mostra `out_for_delivery`.
- Clique na opção chama `advanceOrderStatusAction` (não `supabase.update`).
### Manual
- Nenhuma chamada direta ao Supabase client ao mudar status via dropdown.

## Acceptance Criteria
- [ ] `supabase.from('orders').update(...)` removido de `OrderStatusSelect.tsx`.
- [ ] Apenas opções de `nextStatuses` são renderizadas.
- [ ] `pickup` nunca vê `out_for_delivery` como opção.
- [ ] Testes RTL passam.
- [ ] Docs atualizados.

## Implementation Notes
O `OrderCard` precisa passar `fulfillment_type` para o `OrderStatusSelect`. Adicionar a prop na interface. O OrderCard já recebe o `Order` completo — é só passar `order.fulfillment_type`.

## Status
`done`

## Known Drift
BLUE removeu o badge duplicado do `OrderStatusSelect` (o card header já exibe o status). O select retorna `null` em estados terminais em vez de renderizar um select desabilitado.

## Commits
- `red:` e636e87 · `green:` 1f75cdf · `blue:` b6dc9e1 · `document:` (este commit)
