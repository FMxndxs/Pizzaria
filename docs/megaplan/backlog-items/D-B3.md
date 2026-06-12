# D-B3: Componente de ticket do motoboy

## Business Outcome
O operador pode imprimir um ticket de entrega para o motoboy, contendo nome do cliente, endereço completo, número do pedido, total e nome do courier.

## Scope
- `src/components/print/DeliveryTicket.tsx`: `order_code`, nome/telefone, endereço (rua, número, bairro, cidade, CEP), total BRL, `courier_name`.
- Para pedidos `pickup`: exibe "Retirada no balcão" em vez do endereço.
- Rota única `ticket-entrega` cobre delivery e pickup (o componente condiciona o layout).

## Dependencies
- D-B1, D-B2, C-B5

## Test Plan
### Unit (RTL)
- `DeliveryTicket` renderiza endereço completo para delivery.
- Pedido pickup exibe "Retirada no balcão", sem endereço.
- Sem `courier_name` → campo não renderizado.

## Acceptance Criteria
- [x] Ticket exibe: `order_code`, nome, endereço, total, courier.
- [x] Pedidos pickup exibem "Retirada no balcão" na mesma rota.
- [x] Print isolado (via D-B2 / TicketShell).
- [x] Testes RTL passam (8 testes).
- [x] Docs atualizados.

## Status
`done`

## Known Drift
Escopo previa rota separada `ticket-retirada` para pickup. Implementado como rota única `ticket-entrega` com layout condicional em `DeliveryTicket` — comportamento idêntico ao especificado, sem necessidade de rota extra.

## Commits
- `red:` 5b2e4c6 · `green:` d6083c5 · `blue:` 4097a5c · `document:` (este)
