# ADR-001 — Single-tenant por deploy

**Data:** 2026-06-12
**Status:** Aceito
**Autores:** Felipe Mendes

---

## Contexto

O documento de ideia (`docs/ideia-plataforma-gestao.md`) assumia explicitamente "multi-tenancy desde o dia 1" como decisão arquitetural irreversível. No alinhamento de escopo (2026-06-12), discutiu-se se o sistema deveria ser construído como SaaS multi-tenant (um banco serve N pizzarias) ou como produto single-tenant replicável (cada pizzaria = deploy próprio).

Multi-tenancy real exigiria `tenant_id` em toda tabela — `orders`, `order_items`, `flavors`, `formats`, `settings`, `profiles` — com toda query filtrada por esse campo e RLS por tenant. Isso impacta cada B-item de todos os Cycles.

## Decisão

**Single-tenant por deploy.** Cada pizzaria é um deploy isolado com banco Supabase próprio, variáveis de ambiente próprias e domínio próprio. Escalar para um novo cliente = copiar o deploy seguindo `guides/replication.md`.

## Alternativas consideradas

| Alternativa | Por que rejeitada |
|---|---|
| **Multi-tenant real** | Encarece e arrisca cada B-item; schema sem `tenant_id` é muito mais simples; o projeto é validado em um único cliente antes de qualquer generalização |
| **Single-tenant + `tenant_id` no schema (default fixo)** | "Meio-termo" que não entrega isolamento real e adiciona complexidade sem retorno agora |

## Consequências

**Positivas:**
- Schema limpo — sem `tenant_id` em nenhuma tabela.
- Toda query é simples — sem filtro por tenant.
- Isolamento total de dados entre clientes.
- Custo por B-item menor durante o desenvolvimento.

**Negativas / Trade-offs:**
- Operar N clientes = N deploys = N instâncias Supabase e Vercel.
- Migração para multi-tenant no futuro exigiria reescrita completa do schema.
- Sem economia de escala de infraestrutura ao crescer.

## Quando revisar

Quando o número de clientes tornar a gestão de deploys inviável (estimativa: >10 clientes ativos) ou quando surgir necessidade de dashboards cross-tenant (analytics de toda a rede). Nesse momento, a documentação `guides/replication.md` serve como ponto de partida para o design multi-tenant.
