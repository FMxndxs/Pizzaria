-- ═══════════════════════════════════════════════════════════════════════════════
-- 004_profiles_role.sql
-- Cobertos: 0-B8 (user_role enum + profiles.role + backfill),
--           0-B9 (helpers SECURITY DEFINER + policy update)
--
-- Execute este arquivo inteiro de uma vez no SQL Editor.
-- ═══════════════════════════════════════════════════════════════════════════════

-- 0-B8: enum de papéis
CREATE TYPE IF NOT EXISTS user_role AS ENUM ('owner', 'operator', 'kitchen');

-- 0-B8: coluna role em profiles (default operator para novos usuários)
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS role user_role NOT NULL DEFAULT 'operator';

-- 0-B8: backfill — quem tinha is_admin = true vira owner
UPDATE profiles SET role = 'owner' WHERE is_admin = true;

-- 0-B9: helpers SECURITY DEFINER
-- Retorna o papel do usuário autenticado atual
CREATE OR REPLACE FUNCTION current_user_role()
RETURNS user_role LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT role FROM profiles WHERE id = auth.uid()
$$;

-- Reescreve is_admin() para usar role (mantém assinatura — policies existentes não mudam)
-- is_admin() = true para owner e operator (todo staff de gestão)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('owner', 'operator')
  )
$$;

-- is_owner() = true apenas para owner
CREATE OR REPLACE FUNCTION is_owner()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'owner'
  )
$$;

-- is_staff() = true para qualquer papel cadastrado (owner + operator + kitchen)
CREATE OR REPLACE FUNCTION is_staff()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('owner', 'operator', 'kitchen')
  )
$$;

-- 0-B9: atualiza policy de SELECT em orders para incluir kitchen (KDS)
-- A cozinha precisa ver os pedidos, mas não tem is_admin() true.
DROP POLICY IF EXISTS "admin vê todos os pedidos" ON orders;
CREATE POLICY "staff vê todos os pedidos"
  ON orders FOR SELECT
  USING (user_id = auth.uid() OR is_admin() OR is_staff());

-- Grants para as novas funções
GRANT EXECUTE ON FUNCTION current_user_role() TO authenticated;
GRANT EXECUTE ON FUNCTION is_owner()          TO authenticated;
GRANT EXECUTE ON FUNCTION is_staff()          TO authenticated;
