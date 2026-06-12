# Especificação da API REST — Sistema de Gestão de Pedidos

> Status: **Esqueleto** — será preenchido pelos B-items Docs-B4, Docs-B5 e Docs-B6 ao final do Cycle Docs.
> Nota: No MVP as mutações são via Server Actions (ADR-002). Esta spec documenta a API que SERÁ construída, não a que existe hoje.

---

## Princípios

- **API-first para leitura/escrita externa:** todos os recursos expostos aqui espelham contratos do `service layer` (`src/lib/orders/service.ts`).
- **Autenticação:** Bearer token (Supabase JWT) no header `Authorization`.
- **Versionamento:** `/api/v1/` (todo o recurso sob um prefixo de versão).
- **Erros:** formato padrão `{ error: { code, message, details? } }`.

---

## Seções (a preencher)

### Autenticação e roles
> → Docs-B4

### Recursos e modelo de dados
> → Docs-B4

### Endpoints — Pedidos
> → Docs-B5
- `POST /api/v1/orders` — criar pedido
- `GET /api/v1/orders` — listar (com filtros de status, período)
- `GET /api/v1/orders/:id` — detalhe
- `PATCH /api/v1/orders/:id/status` — avançar status (guarded pela state machine)
- `DELETE /api/v1/orders/:id` — cancelar

### Endpoints — Relatórios (owner)
> → Docs-B5
- `GET /api/v1/reports/revenue?period=30d`
- `GET /api/v1/reports/top-products?period=30d`
- `GET /api/v1/reports/lead-times?period=30d`

### Webhooks — Gateways de pagamento
> → Docs-B6
- `POST /api/v1/webhooks/payment` — recebe evento de pagamento confirmado; transita automaticamente `pending → confirmed`
- Formato esperado por gateway (Pix/Mercado Pago/Stripe)
- Verificação de assinatura HMAC

---

*Última atualização: 2026-06-12 (esqueleto inicial — Cycle Docs não iniciado)*
