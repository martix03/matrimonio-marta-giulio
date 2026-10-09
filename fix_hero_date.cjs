const fs = require('fs');

let heroCode = fs.readFileSync('src/components/home/Hero.tsx', 'utf8');

const derivedDate = `new Date(settings.event.date).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).replace(/^\\w/, c => c.toUpperCase())`;

heroCode = heroCode.replace(
  /\{settings\.event\.displayDate\}/g,
  `{${derivedDate}}`
);

fs.writeFileSync('src/components/home/Hero.tsx', heroCode);
