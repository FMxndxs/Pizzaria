# D-B3: Componente de ticket do motoboy

## Business Outcome
O operador pode imprimir um ticket de entrega para o motoboy, contendo nome do cliente, endereço completo, número do pedido, total e nome do courier.

## Scope
- Cria rota `src/app/admin/pedidos/[id]/ticket-entrega/page.tsx`.
- Cria `src/components/print/DeliveryTicket.tsx`: `order_code`, nome do cliente, endereço completo (rua, número, bairro, cidade, CEP), total formatado em BRL, `courier_name` (se houver).
- Para pedidos `pickup`: rota alternativa `ticket-retirada` com layout simplificado (sem endereço; "Retirada no balcão").
- Reutiliza o padrão CSS `@media print` de D-B2.

## Dependencies
- D-B1 (padrão de rota de ticket estabelecido)
- D-B2 (CSS de impressão)
- C-B5 (`courier_name` disponível)

## Test Plan
### Unit (RTL)
- `DeliveryTicket` renderiza endereço completo, total e `order_code`.
- Sem `courier_name` → campo não renderizado (ou "—").
### Manual
- Acessar `/admin/pedidos/[id]/ticket-entrega` → ticket com dados de entrega corretos.
- Ctrl+P → preview mostra apenas o ticket sem UI do painel.

## Acceptance Criteria
- [ ] Ticket exibe: `order_code`, nome, endereço, total, courier.
- [ ] Pedidos pickup usam `ticket-retirada` com layout adequado.
- [ ] Print isolado (só ticket).
- [ ] Testes RTL passam.
- [ ] Docs atualizados.

## Status
`pending`

## Known Drift
—

## Commits
- `red:` — · `green:` — · `blue:` — · `document:` —
