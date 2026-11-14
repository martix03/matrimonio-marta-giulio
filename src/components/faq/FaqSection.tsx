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
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-6 px-4 sm:px-6 no-scrollbar lg:pt-10">
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
        <div className="space-y-3 px-4 sm:px-6 lg:px-0 lg:w-2/3 mx-auto mb-16">
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

          {/* Direct Contacts Box */}
          <div className="p-6 sm:p-8 rounded-4xl bg-[#fffcf7] text-center max-w-2xl mx-auto">
            <div className="flex flex-col gap-5 sm:gap-6 text-left mt-6 mb-8">
              {/* Marta Card */}
              <div className="p-6 sm:p-7 rounded-3xl bg-white border border-blush/40 shadow-xs transition-all hover:shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                  <div className="space-y-2">
                    <span className="titolo  font-bold text-bordeaux">
                      Marta
                    </span>
                    <div className="sottotitolo space-y-1.5 body pt-1">
                      <a
                        href="tel:+393466121512"
                        className=" sottotitolo flex items-center gap-2.5 text-bordeaux hover:text-burgundy font-medium transition-colors"
                      >
                        <Phone className="sottotitolo w-4 h-4 text-bordeaux shrink-0" />
                        <span>346 612 1512</span>
                      </a>
                      <a
                        href="mailto:spalla.marta@gmail.com"
                        className="flex items-center gap-2.5 text-bordeaux hover:text-burgundy transition-colors"
                        title="Invia email a Marta"
                      >
                        <Mail className="w-4 h-4 text-burgundy shrink-0" />
                        <span className="break-all sm:break-normal">
                          spalla.marta@gmail.com
                        </span>
                      </a>
                    </div>
                  </div>
                  <a
                    href="https://wa.me/393466121512"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-burgundy hover:bg-burgundy-light text-paper body font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm shrink-0 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Scrivi a Marta</span>
                  </a>
                </div>
              </div>

              {/* Giulio Card */}
              <div className="p-6 sm:p-7 rounded-3xl bg-white border border-blush/40 shadow-xs transition-all hover:shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                  <div className="space-y-2">
                    <span className="titolo font-bold text-bordeaux">
                      Giulio
                    </span>
                    <div className="sottotitolo space-y-1.5 body pt-1">
                      <a
                        href="tel:+393492481715"
                        className="flex items-center gap-2.5 text-bordeaux hover:text-burgundy font-medium transition-colors"
                      >
                        <Phone className="w-4 h-4 text-burgundy shrink-0" />
                        <span>349 248 1715</span>
                      </a>
                      <a
                        href="mailto:giulio.palomba@gmail.com"
                        className="flex items-center gap-2.5 text-bordeaux hover:text-burgundy transition-colors"
                        title="Invia email a Giulio"
                      >
                        <Mail className="w-4 h-4 text-burgundy shrink-0" />
                        <span className="break-all sm:break-normal">
                          giulio.palomba@gmail.com
                        </span>
                      </a>
                    </div>
                  </div>
                  <a
                    href="https://wa.me/393492481715"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-burgundy hover:bg-burgundy-light text-paper body font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm shrink-0 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Scrivi a Giulio</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
