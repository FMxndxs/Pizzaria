# A-B1: Server Action `createOrder` atômica

## Business Outcome
Um pedido é criado de forma atômica e confiável no servidor — `orders` e `order_items` persistidos numa única transação — substituindo a inserção best-effort client-side atual.

## Scope
- Implementa `service.createOrder(client, input: NewOrderInput)` em `src/lib/orders/service.ts`:
  - Usa RPC `create_order_atomic(input)` no Supabase (ou INSERT sequencial server-side com tratamento de erro completo).
  - Retorna `{ orderId: string, orderCode: string }`.
  - Popula `order_items.flavors` com o campo `type` corrigido (via `mappers.cartItemsToOrderItems`).
  - `user_id` pode ser `null` (guest) ou o UUID do usuário autenticado.
- Cria `src/app/actions/orders.ts` com `createOrderAction(input)` (`'use server'`):
  - Chama `service.createOrder(serverClient, input)`.
  - Retorna `{ orderId, orderCode, waUrl }` (a URL wa.me para o cliente abrir).
  - `revalidatePath('/admin/pedidos')`.
- **Não inclui:** validação Zod (→ A-B2); migração do `carrinho/page.tsx` (→ A-B3).

## Dependencies
- 0-B5, 0-B6 (número de pedido gerado pelo banco)
- 0-B10 (esqueleto da camada de serviço com `cartItemsToOrderItems`)
- 0-B12 (`WaLinkProvider` para gerar `waUrl`)

## Test Plan
### Unit
- `service.createOrder` com mock de `client` persiste `orders` + `order_items` e retorna `orderId` + `orderCode`.
- `order_items` gerados têm `type` em cada flavor.
### Integration
- Chamar `createOrderAction` → banco tem a linha em `orders` + linhas em `order_items`.
- Falha em `order_items` → rollback: nenhuma linha em `orders` persiste.

## Acceptance Criteria
- [ ] `orders` e `order_items` são criados ou nenhum é (atomicidade).
- [ ] `order_code` retornado corresponde ao gerado pelo banco.
- [ ] `flavor.type` presente em todos os items.
- [ ] `waUrl` retornado é um link `wa.me` válido ao número do restaurante.
- [ ] Testes passam.
- [ ] Docs atualizados.

## Implementation Notes
A atomicidade pode ser obtida de duas formas: (a) RPC `SECURITY DEFINER` no banco que faz o INSERT em transação; (b) inserção sequencial server-side com `try/catch` e delete de rollback manual. A RPC é mais robusta — recomendar (a) pois o service layer chama um único `supabase.rpc('create_order_atomic', ...)`.

O `waUrl` retornado é o link para o cliente finalizar via WhatsApp (comportamento atual de `carrinho/page.tsx`). Não é a notificação de confirmação — essa é em A-B8.

## Status
`done`

## Known Drift
Plano sugeria RPC `create_order_atomic` para atomicidade real no banco. Implementado INSERT sequencial server-side com delete de rollback manual em caso de falha nos itens. Suficiente para o MVP; RPC pode ser adicionada como migration futura sem alterar a interface da função.

`assertRole` não foi adicionado ao `createOrderAction` — pedidos vêm de guests não autenticados, então RBAC não se aplica na criação.

## Commits
- `red:` e636e87 · `green:` 1f75cdf · `blue:` b6dc9e1 · `document:` (este commit)
