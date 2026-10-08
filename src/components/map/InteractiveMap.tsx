import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, ExternalLink, Heart, Sparkles } from 'lucide-react';
import { PlacePOI, PlaceCategory } from '../../types';
import { weddingApi } from '../../services/supabase';

export const InteractiveMap: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [foodSubFilter, setFoodSubFilter] = useState<string>('all_food');
  const [places, setPlaces] = useState<PlacePOI[]>([]);
  const [activePlace, setActivePlace] = useState<PlacePOI | null>(null);
  const [categories, setCategories] = useState<PlaceCategory[]>([]);
  const [foodCategories, setFoodCategories] = useState<any[]>([]);
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  useEffect(() => {
    weddingApi.getPlaces().then(p => {
      setPlaces(p);
      if (p.length > 0) setActivePlace(p[0]);
    });
    weddingApi.getPlaceCategories().then(setCategories);
    weddingApi.getFoodCategories().then(setFoodCategories);
  }, []);

  const primaryCategories = categories.sort((a,b) => a.sort_order - b.sort_order);

  const getPlaceIcon = (place: PlacePOI): string => {
    const cat = categories.find(c => c.id === place.category);
    if (place.category === 'food') {
      const sub = foodCategories.find(c => c.id === place.food_type);
      if (sub) return sub.marker_icon;
      switch (place.food_type) {
        case 'colazione': return '🥐';
        case 'pizza': return '🍕';
        case 'pub': return '🍔';
        case 'cena': return '🍷';
        default: return '🍷';
      }
    }
    if (cat) return cat.marker_icon;
    if (place.category === 'ceremony') return '⛪';
    if (place.category === 'reception') return '🏰';
    if (place.category === 'hotel') return '🏨';
    if (place.category === 'beauty') return '💇';
    if (place.category === 'sightseeing') return '📸';
    return '📍';
  };

  const getPlaceCategoryBadge = (place: PlacePOI): string => {
    const cat = categories.find(c => c.id === place.category);
    if (place.category === 'food') {
      const sub = foodCategories.find(c => c.id === place.food_type);
      if (sub) return sub.label;
      switch (place.food_type) {
        case 'colazione': return '🥐 Colazione & Bakery';
        case 'pizza': return '🍕 Pizzeria';
        case 'pub': return '🍔 Pub & Burger';
        case 'cena': return '🍷 Piemontese';
        default: return '🍷 Food & Relax';
      }
    }
    if (cat) return cat.label;
    if (place.category === 'ceremony') return '⛪ Sede Cerimonia';
    if (place.category === 'reception') return '🏰 Sede Ricevimento';
    if (place.category === 'hotel') return '🏨 Hotel & Alloggi';
    if (place.category === 'beauty') return '💇 Beauty & Parrucchieri';
    if (place.category === 'sightseeing') return '📸 Da Non Perdere';
    return '📍 LUOGO';
  };

  const getPinColor = (place: PlacePOI): string => {
    const cat = categories.find(c => c.id === place.category);
    if (cat) return cat.marker_color;
    return '#51101d';
  };

  const filteredPlaces = places.filter(place => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'primary') return place.category === 'ceremony' || place.category === 'reception';
    if (selectedCategory === 'food') {
      if (foodSubFilter === 'all_food') return place.category === 'food';
      return place.category === 'food' && place.food_type === foodSubFilter;
    }
    return place.category === selectedCategory;
  });

  useEffect(() => {
    if (!mapContainerRef.current || places.length === 0 || !activePlace) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [45.075, 7.550],
        zoom: 11,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        attribution: '&copy; Google Maps',
      }).addTo(map);

      mapInstanceRef.current = map;

      const initialBounds = L.latLngBounds(places.map(p => [p.latitude, p.longitude]));
      if (initialBounds.isValid()) {
        map.fitBounds(initialBounds, { padding: [40, 40], maxZoom: 12 });
      }
    }

    const map = mapInstanceRef.current;

    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};

    filteredPlaces.forEach(place => {
      const isSelected = activePlace.id === place.id;
      const isPrimary = place.category === 'ceremony' || place.category === 'reception';

      const pinColor = getPinColor(place);
      const pinSize = isSelected ? 44 : isPrimary ? 38 : 32;
      const iconEmoji = getPlaceIcon(place);

      const customIcon = L.divIcon({
        className: 'custom-leaflet-pin-wrapper',
        html: `
          <div style="
            width: ${pinSize}px;
            height: ${pinSize}px;
            background: ${pinColor};
            border: 2.5px solid #ffffff;
            border-radius: 9999px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-size: ${pinSize * 0.45}px;
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
            transition: all 0.2s ease;
          ">
            ${iconEmoji}
          </div>
        `,
        iconSize: [pinSize, pinSize],
        iconAnchor: [pinSize / 2, pinSize / 2],
      });

      const marker = L.marker([place.latitude, place.longitude], { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        setActivePlace(place);
      });

      markersRef.current[place.id] = marker;
    });

  }, [filteredPlaces, activePlace, places]);

  const handleSelectPlace = (place: PlacePOI) => {
    setActivePlace(place);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([place.latitude, place.longitude], 14, { duration: 1.2 });
    }
  };

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    setFoodSubFilter('all_food');
    const placesInCat = places.filter(place => {
      if (catId === 'all') return true;
      if (catId === 'primary') return place.category === 'ceremony' || place.category === 'reception';
      return place.category === catId;
    });

    if (placesInCat.length > 0) {
      setActivePlace(placesInCat[0]);
    }

    if (mapInstanceRef.current) {
      if (catId === 'all') {
        const allBounds = L.latLngBounds(places.map(p => [p.latitude, p.longitude]));
        if (allBounds.isValid()) {
          mapInstanceRef.current.fitBounds(allBounds, { padding: [40, 40], maxZoom: 12 });
        }
      } else if (catId === 'sightseeing') {
        const sightBounds = L.latLngBounds(placesInCat.map(p => [p.latitude, p.longitude]));
        if (sightBounds.isValid()) {
          mapInstanceRef.current.fitBounds(sightBounds, { padding: [40, 40], maxZoom: 13 });
        }
      } else if (catId === 'primary') {
        mapInstanceRef.current.flyTo([45.0707046, 7.4514925], 14, { duration: 1.2 });
      } else if (placesInCat.length > 0) {
        const bounds = L.latLngBounds(placesInCat.map(p => [p.latitude, p.longitude]));
        if (bounds.isValid()) {
          mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
        }
      }
    }
  };

  const handleFoodSubFilterChange = (subId: string) => {
    setFoodSubFilter(subId);
    const subPlaces = places.filter(p => p.category === 'food' && (subId === 'all_food' || p.food_type === subId));
    if (subPlaces.length > 0) {
      setActivePlace(subPlaces[0]);
      if (mapInstanceRef.current) {
        const bounds = L.latLngBounds(subPlaces.map(p => [p.latitude, p.longitude]));
        if (bounds.isValid()) {
          mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
        }
      }
    }
  };

  return (
    <section id="mappa" className="py-16 sm:py-24 bg-paper/60 border-y border-blush/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-burgundy/60 font-semibold">
            Guida ai Luoghi
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-burgundy mt-1">
            Mappa &amp; Consigli degli Sposi
          </h2>
          <div className="w-12 h-1 bg-blush rounded-full mx-auto my-3" />
          <p className="text-xs sm:text-sm text-burgundy/70">
            I luoghi della cerimonia, del ricevimento e una selezione curata per chi soggiorna nei dintorni.
          </p>
        </div>

        {places.length === 0 ? (
          <div className="text-center text-burgundy py-10">Caricamento mappa in corso...</div>
        ) : (
          <>
            <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 mb-2 no-scrollbar">
              {primaryCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-burgundy text-paper shadow-sm'
                      : 'bg-paper text-burgundy/70 border border-blush/40 hover:border-burgundy'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {selectedCategory === 'food' && foodCategories.length > 0 && (
              <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-4 no-scrollbar animate-fade-in">
                <span className="text-[11px] font-semibold text-burgundy/60 shrink-0 mr-1">Filtra cibo:</span>
                {foodCategories.map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => handleFoodSubFilterChange(sub.id)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
                      foodSubFilter === sub.id
                        ? 'bg-burgundy text-paper shadow-sm'
                        : 'bg-cream text-burgundy/80 border border-blush/40 hover:border-burgundy'
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-7 rounded-4xl overflow-hidden shadow-wedding border border-blush/30 min-h-[360px] sm:min-h-[460px] relative bg-paper flex flex-col">
                <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 px-3 py-1.5 bg-paper/90 backdrop-blur-md rounded-full shadow-md border border-blush/40 text-xs font-semibold text-burgundy">
                  <span>📍 Mappa Google Maps (Tutti i Pin)</span>
                </div>
                <div ref={mapContainerRef} className="w-full h-full min-h-[360px] sm:min-h-[460px] z-10" />
              </div>

              {activePlace && (
                <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                  <div className="p-6 rounded-3xl bg-paper shadow-wedding border-2 border-blush/40 animate-fade-in space-y-4">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cream text-burgundy font-semibold border border-blush/30">
                          {getPlaceCategoryBadge(activePlace)}
                        </span>
                        {activePlace.is_primary && (
                          <span className="text-xs text-accentGold font-medium flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" /> Luogo Ufficiale
                          </span>
                        )}
                      </div>
                      <h3 className="font-serif text-2xl text-burgundy font-medium leading-tight">
                        {activePlace.name}
                      </h3>
                      <p className="text-xs text-burgundy/70 mt-1 flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 text-blush shrink-0 mt-0.5" />
                        <span>{activePlace.address}</span>
                      </p>
                    </div>

                    {activePlace.sposi_note && (
                      <div className="p-4 rounded-2xl bg-cream border-l-4 border-blush space-y-1">
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-burgundy">
                          <Heart className="w-3 h-3 text-blush fill-blush" />
                          <span>La nota degli sposi:</span>
                        </div>
                        <p className="text-xs italic text-burgundy/80 leading-relaxed font-serif">
                          "{activePlace.sposi_note}"
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-2">
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(activePlace.name + ' ' + activePlace.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 px-3 rounded-full bg-burgundy hover:bg-burgundy-light text-paper text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Indicazioni</span>
                      </a>
                      {activePlace.website_url && (
                        <a
                          href={activePlace.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2.5 px-3 rounded-full bg-cream hover:bg-blush-soft border border-blush/40 text-burgundy text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-burgundy/60 px-1">
                      Tutti i punti consigliati ({filteredPlaces.length}):
                    </div>
                    {filteredPlaces.map(place => (
                      <button
                        key={place.id}
                        onClick={() => handleSelectPlace(place)}
                        className={`w-full p-3 rounded-2xl text-left text-xs transition-all flex items-center justify-between ${
                          activePlace.id === place.id
                            ? 'bg-burgundy text-paper font-semibold shadow-sm'
                            : 'bg-paper hover:bg-cream border border-blush/30 text-burgundy'
                        }`}
                      >
                        <span className="flex items-center gap-2 truncate pr-2">
                          <span className="text-sm shrink-0">{getPlaceIcon(place)}</span>
                          <span className="truncate">{place.name}</span>
                        </span>
                        <span className="text-[10px] opacity-70 shrink-0">
                          {place.category === 'ceremony' ? 'Chiesa' : place.category === 'reception' ? 'Villa' : place.food_type ? place.food_type : place.category}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};
