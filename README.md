# 💍 Marta & Giulio — Wedding Web App

Applicazione web progressiva (PWA) moderna, raffinata e mobile-first per il matrimonio di **Marta & Giulio**.

## 🎨 Design System & Stile
- **Colori ufficiali:**
  - Bordeaux nobile: `#51101d`
  - Rosa cipria: `#d7b8af`
  - Sfondo caldo: `#faf2f2`
  - Card & Paper: `#ffffff`
- **Tipografia:**
  - Titoli & Intestazioni: **DM Serif Display** (Google Fonts)
  - Corpo del testo & Controlli: **Montserrat** (Google Fonts)
- **Favicon & Icona:** Logo monogramma personalizzato `favicon.png`

---

## 🚀 Funzionalità Implementate

1. **Accesso Smart & Cluster Familiari:**
   - Accesso automatico tramite link WhatsApp: `?code=ROSSI26`
   - Ricerca per Nome e Cognome per chi accede senza link
   - Caricamento di tutti i componenti del nucleo familiare
2. **Hero & Countdown:**
   - Saluto contestuale ("*Benvenuta Famiglia Rossi!*")
   - Countdown dinamico a giorni, ore, minuti e secondi
3. **Wedding Flash Info:**
   - 4 Card riassuntive (Data, Orari, Cerimonia, Ricevimento)
   - Action sheet per apertura immediata in Google Maps, Apple Maps e Waze
4. **Form RSVP Dinamico Multi-Step:**
   - Step 1: Conferma o declino presenza del cluster con messaggio per gli sposi
   - Step 2: Dettaglio singolo ospite (Adulto / Bambino, chip allergie/intolleranze, posto navetta)
   - Step 3: DJ Set con richiesta brano musicale
   - Step 4: Riepilogo, salvataggio e celebrazione con coriandoli (`canvas-confetti`)
5. **Hub Logistico & Trasporti:**
   - Barra avanzamento posti navetta serale in tempo reale (partenze ore 01:30 e 03:00)
   - Bacheca Carpooling con passaggi offerti e pulsante rapido **"Scrivi su WhatsApp"** con testo precompilato
   - Form per offrire nuovi passaggi
6. **Lista Nozze Headless:**
   - Tappe del viaggio in Giappone con fotografie e percentuali raccolte
   - Coordinate bancarie con pulsante **"Copia IBAN"** e causale precompilata
   - Form "Avvisaci del regalo"
7. **Mappa Interattiva (POI):**
   - Mappa Leaflet (OpenStreetMap / CartoDB Voyager)
   - Pin personalizzati (Cerimonia, Villa, Hotel convenzionati, Parrucchieri, Ristoranti)
   - Scheda dettaglio con *"La nota degli sposi"*, contatti e deeplink navigatore
8. **FAQ (Domande Frequenti):**
   - Ricerca in tempo reale e filtri per categoria (Dress code, Sedi, Bambini, Regali)
   - Accordion espandibile e pulsante WhatsApp per contattare gli sposi

---

## 🛠️ Guida all'Utilizzo

### 1. Avvio in locale (Sviluppo)
```bash
npm run dev
```

### 2. Compilazione del pacchetto statico
```bash
npm run build
```
I file compilati e ottimizzati saranno generati nella cartella `dist/`.

### 3. Deploy su ShipStatic (`martaegiulio2027.shipstatic.com`)
Quando vorrai pubblicare questa nuova web app sul tuo dominio al posto del Save the Date, ti basterà lanciare:
```bash
npm run deploy
```
Lo script caricherà automaticamente il contenuto di `dist/` sulla tua utenza ShipStatic e lo collegherà a `martaegiulio2027.shipstatic.com`.

---

## 🗄️ Configurazione Supabase (Database Relazionale)

L'applicazione funziona sia in **modalità mock/demo locale** (senza database), sia con **Supabase**:

1. Crea un progetto su [Supabase](https://supabase.com).
2. Nel SQL Editor di Supabase, esegui il contenuto del file:
   `supabase/schema.sql`
3. Crea un file `.env` nella radice del progetto con le tue chiavi:
   ```env
   VITE_SUPABASE_URL=https://tuo-id.supabase.co
   VITE_SUPABASE_ANON_KEY=tua-chiave-anon-pubblica
   ```
4. Esegui `npm run build` e l'applicazione utilizzerà automaticamente Supabase in tempo reale!

---

## ⚙️ Personalizzazione Rapida
Tutti i testi chiave, orari, indirizzi e coordinate sono centralizzati in:  
`src/config/wedding.config.ts`
