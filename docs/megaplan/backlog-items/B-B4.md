# B-B4: Subscription live no KDS

## Business Outcome
Novos pedidos e mudanças de status aparecem na tela da cozinha em tempo real, sem necessidade de refresh manual.

## Scope
- Adiciona ao `KitchenBoard.tsx` um `useEffect` com subscription Supabase Realtime:
  ```ts
  supabase.channel('kds-orders')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, handler)
    .subscribe()
  ```
- Handler: em evento `INSERT` ou `UPDATE`, re-fetch do pedido afetado e merge na lista local. Em `UPDATE` para status terminal (`delivered`/`cancelled`), remove da lista.
- Re-fetch da fila completa no evento `SUBSCRIBED` e ao reconectar (para corrigir inconsistências).
- Cleanup: `subscription.unsubscribe()` no cleanup do `useEffect`.
- **Não inclui:** as ações de avançar status (→ B-B5, B-B6).

## Dependencies
- B-B2 (`KitchenBoard` existe com dados iniciais)
- B-B3 (publication ativa)

## Test Plan
### Manual
- KDS aberto em tela; confirmar um pedido no painel admin → pedido aparece na lane "Confirmados" sem refresh.
- Avançar pedido para `preparing` no painel → pedido move para lane "Preparando" no KDS sem refresh.
- Marcar pedido como `ready` → desaparece do KDS.
- Desconectar e reconectar a internet → KDS re-sincroniza ao voltar online.

## Acceptance Criteria
- [ ] Novo pedido `confirmed` aparece no KDS em <2s.
- [ ] Pedido marcado `ready` some do KDS em <2s.
- [ ] Reconexão re-sincroniza a fila.
- [ ] Subscription limpa no unmount (sem leak).
- [ ] Docs atualizados.

## Implementation Notes
Usar o singleton `src/lib/supabase/browser.ts` para o client Realtime (autenticado via sessão de cookie). O kitchen deve estar logado — anon não tem acesso via RLS `is_staff()`.

Padrão de re-fetch no SUBSCRIBED: chamar `service.getKitchenQueue` via fetch interno ou action e substituir o estado local. Isso evita estado inconsistente após reconexão.

## Status
`done`

## Known Drift
Re-fetch no SUBSCRIBED usa `fetch('/api/kds/queue')` (route handler em src/app/api/kds/queue/route.ts). Alternativa seria Server Action, mas fetch é mais simples aqui dado que é um GET sem mutação.

## Commits
- `red:` 6357268 · `green:` dac8428 · `blue:` e1836fa · `document:` (este commit)
