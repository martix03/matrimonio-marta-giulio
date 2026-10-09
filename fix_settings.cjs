const fs = require('fs');
let code = fs.readFileSync('src/components/admin/AdminSettings.tsx', 'utf8');

const start = code.indexOf('const handleAddFaq');
const end = code.indexOf('if (!formData) return', start);

if (start !== -1 && end !== -1) {
  code = code.substring(0, start) + code.substring(end);
}

fs.writeFileSync('src/components/admin/AdminSettings.tsx', code);
