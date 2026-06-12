# ADR-002 — Server Actions sobre REST no MVP

**Data:** 2026-06-12
**Status:** Aceito
**Autores:** Felipe Mendes

---

## Contexto

O objetivo declarado do sistema inclui "API consumível por outros sites" (documentado em `docs/ideia-plataforma-gestao.md` e no alinhamento de escopo). Isso aponta naturalmente para construir uma API REST desde o início.

No entanto, o projeto usa Next.js 16 com Server Actions — uma primitiva de mutação server-side ergonômica e sem boilerplate de rotas HTTP. Construir REST agora significa:
- Criar route handlers para cada operação.
- Gerenciar autenticação via Bearer token (além da sessão de cookie existente).
- Mais código para validar, documentar e manter.

A questão central: construir a REST agora ou usar Server Actions no MVP e deixar o caminho REST documentado?

## Decisão

**Server Actions no MVP. A API REST é somente especificada** (documentada em `guides/api-spec.md`), não construída. A condição que torna isso seguro é: **toda lógica de negócio vive na Camada de Serviço** (`src/lib/orders/service.ts`), cujas funções recebem um `SupabaseClient` injetado. Quando a REST for construída, os route handlers chamarão exatamente a mesma camada sem reescrita.

```
Server Action → injeta client → service.createOrder(client, input)
REST handler  → injeta client → service.createOrder(client, input)  ← mesmo código
```

## Alternativas consideradas

| Alternativa | Por que rejeitada |
|---|---|
| **REST agora** | Mais código de boilerplate sem retorno imediato; nenhum cliente externo precisa consumir a API no MVP |
| **Server Actions + REST híbrido** | Adiciona complexidade sem benefício enquanto só o painel admin consome as mutações |
| **Manter client-side (como hoje)** | Impossível: side-effects (histórico, notificação) devem rodar server-side; sem camada server não há seam para REST futura |

## Consequências

**Positivas:**
- Menos código no MVP.
- Server Actions têm tipagem full-stack (TypeScript end-to-end sem contrato HTTP manual).
- A camada de serviço com client injetado é o investimento que protege a decisão.

**Negativas / Trade-offs:**
- Nenhum site externo pode consumir o sistema enquanto a REST não for construída.
- A spec `guides/api-spec.md` deve ser mantida em sincronia com o service layer a cada Cycle.

## Quando revisar

Quando surgir o primeiro cliente externo que precise consumir a API, ou quando a CLI / app mobile for planejada. Nesse momento: criar os route handlers apontando para `service.*` — sem reescrita de lógica.
