# Docs-B3: Replicação — deploy Vercel + 1º owner

## Business Outcome
Um desenvolvedor coloca o sistema em produção na Vercel e cria o primeiro usuário owner, completando o deploy de um novo cliente.

## Scope
- Documenta em `guides/replication.md` (seções 5, 6 e 7):
  - Como fazer deploy na Vercel (import do repositório, env vars, domínio).
  - Como criar o primeiro usuário no Supabase Authentication.
  - Como setar `profiles.role = 'owner'` manualmente via SQL Editor (primeiro owner).
  - Checklist de smoke-test pós-deploy: login, criar pedido, confirmar, KDS, relatório.

## Dependencies
- Docs-B2

## Test Plan
### Manual
- Seguir o guia completo (Docs-B1 + B2 + B3) em um repositório fork → deploy funcional com owner logado e pedido criado.

## Acceptance Criteria
- [ ] Guia cobre deploy Vercel, criação de owner, e smoke-test completo.
- [ ] Smoke-test testado em um deploy real.
- [ ] `guides/replication.md` completo (todas as seções preenchidas).
- [ ] Docs atualizados.

## Status
`pending`

## Known Drift
—

## Commits
- `red:` — · `green:` — · `blue:` — · `document:` —
