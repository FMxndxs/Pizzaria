# A-B3: Migra `carrinho/page.tsx` para Server Action

## Business Outcome
O checkout do cliente usa `createOrderAction` (confiável, server-side) em vez da inserção best-effort client-side; erros de persistência são exibidos ao invés de silenciados.

## Scope
- Substitui em `src/app/carrinho/page.tsx:26-43`:
  - Remove `createOrder(...).catch(()=>{})`.
  - Chama `createOrderAction(input)` e aguarda a resposta.
  - Usa `waUrl` retornado pela action para abrir o WhatsApp (mesmo comportamento de hoje).
  - Em caso de erro, exibe mensagem ao usuário (não silencia mais).
- Deprecia `createOrder` em `src/lib/supabase/clientQueries.ts` (adiciona `@deprecated` JSDoc; não remove ainda).
- **Não inclui:** captura de `fulfillment_type` no checkout (campo adicionado com default `delivery` no banco; pode ser selecionado em evolução futura do formulário).

## Dependencies
- A-B1 (`createOrderAction` implementada)
- A-B2 (validação ativa)

## Test Plan
### Manual
- Completar um pedido no `/carrinho` → pedido aparece no banco com `order_code` preenchido.
- Completar um pedido → WhatsApp abre com o texto correto (comportamento idêntico ao atual).
- Simular falha de banco → erro exibido ao usuário, não silenciado.
### Unit
- Componente renderiza com `createOrderAction` sendo chamada (não `createOrder`).

## Acceptance Criteria
- [ ] `createOrder` (client-side) não é chamada em `carrinho/page.tsx`.
- [ ] Pedido criado via checkout tem `order_code` preenchido.
- [ ] Falha na criação exibe feedback ao usuário.
- [ ] `createOrder` marcada como `@deprecated` em `clientQueries.ts`.
- [ ] Testes passam.
- [ ] Docs atualizados.

## Implementation Notes
Esta PR é o "kill shot" do best-effort path — o comportamento mais arriscado do sistema atual. Prioridade máxima dentro do Cycle A.

O formulário de checkout já captura todos os campos necessários (`customer_name`, `customer_phone`, endereço, `grandTotal`). `fulfillment_type` default `delivery` é suficiente para o MVP; o campo de seleção pode ser adicionado ao formulário em sprint futuro sem migration.

## Status
`done`

## Known Drift
`DeliveryMode` não tem valor `'pickup'` — é `'pickup_or_courier'`. Corrigido no BLUE.
O `waUrl` do action não é usado no carrinho (aponta para customer_phone, não para o restaurante). Corrigido no BLUE: carrinho sempre usa `buildWhatsAppUrl` para o fluxo cliente → restaurante.

## Commits
- `red:` e636e87 · `green:` 1f75cdf · `blue:` b6dc9e1 · `document:` (este commit)
