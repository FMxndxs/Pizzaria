# Sistema de Gestão de Pedidos — Forno & Lenha

> Metodologia: [megaplan v2](https://github.com/Gamebreack/megaplan)
> Status: Cycle 0 — em andamento
> Última atualização: 2026-06-12

## Visão

Construir, sobre o site da pizzaria Forno & Lenha (Next.js 16 + Supabase), uma **plataforma de gestão de pedidos** que cubra o ciclo completo: recebimento pelo WhatsApp → confirmação do operador → cozinha em tempo real → despacho → relatórios do dono. O sistema é implementado para um único tenant (deploy isolado), documentado de forma que possa ser replicado em outros estabelecimentos e exposto via API REST futura sem reescrita de lógica.

**Usuários-alvo:** operador de atendimento, cozinheiro, dono/gerente da pizzaria e, indiretamente, o cliente final (recebe notificação via WhatsApp).

**Critérios de sucesso:**
- Zero pedidos perdidos por falha de persistência (hoje o DB write é best-effort).
- Cozinha vê pedidos em tempo real sem dar refresh.
- Dono acessa relatórios de faturamento, ticket médio e mais vendidos com filtro de período.
- Um novo deploy para outra pizzaria pode ser feito seguindo `guides/replication.md`.

---

## Índice de Cycles

| Cycle | Nome | Status |
|---|---|---|
| [0](#cycle-0--fundação) | Fundação | `pending` |
| [A](#cycle-a--ciclo-de-pedido--confirmação--whatsapp) | Ciclo de pedido + confirmação + WhatsApp | `pending` |
| [B](#cycle-b--kds-realtime) | KDS realtime | `pending` |
| [C](#cycle-c--despachoentregar) | Despacho / entrega | `pending` |
| [D](#cycle-d--impressão-de-tickets) | Impressão de tickets | `pending` |
| [E](#cycle-e--relatóriosanalytics) | Relatórios / analytics | `pending` |
| [Docs](#cycle-docs--guias-standalone) | Guias standalone | `pending` |

---

## Cycle 0 — Fundação

> Substrato. Nenhum behavior visível ao usuário; gateia todos os cycles seguintes.

| B-Item | Título | Status |
|---|---|---|
| [0-B1](backlog-items/0-B1.md) | Adiciona `ready` ao enum `order_status` | `pending` |
| [0-B2](backlog-items/0-B2.md) | Fonte única de metadata de status (TS) | `pending` |
| [0-B3](backlog-items/0-B3.md) | Tabela `order_status_history` + RLS | `pending` |
| [0-B4](backlog-items/0-B4.md) | Trigger de histórico de status | `pending` |
| [0-B5](backlog-items/0-B5.md) | Coluna + gerador de número de pedido | `pending` |
| [0-B6](backlog-items/0-B6.md) | Backfill + unicidade do número | `pending` |
| [0-B7](backlog-items/0-B7.md) | Coluna `fulfillment_type` em `orders` | `pending` |
| [0-B8](backlog-items/0-B8.md) | Coluna `profiles.role` + backfill | `pending` |
| [0-B9](backlog-items/0-B9.md) | Helpers SQL de role + policies atualizadas | `pending` |
| [0-B10](backlog-items/0-B10.md) | Esqueleto da camada de serviço | `pending` |
| [0-B11](backlog-items/0-B11.md) | Validador de transição de status | `pending` |
| [0-B12](backlog-items/0-B12.md) | `NotificationProvider` + `WaLinkProvider` | `pending` |
| [0-B13](backlog-items/0-B13.md) | Convenção e README de migrations | `pending` |

---

## Cycle A — Ciclo de pedido + confirmação + WhatsApp

> Primeiro valor real: pedidos atômicos e confiáveis, confirmação pelo admin, notificação ao cliente.

| B-Item | Título | Status |
|---|---|---|
| [A-B1](backlog-items/A-B1.md) | Server Action `createOrder` atômica | `pending` |
| [A-B2](backlog-items/A-B2.md) | Validação Zod no boundary de criação | `pending` |
| [A-B3](backlog-items/A-B3.md) | Migra `carrinho/page.tsx` para Server Action | `pending` |
| [A-B4](backlog-items/A-B4.md) | Server Action `confirmOrder` | `pending` |
| [A-B5](backlog-items/A-B5.md) | Server Action `advanceOrderStatus` guarded | `pending` |
| [A-B6](backlog-items/A-B6.md) | `OrderStatusSelect` consume `advanceOrderStatus` | `pending` |
| [A-B7](backlog-items/A-B7.md) | Server Action `cancelOrder` | `pending` |
| [A-B8](backlog-items/A-B8.md) | Link WhatsApp de confirmação ao cliente | `pending` |
| [A-B9](backlog-items/A-B9.md) | `order_code` visível no painel admin | `pending` |

---

## Cycle B — KDS realtime

> Cozinha recebe e avança pedidos em tempo real.

| B-Item | Título | Status |
|---|---|---|
| [B-B1](backlog-items/B-B1.md) | Login kitchen + gate `/cozinha` | `pending` |
| [B-B2](backlog-items/B-B2.md) | Shell da rota `/cozinha` + fetch inicial da fila | `pending` |
| [B-B3](backlog-items/B-B3.md) | Publication Realtime em `orders` | `pending` |
| [B-B4](backlog-items/B-B4.md) | Subscription live no KDS | `pending` |
| [B-B5](backlog-items/B-B5.md) | Ação "Iniciar preparo" no KDS | `pending` |
| [B-B6](backlog-items/B-B6.md) | Ação "Marcar pronto" no KDS | `pending` |
| [B-B7](backlog-items/B-B7.md) | Badge de tempo decorrido por pedido | `pending` |

---

## Cycle C — Despacho / entrega

> Pedidos prontos saem para delivery ou são retirados no balcão.

| B-Item | Título | Status |
|---|---|---|
| [C-B1](backlog-items/C-B1.md) | View de despacho filtrada por `fulfillment_type` | `pending` |
| [C-B2](backlog-items/C-B2.md) | Server Action `dispatchDelivery` | `pending` |
| [C-B3](backlog-items/C-B3.md) | Server Action `markPickedUp` (retirada) | `pending` |
| [C-B4](backlog-items/C-B4.md) | Server Action `markDelivered` | `pending` |
| [C-B5](backlog-items/C-B5.md) | Captura `courier_name` no despacho | `pending` |

---

## Cycle D — Impressão de tickets

> Operador imprime comanda da cozinha e ticket do motoboy com um clique.

| B-Item | Título | Status |
|---|---|---|
| [D-B1](backlog-items/D-B1.md) | Componente de ticket da cozinha | `pending` |
| [D-B2](backlog-items/D-B2.md) | CSS `@media print` isolando o ticket | `pending` |
| [D-B3](backlog-items/D-B3.md) | Componente de ticket do motoboy | `pending` |
| [D-B4](backlog-items/D-B4.md) | Botões de print no card admin + KDS | `pending` |

---

## Cycle E — Relatórios / analytics

> Dono acompanha faturamento, ticket médio, mais vendidos e picos horários.

| B-Item | Título | Status |
|---|---|---|
| [E-B1](backlog-items/E-B1.md) | View `v_revenue_daily` (faturamento + ticket médio) | `pending` |
| [E-B2](backlog-items/E-B2.md) | View `v_lead_times` | `pending` |
| [E-B3](backlog-items/E-B3.md) | View `v_top_products` | `pending` |
| [E-B4](backlog-items/E-B4.md) | View `v_peak_hours` | `pending` |
| [E-B5](backlog-items/E-B5.md) | Dashboard de relatórios (owner-gated) | `pending` |
| [E-B6](backlog-items/E-B6.md) | Export CSV do dashboard | `pending` |
| [E-B7](backlog-items/E-B7.md) | Export PDF via `window.print()` | `pending` |

---

## Cycle Docs — Guias standalone

> Documentação que sobrevive ao projeto: replicação + especificação da API REST.

| B-Item | Título | Status |
|---|---|---|
| [Docs-B1](backlog-items/Docs-B1.md) | Replicação: novo projeto Supabase + env | `pending` |
| [Docs-B2](backlog-items/Docs-B2.md) | Replicação: schema + migrations + seed em ordem | `pending` |
| [Docs-B3](backlog-items/Docs-B3.md) | Replicação: deploy Vercel + 1º owner | `pending` |
| [Docs-B4](backlog-items/Docs-B4.md) | API spec: modelo de recursos + auth | `pending` |
| [Docs-B5](backlog-items/Docs-B5.md) | API spec: endpoints do ciclo de pedido | `pending` |
| [Docs-B6](backlog-items/Docs-B6.md) | API spec: webhooks para gateways de pagamento | `pending` |

---

## Documentos de suporte

- [Backlog global](backlog.md)
- [Glossário](glossary.md)
- [ADR-001 Single-tenant por deploy](adr/ADR-001-single-tenant-per-deploy.md)
- [ADR-002 Server Actions sobre REST no MVP](adr/ADR-002-server-actions-over-rest-for-mvp.md)
- [ADR-003 Tabela order_status_history](adr/ADR-003-order-status-history-table.md)
- [Guia de replicação](guides/replication.md)
- [Especificação da API REST](guides/api-spec.md)
