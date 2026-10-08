import { Client } from 'pg';
import fs from 'fs';

const client = new Client({ connectionString: 'postgresql://postgres:Boxzic-1woqka-qewqez@db.jnjhqbrtyspxqwlgyqlq.supabase.co:5432/postgres' });

async function run() {
  await client.connect();

  await client.query(`
    -- Create wedding_settings table
    CREATE TABLE IF NOT EXISTS wedding_settings (
      id integer PRIMARY KEY DEFAULT 1,
      config jsonb NOT NULL,
      created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
      updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
      CONSTRAINT ensure_single_row CHECK (id = 1)
    );

    -- Create faqs table
    CREATE TABLE IF NOT EXISTS faqs (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      question text NOT NULL,
      answer text NOT NULL,
      sort_order integer DEFAULT 0 NOT NULL,
      created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
    );

    -- RLS for wedding_settings
    ALTER TABLE wedding_settings ENABLE ROW LEVEL SECURITY;
    DO $$ BEGIN
      CREATE POLICY "Public read for settings" ON wedding_settings FOR SELECT USING (true);
      CREATE POLICY "Public update for settings" ON wedding_settings FOR UPDATE USING (true) WITH CHECK (true);
      CREATE POLICY "Public insert for settings" ON wedding_settings FOR INSERT WITH CHECK (true);
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    -- RLS for faqs
    ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
    DO $$ BEGIN
      CREATE POLICY "Public read for faqs" ON faqs FOR SELECT USING (true);
      CREATE POLICY "Public insert for faqs" ON faqs FOR INSERT WITH CHECK (true);
      CREATE POLICY "Public update for faqs" ON faqs FOR UPDATE USING (true) WITH CHECK (true);
      CREATE POLICY "Public delete for faqs" ON faqs FOR DELETE USING (true);
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `);

  // Insert default config if not exists
  const config = {
    couple: { bride: 'Marta', groom: 'Giulio', fullName: 'Marta & Giulio', hashtag: '#MartaEGiulio2027' },
    event: { date: '2027-05-29T17:00:00+02:00', displayDate: 'Sabato 29 Maggio 2027', city: 'Buttigliera Alta · Torino', ceremonyTime: 'Arrivo gradito entro le 16:45', receptionTime: 'A seguire, aperitivo, cena e festa nello stesso luogo' },
    rsvp: { deadline: '2027-03-15' },
    registry: { bank: 'Intesa Sanpaolo', iban: 'IT52B0623001132000047471545', holder: 'Spalla Marta, Palomba Giulio', bic: 'BCITITMM' },
    contacts: {
      marta: { name: 'Marta', phone: '346 612 1512', email: 'spalla.marta@gmail.com' },
      giulio: { name: 'Giulio', phone: '349 248 1715', email: 'giulio.palomba@gmail.com' }
    }
  };

  await client.query(`
    INSERT INTO wedding_settings (id, config) 
    VALUES (1, $1)
    ON CONFLICT (id) DO NOTHING;
  `, [JSON.stringify(config)]);

  console.log("Settings DB setup completed");
  await client.end();
}
run();
