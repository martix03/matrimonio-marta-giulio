import React, { useState, useEffect, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, useMap } from '@vis.gl/react-google-maps';
import {
  MapPin,
  Navigation,
  ExternalLink,
  Heart,
  Sparkles,
  Church,
  Castle,
  Bed,
  Scissors,
  Camera,
  UtensilsCrossed,
  Coffee,
  Wine
} from 'lucide-react';
import { PlacePOI, PlaceCategory } from '../../types';
import { weddingApi } from '../../services/supabase';
import { mockPlaces } from '../../services/mockData';
import {
  MiniWave,
  TimeBolle,
  ConfermaBolle,
  Data,
  TimeTitle,
  MappaTitle,
  CascinaTitle,
  CoordinateTitle,
  ViaggioTitle,
  Orchidea,
  CarloCina
} from '../home/GraficaElements';
import backgroundRed from '../../assets/background-red.svg';

const DEFAULT_CATEGORIES: PlaceCategory[] = [
  { id: 'all', label: 'Tutti i Luoghi', marker_color: '#51101d', parent_id: null, sort_order: 0 },
  { id: 'primary', label: 'Cerimonia & Cascina', marker_color: '#51101d', parent_id: null, sort_order: 1 },
  { id: 'hotel', label: 'Hotel & Alloggi', marker_color: '#1e3a8a', parent_id: null, sort_order: 2 },
  { id: 'beauty', label: 'Beauty & Parrucchieri', marker_color: '#c026d3', parent_id: null, sort_order: 3 },
  { id: 'food', label: 'Food & Relax', marker_color: '#9f1239', parent_id: null, sort_order: 4 },
  { id: 'sightseeing', label: 'Da Non Perdere', marker_color: '#d97706', parent_id: null, sort_order: 5 },
];

const DEFAULT_FOOD_CATEGORIES = [
  { id: 'all_food', label: 'Tutti i Locali', marker_color: '#9f1239', parent_id: 'food', sort_order: 10 },
  { id: 'colazione', label: 'Colazione & Bakery', marker_color: '#9f1239', parent_id: 'food', sort_order: 11 },
  { id: 'pizza', label: 'Pizzerie', marker_color: '#9f1239', parent_id: 'food', sort_order: 12 },
  { id: 'cena', label: 'Cucina Piemontese', marker_color: '#9f1239', parent_id: 'food', sort_order: 13 },
  { id: 'pub', label: 'Pub & Burger', marker_color: '#9f1239', parent_id: 'food', sort_order: 14 }
];




class MapErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any) {
    console.warn('MapErrorBoundary captured error:', error);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full min-h-[360px] sm:min-h-[460px] flex flex-col items-center justify-center bg-cream/70 text-burgundy p-6 text-center rounded-3xl">
          <MapPin className="w-8 h-8 text-burgundy mb-2 opacity-60" />
          <p className="font-serif text-lg font-medium mb-1">Mappa dei Luoghi</p>
          <p className="text-xs text-burgundy/70 max-w-xs mb-4">
            Puoi consultare tutti i dettagli dei luoghi nell'elenco laterale.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-burgundy text-paper text-xs rounded-2xl font-semibold uppercase tracking-wider"
          >
            Ricarica mappa
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const MapMarkers: React.FC<{
  places: PlacePOI[];
  activePlace: PlacePOI | null;
  onSelectPlace: (place: PlacePOI) => void;
  renderPlaceIcon: (place: PlacePOI, className?: string) => React.ReactNode;
  getPinColor: (place: PlacePOI) => string;
}> = ({ places, activePlace, onSelectPlace, renderPlaceIcon, getPinColor }) => {
  const map = useMap();
  // Do NOT render markers until the map instance is fully created and attached to DOM
  if (!map) return null;

  return (
    <>
      {places.map(place => {
        const isSelected = activePlace?.id === place.id;
        const isPrimary = place.category === 'ceremony' || place.category === 'reception';
        const pinColor = getPinColor(place);

        return (
          <AdvancedMarker
            key={place.id}
            position={{ lat: place.latitude, lng: place.longitude }}
            onClick={() => onSelectPlace(place)}
            zIndex={isSelected ? 100 : isPrimary ? 50 : 10}
          >
            <div style={{
              width: isSelected ? 42 : isPrimary ? 36 : 30,
              height: isSelected ? 42 : isPrimary ? 36 : 30,
              background: pinColor,
              border: '2px solid #ffffff',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.35)',
              transition: 'all 0.2s ease',
            }}>
              {renderPlaceIcon(place, isSelected ? "w-5 h-5 text-white" : isPrimary ? "w-4 h-4 text-white" : "w-3.5 h-3.5 text-white")}
            </div>
          </AdvancedMarker>
        );
      })}
    </>
  );
};

const MapController: React.FC<{ effect: { type: 'fitBounds' | 'panTo', data: any } }> = ({ effect }) => {
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

export const InteractiveMap: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [foodSubFilter, setFoodSubFilter] = useState<string>('all_food');
  const [places, setPlaces] = useState<PlacePOI[]>(mockPlaces);
  const [activePlace, setActivePlace] = useState<PlacePOI | null>(mockPlaces[0] || null);
  const [mapEffect, setMapEffect] = useState<{ type: 'fitBounds' | 'panTo', data: any }>({ type: 'fitBounds', data: mockPlaces });
  const [categories, setCategories] = useState<PlaceCategory[]>(DEFAULT_CATEGORIES);
  const [foodCategories, setFoodCategories] = useState<any[]>(DEFAULT_FOOD_CATEGORIES);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDummyKeyForDevelopmentAndDemo';
  const poiListRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  useEffect(() => {
    weddingApi.getPlaces().then(p => {
      if (p && p.length > 0) {
        setPlaces(p);
        setActivePlace(p[0]);
        setMapEffect({ type: 'fitBounds', data: p });
      }
    });
    weddingApi.getPlaceCategories().then(cats => {
      if (cats && cats.length > 0) {
        setCategories(cats);
      }
    });
    weddingApi.getFoodCategories().then(foodCats => {
      if (foodCats && foodCats.length > 0) {
        setFoodCategories(foodCats);
      }
    });
  }, []);

  const primaryCategories = (categories && categories.length > 0 ? categories : DEFAULT_CATEGORIES)
    .filter(c => !c.parent_id || c.parent_id === null)
    .sort((a, b) => a.sort_order - b.sort_order);

  const renderPlaceIcon = (place: PlacePOI, className = "w-4 h-4") => {
    if (place.category === 'ceremony') return <Church className={className} />;
    if (place.category === 'reception') return <Castle className={className} />;
    if (place.category === 'hotel') return <Bed className={className} />;
    if (place.category === 'beauty') return <Scissors className={className} />;
    if (place.category === 'sightseeing') return <Camera className={className} />;
    if (place.category === 'food') {
      if (place.food_type === 'colazione') return <Coffee className={className} />;
      if (place.food_type === 'cena') return <Wine className={className} />;
      return <UtensilsCrossed className={className} />;
    }
    return <MapPin className={className} />;
  };

  const getPlaceCategoryBadge = (place: PlacePOI): string => {
    if (place.category === 'ceremony') return 'Sede Cerimonia';
    if (place.category === 'reception') return 'Sede Ricevimento';
    if (place.category === 'hotel') return 'Hotel & Alloggi';
    if (place.category === 'beauty') return 'Beauty & Parrucchieri';
    if (place.category === 'sightseeing') return 'Da Non Perdere';
    if (place.category === 'food') {
      const sub = foodCategories.find(c => c.id === place.food_type);
      if (sub) return sub.label.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim();
      switch (place.food_type) {
        case 'colazione': return 'Colazione & Bakery';
        case 'pizza': return 'Pizzeria';
        case 'pub': return 'Pub & Burger';
        case 'cena': return 'Cucina Piemontese';
        default: return 'Food & Wine';
      }
    }
    const cat = categories.find(c => c.id === place.category);
    if (cat) return cat.label.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim();
    return 'Punto d\'Interesse';
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



  const scrollToPlace = (placeId: string) => {
    setTimeout(() => {
      const container = poiListRef.current;
      const item = itemRefs.current[placeId];
      if (container && item) {
        const containerRect = container.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();
        const targetTop = container.scrollTop + (itemRect.top - containerRect.top) - 4;
        container.scrollTo({
          top: Math.max(0, targetTop),
          behavior: 'smooth'
        });
      }
    }, 50);
  };

  const handleSelectPlace = (place: PlacePOI, scrollToList = false) => {
    setActivePlace(place);
    if (scrollToList) {
      scrollToPlace(place.id);
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
      setMapEffect({ type: 'fitBounds', data: placesInCat });
      setTimeout(() => {
        poiListRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    }
  };

  const handleFoodSubFilterChange = (subId: string) => {
    setFoodSubFilter(subId);
    const subPlaces = places.filter(p => p.category === 'food' && (subId === 'all_food' || p.food_type === subId));
    if (subPlaces.length > 0) {
      setActivePlace(subPlaces[0]);

    }
  };

  const cleanLabel = (text: string) => {
    return text ? text.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, '').trim() : '';
  };

  return (
    <section id="mappa" className="bg-[#fffcf7]">
      <div className="relative overflow-hidden">
      

  {/* 1. Deep Burgundy Banner from grafica.svg */}
        <div className="relative overflow-hidden bg-[#8c2035] text-white pl-8 pr-8 pt-8 lg:pt-16 pb-16 lg:pb-32 ">
         
          {/* ONDA A 2 CURVE (sale e scende) */}
  <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none pointer-events-none z-10">
    <svg
      className="relative block w-full h-12 sm:h-20 lg:h-28"
      viewBox="0 0 1200 360"
      preserveAspectRatio="none"
    >
      <path
        d="M 0,56 C 257,56 461,358 725,358 C 909,358 1106,206 1200,127 L 1200,360 L 0,360 Z"
        fill="#fffcf7"
      />
    </svg>
  </div>
          
          <TimeBolle className="absolute top-0 right-0 w-1/3 lg:w-[15%]" />

          <div className="flex flex-col items-start lg:items-center mt-6">
            <MappaTitle className="h-16 lg:h-20 w-auto mb-2" />
            <MiniWave color="#667b4e" className="w-44 lg:w-60 h-auto my-2" strokeWidth={1.5} lgStrokeWidth={1} />
            <p className="text-xs lg:text-lg text-white/80 leading-relaxed font-light mt-2 text-left lg:text-center">
                              I luoghi della cerimonia, del ricevimento e una selezione curata per chi soggiorna nei dintorni.

            </p>
          </div>
        </div>


        <div className=" relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          {/* Category Filter Pills */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-3 mb-2 no-scrollbar mb-8">
            {primaryCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${selectedCategory === cat.id
                    ? 'bg-[#de868a] text-paper shadow-sm'
                    : 'bg-paper text-burgundy border border-blush/40 hover:border-burgundy'
                  }`}
              >
                {cleanLabel(cat.label)}
              </button>
            ))}
          </div>


          {places.length === 0 ? (
            <div className="text-center text-burgundy py-10">Caricamento mappa in corso...</div>
          ) : (

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-7 rounded-4xl overflow-hidden shadow-wedding border border-blush/30 min-h-[360px] sm:min-h-[460px] relative bg-paper flex flex-col">
                <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 px-3 py-1.5 bg-paper/90 backdrop-blur-md rounded-full shadow-md border border-blush/40 text-xs font-semibold text-burgundy">
                  <MapPin className="w-3.5 h-3.5 text-burgundy" />
                  <span>Mappa Google Maps</span>
                </div>
                <div className="w-full h-full min-h-[360px] sm:min-h-[460px] z-10">
                  <MapErrorBoundary>
                    <APIProvider apiKey={googleMapsApiKey}>
                      <Map
                        defaultZoom={11}
                        defaultCenter={{ lat: 45.075, lng: 7.550 }}
                        mapId="DEMO_MAP_ID"
                        disableDefaultUI={true}
                        zoomControl={true}
                        gestureHandling="greedy"
                      >
                        <MapController effect={mapEffect} />
                        <MapMarkers
                          places={filteredPlaces}
                          activePlace={activePlace}
                          onSelectPlace={(place) => handleSelectPlace(place, true)}
                          renderPlaceIcon={renderPlaceIcon}
                          getPinColor={getPinColor}
                        />
                      </Map>
                    </APIProvider>
                  </MapErrorBoundary>
                </div>
              </div>

              {activePlace && (
                <div className="lg:col-span-5 flex flex-col justify-between space-y-4">

                  <div className="relative overflow-hidden p-6 rounded-3xl bg-paper shadow-wedding border-1 border-blush/40 animate-fade-in space-y-4">
                    <TimeBolle className="absolute bottom-0 -right-8 w-24 z-0 pointer-events-none" />

                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-[#de868a] text-white font-semibold">
                          {getPlaceCategoryBadge(activePlace)}
                        </span>
                      </div>
                      <h3 className="font-serif text-2xl text-burgundy font-medium leading-tight">
                        {activePlace.name}
                      </h3>
                      <p className="text-xs text-burgundy/70 mt-1 flex items-start gap-1">
                        <span>{activePlace.address}</span>
                      </p>
                    </div>

                    <div className="relative flex items-center gap-2 pt-2">
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(activePlace.name + ' ' + activePlace.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 z-10 px-3 rounded-2xl bg-burgundy hover:bg-burgundy-light text-paper text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Indicazioni</span>
                      </a>
                      {activePlace.website_url && (
                        <a
                          href={activePlace.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2.5 z-10 px-3 rounded-2xl bg-cream hover:bg-blush-soft border border-blush/40 text-burgundy text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col min-h-0">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-burgundy/60 px-1 mb-2">
                      Tutti i punti consigliati ({filteredPlaces.length}):
                    </div>
                    <div
                      ref={poiListRef}
                      className={`space-y-2 max-h-56 overflow-y-auto pt-1 pr-1 relative ${
                        filteredPlaces.length > 3 ? 'pb-44' : ''
                      }`}
                    >
                      {filteredPlaces.map(place => (
                        <button
                          key={place.id}
                          ref={el => { itemRefs.current[place.id] = el; }}
                          onClick={() => handleSelectPlace(place, false)}
                          className={`w-full p-3 rounded-xl text-left text-xs transition-all flex items-center justify-between ${
                            activePlace.id === place.id
                              ? 'bg-burgundy text-paper font-semibold shadow-sm'
                              : 'bg-paper hover:bg-cream border border-blush/30 text-burgundy'
                          }`}
                        >
                          <span className="flex items-center gap-2 truncate pr-2">
                            <span className={`shrink-0 ${activePlace.id === place.id ? 'text-blush' : 'text-burgundy'}`}>
                              {renderPlaceIcon(place, "w-3.5 h-3.5")}
                            </span>
                            <span className="truncate">{place.name}</span>
                          </span>
                          <span className="text-[10px] opacity-70 shrink-0">
                            {place.category === 'ceremony' ? 'Chiesa' : place.category === 'reception' ? 'Cascina' : place.food_type ? place.food_type : place.category}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
