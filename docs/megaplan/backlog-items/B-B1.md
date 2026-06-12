# B-B1: Login kitchen + gate `/cozinha`

## Business Outcome
Apenas usuários com papel `kitchen` (ou superior) conseguem acessar a rota `/cozinha`; tentativas sem autenticação adequada são redirecionadas.

## Scope
- Atualiza `src/middleware.ts`: adiciona matcher `/cozinha/:path*` → verificar `profiles.role IN ('owner','operator','kitchen')`; redirecionar para `/admin/login` se não autenticado ou sem papel.
- Atualiza `src/app/admin/(dashboard)/layout.tsx` (ou cria layout em `/cozinha`): gate server-side por `is_staff()`.
- **Não inclui:** o conteúdo da página KDS (→ B-B2).

## Dependencies
- 0-B9 (helper `is_staff()` no banco; `profiles.role` existe)

## Test Plan
### Manual
- Acessar `/cozinha` sem login → redireciona para `/admin/login`.
- Logar como `owner` → acessa `/cozinha`.
- Logar como `operator` → acessa `/cozinha`.
- Logar como `kitchen` → acessa `/cozinha`.
- Usuário sem `profiles.role` (improvável) → redireciona.

## Acceptance Criteria
- [ ] `/cozinha` retorna 302 para não autenticado.
- [ ] Os três papéis acessam `/cozinha` após login.
- [ ] Middleware matcher inclui `/cozinha/:path*`.
- [ ] Docs atualizados.

## Implementation Notes
O middleware atual (`src/middleware.ts`) verifica `profiles.is_admin`. Para `/cozinha`, a verificação deve usar `is_staff()` (que inclui `kitchen`). Atenção: esta é uma **extensão** do middleware, não substituição — o gate `/admin/:path*` continua usando `is_admin()`.

Nota: o Next 16 renomeou "Middleware" para "Proxy" na documentação (`node_modules/next/dist/docs/16-proxy.md`), mas o arquivo `middleware.ts` ainda funciona na versão 16.2.4. Manter o nome de arquivo atual.

## Status
`done`

## Known Drift
Gate implementado em dois lugares: middleware.ts (redirect 302 para não autenticados) + src/app/cozinha/layout.tsx (redirect server-side para role incorreto). A dupla verificação é redundante mas segura — o middleware cobre o caso de sessão expirada sem round-trip ao layout.

## Commits
- `red:` 6357268 · `green:` dac8428 · `blue:` e1836fa · `document:` (este commit)
