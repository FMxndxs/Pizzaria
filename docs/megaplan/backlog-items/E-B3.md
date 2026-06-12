# E-B3: View `v_top_products`

## Business Outcome
O dono vê quais sabores e formatos são mais pedidos, baseando decisões de cardápio e estoque.

## Scope
- Cria view `v_top_products`:
  ```sql
  -- Por sabor
  SELECT
    flavor->>'name' AS flavor_name,
    flavor->>'type' AS flavor_type,
    COUNT(*) AS order_count
  FROM order_items,
    jsonb_array_elements(flavors) AS flavor
  JOIN orders ON orders.id = order_items.order_id
  WHERE orders.status = 'delivered'
  GROUP BY flavor_name, flavor_type
  ORDER BY order_count DESC;
  ```
  Variante por formato: agrupa por `format_label`.
- Cria RPC `report_top_products(period text, limit int DEFAULT 10)` owner-only.
- Atualiza `005_reports_views.sql` e `schema.sql`.

## Dependencies
- E-B1 (arquivo de views)
- A-B1 (`order_items.flavors` tem `type` corrigido via `mappers.ts`)

## Test Plan
### Manual
- Pedidos com sabores variados → view retorna ranking correto.
- `report_top_products('30d', 5)` retorna top 5.

## Acceptance Criteria
- [ ] View por sabor com `name`, `type`, `count`.
- [ ] View por formato com `format_label`, `count`.
- [ ] RPC gateada por `is_owner()`.
- [ ] Docs atualizados.

## Status
`pending`

## Known Drift
—

## Commits
- `red:` — · `green:` — · `blue:` — · `document:` —
