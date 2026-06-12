# E-B4: View `v_peak_hours`

## Business Outcome
O dono vê em quais horários do dia e dias da semana há mais pedidos, para planejar escala de funcionários e preparo.

## Scope
- Cria view `v_peak_hours`:
  ```sql
  SELECT
    EXTRACT(DOW FROM created_at) AS day_of_week,  -- 0=Dom, 6=Sáb
    EXTRACT(HOUR FROM created_at) AS hour_of_day,
    COUNT(*) AS orders_count
  FROM orders
  WHERE status != 'cancelled'
  GROUP BY day_of_week, hour_of_day
  ORDER BY orders_count DESC;
  ```
- Cria RPC `report_peak_hours(period text)` owner-only.
- Atualiza `005_reports_views.sql` e `schema.sql`.

## Dependencies
- E-B1 (arquivo de views)

## Test Plan
### Manual
- Pedidos em horários variados → view retorna a distribuição correta.
- Pedidos `cancelled` não entram na contagem.

## Acceptance Criteria
- [ ] View retorna `day_of_week`, `hour_of_day`, `orders_count`.
- [ ] Cancelados excluídos.
- [ ] RPC gateada por `is_owner()`.
- [ ] Docs atualizados.

## Status
`pending`

## Known Drift
—

## Commits
- `red:` — · `green:` — · `blue:` — · `document:` —
