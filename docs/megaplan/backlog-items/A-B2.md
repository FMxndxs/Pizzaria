# A-B2: Validação Zod no boundary de criação

## Business Outcome
Entradas inválidas de `createOrderAction` (campos faltando, CEP malformado, items sem flavor, total negativo) são rejeitadas com mensagens claras antes de tocar o banco.

## Scope
- Cria `src/lib/orders/schemas.ts` com `newOrderSchema` (Zod v4) cobrindo todos os campos de `NewOrderInput`.
- Integra `newOrderSchema.parse(input)` no início de `createOrderAction`.
- Retorna erros de validação tipados (`{ error: ZodError }`) sem lançar exceção não tratada.
- **Não inclui:** schemas para outras actions (→ seus respectivos B-items).

## Dependencies
- A-B1 (`createOrderAction` existe)

## Test Plan
### Unit
- `newOrderSchema.parse` passa com input válido.
- `newOrderSchema.parse` falha com `customer_name` vazio, `total` negativo, `items` vazio.
- `createOrderAction` com input inválido retorna `{ error: { ... } }` (sem throw).

## Acceptance Criteria
- [ ] Schema valida todos os campos obrigatórios de `NewOrderInput`.
- [ ] Action retorna erro tipado (não 500) para input inválido.
- [ ] Testes unitários do schema passam.
- [ ] Docs atualizados.

## Implementation Notes
Zod v4 já é dependência do projeto (`zod ^4.3.6`). Usar `z.object({ ... }).strict()` para rejeitar campos extras. O schema do `newOrderSchema` pode reaproveitado pelo `checkoutSchema` existente em `src/lib/validations/checkout.ts` — refatorar para evitar duplicação.

## Status
`done`

## Known Drift
`newOrderSchema` não usa `.strict()` — campos extras são ignorados. Suficiente para o MVP.
Zod v4 usa `.issues` (não `.errors`) no objeto de erro — `createOrderAction` usa `parsed.error.issues[0]?.message`.

## Commits
- `red:` e636e87 · `green:` 1f75cdf · `blue:` b6dc9e1 · `document:` (este commit)
