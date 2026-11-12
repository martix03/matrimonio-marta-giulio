import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { useSettings } from "../../contexts/SettingsContext";
import { Cluster } from "../../types";

import {
  HomeBolle,
  HomeRighe,
  HomeBaffo,
  MartaGiulio,
  CascinaRanverso,
  Data,
  HomeCount,
  LineaRosa,
  HomeCountOnde,
  HomeCountBaffo,
  Calla,
  Anthurium,
  CarloBicchiere,
  RombiAngolo,
} from "./GraficaElements";

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
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isPast: true,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [settings.event.date]);

  const guests = cluster?.guests || [];
  const allResponded =
    guests.length > 0 && guests.every((g) => g.is_attending !== null);
  const allDeclined =
    guests.length > 0 && guests.every((g) => g.is_attending === false);
  const isSingleGuest = guests.length === 1;

  const welcomeGreeting = (() => {
    if (!cluster) return "Benvenuti";
    const familyName = cluster.family_name || "";
    const isFamily = familyName.toLowerCase().includes("famiglia");
    if (isFamily) return "Benvenuta";
    if (guests.length >= 2) return "Benvenuti";
    const singleGuest = guests[0];
    if (singleGuest?.gender) {
      return singleGuest.gender === "F" ? "Benvenuta" : "Benvenuto";
    }
    const firstName =
      (singleGuest?.first_name || familyName)
        .trim()
        .toLowerCase()
        .split(" ")[0] || "";
    const maleNamesEndingInA = ["andrea", "luca", "mattia", "elia", "nicola"];
    if (firstName.endsWith("a") && !maleNamesEndingInA.includes(firstName)) {
      return "Benvenuta";
    }
    return "Benvenuto";
  })();

  return (
    <section
      id="home"
      className="relative pt-24 pb-16 sm:pt-28 sm:pb-24 overflow-hidden bg-lightRosa text-center"
    >
      {/* Anthurium in alto a destra nell'angolo (solo mobile) */}
      <Anthurium className="block lg:hidden absolute -top-6 -right-6 sm:-right-2 w-1/2 sm:w-1/3 pointer-events-none z-0" />

      <div className="max-w-2xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Mobile */}
        <div className="flex flex-col lg:hidden mb-12">
          {/* Responsive Container: Marta & Giulio in centro in alto, Carlo e Baffo sotto */}
          <div className="flex flex-col mt-36">
            <div className="flex flex-col items-end mb-6">
              <MartaGiulio className="h-24" />
              <Data className="h-12" />
              <CascinaRanverso className="h-10 mt-4" />
            </div>

            <div className="relative flex justify-start ml-4 sm:ml-8 -mt-28 mb-12 group">
              <CarloBicchiere className="w-48 sm:w-52 lg:w-80 object-contain filter select-none group-hover:scale-105 transition-transform duration-300 relative z-10" />
            </div>
          </div>
        </div>

        {/* Desktop: Marta & Giulio a sinistra, CarloBicchiere e RombiAngolo a destra */}
        <div className="hidden lg:flex flex-row items-center justify-between w-full mt-16 mb-32">
          {/* Colonna Sinistra: Marta & Giulio, Data e Cascina */}
          <div className="w-1/2 flex flex-col items-start">
            <MartaGiulio className="h-32" />
            <Data className="h-16" />
            <CascinaRanverso className="h-16 mt-4" />
          </div>

          {/* Colonna Destra: CarloBicchiere sovrapposto a RombiAngolo */}
          <div className="w-1/3 flex justify-end">
            <div className="relative group flex items-center justify-center w-full">
              {/* RombiAngolo sotto (1/2 della larghezza) */}
              <RombiAngolo className="w-full h-auto -scale-y-100 pointer-events-none select-none" />

              {/* CarloBicchiere sopra */}
              <CarloBicchiere className="absolute w-72 lg:w-80 object-contain filter select-none group-hover:scale-105 transition-transform duration-300 z-10" />
            </div>
          </div>
        </div>

        {/* Contextual Cluster Greeting Card (when guest is logged in) */}
        {cluster && (
          <div className="max-w-md mx-auto mb-8 p-4 sm:p-5 rounded-2xl bg-white/95 border border-blush/40 animate-fade-in text-left">
            <div className="flex items-center gap-2 text-[#4a151d] sottotitolo font-semibold mb-1">
              <div className="w-2 h-2 rounded-full bg-[#667b4e]" />
              <span className="sottotitolo">
                {welcomeGreeting}, {cluster.family_name}!
              </span>
            </div>
            <div className="body text-[#4a151d]/80 pl-4">
              {allResponded && allDeclined ? (
                <>
                  <p className="body">Grazie per aver risposto all'invito.</p>
                  <span className="body block mt-1 font-medium text-[#4a151d]">
                    Ci dispiace che non {isSingleGuest ? "puoi" : "possiate"}{" "}
                    esserci, {isSingleGuest ? "ti" : "vi"} porteremo comunque
                    nel cuore!
                  </span>
                </>
              ) : (
                <>
                  <p className="body">
                    Siamo davvero felici di condividere con{" "}
                    {isSingleGuest ? "te" : "voi"} questo giorno speciale.
                  </p>
                  {allResponded ? (
                    <span className="inline-flex items-center gap-1.5 mt-2 font-medium text-[#4a151d]">
                      <span className="body">
                        Grazie per aver confermato la{" "}
                        {isSingleGuest ? "tua" : "vostra"} presenza
                      </span>
                    </span>
                  ) : (
                    <span className="body block mt-1 text-[#4a151d] font-medium">
                      {isSingleGuest ? "Ti" : "Vi"} chiediamo gentilmente di
                      confermare la presenza entro il{" "}
                      {settings.event.rsvpDeadline ||
                        settings.rsvp?.deadline ||
                        "29 Aprile 2027"}
                      .
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Countdown Box Card (Exact match to grafica.svg) */}
        <div className="max-w-md mx-auto bg-white rounded-2xl border border-blush/30 mb-5 relative overflow-hidden">
          {/* Card Header */}
          <div className="flex items-center mt-6 justify-center mb-4">
            <HomeCount className="h-7 w-auto" color="#4a151d" />
          </div>

          {/* Decorative Baffo in top right (underneath countdown blocks layer) 
          <HomeCountBaffo className="absolute top-0 right-0 w-16 h-auto pointer-events-none z-0" />

          <HomeCountOnde className="absolute bottom-0 left-0 w-16 h-auto pointer-events-none z-0" />*/}

          {/* 4 Burgundy Countdown Blocks (Layer on top of Baffo) */}
          <div className="m-6">
            <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center text-lightRosa relative z-10">
              {/* Days */}
              <div className="bg-[#8c2035] text-lightRosa rounded-2xl p-2.5 sm:p-3 flex flex-col items-center justify-center">
                <span className="titolo mt-2 mb-2 font-bold tracking-tigh">
                  {timeLeft.days}
                </span>
                <LineaRosa className="w-full" strokeWidth={2} />
                <span className="body mt-2 mb-2 tracking-wider uppercase font-semibold">
                  Giorni
                </span>
              </div>

              {/* Hours */}
              <div className="bg-[#8c2035] rounded-2xl p-2.5 sm:p-3 flex flex-col items-center justify-center">
                <span className="font-sans titolo mt-2 mb-2  font-bold tracking-tight">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <LineaRosa className="w-full my-0.5" strokeWidth={2} />
                <span className="body mt-2 mb-2  tracking-wider uppercase font-semibold">
                  Ore
                </span>
              </div>

              {/* Minutes */}
              <div className="bg-[#8c2035] rounded-2xl p-2.5 sm:p-3 flex flex-col items-center justify-center">
                <span className="font-sans titolo mt-2 mb-2  font-bold tracking-tight">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <LineaRosa className="w-full my-0.5" strokeWidth={2} />
                <span className="body mt-2 mb-2 tracking-wider uppercase font-semibold">
                  Minuti
                </span>
              </div>

              {/* Seconds */}
              <div className="bg-[#8c2035] rounded-2xl p-2.5 sm:p-3 flex flex-col items-center justify-center">
                <span className="font-sans titolo mt-2 mb-2 font-bold tracking-tight">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
                <LineaRosa className="w-full my-0.5" strokeWidth={2} />
                <span className="body mt-2 mb-2 tracking-wider uppercase font-semibold">
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
            className="btn-primary w-full py-3.5 body font-semibold tracking-wider uppercase"
          >
            <span>
              {allResponded ? "Modifica presenza" : "Conferma presenza"}
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};
