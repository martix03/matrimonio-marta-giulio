import { Client } from 'pg';

const connectionString = 'postgresql://postgres:Boxzic-1woqka-qewqez@db.jnjhqbrtyspxqwlgyqlq.supabase.co:5432/postgres';
const client = new Client({ connectionString });

const foodCategories = [
  { id: 'all_food', label: 'Tutti i Locali', marker_icon: '🍷', marker_color: '#9f1239', sort_order: 10 },
  { id: 'colazione', label: '🥐 Colazione & Bakery', marker_icon: '🥐', marker_color: '#9f1239', sort_order: 11 },
  { id: 'pizza', label: '🍕 Pizzerie', marker_icon: '🍕', marker_color: '#9f1239', sort_order: 12 },
  { id: 'cena', label: '🍷 Piemontese', marker_icon: '🍷', marker_color: '#9f1239', sort_order: 13 },
  { id: 'pub', label: '🍔 Pub & Burger', marker_icon: '🍔', marker_color: '#9f1239', sort_order: 14 }
];

async function run() {
  await client.connect();
  
  await client.query(`DROP TABLE IF EXISTS food_categories CASCADE;`);
  await client.query(`
    CREATE TABLE food_categories (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      marker_icon TEXT NOT NULL,
      marker_color TEXT NOT NULL,
      sort_order INT NOT NULL
    );
    ALTER TABLE food_categories ENABLE ROW LEVEL SECURITY;
    GRANT SELECT ON public.food_categories TO anon, authenticated, service_role;
    CREATE POLICY "Public read for food_categories" ON food_categories FOR SELECT USING (true);
  `);

  for (const c of foodCategories) {
    await client.query(
      `INSERT INTO food_categories (id, label, marker_icon, marker_color, sort_order) VALUES ($1, $2, $3, $4, $5)`,
      [c.id, c.label, c.marker_icon, c.marker_color, c.sort_order]
    );
  }

  // Remove food categories from place_categories to clean up
  await client.query(`DELETE FROM place_categories WHERE parent_id = 'food';`);
  // Note: dropping the parent_id column isn't strictly necessary but we could do it if needed. Let's just leave it or ignore it.

  console.log('Database food_categories seeded successfully');
  await client.end();
}
run();
