# D-B2: CSS `@media print` isolando o ticket

## Business Outcome
Ao imprimir a página do ticket, apenas o conteúdo do ticket é impresso — sem header, sidebar, botões ou qualquer elemento de UI do painel.

## Scope
- CSS `@media print` em todas as páginas de ticket:
  - `body > *:not(.print-root) { display: none }` oculta todo o resto.
  - `.print-ticket { page-break-inside: avoid }` para ticket completo.
- `TicketShell.tsx`: componente compartilhado que encapsula o CSS e o `PrintButton`.
- Reutilizado em `ticket-cozinha` e `ticket-entrega`.

## Dependencies
- D-B1 (ticket da cozinha existe)

## Test Plan
### Manual
- Ctrl+P na página do ticket → preview mostra apenas o conteúdo do ticket.
- Sidebar, navegação, botões de ação não aparecem no preview.

## Acceptance Criteria
- [x] Preview de impressão exibe apenas o ticket.
- [x] Sem elementos de UI do painel na impressão.
- [x] CSS compartilhado via `TicketShell` (elimina duplicação).
- [x] Docs atualizados.

## Status
`done`

## Known Drift
—

## Commits
- `red:` 5b2e4c6 · `green:` d6083c5 · `blue:` 4097a5c · `document:` (este)
