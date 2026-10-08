const fs = require('fs');
let code = fs.readFileSync('src/components/admin/AdminSettings.tsx', 'utf8');

const sposiSection = code.match(/\{\/\* Gli Sposi \*\/\}[\s\S]*?\{\/\* Dettagli Evento \*\/\}/)[0].replace('{/* Dettagli Evento */}', '').trim();
const eventSection = code.match(/\{\/\* Dettagli Evento \*\/\}[\s\S]*?\{\/\* Location \*\/\}/)[0].replace('{/* Location */}', '').trim();
const locationSection = code.match(/\{\/\* Location \*\/\}[\s\S]*?\{\/\* Iban \/ Lista Nozze \*\/\}/)[0].replace('{/* Iban / Lista Nozze */}', '').trim();
const ibanSection = code.match(/\{\/\* Iban \/ Lista Nozze \*\/\}[\s\S]*?<\/div>\s*<div className="mt-8 flex justify-end border-t border-blush\/20 pt-6">/)[0].replace('</div>\n\n        <div className="mt-8 flex justify-end border-t border-blush/20 pt-6">', '').trim();

const newGridContent = `
          ${sposiSection}
          
          ${locationSection}

          ${eventSection}

          ${ibanSection}
`;

code = code.replace(/<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">[\s\S]*?<\/div>\s*<div className="mt-8 flex justify-end border-t border-blush\/20 pt-6">/, `<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">\n          ${newGridContent}\n        </div>\n\n        <div className="mt-8 flex justify-end border-t border-blush/20 pt-6">`);

fs.writeFileSync('src/components/admin/AdminSettings.tsx', code);
