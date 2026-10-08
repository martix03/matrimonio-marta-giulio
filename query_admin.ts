import { Client } from 'pg';
const client = new Client({ connectionString: 'postgresql://postgres:Boxzic-1woqka-qewqez@db.jnjhqbrtyspxqwlgyqlq.supabase.co:5432/postgres' });
async function run() {
  await client.connect();
  const res = await client.query(`
    SELECT g.id, g.first_name, g.last_name, c.family_name 
    FROM guests g
    JOIN clusters c ON g.cluster_id = c.id
    WHERE c.family_name ILIKE '%admin%';
  `);
  console.table(res.rows);
  await client.end();
}
run();
