# Docs-B1: Replicação — novo projeto Supabase + env

## Business Outcome
Um desenvolvedor consegue criar do zero o ambiente Supabase e configurar as variáveis de ambiente para um novo cliente, seguindo um checklist sem ambiguidade.

## Scope
- Documenta em `guides/replication.md` (seções 1 e 2):
  - Como criar novo projeto Supabase (nome, região, senha).
  - Quais variáveis de ambiente copiar (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, etc.).
  - Como criar o arquivo `.env.local` para desenvolvimento.
  - Como configurar as env vars na Vercel.
- **Não inclui:** a aplicação do schema (→ Docs-B2).

## Dependencies
- 0-B13 (convenção de migrations documentada)

## Test Plan
### Manual
- Seguir o checklist em um projeto Supabase limpo → projeto criado, `.env.local` configurado, `supabase.auth.getUser()` retorna resposta válida.

## Acceptance Criteria
- [ ] Checklist cobre criação do projeto Supabase e todas as env vars.
- [ ] Checklist testado em um projeto limpo.
- [ ] `guides/replication.md` seções 1 e 2 preenchidas.
- [ ] Docs atualizados.

## Status
`pending`

## Known Drift
—

## Commits
- `red:` — · `green:` — · `blue:` — · `document:` —
