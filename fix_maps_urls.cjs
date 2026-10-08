const fs = require('fs');
let code = fs.readFileSync('src/components/admin/AdminSettings.tsx', 'utf8');

// For Ceremony
code = code.replace(
  /<InputField label="URL Google Maps" value=\{formData\?\.locations\?\.ceremony\?\.googleMapsUrl\} onChange=\{\(v\) => handleChange\('locations', 'googleMapsUrl', v, 'ceremony'\)\} \/>/,
  `<InputField label="URL Google Maps" value={formData?.locations?.ceremony?.googleMapsUrl} onChange={(v) => handleChange('locations', 'googleMapsUrl', v, 'ceremony')} />
            <InputField label="URL Apple Maps" value={formData?.locations?.ceremony?.appleMapsUrl} onChange={(v) => handleChange('locations', 'appleMapsUrl', v, 'ceremony')} />
            <InputField label="URL Waze" value={formData?.locations?.ceremony?.wazeUrl} onChange={(v) => handleChange('locations', 'wazeUrl', v, 'ceremony')} />`
);

// For Reception
code = code.replace(
  /<InputField label="URL Google Maps" value=\{formData\?\.locations\?\.reception\?\.googleMapsUrl\} onChange=\{\(v\) => handleChange\('locations', 'googleMapsUrl', v, 'reception'\)\} \/>/,
  `<InputField label="URL Google Maps" value={formData?.locations?.reception?.googleMapsUrl} onChange={(v) => handleChange('locations', 'googleMapsUrl', v, 'reception')} />
            <InputField label="URL Apple Maps" value={formData?.locations?.reception?.appleMapsUrl} onChange={(v) => handleChange('locations', 'appleMapsUrl', v, 'reception')} />
            <InputField label="URL Waze" value={formData?.locations?.reception?.wazeUrl} onChange={(v) => handleChange('locations', 'wazeUrl', v, 'reception')} />`
);

fs.writeFileSync('src/components/admin/AdminSettings.tsx', code);
