# E-B5: Dashboard de relatórios (owner-gated)

## Business Outcome
O dono acessa uma página de relatórios com métricas consolidadas e filtro de período.

## Scope
- `src/app/admin/relatorios/page.tsx`: server component, owner-gated inline (auth.getUser + profiles.role check).
- KPI cards: pedidos totais, faturamento total, ticket médio, lead time médio.
- Tabelas: RevenueTable, TopProductsTable, PeakHoursTable.
- Seletor de período: 15 / 30 / 90 dias via `?dias=` URL param.
- Link para CSV export no cabeçalho.
- AdminSidebar: link Relatórios com BarChart2 icon.

## Dependencies
- E-B1..E-B4 (funções RPC disponíveis)

## Acceptance Criteria
- [x] Página acessível apenas para role=owner.
- [x] KPIs e tabelas exibem dados do período.
- [x] Seletor de período funciona.
- [x] Docs atualizados.

## Status
`done`

## Known Drift
`LeadTimesTable` não criada — lead time aparece apenas como KPI (média). Tabela detalhada de lead times deferred.

## Commits
- `red:` d824f48 · `green:` 9586167 · `blue:` b08e6e8 · `document:` (este)
