-- ═══════════════════════════════════════════════════════════════════════════
-- Schema — Forno & Lenha (Pizzaria)
-- Criar via Supabase SQL Editor antes de rodar as migrations.
-- ═══════════════════════════════════════════════════════════════════════════

-- ── Extensões ───────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Helper: updated_at automático ────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ══════════════════════════════════════════════════════════════════════════════
-- TABELAS DE CARDÁPIO
-- ══════════════════════════════════════════════════════════════════════════════

-- Formatos de pizza
CREATE TABLE formats (
  code        text PRIMARY KEY,                -- 'pizza-grande' | 'pizza-broto' | 'calzone'
  label       text NOT NULL,                   -- 'Pizza Grande'
  max_flavors int  NOT NULL CHECK (max_flavors BETWEEN 1 AND 5),
  sort        int  NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Sabores (catálogo principal)
CREATE TABLE flavors (
  id           uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         text        NOT NULL,
  slug         text        NOT NULL UNIQUE,
  description  text        NOT NULL DEFAULT '',
  type         text        NOT NULL CHECK (type IN ('salgada', 'doce')),
  is_available bool        NOT NULL DEFAULT true,
  is_featured  bool        NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER flavors_updated_at
  BEFORE UPDATE ON flavors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Preços por sabor × formato
CREATE TABLE flavor_prices (
  id          uuid         PRIMARY KEY DEFAULT uuid_generate_v4(),
  flavor_id   uuid         NOT NULL REFERENCES flavors(id) ON DELETE CASCADE,
  format_code text         NOT NULL REFERENCES formats(code) ON DELETE CASCADE,
  price       numeric(10,2) NOT NULL CHECK (price > 0),
  UNIQUE (flavor_id, format_code)
);

-- Imagens dos sabores
CREATE TABLE flavor_images (
  id          uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  flavor_id   uuid        NOT NULL REFERENCES flavors(id) ON DELETE CASCADE,
  url         text        NOT NULL,
  alt         text        NOT NULL DEFAULT '',
  is_primary  bool        NOT NULL DEFAULT false,
  sort_order  int         NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ══════════════════════════════════════════════════════════════════════════════
-- PERFIS DE USUÁRIO
-- ══════════════════════════════════════════════════════════════════════════════

CREATE TABLE profiles (
  id           uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name   text        NOT NULL DEFAULT '',
  last_name    text        NOT NULL DEFAULT '',
  phone        text        NOT NULL DEFAULT '',
  is_admin     boolean     NOT NULL DEFAULT false,
  neighborhood text        NOT NULL DEFAULT '',
  city         text        NOT NULL DEFAULT '',
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Cria perfil automaticamente no signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ══════════════════════════════════════════════════════════════════════════════
-- PEDIDOS
-- ══════════════════════════════════════════════════════════════════════════════

CREATE TYPE order_status AS ENUM (
  'pending',
  'confirmed',
  'preparing',
  'out_for_delivery',
  'delivered',
  'cancelled'
);

CREATE TABLE orders (
  id              uuid         PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         uuid         NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  status          order_status NOT NULL DEFAULT 'pending',
  customer_name   text         NOT NULL,
  customer_phone  text         NOT NULL,
  total           numeric(10,2) NOT NULL,
  freight         numeric(10,2) NULL,
  cep             text         NOT NULL DEFAULT '',
  street          text         NOT NULL DEFAULT '',
  street_number   text         NOT NULL DEFAULT '',
  neighborhood    text         NOT NULL DEFAULT '',
  city            text         NOT NULL DEFAULT '',
  notes           text         NULL,
  created_at      timestamptz  NOT NULL DEFAULT now()
);

CREATE INDEX orders_user_id_idx    ON orders(user_id);
CREATE INDEX orders_created_at_idx ON orders(created_at DESC);
CREATE INDEX orders_status_idx     ON orders(status);

-- Itens do pedido (pizza composta — sabores como snapshot jsonb)
CREATE TABLE order_items (
  id           uuid          PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id     uuid          NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  format_code  text          NOT NULL,
  format_label text          NOT NULL,
  flavors      jsonb         NOT NULL DEFAULT '[]',  -- [{name, type, price}]
  unit_price   numeric(10,2) NOT NULL,
  quantity     int           NOT NULL CHECK (quantity > 0)
);

CREATE INDEX order_items_order_id_idx ON order_items(order_id);

-- ══════════════════════════════════════════════════════════════════════════════
-- CONFIGURAÇÕES (frete)
-- ══════════════════════════════════════════════════════════════════════════════

CREATE TABLE settings (
  id                  int         PRIMARY KEY CHECK (id = 1),
  hq_cep              text,
  hq_lat              numeric(10,7),
  hq_lng              numeric(10,7),
  hq_label            text,
  freight_per_km      numeric(6,2) NOT NULL DEFAULT 2.5,
  delivery_radius_km  numeric(6,2) NOT NULL DEFAULT 8.0,
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- Linha única de settings (inserir no seed)
INSERT INTO settings (id, freight_per_km, delivery_radius_km) VALUES (1, 2.5, 8.0);

-- ══════════════════════════════════════════════════════════════════════════════
-- RLS — Row Level Security
-- ══════════════════════════════════════════════════════════════════════════════

ALTER TABLE formats       ENABLE ROW LEVEL SECURITY;
ALTER TABLE flavors       ENABLE ROW LEVEL SECURITY;
ALTER TABLE flavor_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE flavor_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders        ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items   ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings      ENABLE ROW LEVEL SECURITY;

-- Função is_admin (evita recursão de RLS)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()),
    false
  )
$$;

-- Leitura pública do catálogo
CREATE POLICY "catálogo público" ON formats       FOR SELECT USING (true);
CREATE POLICY "catálogo público" ON flavors       FOR SELECT USING (true);
CREATE POLICY "catálogo público" ON flavor_prices FOR SELECT USING (true);
CREATE POLICY "catálogo público" ON flavor_images FOR SELECT USING (true);

-- Admin escreve catálogo
CREATE POLICY "admin gerencia formatos"       ON formats       FOR ALL USING (is_admin());
CREATE POLICY "admin gerencia sabores"        ON flavors       FOR ALL USING (is_admin());
CREATE POLICY "admin gerencia preços"         ON flavor_prices FOR ALL USING (is_admin());
CREATE POLICY "admin gerencia imagens"        ON flavor_images FOR ALL USING (is_admin());

-- Pedidos: qualquer um insere (guest checkout), user vê os seus, admin vê tudo
CREATE POLICY "qualquer um cria pedido"       ON orders      FOR INSERT WITH CHECK (true);
CREATE POLICY "user vê seus pedidos"          ON orders      FOR SELECT USING (
  user_id = auth.uid() OR is_admin()
);
CREATE POLICY "admin atualiza pedido"         ON orders      FOR UPDATE USING (is_admin());
CREATE POLICY "admin deleta pedido"           ON orders      FOR DELETE USING (is_admin());

CREATE POLICY "qualquer um insere itens"      ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "user vê seus itens"            ON order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders o
    WHERE o.id = order_items.order_id
      AND (o.user_id = auth.uid() OR is_admin())
  )
);
CREATE POLICY "admin gerencia itens"          ON order_items FOR ALL USING (is_admin());

-- Perfis
CREATE POLICY "user vê seu perfil"            ON profiles FOR SELECT USING (id = auth.uid() OR is_admin());
CREATE POLICY "user edita seu perfil"         ON profiles FOR UPDATE USING (id = auth.uid());

-- Settings: leitura pública, escrita admin
CREATE POLICY "settings leitura pública"      ON settings FOR SELECT USING (true);
CREATE POLICY "admin edita settings"          ON settings FOR UPDATE USING (is_admin());
