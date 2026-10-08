import { Client } from 'pg';
import { mockPlaces } from './src/services/mockData';

const connectionString = 'postgresql://postgres:Boxzic-1woqka-qewqez@db.jnjhqbrtyspxqwlgyqlq.supabase.co:5432/postgres';
const client = new Client({ connectionString });

const categories = [
  { id: 'all', label: 'Tutti i Luoghi', marker_icon: '📍', marker_color: '#51101d', parent_id: null, sort_order: 0 },
  { id: 'primary', label: '⛪ Cerimonia & Villa', marker_icon: '⛪', marker_color: '#51101d', parent_id: null, sort_order: 1 },
  { id: 'hotel', label: '🏨 Hotel & Alloggi', marker_icon: '🏨', marker_color: '#1e3a8a', parent_id: null, sort_order: 2 },
  { id: 'beauty', label: '💇 Parrucchieri', marker_icon: '💇', marker_color: '#c026d3', parent_id: null, sort_order: 3 },
  { id: 'food', label: '🍷 Food & Relax', marker_icon: '🍷', marker_color: '#9f1239', parent_id: null, sort_order: 4 },
  { id: 'sightseeing', label: '📸 Da Non Perdere', marker_icon: '📸', marker_color: '#d97706', parent_id: null, sort_order: 5 },
  
  // Food subfilters
  { id: 'all_food', label: 'Tutti i Locali', marker_icon: '🍷', marker_color: '#9f1239', parent_id: 'food', sort_order: 10 },
  { id: 'colazione', label: '🥐 Colazione & Bakery', marker_icon: '🥐', marker_color: '#9f1239', parent_id: 'food', sort_order: 11 },
  { id: 'pizza', label: '🍕 Pizzerie', marker_icon: '🍕', marker_color: '#9f1239', parent_id: 'food', sort_order: 12 },
  { id: 'cena', label: '🍷 Piemontese', marker_icon: '🍷', marker_color: '#9f1239', parent_id: 'food', sort_order: 13 },
  { id: 'pub', label: '🍔 Pub & Burger', marker_icon: '🍔', marker_color: '#9f1239', parent_id: 'food', sort_order: 14 }
];

async function run() {
  await client.connect();
  
  await client.query(`DROP TABLE IF EXISTS place_categories CASCADE;`);
  await client.query(`
    CREATE TABLE place_categories (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      marker_icon TEXT NOT NULL,
      marker_color TEXT NOT NULL,
      parent_id TEXT,
      sort_order INT NOT NULL
    );
    ALTER TABLE place_categories ENABLE ROW LEVEL SECURITY;
    GRANT SELECT ON public.place_categories TO anon, authenticated, service_role;
    CREATE POLICY "Public read for place_categories" ON place_categories FOR SELECT USING (true);
  `);

  for (const c of categories) {
    await client.query(
      `INSERT INTO place_categories (id, label, marker_icon, marker_color, parent_id, sort_order) VALUES ($1, $2, $3, $4, $5, $6)`,
      [c.id, c.label, c.marker_icon, c.marker_color, c.parent_id, c.sort_order]
    );
  }

  console.log('Database categories seeded successfully');
  await client.end();
}
run();
