const fs = require('fs');

let factsCode = fs.readFileSync('src/components/home/QuickFacts.tsx', 'utf8');

// I need to add `nav: ` before the condition
factsCode = factsCode.replace(
  /\(settings\.locations\.ceremony\.googleMapsUrl/g,
  `nav: (settings.locations.ceremony.googleMapsUrl`
);

factsCode = factsCode.replace(
  /\(settings\.locations\.reception\.googleMapsUrl/g,
  `nav: (settings.locations.reception.googleMapsUrl`
);

fs.writeFileSync('src/components/home/QuickFacts.tsx', factsCode);
