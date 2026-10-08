const fs = require('fs');

// 1. Update SettingsContext.tsx
let settingsCode = fs.readFileSync('src/contexts/SettingsContext.tsx', 'utf8');
settingsCode = settingsCode.replace('time?: string;', 'time?: string; timeBadge?: string;');
fs.writeFileSync('src/contexts/SettingsContext.tsx', settingsCode);

// 2. Update AdminSettings.tsx
let adminCode = fs.readFileSync('src/components/admin/AdminSettings.tsx', 'utf8');
adminCode = adminCode.replace(
  /<InputField label="Data Mostrata \(es\. Sabato 29 Maggio 2027\)" value=\{formData\?\.event\?\.displayDate\} onChange=\{\(v\) => handleChange\('event', 'displayDate', v\)\} \/>/,
  `<InputField label="Data Mostrata (es. Sabato 29 Maggio 2027)" value={formData?.event?.displayDate} onChange={(v) => handleChange('event', 'displayDate', v)} />
            <InputField label="Etichetta Card Orari (es. Arrivo ore 16:45)" value={formData?.event?.timeBadge} onChange={(v) => handleChange('event', 'timeBadge', v)} />`
);
fs.writeFileSync('src/components/admin/AdminSettings.tsx', adminCode);

// 3. Update QuickFacts.tsx
let factsCode = fs.readFileSync('src/components/home/QuickFacts.tsx', 'utf8');
factsCode = factsCode.replace(
  /badge: settings\.event\.time \|\| 'Ore 17:00',/,
  "badge: settings.event.timeBadge || settings.event.time || 'Ore 17:00',"
);
fs.writeFileSync('src/components/home/QuickFacts.tsx', factsCode);

