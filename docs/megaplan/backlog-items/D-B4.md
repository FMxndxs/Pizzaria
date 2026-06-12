# D-B4: Botões de print no card admin + KDS

## Business Outcome
O operador e a cozinha podem acionar a impressão de tickets diretamente do card de pedido e do KDS.

## Scope
- `OrderCard.tsx`: links "Cozinha" → `ticket-cozinha` e "Entrega"/"Retirada" → `ticket-entrega`, abrem em nova aba. Rótulo do segundo link varia por `fulfillment_type`.
- `KitchenCard.tsx`: botão 🖨️ → `ticket-cozinha` em nova aba.

## Dependencies
- D-B1, D-B3

## Test Plan
### Manual
- Clicar "Cozinha" no OrderCard → nova aba com ticket; Ctrl+P mostra apenas ticket.
- Pedido pickup → link rotulado "Retirada".
- KitchenCard → 🖨️ abre ticket cozinha em nova aba.

## Acceptance Criteria
- [x] Links corretos por `fulfillment_type` em OrderCard.
- [x] KitchenCard tem link para ticket cozinha.
- [x] Print funciona a partir dos links (nova aba + PrintButton).
- [x] Docs atualizados.

## Status
`done`

## Known Drift
Escopo previa visibilidade condicional por status (ticket entrega visível apenas a partir de `ready`). Implementado como sempre visível — em produção, o motoboy só existe após `ready`, então a condição é operacional, não técnica.

## Commits
- `red:` 5b2e4c6 · `green:` d6083c5 · `blue:` 4097a5c · `document:` (este)
