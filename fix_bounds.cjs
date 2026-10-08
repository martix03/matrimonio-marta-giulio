const fs = require('fs');
let code = fs.readFileSync('src/components/map/InteractiveMap.tsx', 'utf8');

// 1. Add mapEffect state
code = code.replace(
  "const [activePlace, setActivePlace] = useState<PlacePOI | null>(null);",
  "const [activePlace, setActivePlace] = useState<PlacePOI | null>(null);\n  const [mapEffect, setMapEffect] = useState<{type: 'fitBounds' | 'panTo', data: any}>({ type: 'fitBounds', data: [] });"
);

// 2. Update MapController
const oldMapController = /const MapController: React\.FC<\{ activePlace: PlacePOI \| null, places: PlacePOI\[\] \}> = \(\{ activePlace, places \}\) => \{[\s\S]*?return null;\n\};\n/;

const newMapController = `
const MapController: React.FC<{ effect: {type: 'fitBounds' | 'panTo', data: any} }> = ({ effect }) => {
  const map = useMap();
  useEffect(() => {
    if (!map || !window.google) return;
    
    if (effect.type === 'fitBounds' && effect.data.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      effect.data.forEach((p: PlacePOI) => {
        bounds.extend({ lat: p.latitude, lng: p.longitude });
      });
      map.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 });
      // If there's only one pin, zooming too far in might happen.
      if (effect.data.length === 1) {
        setTimeout(() => map.setZoom(14), 100);
      }
    } else if (effect.type === 'panTo' && effect.data) {
      map.panTo({ lat: effect.data.latitude, lng: effect.data.longitude });
      map.setZoom(14);
    }
  }, [map, effect]);
  return null;
};
`;

code = code.replace(oldMapController, newMapController);

// 3. Update <MapController /> usage
code = code.replace(
  "<MapController activePlace={activePlace} places={places} />",
  "<MapController effect={mapEffect} />"
);

// 4. Update initial load fitBounds
code = code.replace(
  "weddingApi.getPlaces().then(p => {\n      setPlaces(p);\n      if (p.length > 0) setActivePlace(p[0]);\n    });",
  "weddingApi.getPlaces().then(p => {\n      setPlaces(p);\n      if (p.length > 0) {\n        setActivePlace(p[0]);\n        setMapEffect({ type: 'fitBounds', data: p });\n      }\n    });"
);

// 5. Update handleSelectPlace
code = code.replace(
  "const handleSelectPlace = (place: PlacePOI) => {\n    setActivePlace(place);\n  };",
  "const handleSelectPlace = (place: PlacePOI) => {\n    setActivePlace(place);\n    setMapEffect({ type: 'panTo', data: place });\n  };"
);

// 6. Update handleCategoryChange
code = code.replace(
  "if (placesInCat.length > 0) {\n      setActivePlace(placesInCat[0]);\n    }",
  "if (placesInCat.length > 0) {\n      setActivePlace(placesInCat[0]);\n      setMapEffect({ type: 'fitBounds', data: placesInCat });\n    }"
);

// 7. Update handleFoodSubFilterChange
code = code.replace(
  "if (subPlaces.length > 0) {\n      setActivePlace(subPlaces[0]);\n    }",
  "if (subPlaces.length > 0) {\n      setActivePlace(subPlaces[0]);\n      setMapEffect({ type: 'fitBounds', data: subPlaces });\n    }"
);

fs.writeFileSync('src/components/map/InteractiveMap.tsx', code);
