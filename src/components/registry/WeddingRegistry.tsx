import React, { useState, useEffect } from 'react';
import { Gift, Copy, Check, Heart, Plane, Send, Sparkles } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import { mockRegistryStages } from '../../services/mockData';
import { Cluster } from '../../types';
import { weddingApi } from '../../services/supabase';
import { MiniWave,
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

interface WeddingRegistryProps {
  cluster: Cluster | null;
}

export const WeddingRegistry: React.FC<WeddingRegistryProps> = ({ cluster }) => {
  const { settings } = useSettings();
  const [copiedIban, setCopiedIban] = useState<boolean>(false);
  const [transferSentMessage, setTransferSentMessage] = useState<boolean>(false);
  const [hasSentAlready, setHasSentAlready] = useState<boolean>(false);
  const [senderName, setSenderName] = useState<string>(cluster?.family_name || '');
  const [amountNote, setAmountNote] = useState<string>('');
  const [wishes, setWishes] = useState<string>('');

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
      setAmountNote('');
      setWishes('');
      setTransferSentMessage(false);
    }, 4000);
  };

  const suggestedReason = `Regalo Matrimonio - ${cluster ? cluster.family_name : 'Marta e Giulio'}`;

  return (
    <section id="lista-nozze" className="bg-[#fffcf7]">
        {/* 1. Deep Burgundy Banner from grafica.svg */}
        <div className="relative overflow-hidden bg-[#8c2035] text-white pl-8 pr-8 pt-8 lg:pt-16 pb-16 lg:pb-32 ">
       
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none pointer-events-none z-10">
    <svg
      className="relative block w-full h-12 sm:h-20 lg:h-28"
      viewBox="0 0 1200 360"
      preserveAspectRatio="none"
    >
      <path
        d="M 0,56 C 257,56 461,358 725,358 C 909,358 1106,206 1200,127 L 1200,360 L 0,360 Z"
        fill="#fffcf7"
      />
    </svg>
  </div>
          {/* Organic soft pink blob at top right */}
          <TimeBolle className="absolute top-0 right-0 w-1/3 lg:w-[15%]" />

          <div className="flex flex-col items-start lg:items-center mt-6">
            <ViaggioTitle className="scale-x-100 h-16 lg:h-20 w-auto mb-2" />
            <MiniWave color="#667b4e" className="w-44 lg:w-60 h-auto my-2" strokeWidth={1.5} lgStrokeWidth={1} />
            <p className="text-xs lg:text-lg text-white/80 leading-relaxed font-light mt-2 text-left lg:text-center">
              Il nostro viaggio di nozze sarà tra la Grande Muraglia, 
            antiche città imperiali e paesaggi mozzafiato.
            </p>
          </div>
        </div>

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
                      <h3 className="font-serif text-xl sm:text-2xl font-medium leading-tight">
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
          <ConfermaBolle className="absolute top-0 right-0 w-1/3 lg:w-[15%]" />

          <div className="flex flex-col items-start lg:items-center mt-6">
            <CoordinateTitle className="h-10 lg:h-20 w-auto mb-2 scale-x-100" />
            <MiniWave color="#667b4e" className="w-44 lg:w-60 h-auto my-2" strokeWidth={1.5} lgStrokeWidth={1} />
            <p className="text-xs sm:text-sm text-[#4a151d]/75 lg:text-center max-w-md mx-auto mb-8">
                             Se volete contribuire al nostro viaggio di nozze, ecco le coordinate bancarie:
            </p>
           
          </div>
          </div>

        {/* Bank Details & Notification Card */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
          <div className="relative p-5 sm:p-6 rounded-2xl bg-[#fffcf7] border border-blush/30 shadow-xs space-y-3 text-left lg:text-center">
            <Orchidea className="hidden lg:block absolute lg:top-4 lg:right-8 w-32 h-auto -scale-x-100" />
            <CarloCina className="absolute lg:-scale-x-100 top-8 lg:top-20 right-8 lg:left-8 w-36 h-auto" />
            <div className="text-[11px] uppercase tracking-wider font-semibold text-burgundy/60">
              Intestatario:
            </div>
            <div className="text-sm font-semibold text-burgundy pr-20 sm:pr-24 lg:pr-0">
              {settings.registry.holder}
            </div>

            <div className="text-[11px] uppercase tracking-wider font-semibold text-burgundy/60 pt-2">
              IBAN:
            </div>
            <div className="flex flex-col gap-3 lg:items-center">
              <span className="font-mono text-sm sm:text-base font-bold text-burgundy break-all select-all">
                {settings.registry.iban}
              </span>
              <button
                onClick={handleCopyIban}
                className="w-fit px-5 py-2.5 rounded-xl bg-burgundy hover:bg-burgundy-light text-paper text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm lg:mx-auto"
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

            <div className="text-[11px] uppercase tracking-wider font-semibold text-burgundy/60 pt-2">
              Causale suggerita:
            </div>
            <div className="text-xs font-medium text-burgundy/80 italic">
              "{suggestedReason}"
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
