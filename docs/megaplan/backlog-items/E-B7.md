# E-B7: Export PDF via `window.print()`

## Business Outcome
O dono gera um PDF do relatório usando o diálogo de impressão do navegador, sem dependência externa.

## Scope
- A página `/admin/relatorios` usa CSS padrão do navegador para impressão.
- Não requer CSS print customizado adicional — o layout responsivo da tabela funciona adequadamente na impressão.
- Reusa o padrão `print:hidden` do Tailwind para ocultar elementos de UI.

## Dependencies
- E-B5 (dashboard existe)
- D-B2 (padrão CSS print estabelecido)

## Acceptance Criteria
- [x] Ctrl+P na página de relatórios produz saída imprimível com as tabelas.
- [x] Sem dependência de biblioteca externa.
- [x] Docs atualizados.

## Status
`done`

## Known Drift
Não foi criada uma página de print dedicada (apenas a dashboard com Ctrl+P). Suficiente para o MVP — o dono pode imprimir diretamente do browser.

## Commits
- `red:` d824f48 · `green:` 9586167 · `blue:` b08e6e8 · `document:` (este)
