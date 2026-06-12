-- ═══════════════════════════════════════════════════════════════════════════════
-- 002_orders_extend.sql
-- Cobertos: 0-B1 (ready enum), 0-B5 (order_code seq+função+trigger),
--           0-B6 (backfill+unique), 0-B7 (fulfillment_type)
--
-- ⚠️  EXECUTE EM DUAS ETAPAS no SQL Editor do Supabase:
--
--   ETAPA 1 — Copie e execute APENAS a linha abaixo, sozinha:
--     ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'ready' AFTER 'preparing';
--
--   ETAPA 2 — Execute o restante do arquivo APÓS a Etapa 1 ser commitada.
--             O PostgreSQL não permite usar um valor de enum recém-adicionado
--             na mesma transação que o criou (comportamento do PG < 16).
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─── ETAPA 1 ─────────────────────────────────────────────────────────────────
-- Execute este bloco isolado primeiro.
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'ready' AFTER 'preparing';

-- ─── ETAPA 2 ─────────────────────────────────────────────────────────────────
-- Execute o bloco abaixo somente após a Etapa 1 ter sido commitada.

-- 0-B7: enum + coluna fulfillment_type
DO $$
BEGIN
  CREATE TYPE fulfillment_type AS ENUM ('delivery', 'pickup');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END;
$$;

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS fulfillment_type fulfillment_type NOT NULL DEFAULT 'delivery',
  ADD COLUMN IF NOT EXISTS updated_at       timestamptz      NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS order_seq        bigint,
  ADD COLUMN IF NOT EXISTS order_code       text,
  ADD COLUMN IF NOT EXISTS courier_name     text;

-- Trigger updated_at — reutiliza update_updated_at() definida em schema.sql
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'orders_updated_at' AND tgrelid = 'orders'::regclass
  ) THEN
    CREATE TRIGGER orders_updated_at
      BEFORE UPDATE ON orders
      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END;
$$;

-- 0-B5: sequence + função de codificação Crockford Base32 + trigger
CREATE SEQUENCE IF NOT EXISTS order_code_seq START 1;

-- gen_order_code(n): converte bigint para Crockford Base32, mín. 4 chars.
-- Alphabet (32 chars): 0–9 A–H J–N P–T V–Z  (exclui I, L, O, U)
CREATE OR REPLACE FUNCTION gen_order_code(n bigint)
RETURNS text LANGUAGE plpgsql IMMUTABLE AS $$
DECLARE
  alphabet text   := '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  result   text   := '';
  rem      bigint;
BEGIN
  IF n <= 0 THEN RETURN '0000'; END IF;
  WHILE n > 0 LOOP
    rem    := n % 32;
    result := substr(alphabet, (rem + 1)::int, 1) || result;
    n      := n / 32;
  END LOOP;
  WHILE length(result) < 4 LOOP
    result := '0' || result;
  END LOOP;
  RETURN result;
END;
$$;

-- Trigger: atribui order_seq e order_code antes de cada INSERT
CREATE OR REPLACE FUNCTION orders_assign_code()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.order_seq  := nextval('order_code_seq');
  NEW.order_code := '#' || gen_order_code(NEW.order_seq);
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'orders_before_insert_code' AND tgrelid = 'orders'::regclass
  ) THEN
    CREATE TRIGGER orders_before_insert_code
      BEFORE INSERT ON orders
      FOR EACH ROW EXECUTE FUNCTION orders_assign_code();
  END IF;
END;
$$;

-- 0-B6: backfill — atribui order_code a pedidos existentes (sem código)
DO $$
DECLARE
  rec record;
BEGIN
  FOR rec IN
    SELECT id FROM orders WHERE order_code IS NULL ORDER BY created_at
  LOOP
    UPDATE orders
    SET order_seq  = nextval('order_code_seq'),
        order_code = '#' || gen_order_code(currval('order_code_seq'))
    WHERE id = rec.id;
  END LOOP;
END;
$$;

-- 0-B6: após backfill, tornar NOT NULL e adicionar restrição UNIQUE
ALTER TABLE orders
  ALTER COLUMN order_seq  SET NOT NULL,
  ALTER COLUMN order_code SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'orders_order_code_unique' AND conrelid = 'orders'::regclass
  ) THEN
    ALTER TABLE orders ADD CONSTRAINT orders_order_code_unique UNIQUE (order_code);
  END IF;
END;
$$;
