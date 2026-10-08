import React from 'react';
import { Heart, ArrowUp } from 'lucide-react';
import { settings } from '../config/wedding.config';
import logoImg from '../assets/logo.png';

export const Footer: React.FC = () => {
  const { settings } = useSettings();
  const { settings } = useSettings();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-12 bg-cream border-t border-blush/30 text-center relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Monogram / Logo */}
        <div className="mb-4">
          <img
            src={logoImg}
            alt="Marta e Giulio"
            className="w-14 h-14 mx-auto object-contain"
          />
        </div>

        <h3 className="font-serif text-2xl sm:text-3xl text-burgundy font-normal mb-1">
          {settings.couple.bride} <span className="text-blush italic font-serif">&amp;</span> {settings.couple.groom}
        </h3>
        <p className="text-xs uppercase tracking-widest text-burgundy/60 mb-6 font-semibold">
          {settings.event.displayDate} · {settings.event.city}
        </p>

        <div className="w-12 h-0.5 bg-blush/40 rounded-full mx-auto mb-6" />

        <p className="text-xs text-burgundy/60 flex items-center justify-center gap-1">
          <span>Non vediamo l'ora di festeggiare con voi</span>
          <Heart className="w-3.5 h-3.5 text-blush fill-blush" />
        </p>

        {/* Scroll To Top button */}
        <button
          onClick={scrollToTop}
          className="mt-8 p-3 rounded-full bg-paper border border-blush/40 text-burgundy/60 hover:text-burgundy hover:bg-blush-soft transition-all shadow-sm mx-auto flex items-center justify-center"
          aria-label="Torna in cima"
          title="Torna in cima"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      </div>
    </footer>
  );
};
