import React, { useState, useEffect } from "react";
import { Gift, Copy, Check, Heart, Plane, Send, Sparkles } from "lucide-react";
import { useSettings } from "../../contexts/SettingsContext";
import { mockRegistryStages } from "../../services/mockData";
import { Cluster } from "../../types";
import { weddingApi } from "../../services/supabase";
import {
  Data,
  ListaNozze,
  Tappe,
  Citta1,
  Citta2,
  Citta3,
  Citta4,
  Viaggio,
  Orchidea,
  CarloCina,
} from "../home/GraficaElements";
import { SectionBannerRosa } from "../common/SectionBannerRosa";
import { SectionBannerVerde } from "../common/SectionBannerVerde";
import francobollo1 from "../../assets/francobollo1.png";
import francobollo2 from "../../assets/francobollo2.png";
import francobollo3 from "../../assets/francobollo3.png";
import francobollo4 from "../../assets/francobollo4.png";

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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 w-full max-w-xl lg:max-w-none lg:w-2/3 mx-auto px-4 sm:px-6 lg:px-0 my-6 lg:my-12">
        <img
          src={francobollo1}
          alt="Francobollo 1"
          className="w-full h-auto object-contain"
        />
        <img
          src={francobollo2}
          alt="Francobollo 2"
          className="w-full h-auto object-contain"
        />
        <img
          src={francobollo3}
          alt="Francobollo 3"
          className="w-full h-auto object-contain"
        />
        <img
          src={francobollo4}
          alt="Francobollo 4"
          className="w-full h-auto object-contain"
        />
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 lg:pt-6">
          <div className="flex items-center justify-center gap-6 lg:gap-8 xl:gap-12">
            {/* Orchidea - solo per lg, a sinistra della card fuori dalla card */}
            <Orchidea className="hidden lg:block mr-16 w-28 -scale-x-100 xl:w-36 h-auto shrink-0 pointer-events-none select-none z-0" />

            {/* Card IBAN & Dettagli */}
            <div className="w-full max-w-xl p-5 sm:p-7 rounded-2xl bg-[#fffcf7] border border-blush/30 shadow-xs">
              <div className="relative z-10 space-y-3.5 text-center max-w-md mx-auto">
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
                  <div className="flex flex-col gap-3 items-center mt-1">
                    <span className="font-mono w-fit px-3 py-1 rounded-md bg-[#fffcf7] font-bold text-bordeaux break-all select-all">
                      {settings.registry.iban}
                    </span>
                    <button
                      onClick={handleCopyIban}
                      className="w-fit px-5 py-2.5 rounded-xl bg-bordeaux hover:bg-bordeaux-light text-paper body font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm mx-auto cursor-pointer"
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

            {/* CarloCina - solo per lg, a destra della card fuori dalla card */}
            <CarloCina className="hidden lg:block ml-12 w-36 xl:w-44 h-auto shrink-0 pointer-events-none select-none z-0" />
          </div>

          {/* CarloCina - solo per mobile (< lg), sotto la card a destra */}
          <div className="flex justify-end lg:hidden max-w-xl mx-auto mt-4 sm:mt-6">
            <CarloCina className="w-1/2 sm:w-1/3 h-auto pointer-events-none select-none z-0" />
          </div>
        </div>
      </div>
    </section>
  );
};
