# D-B2: CSS `@media print` isolando o ticket

## Business Outcome
Ao imprimir a página do ticket, apenas o conteúdo do ticket é impresso — sem header, sidebar, botões ou qualquer elemento da UI do painel.

## Scope
- Adiciona CSS `@media print` no componente/layout de ticket:
  - `body > *:not(.print-area) { display: none }` (ou equivalente com Tailwind v4).
  - Remove margens, backgrounds e sombras decorativas.
  - Garante que a fonte seja legível (mínimo 12pt) e o layout caiba numa folha A4 ou papel térmico 80mm.
- `window.print()` pode ser chamado diretamente da página de ticket (sem botão — D-B4 adiciona o botão no card).
- **Inclui:** tanto o ticket da cozinha (D-B1) quanto o do motoboy (D-B3) devem usar este padrão.

## Dependencies
- D-B1 (ticket da cozinha existe)

## Test Plan
### Manual
- Ctrl+P (ou Cmd+P) na página do ticket → preview de impressão mostra apenas o conteúdo do ticket.
- Sidebar, navegação, botões de ação não aparecem no preview.
- Texto legível sem truncamento.

## Acceptance Criteria
- [ ] Preview de impressão exibe apenas o ticket.
- [ ] Sem elementos de UI do painel na impressão.
- [ ] Legível em impressora padrão A4.
- [ ] Docs atualizados.

## Implementation Notes
**Implementation Note:** a escolha de `window.print()` sobre QZ Tray/ESC-POS foi deliberada (custo/risco zero, funciona em qualquer impressora). O CSS de impressão é o mecanismo que torna isso viável operacionalmente. Tailwind v4 CSS-first permite classes como `print:hidden` para suprimir elementos facilmente.

## Status
`pending`

## Known Drift
—

## Commits
- `red:` — · `green:` — · `blue:` — · `document:` —
