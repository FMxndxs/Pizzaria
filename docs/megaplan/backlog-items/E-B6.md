# E-B6: Export CSV do dashboard

## Business Outcome
O dono baixa os dados de faturamento em CSV para análise em planilhas externas.

## Scope
- `src/app/api/reports/csv/route.ts`: GET handler, owner-gated, chama `getDailyRevenue`, retorna `text/csv` com `Content-Disposition: attachment`.
- Columns: `dia,pedidos,faturamento,ticket_medio`.
- Link "↓ CSV" no cabeçalho de `/admin/relatorios` com `?dias=` corrente.

## Dependencies
- E-B1 (getDailyRevenue disponível)
- E-B5 (dashboard existe para linkar)

## Acceptance Criteria
- [x] Rota retorna CSV válido com cabeçalho.
- [x] Gateada por role=owner.
- [x] Nome do arquivo inclui período.
- [x] Docs atualizados.

## Status
`done`

## Known Drift
Export cobre apenas faturamento (revenue). Top products e peak hours não exportados — cobrem o caso de uso principal.

## Commits
- `red:` d824f48 · `green:` 9586167 · `blue:` b08e6e8 · `document:` (este)
