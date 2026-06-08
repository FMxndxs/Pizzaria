-- ══════════════════════════════════════════════════════
-- Seed: sabores (placeholders genéricos)
-- Trocar imagens por fotos reais quando disponíveis.
-- ══════════════════════════════════════════════════════

-- Sabores salgados
INSERT INTO flavors (name, slug, description, type, is_featured) VALUES
  ('Calabresa',           'calabresa',           'Calabresa fatiada, cebola e azeitona.',                           'salgada', true),
  ('Marguerita',          'marguerita',          'Molho de tomate, mussarela e folhas de manjericão fresco.',        'salgada', true),
  ('Portuguesa',          'portuguesa',          'Presunto, ovo, cebola, azeitona e catupiry.',                      'salgada', false),
  ('Frango c/ Catupiry',  'frango-catupiry',     'Frango desfiado, catupiry cremoso e milho.',                       'salgada', true),
  ('Quatro Queijos',      'quatro-queijos',      'Mussarela, provolone, gorgonzola e parmesão.',                     'salgada', true),
  ('Pepperoni',           'pepperoni',           'Generosa camada de pepperoni artesanal.',                          'salgada', false),
  ('Toscana',             'toscana',             'Linguiça toscana, pimentão e cebola caramelizada.',                'salgada', false),
  ('Bacon',               'bacon',               'Bacon crocante, cream cheese e catupiry.',                         'salgada', false),
  ('Napolitana',          'napolitana',          'Tomate fatiado, mussarela, manjericão e alho.',                    'salgada', false),
  ('Vegetariana',         'vegetariana',         'Abobrinha, pimentão, cogumelo e tomate-cereja.',                   'salgada', false);

-- Sabores doces
INSERT INTO flavors (name, slug, description, type, is_featured) VALUES
  ('Chocolate',           'chocolate',           'Cobertura de chocolate ao leite e gotas de chocolate.',           'doce', true),
  ('Romeu e Julieta',     'romeu-e-julieta',     'Mussarela cremosa com goiabada cascão.',                          'doce', true),
  ('Banana c/ Canela',    'banana-canela',       'Banana, canela, mel e leite condensado.',                         'doce', false),
  ('Prestígio',           'prestigio',           'Chocolate ao leite com coco ralado.',                             'doce', false),
  ('Nutella',             'nutella',             'Nutella com morangos frescos e granola.',                          'doce', true),
  ('Doce de Leite',       'doce-de-leite',       'Doce de leite artesanal com banana e nozes.',                     'doce', false);

-- ── Preços por formato ────────────────────────────────────────────────────────
-- pizza-grande e pizza-broto para todos os sabores;
-- calzone apenas para salgados (exceto vegetariana para demonstração de exclusão)

-- Salgados — grande (R$52–62) e broto (R$30–38)
INSERT INTO flavor_prices (flavor_id, format_code, price)
SELECT f.id, 'pizza-grande',
  CASE f.slug
    WHEN 'calabresa'         THEN 52.00
    WHEN 'marguerita'        THEN 50.00
    WHEN 'portuguesa'        THEN 56.00
    WHEN 'frango-catupiry'   THEN 58.00
    WHEN 'quatro-queijos'    THEN 62.00
    WHEN 'pepperoni'         THEN 64.00
    WHEN 'toscana'           THEN 56.00
    WHEN 'bacon'             THEN 58.00
    WHEN 'napolitana'        THEN 52.00
    WHEN 'vegetariana'       THEN 54.00
    ELSE 55.00
  END
FROM flavors f WHERE f.type = 'salgada';

INSERT INTO flavor_prices (flavor_id, format_code, price)
SELECT f.id, 'pizza-broto',
  CASE f.slug
    WHEN 'calabresa'         THEN 30.00
    WHEN 'marguerita'        THEN 29.00
    WHEN 'portuguesa'        THEN 33.00
    WHEN 'frango-catupiry'   THEN 34.00
    WHEN 'quatro-queijos'    THEN 36.00
    WHEN 'pepperoni'         THEN 38.00
    WHEN 'toscana'           THEN 33.00
    WHEN 'bacon'             THEN 34.00
    WHEN 'napolitana'        THEN 30.00
    WHEN 'vegetariana'       THEN 31.00
    ELSE 32.00
  END
FROM flavors f WHERE f.type = 'salgada';

-- Calzone — só salgados principais (demonstração de disponibilidade seletiva)
INSERT INTO flavor_prices (flavor_id, format_code, price)
SELECT f.id, 'calzone',
  CASE f.slug
    WHEN 'calabresa'         THEN 38.00
    WHEN 'marguerita'        THEN 36.00
    WHEN 'portuguesa'        THEN 42.00
    WHEN 'frango-catupiry'   THEN 44.00
    WHEN 'quatro-queijos'    THEN 46.00
    WHEN 'pepperoni'         THEN 48.00
    WHEN 'toscana'           THEN 42.00
    WHEN 'bacon'             THEN 44.00
    ELSE 40.00
  END
FROM flavors f WHERE f.type = 'salgada'
  AND f.slug NOT IN ('napolitana', 'vegetariana');  -- exemplos sem calzone

-- Doces — grande (R$52–62) e broto (R$30–38)
INSERT INTO flavor_prices (flavor_id, format_code, price)
SELECT f.id, 'pizza-grande',
  CASE f.slug
    WHEN 'chocolate'     THEN 52.00
    WHEN 'romeu-e-julieta' THEN 54.00
    WHEN 'banana-canela' THEN 50.00
    WHEN 'prestigio'     THEN 52.00
    WHEN 'nutella'       THEN 62.00
    WHEN 'doce-de-leite' THEN 54.00
    ELSE 52.00
  END
FROM flavors f WHERE f.type = 'doce';

INSERT INTO flavor_prices (flavor_id, format_code, price)
SELECT f.id, 'pizza-broto',
  CASE f.slug
    WHEN 'chocolate'       THEN 30.00
    WHEN 'romeu-e-julieta' THEN 31.00
    WHEN 'banana-canela'   THEN 29.00
    WHEN 'prestigio'       THEN 30.00
    WHEN 'nutella'         THEN 36.00
    WHEN 'doce-de-leite'   THEN 31.00
    ELSE 30.00
  END
FROM flavors f WHERE f.type = 'doce';

-- ── Imagens placeholder (unsplash food genérico) ──────────────────────────────
-- Uma imagem por sabor. Trocar pelas fotos reais da pizzaria.
INSERT INTO flavor_images (flavor_id, url, alt, is_primary, sort_order)
SELECT
  f.id,
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop&auto=format',
  'Pizza ' || f.name,
  true,
  0
FROM flavors f WHERE f.type = 'salgada';

INSERT INTO flavor_images (flavor_id, url, alt, is_primary, sort_order)
SELECT
  f.id,
  'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=400&fit=crop&auto=format',
  'Pizza doce ' || f.name,
  true,
  0
FROM flavors f WHERE f.type = 'doce';
