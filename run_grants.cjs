const { Client } = require('pg');
const connectionString = 'postgresql://postgres:Boxzic-1woqka-qewqez@db.jnjhqbrtyspxqwlgyqlq.supabase.co:5432/postgres';

async function run() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    const sql = `
      GRANT SELECT, INSERT, UPDATE, DELETE ON public.clusters TO anon, authenticated, service_role;
      GRANT SELECT, INSERT, UPDATE, DELETE ON public.guests TO anon, authenticated, service_role;
      GRANT SELECT, INSERT, UPDATE, DELETE ON public.carpooling_posts TO anon, authenticated, service_role;
      GRANT SELECT, INSERT, UPDATE, DELETE ON public.places TO anon, authenticated, service_role;
    `;
    await client.query(sql);
    console.log('Grants executed successfully');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}
run();
