const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgresql://postgres:Boxzic-1woqka-qewqez@db.jnjhqbrtyspxqwlgyqlq.supabase.co:5432/postgres';

async function run() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('Connected to DB');
    const sql = fs.readFileSync(path.join(__dirname, 'supabase', 'schema.sql'), 'utf8');
    await client.query(sql);
    console.log('SQL executed successfully');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}
run();
