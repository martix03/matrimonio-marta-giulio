const fs = require('fs');

let adminCode = fs.readFileSync('src/components/admin/AdminSettings.tsx', 'utf8');

// 1. Add type support to InputField
adminCode = adminCode.replace(
  /const InputField = \(\{ label, value, onChange \}: \{ label: string, value: string, onChange: \(v: string\) => void \}\) => \(/,
  `const InputField = ({ label, value, onChange, type = "text" }: { label: string, value: string, onChange: (v: string) => void, type?: string }) => (`
);

adminCode = adminCode.replace(
  /type="text"/,
  `type={type}`
);

// 2. Add event.date field
adminCode = adminCode.replace(
  /<InputField label="Data Mostrata \(es\. Sabato 29 Maggio 2027\)" value=\{formData\?\.event\?\.displayDate\} onChange=\{\(v\) => handleChange\('event', 'displayDate', v\)\} \/>/,
  `<InputField label="Data Mostrata (es. Sabato 29 Maggio 2027)" value={formData?.event?.displayDate} onChange={(v) => handleChange('event', 'displayDate', v)} />
            <InputField label="Data Esatta per il Conto alla Rovescia" type="datetime-local" value={formData?.event?.date ? formData.event.date.substring(0, 16) : ''} onChange={(v) => handleChange('event', 'date', v)} />`
);

fs.writeFileSync('src/components/admin/AdminSettings.tsx', adminCode);

