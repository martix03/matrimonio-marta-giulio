const fs = require('fs');
let code = fs.readFileSync('src/components/admin/AdminSettings.tsx', 'utf8');

const regex = /\{\/\* Location \*\/\}[\s\S]*?\{\/\* Orari Evento \*\/\}/;
code = code.replace(regex, '{/* Orari Evento */}');

fs.writeFileSync('src/components/admin/AdminSettings.tsx', code);
