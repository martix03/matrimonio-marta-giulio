const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://postgres:Boxzic-1woqka-qewqez@db.jnjhqbrtyspxqwlgyqlq.supabase.co:5432/postgres'
});
client.connect().then(() => {
  client.query('SELECT config_json FROM wedding_settings LIMIT 1').then(res => {
    console.log(JSON.stringify(res.rows[0].config_json, null, 2));
    client.end();
  });
});
