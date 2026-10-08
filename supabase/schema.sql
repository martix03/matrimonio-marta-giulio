-- 📋 Schema Database Supabase per Wedding Web App Marta & Giulio

-- 1. Tabella Nuclei Familiari / Gruppi (Clusters)
CREATE TABLE IF NOT EXISTS clusters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_name TEXT NOT NULL,
  invite_code TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Singoli Invitati appartenenti al nucleo familiare
CREATE TABLE IF NOT EXISTS guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cluster_id UUID REFERENCES clusters(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  is_attending BOOLEAN DEFAULT NULL, -- NULL = In attesa, TRUE = Presente, FALSE = Assente
  is_child BOOLEAN DEFAULT FALSE,
  dietary_tags TEXT[] DEFAULT '{}',
  dietary_notes TEXT,
  song_request TEXT,
  bus_seat_reserved BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Bacheca Carpooling
CREATE TABLE IF NOT EXISTS carpooling_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID REFERENCES guests(id) ON DELETE SET NULL,
  driver_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  departure_location TEXT NOT NULL,
  departure_time TEXT NOT NULL,
  total_seats INT NOT NULL,
  available_seats INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Punti di Interesse (Mappa & Guida Locale)
CREATE TABLE IF NOT EXISTS places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'ceremony', 'reception', 'hotel', 'beauty', 'food', 'sightseeing'
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  address TEXT NOT NULL,
  phone TEXT,
  website_url TEXT,
  sposi_note TEXT,
  photo_url TEXT,
  is_primary BOOLEAN DEFAULT FALSE
);

-- 5. Row Level Security (RLS)
ALTER TABLE clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE carpooling_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE places ENABLE ROW LEVEL SECURITY;

-- 5b. Explicit Grants (Richiesti da Supabase dal 30 Ottobre)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clusters TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.guests TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.carpooling_posts TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.places TO anon, authenticated, service_role;

-- Policy anonime per lettura e scrittura pubblica controllata (tramite codice invito)
CREATE POLICY "Public read for clusters" ON clusters FOR SELECT USING (true);
CREATE POLICY "Public read for guests" ON guests FOR SELECT USING (true);
CREATE POLICY "Public update for guests" ON guests FOR UPDATE USING (true);
CREATE POLICY "Public read for carpooling" ON carpooling_posts FOR SELECT USING (true);
CREATE POLICY "Public insert for carpooling" ON carpooling_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read for places" ON places FOR SELECT USING (true);

-- 6. Dati di esempio (Seed iniziale)
INSERT INTO clusters (id, family_name, invite_code, notes) VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Famiglia Rossi', 'ROSSI26', 'Tavolo amici'),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Elena & Luca', 'FERRARI26', 'Testimoni')
ON CONFLICT (id) DO NOTHING;

INSERT INTO guests (cluster_id, first_name, last_name, is_attending, is_child, dietary_tags, song_request, bus_seat_reserved) VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Marco', 'Rossi', NULL, FALSE, '{}', 'Gigi D''Agostino - L''Amour Toujours', TRUE),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Laura', 'Bianchi', NULL, FALSE, '{"vegetarian"}', 'Dua Lipa - Levitating', TRUE),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Tommaso', 'Rossi', NULL, TRUE, '{}', '', FALSE),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Elena', 'Ferrari', TRUE, FALSE, '{"gluten_free"}', 'Abba - Dancing Queen', FALSE),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Luca', 'Moretti', TRUE, FALSE, '{}', 'The Killers - Mr. Brightside', FALSE)
ON CONFLICT DO NOTHING;
