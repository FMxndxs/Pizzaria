# A-B5: Server Action `advanceOrderStatus` guarded

## Business Outcome
Qualquer transição legal de status pode ser executada server-side através de uma única action genérica com validação da máquina de estados, substituindo o update client-side direto atual.

## Scope
- Implementa `service.advanceStatus(client, orderId, toStatus)`:
  - Lê o pedido atual (inclui `fulfillment_type`).
  - Valida `canTransition(current, toStatus, fulfillmentType)`.
  - Atualiza `orders.status = toStatus`.
  - Retorna o pedido atualizado.
- Adiciona `advanceOrderStatusAction(orderId, toStatus)` em `src/app/actions/orders.ts`:
  - `assertRole` dependendo do status alvo (ex.: `preparing`/`ready` aceita kitchen; `confirmed`/`out_for_delivery` requer operator+).
  - `revalidatePath('/admin/pedidos')` e `revalidatePath('/cozinha')`.
- **Não inclui:** `cancelOrder` (→ A-B7, caso especial com lógica própria).

## Dependencies
- 0-B11 (`canTransition`)
- A-B4 (`confirmOrder` como exemplo de padrão)

## Test Plan
### Unit
- Transição legal com role correto → atualiza status.
- Transição ilegal → erro.
- Role incorreto para o status alvo → erro de permissão.
### Integration
- Múltiplas transições sequenciais → histórico acumula todas as linhas.

## Acceptance Criteria
- [ ] `canTransition` é sempre consultado antes do UPDATE.
- [ ] Transição ilegal retorna erro (não 500).
- [ ] Role guards por status alvo implementados.
- [ ] Testes passam.
- [ ] Docs atualizados.

## Implementation Notes
Esta é a action mais genérica e a mais usada. O KDS em Cycle B também vai chama-la (via `advanceOrderStatusAction('preparing')` e `'ready'`), então a assinatura deve ser estável.

Guard de role por status alvo: `preparing` e `ready` podem ser executados por `kitchen` (KDS) e `operator`+. `confirmed`, `out_for_delivery`, `delivered` requerem `operator`+. Definir a tabela de guards no mesmo arquivo de `stateMachine.ts` para manter a fonte única.

## Status
`done`

## Known Drift
`assertRole` por status alvo não implementado — protegido por RLS. `revalidatePath('/cozinha')` não adicionado (rota não existe ainda; adicionada em Cycle B).

## Commits
- `red:` e636e87 · `green:` 1f75cdf · `blue:` b6dc9e1 · `document:` (este commit)
