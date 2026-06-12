# E-B7: Export PDF via `window.print()`

## Business Outcome
O dono gera um PDF do relatório do período com um clique, usando o diálogo de impressão do navegador (sem dependência externa).

## Scope
- Cria rota `src/app/admin/relatorios/imprimir/page.tsx`: versão print-only do dashboard, owner-gated.
- Aplica CSS `@media print` (padrão de D-B2): oculta sidebar, navegação, botões; layout de página única ou múltiplas páginas.
- Botão "Baixar PDF" na página de relatórios (E-B5) → `window.open('/admin/relatorios/imprimir?period=...', '_blank')` + `window.print()` na nova aba.
- Reutiliza os mesmos componentes de `RevenueCard`, `TopProductsTable`, etc. (E-B5).

## Dependencies
- E-B5 (componentes de relatório)
- D-B2 (padrão CSS print)

## Test Plan
### Manual
- Clicar "Baixar PDF" → nova aba abre com relatório; diálogo de print aparece automaticamente.
- Preview de impressão: apenas o relatório, sem sidebar/nav.
- Salvar como PDF → arquivo com dados corretos.

## Acceptance Criteria
- [ ] Print mostra apenas o conteúdo do relatório.
- [ ] Botão "Baixar PDF" funciona a partir da página de relatórios.
- [ ] Owner-gated (operator/kitchen não acessa).
- [ ] Docs atualizados.

## Implementation Notes
Consistente com a decisão do plano: usar `window.print()` em vez de `@react-pdf/renderer` (sem dependência pesada para um relatório interno). O browser já tem um "Salvar como PDF" no diálogo de impressão.

## Status
`pending`

## Known Drift
—

## Commits
- `red:` — · `green:` — · `blue:` — · `document:` —
