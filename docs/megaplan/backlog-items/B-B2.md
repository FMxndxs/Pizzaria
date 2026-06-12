# B-B2: Shell da rota `/cozinha` + fetch inicial da fila

## Business Outcome
A tela da cozinha exibe, ao carregar, todos os pedidos em estado `confirmed` e `preparing`, organizados em lanes visuais.

## Scope
- Cria `src/app/cozinha/page.tsx`: server component, `revalidate = 0`, chama `service.getKitchenQueue(serverClient)`.
- Implementa `service.getKitchenQueue(client)`: SELECT em `orders` WHERE `status IN ('confirmed', 'preparing')` ORDER BY `created_at` ASC.
- Cria `src/components/kds/KitchenBoard.tsx`: client component que recebe os pedidos iniciais e os organiza em lanes (Confirmados | Preparando).
- Cria `src/components/kds/KitchenCard.tsx`: card individual com `order_code`, itens, observações.
- **Não inclui:** Realtime (→ B-B4); ações de avançar status (→ B-B5, B-B6).

## Dependencies
- B-B1 (rota está protegida)
- A-B9 (`order_code` disponível)
- 0-B2 (labels de status)

## Test Plan
### Unit (RTL)
- `KitchenBoard` renderiza lanes "Confirmados" e "Preparando".
- `KitchenCard` exibe `order_code`, itens e `created_at`.
### Manual
- Criar um pedido e confirmá-lo → aparece na lane "Confirmados" da tela da cozinha ao carregar.

## Acceptance Criteria
- [ ] Pedidos `confirmed` aparecem na lane correta.
- [ ] Pedidos `preparing` aparecem na lane correta.
- [ ] Pedidos `ready`, `delivered`, `cancelled` NÃO aparecem.
- [ ] Testes RTL passam.
- [ ] Docs atualizados.

## Implementation Notes
`KitchenBoard` recebe os dados do server component via props (hydration estática). O Realtime de B-B4 vai adicionar o listener do lado do cliente para atualizações ao vivo. Design deve usar a paleta "Forno & Lenha" (tema definido em `globals.css`) — cards grandes, legíveis sob iluminação de cozinha.

## Status
`done`

## Known Drift
`getKitchenQueue` já estava implementada em Cycle A (service.ts). Rota `src/app/cozinha/page.tsx` é server component com `revalidate=0`. `KitchenBoard` e `KitchenCard` criados em `src/components/kds/`.

## Commits
- `red:` 6357268 · `green:` dac8428 · `blue:` e1836fa · `document:` (este commit)
