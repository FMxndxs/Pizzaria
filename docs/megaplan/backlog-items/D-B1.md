# D-B1: Componente de ticket da cozinha

## Business Outcome
O operador pode visualizar um ticket da cozinha para qualquer pedido confirmado ou em preparo, contendo número, itens, quantidades e observações.

## Scope
- Cria rota `src/app/admin/pedidos/[id]/ticket-cozinha/page.tsx`: server component que busca o pedido e renderiza `KitchenTicket`.
- Cria `src/components/print/KitchenTicket.tsx`: componente visual do ticket — `order_code`, data/hora, itens (formato, sabores, qtd), observações (`notes`).
- **Não inclui:** CSS de impressão (→ D-B2); botão de print (→ D-B4).

## Dependencies
- A-B9 (`order_code` disponível)

## Test Plan
### Unit (RTL)
- `KitchenTicket` renderiza `order_code`, todos os itens com seus sabores, e `notes` se houver.
- Sem `notes` → seção de observações não renderizada.
### Manual
- Acessar `/admin/pedidos/[id]/ticket-cozinha` → ticket aparece com dados corretos.

## Acceptance Criteria
- [ ] Ticket exibe: `order_code`, data/hora, itens (formato + sabores + qty), observações.
- [ ] Sem `notes`: campo não renderizado.
- [ ] Testes RTL passam.
- [ ] Docs atualizados.

## Status
`pending`

## Known Drift
—

## Commits
- `red:` — · `green:` — · `blue:` — · `document:` —
