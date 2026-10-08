const { Client } = require('pg');
const connectionString = 'postgresql://postgres:Boxzic-1woqka-qewqez@db.jnjhqbrtyspxqwlgyqlq.supabase.co:5432/postgres';

async function run() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    const sql = `ALTER TABLE clusters DROP CONSTRAINT clusters_invite_code_key;`;
    await client.query(sql);
    console.log('Constraint dropped successfully');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}
run();
