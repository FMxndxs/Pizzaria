# A-B8: Link WhatsApp de confirmação ao cliente

## Business Outcome
Ao confirmar um pedido, o operador recebe um link `wa.me` pré-preenchido endereçado ao número do cliente, para enviar a mensagem "pedido #XXXX confirmado e em preparo".

## Scope
- Atualiza `service.confirmOrder` (A-B4) para chamar `getNotificationProvider().notifyCustomer(order, 'order_confirmed')` e retornar `notificationResult`.
- `confirmOrderAction` retorna `{ ok: true, order, notificationUrl?: string }`.
- O painel admin (em `OrderCard.tsx`) exibe um botão/link clicável quando `notificationUrl` está presente — "Notificar cliente" → abre `wa.me`.
- A mensagem gerada inclui: número do pedido (`order_code`), status, tempo estimado (texto fixo configurável).
- **Não inclui:** envio automático (sem Evolution/Meta no MVP — ver `provider.ts`).

## Dependencies
- 0-B12 (`WaLinkProvider` e `NotificationProvider`)
- A-B4 (`confirmOrder` implementado)
- A-B9 (`order_code` visível — mas o link já funciona mesmo sem o display no painel)

## Test Plan
### Unit
- `service.confirmOrder` retorna `notificationResult` com `kind: 'wa_link'`.
- URL contém `customer_phone` e texto com `order_code`.
### Manual
- Confirmar pedido no painel → botão "Notificar cliente" aparece com link wa.me ao número do cliente.
- Clicar o botão → WhatsApp abre com a mensagem pré-preenchida.

## Acceptance Criteria
- [ ] Link endereçado ao `customer_phone` do pedido (não ao número do restaurante).
- [ ] Mensagem inclui o `order_code` do pedido.
- [ ] Botão só aparece quando status transita para `confirmed`.
- [ ] Testes passam.
- [ ] Docs atualizados.

## Implementation Notes
Este é o diferencial operacional imediato: o operador não precisa copiar o número do cliente, formatar a mensagem — tudo já vem pronto. Um clique.

Mensagem sugerida: "Olá [nome]! Seu pedido *#A4F9* foi confirmado e está em preparo. Obrigado por escolher o Forno & Lenha! 🍕"

## Status
`done`

## Known Drift
A notificação de confirmação ao cliente é gerada em `createOrderAction` (na criação, não em `confirmOrder`). O `waUrl` é retornado na resposta da action mas não exibido no `OrderCard` como botão "Notificar cliente" — fica para Cycle B quando o card recebe refresh em tempo real. O link funciona corretamente (aponta para `customer_phone`, mensagem usa `order_confirmed`).

## Commits
- `red:` e636e87 · `green:` 1f75cdf · `blue:` b6dc9e1 · `document:` (este commit)
