const fs = require('fs');

// 1. Update QuickFacts.tsx
let factsCode = fs.readFileSync('src/components/home/QuickFacts.tsx', 'utf8');

// Helper to format date in QuickFacts
const dateReplace = `main: new Date(settings.event.date).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).replace(/^\\w/, c => c.toUpperCase()),`;
factsCode = factsCode.replace(/main: settings\.event\.displayDate,/, dateReplace);

// Helper to format time
const timeReplace = `main: "Ore " + new Date(settings.event.date).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),`;
factsCode = factsCode.replace(/main: settings\.event\.time \|\| 'Ore 17:00',/, timeReplace);

// Update badge if time is used
const timeBadgeReplace = `badge: settings.event.timeBadge || ("Ore " + new Date(settings.event.date).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })),`;
factsCode = factsCode.replace(/badge: settings\.event\.timeBadge \|\| settings\.event\.time \|\| 'Ore 17:00',/, timeBadgeReplace);

fs.writeFileSync('src/components/home/QuickFacts.tsx', factsCode);


// 2. Update AdminSettings.tsx
let adminCode = fs.readFileSync('src/components/admin/AdminSettings.tsx', 'utf8');

// Remove "Ora Evento"
adminCode = adminCode.replace(
  /<InputField label="Ora Evento \(es\. Ore 17:00\)" value=\{formData\?\.event\?\.time\} onChange=\{\(v\) => handleChange\('event', 'time', v\)\} \/>/,
  ``
);

// Remove "Data Mostrata"
adminCode = adminCode.replace(
  /<InputField label="Data Mostrata \(es\. Sabato 29 Maggio 2027\)" value=\{formData\?\.event\?\.displayDate\} onChange=\{\(v\) => handleChange\('event', 'displayDate', v\)\} \/>/,
  ``
);

// Rename "Data Esatta..." to "Data e Ora Evento"
adminCode = adminCode.replace(
  /<InputField label="Data Esatta per il Conto alla Rovescia"/,
  `<InputField label="Data e Ora dell'Evento (calcola in automatico scritte e conto alla rovescia)"`
);

fs.writeFileSync('src/components/admin/AdminSettings.tsx', adminCode);

