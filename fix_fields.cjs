const fs = require('fs');

// 1. Update AdminSettings.tsx
let adminCode = fs.readFileSync('src/components/admin/AdminSettings.tsx', 'utf8');

const oldGroups = adminCode.match(/\{\/\* Dettagli Evento \*\/\}[\s\S]*?\{\/\* Iban \/ Lista Nozze \*\/\}/)[0].replace('{/* Iban / Lista Nozze */}', '');

const newGroups = `
          {/* Orari Evento */}
          <div className="space-y-4">
            <h3 className="font-semibold text-burgundy flex items-center gap-2 border-b border-blush/30 pb-2">
              <Calendar className="w-4 h-4 text-blush" /> Orari
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Ora Evento (es. Ore 17:00)" value={formData?.event?.time} onChange={(v) => handleChange('event', 'time', v)} />
              <InputField label="Info Orario (es. Arrivo gradito...)" value={formData?.event?.ceremonyTime} onChange={(v) => handleChange('event', 'ceremonyTime', v)} />
            </div>
            <InputField label="Data Mostrata (es. Sabato 29 Maggio 2027)" value={formData?.event?.displayDate} onChange={(v) => handleChange('event', 'displayDate', v)} />
          </div>

          {/* Sede Cerimonia */}
          <div className="space-y-4">
            <h3 className="font-semibold text-burgundy flex items-center gap-2 border-b border-blush/30 pb-2">
              <MapPin className="w-4 h-4 text-blush" /> Sede Cerimonia
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Città" value={formData?.locations?.ceremony?.city} onChange={(v) => handleChange('locations', 'city', v, 'ceremony')} />
              <InputField label="Nome Location" value={formData?.locations?.ceremony?.name} onChange={(v) => handleChange('locations', 'name', v, 'ceremony')} />
            </div>
            <InputField label="Indirizzo / Info" value={formData?.locations?.ceremony?.address} onChange={(v) => handleChange('locations', 'address', v, 'ceremony')} />
            <InputField label="URL Google Maps" value={formData?.locations?.ceremony?.googleMapsUrl} onChange={(v) => handleChange('locations', 'googleMapsUrl', v, 'ceremony')} />
          </div>

          {/* Sede Ricevimento */}
          <div className="space-y-4">
            <h3 className="font-semibold text-burgundy flex items-center gap-2 border-b border-blush/30 pb-2">
              <MapPin className="w-4 h-4 text-blush" /> Sede Ricevimento
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Città" value={formData?.locations?.reception?.city} onChange={(v) => handleChange('locations', 'city', v, 'reception')} />
              <InputField label="Nome Location" value={formData?.locations?.reception?.name} onChange={(v) => handleChange('locations', 'name', v, 'reception')} />
            </div>
            <InputField label="Info Ricevimento" value={formData?.event?.receptionTime} onChange={(v) => handleChange('event', 'receptionTime', v)} />
            <InputField label="Indirizzo" value={formData?.locations?.reception?.address} onChange={(v) => handleChange('locations', 'address', v, 'reception')} />
            <InputField label="URL Google Maps" value={formData?.locations?.reception?.googleMapsUrl} onChange={(v) => handleChange('locations', 'googleMapsUrl', v, 'reception')} />
          </div>
`;

adminCode = adminCode.replace(oldGroups, newGroups + "\n          {/* Iban / Lista Nozze */}");
fs.writeFileSync('src/components/admin/AdminSettings.tsx', adminCode);

// 2. Update QuickFacts.tsx
let factsCode = fs.readFileSync('src/components/home/QuickFacts.tsx', 'utf8');

factsCode = factsCode.replace("main: 'Ore 17:00'", "main: settings.event.time || 'Ore 17:00'");
factsCode = factsCode.replace("badge: 'Arrivo ore 16:45'", "badge: settings.event.time || 'Ore 17:00'");
factsCode = factsCode.replace("badge: 'Buttigliera Alta (TO)'", "badge: settings.locations.ceremony.city || 'Buttigliera Alta'");
factsCode = factsCode.replace("badge: 'Stessa location'", "badge: settings.locations.reception.city || 'Stessa location'");

fs.writeFileSync('src/components/home/QuickFacts.tsx', factsCode);

