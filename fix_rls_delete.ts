import { Client } from 'pg';
const client = new Client({ connectionString: 'postgresql://postgres:Boxzic-1woqka-qewqez@db.jnjhqbrtyspxqwlgyqlq.supabase.co:5432/postgres' });
async function run() {
  await client.connect();
  
  await client.query(`
    CREATE POLICY "Public delete for guests" ON guests FOR DELETE USING (true);
    CREATE POLICY "Public delete for places" ON places FOR DELETE USING (true);
  `);
  
  console.log("Delete policies created successfully");
  await client.end();
}
run();
