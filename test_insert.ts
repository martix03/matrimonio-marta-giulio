import { Client } from 'pg';
const client = new Client({ connectionString: 'postgresql://postgres:Boxzic-1woqka-qewqez@db.jnjhqbrtyspxqwlgyqlq.supabase.co:5432/postgres' });
async function run() {
  await client.connect();
  const res = await client.query(`
    SELECT tablename, policyname, roles, cmd, qual, with_check 
    FROM pg_policies 
    WHERE tablename IN ('guests', 'places', 'gift_messages');
  `);
  console.table(res.rows);
  await client.end();
}
run();
