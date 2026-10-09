const fs = require('fs');

// 1. Update AdminSettings.tsx
let adminCode = fs.readFileSync('src/components/admin/AdminSettings.tsx', 'utf8');

adminCode = adminCode.replace(
  /<InputField label="Info Ricevimento" value=\{formData\?\.event\?\.receptionTime\} onChange=\{\(v\) => handleChange\('event', 'receptionTime', v\)\} \/>\n\s*<InputField label="Indirizzo" value=\{formData\?\.locations\?\.reception\?\.address\} onChange=\{\(v\) => handleChange\('locations', 'address', v, 'reception'\)\} \/>/,
  `<InputField label="Indirizzo / Info" value={formData?.locations?.reception?.address} onChange={(v) => handleChange('locations', 'address', v, 'reception')} />`
);

fs.writeFileSync('src/components/admin/AdminSettings.tsx', adminCode);

// 2. Update QuickFacts.tsx
let factsCode = fs.readFileSync('src/components/home/QuickFacts.tsx', 'utf8');

factsCode = factsCode.replace(
  /subtitle: settings\.event\.receptionTime,/,
  `subtitle: settings.locations.reception.address,`
);

fs.writeFileSync('src/components/home/QuickFacts.tsx', factsCode);

