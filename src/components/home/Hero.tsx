import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import { Cluster } from '../../types';
import carloHeroImg from '../../assets/carlo-hero.png';


import {
  HomeBolle,
  HomeRighe,
  HomeBaffo,
  HomeMartaGiulio,
  HomeCount,
  MiniWave,
  HomeCountOnde,
  HomeCountBaffo
} from './GraficaElements';

interface HeroProps {
  cluster: Cluster | null;
  onOpenRsvp: () => void;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export const Hero: React.FC<HeroProps> = ({ cluster, onOpenRsvp }) => {
  const { settings } = useSettings();
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  useEffect(() => {
    const target = new Date(settings.event.date).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [settings.event.date]);

  const guests = cluster?.guests || [];
  const allResponded = guests.length > 0 && guests.every(g => g.is_attending !== null);
  const allDeclined = guests.length > 0 && guests.every(g => g.is_attending === false);
  const isSingleGuest = guests.length === 1;

  const welcomeGreeting = (() => {
    if (!cluster) return 'Benvenuti';
    const familyName = cluster.family_name || '';
    const isFamily = familyName.toLowerCase().includes('famiglia');
    if (isFamily) return 'Benvenuta';
    if (guests.length >= 2) return 'Benvenuti';
    const singleGuest = guests[0];
    if (singleGuest?.gender) {
      return singleGuest.gender === 'F' ? 'Benvenuta' : 'Benvenuto';
    }
    const firstName = (singleGuest?.first_name || familyName).trim().toLowerCase().split(' ')[0] || '';
    const maleNamesEndingInA = ['andrea', 'luca', 'mattia', 'elia', 'nicola'];
    if (firstName.endsWith('a') && !maleNamesEndingInA.includes(firstName)) {
      return 'Benvenuta';
    }
    return 'Benvenuto';
  })();

  return (
    <section id="home" className="relative pt-24 pb-16 sm:pt-28 sm:pb-24 overflow-hidden bg-[#fbf5f4] text-center">
      {/* 1. Abstract Background Elements from grafica.svg */}
      
      {/* Top Left: 4 Sage Green Waves */}
      <HomeRighe className="absolute top-16 left-0 sm:left-4  w-1/3 sm:w-48 opacity-90 z-0" />

      {/* Top Right: HomeBolle (Burgundy shape, blush blob & sage dots from SVG) */}
      <HomeBolle className="absolute -top-6 -right-6 sm:-right-2 w-1/2 sm:w-1/6 pointer-events-none z-0" />

      {/* Mid Left: Burgundy Painterly Brush Ribbon */}
      <HomeBaffo className="absolute top-56 sm:top-52 -left-4 sm:left-2 w-56 sm:w-1/6 pointer-events-none opacity-90 z-0" />

      {/* Main Content Container */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Responsive Container: Carlo sopra su mobile, Marta & Giulio sopra su desktop */}
        <div className="flex flex-col mt-44" >
          {/* CARLO: 1° su mobile (sopra), 2° su desktop (sotto) */}
          <div className="order-1 lg:order-2 flex justify-end pr-6 sm:pr-8 lg:pr-0 lg:-mr-64 lg:mb-16 group">
            <img
              src={carloHeroImg}
              alt="Carlo con Papillon e Fiori"
              className="w-52 sm:w-52 md:w-52 lg:w-80  lg:-mt-72 object-contain filter drop-shadow-sm select-none group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* MARTA & GIULIO: 2° su mobile (sotto Carlo), 1° su desktop (sopra Carlo) */}
          <div className="order-2 lg:order-1 flex justify-start lg:justify-center mb-12 lg:mb-4">
            <HomeMartaGiulio className="h-60 lg:h-80 w-auto object-contain" />
          </div>
        </div>
     

        {/* Contextual Cluster Greeting Card (when guest is logged in) */}
        {cluster && (
          <div className="max-w-md mx-auto mb-8 p-4 sm:p-5 rounded-3xl bg-white/95 shadow-wedding border border-blush/40 animate-fade-in text-left">
            <div className="flex items-center gap-2 text-[#4a151d] text-sm font-semibold mb-1">
              <div className="w-2 h-2 rounded-full bg-[#667b4e]" />
              <span>{welcomeGreeting}, {cluster.family_name}!</span>
            </div>
            <div className="text-xs sm:text-sm text-[#4a151d]/80 pl-4">
              {allResponded && allDeclined ? (
                <>
                  <p>Grazie per aver risposto all'invito.</p>
                  <span className="block mt-1 font-medium text-[#4a151d]">
                    Ci dispiace che non {isSingleGuest ? 'puoi' : 'possiate'} esserci, {isSingleGuest ? 'ti' : 'vi'} porteremo comunque nel cuore!
                  </span>
                </>
              ) : (
                <>
                  <p>Siamo davvero felici di condividere con {isSingleGuest ? 'te' : 'voi'} questo giorno speciale.</p>
                  {allResponded ? (
                    <span className="inline-flex items-center gap-1.5 mt-2 font-medium text-[#4a151d] bg-[#e5edd8] px-3 py-1 rounded-full text-xs border border-[#667b4e]/40">
                      <Check className="w-3.5 h-3.5 text-[#667b4e]" strokeWidth={2.5} />
                      <span>Grazie per aver confermato la {isSingleGuest ? 'tua' : 'vostra'} presenza</span>
                    </span>
                  ) : (
                    <span className="block mt-1 text-[#4a151d] font-medium">
                      {isSingleGuest ? 'Ti' : 'Vi'} chiediamo gentilmente di confermare la presenza entro il{' '}
                      {settings.event.rsvpDeadline || settings.rsvp?.deadline || '29 Aprile 2027'}.
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Countdown Box Card (Exact match to grafica.svg) */}
        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-wedding border border-blush/30 mb-5 relative overflow-hidden">
          {/* Card Header */}
          <div className="flex items-center mt-6 justify-center mb-4">
            <HomeCount className="h-7 w-auto" color="#4a151d" />
          </div>

          {/* Decorative Baffo in top right (underneath countdown blocks layer) */}
          <HomeCountBaffo className="absolute top-0 right-0 w-16 h-auto pointer-events-none z-0" />

          <HomeCountOnde className="absolute bottom-0 left-0 w-16 h-auto pointer-events-none z-0" />

          {/* 4 Burgundy Countdown Blocks (Layer on top of Baffo) */}
          <div className="m-6">
          <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center text-[#ebd5d4] relative z-10">
            {/* Days */}
            <div className="bg-[#8c2035] rounded-2xl p-2.5 sm:p-3 flex flex-col items-center justify-center shadow-xs">
              <span className="font-sans text-2xl mt-2 mb-2 font-bold tracking-tigh">
                {timeLeft.days}
              </span>
              <MiniWave color="#ebd5d4" className="w-full" strokeWidth={2} />
              <span className="text-xs mt-2 mb-2 tracking-wider uppercase font-semibold">
                Giorni
              </span>
            </div>

            {/* Hours */}
            <div className="bg-[#8c2035] rounded-2xl p-2.5 sm:p-3 flex flex-col items-center justify-center shadow-xs">
              <span className="font-sans text-xl sm:text-2xl mt-2 mb-2  font-bold tracking-tight">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <MiniWave color="#ebd5d4" className="w-full my-0.5" strokeWidth={2} />
              <span className="text-xs mt-2 mb-2  tracking-wider uppercase font-semibold">
                Ore
              </span>
            </div>

            {/* Minutes */}
            <div className="bg-[#8c2035] rounded-2xl p-2.5 sm:p-3 flex flex-col items-center justify-center shadow-xs">
              <span className="font-sans text-xl sm:text-2xl mt-2 mb-2  font-bold tracking-tight">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <MiniWave color="#ebd5d4" className="w-full my-0.5" strokeWidth={2} />
              <span className="text-xs mt-2 mb-2 tracking-wider uppercase font-semibold">
                Minuti
              </span>
            </div>

            {/* Seconds */}
            <div className="bg-[#8c2035] rounded-2xl p-2.5 sm:p-3 flex flex-col items-center justify-center shadow-xs">
              <span className="font-sans text-xl sm:text-2xl mt-2 mb-2 font-bold tracking-tight">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <MiniWave color="#ebd5d4" className="w-full my-0.5" strokeWidth={2} />
              <span className="text-xs mt-2 mb-2 tracking-wider uppercase font-semibold">
                Secondi
              </span>
            </div>
          </div>
            </div>
        </div>

        {/* Wide Full-Width Burgundy RSVP Button (Matching grafica.svg) */}
        <div className="max-w-md mx-auto mb-4">
          <a
            href="#rsvp"
            onClick={onOpenRsvp}
            className="w-full py-4 rounded-2xl bg-[#4a151d] hover:bg-[#6d1828] text-white text-sm font-bold uppercase tracking-widest shadow-wedding hover:shadow-wedding-lg hover:-translate-y-0.5 transition-all flex items-center justify-center"
          >
            <span>{allResponded ? 'Modifica presenza' : 'Conferma presenza'}</span>
          </a>
        </div>

      </div>
    </section>
  );
};
