import React, { useState } from 'react';
import { Navigation, MapPin, ExternalLink, Calendar, Clock, Church, Sparkles } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import {
  MiniWave,
  TimeBolle,
  Data,
  TimeTitle,
  HourTitle,
  CascinaTitle,
  Calla,
  Orchidea
} from './GraficaElements';
import { SectionBanner } from '../common/SectionBanner';

export const QuickFacts: React.FC = () => {
  const { settings } = useSettings();
  const [navModalPlace, setNavModalPlace] = useState<{
    name: string;
    google: string;
    apple: string;
    waze: string;
  } | null>(null);

  const ceremonyNav = (settings.locations.ceremony.googleMapsUrl || settings.locations.ceremony.appleMapsUrl || settings.locations.ceremony.wazeUrl) ? {
    name: settings.locations.ceremony.name,
    google: settings.locations.ceremony.googleMapsUrl,
    apple: settings.locations.ceremony.appleMapsUrl,
    waze: settings.locations.ceremony.wazeUrl,
  } : undefined;

  const receptionNav = (settings.locations.reception.googleMapsUrl || settings.locations.reception.appleMapsUrl || settings.locations.reception.wazeUrl) ? {
    name: settings.locations.reception.name,
    google: settings.locations.reception.googleMapsUrl,
    apple: settings.locations.reception.appleMapsUrl,
    waze: settings.locations.reception.wazeUrl,
  } : undefined;

  return (
    <section id="dettagli" className="bg-white border-y border-blush/20">
      <div className="pb-24 bg-[#fffcf7]">
        {/* Banner testata con titolo grafico e sottotitolo */}
        <SectionBanner
          title={TimeTitle}
          subtitle={
            <>
              Tutte le informazioni chiave a portata di tocco
              <br />
              per raggiungere le sedi dell'evento.
            </>
          }
        />

        {/* 2. Timeline Card (Centered and enlarged for desktop) */}
        <div className="bg-[#fffcf7] rounded-3xl sm:rounded-4xl p-8 sm:p-12 lg:p-16 shadow-xs">
          <div className="max-w-2xl mx-auto flex flex-col items-center text-center">
            <div className="w-full space-y-10 lg:space-y-14 my-2">
              {/* Stop 1: La Data */}
              <div className=" relative flex flex-col items-center text-center">
                <Orchidea className="absolute right-0 lg:-right-8 top-16 -translate-y-1/2 w-1/4 h-auto -scale-x-100 pointer-events-none" />
                <span className="body uppercase tracking-widest text-[#4a151d]/70 font-semibold block mb-1">
                  La data
                </span>
                <Data className="mt-2 h-7 sm:h-8 lg:h-12 w-auto mx-auto" />
              </div>

              {/* Stop 2: Gli Orari */}
              <div className="flex flex-col items-center text-center">
                <span className="body uppercase tracking-widest text-[#4a151d]/70 font-semibold block mb-1">
                  Gli Orari
                </span>
                <HourTitle className="mt-2 mb-2 h-5 sm:h-6 lg:h-8 w-auto mx-auto" />
                <p className="body text-[#4a151d]/75 mt-1 max-w-md">
                  {settings.event.ceremonyTime || 'Arrivo gradito entro le 16:45'}
                </p>
              </div>

              {/* Stop 3: La Cerimonia */}
              <div className="flex flex-col items-center text-center">
                <span className="body uppercase tracking-widest text-[#4a151d]/70 font-semibold block mb-1">
                  La cerimonia
                </span>
                <CascinaTitle className="mt-2 mb-2 h-6 sm:h-7 lg:h-10 w-auto mx-auto" />
                <p className="body text-[#4a151d]/75 mt-1 max-w-md">
                  {settings.locations.ceremony.address.includes(', ') ? (
                    <>
                      <span>{settings.locations.ceremony.address.split(', ')[0]}</span>
                      <span className="hidden sm:inline">, </span>
                      <br className="sm:hidden" />
                      <span>{settings.locations.ceremony.address.split(', ').slice(1).join(', ')}</span>
                    </>
                  ) : (
                    settings.locations.ceremony.address
                  )}
                </p>
                {ceremonyNav && (
                  <button
                    onClick={() => setNavModalPlace(ceremonyNav)}
                    className="mt-3.5 inline-flex items-center gap-2 px-5 py-2 lg:px-6 lg:py-2.5 rounded-xl bg-white hover:bg-[#e5edd8] border border-[#667b4e]/30 text-[#4a151d] body font-semibold tracking-wide transition-all shadow-xs hover:shadow-sm"
                  >
                    <Navigation className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-[#667b4e]" />
                    <span>Apri Navigatore</span>
                  </button>
                )}
              </div>

              {/* Stop 4: La Festa / Il Ricevimento */}
              <div className="relative flex flex-col items-center text-center">
                <Calla className="absolute -left-20 lg:-left-56 -translate-y-1/2 w-1/2 h-auto pointer-events-none" />

                <span className="body uppercase tracking-widest text-[#4a151d]/70 font-semibold block mb-1">
                  La festa
                </span>
                <CascinaTitle className="mt-2 mb-2 h-6 sm:h-7 lg:h-10 w-auto mx-auto" />
                <p className="body text-[#4a151d]/75 mt-1 max-w-md">
                  {(() => {
                    const text = settings.event.receptionTime || 'A seguire, aperitivo, cena e festa nello stesso luogo';
                    const target = 'cena';
                    const idx = text.indexOf(target);
                    if (idx !== -1) {
                      const before = text.slice(0, idx + target.length);
                      const after = text.slice(idx + target.length).trimStart();
                      return (
                        <>
                          <span>{before}</span>
                          <br className="sm:hidden" />
                          <span className="hidden sm:inline"> </span>
                          <span>{after}</span>
                        </>
                      );
                    }
                    return text;
                  })()}
                </p>
                {receptionNav && (
                  <button
                    onClick={() => setNavModalPlace(receptionNav)}
                    className="mt-3.5 inline-flex items-center gap-2 px-5 py-2 lg:px-6 lg:py-2.5 rounded-xl bg-white hover:bg-[#e5edd8] border border-[#667b4e]/30 text-[#4a151d] body font-semibold tracking-wide transition-all shadow-xs hover:shadow-sm"
                  >
                    <Navigation className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-[#667b4e]" />
                    <span>Apri Navigatore</span>
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Navigation App Chooser Modal (Google / Apple / Waze) */}
      {navModalPlace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4a151d]/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-sm bg-white rounded-2xl p-6 shadow-wedding-lg border border-blush/40 text-center">
            <div className="w-12 h-12 rounded-full bg-[#e5edd8] flex items-center justify-center mx-auto mb-3">
              <MapPin className="w-6 h-6 text-[#667b4e]" />
            </div>
            <h3 className="titolo font-semibold text-[#4a151d] mb-1">
              Naviga verso
            </h3>
            <p className="body text-[#4a151d]/80 mb-5 font-medium">
              {navModalPlace.name}
            </p>

            <div className="flex flex-col gap-2.5">
              {navModalPlace.google && (
                <a
                  href={navModalPlace.google}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-2xl bg-cream hover:bg-[#e5edd8] border border-blush/30 text-[#4a151d] body font-semibold flex items-center justify-between transition-colors"
                >
                  <span>Apri in Google Maps</span>
                  <ExternalLink className="w-4 h-4 text-[#4a151d]/60" />
                </a>
              )}
              {navModalPlace.apple && (
                <a
                  href={navModalPlace.apple}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-2xl bg-cream hover:bg-[#e5edd8] border border-blush/30 text-[#4a151d] body font-semibold flex items-center justify-between transition-colors"
                >
                  <span>Apri in Apple Maps</span>
                  <ExternalLink className="w-4 h-4 text-[#4a151d]/60" />
                </a>
              )}
              {navModalPlace.waze && (
                <a
                  href={navModalPlace.waze}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-2xl bg-cream hover:bg-[#e5edd8] border border-blush/30 text-[#4a151d] body font-semibold flex items-center justify-between transition-colors"
                >
                  <span>Apri in Waze</span>
                  <ExternalLink className="w-4 h-4 text-[#4a151d]/60" />
                </a>
              )}
            </div>

            <button
              onClick={() => setNavModalPlace(null)}
              className="mt-5 body text-[#4a151d]/60 hover:text-[#4a151d] underline transition-colors"
            >
              Chiudi
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
