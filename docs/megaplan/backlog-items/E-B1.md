# E-B1: View `v_revenue_daily` (faturamento + ticket médio)

## Business Outcome
O dono pode consultar faturamento diário, número de pedidos e ticket médio por período diretamente do banco, sem calcular manualmente.

## Scope
- Cria `docs/database/migrations/005_reports_views.sql` com a view:
  ```sql
  CREATE OR REPLACE VIEW v_revenue_daily AS
  SELECT
    date_trunc('day', created_at) AS order_date,
    COUNT(*) AS orders_count,
    SUM(total) AS revenue,
    AVG(total) AS avg_ticket
  FROM orders
  WHERE status = 'delivered'
  GROUP BY order_date
  ORDER BY order_date DESC;
  ```
- Cria RPC owner-only `report_revenue(period text)` que filtra a view pelo período (`'15d'`, `'30d'`, `'month'`).
- Atualiza `schema.sql`.

## Dependencies
- 0-B9 (`is_owner()` disponível)
- C-B4 (pedidos chegam a `delivered` para ter dados)

## Test Plan
### Manual
- Criar alguns pedidos `delivered` → `SELECT * FROM v_revenue_daily` retorna dados.
- `report_revenue('30d')` como owner → retorna faturamento dos últimos 30 dias.
- `report_revenue('30d')` como operator → erro de permissão.

## Acceptance Criteria
- [ ] View retorna `order_date`, `orders_count`, `revenue`, `avg_ticket`.
- [ ] RPC gateada por `is_owner()`.
- [ ] Testes passam.
- [ ] `schema.sql` atualizado.
- [ ] Docs atualizados.

## Status
`pending`

## Known Drift
—

## Commits
- `red:` — · `green:` — · `blue:` — · `document:` —
