-- ═══════════════════════════════════════════════════════════════════════════════
-- 006_realtime.sql
-- Coberto: B-B3 (publication Realtime em orders)
--
-- Execute no SQL Editor do Supabase.
-- Verificação após executar:
--   SELECT * FROM pg_publication_tables
--   WHERE pubname = 'supabase_realtime' AND tablename = 'orders';
-- Deve retornar uma linha.
-- ═══════════════════════════════════════════════════════════════════════════════

ALTER PUBLICATION supabase_realtime ADD TABLE orders;
