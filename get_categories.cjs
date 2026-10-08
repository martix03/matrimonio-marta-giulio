const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://postgres:Boxzic-1woqka-qewqez@db.jnjhqbrtyspxqwlgyqlq.supabase.co:5432/postgres'
});
client.connect().then(() => {
  client.query('SELECT * FROM place_categories').then(res => {
    console.log(res.rows);
    client.end();
  });
});
