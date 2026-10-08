import { Client } from 'pg';

const connectionString = 'postgresql://postgres:Boxzic-1woqka-qewqez@db.jnjhqbrtyspxqwlgyqlq.supabase.co:5432/postgres';
const client = new Client({ connectionString });

async function run() {
  await client.connect();
  
  // Find Admin cluster
  const res = await client.query(`SELECT id FROM clusters WHERE family_name = 'Admin' LIMIT 1;`);
  if (res.rows.length > 0) {
    const clusterId = res.rows[0].id;
    // Check if guest exists
    const guestRes = await client.query(`SELECT id FROM guests WHERE cluster_id = $1;`, [clusterId]);
    if (guestRes.rows.length === 0) {
      await client.query(`
        INSERT INTO guests (cluster_id, first_name, last_name)
        VALUES ($1, 'Admin', 'Spaccati')
      `, [clusterId]);
      console.log('Admin guest inserted');
    } else {
      console.log('Admin guest already exists');
    }
  }

  await client.end();
}
run();
