# D-B1: Componente de ticket da cozinha

## Business Outcome
O operador pode visualizar um ticket da cozinha para qualquer pedido, contendo número, itens, quantidades e observações.

## Scope
- `src/components/print/KitchenTicket.tsx`: ticket visual — `order_code`, data/hora, itens (formato, sabores, qtd, preço), total, observações (`notes`).
- `src/app/admin/pedidos/[id]/ticket-cozinha/page.tsx`: server component que busca o pedido e renderiza `KitchenTicket` via `TicketShell`.
- **Não inclui:** CSS de impressão (→ D-B2); botão de print (→ D-B4).

## Dependencies
- A-B9 (`order_code` disponível)

## Test Plan
### Unit (RTL)
- `KitchenTicket` renderiza `order_code`, todos os itens com seus sabores, e `notes` se houver.
- Sem `notes` → seção de observações não renderizada.

## Acceptance Criteria
- [x] Ticket exibe: `order_code`, data/hora, itens (formato + sabores + qty), observações.
- [x] Sem `notes`: campo não renderizado.
- [x] Testes RTL passam.
- [x] Docs atualizados.

## Status
`done`

## Known Drift
—

## Commits
- `red:` 5b2e4c6 · `green:` d6083c5 · `blue:` 4097a5c · `document:` (este)
