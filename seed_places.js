import { Client } from 'pg';
import { mockPOIs } from './src/services/mockData.js';

const connectionString = 'postgresql://postgres:Boxzic-1woqka-qewqez@db.jnjhqbrtyspxqwlgyqlq.supabase.co:5432/postgres';
const client = new Client({ connectionString });

const categories = [
  { id: 'ceremony', label: 'Matrimonio', icon: 'Church' },
  { id: 'hotel', label: 'Dove Dormire', icon: 'Bed' },
  { id: 'beauty', label: 'Trucco e Parrucco', icon: 'Sparkles' },
  { id: 'food', label: 'Piemontese', icon: 'Utensils' },
  { id: 'sightseeing', label: 'Cosa Vedere', icon: 'Camera' }
];

async function run() {
  await client.connect();
  
  await client.query(`
    CREATE TABLE IF NOT EXISTS place_categories (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      icon TEXT NOT NULL,
      sort_order INT NOT NULL
    );
    ALTER TABLE place_categories ENABLE ROW LEVEL SECURITY;
    GRANT SELECT ON public.place_categories TO anon, authenticated, service_role;
    DROP POLICY IF EXISTS "Public read for place_categories" ON place_categories;
    CREATE POLICY "Public read for place_categories" ON place_categories FOR SELECT USING (true);
  `);

  for (let i = 0; i < categories.length; i++) {
    const c = categories[i];
    await client.query(
      `INSERT INTO place_categories (id, label, icon, sort_order) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO UPDATE SET label = $2, icon = $3, sort_order = $4`,
      [c.id, c.label, c.icon, i]
    );
  }

  try { await client.query(`ALTER TABLE places ADD COLUMN food_type TEXT;`); } catch(e) {}

  // Empty existing places to avoid duplicates since we're replacing them
  await client.query(`DELETE FROM places;`);

  for (const p of mockPOIs) {
    await client.query(
      `INSERT INTO places (id, name, category, latitude, longitude, address, phone, website_url, sposi_note, photo_url, is_primary, food_type)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [p.id, p.name, p.category, p.latitude, p.longitude, p.address, p.phone || null, p.website_url || null, p.sposi_note || null, p.photo_url || null, p.is_primary || false, p.food_type || null]
    );
  }

  console.log('Database schema and places seeded successfully');
  await client.end();
}
run();
