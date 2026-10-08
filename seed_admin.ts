import { Client } from 'pg';

const connectionString = 'postgresql://postgres:Boxzic-1woqka-qewqez@db.jnjhqbrtyspxqwlgyqlq.supabase.co:5432/postgres';
const client = new Client({ connectionString });

async function run() {
  await client.connect();
  
  // Insert admin cluster
  const clusterRes = await client.query(`
    INSERT INTO clusters (family_name, invite_code, notes)
    VALUES ('Admin', 'ADMIN_CODE', 'Admin account')
    RETURNING id;
  `);

  console.log('Database Admin user seeded successfully');
  await client.end();
}
run();
