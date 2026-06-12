# B-B3: Publication Realtime em `orders`

## Business Outcome
Mudanças na tabela `orders` são transmitidas pelo Supabase Realtime para clientes conectados, habilitando o KDS receber atualizações sem refresh.

## Scope
- Cria `docs/database/migrations/006_realtime.sql`:
  ```sql
  ALTER PUBLICATION supabase_realtime ADD TABLE orders;
  ```
- Documenta no README de migrations (0-B13) que esta migration é aplicada no SQL Editor.
- Documenta o passo de verificação no dashboard Supabase: Database → Replication → confirmar que `orders` está na publicação e que RLS for Realtime está habilitado.
- Atualiza `schema.sql`.
- **Não inclui:** o código de subscription do cliente (→ B-B4).

## Dependencies
- Nenhuma (infra pura, independente dos B-items de Cycle 0).

## Test Plan
### Manual
- No SQL Editor: `SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'orders'` → retorna uma linha.
- Dashboard Supabase: Realtime → Orders aparece como publicada.

## Acceptance Criteria
- [ ] `orders` está na publicação `supabase_realtime`.
- [ ] RLS for Realtime habilitado (dashboard checkbox).
- [ ] `schema.sql` e README de migrations atualizados.
- [ ] Docs atualizados.

## Implementation Notes
O Supabase habilita RLS for Realtime por padrão em projetos novos. Verificar no dashboard: Authentication → Policies → "Realtime" ou Database → Replication → enable RLS. Se já estiver habilitado, só confirmar. Se não, ativar.

Com RLS ativa no Realtime, apenas os eventos que o cliente autenticado pode ler via SELECT são transmitidos — kitchen vê só os pedidos permitidos pela policy `is_staff()` (0-B9).

## Status
`done`

## Known Drift
Migration 006_realtime.sql criada — ainda precisa ser aplicada manualmente no SQL Editor do Supabase antes que o Realtime funcione em produção.

## Commits
- `red:` 6357268 · `green:` dac8428 · `blue:` e1836fa · `document:` (este commit)
