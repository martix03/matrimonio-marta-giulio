import React, { useState, useEffect } from "react";
import { Gift, Copy, Check, Heart, Plane, Send, Sparkles } from "lucide-react";
import { useSettings } from "../../contexts/SettingsContext";
import { mockRegistryStages } from "../../services/mockData";
import { Cluster } from "../../types";
import { weddingApi } from "../../services/supabase";
import {
  MiniWave,
  TimeBolle,
  Data,
  CascinaTitle,
  CoordinateTitle,
  Viaggio,
  Orchidea,
  CarloCina,
} from "../home/GraficaElements";
import { SectionBannerRosa } from "../common/SectionBannerRosa";

interface WeddingRegistryProps {
  cluster: Cluster | null;
}

export const WeddingRegistry: React.FC<WeddingRegistryProps> = ({
  cluster,
}) => {
  const { settings } = useSettings();
  const [copiedIban, setCopiedIban] = useState<boolean>(false);
  const [transferSentMessage, setTransferSentMessage] =
    useState<boolean>(false);
  const [hasSentAlready, setHasSentAlready] = useState<boolean>(false);
  const [senderName, setSenderName] = useState<string>(
    cluster?.family_name || "",
  );
  const [amountNote, setAmountNote] = useState<string>("");
  const [wishes, setWishes] = useState<string>("");

  useEffect(() => {
    if (cluster?.family_name) {
      setSenderName(cluster.family_name);
    }
  }, [cluster?.family_name]);

  useEffect(() => {
    if (senderName) {
      weddingApi.hasSentGiftMessage(senderName).then(setHasSentAlready);
    }
  }, [senderName]);

  const handleCopyIban = () => {
    navigator.clipboard.writeText(settings.registry.iban);
    setCopiedIban(true);
    setTimeout(() => setCopiedIban(false), 2500);
  };

  const handleNotifyTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    await weddingApi.saveGiftMessage(senderName, amountNote, wishes);
    setTransferSentMessage(true);
    setHasSentAlready(true);
    setTimeout(() => {
      setAmountNote("");
      setWishes("");
      setTransferSentMessage(false);
    }, 4000);
  };

  const suggestedReason = `Regalo Matrimonio - ${cluster ? cluster.family_name : "Marta e Giulio"}`;

  return (
    <section id="lista-nozze" className="bg-[#fffcf7]">
      <SectionBannerRosa
        title={Viaggio}
        subtitle={
          <>
            Il nostro viaggio sarà tra la Grande Muraglia,
            <br /> panda e antiche città imperiali.
          </>
        }
      />

      <div className="max-w-3xl lg:max-w-6xl mx-auto px-4 sm:px-6">
        {/* Stages Grid (No progress bars) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 mb-12">
          {mockRegistryStages.map((stage) => {
            return (
              <div
                key={stage.id}
                className="rounded-4xl overflow-hidden bg-[#fffcf7] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-64 lg:h-80 overflow-hidden">
                    <img
                      src={stage.image_url}
                      alt={stage.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-burgundy/85 via-burgundy/20 to-transparent pointer-events-none" />
                    <div className="absolute bottom-4 left-5 right-5 text-white z-10">
                      <h3 className="titolo text-white font-semibold leading-tight">
                        {stage.title}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="bg-[#fbf5f4]">
        <div className="relative overflow-hidden text-white pl-8 pr-8 pt-16 lg:pt-32 ">
          {/* Organic soft pink blob at top right */}

          <div className="flex flex-col items-start lg:items-center mt-6">
            <CoordinateTitle className="h-10 lg:h-20 w-auto mb-2 scale-x-100" />
            <MiniWave
              color="#667b4e"
              className="w-44 lg:w-60 h-auto my-2"
              strokeWidth={1.5}
              lgStrokeWidth={1}
            />
            <p className="sottotitolo text-[#4a151d]/75 lg:text-center max-w-md mx-auto mb-8">
              Se volete contribuire al nostro viaggio di nozze, ecco le
              coordinate bancarie:
            </p>
          </div>
        </div>

        {/* Bank Details & Notification Card */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
          <div className="relative p-5 sm:p-7 rounded-2xl bg-[#fffcf7] border border-blush/30 shadow-xs overflow-hidden">
            {/* Orchidea on desktop right side, vertically centered */}
            <Orchidea className="hidden lg:block absolute top-1/2 -translate-y-1/2 right-6 w-28 lg:w-32 h-auto -scale-x-100 pointer-events-none select-none z-0 opacity-80" />

            {/* Carlo Cina: vertically centered on the right on mobile, and on the left on desktop */}
            <CarloCina className="absolute -bottom-12 lg:top-1/2 -translate-y-1/2 right-3 sm:right-6 w-1/4 lg:w-1/6 lg:left-6 lg:right-auto lg:-scale-x-100 h-auto pointer-events-none select-none z-0" />

            {/* Bank Details Content - safe zone on mobile, perfectly centered on desktop (lg) */}
            <div className="relative z-10 space-y-3.5 text-left lg:text-center pr-4 sm:pr-28 lg:pr-0 lg:mx-auto lg:max-w-md">
              <div>
                <div className="body uppercase tracking-wider font-semibold text-burgundy/60">
                  Intestatario:
                </div>
                <div className="sottotitolo font-semibold text-burgundy">
                  {settings.registry.holder}
                </div>
              </div>

              <div>
                <div className="body uppercase tracking-wider font-semibold text-burgundy/60 pt-1">
                  IBAN:
                </div>
                <div className="flex flex-col gap-3 lg:items-center mt-1">
                  <span className="font-mono w-fit pr-4 rounded-md sottotilo bg-[#fffcf7] font-bold text-burgundy break-all select-all">
                    {settings.registry.iban}
                  </span>
                  <button
                    onClick={handleCopyIban}
                    className="w-fit px-5 py-2.5 rounded-xl bg-burgundy hover:bg-burgundy-light text-paper body font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm lg:mx-auto cursor-pointer"
                    title="Copia negli appunti"
                  >
                    {copiedIban ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copiato!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copia IBAN</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <div className="body uppercase tracking-wider font-semibold text-burgundy/60 pt-1">
                  Causale suggerita:
                </div>
                <div className="body font-medium text-burgundy/80 italic mt-0.5">
                  "{suggestedReason}"
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
