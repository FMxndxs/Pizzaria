<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:megaplan-rules -->
# Megaplan — metodologia de desenvolvimento

Este projeto usa a metodologia [megaplan v2](https://github.com/Gamebreack/megaplan). **Todo agente deve ler esta seção antes de qualquer ação.**

## Workflow obrigatório por B-item

```
document(pre) → red → green → blue → document(post) → COMPLETE
```

- **document(pre):** atualizar glossário e ADRs. Nenhum código antes.
- **red:** testes falhando descrevendo o comportamento. Usar agente `test-author`.
- **green:** código mínimo para passar os testes.
- **blue:** refatorar sem adicionar features ou quebrar testes.
- **document(post):** atualizar docs com o que foi *construído* (não planejado).
- **COMPLETE:** dual-update de `backlog.md` + arquivo de detalhe no mesmo commit.

**Regra inviolável:** nunca escrever código de produção sem um commit `red:` anterior na branch.

## Onde tudo está

| Arquivo | Conteúdo |
|---|---|
| `docs/megaplan/megaplan.md` | Visão do projeto + índice de cycles |
| `docs/megaplan/backlog.md` | Índice global de B-items com status |
| `docs/megaplan/glossary.md` | Vocabulário canônico — ler antes de qualquer B-item |
| `docs/megaplan/adr/` | Architecture Decision Records |
| `docs/megaplan/backlog-items/<ID>.md` | Escopo, test plan e critérios de cada B-item |
| `docs/megaplan/guides/` | Replicação e API spec |

## Convenção de commits

```
red: <ID> — descrição
green: <ID> — descrição
blue: <ID> — descrição
document: <ID> — descrição
```

## Subagentes disponíveis (`.claude/agents/`)

- `supabase-schema` — SQL, migrations, RLS, views
- `server-actions` — service layer, Server Actions, Zod
- `realtime-kds` — `/cozinha`, Supabase Realtime
- `print-ticket` — componentes de ticket, CSS @media print
- `reports-analytics` — dashboard, CSV, PDF
- `test-author` — fase red (só escreve testes)
- `megaplan-docs` — backlog, glossário, ADRs, guias (só escreve docs)
<!-- END:megaplan-rules -->
