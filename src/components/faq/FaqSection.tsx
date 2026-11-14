import React, { useState, useEffect } from "react";
import { Search, ChevronDown, Phone, Mail, MessageCircle } from "lucide-react";
import { useSettings } from "../../contexts/SettingsContext";
import { weddingApi } from "../../services/supabase";
import { Faq, Contatti } from "../home/GraficaElements";
import { SectionBannerVerde } from "../common/SectionBannerVerde";
import { SectionBannerRosa } from "../common/SectionBannerRosa";

export const FaqSection: React.FC = () => {
  const { settings } = useSettings();
  const [faqs, setFaqs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [openIds, setOpenIds] = useState<string[]>(["faq-dress-code"]);

  useEffect(() => {
    weddingApi.getFaqs().then(setFaqs);
  }, []);

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const tags = [
    { id: "all", label: "Tutti i Temi" },
    { id: "locations", label: "Location & Orari" },
    { id: "info", label: "Info Utili" },
    { id: "gifts", label: "Regali" },
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesTag = selectedTag === "all" || faq.category === selectedTag;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <section id="faq" className="bg-cream">
      <div className="">
        <SectionBannerVerde
          title={Faq}
          subtitle={
            <>
              Tutto quello che c'è da sapere <br /> per godersi la festa senza
              pensieri.
            </>
          }
        />

        {/* Tag Filters */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-6 ml-6 no-scrollbar">
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => setSelectedTag(tag.id)}
              className={`px-3.5 py-1.5 rounded-lg body font-semibold whitespace-nowrap transition-all ${
                selectedTag === tag.id
                  ? "bg-[#de868a] text-paper shadow-sm"
                  : "bg-paper text-bordeaux/70 border border-blush/40 hover:border-burgundy"
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-3 ml-6 mr-6 mb-16">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
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
                    <span className="sottotitolo text-bordeaux font-semibold leading-snug">
                      {faq.question}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full bg-cream text-bordeaux flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180 bg-blush-soft" : ""
                      }`}
                    >
                      <ChevronDown className="w-4 h-4 text-burgundy" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-6 sm:px-6 pt-4 body text-bordeaux/80 leading-relaxed border-t border-blush/10 animate-fade-in">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center bg-paper rounded-3xl border border-blush/30 body text-burgundy/70">
              Nessun risultato per la tua ricerca. Prova con altre parole
              chiave!
            </div>
          )}
        </div>

        {/* 1. Deep Burgundy Banner from grafica.svg */}
        <div className="bg-[#fffcf7]">
          <SectionBannerRosa
            title={Contatti}
            titleClassName="h-12 lg:h-16 w-auto mb-2 lg:mt-8 text-lightRosa"
            subtitle={
              <>
                Siamo a tua completa disposizione!
                <br /> Contattaci liberamente:
              </>
            }
          />

          {/* Direct Contacts Box (Burgundy Style) */}
          <div className="p-6 sm:p-8 rounded-4xl bg-[#fffcf7] text-center max-w-xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mt-8  mb-8">
              {/* Marta Card */}
              <div className="p-4 rounded-2xl bg-white border border-blush/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="sottotitolo font-semibold text-bordeaux">
                    Marta
                  </span>
                </div>
                <div className="space-y-1.5 body">
                  <a
                    href="tel:+393466121512"
                    className="flex items-center gap-2 text-bordeaux hover:text-burgundy-light font-medium transition-colors"
                  >
                    <span>346 612 1512</span>
                  </a>
                  <a
                    href="mailto:spalla.marta@gmail.com"
                    className="flex items-center gap-2 text-bordeaux/80 hover:text-bordeaux body truncate transition-colors"
                    title="Invia email a Marta"
                  >
                    <span className="truncate">spalla.marta@gmail.com</span>
                  </a>
                </div>
                <a
                  href="https://wa.me/393466121512"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 w-full py-2 px-3 rounded-2xl bg-burgundy hover:bg-burgundy-light text-paper body font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <span>Scrivi a Marta</span>
                </a>
              </div>

              {/* Giulio Card */}
              <div className="p-4 rounded-2xl bg-white border border-blush/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="sottotitolo font-semibold text-bordeaux">
                    Giulio
                  </span>
                </div>
                <div className="space-y-1.5 body">
                  <a
                    href="tel:+393492481715"
                    className="flex items-center gap-2 text-bordeaux hover:text-burgundy-light font-medium transition-colors"
                  >
                    <span>349 248 1715</span>
                  </a>
                  <a
                    href="mailto:giulio.palomba@gmail.com"
                    className="flex items-center gap-2 text-bordeaux/80 hover:text-bordeaux body truncate transition-colors"
                    title="Invia email a Giulio"
                  >
                    <span className="truncate">giulio.palomba@gmail.com</span>
                  </a>
                </div>
                <a
                  href="https://wa.me/393492481715"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 w-full py-2 px-3 rounded-2xl bg-burgundy hover:bg-burgundy-light text-paper body font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <span>Scrivi a Giulio</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
