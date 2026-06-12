# E-B4: Função SQL `get_peak_hours` (horários de pico)

## Business Outcome
O dono vê em quais horários do dia há mais pedidos, para planejar escala e preparo.

## Scope
- `005_reports_views.sql`: função `get_peak_hours(days_back int DEFAULT 30)` — `EXTRACT(HOUR FROM created_at)`, GROUP BY hora, ORDER BY hora.

## Dependencies
- 0-B9 (`is_owner()`)

## Acceptance Criteria
- [x] Retorna `hour` (0-23) e `order_count`.
- [x] Gateada por `is_owner()`.
- [x] Docs atualizados.

## Status
`done`

## Known Drift
Escopo previa também dia da semana. Implementado apenas por hora do dia — cobre o caso de uso principal de planejamento de escala.

## Commits
- `red:` d824f48 · `green:` 9586167 · `blue:` b08e6e8 · `document:` (este)
