# B-B5: Ação "Iniciar preparo" no KDS

## Business Outcome
A cozinha pode marcar um pedido como "em preparo" (`confirmed → preparing`) diretamente na tela do KDS com um clique.

## Scope
- Adiciona botão "Iniciar preparo" em `KitchenCard.tsx` para pedidos na lane "Confirmados".
- Chama `advanceOrderStatusAction(orderId, 'preparing')` (A-B5).
- Feedback visual de loading durante a action; erro exibido se falhar.
- O Realtime (B-B4) move o card para a lane "Preparando" automaticamente.

## Dependencies
- A-B5 (`advanceOrderStatusAction`)
- B-B2 (`KitchenCard` existe)
- B-B4 (Realtime ativo para mover o card)

## Test Plan
### Manual
- Clicar "Iniciar preparo" em pedido `confirmed` → card move para lane "Preparando" em <2s.
- Botão desabilitado durante loading (evita duplo clique).
### Unit (RTL)
- Botão renderizado apenas em pedidos `confirmed`.
- Clique chama a action com o `orderId` correto.

## Acceptance Criteria
- [ ] Botão aparece apenas em pedidos `confirmed`.
- [ ] Transição `confirmed→preparing` executada.
- [ ] Card move de lane via Realtime.
- [ ] Testes RTL passam.
- [ ] Docs atualizados.

## Status
`done`

## Known Drift
Botão usa `useTransition` para feedback de loading (sem estado booleano extra). O Realtime move o card de lane automaticamente via upsert no `KitchenBoard`.

## Commits
- `red:` 6357268 · `green:` dac8428 · `blue:` e1836fa · `document:` (este commit)
