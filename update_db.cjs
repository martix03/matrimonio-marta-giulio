const { Client } = require('pg');
const connectionString = 'postgresql://postgres:Boxzic-1woqka-qewqez@db.jnjhqbrtyspxqwlgyqlq.supabase.co:5432/postgres';

async function run() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    // Update cluster
    await client.query(`UPDATE clusters SET family_name = 'Famiglia Spalla' WHERE id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'`);
    // Update guests
    await client.query(`UPDATE guests SET last_name = 'Spalla' WHERE cluster_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'`);
    console.log('Database updated successfully');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}
run();
