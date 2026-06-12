# E-B3: Função SQL `get_top_products` (mais vendidos por sabor e formato)

## Business Outcome
O dono vê quais sabores e formatos são mais pedidos, baseando decisões de cardápio e estoque.

## Scope
- `005_reports_views.sql`: função `get_top_products(days_back int DEFAULT 30)` — `jsonb_array_elements(flavors)` para extrair sabores individuais, GROUP BY sabor + formato, LIMIT 20.

## Dependencies
- 0-B9 (`is_owner()`)

## Acceptance Criteria
- [x] Retorna `flavor_name`, `format_label`, `order_count`, `total_qty`.
- [x] Ordenado por `total_qty DESC`.
- [x] Gateada por `is_owner()`.
- [x] Docs atualizados.

## Status
`done`

## Known Drift
—

## Commits
- `red:` d824f48 · `green:` 9586167 · `blue:` b08e6e8 · `document:` (este)
