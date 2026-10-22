import React, { useState, useEffect } from 'react';
import { Gift, Copy, Check, Heart, Plane, Send, Sparkles } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import { mockRegistryStages } from '../../services/mockData';
import { Cluster } from '../../types';
import { weddingApi } from '../../services/supabase';
import { MiniWave,
   TimeBolle,
   Data,
   TimeTitle,
   HourTitle,
   CascinaTitle,
   ViaggioTitle
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
    <section id="lista-nozze" className="py-16 sm:py-24 bg-cream">
      <div className="relative overflow-hidden bg-[#8c2035] text-white shadow-wedding pl-8 pr-8 pt-16 lg:pt-32 pb-16 lg:pb-32">
          {/* Organic soft pink blob at top right */}
          <TimeBolle className="absolute top-0 right-0 w-1/3 lg:w-[15%]" />

          <div className="flex flex-col items-start lg:items-center mt-6">
            <ViaggioTitle className="scale-x-100 h-16 lg:h-20 w-auto mb-2" />
            <MiniWave color="#667b4e" className="w-44 lg:w-60 h-auto my-2" strokeWidth={1.5} lgStrokeWidth={1} />
            <p className="text-xs lg:text-lg text-white/80 leading-relaxed font-light mt-2 text-left lg:text-center">
              Il nostro viaggio di nozze sarà tra la Grande Muraglia, 
               <br />
 antiche città imperiali e paesaggi mozzafiato,
 <br />
 ecco le tappe del nostro sogno.

             
            </p>
          </div>
        </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
    
        {/* Stages Grid (No progress bars) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 mb-12">
          {mockRegistryStages.map((stage) => {
            return (
              <div
                key={stage.id}
                className="rounded-4xl overflow-hidden bg-paper transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-52 sm:h-60 overflow-hidden">
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

        {/* Bank Details & Notification Card */}
        <div className="p-8 sm:p-10 rounded-4xl bg-paper shadow-wedding-lg border border-blush/40">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: IBAN details */}
            <div className="lg:col-span-6 space-y-4">
              <div>
                <h3 className="font-serif text-2xl text-burgundy">
                  Coordinate Bancarie
                </h3>
                <span className="text-xs text-burgundy/60">Lista Nozze</span>
              </div>

              <p className="text-xs text-burgundy/70 leading-relaxed">
                Se volete contribuire al nostro viaggio di nozze, ecco le coordinate bancarie:
              </p>

              <div className="p-4 rounded-2xl bg-cream border border-blush/30 space-y-2">
                <div className="text-[11px] uppercase tracking-wider font-semibold text-burgundy/60">
                  Intestatario:
                </div>
                <div className="text-sm font-semibold text-burgundy">
                  {settings.registry.holder}
                </div>

                <div className="text-[11px] uppercase tracking-wider font-semibold text-burgundy/60 pt-2 border-t border-blush/20">
                  IBAN:
                </div>
                <div className="flex flex-col gap-3">
                  <span className="font-mono text-sm sm:text-base font-bold text-burgundy break-all select-all text-center bg-paper/50 py-3 rounded-xl border border-blush/20">
                    {settings.registry.iban}
                  </span>
                  <button
                    onClick={handleCopyIban}
                    className="w-full py-2.5 rounded-2xl bg-burgundy hover:bg-burgundy-light text-paper text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
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

                <div className="text-[11px] uppercase tracking-wider font-semibold text-burgundy/60 pt-2 border-t border-blush/20">
                  Causale suggerita:
                </div>
                <div className="text-xs font-medium text-burgundy/80 italic">
                  "{suggestedReason}"
                </div>
              </div>
            </div>

            {/* Right: Notify Transfer Form */}
          
          </div>
        </div>
      </div>
    </section>
  );
};
