# D-B4: Botões de print no card admin + KDS

## Business Outcome
O operador e a cozinha podem acionar a impressão de tickets diretamente do card de pedido e do KDS, sem precisar navegar para a rota do ticket manualmente.

## Scope
- Adiciona ao `OrderCard.tsx` (painel admin):
  - Botão "Ticket Cozinha" → abre `/admin/pedidos/[id]/ticket-cozinha` em nova aba (ou `window.open` + `window.print()`).
  - Botão "Ticket Entrega" (só para delivery) → abre `/admin/pedidos/[id]/ticket-entrega`.
  - Botão "Ticket Retirada" (só para pickup) → abre `/admin/pedidos/[id]/ticket-retirada`.
- Adiciona ao `KitchenCard.tsx` (KDS):
  - Botão "Imprimir" → abre `/admin/pedidos/[id]/ticket-cozinha`.
- Visibilidade contextual: ticket cozinha disponível a partir de `confirmed`; ticket entrega/retirada disponível a partir de `ready`.

## Dependencies
- D-B1, D-B3 (rotas de ticket existem)
- D-B2 (CSS de print funciona)

## Test Plan
### Unit (RTL)
- `OrderCard` com `fulfillment_type='delivery'` renderiza botão "Ticket Entrega".
- `OrderCard` com `fulfillment_type='pickup'` renderiza botão "Ticket Retirada".
- Botão "Ticket Cozinha" presente para pedidos `confirmed`+.
### Manual
- Clicar "Ticket Cozinha" → nova aba com o ticket; Ctrl+P mostra apenas o ticket.

## Acceptance Criteria
- [ ] Botões de ticket corretos por `fulfillment_type`.
- [ ] Botões de ticket entrega/retirada visíveis apenas a partir de `ready`.
- [ ] Print funciona a partir dos botões.
- [ ] Testes RTL passam.
- [ ] Docs atualizados.

## Status
`pending`

## Known Drift
—

## Commits
- `red:` — · `green:` — · `blue:` — · `document:` —
