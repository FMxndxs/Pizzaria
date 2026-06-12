# A-B9: `order_code` visível no painel admin

## Business Outcome
O número do pedido (`#A4F9`) aparece de forma proeminente em cada card de pedido no painel admin, permitindo referência rápida por voz e nos tickets.

## Scope
- Atualiza `src/components/admin/OrderCard.tsx`: exibe `order.order_code` no cabeçalho do card (próximo ao status).
- Atualiza `src/app/admin/(dashboard)/pedidos/page.tsx`: inclui `order_code` na query de `orders`.
- Atualiza `src/types/index.ts`: garante `order_code` na interface `Order` (pode já estar de 0-B7).
- **Não inclui:** busca por `order_code` (funcionalidade futura).

## Dependencies
- 0-B5, 0-B6 (coluna `order_code` existe e é `NOT NULL UNIQUE`)
- A-B1 (`createOrderAction` popula o campo)

## Test Plan
### Unit (RTL)
- `OrderCard` renderiza o `order_code` passado via prop.
### Manual
- Painel admin exibe `#A4F9` (ou equivalente) em cada pedido.
- Pedidos criados antes do backfill (0-B6) também têm código.

## Acceptance Criteria
- [ ] `order_code` visível em cada card no painel.
- [ ] Query de listagem de pedidos inclui `order_code`.
- [ ] Testes RTL passam.
- [ ] Docs atualizados.

## Implementation Notes
Posicionar o `order_code` com destaque visual (fonte maior, cor de brand) — é o identificador que operador e cozinheiro vão usar para se comunicar sob pressão.

## Status
`done`

## Known Drift
`order_code` exibido inline no cabeçalho do card (próximo ao nome) com fonte mono. Pedidos sem `order_code` (null) ocultam o campo. A query em `pedidos/page.tsx` usa `select('*, items:order_items(*)')` que já retorna todos os campos incluindo `order_code`.

## Commits
- `red:` e636e87 · `green:` 1f75cdf · `blue:` b6dc9e1 · `document:` (este commit)
