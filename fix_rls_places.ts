import { Client } from 'pg';
const client = new Client({ connectionString: 'postgresql://postgres:Boxzic-1woqka-qewqez@db.jnjhqbrtyspxqwlgyqlq.supabase.co:5432/postgres' });
async function run() {
  await client.connect();
  
  await client.query(`
    CREATE POLICY "Public update for places" ON places FOR UPDATE USING (true) WITH CHECK (true);
  `);
  
  console.log("Places update policy created successfully");
  await client.end();
}
run();
