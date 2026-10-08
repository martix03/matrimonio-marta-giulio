import { Client } from 'pg';

const mockFaqs = [
  {
    id: 'faq-dress-code',
    category: 'info',
    question: 'Qual è il dress code consigliato?',
    answer: 'Nessun dress code! Vogliamo solo che stiate comodi e vi godiate la festa. Indossate ciò che vi fa sentire a vostro agio. Dato che saremo in una cascina immersa nel verde, vi suggeriamo solo calzature adatte per camminare agevolmente sui prati.',
    sort_order: 1
  },
  {
    id: 'faq-parking',
    category: 'locations',
    question: 'Come funziona il parcheggio a Cascina Ranverso?',
    answer: 'Cascina Ranverso dispone di un ampio parcheggio privato e gratuito all\'interno della tenuta, comodissimo e a pochi passi dalle zone dedicate alla cerimonia e al ricevimento.',
    sort_order: 2
  },
  {
    id: 'faq-children',
    category: 'info',
    question: 'Posso portare i bambini?',
    answer: 'I bambini sono i benvenuti! Durante il ricevimento a Cascina Ranverso sarà presente un fantastico servizio di animazione in uno spazio a loro dedicato, oltre a un menu bimbi riservato. Così i più piccoli potranno divertirsi e i genitori godersi la festa in totale relax!',
    sort_order: 3
  },
  {
    id: 'faq-gifts',
    category: 'gifts',
    question: 'Cosa desiderate per la lista nozze?',
    answer: 'La vostra presenza è per noi il dono più prezioso! Per chi desiderasse contribuire al nostro sogno, abbiamo aperto la lista nozze per il nostro viaggio di nozze in Cina. Trovate l\'IBAN e tutte le tappe nella sezione Lista Nozze.',
    sort_order: 4
  },
  {
    id: 'faq-food-allergies',
    category: 'info',
    question: 'Come comunico intolleranze o allergie alimentari?',
    answer: 'Puoi indicarci ogni tua esigenza alimentare direttamente compilando il modulo di conferma presenza (RSVP). Il catering preparerà una proposta dedicata per assicurarsi che tutti possano mangiare con gusto e in sicurezza.',
    sort_order: 5
  },
  {
    id: 'faq-party-end',
    category: 'locations',
    question: 'Fino a che ora dureranno i festeggiamenti?',
    answer: 'La location ci permette di ballare fino a tarda notte! Dopo il taglio della torta previsto intorno a mezzanotte, ci sarà il DJ set per scatenarci fino alle 02:00 del mattino.',
    sort_order: 6
  },
  {
    id: 'faq-photos',
    category: 'info',
    question: 'Si potranno scattare foto durante la cerimonia?',
    answer: 'Certamente! Siete liberi di scattare tutte le foto che volete in qualsiasi momento, sia durante la cerimonia che durante il ricevimento. Anzi, ci farà molto piacere se poi le condividerete con noi!',
    sort_order: 7
  },
  {
    id: 'faq-spaces',
    category: 'locations',
    question: 'L\'evento si svolgerà all\'aperto o al chiuso?',
    answer: 'Sfrutteremo tutti i bellissimi spazi della cascina! Tempo permettendo, la cerimonia, l\'aperitivo e il taglio della torta si terranno all\'aperto (altrimenti abbiamo un piano B garantito!), mentre la cena verrà servita al chiuso all\'interno della sala.',
    sort_order: 8
  }
];

const client = new Client({ connectionString: 'postgresql://postgres:Boxzic-1woqka-qewqez@db.jnjhqbrtyspxqwlgyqlq.supabase.co:5432/postgres' });

async function run() {
  await client.connect();
  
  // Since we created the table with uuid, we can just insert them without id, or we need to add a category column!
  // Wait, I forgot to add category to the faqs table!
  await client.query(`
    ALTER TABLE faqs ADD COLUMN IF NOT EXISTS category text DEFAULT 'info';
  `);

  for (const f of mockFaqs) {
    await client.query(`
      INSERT INTO faqs (question, answer, category, sort_order) 
      VALUES ($1, $2, $3, $4)
    `, [f.question, f.answer, f.category, f.sort_order]);
  }

  console.log("FAQs inserted successfully");
  await client.end();
}
run();
