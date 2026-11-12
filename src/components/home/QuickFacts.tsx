import React, { useState } from "react";
import {
  Navigation,
  MapPin,
  ExternalLink,
  Calendar,
  Clock,
  Church,
  Sparkles,
} from "lucide-react";
import { useSettings } from "../../contexts/SettingsContext";
import {
  Data,
  Ore17,
  CascinaRanverso,
  Martini,
  Dettagli,
} from "./GraficaElements";
import { SectionBanner } from "../common/SectionBanner";

export const QuickFacts: React.FC = () => {
  const { settings } = useSettings();
  const [navModalPlace, setNavModalPlace] = useState<{
    name: string;
    google: string;
    apple: string;
    waze: string;
  } | null>(null);

  const ceremonyNav =
    settings.locations.ceremony.googleMapsUrl ||
    settings.locations.ceremony.appleMapsUrl ||
    settings.locations.ceremony.wazeUrl
      ? {
          name: settings.locations.ceremony.name,
          google: settings.locations.ceremony.googleMapsUrl,
          apple: settings.locations.ceremony.appleMapsUrl,
          waze: settings.locations.ceremony.wazeUrl,
        }
      : undefined;

  const receptionNav =
    settings.locations.reception.googleMapsUrl ||
    settings.locations.reception.appleMapsUrl ||
    settings.locations.reception.wazeUrl
      ? {
          name: settings.locations.reception.name,
          google: settings.locations.reception.googleMapsUrl,
          apple: settings.locations.reception.appleMapsUrl,
          waze: settings.locations.reception.wazeUrl,
        }
      : undefined;

  return (
    <section id="dettagli" className="bg-white border-y border-blush/20">
      <div className="pb-12 lg:pb-24 bg-[#fffcf7]">
        {/* Banner testata con titolo grafico e sottotitolo */}
        <SectionBanner
          title={Dettagli}
          subtitle={
            <>
              Tutte le informazioni chiave
              <br />
              per raggiungere le sedi dell'evento.
            </>
          }
        />

        {/* 2. Timeline Card (Centered and enlarged for desktop) */}
        <div className="bg-avorio">
          <div className="max-w-2xl mx-auto flex flex-col items-center text-center">
            <div className="w-full mt-4 space-y-8 lg:space-y-14 my-2">
              {/* Stop 1: La Data */}
              <div className=" relative flex flex-col items-center text-center">
                <span className="body uppercase tracking-widest text-bordeaux/70 font-bold block mb-1">
                  La data
                </span>
                <Data className="h-6 sm:h-8 lg:h-10 w-auto mx-auto" />
              </div>

              {/* Stop 2: Gli Orari */}
              <div className="flex flex-col items-center text-center">
                <span className="body uppercase tracking-widest text-bordeaux/70 font-bold block mb-1">
                  L'orario
                </span>
                <Ore17 className=" mb-2 h-6 sm:h-6 lg:h-8 w-auto mx-auto" />
                <p className="body text-bordeaux/75 max-w-md">
                  {settings.event.ceremonyTime ||
                    "Arrivo gradito entro le 16:45"}
                </p>
              </div>

              {/* Stop 3: La Cerimonia */}
              <div className="flex flex-col items-center text-center">
                <span className="body uppercase tracking-widest text-bordeaux/70 font-bold block mb-1">
                  La cerimonia
                </span>
                <CascinaRanverso className="h-8 sm:h-9 lg:h-12 w-auto mx-auto" />
                <p className="body text-[#4a151d]/75 mt-1 max-w-md">
                  {settings.locations.ceremony.address.includes(", ") ? (
                    <>
                      <span>
                        {settings.locations.ceremony.address.split(", ")[0]}
                      </span>
                      <span className="hidden sm:inline">, </span>
                      <br className="sm:hidden" />
                      <span>
                        {settings.locations.ceremony.address
                          .split(", ")
                          .slice(1)
                          .join(", ")}
                      </span>
                    </>
                  ) : (
                    settings.locations.ceremony.address
                  )}
                </p>
              </div>

              {/* Stop 4: La Festa / Il Ricevimento */}
              <div className="relative flex flex-col items-center text-center">
                <Martini className="absolute right-4 top-0 lg:-top-36 sm:-top-36 lg:-right-8 sm:-right-8 w-[20%] h-auto pointer-events-none" />

                <span className="body uppercase tracking-widest text-bordeaux/70 font-bold block mb-1">
                  La festa
                </span>
                <CascinaRanverso className="h-8 sm:h-9 lg:h-12 w-auto mx-auto" />
                <p className="body text-[#4a151d]/75 mt-1 max-w-md">
                  {(() => {
                    const text =
                      settings.event.receptionTime ||
                      "A seguire, aperitivo, cena e festa nello stesso luogo";
                    const target = "cena";
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
    </section>
  );
};
