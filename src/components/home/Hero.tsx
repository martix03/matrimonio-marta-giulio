import React, { useState, useEffect } from 'react';
import { Heart, Calendar, ArrowDown, CheckCircle } from 'lucide-react';
import { weddingConfig } from '../../config/wedding.config';
import { Cluster } from '../../types';

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
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  useEffect(() => {
    const target = new Date(weddingConfig.event.date).getTime();

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
  }, []);

  // Check if all guests in cluster already responded
  const allResponded = cluster && cluster.guests.length > 0 && cluster.guests.every(g => g.is_attending !== null);

  return (
    <section id="home" className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 overflow-hidden text-center">
      {/* Background Soft Gradients */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-cream via-blush-light/40 to-cream pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -z-10 w-[550px] h-[550px] bg-blush/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Monogram Top Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-paper/80 border border-blush/50 text-burgundy shadow-sm text-xs font-semibold uppercase tracking-widest mb-6">
          <Heart className="w-3.5 h-3.5 text-blush fill-blush" />
          <span>Save the Date · {weddingConfig.event.displayDate}</span>
        </div>

        {/* Couple Names */}
        <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl text-burgundy font-normal tracking-tight leading-[0.9] mb-4">
          {weddingConfig.couple.bride}
          <span className="block my-2 text-3xl sm:text-4xl md:text-5xl text-blush font-serif italic">
            &amp;
          </span>
          {weddingConfig.couple.groom}
        </h1>

        {/* Ornamental divider */}
        <div className="w-20 h-1 bg-blush rounded-full mx-auto my-6" />

        {/* Location & Tagline */}
        <p className="text-sm sm:text-base md:text-lg font-medium tracking-wide text-burgundy/80 uppercase mb-8">
          {weddingConfig.event.city} · {weddingConfig.event.displayDate}
        </p>

        {/* Contextual Welcome Card for Cluster */}
        {cluster ? (
          <div className="max-w-lg mx-auto mb-10 p-5 rounded-3xl bg-paper shadow-wedding border border-blush/30 animate-fade-in">
            <div className="flex items-center justify-center gap-2 text-burgundy text-sm font-semibold mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Benvenuta, {cluster.family_name}!</span>
            </div>
            <p className="text-xs sm:text-sm text-burgundy/70">
              Siamo davvero felici di condividere con voi questo giorno speciale.
              {allResponded ? (
                <span className="block mt-1 font-medium text-emerald-700">
                  ✓ Grazie per aver confermato la vostra presenza!
                </span>
              ) : (
                <span className="block mt-1 text-burgundy/80">
                  Vi chiediamo gentilmente di confermare la presenza entro il 30 Giugno 2026.
                </span>
              )}
            </p>
          </div>
        ) : (
          <p className="max-w-md mx-auto text-xs sm:text-sm text-burgundy/70 mb-10">
            Una giornata da vivere e ricordare insieme. Benvenuti sul nostro sito di nozze!
          </p>
        )}

        {/* Countdown Timer */}
        <div className="max-w-md mx-auto bg-paper/90 rounded-3xl p-6 sm:p-7 shadow-wedding border border-blush/30 mb-10">
          <div className="flex items-center justify-center gap-1.5 text-xs uppercase tracking-widest text-burgundy font-semibold mb-4">
            <Calendar className="w-4 h-4 text-blush" />
            <span>Il Conto alla Rovescia</span>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
            <div className="p-3 rounded-2xl bg-cream border border-blush/20">
              <span className="block font-serif text-2xl sm:text-4xl font-bold text-burgundy">
                {timeLeft.days}
              </span>
              <span className="block text-[10px] sm:text-xs uppercase tracking-wider text-burgundy/70 mt-1 font-medium">
                Giorni
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-cream border border-blush/20">
              <span className="block font-serif text-2xl sm:text-4xl font-bold text-burgundy">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="block text-[10px] sm:text-xs uppercase tracking-wider text-burgundy/70 mt-1 font-medium">
                Ore
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-cream border border-blush/20">
              <span className="block font-serif text-2xl sm:text-4xl font-bold text-burgundy">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="block text-[10px] sm:text-xs uppercase tracking-wider text-burgundy/70 mt-1 font-medium">
                Minuti
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-cream border border-blush/20">
              <span className="block font-serif text-2xl sm:text-4xl font-bold text-burgundy">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="block text-[10px] sm:text-xs uppercase tracking-wider text-burgundy/70 mt-1 font-medium">
                Secondi
              </span>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#rsvp"
            onClick={onOpenRsvp}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-burgundy hover:bg-burgundy-light text-paper text-sm font-semibold tracking-wider uppercase shadow-wedding hover:shadow-wedding-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            {allResponded ? (
              <>
                <CheckCircle className="w-4 h-4 text-blush" />
                <span>Modifica RSVP</span>
              </>
            ) : (
              <>
                <Heart className="w-4 h-4 text-blush fill-blush" />
                <span>Conferma Presenza (RSVP)</span>
              </>
            )}
          </a>
          <a
            href="#dettagli"
            className="w-full sm:w-auto px-6 py-4 rounded-full bg-paper hover:bg-blush-soft text-burgundy border border-blush/50 text-sm font-semibold tracking-wider uppercase shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <span>Dettagli e Orari</span>
            <ArrowDown className="w-4 h-4 text-burgundy/60" />
          </a>
        </div>
      </div>
    </section>
  );
};
