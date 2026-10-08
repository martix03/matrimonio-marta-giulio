import React, { useState, useEffect } from 'react';
import { Gift, Copy, Check, Heart, Plane, Send, Sparkles } from 'lucide-react';
import { weddingConfig } from '../../config/wedding.config';
import { mockRegistryStages } from '../../services/mockData';
import { Cluster } from '../../types';
import { weddingApi } from '../../services/supabase';

interface WeddingRegistryProps {
  cluster: Cluster | null;
}

export const WeddingRegistry: React.FC<WeddingRegistryProps> = ({ cluster }) => {
  const [copiedIban, setCopiedIban] = useState<boolean>(false);
  const [transferSentMessage, setTransferSentMessage] = useState<boolean>(false);
  const [hasSentAlready, setHasSentAlready] = useState<boolean>(false);
  const [senderName, setSenderName] = useState<string>(cluster?.family_name || '');
  const [amountNote, setAmountNote] = useState<string>('');
  const [wishes, setWishes] = useState<string>('');

  useEffect(() => {
    if (senderName) {
      weddingApi.hasSentGiftMessage(senderName).then(setHasSentAlready);
    }
  }, [senderName]);

  const handleCopyIban = () => {
    navigator.clipboard.writeText(weddingConfig.registry.iban);
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest text-burgundy/60 font-semibold">
            Il Nostro Sogno
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-burgundy mt-1">
            Viaggio di Nozze in Cina
          </h2>
          <div className="w-12 h-1 bg-blush rounded-full mx-auto my-3" />
          <p className="text-xs sm:text-sm text-burgundy/70 leading-relaxed">
            La vostra presenza è per noi il dono più prezioso! Per chi desiderasse contribuire al
            nostro viaggio di nozze tra la Grande Muraglia, antiche città imperiali e paesaggi mozzafiato,
            ecco le tappe del nostro sogno.
          </p>
        </div>

        {/* Stages Grid (No progress bars) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {mockRegistryStages.map((stage) => {
            return (
              <div
                key={stage.id}
                className="rounded-4xl overflow-hidden bg-paper shadow-wedding border border-blush/30 hover:shadow-wedding-lg hover:-translate-y-1 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-52 sm:h-60 overflow-hidden">
                    <img
                      src={stage.image_url}
                      alt={stage.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-burgundy/85 via-burgundy/20 to-transparent" />
                    <div className="absolute bottom-4 left-5 right-5 text-paper">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-blush block">
                        {stage.location}
                      </span>
                      <h3 className="font-serif text-xl sm:text-2xl font-medium leading-tight">
                        {stage.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-xs text-burgundy/80 leading-relaxed">
                      {stage.description}
                    </p>
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
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blush-soft text-burgundy flex items-center justify-center">
                  <Gift className="w-5 h-5 text-burgundy" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl text-burgundy">
                    Coordinate Bancarie
                  </h3>
                  <span className="text-xs text-burgundy/60">Lista Nozze</span>
                </div>
              </div>

              <p className="text-xs text-burgundy/70 leading-relaxed">
                Se volete contribuire al nostro viaggio di nozze, ecco le coordinate bancarie:
              </p>

              <div className="p-4 rounded-2xl bg-cream border border-blush/30 space-y-2">
                <div className="text-[11px] uppercase tracking-wider font-semibold text-burgundy/60">
                  Intestatario:
                </div>
                <div className="text-sm font-semibold text-burgundy">
                  {weddingConfig.registry.holder}
                </div>

                <div className="text-[11px] uppercase tracking-wider font-semibold text-burgundy/60 pt-2 border-t border-blush/20">
                  IBAN:
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs sm:text-sm font-bold text-burgundy break-all select-all">
                    {weddingConfig.registry.iban}
                  </span>
                  <button
                    onClick={handleCopyIban}
                    className="px-3 py-1.5 rounded-full bg-burgundy hover:bg-burgundy-light text-paper text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-sm"
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
            <div className="lg:col-span-6 p-6 rounded-3xl bg-cream border border-blush/40">
              <h4 className="font-serif text-lg text-burgundy font-medium mb-1">
                Avvisaci del tuo Regalo
              </h4>
              <p className="text-xs text-burgundy/70 mb-4">
                Se vuoi farci una sorpresa o scriverci una dedica speciale legata al tuo dono:
              </p>

              {transferSentMessage || hasSentAlready ? (
                <div className="p-4 rounded-2xl bg-blush-soft text-burgundy text-xs border border-blush/40 text-center animate-fade-in">
                  <Sparkles className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                  <span className="font-semibold block">Grazie di cuore!</span>
                  <span>Abbiamo ricevuto il vostro messaggio con infinita gioia.</span>
                </div>
              ) : (
                <form onSubmit={handleNotifyTransfer} className="space-y-3">
                  <div>
                    <input
                      type="text"
                      required
                      value={senderName}
                      onChange={e => setSenderName(e.target.value)}
                      placeholder="Il vostro nome o famiglia..."
                      className="w-full px-3.5 py-2 rounded-xl border border-blush/40 text-xs text-burgundy bg-paper outline-none focus:border-burgundy"
                    />
                  </div>
                  <div>
                    <textarea
                      rows={2}
                      value={wishes}
                      onChange={e => setWishes(e.target.value)}
                      placeholder="Un pensiero o un augurio per il nostro viaggio in Cina..."
                      className="w-full px-3.5 py-2 rounded-xl border border-blush/40 text-xs text-burgundy bg-paper outline-none focus:border-burgundy resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-full bg-burgundy hover:bg-burgundy-light text-paper text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Invia Messaggio agli Sposi</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
