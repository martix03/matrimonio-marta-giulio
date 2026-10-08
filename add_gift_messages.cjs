const { Client } = require('pg');
const connectionString = 'postgresql://postgres:Boxzic-1woqka-qewqez@db.jnjhqbrtyspxqwlgyqlq.supabase.co:5432/postgres';

async function run() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    const sql = `
      CREATE TABLE IF NOT EXISTS gift_messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sender_name TEXT NOT NULL,
        amount_note TEXT,
        wishes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      
      ALTER TABLE gift_messages ENABLE ROW LEVEL SECURITY;
      
      GRANT SELECT, INSERT, UPDATE, DELETE ON public.gift_messages TO anon, authenticated, service_role;
      
      CREATE POLICY "Public insert for gift_messages" ON gift_messages FOR INSERT WITH CHECK (true);
      CREATE POLICY "Public read for gift_messages" ON gift_messages FOR SELECT USING (true);
    `;
    await client.query(sql);
    console.log('gift_messages table created successfully');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}
run();
