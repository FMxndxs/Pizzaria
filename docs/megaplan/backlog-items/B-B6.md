# B-B6: Ação "Marcar pronto" no KDS

## Business Outcome
A cozinha pode marcar um pedido como "pronto" (`preparing → ready`) no KDS, sinalizando para o despacho que o pedido está disponível para entrega ou retirada.

## Scope
- Adiciona botão "Marcar pronto" em `KitchenCard.tsx` para pedidos na lane "Preparando".
- Chama `advanceOrderStatusAction(orderId, 'ready')`.
- Feedback visual de loading.
- Pedido some da tela do KDS quando `ready` (não é mais responsabilidade da cozinha).
- **Não inclui:** notificação ao cliente de "pronto" (pode ser adicionada futuramente via `NotificationProvider`).

## Dependencies
- A-B5 (`advanceOrderStatusAction`)
- B-B5 (padrão de botão no KDS estabelecido)

## Test Plan
### Manual
- Clicar "Marcar pronto" em pedido `preparing` → desaparece do KDS em <2s.
- No painel admin, pedido aparece com status `ready`.
### Unit (RTL)
- Botão renderizado apenas em pedidos `preparing`.

## Acceptance Criteria
- [ ] Botão aparece apenas em pedidos `preparing`.
- [ ] Transição `preparing→ready` executada.
- [ ] Pedido some do KDS após transição.
- [ ] Testes RTL passam.
- [ ] Docs atualizados.

## Implementation Notes
Este é o B-item mais crítico do Cycle B — é aqui que o lead-time "tempo de preparo" é capturado no histórico (trigger de 0-B4 registra automaticamente). O dado é a base de E-B2 (`v_lead_times`).

## Status
`done`

## Known Drift
Pedido some do KDS via evento Realtime (status `ready` → filtrado fora de `ACTIVE_STATUSES` no handler). O trigger de 0-B4 registra `ready` no histórico automaticamente.

## Commits
- `red:` 6357268 · `green:` dac8428 · `blue:` e1836fa · `document:` (este commit)
