const fs = require('fs');
let code = fs.readFileSync('src/components/map/InteractiveMap.tsx', 'utf8');

// Replace the <AdvancedMarker> children
const oldMarker = /<div style=\{\{\n\s*transform: `scale\(\$\{scale\}\)`,\n\s*transition: 'transform 0\.2s ease',\n\s*\}\}>\n\s*<Pin[\s\S]*?<\/Pin>\n\s*<\/div>/;

const newMarker = `
                          <div style={{
                            width: isSelected ? 44 : isPrimary ? 38 : 32,
                            height: isSelected ? 44 : isPrimary ? 38 : 32,
                            background: pinColor,
                            border: '2.5px solid #ffffff',
                            borderRadius: '9999px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff',
                            fontSize: (isSelected ? 44 : isPrimary ? 38 : 32) * 0.45,
                            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.35)',
                            transition: 'all 0.2s ease',
                          }}>
                            {iconEmoji}
                          </div>
`;

code = code.replace(oldMarker, newMarker);

fs.writeFileSync('src/components/map/InteractiveMap.tsx', code);
