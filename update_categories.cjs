const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://postgres:Boxzic-1woqka-qewqez@db.jnjhqbrtyspxqwlgyqlq.supabase.co:5432/postgres'
});
client.connect().then(() => {
  client.query("UPDATE place_categories SET label = '⛪ Cerimonia & Cascina' WHERE id = 'primary'").then(() => {
    console.log("Updated category label in DB");
    client.end();
  });
});
