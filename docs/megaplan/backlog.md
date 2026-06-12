# Backlog Global — Sistema de Gestão de Pedidos

> Disciplina de dual-update: toda mudança de status DEVE atualizar este arquivo E o arquivo de detalhe no mesmo commit.

---

## Cycle 0 — Fundação

| ID | Título | Status |
|---|---|---|
| [0-B1](backlog-items/0-B1.md) | Adiciona `ready` ao enum `order_status` | `done` |
| [0-B2](backlog-items/0-B2.md) | Fonte única de metadata de status (TS) | `done` |
| [0-B3](backlog-items/0-B3.md) | Tabela `order_status_history` + RLS | `done` |
| [0-B4](backlog-items/0-B4.md) | Trigger de histórico de status | `done` |
| [0-B5](backlog-items/0-B5.md) | Coluna + gerador de número de pedido | `done` |
| [0-B6](backlog-items/0-B6.md) | Backfill + unicidade do número | `done` |
| [0-B7](backlog-items/0-B7.md) | Coluna `fulfillment_type` em `orders` | `done` |
| [0-B8](backlog-items/0-B8.md) | Coluna `profiles.role` + backfill | `done` |
| [0-B9](backlog-items/0-B9.md) | Helpers SQL de role + policies atualizadas | `done` |
| [0-B10](backlog-items/0-B10.md) | Esqueleto da camada de serviço | `done` |
| [0-B11](backlog-items/0-B11.md) | Validador de transição de status | `done` |
| [0-B12](backlog-items/0-B12.md) | `NotificationProvider` + `WaLinkProvider` | `done` |
| [0-B13](backlog-items/0-B13.md) | Convenção e README de migrations | `done` |

## Cycle A — Ciclo de pedido + confirmação + WhatsApp

| ID | Título | Status |
|---|---|---|
| [A-B1](backlog-items/A-B1.md) | Server Action `createOrder` atômica | `done` |
| [A-B2](backlog-items/A-B2.md) | Validação Zod no boundary de criação | `done` |
| [A-B3](backlog-items/A-B3.md) | Migra `carrinho/page.tsx` para Server Action | `done` |
| [A-B4](backlog-items/A-B4.md) | Server Action `confirmOrder` | `done` |
| [A-B5](backlog-items/A-B5.md) | Server Action `advanceOrderStatus` guarded | `done` |
| [A-B6](backlog-items/A-B6.md) | `OrderStatusSelect` consume `advanceOrderStatus` | `done` |
| [A-B7](backlog-items/A-B7.md) | Server Action `cancelOrder` | `done` |
| [A-B8](backlog-items/A-B8.md) | Link WhatsApp de confirmação ao cliente | `done` |
| [A-B9](backlog-items/A-B9.md) | `order_code` visível no painel admin | `done` |

## Cycle B — KDS realtime

| ID | Título | Status |
|---|---|---|
| [B-B1](backlog-items/B-B1.md) | Login kitchen + gate `/cozinha` | `pending` |
| [B-B2](backlog-items/B-B2.md) | Shell da rota `/cozinha` + fetch inicial da fila | `pending` |
| [B-B3](backlog-items/B-B3.md) | Publication Realtime em `orders` | `pending` |
| [B-B4](backlog-items/B-B4.md) | Subscription live no KDS | `pending` |
| [B-B5](backlog-items/B-B5.md) | Ação "Iniciar preparo" no KDS | `pending` |
| [B-B6](backlog-items/B-B6.md) | Ação "Marcar pronto" no KDS | `pending` |
| [B-B7](backlog-items/B-B7.md) | Badge de tempo decorrido por pedido | `pending` |

## Cycle C — Despacho / entrega

| ID | Título | Status |
|---|---|---|
| [C-B1](backlog-items/C-B1.md) | View de despacho filtrada por `fulfillment_type` | `pending` |
| [C-B2](backlog-items/C-B2.md) | Server Action `dispatchDelivery` | `pending` |
| [C-B3](backlog-items/C-B3.md) | Server Action `markPickedUp` (retirada) | `pending` |
| [C-B4](backlog-items/C-B4.md) | Server Action `markDelivered` | `pending` |
| [C-B5](backlog-items/C-B5.md) | Captura `courier_name` no despacho | `pending` |

## Cycle D — Impressão de tickets

| ID | Título | Status |
|---|---|---|
| [D-B1](backlog-items/D-B1.md) | Componente de ticket da cozinha | `pending` |
| [D-B2](backlog-items/D-B2.md) | CSS `@media print` isolando o ticket | `pending` |
| [D-B3](backlog-items/D-B3.md) | Componente de ticket do motoboy | `pending` |
| [D-B4](backlog-items/D-B4.md) | Botões de print no card admin + KDS | `pending` |

## Cycle E — Relatórios / analytics

| ID | Título | Status |
|---|---|---|
| [E-B1](backlog-items/E-B1.md) | View `v_revenue_daily` (faturamento + ticket médio) | `pending` |
| [E-B2](backlog-items/E-B2.md) | View `v_lead_times` | `pending` |
| [E-B3](backlog-items/E-B3.md) | View `v_top_products` | `pending` |
| [E-B4](backlog-items/E-B4.md) | View `v_peak_hours` | `pending` |
| [E-B5](backlog-items/E-B5.md) | Dashboard de relatórios (owner-gated) | `pending` |
| [E-B6](backlog-items/E-B6.md) | Export CSV do dashboard | `pending` |
| [E-B7](backlog-items/E-B7.md) | Export PDF via `window.print()` | `pending` |

## Cycle Docs — Guias standalone

| ID | Título | Status |
|---|---|---|
| [Docs-B1](backlog-items/Docs-B1.md) | Replicação: novo projeto Supabase + env | `pending` |
| [Docs-B2](backlog-items/Docs-B2.md) | Replicação: schema + migrations + seed em ordem | `pending` |
| [Docs-B3](backlog-items/Docs-B3.md) | Replicação: deploy Vercel + 1º owner | `pending` |
| [Docs-B4](backlog-items/Docs-B4.md) | API spec: modelo de recursos + auth | `pending` |
| [Docs-B5](backlog-items/Docs-B5.md) | API spec: endpoints do ciclo de pedido | `pending` |
| [Docs-B6](backlog-items/Docs-B6.md) | API spec: webhooks para gateways de pagamento | `pending` |

---

## Status summary

- **Pending:** 29
- **In-progress:** 0
- **Done:** 22
- **Superseded:** 0
