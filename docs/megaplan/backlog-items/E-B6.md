# E-B6: Export CSV do dashboard

## Business Outcome
O dono baixa os dados de relatório em CSV para análise em planilhas externas com um clique.

## Scope
- Cria route handler `src/app/admin/relatorios/export/route.ts`: `GET` com query param `?period=30d&type=revenue|top-products|all`.
- Verifica papel `owner` no handler.
- Gera CSV com headers PT-BR, valores formatados.
- Resposta com `Content-Type: text/csv; charset=utf-8` e `Content-Disposition: attachment; filename=relatorio-YYYY-MM-DD.csv`.
- Botão "Baixar CSV" na página de relatórios (E-B5) linka para o route handler.

## Dependencies
- E-B5 (página de relatórios)
- E-B1, E-B3, E-B4 (dados das RPCs)

## Test Plan
### Manual
- Clicar "Baixar CSV" como owner → arquivo `.csv` baixado com dados corretos.
- Tentar acessar a rota como operator → 403.
### Unit
- Route handler retorna CSV com headers corretos.

## Acceptance Criteria
- [ ] CSV baixado com dados do período selecionado.
- [ ] Operator/kitchen retornam 403.
- [ ] Encoding UTF-8 (caracteres especiais PT-BR corretos).
- [ ] Docs atualizados.

## Implementation Notes
CSV gerado sem dependência extra — usar `Array.join(',')` e `\n` simples. Sem biblioteca (papaparse etc.) no MVP.

## Status
`pending`

## Known Drift
—

## Commits
- `red:` — · `green:` — · `blue:` — · `document:` —
