import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Phone, Mail, MessageCircle } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import { weddingApi } from '../../services/supabase';
import {
  MiniWave,
 TimeBolle,
   ConfermaBolle,
   Data,
   TimeTitle,
   HourTitle,
   CascinaTitle,
   CoordinateTitle,
   ViaggioTitle,
   Orchidea,
   CarloCina
} from '../home/GraficaElements';

export const FaqSection: React.FC = () => {
  const { settings } = useSettings();
  const [faqs, setFaqs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [openIds, setOpenIds] = useState<string[]>(['faq-dress-code']);

  useEffect(() => {
    weddingApi.getFaqs().then(setFaqs);
  }, []);

  const toggleAccordion = (id: string) => {
    setOpenIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const tags = [
    { id: 'all', label: 'Tutti i Temi' },
    { id: 'locations', label: 'Location & Orari' },
    { id: 'info', label: 'Info Utili' },
    { id: 'gifts', label: 'Regali' },
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesTag = selectedTag === 'all' || faq.category === selectedTag;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <section id="faq" className="bg-cream">
      <div className="max-w-4xl mx-auto">


           <div className="relative overflow-hidden text-white pl-8 pr-8 pt-16 lg:pt-32 ">
          {/* Organic soft pink blob at top right */}
          <ConfermaBolle className="absolute top-0 right-0 w-1/3 lg:w-[15%]" />

          <div className="flex flex-col items-start lg:items-center mt-6">
            <CoordinateTitle className="h-10 lg:h-20 w-auto mb-2 scale-x-100" />
            <MiniWave color="#667b4e" className="w-44 lg:w-60 h-auto my-2" strokeWidth={1.5} lgStrokeWidth={1} />
            <p className="text-xs sm:text-sm text-[#4a151d]/75 text-left lg:text-center max-w-md lg:mx-auto mb-8">
                            Tutto quello che c'è da sapere per godersi la festa senza pensieri.
            </p>
           
          </div>
          </div>

      

        

        {/* Tag Filters */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-6 ml-6 no-scrollbar">
          {tags.map(tag => (
            <button
              key={tag.id}
              onClick={() => setSelectedTag(tag.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedTag === tag.id
                  ? 'bg-[#de868a] text-paper shadow-sm'
                  : 'bg-paper text-burgundy/70 border border-blush/40 hover:border-burgundy'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-3 ml-6 mr-6">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map(faq => {
              const isOpen = openIds.includes(faq.id);
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl bg-paper  border-blush/30 overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-cream/40 transition-colors"
                  >
                    <span className="font-serif text-base sm:text-lg text-burgundy font-medium leading-snug">
                      {faq.question}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full bg-cream text-burgundy flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 bg-blush-soft' : ''
                      }`}
                    >
                      <ChevronDown className="w-4 h-4 text-burgundy" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-6 sm:px-6 pt-4 text-xs sm:text-sm text-burgundy/80 leading-relaxed border-t border-blush/10 animate-fade-in">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center bg-paper rounded-3xl border border-blush/30 text-xs text-burgundy/70">
              Nessun risultato per la tua ricerca. Prova con altre parole chiave!
            </div>
          )}
        </div>

        {/* Direct Contacts Box (Burgundy Style) */}
        <div className="mt-12 p-6 sm:p-8 rounded-4xl bg-paper shadow-wedding border border-blush/30 text-center max-w-xl mx-auto">
          <h4 className="font-serif text-2xl text-burgundy font-medium mb-1">
            Hai un'altra domanda o curiosità?
          </h4>
          <p className="text-xs text-burgundy/70 mb-6 max-w-md mx-auto">
            Siamo a tua completa disposizione! Contattaci liberamente tramite telefono o email:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {/* Marta Card */}
            <div className="p-4 rounded-3xl bg-cream/60 border border-blush/40 space-y-2.5">
              <div className="flex items-center justify-between border-b border-blush/30 pb-1.5">
                <span className="font-serif text-base font-semibold text-burgundy">
                  Marta
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-burgundy/60">
                  La Sposa
                </span>
              </div>
              <div className="space-y-1.5 text-xs">
                <a
                  href="tel:+393466121512"
                  className="flex items-center gap-2 text-burgundy hover:text-burgundy-light font-medium transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-blush shrink-0" />
                  <span>346 612 1512</span>
                </a>
                <a
                  href="mailto:spalla.marta@gmail.com"
                  className="flex items-center gap-2 text-burgundy/80 hover:text-burgundy text-[11px] truncate transition-colors"
                  title="Invia email a Marta"
                >
                  <Mail className="w-3.5 h-3.5 text-blush shrink-0" />
                  <span className="truncate">spalla.marta@gmail.com</span>
                </a>
              </div>
              <a
                href="https://wa.me/393466121512"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 w-full py-2 px-3 rounded-2xl bg-burgundy hover:bg-burgundy-light text-paper text-[11px] font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5 text-blush" />
                <span>Scrivi a Marta</span>
              </a>
            </div>

            {/* Giulio Card */}
            <div className="p-4 rounded-3xl bg-cream/60 border border-blush/40 space-y-2.5">
              <div className="flex items-center justify-between border-b border-blush/30 pb-1.5">
                <span className="font-serif text-base font-semibold text-burgundy">
                  Giulio
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-burgundy/60">
                  Lo Sposo
                </span>
              </div>
              <div className="space-y-1.5 text-xs">
                <a
                  href="tel:+393492481715"
                  className="flex items-center gap-2 text-burgundy hover:text-burgundy-light font-medium transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-blush shrink-0" />
                  <span>349 248 1715</span>
                </a>
                <a
                  href="mailto:giulio.palomba@gmail.com"
                  className="flex items-center gap-2 text-burgundy/80 hover:text-burgundy text-[11px] truncate transition-colors"
                  title="Invia email a Giulio"
                >
                  <Mail className="w-3.5 h-3.5 text-blush shrink-0" />
                  <span className="truncate">giulio.palomba@gmail.com</span>
                </a>
              </div>
              <a
                href="https://wa.me/393492481715"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 w-full py-2 px-3 rounded-2xl bg-burgundy hover:bg-burgundy-light text-paper text-[11px] font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5 text-blush" />
                <span>Scrivi a Giulio</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
