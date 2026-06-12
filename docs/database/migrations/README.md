# Migrations — Guia de Aplicação

Cada migration é um arquivo SQL numerado em `docs/database/migrations/`. Todas são **aditivas e idempotentes** (usam `IF NOT EXISTS`, `CREATE OR REPLACE`, etc.). Aplique no SQL Editor do Supabase **em ordem crescente**, uma por vez.

## Convenção de nomes

```
NNN_descricao_curta.sql
```

- `NNN` começa em `001` e cresce sequencialmente.
- O nome descreve o que a migration faz, não o Cycle/B-item.
- Após aplicar ao banco de produção, atualize `docs/database/schema.sql` para refletir o estado final.

## Ordem de aplicação

| Arquivo | O que faz | Dependências |
|---|---|---|
| `001_fix_guest_checkout_grants.sql` | Grants para checkout guest | — |
| `002_orders_extend.sql` | `ready` no enum, `order_code`, `fulfillment_type`, `updated_at` | 001 |
| `003_order_status_history.sql` | Tabela + triggers de histórico de status | 002 |
| `004_profiles_role.sql` | Enum `user_role`, coluna `profiles.role`, helpers SQL | — |

## ⚠️ Atenção especial: 002_orders_extend.sql

Este arquivo contém um `ALTER TYPE ... ADD VALUE` que **precisa ser executado isolado**, em uma transação separada, antes do restante.

**Motivo:** O PostgreSQL não permite usar um valor de enum recém-adicionado na mesma transação que o criou. Isso afeta versões do PG antes da 16.

**Como aplicar:**

1. Copie e execute **somente** esta linha:
   ```sql
   ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'ready' AFTER 'preparing';
   ```
2. Aguarde o SQL Editor confirmar o sucesso.
3. Execute o restante do `002_orders_extend.sql`.

## Como adicionar uma nova migration

1. Crie `docs/database/migrations/NNN_descricao.sql`.
2. Escreva SQL idempotente (`IF NOT EXISTS`, `CREATE OR REPLACE`, etc.).
3. Atualize esta tabela acima.
4. Aplique no banco e atualize `docs/database/schema.sql`.
5. Faça commit com a mensagem: `sql: NNN — descrição breve`.

## Revertendo

Migrations **não têm `DOWN` script**. Para reverter:

- Escreva uma nova migration que desfaz a mudança.
- Documente o motivo no commit.
