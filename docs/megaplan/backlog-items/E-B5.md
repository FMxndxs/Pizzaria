# E-B5: Dashboard de relatórios (owner-gated)

## Business Outcome
O dono acessa uma página de relatórios no painel com métricas consolidadas (faturamento, ticket médio, mais vendidos, picos horários) com filtro de período.

## Scope
- Cria `src/app/admin/(dashboard)/relatorios/page.tsx`: server component, owner-gated (`assertRole` ou verificação no layout).
- Chama as RPCs de E-B1, E-B2, E-B3, E-B4 com o período selecionado.
- Componentes de UI: `RevenueCard`, `TopProductsTable`, `PeakHoursChart` (ou tabela simples), `LeadTimeSummary`.
- Filtro de período: `15d | 30d | month` via search param (`?period=30d`).
- Botões "Baixar CSV" e "Baixar PDF" (implementados em E-B6 e E-B7).
- Adiciona link "Relatórios" no `AdminSidebar` (visível apenas para `owner`).

## Dependencies
- E-B1, E-B2, E-B3, E-B4 (RPCs existem)
- 0-B9 (`is_owner()`)

## Test Plan
### Manual
- Logar como `owner` → link "Relatórios" aparece no sidebar; página carrega com dados.
- Logar como `operator` → link não aparece; URL `/admin/relatorios` redireciona.
- Mudar período → dados atualizam.

## Acceptance Criteria
- [ ] Página acessível apenas para `owner`.
- [ ] 4 seções de métricas renderizadas.
- [ ] Filtro de período funcional.
- [ ] Docs atualizados.

## Status
`pending`

## Known Drift
—

## Commits
- `red:` — · `green:` — · `blue:` — · `document:` —
