# Docs-B2: Replicação — schema + migrations + seed em ordem

## Business Outcome
Um desenvolvedor aplica o schema completo e os seeds de catálogo em um banco limpo, resultando em um banco idêntico ao do projeto original.

## Scope
- Documenta em `guides/replication.md` (seções 3 e 4):
  - Ordem exata de aplicação das migrations (001 → 007).
  - Alerta para o statement isolado de `ADD VALUE 'ready'` (ref. `docs/database/migrations/README.md`).
  - Como aplicar os seeds (`docs/database/seed/001_formats.sql`, `002_flavors.sql`).
  - Verificação pós-aplicação: queries de smoke-test para confirmar estrutura.

## Dependencies
- Docs-B1
- 0-B13 (README de migrations existe)
- Todos os B-items de Cycle 0 que geram arquivos de migration

## Test Plan
### Manual
- Seguir o guia em banco limpo → todas as tabelas, enums, triggers e views criados corretamente.
- Queries de smoke-test no guia retornam resultados esperados.

## Acceptance Criteria
- [ ] Guia cobre todas as migrations em ordem.
- [ ] Queries de smoke-test incluídas e funcionais.
- [ ] Testado em banco limpo.
- [ ] Docs atualizados.

## Status
`pending`

## Known Drift
—

## Commits
- `red:` — · `green:` — · `blue:` — · `document:` —
