# ADR-003 — Tabela `order_status_history`

**Data:** 2026-06-12
**Status:** Aceito
**Autores:** Felipe Mendes

---

## Contexto

O sistema de relatórios (Cycle E) inclui métricas de Lead Time (tempo entre `confirmed` e `ready`, por exemplo). Essas métricas exigem o timestamp de cada transição de status — informação que, se não capturada desde o início, é **irrecuperável retroativamente**.

Três abordagens foram comparadas:
1. Coluna `updated_at` em `orders` — só guarda o momento da última mudança; sem histórico.
2. Colunas de timestamp por etapa (`confirmed_at`, `ready_at`, `dispatched_at`, `delivered_at`) — simples, mas rígido para novos estados.
3. Tabela dedicada `order_status_history` — uma linha por transição, com `status`, `changed_at`, `changed_by`.

Adicionalmente: **onde capturar?** Service layer (código TS) vs trigger de banco.

## Decisão

**Tabela `order_status_history` populada por trigger `SECURITY DEFINER` no banco.**

Estrutura:
```sql
order_status_history (
  id          uuid PK DEFAULT uuid_generate_v4(),
  order_id    uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status      order_status NOT NULL,
  changed_at  timestamptz NOT NULL DEFAULT now(),
  changed_by  uuid NULL REFERENCES auth.users(id) ON DELETE SET NULL
)
```

Dois triggers:
- `AFTER INSERT ON orders` → grava o status inicial `pending`.
- `AFTER UPDATE ON orders WHEN (OLD.status IS DISTINCT FROM NEW.status)` → grava o novo status.

Ambos como `SECURITY DEFINER`, capturando `auth.uid()` (null para contextos anon/system).

## Alternativas consideradas

| Alternativa | Por que rejeitada |
|---|---|
| **Só `updated_at`** | Sem histórico por transição; Lead Time impossível |
| **Colunas de timestamp por etapa** | Rígido: qualquer novo estado exige `ALTER TABLE`; consultas de lead-time ficam simples mas a estrutura não evolui bem |
| **Captura no service layer (não trigger)** | Burla a auditoria: uma mudança direta via SQL, futura REST ou outra rota não seria registrada; o trigger é à prova de bypass |

## Consequências

**Positivas:**
- Auditoria completa de cada transição, independente de qual camada faz a mudança.
- Lead Time calculável com precisão de milissegundos.
- Permite análise de padrões históricos (quantos pedidos atrasaram em quê etapa).
- Views de Cycle E (`v_lead_times`) dependem diretamente dessa tabela.

**Negativas / Trade-offs:**
- Leve overhead de escrita a cada mudança de status (uma INSERT adicional).
- Complexidade de um trigger a mais para manter.
- `changed_by` é `null` quando a mudança vem de um contexto sem `auth.uid()` (ex.: serviço futuro com service-role key). Documentado como limitação aceitável no MVP.

## Quando revisar

Se `changed_by` nulo se tornar um problema de auditoria: implementar o padrão de GUC transaction-local (`set_config('app.actor', ...)`) para que chamadas sem `auth.uid()` passem o ator explicitamente.
