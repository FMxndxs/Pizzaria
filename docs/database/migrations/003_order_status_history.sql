-- ═══════════════════════════════════════════════════════════════════════════════
-- 003_order_status_history.sql
-- Cobertos: 0-B3 (tabela + RLS), 0-B4 (triggers de histórico)
--
-- Execute este arquivo inteiro de uma vez no SQL Editor.
-- ═══════════════════════════════════════════════════════════════════════════════

-- 0-B3: tabela de histórico
CREATE TABLE IF NOT EXISTS order_status_history (
  id          uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    uuid          NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status      order_status  NOT NULL,
  changed_at  timestamptz   NOT NULL DEFAULT now(),
  changed_by  uuid          REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS order_status_history_order_id_idx
  ON order_status_history (order_id, changed_at DESC);

-- 0-B3: RLS
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

-- Leitura: quem fez o pedido, ou staff (operator/owner/kitchen)
CREATE POLICY "staff e dono do pedido vêem histórico"
  ON order_status_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE id = order_status_history.order_id
        AND (user_id = auth.uid() OR is_admin())
    )
    OR is_staff()
  );

-- Sem INSERT/UPDATE/DELETE manual — apenas via triggers SECURITY DEFINER
GRANT SELECT ON order_status_history TO authenticated, anon;

-- 0-B4: trigger — grava status inicial ao inserir pedido
CREATE OR REPLACE FUNCTION orders_history_on_insert()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO order_status_history (order_id, status, changed_by)
  VALUES (NEW.id, NEW.status, auth.uid());
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'orders_after_insert_history' AND tgrelid = 'orders'::regclass
  ) THEN
    CREATE TRIGGER orders_after_insert_history
      AFTER INSERT ON orders
      FOR EACH ROW EXECUTE FUNCTION orders_history_on_insert();
  END IF;
END;
$$;

-- 0-B4: trigger — grava mudanças de status
CREATE OR REPLACE FUNCTION orders_history_on_update()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO order_status_history (order_id, status, changed_by)
    VALUES (NEW.id, NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'orders_after_update_history' AND tgrelid = 'orders'::regclass
  ) THEN
    CREATE TRIGGER orders_after_update_history
      AFTER UPDATE OF status ON orders
      FOR EACH ROW EXECUTE FUNCTION orders_history_on_update();
  END IF;
END;
$$;
