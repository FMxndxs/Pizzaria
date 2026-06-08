-- Migration 001: grants para guest checkout (anon role)
-- Sem estes grants o anon role não consegue inserir em orders/order_items
-- mesmo com a política RLS "WITH CHECK (true)".

-- orders
GRANT INSERT ON orders     TO anon, authenticated;
GRANT SELECT ON orders     TO anon, authenticated;
GRANT UPDATE ON orders     TO authenticated;

-- order_items
GRANT INSERT ON order_items TO anon, authenticated;
GRANT SELECT ON order_items TO anon, authenticated;

-- sequences (necessário para uuid_generate_v4 em alguns contextos)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
