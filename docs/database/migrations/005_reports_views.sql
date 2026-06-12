-- ═══════════════════════════════════════════════════════════════════════════════
-- 005_reports_views.sql
-- Cobertos: E-B1 (v_revenue_daily), E-B2 (v_lead_times),
--           E-B3 (v_top_products), E-B4 (v_peak_hours)
--
-- Implementação: funções SECURITY DEFINER que verificam is_owner().
-- As views são criadas como base para as funções; acesso direto é revogado.
--
-- Execute este arquivo inteiro de uma vez no SQL Editor.
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─── Funções RPC owner-only ──────────────────────────────────────────────────

-- E-B1: faturamento diário + ticket médio
CREATE OR REPLACE FUNCTION get_revenue_daily(days_back int DEFAULT 30)
RETURNS TABLE (
  day         date,
  order_count bigint,
  revenue     numeric,
  avg_ticket  numeric
)
LANGUAGE plpgsql SECURITY DEFINER STABLE AS $$
BEGIN
  IF NOT is_owner() THEN
    RAISE EXCEPTION 'not_owner';
  END IF;
  RETURN QUERY
    SELECT
      o.created_at::date                 AS day,
      COUNT(*)::bigint                   AS order_count,
      COALESCE(SUM(o.total), 0)::numeric AS revenue,
      ROUND(COALESCE(AVG(o.total), 0)::numeric, 2) AS avg_ticket
    FROM orders o
    WHERE o.status != 'cancelled'
      AND o.created_at >= now() - (days_back || ' days')::interval
    GROUP BY o.created_at::date
    ORDER BY day DESC;
END;
$$;

-- E-B2: lead times (tempo confirmed → ready)
CREATE OR REPLACE FUNCTION get_lead_times(days_back int DEFAULT 30)
RETURNS TABLE (
  order_id     uuid,
  order_code   text,
  ordered_at   timestamptz,
  confirmed_at timestamptz,
  ready_at     timestamptz,
  lead_minutes float
)
LANGUAGE plpgsql SECURITY DEFINER STABLE AS $$
BEGIN
  IF NOT is_owner() THEN
    RAISE EXCEPTION 'not_owner';
  END IF;
  RETURN QUERY
    SELECT
      o.id                               AS order_id,
      o.order_code,
      o.created_at                       AS ordered_at,
      h_conf.changed_at                  AS confirmed_at,
      h_ready.changed_at                 AS ready_at,
      EXTRACT(EPOCH FROM (h_ready.changed_at - h_conf.changed_at)) / 60 AS lead_minutes
    FROM orders o
    JOIN order_status_history h_conf
      ON h_conf.order_id = o.id AND h_conf.status = 'confirmed'
    JOIN order_status_history h_ready
      ON h_ready.order_id = o.id AND h_ready.status = 'ready'
    WHERE o.created_at >= now() - (days_back || ' days')::interval
    ORDER BY o.created_at DESC;
END;
$$;

-- E-B3: top produtos por sabor e formato
CREATE OR REPLACE FUNCTION get_top_products(days_back int DEFAULT 30)
RETURNS TABLE (
  flavor_name  text,
  format_label text,
  order_count  bigint,
  total_qty    bigint
)
LANGUAGE plpgsql SECURITY DEFINER STABLE AS $$
BEGIN
  IF NOT is_owner() THEN
    RAISE EXCEPTION 'not_owner';
  END IF;
  RETURN QUERY
    SELECT
      (flavor->>'name')::text   AS flavor_name,
      oi.format_label,
      COUNT(*)::bigint          AS order_count,
      SUM(oi.quantity)::bigint  AS total_qty
    FROM order_items oi
    JOIN orders o ON o.id = oi.order_id,
    jsonb_array_elements(oi.flavors) AS flavor
    WHERE o.status != 'cancelled'
      AND o.created_at >= now() - (days_back || ' days')::interval
    GROUP BY flavor_name, oi.format_label
    ORDER BY total_qty DESC
    LIMIT 20;
END;
$$;

-- E-B4: horários de pico
CREATE OR REPLACE FUNCTION get_peak_hours(days_back int DEFAULT 30)
RETURNS TABLE (
  hour        int,
  order_count bigint
)
LANGUAGE plpgsql SECURITY DEFINER STABLE AS $$
BEGIN
  IF NOT is_owner() THEN
    RAISE EXCEPTION 'not_owner';
  END IF;
  RETURN QUERY
    SELECT
      EXTRACT(HOUR FROM o.created_at)::int AS hour,
      COUNT(*)::bigint                     AS order_count
    FROM orders o
    WHERE o.status != 'cancelled'
      AND o.created_at >= now() - (days_back || ' days')::interval
    GROUP BY EXTRACT(HOUR FROM o.created_at)::int
    ORDER BY hour;
END;
$$;

-- Grants para usuários autenticados
GRANT EXECUTE ON FUNCTION get_revenue_daily(int) TO authenticated;
GRANT EXECUTE ON FUNCTION get_lead_times(int)    TO authenticated;
GRANT EXECUTE ON FUNCTION get_top_products(int)  TO authenticated;
GRANT EXECUTE ON FUNCTION get_peak_hours(int)    TO authenticated;
