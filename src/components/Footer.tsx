import React from 'react';
import { Heart, ArrowUp } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import martaGiulioTitle from '../assets/marta-giulio-title.png';
import { MiniWave, CarloFace } from './home/GraficaElements';

export const Footer: React.FC = () => {
  const { settings } = useSettings();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-14 bg-[#fbf5f4] border-t border-blush/30 text-center relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Carlo Face Icon */}
        <div className="mb-3">
          <div className="w-12 h-12 rounded-full bg-[#fde7e2] p-1 border border-[#dfb0b0]/60 mx-auto flex items-center justify-center shadow-xs">
            <CarloFace className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Official Calligraphy Title */}
        <div className="mb-2">
          <img
            src={martaGiulioTitle}
            alt="Marta &amp; Giulio"
            className="h-12 sm:h-14 mx-auto object-contain select-none"
            style={{ mixBlendMode: 'multiply' }}
          />
        </div>

        <p className="text-xs uppercase tracking-widest text-[#4a151d]/70 mb-4 font-semibold">
          {settings.event.displayDate} · Cascina Ranverso
        </p>

        <MiniWave color="#667b4e" className="w-14 h-3 mx-auto mb-4" strokeWidth={2.5} />

        <p className="text-xs text-[#4a151d]/80 flex items-center justify-center gap-1.5 font-medium">
          <span>Non vediamo l'ora di festeggiare con voi</span>
          <Heart className="w-3.5 h-3.5 text-[#8a1e32] fill-[#8a1e32]" />
        </p>

        {/* Scroll To Top button */}
        <button
          onClick={scrollToTop}
          className="mt-8 p-3 rounded-2xl bg-paper border border-blush/40 text-burgundy/60 hover:text-burgundy hover:bg-blush-soft transition-all shadow-sm mx-auto flex items-center justify-center"
          aria-label="Torna in cima"
          title="Torna in cima"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      </div>
    </footer>
  );
};
