# Docs-B4: API spec — modelo de recursos + auth

## Business Outcome
Um desenvolvedor externo sabe como autenticar e quais recursos estão disponíveis na API REST (quando construída), com exemplos de request/response.

## Scope
- Documenta em `guides/api-spec.md` (seções 1 e 2):
  - Autenticação: Bearer token (Supabase JWT), como obter via login, refresh de token.
  - Papéis e escopos: quais endpoints cada role pode chamar.
  - Modelo de recursos: `Order` (todos os campos), `OrderItem`, `OrderStatus`, `FulfillmentType`.
  - Formato de erro padrão: `{ error: { code, message, details? } }`.
  - Versionamento: `/api/v1/`.
- Garante que os tipos Zod de `src/lib/orders/schemas.ts` (A-B2) são referenciados como fonte de verdade dos payloads.

## Dependencies
- A-B2 (schemas Zod existem como fonte de verdade)
- 0-B10 (tipos do service layer estabilizados)

## Test Plan
### Manual
- Revisar que os tipos documentados correspondem exatamente aos schemas Zod em `src/lib/orders/schemas.ts`.

## Acceptance Criteria
- [ ] Seções de auth e modelo de recursos em `api-spec.md` completas.
- [ ] Tipos batem com os schemas Zod do código.
- [ ] Docs atualizados.

## Status
`pending`

## Known Drift
—

## Commits
- `red:` — · `green:` — · `blue:` — · `document:` —
