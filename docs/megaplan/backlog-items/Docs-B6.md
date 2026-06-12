# Docs-B6: API spec — webhooks para gateways de pagamento

## Business Outcome
Um integrador de gateway de pagamento (Pix, Mercado Pago, Stripe) sabe como configurar um webhook que automaticamente transita um pedido de `pending` para `confirmed` ao receber confirmação de pagamento.

## Scope
- Documenta em `guides/api-spec.md` (seção "Webhooks"):
  - Endpoint receptor: `POST /api/v1/webhooks/payment`.
  - Payload esperado por gateway (formato agnóstico + exemplos Pix/MP/Stripe).
  - Verificação de assinatura HMAC.
  - Comportamento: localiza o pedido por `reference` (order_code ou order_id) → `confirmOrder`.
  - Idempotência: pedido já `confirmed` retorna 200 sem re-processar.
- **Não implementa** o endpoint (é documentação de spec futura).

## Dependencies
- Docs-B5

## Test Plan
### Manual
- Revisar que o contrato documentado é consistente com `service.confirmOrder` (A-B4).

## Acceptance Criteria
- [ ] Seção de webhooks em `api-spec.md` completa.
- [ ] Verificação HMAC documentada.
- [ ] Idempotência documentada.
- [ ] `guides/api-spec.md` completo (todas as seções).
- [ ] Docs atualizados.

## Status
`pending`

## Known Drift
—

## Commits
- `red:` — · `green:` — · `blue:` — · `document:` —
