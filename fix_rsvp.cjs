const fs = require('fs');

// 1. Update AdminSettings.tsx
let adminCode = fs.readFileSync('src/components/admin/AdminSettings.tsx', 'utf8');

adminCode = adminCode.replace(
  /<InputField label="Etichetta Card Orari \(es\. Arrivo ore 16:45\)" value=\{formData\?\.event\?\.timeBadge\} onChange=\{\(v\) => handleChange\('event', 'timeBadge', v\)\} \/>/,
  `<InputField label="Etichetta Card Orari (es. Arrivo ore 16:45)" value={formData?.event?.timeBadge} onChange={(v) => handleChange('event', 'timeBadge', v)} />
            <InputField label="Data Scadenza RSVP" value={formData?.event?.rsvpDeadline} onChange={(v) => handleChange('event', 'rsvpDeadline', v)} />`
);

fs.writeFileSync('src/components/admin/AdminSettings.tsx', adminCode);

// 2. Update SettingsContext.tsx
let settingsCode = fs.readFileSync('src/contexts/SettingsContext.tsx', 'utf8');

if (!settingsCode.includes('rsvpDeadline: string;')) {
  settingsCode = settingsCode.replace(
    /timeBadge\?: string;/,
    `timeBadge?: string;\n    rsvpDeadline?: string;`
  );
  fs.writeFileSync('src/contexts/SettingsContext.tsx', settingsCode);
}
