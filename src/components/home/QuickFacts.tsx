import React, { useState } from 'react';
import { Calendar, Clock, Church, Castle, Navigation, MapPin, ExternalLink } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';

import calendarIcon from '../../assets/calendar-icon.jpg';

export const QuickFacts: React.FC = () => {
  const { settings } = useSettings();
  const [navModalPlace, setNavModalPlace] = useState<{
    name: string;
    google: string;
    apple: string;
    waze: string;
  } | null>(null);

  const facts = [
    {
      image: calendarIcon,
      title: 'La Data',
      main: settings.event.displayDate,
      subtitle: 'Segna la data in agenda',
      badge: 'Save the Date',
    },
    {
      icon: Clock,
      title: 'Gli Orari',
      main: 'Ore 17:00',
      subtitle: settings.event.ceremonyTime,
      badge: 'Arrivo ore 16:45',
    },
    {
      icon: Church,
      title: 'La Cerimonia',
      main: settings.locations.ceremony.name,
      subtitle: settings.locations.ceremony.address,
      badge: 'Buttigliera Alta (TO)',
      nav: {
        name: settings.locations.ceremony.name,
        google: settings.locations.ceremony.googleMapsUrl,
        apple: settings.locations.ceremony.appleMapsUrl,
        waze: settings.locations.ceremony.wazeUrl,
      }
    },
    {
      icon: Castle,
      title: 'Il Ricevimento',
      main: settings.locations.reception.name,
      subtitle: settings.event.receptionTime,
      badge: 'Stessa location',
      nav: {
        name: settings.locations.reception.name,
        google: settings.locations.reception.googleMapsUrl,
        apple: settings.locations.reception.appleMapsUrl,
        waze: settings.locations.reception.wazeUrl,
      }
    },
  ];

  return (
    <section id="dettagli" className="py-16 sm:py-20 bg-paper/60 border-y border-blush/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-burgundy/60 font-semibold">
            Wedding Flash Info
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-burgundy mt-1">
            I Dettagli Essenziali
          </h2>
          <div className="w-12 h-1 bg-blush rounded-full mx-auto my-3" />
          <p className="text-xs sm:text-sm text-burgundy/70">
            Tutte le informazioni chiave a portata di tocco per raggiungere le sedi dell'evento.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {facts.map((fact, idx) => {
            const Icon = fact.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-paper shadow-wedding border border-blush/30 flex flex-col justify-between hover:shadow-wedding-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-blush-soft text-burgundy flex items-center justify-center shrink-0 overflow-hidden">
                      {fact.image ? (
                        <img src={fact.image} alt="Icon" className="w-full h-full object-cover mix-blend-multiply" />
                      ) : (
                        Icon && <Icon className="w-5 h-5 text-burgundy" />
                      )}
                    </div>
                    <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-cream text-burgundy/80 border border-blush/20 whitespace-nowrap">
                      {fact.badge}
                    </span>
                  </div>
                  <h3 className="text-xs uppercase tracking-widest text-burgundy/60 font-semibold mb-1">
                    {fact.title}
                  </h3>
                  <p className="font-serif text-lg sm:text-xl text-burgundy leading-snug font-medium mb-2">
                    {fact.main}
                  </p>
                  <p className="text-xs text-burgundy/70 leading-relaxed">
                    {fact.subtitle}
                  </p>
                </div>

                {fact.nav && (
                  <div className="mt-5 pt-4 border-t border-blush/20">
                    <button
                      onClick={() => setNavModalPlace(fact.nav!)}
                      className="w-full py-2 px-3 rounded-full bg-cream hover:bg-blush-soft border border-blush/40 text-burgundy text-xs font-semibold tracking-wide flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Apri Navigatore</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation App Chooser Modal */}
      {navModalPlace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-burgundy/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-sm bg-paper rounded-3xl p-6 shadow-wedding-lg border border-blush/40 text-center">
            <div className="w-12 h-12 rounded-full bg-blush-soft flex items-center justify-center mx-auto mb-3">
              <MapPin className="w-6 h-6 text-burgundy" />
            </div>
            <h3 className="font-serif text-xl text-burgundy mb-1">
              Naviga verso
            </h3>
            <p className="text-xs text-burgundy/70 mb-5 font-medium">
              {navModalPlace.name}
            </p>

            <div className="flex flex-col gap-2.5">
              <a
                href={navModalPlace.google}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-2xl bg-cream hover:bg-blush-soft border border-blush/30 text-burgundy text-xs font-semibold flex items-center justify-between transition-colors"
              >
                <span>Apri in Google Maps</span>
                <ExternalLink className="w-4 h-4 text-burgundy/60" />
              </a>
              <a
                href={navModalPlace.apple}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-2xl bg-cream hover:bg-blush-soft border border-blush/30 text-burgundy text-xs font-semibold flex items-center justify-between transition-colors"
              >
                <span>Apri in Apple Maps</span>
                <ExternalLink className="w-4 h-4 text-burgundy/60" />
              </a>
              <a
                href={navModalPlace.waze}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-2xl bg-cream hover:bg-blush-soft border border-blush/30 text-burgundy text-xs font-semibold flex items-center justify-between transition-colors"
              >
                <span>Apri in Waze</span>
                <ExternalLink className="w-4 h-4 text-burgundy/60" />
              </a>
            </div>

            <button
              onClick={() => setNavModalPlace(null)}
              className="mt-5 text-xs text-burgundy/60 hover:text-burgundy underline transition-colors"
            >
              Chiudi
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
