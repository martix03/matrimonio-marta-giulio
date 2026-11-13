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
  ListaNozze,
  Tappe,
  Viaggio,
  Orchidea,
  CarloCina,
} from "../home/GraficaElements";
import { SectionBannerRosa } from "../common/SectionBannerRosa";
import { SectionBannerVerde } from "../common/SectionBannerVerde";

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

      <div className="mb-16 mt-4 max-w-6xl lg:max-w-7xl mx-auto px-2">
        <Tappe className="w-full sm:w-[70%] lg:w-[70%] h-auto mx-auto" />
      </div>
      <div className="bg-[#fbf5f4]">
        <SectionBannerVerde
          title={ListaNozze}
          subtitle={
            <>
              Se volete contribuire al nostro viaggio, <br /> ecco le coordinate
              bancarie:
            </>
          }
        />

        {/* Bank Details & Notification Card */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
          <div className="relative p-5 sm:p-7 rounded-2xl bg-[#fffcf7] border border-blush/30 shadow-xs overflow-hidden">
            {/* Orchidea on desktop right side, vertically centered */}
            <Orchidea className="hidden lg:block absolute top-1/2 -translate-y-1/2 right-6 w-28 lg:w-32 h-auto -scale-x-100 pointer-events-none select-none z-0 opacity-80" />

            {/* Bank Details Content - safe zone on mobile, perfectly centered on desktop (lg) */}
            <div className="relative z-10 space-y-3.5 text-left lg:text-center pr-4 sm:pr-28 lg:pr-0 lg:mx-auto lg:max-w-md">
              <div>
                <div className="body uppercase tracking-wider font-semibold text-bordeaux/60">
                  Intestatario:
                </div>
                <div className="sottotitolo font-semibold text-bordeaux">
                  {settings.registry.holder}
                </div>
              </div>

              <div>
                <div className="body uppercase tracking-wider font-semibold text-bordeaux/60 pt-1">
                  IBAN:
                </div>
                <div className="flex flex-col gap-3 lg:items-center mt-1">
                  <span className="font-mono w-fit pr-4 rounded-md sottotilo bg-[#fffcf7] font-bold text-bordeaux break-all select-all">
                    {settings.registry.iban}
                  </span>
                  <button
                    onClick={handleCopyIban}
                    className="w-fit px-5 py-2.5 rounded-xl bg-bordeaux hover:bg-bordeaux-light text-paper body font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm lg:mx-auto cursor-pointer"
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
                <div className="body uppercase tracking-wider font-semibold text-bordeaux/60 pt-1">
                  Causale suggerita:
                </div>
                <div className="body font-medium text-bordeaux/80 italic mt-0.5">
                  "{suggestedReason}"
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <CarloCina className="mt-6 sm:mt-8 lg:mt-8 w-1/2 sm:w-1/3 lg:w-1/3 h-auto pointer-events-none select-none z-0" />
          </div>
        </div>
      </div>
    </section>
  );
};
