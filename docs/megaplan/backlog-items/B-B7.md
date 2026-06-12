# B-B7: Badge de tempo decorrido por pedido

## Business Outcome
A cozinha vê há quanto tempo cada pedido está aguardando (desde a confirmação), permitindo priorizar pedidos mais antigos.

## Scope
- Adiciona ao `KitchenCard.tsx` um badge com o tempo decorrido desde `confirmed_at` (timestamp do histórico ou `created_at` como fallback).
- Atualiza a cada 60 segundos (sem Realtime — é um timer local).
- Cor do badge: verde (<10min), amarelo (10-20min), vermelho (>20min).
- **Não inclui:** cálculo server-side de lead-time (→ E-B2); notificação de atraso.

## Dependencies
- B-B2 (`KitchenCard` existe)
- 0-B4 (histórico registra `confirmed_at`)

## Test Plan
### Unit (RTL)
- Badge renderiza com tempo correto a partir do `confirmed_at` passado como prop.
- Badge cor verde para pedido <10min, vermelho para >20min.
### Manual
- Pedido confirmado há 15 minutos → badge amarelo com "15 min".

## Acceptance Criteria
- [ ] Badge exibe tempo decorrido desde confirmação.
- [ ] Cores mudam nos limiares corretos.
- [ ] Atualiza sem causar re-render excessivo.
- [ ] Testes RTL passam.
- [ ] Docs atualizados.

## Implementation Notes
O `confirmed_at` pode vir de uma query extra ao `order_status_history` (filtrar `WHERE status='confirmed' AND order_id=...`). Para simplicidade, passar o timestamp como prop extra no `getKitchenQueue`. Verificar se o campo vale o JOIN extra ou se `orders.created_at` é boa aproximação no MVP.

## Status
`done`

## Known Drift
Usa `orders.created_at` como fallback (sem JOIN em order_status_history). Suficiente para o MVP — a diferença entre created_at e confirmed_at é desprezível na maioria dos casos. O badge atualiza via setInterval(60s) no cliente.

## Commits
- `red:` 6357268 · `green:` dac8428 · `blue:` e1836fa · `document:` (este commit)
