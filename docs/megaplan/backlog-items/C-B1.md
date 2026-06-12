# C-B1: View de despacho filtrada por `fulfillment_type`

## Business Outcome
O operador tem uma visão dedicada dos pedidos prontos (`ready`), separados entre "para entrega" (delivery) e "para retirada" (pickup), facilitando o despacho.

## Scope
- Cria `src/app/admin/(dashboard)/despacho/page.tsx`: server component, filtra `orders WHERE status='ready'`.
- Exibe duas seções: "Entregas" (delivery) e "Retiradas" (pickup).
- Adiciona link "Despacho" no `AdminSidebar.tsx`.
- **Não inclui:** as actions de despacho/retirada (→ C-B2, C-B3).

## Dependencies
- 0-B7 (`fulfillment_type` existe)
- B-B6 (pedidos chegam a `ready` via KDS)

## Test Plan
### Manual
- Criar pedido `delivery` e marcar como `ready` → aparece na seção "Entregas".
- Criar pedido `pickup` e marcar como `ready` → aparece na seção "Retiradas".
- Pedidos em outros estados não aparecem.

## Acceptance Criteria
- [ ] Página exibe apenas pedidos `ready`.
- [ ] Separação correta entre delivery e pickup.
- [ ] Link no sidebar funciona.
- [ ] Docs atualizados.

## Status
`pending`

## Known Drift
—

## Commits
- `red:` — · `green:` — · `blue:` — · `document:` —
