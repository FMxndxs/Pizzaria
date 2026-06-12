# Glossário Canônico — Sistema de Gestão de Pedidos

> Todo agente deve ler este arquivo antes de iniciar qualquer B-item.
> Atualize aqui antes de introduzir termos novos no código.

---

## Pedido
**Definição:** Entidade central do sistema — uma linha em `orders` mais os seus `order_items`.
**Contexto:** Criado quando o cliente finaliza o checkout; percorre a máquina de estados até `delivered` ou `cancelled`.
**Relacionado:** Número do Pedido, Estado, Histórico de Status.

---

## Número do Pedido
**Definição:** Código curto amigável (ex.: `#A4F9`) para referência verbal e operacional, gerado no banco via sequence + base32 Crockford (mín. 4 chars, cresce naturalmente). Distinto do UUID.
**Contexto:** Aparece no painel admin, na mensagem ao cliente e nos tickets de impressão. Coluna `orders.order_code`.
**Relacionado:** Pedido.

---

## Estado / Status
**Definição:** Valor corrente do ciclo de vida do pedido, coluna `orders.status` do tipo `order_status`.
**Valores:** `pending → confirmed → preparing → ready → out_for_delivery → delivered` (delivery) ou `ready → delivered` (pickup); `cancelled` de qualquer não-terminal.
**Contexto:** Fonte única de labels/cores: `src/lib/orders/stateMachine.ts`.
**Relacionado:** Máquina de Estados, Histórico de Status, Tipo de Atendimento.

---

## Máquina de Estados
**Definição:** Conjunto de transições permitidas entre estados, validado pelas funções `canTransition(from, to, fulfillmentType)` e `nextStatuses(from, fulfillmentType)`.
**Contexto:** `src/lib/orders/stateMachine.ts` é a fonte única — o que está ali é lei; UI e Server Actions consultam as mesmas funções.
**Comum confundir com:** trigger de banco. No MVP a guarda é no service layer (TS), não em plpgsql.
**Relacionado:** Estado, Camada de Serviço.

---

## Histórico de Status
**Definição:** Sequência de linhas em `order_status_history`, cada uma com `(order_id, status, changed_at, changed_by)`, registrando cada transição.
**Contexto:** Populado por trigger `SECURITY DEFINER` no banco — toda mudança de `orders.status` é capturada automaticamente, sem depender do service layer. Base de dados para Lead Time.
**Relacionado:** Estado, Lead Time, ADR-003.

---

## Lead Time
**Definição:** Duração entre dois marcos de status de um mesmo pedido (ex.: `confirmed_at → ready_at`). Métrica de desempenho da cozinha.
**Contexto:** Calculado na view `v_lead_times` a partir de `order_status_history`. Disponível no painel do dono (Cycle E).
**Relacionado:** Histórico de Status, Relatórios.

---

## Tipo de Atendimento (`fulfillment_type`)
**Definição:** Coluna `orders.fulfillment_type` — `delivery` (pedido é entregue pelo motoboy) ou `pickup` (cliente retira no balcão).
**Contexto:** Ramifica a máquina de estados (`ready → out_for_delivery` só existe para delivery) e determina qual ticket é impresso.
**Relacionado:** Despacho, Retirada, Ticket Motoboy.

---

## KDS (Kitchen Display System)
**Definição:** Tela de cozinha em tempo real em `/cozinha`, mostrando a fila de pedidos em preparo.
**Contexto:** Autenticado com papel `kitchen`; usa Supabase Realtime para receber atualizações sem refresh. Pedidos saem da tela ao serem marcados `ready`.
**Relacionado:** Realtime, Papel (role).

---

## Despacho
**Definição:** Estágio de saída de um pedido delivery já pronto (`ready → out_for_delivery`). Ocorre na aba de expedição do painel.
**Contexto:** Operador clica "Despachar", seleciona/informa o courier, status muda para `out_for_delivery`.
**Relacionado:** Tipo de Atendimento, Ticket Motoboy, Retirada.

---

## Retirada (pickup)
**Definição:** Encerramento de um pedido em que o cliente retira no balcão (`ready → delivered`), sem leg de entrega.
**Contexto:** No estado `ready`, o operador clica "Marcar como retirado" — o pedido vai direto para `delivered` pulando `out_for_delivery`.
**Relacionado:** Tipo de Atendimento, Despacho.

---

## Ticket Cozinha
**Definição:** Comanda impressa destinada à cozinha, contendo: número do pedido, itens, quantidades, sabores e observações.
**Contexto:** Gerado por `window.print()` na rota `src/app/admin/pedidos/[id]/ticket-cozinha`. Sem endereço ou total.
**Relacionado:** Ticket Motoboy, Impressão.

---

## Ticket Motoboy
**Definição:** Comanda de entrega impressa para o motorista, contendo: número do pedido, nome do cliente, endereço completo, total e nome do courier.
**Contexto:** Gerado por `window.print()` em `src/app/admin/pedidos/[id]/ticket-entrega`. Só disponível para pedidos `delivery`.
**Relacionado:** Ticket Cozinha, Despacho.

---

## Provedor de Notificação
**Definição:** Abstração `NotificationProvider` (interface em `src/lib/notifications/provider.ts`) que desacopla o mecanismo de envio de mensagens ao cliente do resto do sistema.
**Contexto:** Implementação MVP: `WaLinkProvider` — monta link `wa.me` pré-preenchido ao `customer_phone`; operador clica para enviar. Pode ser trocado por Evolution API ou Meta oficial sem tocar no service layer.
**Implementation Note (não é ADR):** A abstração torna o trade-off de automação vs custo/risco reversível a qualquer momento.
**Relacionado:** WhatsApp, Camada de Serviço.

---

## Tenant / Deploy
**Definição:** Uma pizzaria = um deploy isolado, com banco Supabase próprio e variáveis de ambiente próprias. "Multi-tenant" não se aplica aqui.
**Contexto:** Escalar para outra pizzaria = copiar o deploy seguindo `guides/replication.md`. Decisão registrada em ADR-001.
**Relacionado:** ADR-001, Replicação.

---

## RBAC / Papel (role)
**Definição:** Coluna `profiles.role` com valores `owner | operator | kitchen`. Controla acesso a rotas e operações.
**owner:** acessa relatórios, configura sistema, vê tudo.
**operator:** confirma pedidos, despacha, opera o painel admin.
**kitchen:** acessa o KDS, avança status de preparo.
**Contexto:** Helpers SQL `is_admin()` (owner+operator), `is_owner()`, `is_staff()` (todos os três). Middleware em `src/middleware.ts`.
**Relacionado:** KDS, Relatórios.

---

## Camada de Serviço
**Definição:** Conjunto de funções puras de negócio em `src/lib/orders/service.ts`, sem acoplamento a Server Actions ou HTTP. Recebem `SupabaseClient` injetado.
**Contexto:** Server Actions do MVP chamam a camada de serviço. Uma futura rota REST chamará o mesmo código sem reescrita. Decisão registrada em ADR-002.
**Relacionado:** Server Action, ADR-002.

---

## Server Action
**Definição:** Ponto de entrada de mutação server-side do Next.js 16 (`'use server'`). No MVP é a única via de escrita — não há endpoints REST ativos.
**Contexto:** Localização: `src/app/actions/orders.ts`. São wrappers finos que delegam à Camada de Serviço, validam com Zod e chamam `revalidatePath`.
**Relacionado:** Camada de Serviço, ADR-002.

---

## Ticket Médio
**Definição:** Receita média por pedido em um período (`SUM(total) / COUNT(*)`). Métrica principal do dashboard do dono.
**Contexto:** Calculado na view `v_revenue_daily` e exibido no painel de relatórios (Cycle E).
**Relacionado:** Relatórios, Lead Time.
