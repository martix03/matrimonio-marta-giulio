import { Client } from 'pg';
const client = new Client({ connectionString: 'postgresql://postgres:Boxzic-1woqka-qewqez@db.jnjhqbrtyspxqwlgyqlq.supabase.co:5432/postgres' });
async function run() {
  await client.connect();
  const res = await client.query(`
    UPDATE guests 
    SET first_name = 'Carlo', last_name = 'Spalla Palomba' 
    WHERE first_name = 'Admin' AND last_name = 'Spaccati';
  `);
  console.log("Updated rows:", res.rowCount);
  await client.end();
}
run();
