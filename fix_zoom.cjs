const fs = require('fs');
let code = fs.readFileSync('src/components/map/InteractiveMap.tsx', 'utf8');

// 1. Import useMap
code = code.replace(
  "import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';",
  "import { APIProvider, Map, AdvancedMarker, Pin, useMap } from '@vis.gl/react-google-maps';"
);

// 2. We need a MapController component that calls useMap inside APIProvider
const mapControllerJSX = `
const MapController: React.FC<{ activePlace: PlacePOI | null, places: PlacePOI[] }> = ({ activePlace, places }) => {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    if (activePlace) {
      map.panTo({ lat: activePlace.latitude, lng: activePlace.longitude });
      map.setZoom(14);
    } else if (places.length > 0) {
      map.panTo({ lat: places[0].latitude, lng: places[0].longitude });
      map.setZoom(11);
    }
  }, [map, activePlace]);
  return null;
};
`;

code = code.replace("export const InteractiveMap: React.FC = () => {", mapControllerJSX + "\nexport const InteractiveMap: React.FC = () => {");

// 3. Add <MapController /> inside <Map> and fix <Map> props
code = code.replace(/<Map\s+defaultZoom=\{11\}\s+defaultCenter=\{\{ lat: 45\.075, lng: 7\.550 \}\}\s+center=\{.*\}\s+zoom=\{.*\}\s+mapId="DEMO_MAP_ID"/, 
`<Map 
                      defaultZoom={11} 
                      defaultCenter={{ lat: 45.075, lng: 7.550 }}
                      mapId="DEMO_MAP_ID"`);

code = code.replace(/<MapId="DEMO_MAP_ID"/g, '<Map mapId="DEMO_MAP_ID"'); // fallback cleanup if regex failed
code = code.replace(
  /<Map\s+defaultZoom=\{11\}\s+defaultCenter=\{\{ lat: 45\.075, lng: 7\.550 \}\}\s+mapId="DEMO_MAP_ID"\s+disableDefaultUI=\{true\}\s+zoomControl=\{true\}\s+>/,
  `<Map 
                      defaultZoom={11} 
                      defaultCenter={{ lat: 45.075, lng: 7.550 }}
                      mapId="DEMO_MAP_ID"
                      disableDefaultUI={true}
                      zoomControl={true}
                      gestureHandling="greedy"
                    >
                      <MapController activePlace={activePlace} places={places} />`
);

fs.writeFileSync('src/components/map/InteractiveMap.tsx', code);
