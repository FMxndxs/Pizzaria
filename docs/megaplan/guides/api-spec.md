# Especificação da API REST — Sistema de Gestão de Pedidos

> **Status MVP:** as mutações são implementadas via Server Actions (ADR-002). Esta spec documenta a API REST que **será construída** quando o consumo externo for necessário. A camada de serviço (`src/lib/orders/service.ts`) já tem o seam para isso.

---

## 1. Autenticação e roles

### Método

Bearer token (Supabase JWT) no header `Authorization`:

```
Authorization: Bearer <jwt>
```

### Obter token

```http
POST https://<project>.supabase.co/auth/v1/token?grant_type=password
Content-Type: application/json

{
  "email": "operador@restaurante.com.br",
  "password": "senha"
}
```

Resposta:
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "..."
}
```

Para renovar: `POST .../token?grant_type=refresh_token` com `{ "refresh_token": "..." }`.

### Roles e escopos

| Role | Pode fazer |
|---|---|
| `operator` | Criar pedido, confirmar, avançar status, cancelar, despachar, marcar entregue |
| `kitchen` | Ler fila KDS, avançar `confirmed→preparing→ready` |
| `owner` | Tudo acima + acessar relatórios |
| `anon` | Criar pedido (checkout guest) |

---

## 2. Modelo de recursos

### Erro padrão

```json
{
  "error": {
    "code": "not_found",
    "message": "Pedido não encontrado",
    "details": null
  }
}
```

Códigos comuns: `unauthorized`, `forbidden`, `not_found`, `validation_error`, `invalid_transition`.

### `Order`

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | `uuid` | Chave primária |
| `order_code` | `string` | Código amigável, ex.: `#A4F9` |
| `order_seq` | `number` | Número sequencial de geração |
| `status` | `OrderStatus` | Estado atual |
| `fulfillment_type` | `FulfillmentType` | `delivery` ou `pickup` |
| `customer_name` | `string` | Nome do cliente (mín. 2 chars) |
| `customer_phone` | `string` | Telefone (10–15 dígitos) |
| `cep` | `string` | CEP (8 dígitos) |
| `street` | `string` | Logradouro |
| `street_number` | `string` | Número |
| `neighborhood` | `string` | Bairro |
| `city` | `string` | Cidade |
| `notes` | `string \| null` | Observações |
| `total` | `number` | Valor total em BRL |
| `freight` | `number \| null` | Frete em BRL |
| `courier_name` | `string \| null` | Nome do motoboy (preenchido no despacho) |
| `user_id` | `uuid \| null` | Usuário autenticado ou `null` (guest) |
| `created_at` | `ISO 8601` | Data de criação |
| `updated_at` | `ISO 8601` | Data da última atualização |
| `items` | `OrderItem[]` | Itens (quando incluídos via `?include=items`) |

### `OrderStatus` (enum)

```
pending → confirmed → preparing → ready
                                    ↓ (delivery)
                            out_for_delivery → delivered
                                    ↓ (pickup)
                                  delivered

De qualquer não-terminal → cancelled
```

### `FulfillmentType` (enum)

`delivery` | `pickup`

### `OrderItem`

| Campo | Tipo |
|---|---|
| `id` | `uuid` |
| `order_id` | `uuid` |
| `format_code` | `string` (ex.: `pizza-grande`) |
| `format_label` | `string` (ex.: `Pizza Grande`) |
| `flavors` | `OrderItemFlavor[]` (snapshot jsonb) |
| `unit_price` | `number` |
| `quantity` | `number` |

### `OrderItemFlavor`

```json
{ "name": "Calabresa", "price": 49.90, "type": "salgada" }
```

---

## 3. Endpoints — Pedidos

**Base URL:** `https://<dominio>/api/v1`

### `POST /api/v1/orders` — Criar pedido

**Auth:** anon (guest checkout) ou Bearer token

**Body** (schema: `newOrderSchema` em `src/lib/orders/schemas.ts`):

```json
{
  "customer_name": "João Silva",
  "customer_phone": "11999990000",
  "cep": "01310100",
  "street": "Av. Paulista",
  "street_number": "1000",
  "neighborhood": "Bela Vista",
  "city": "São Paulo",
  "notes": null,
  "total": 89.90,
  "freight": 5.00,
  "fulfillment_type": "delivery",
  "items": [
    {
      "format_code": "pizza-grande",
      "format_label": "Pizza Grande",
      "flavors": [
        { "name": "Calabresa", "price": 49.90, "type": "salgada" }
      ],
      "unit_price": 49.90,
      "quantity": 1
    }
  ]
}
```

**Respostas:**
- `201 Created` → `{ "order": Order }`
- `400 Bad Request` → `{ "error": { "code": "validation_error", ... } }`

---

### `GET /api/v1/orders` — Listar pedidos

**Auth:** Bearer (operator+)

**Query params:**

| Param | Tipo | Padrão | Descrição |
|---|---|---|---|
| `status` | `OrderStatus` | — | Filtrar por status |
| `since` | `ISO 8601` | — | Pedidos a partir dessa data |
| `limit` | `number` | 50 | Máximo de resultados |
| `offset` | `number` | 0 | Paginação |
| `include` | `string` | — | `items` para incluir itens |

**Resposta:** `200 OK` → `{ "orders": Order[], "total": number }`

---

### `GET /api/v1/orders/:id` — Detalhe do pedido

**Auth:** Bearer (operator+) ou owner do pedido (guest via token)

**Resposta:** `200 OK` → `{ "order": Order }` (com `items` incluídos)

---

### `PATCH /api/v1/orders/:id/status` — Avançar status

**Auth:** Bearer (operator para maioria; kitchen para `confirmed→preparing→ready`)

**Body:**
```json
{ "status": "confirmed" }
```

A máquina de estados valida a transição em `src/lib/orders/stateMachine.ts`. Transições inválidas retornam `400`.

**Respostas:**
- `200 OK` → `{ "order": Order }`
- `400 Bad Request` → `{ "error": { "code": "invalid_transition", "message": "..." } }`

---

### `DELETE /api/v1/orders/:id` — Cancelar pedido

**Auth:** Bearer (operator+)

Equivale a `PATCH .../status` com `{ "status": "cancelled" }`. Só cancela pedidos não-terminais.

**Respostas:**
- `200 OK` → `{ "order": Order }`
- `409 Conflict` → pedido já terminal

---

### `POST /api/v1/orders/:id/dispatch` — Despachar entrega

**Auth:** Bearer (operator+)

**Body:**
```json
{ "courier_name": "Carlos Moto" }
```

Transition: `ready → out_for_delivery`. Só válido para `fulfillment_type = delivery`.

---

### `POST /api/v1/orders/:id/deliver` — Confirmar entrega / retirada

**Auth:** Bearer (operator+)

Transition: `out_for_delivery → delivered` (delivery) ou `ready → delivered` (pickup). Body vazio.

---

## 4. Endpoints — Relatórios (owner)

**Auth:** Bearer (owner apenas) — RPC Supabase verifica `is_owner()` no banco.

### `GET /api/v1/reports/revenue`

| Param | Padrão |
|---|---|
| `days` | `30` |

**Resposta:**
```json
{
  "rows": [
    { "day": "2026-06-12", "order_count": 8, "revenue": 640.00, "avg_ticket": 80.00 }
  ]
}
```

---

### `GET /api/v1/reports/top-products`

**Resposta:**
```json
{
  "rows": [
    { "flavor_name": "Calabresa", "format_label": "Pizza Grande", "order_count": 10, "total_qty": 12 }
  ]
}
```

---

### `GET /api/v1/reports/lead-times`

**Resposta:**
```json
{
  "rows": [
    {
      "order_id": "uuid",
      "order_code": "#A4F9",
      "ordered_at": "2026-06-12T18:00:00Z",
      "confirmed_at": "2026-06-12T18:05:00Z",
      "ready_at": "2026-06-12T18:25:00Z",
      "lead_minutes": 20
    }
  ]
}
```

---

### `GET /api/v1/reports/peak-hours`

**Resposta:**
```json
{
  "rows": [
    { "hour": 18, "order_count": 6 },
    { "hour": 19, "order_count": 12 }
  ]
}
```

---

## 5. Webhooks — Gateways de pagamento (futuro)

> **Não implementado no MVP.** Documentado para orientar a implementação futura.

### `POST /api/v1/webhooks/payment`

Recebe evento de pagamento confirmado de um gateway (Pix, Mercado Pago, Stripe) e transita automaticamente `pending → confirmed`.

**Headers:**
```
X-Webhook-Signature: <hmac-sha256 do corpo com chave secreta>
```

**Body (formato canônico):**
```json
{
  "event": "payment.confirmed",
  "order_id": "uuid",
  "amount": 89.90,
  "gateway": "mercadopago",
  "gateway_id": "123456789"
}
```

**Implementação esperada:**
1. Verificar assinatura HMAC-SHA256 contra `WEBHOOK_SECRET`.
2. Buscar pedido por `order_id`.
3. Verificar que `amount` bate com `order.total`.
4. Chamar `confirmOrder(client, order_id)`.
5. Retornar `200 OK`.

**Adaptadores por gateway:** cada gateway tem formato próprio de evento; um adapter converte para o formato canônico antes de chamar o handler. Adicionar adapters sem modificar o handler principal.

---

*Última atualização: 2026-06-12 — Cycle Docs COMPLETE*
