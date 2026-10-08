const fs = require('fs');
let code = fs.readFileSync('src/components/map/InteractiveMap.tsx', 'utf8');

// Replace imports
code = code.replace("import L from 'leaflet';", "import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';");

// Insert API Key reading
code = code.replace(
  "const mapContainerRef = useRef<HTMLDivElement>(null);",
  "const mapContainerRef = useRef<HTMLDivElement>(null);\n  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDummyKeyForDevelopmentAndDemo';"
);

// Remove the whole useEffect for leaflet
code = code.replace(/useEffect\(\(\) => \{\n    if \(\!mapContainerRef\.current(?:.|\n)*?\}, \[filteredPlaces, activePlace, places\]\);/, "");

// Fix handleSelectPlace and flyTo
code = code.replace(/if \(mapInstanceRef\.current\) \{\n      mapInstanceRef\.current\.flyTo\(\[place\.latitude, place\.longitude\], 14, \{ duration: 1\.2 \}\);\n    \}/, "");

// Replace handleCategoryChange map flyTo logic
code = code.replace(/if \(mapInstanceRef\.current\) \{(?:.|\n)*?\n    \}/, "");
code = code.replace(/if \(mapInstanceRef\.current\) \{(?:.|\n)*?\n      \}/, ""); // Handle the food filter mapInstanceRef check

// Now the JSX rendering
const jsxLeaflet = `<div ref={mapContainerRef} className="w-full h-full min-h-[360px] sm:min-h-[460px] z-10" />`;
const jsxGoogle = `<div className="w-full h-full min-h-[360px] sm:min-h-[460px] z-10">
                  <APIProvider apiKey={googleMapsApiKey}>
                    <Map 
                      defaultZoom={11} 
                      defaultCenter={{ lat: 45.075, lng: 7.550 }}
                      center={activePlace ? { lat: activePlace.latitude, lng: activePlace.longitude } : undefined}
                      zoom={activePlace ? 14 : 11}
                      mapId="DEMO_MAP_ID"
                      disableDefaultUI={true}
                      zoomControl={true}
                    >
                      {filteredPlaces.map(place => {
                        const isSelected = activePlace?.id === place.id;
                        const isPrimary = place.category === 'ceremony' || place.category === 'reception';
                        const pinColor = getPinColor(place);
                        const iconEmoji = getPlaceIcon(place);
                        const scale = isSelected ? 1.4 : isPrimary ? 1.2 : 1.0;

                        return (
                          <AdvancedMarker 
                            key={place.id}
                            position={{ lat: place.latitude, lng: place.longitude }}
                            onClick={() => handleSelectPlace(place)}
                            zIndex={isSelected ? 100 : isPrimary ? 50 : 10}
                          >
                            <div style={{
                              transform: \`scale(\${scale})\`,
                              transition: 'transform 0.2s ease',
                            }}>
                              <Pin 
                                background={pinColor} 
                                borderColor="#ffffff" 
                                glyphColor="#ffffff" 
                                scale={1}
                              >
                                <div style={{ fontSize: '14px', lineHeight: '14px' }}>
                                  {iconEmoji}
                                </div>
                              </Pin>
                            </div>
                          </AdvancedMarker>
                        );
                      })}
                    </Map>
                  </APIProvider>
                </div>`;

code = code.replace(jsxLeaflet, jsxGoogle);

fs.writeFileSync('src/components/map/InteractiveMap.tsx', code);
