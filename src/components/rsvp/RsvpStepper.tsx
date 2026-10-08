import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, XCircle, Users, Utensils, Music, Sparkles, 
  ArrowRight, ArrowLeft, Bus, Check, KeyRound, AlertCircle 
} from 'lucide-react';
import { Cluster, Guest, DietaryTag } from '../../types';
import { weddingApi } from '../../services/supabase';
import { weddingConfig } from '../../config/wedding.config';

interface RsvpStepperProps {
  cluster: Cluster | null;
  onOpenAuth: () => void;
  onRsvpCompleted?: () => void;
}

const DIETARY_OPTIONS: { id: DietaryTag; label: string }[] = [
  { id: 'none', label: '✨ Nessuna intolleranza' },
  { id: 'gluten_free', label: '🌾 Senza Glutine (Celiachia)' },
  { id: 'lactose_free', label: '🥛 Senza Lattosio' },
  { id: 'vegetarian', label: '🥗 Vegetariano' },
  { id: 'vegan', label: '🌱 Vegano' },
  { id: 'no_nuts', label: '🥜 Senza Frutta a Guscio' },
  { id: 'no_shellfish', label: '🦐 No Crostacei / Frutti di mare' },
];

export const RsvpStepper: React.FC<RsvpStepperProps> = ({ cluster, onOpenAuth, onRsvpCompleted }) => {
  const [step, setStep] = useState<number>(1);
  const [declineMessage, setDeclineMessage] = useState<string>('');
  const [guestForms, setGuestForms] = useState<Guest[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Sync cluster guests into local form state
  useEffect(() => {
    if (cluster && cluster.guests.length > 0) {
      setGuestForms(JSON.parse(JSON.stringify(cluster.guests)));
    }
  }, [cluster]);

  const updateGuest = (guestId: string, updates: Partial<Guest>) => {
    setGuestForms(prev =>
      prev.map(g => (g.id === guestId ? { ...g, ...updates } : g))
    );
  };

  const setAllAttendance = (attending: boolean) => {
    setGuestForms(prev =>
      prev.map(g => ({
        ...g,
        is_attending: attending,
      }))
    );
  };

  const toggleDietaryTag = (guestId: string, tag: DietaryTag) => {
    setGuestForms(prev =>
      prev.map(g => {
        if (g.id !== guestId) return g;

        if (tag === 'none') {
          const isSelected = g.dietary_tags.includes('none');
          // If toggling 'none', clear all other specific tags
          return { ...g, dietary_tags: isSelected ? [] : ['none'] };
        } else {
          // If selecting a specific intolerance, remove 'none'
          const withoutNone = g.dietary_tags.filter(t => t !== 'none');
          const exists = withoutNone.includes(tag);
          const updated = exists
            ? withoutNone.filter(t => t !== tag)
            : [...withoutNone, tag];
          return { ...g, dietary_tags: updated };
        }
      })
    );
  };

  const attendingGuests = guestForms.filter(g => g.is_attending === true);
  const declinedGuests = guestForms.filter(g => g.is_attending === false);
  const unconfirmedGuests = guestForms.filter(g => g.is_attending === null);
  const allAnswered = guestForms.length > 0 && guestForms.every(g => g.is_attending !== null);
  const allDeclined = guestForms.length > 0 && guestForms.every(g => g.is_attending === false);
  const hasAttending = attendingGuests.length > 0;

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#51101d', '#d7b8af', '#c59d5f', '#ffffff']
      });
    } catch (e) {
      console.warn('Confetti error', e);
    }
  };

  const handleSaveRsvp = async () => {
    if (!cluster) return;
    setIsSaving(true);

    let finalGuests = [...guestForms];
    if (declineMessage && allDeclined) {
      finalGuests = finalGuests.map(g => ({
        ...g,
        dietary_notes: g.dietary_notes ? `${g.dietary_notes} | Messaggio: ${declineMessage}` : `Messaggio: ${declineMessage}`,
      }));
    }

    const ok = await weddingApi.saveRsvp(cluster.id, finalGuests);
    setIsSaving(false);
    if (ok) {
      setSavedSuccess(true);
      if (hasAttending) {
        triggerCelebration();
      }
      if (onRsvpCompleted) onRsvpCompleted();
    }
  };

  if (!cluster) {
    return (
      <section id="rsvp" className="py-16 sm:py-24 bg-cream">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="p-8 sm:p-12 rounded-4xl bg-paper shadow-wedding border border-blush/30">
            <div className="w-14 h-14 rounded-full bg-blush-soft text-burgundy flex items-center justify-center mx-auto mb-4">
              <KeyRound className="w-7 h-7 text-burgundy" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-burgundy mb-2">
              Conferma la tua Presenza
            </h2>
            <div className="w-12 h-1 bg-blush rounded-full mx-auto my-3" />
            <p className="text-xs sm:text-sm text-burgundy/70 max-w-md mx-auto mb-8">
              Per confermare la partecipazione per te e per i componenti del tuo nucleo familiare,
              accedi inserendo il tuo nome e cognome. <br/><br/>
              <strong className="font-semibold text-burgundy">Vi chiediamo gentilmente di confermare entro l'8 maggio.</strong>
            </p>
            <button
              onClick={onOpenAuth}
              className="px-8 py-4 rounded-full bg-burgundy hover:bg-burgundy-light text-paper text-sm font-semibold uppercase tracking-wider shadow-wedding transition-all"
            >
              Accedi al tuo Invito
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="rsvp" className="py-16 sm:py-24 bg-cream scroll-mt-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-widest text-burgundy/60 font-semibold">
            RSVP Ufficiale
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-burgundy mt-1">
            Conferma Presenza
          </h2>
          <div className="w-14 h-1 bg-blush rounded-full mx-auto my-3" />
          <p className="text-xs sm:text-sm text-burgundy/70">
            Gruppo: <strong className="text-burgundy font-semibold">{cluster.family_name}</strong> · {cluster.guests.length} {cluster.guests.length === 1 ? 'ospite' : 'ospiti'}
          </p>
          <p className="text-xs sm:text-sm font-semibold text-burgundy mt-2">
            Vi chiediamo gentilmente di confermare entro l'8 maggio.
          </p>
        </div>

        {/* Stepper Progress Indicator */}
        <div className="mb-8 max-w-lg mx-auto px-2">
          <div className="relative grid grid-cols-4 w-full">
            {/* Background connecting track line */}
            <div className="absolute left-[12.5%] right-[12.5%] top-5 -translate-y-1/2 h-0.5 bg-blush/30 -z-0" />
            
            {/* Active connecting track fill line */}
            <div
              className="absolute left-[12.5%] top-5 -translate-y-1/2 h-0.5 bg-burgundy transition-all duration-300 -z-0"
              style={{
                width: `${((Math.min(step, 4) - 1) / 3) * 75}%`,
              }}
            />

            {[
              { num: 1, label: 'Presenze' },
              { num: 2, label: 'Menu & Dettagli' },
              { num: 3, label: 'DJ Set' },
              { num: 4, label: 'Riepilogo' },
            ].map(s => {
              const isActive = step === s.num;
              const isPassed = step > s.num;
              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => {
                    if (savedSuccess) setSavedSuccess(false);
                    setStep(s.num);
                  }}
                  className="relative z-10 flex flex-col items-center justify-start group cursor-pointer focus:outline-none"
                  aria-label={`Vai allo step ${s.num}: ${s.label}`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-xs transition-all shadow-sm ${
                      isPassed
                        ? 'bg-burgundy text-paper hover:bg-burgundy-light group-hover:scale-110'
                        : isActive
                        ? 'bg-blush text-burgundy ring-4 ring-blush/30 group-hover:scale-110'
                        : 'bg-paper text-burgundy/60 border border-blush/40 hover:border-burgundy/40 hover:text-burgundy group-hover:scale-110'
                    }`}
                  >
                    {isPassed ? <Check className="w-4 h-4 text-paper" /> : s.num}
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs mt-1.5 font-medium transition-colors text-center hidden sm:block ${
                      isActive ? 'text-burgundy font-semibold' : 'text-burgundy/60 group-hover:text-burgundy'
                    }`}
                  >
                    {s.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Card */}
        <div className="p-6 sm:p-10 rounded-4xl bg-paper shadow-wedding-lg border border-blush/30">
          {savedSuccess ? (
            /* Success Completion Screen */
            <div className="text-center py-6 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-blush-soft text-burgundy flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="font-serif text-3xl text-burgundy mb-2">
                Grazie, {cluster.family_name}!
              </h3>
              <p className="text-sm text-burgundy/80 max-w-md mx-auto mb-6">
                Le vostre risposte sono state salvate con successo.
                {hasAttending ? (
                  <span className="block mt-2 font-medium text-burgundy">
                    Siamo felicissimi di avervi con noi a Cascina Ranverso il 29 Maggio 2027! 🥂
                  </span>
                ) : (
                  <span className="block mt-2">
                    Ci dispiace che non possiate esserci, vi porteremo comunque nel cuore!
                  </span>
                )}
              </p>
              <button
                onClick={() => {
                  setSavedSuccess(false);
                  setStep(1);
                }}
                className="px-6 py-2.5 rounded-full border border-blush text-burgundy text-xs font-semibold hover:bg-cream transition-colors"
              >
                Modifica risposte
              </button>
            </div>
          ) : (
            <>
              {/* STEP 1: Individual Member Attendance */}
              {step === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blush/20 pb-3">
                    <div>
                      <h3 className="font-serif text-xl text-burgundy font-medium">
                        Presenza per singolo ospite
                      </h3>
                      <p className="text-xs text-burgundy/70">
                        Indica chi potrà partecipare tra i componenti del gruppo:
                      </p>
                    </div>

                    {/* Quick batch selectors */}
                    {guestForms.length > 1 && (
                      <div className="flex items-center gap-1.5 self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={() => setAllAttendance(true)}
                          className="text-[11px] font-semibold text-burgundy hover:text-burgundy-light bg-cream hover:bg-blush-soft px-3 py-1 rounded-full border border-blush/30 transition-colors"
                        >
                          Tutti presenti
                        </button>
                        <button
                          type="button"
                          onClick={() => setAllAttendance(false)}
                          className="text-[11px] font-semibold text-burgundy/70 hover:text-burgundy bg-cream hover:bg-blush-soft px-3 py-1 rounded-full border border-blush/30 transition-colors"
                        >
                          Tutti assenti
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Individual Guest Cards */}
                  <div className="space-y-3">
                    {guestForms.map((guest, idx) => {
                      const isAttending = guest.is_attending === true;
                      const isDeclined = guest.is_attending === false;

                      return (
                        <div
                          key={guest.id}
                          className={`p-4 sm:p-5 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                            isAttending
                              ? 'bg-blush-soft/40 border-burgundy shadow-sm'
                              : isDeclined
                              ? 'bg-cream/40 border-blush/40 opacity-75'
                              : 'bg-cream/20 border-blush/30 hover:border-blush'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-serif text-sm font-semibold shrink-0 ${
                              isAttending
                                ? 'bg-burgundy text-paper'
                                : 'bg-blush-soft text-burgundy'
                            }`}>
                              {idx + 1}
                            </div>
                            <div>
                              <span className="font-serif text-lg font-medium text-burgundy block leading-tight">
                                {guest.first_name} {guest.last_name}
                              </span>
                              <span className="text-[11px] text-burgundy/60 font-medium">
                                {guest.is_child ? '👶 Bambino' : '👤 Adulto'}
                              </span>
                            </div>
                          </div>

                          {/* Attendance Options for this Member */}
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => updateGuest(guest.id, { is_attending: true })}
                              className={`flex-1 sm:flex-initial px-4 py-2 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                                isAttending
                                  ? 'bg-burgundy text-paper shadow-sm'
                                  : 'bg-paper text-burgundy/80 border border-blush/40 hover:border-burgundy'
                              }`}
                            >
                              <CheckCircle2 className="w-4 h-4 text-blush" />
                              <span>Presente</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => updateGuest(guest.id, { is_attending: false })}
                              className={`flex-1 sm:flex-initial px-4 py-2 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                                isDeclined
                                  ? 'bg-burgundy text-paper shadow-sm'
                                  : 'bg-paper text-burgundy/80 border border-blush/40 hover:border-burgundy'
                              }`}
                            >
                              <XCircle className="w-4 h-4 text-blush" />
                              <span>Non presente</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Summary Status of Selections */}
                  <div className="flex items-center justify-between text-xs px-2 pt-1 font-medium text-burgundy/70">
                    <span>
                      Presenti: <strong className="text-burgundy font-semibold">{attendingGuests.length}</strong> · Assenti: <strong className="text-burgundy font-semibold">{declinedGuests.length}</strong>
                    </span>
                    {unconfirmedGuests.length > 0 && (
                      <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 text-[11px]">
                        {unconfirmedGuests.length} da confermare
                      </span>
                    )}
                  </div>

                  {/* Case A: Everyone Declines */}
                  {allDeclined && (
                    <div className="mt-4 p-5 rounded-3xl bg-cream border border-blush/40 space-y-3 animate-fade-in">
                      <div className="text-xs font-semibold uppercase tracking-wider text-burgundy">
                        Ci dispiace che non possiate esserci! Lasciateci un saluto:
                      </div>
                      <textarea
                        rows={3}
                        value={declineMessage}
                        onChange={e => setDeclineMessage(e.target.value)}
                        placeholder="Scriveteci un augurio o un messaggio..."
                        className="w-full p-3.5 rounded-2xl border border-blush/50 text-xs text-burgundy focus:border-burgundy outline-none resize-none bg-paper"
                      />
                      <button
                        onClick={handleSaveRsvp}
                        disabled={isSaving}
                        className="w-full py-3.5 rounded-full bg-burgundy hover:bg-burgundy-light text-paper text-xs font-semibold uppercase tracking-wider shadow-sm transition-all"
                      >
                        {isSaving ? 'Salvataggio in corso...' : 'Invia Risposta'}
                      </button>
                    </div>
                  )}

                  {/* Case B: At least one person attending */}
                  {hasAttending && (
                    <div className="pt-4 flex justify-end">
                      <button
                        onClick={() => setStep(2)}
                        disabled={!allAnswered}
                        className="py-3.5 px-7 rounded-full bg-burgundy hover:bg-burgundy-light text-paper text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm disabled:opacity-50"
                      >
                        <span>Continua: Menu ({attendingGuests.length} presenti)</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: Menu & Dietary Details (ONLY FOR ATTENDING GUESTS) */}
              {step === 2 && (
                <div className="space-y-8 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-blush/30 pb-3">
                    <div>
                      <h3 className="font-serif text-xl text-burgundy">
                        Menu &amp; Esigenze Alimentari
                      </h3>
                      <p className="text-xs text-burgundy/70">
                        Configura le preferenze per i partecipanti confermati ({attendingGuests.length}):
                      </p>
                    </div>
                    <span className="text-xs text-burgundy/60 font-medium">
                      Passo 2 di 4
                    </span>
                  </div>

                  <div className="space-y-6">
                    {attendingGuests.map((guest, idx) => (
                      <div
                        key={guest.id}
                        className="p-5 sm:p-6 rounded-3xl bg-cream/50 border border-blush/40 space-y-4"
                      >
                        {/* Guest Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-burgundy text-paper flex items-center justify-center font-serif text-sm font-semibold">
                              {idx + 1}
                            </div>
                            <span className="font-serif text-lg font-medium text-burgundy">
                              {guest.first_name} {guest.last_name}
                            </span>
                          </div>

                          {/* Adult / Child Switch */}
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => updateGuest(guest.id, { is_child: !guest.is_child })}
                              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                                guest.is_child
                                  ? 'bg-accentGold text-paper border-accentGold'
                                  : 'bg-paper text-burgundy/70 border-blush/40'
                              }`}
                            >
                              {guest.is_child ? '👶 Menu Bambino' : '👤 Adulto'}
                            </button>
                          </div>
                        </div>

                        {/* Dietary Tags */}
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider font-semibold text-burgundy/80 mb-2">
                            Intolleranze, allergie o preferenze alimentari:
                          </label>
                          <div className="flex flex-wrap gap-1.5">
                            {DIETARY_OPTIONS.map(opt => {
                              const selected = guest.dietary_tags.includes(opt.id);
                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() => toggleDietaryTag(guest.id, opt.id)}
                                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                    selected
                                      ? 'bg-burgundy text-paper shadow-sm'
                                      : 'bg-paper text-burgundy/80 border border-blush/40 hover:border-burgundy'
                                  }`}
                                >
                                  {opt.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Notes input */}
                        <div>
                          <input
                            type="text"
                            value={guest.dietary_notes}
                            onChange={e => updateGuest(guest.id, { dietary_notes: e.target.value })}
                            placeholder="Altre allergie gravi o note particolari..."
                            className="w-full px-4 py-2 rounded-2xl border border-blush/40 text-xs text-burgundy bg-paper outline-none focus:border-burgundy"
                          />
                        </div>

                        {/* Bus seat checkbox (flag-controlled) */}
                        {weddingConfig.features.enableShuttleBuses && (
                          <label className="flex items-center gap-2.5 cursor-pointer pt-1">
                            <input
                              type="checkbox"
                              checked={guest.bus_seat_reserved}
                              onChange={e => updateGuest(guest.id, { bus_seat_reserved: e.target.checked })}
                              className="w-4 h-4 rounded text-burgundy focus:ring-burgundy accent-burgundy"
                            />
                            <span className="text-xs text-burgundy/90 font-medium flex items-center gap-1">
                              <Bus className="w-3.5 h-3.5 text-blush" />
                              Riserva posto sulla navetta serale di rientro per questo ospite
                            </span>
                          </label>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      onClick={() => setStep(1)}
                      className="py-3 px-5 rounded-full border border-blush/50 text-burgundy text-xs font-semibold uppercase tracking-wider flex items-center gap-2 hover:bg-cream transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Indietro</span>
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="py-3 px-6 rounded-full bg-burgundy hover:bg-burgundy-light text-paper text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm"
                    >
                      <span>Continua: DJ Set</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: DJ Set Songs (ONLY FOR ATTENDING GUESTS) */}
              {step === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="text-center max-w-md mx-auto mb-6">
                    <div className="w-12 h-12 rounded-full bg-blush-soft text-burgundy flex items-center justify-center mx-auto mb-3">
                      <Music className="w-6 h-6 text-burgundy" />
                    </div>
                    <h3 className="font-serif text-2xl text-burgundy">
                      La Canzone per la Festa
                    </h3>
                    <p className="text-xs text-burgundy/70 mt-1">
                      Quale canzone vi farà assolutamente correre a ballare in pista a Cascina Ranverso?
                    </p>
                  </div>

                  <div className="space-y-4">
                    {attendingGuests.map((guest) => (
                      <div key={guest.id} className="p-4 rounded-2xl bg-cream border border-blush/30">
                        <label className="block text-xs font-semibold text-burgundy mb-1.5">
                          Canzone preferita di {guest.first_name}:
                        </label>
                        <input
                          type="text"
                          value={guest.song_request}
                          onChange={e => updateGuest(guest.id, { song_request: e.target.value })}
                          placeholder="es. Gloria Gaynor - I Will Survive"
                          className="w-full px-4 py-2.5 rounded-xl border border-blush/50 text-xs text-burgundy bg-paper outline-none focus:border-burgundy"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      onClick={() => setStep(2)}
                      className="py-3 px-5 rounded-full border border-blush/50 text-burgundy text-xs font-semibold uppercase tracking-wider flex items-center gap-2 hover:bg-cream transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Indietro</span>
                    </button>
                    <button
                      onClick={() => setStep(4)}
                      className="py-3 px-6 rounded-full bg-burgundy hover:bg-burgundy-light text-paper text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm"
                    >
                      <span>Riepilogo Finale</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Review and Submit */}
              {step === 4 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="text-center mb-6">
                    <h3 className="font-serif text-2xl text-burgundy">
                      Riepilogo Risposte
                    </h3>
                    <p className="text-xs text-burgundy/70 mt-1">
                      Controlla le scelte prima di confermare definitivamente.
                    </p>
                  </div>

                  <div className="p-5 rounded-3xl bg-cream border border-blush/40 space-y-4">
                    <div className="flex items-center justify-between border-b border-blush/20 pb-2">
                      <span className="text-xs text-burgundy/70 uppercase tracking-wider font-semibold">
                        Nucleo:
                      </span>
                      <span className="text-sm font-semibold text-burgundy">
                        {cluster.family_name}
                      </span>
                    </div>

                    {/* Attending guests list */}
                    {attendingGuests.length > 0 && (
                      <div className="space-y-3">
                        <div className="text-[11px] uppercase tracking-wider font-semibold text-burgundy">
                          ✓ Ospiti Presenti ({attendingGuests.length}):
                        </div>
                        {attendingGuests.map(guest => (
                          <div key={guest.id} className="text-xs text-burgundy space-y-1 pb-2 border-b border-blush/10 pl-2">
                            <div className="font-semibold flex items-center justify-between">
                              <span>{guest.first_name} {guest.last_name}</span>
                              <span className="text-[11px] text-burgundy bg-blush-soft px-2 py-0.5 rounded-full border border-blush/40">
                                {guest.is_child ? '👶 Bambino' : '👤 Adulto'}
                              </span>
                            </div>
                            {guest.dietary_tags.length > 0 && (
                              <div className="text-[11px] text-burgundy/70">
                                Menu: {guest.dietary_tags.includes('none')
                                  ? 'Nessuna intolleranza'
                                  : guest.dietary_tags.map(t => DIETARY_OPTIONS.find(o => o.id === t)?.label.replace(/^[^\s]+\s/, '') || t).join(', ')}
                              </div>
                            )}
                            {guest.dietary_notes && (
                              <div className="text-[11px] text-burgundy/70 italic">
                                Note: "{guest.dietary_notes}"
                              </div>
                            )}
                            {weddingConfig.features.enableShuttleBuses && guest.bus_seat_reserved && (
                              <div className="text-[11px] text-burgundy/80 font-medium">
                                🚌 Posto navetta riservato
                              </div>
                            )}
                            {guest.song_request && (
                              <div className="text-[11px] text-burgundy/80">
                                🎵 Canzone: "{guest.song_request}"
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Declined guests list */}
                    {declinedGuests.length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t border-blush/20">
                        <div className="text-[11px] uppercase tracking-wider font-semibold text-burgundy/60">
                          ✗ Ospiti Assenti ({declinedGuests.length}):
                        </div>
                        {declinedGuests.map(guest => (
                          <div key={guest.id} className="text-xs text-burgundy/70 pl-2 flex items-center justify-between">
                            <span>{guest.first_name} {guest.last_name}</span>
                            <span className="text-[10px] text-burgundy/50 italic">Non parteciperà</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      onClick={() => setStep(3)}
                      className="py-3 px-5 rounded-full border border-blush/50 text-burgundy text-xs font-semibold uppercase tracking-wider flex items-center gap-2 hover:bg-cream transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Modifica</span>
                    </button>
                    <button
                      onClick={handleSaveRsvp}
                      disabled={isSaving}
                      className="py-4 px-8 rounded-full bg-burgundy hover:bg-burgundy-light text-paper text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all shadow-wedding hover:shadow-wedding-lg"
                    >
                      <Sparkles className="w-4 h-4 text-accentGold" />
                      <span>{isSaving ? 'Salvataggio in corso...' : 'Invia e Salva Risposte'}</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};
