# E-B1: Função SQL `get_revenue_daily` (faturamento + ticket médio)

## Business Outcome
O dono pode consultar faturamento diário, número de pedidos e ticket médio por período.

## Scope
- `005_reports_views.sql`: função `get_revenue_daily(days_back int DEFAULT 30)` — SECURITY DEFINER, verifica `is_owner()`, retorna `(day, order_count, revenue, avg_ticket)`.
- Filtra `status != 'cancelled'` e por período.

## Dependencies
- 0-B9 (`is_owner()` disponível)

## Acceptance Criteria
- [x] Função retorna `day`, `order_count`, `revenue`, `avg_ticket`.
- [x] Gateada por `is_owner()`.
- [x] GRANT EXECUTE para authenticated.
- [x] Docs atualizados.

## Status
`done`

## Known Drift
Implementada como SQL function com parâmetro `days_back`, não como view estática — mais flexível e suporta filtragem por período sem view materializada.

## Commits
- `red:` d824f48 · `green:` 9586167 · `blue:` b08e6e8 · `document:` (este)
