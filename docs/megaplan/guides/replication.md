# Guia de Replicação — Sistema de Gestão de Pedidos

> Este guia cobre como copiar o sistema para um novo estabelecimento (nova pizzaria), do zero até um deploy funcional.

**Pré-requisitos:** conta Supabase, conta Vercel (ou outro host Next.js), número de WhatsApp do estabelecimento.

**Tempo estimado:** 30–60 minutos.

---

## 1. Criar novo projeto Supabase

1. Acesse [supabase.com](https://supabase.com) e clique em **New project**.
2. Preencha:
   - **Name:** nome do estabelecimento (ex.: `forno-e-lenha-sp`)
   - **Database Password:** gere uma senha forte e guarde (precisará depois para migrations)
   - **Region:** escolha a região mais próxima dos clientes
3. Aguarde o projeto ser criado (~1 min).
4. No painel do projeto, vá em **Settings → API** e copie:
   - `Project URL` → será `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → será `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → será `SUPABASE_SERVICE_ROLE_KEY` (nunca expor no frontend)

---

## 2. Configurar variáveis de ambiente

### `.env.local` (desenvolvimento)

Crie o arquivo na raiz do projeto com as seguintes variáveis:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://<seu-projeto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>

# WhatsApp do estabelecimento (somente dígitos: DDI + DDD + número)
NEXT_PUBLIC_WHATSAPP_NUMBER=5511999990000

# Frete (configuração padrão — pode ser ajustada no painel)
NEXT_PUBLIC_FREIGHT_PER_KM=3
NEXT_PUBLIC_DELIVERY_RADIUS_KM=5
NEXT_PUBLIC_HQ_CEP=01310100
```

### Variáveis na Vercel

No painel Vercel do projeto:
1. Vá em **Settings → Environment Variables**.
2. Adicione cada variável acima para os ambientes **Production**, **Preview** e **Development**.
3. Variáveis com prefixo `NEXT_PUBLIC_` são expostas ao browser — não inclua segredos nelas.

---

## 3. Aplicar schema + migrations em ordem

As migrations ficam em `docs/database/migrations/`. Devem ser aplicadas **em ordem numérica** no SQL Editor do Supabase (**SQL Editor → New query**).

### Ordem obrigatória

| Arquivo | Conteúdo | Instruções especiais |
|---|---|---|
| `schema.sql` | Tabelas base, RLS inicial, grants | Executar inteiro de uma vez |
| `001_fix_guest_checkout_grants.sql` | Grants para checkout anônimo | Executar inteiro |
| `002_orders_extend.sql` | `order_status`, `order_code`, `fulfillment_type` | **⚠️ Executar em 2 etapas** — ver comentários no arquivo |
| `003_order_status_history.sql` | Tabela de histórico + triggers | Executar inteiro |
| `004_profiles_role.sql` | `user_role` enum + helpers RBAC | Executar inteiro |
| `005_reports_views.sql` | Funções de relatório owner-only | Executar inteiro |
| `006_realtime.sql` | Publication do Realtime para `orders` | Executar inteiro |

> **Atenção — 002 em 2 etapas:** o arquivo `002_orders_extend.sql` começa com `ALTER TYPE ... ADD VALUE IF NOT EXISTS 'ready'`. Execute **apenas essa linha** primeiro, aguarde a confirmação, e então execute o restante do arquivo. O PostgreSQL não permite usar um enum novo na mesma transação em que foi adicionado.

### Verificação pós-aplicação

No SQL Editor, execute:
```sql
SELECT id, order_code, status FROM orders LIMIT 5;
SELECT * FROM profiles LIMIT 5;
SELECT routine_name FROM information_schema.routines
  WHERE routine_schema = 'public' AND routine_type = 'FUNCTION';
```
Deve retornar sem erro.

---

## 4. Executar seeds do catálogo

O catálogo (sabores e formatos) é gerenciado pelo painel admin em `/admin/sabores`. Para uma instalação nova, as tabelas `flavors`, `flavor_prices`, `flavor_images` e `formats` começam vazias.

### Opção A — Via painel admin (recomendada)

1. Faça login como owner.
2. Acesse `/admin/sabores`.
3. Cadastre os formatos disponíveis (ex.: Pizza Grande, Pizza Broto, Calzone).
4. Cadastre os sabores com preços por formato.

### Opção B — Via SQL (bulk)

Se tiver um banco de dados de referência, exporte via:
```sql
COPY (SELECT * FROM flavors)        TO '/tmp/flavors.csv'        CSV HEADER;
COPY (SELECT * FROM flavor_prices)  TO '/tmp/flavor_prices.csv'  CSV HEADER;
COPY (SELECT * FROM formats)        TO '/tmp/formats.csv'         CSV HEADER;
```
E importe no novo projeto via **Table Editor → Import from CSV**.

---

## 5. Deploy na Vercel

1. Faça fork ou clone do repositório para sua conta GitHub.
2. Acesse [vercel.com](https://vercel.com) e clique em **New Project**.
3. Importe o repositório.
4. Confirme que o framework detectado é **Next.js**.
5. Adicione as variáveis de ambiente (passo 2).
6. Clique em **Deploy**.

### Configurações extras

- **Build command:** `npm run build` (padrão)
- **Output directory:** `.next` (padrão)
- **Node.js version:** 20.x (recomendado)

---

## 6. Cadastrar o primeiro usuário owner

O primeiro usuário admin precisa ter `role = 'owner'` na tabela `profiles`. Como o signup público cria usuários com `role = 'operator'` por padrão:

1. Cadastre o usuário normalmente via `/admin/login` → "Criar conta" (se disponível) ou pelo painel Supabase em **Authentication → Users → Invite user**.
2. No SQL Editor, execute:
```sql
UPDATE profiles
SET role = 'owner', is_admin = true
WHERE id = '<uuid-do-usuario>';
```
> Substitua `<uuid-do-usuario>` pelo UUID visível em **Authentication → Users**.

---

## 7. Checklist de smoke-test

Após o deploy, realize este fluxo manual para confirmar que tudo funciona:

- [ ] Acesso ao site público (`/`) — catálogo aparece
- [ ] Montar uma pizza e chegar ao checkout
- [ ] Finalizar pedido → pedido gravado em `orders`
- [ ] Login como owner em `/admin/login`
- [ ] Pedido visível no painel `/admin/pedidos`
- [ ] Confirmar pedido → status muda para `confirmed`
- [ ] Login como kitchen em `/cozinha` → pedido aparece no KDS
- [ ] "Iniciar preparo" e "Marcar pronto" funcionam
- [ ] Pedido `ready` aparece em `/admin/despacho`
- [ ] Ticket cozinha imprime corretamente (Ctrl+P)
- [ ] Ticket entrega imprime corretamente
- [ ] Relatórios visíveis em `/admin/relatorios` (owner)
- [ ] Export CSV funciona
- [ ] Migration `006_realtime.sql` aplicada → KDS atualiza sem refresh

---

*Última atualização: 2026-06-12 — Cycle Docs COMPLETE*
