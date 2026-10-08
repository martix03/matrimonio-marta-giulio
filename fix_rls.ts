import { Client } from 'pg';
const client = new Client({ connectionString: 'postgresql://postgres:Boxzic-1woqka-qewqez@db.jnjhqbrtyspxqwlgyqlq.supabase.co:5432/postgres' });
async function run() {
  await client.connect();
  
  await client.query(`
    CREATE POLICY "Public insert for clusters" ON clusters FOR INSERT WITH CHECK (true);
    CREATE POLICY "Public insert for guests" ON guests FOR INSERT WITH CHECK (true);
    CREATE POLICY "Public insert for places" ON places FOR INSERT WITH CHECK (true);
  `);
  
  console.log("Policies created successfully");
  await client.end();
}
run();
