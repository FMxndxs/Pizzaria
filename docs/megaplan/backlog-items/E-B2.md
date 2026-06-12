# E-B2: Função SQL `get_lead_times` (tempo confirmed → ready)

## Business Outcome
O dono pode ver o tempo médio de cada pedido desde confirmação até estar pronto, identificando gargalos operacionais.

## Scope
- `005_reports_views.sql`: função `get_lead_times(days_back int DEFAULT 30)` — JOIN em `order_status_history` para extrair timestamps de `confirmed` e `ready`.

## Dependencies
- 0-B3/0-B4 (`order_status_history` populada por trigger)
- 0-B9 (`is_owner()`)

## Acceptance Criteria
- [x] Retorna `order_id`, `order_code`, `ordered_at`, `confirmed_at`, `ready_at`, `lead_minutes`.
- [x] Gateada por `is_owner()`.
- [x] Docs atualizados.

## Status
`done`

## Known Drift
Escopo previa múltiplos segmentos de lead time (confirmação→preparo, preparo→pronto, etc.). Implementado apenas confirmed→ready — suficiente para o KPI de lead time médio no dashboard.

## Commits
- `red:` d824f48 · `green:` 9586167 · `blue:` b08e6e8 · `document:` (este)
