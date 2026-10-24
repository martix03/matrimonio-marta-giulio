import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, XCircle, Users, Utensils, Music, Sparkles, 
  ArrowRight, ArrowLeft, Bus, Check, AlertCircle, Edit2, X 
} from 'lucide-react';
import { Cluster, Guest, DietaryTag } from '../../types';
import { weddingApi } from '../../services/supabase';
import { useSettings } from '../../contexts/SettingsContext';
import { MiniWave, StepperTitle, StepperOnde, StepperDate, StepperBolle, ConfermaBolle, CarloFace } from '../home/GraficaElements';

interface RsvpStepperProps {
  cluster: Cluster | null;
  onOpenAuth: () => void;
  onRsvpCompleted?: () => void;
}

const DIETARY_OPTIONS: { id: DietaryTag; label: string }[] = [
  { id: 'none', label: 'Nessuna intolleranza' },
  { id: 'gluten_free', label: 'Senza Glutine (Celiachia)' },
  { id: 'lactose_free', label: 'Senza Lattosio' },
  { id: 'vegetarian', label: 'Vegetariano' },
  { id: 'vegan', label: 'Vegano' },
  { id: 'no_nuts', label: 'Senza Frutta a Guscio' },
  { id: 'no_shellfish', label: 'No Crostacei / Frutti di mare' },
];

export const RsvpStepper: React.FC<RsvpStepperProps> = ({ cluster, onOpenAuth, onRsvpCompleted }) => {
  const { settings } = useSettings();
  const [step, setStep] = useState<number>(1);
  const [declineMessage, setDeclineMessage] = useState<string>('');
  const [guestForms, setGuestForms] = useState<Guest[]>(() =>
    cluster?.guests ? JSON.parse(JSON.stringify(cluster.guests)) : []
  );
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Sync cluster guests into local form state
  useEffect(() => {
    if (cluster?.guests) {
      setGuestForms(JSON.parse(JSON.stringify(cluster.guests)));
      setIsEditing(false);
      setSavedSuccess(false);
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
        const currentTags = g.dietary_tags || [];

        if (tag === 'none') {
          const isSelected = currentTags.includes('none');
          // If toggling 'none', clear all other specific tags
          return { ...g, dietary_tags: isSelected ? [] : ['none'] };
        } else {
          // If selecting a specific intolerance, remove 'none'
          const withoutNone = currentTags.filter(t => t !== 'none');
          const exists = withoutNone.includes(tag);
          const updated = exists
            ? withoutNone.filter(t => t !== tag)
            : [...withoutNone, tag];
          return { ...g, dietary_tags: updated };
        }
      })
    );
  };

  const clusterGuests = cluster?.guests || [];
  const attendingGuests = guestForms.filter(g => g.is_attending === true);
  const declinedGuests = guestForms.filter(g => g.is_attending === false);
  const unconfirmedGuests = guestForms.filter(g => g.is_attending === null);
  const allAnswered = guestForms.length > 0 && guestForms.every(g => g.is_attending !== null);
  const allDeclined = guestForms.length > 0 && guestForms.every(g => g.is_attending === false);
  const hasAttending = attendingGuests.length > 0;
  const isSingleGuest = guestForms.length === 1;
  const hasAlreadyResponded = clusterGuests.length > 0 && clusterGuests.some(g => g.is_attending !== null);
  const showRecap = (hasAlreadyResponded && !isEditing) || savedSuccess;

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
      setIsEditing(false);
      if (hasAttending) {
        triggerCelebration();
      }
      if (onRsvpCompleted) onRsvpCompleted();
    }
  };

  if (!cluster) {
    return (
      <section id="rsvp" className="bg-[#fbf5f4]">
        

        <div className="text-left lg:text-center">

           <div className="relative overflow-hidden text-white pl-8 pr-8 pt-16 lg:pt-32 pb-16 lg:pb-32">
          {/* Organic soft pink blob at top right */}
          <ConfermaBolle className="absolute top-0 right-0 w-1/3 lg:w-[15%]" />

          <div className="flex flex-col items-start lg:items-center mt-6">
            <StepperTitle className="h-16 lg:h-20 w-auto mb-2" />
            <MiniWave color="#667b4e" className="w-44 lg:w-60 h-auto my-2" strokeWidth={1.5} lgStrokeWidth={1} />
            <p className="text-xs sm:text-sm text-[#4a151d]/75 max-w-md mb-8 text-left lg:text-center">
              Per confermare la partecipazione per te e per i componenti del tuo nucleo familiare,
              accedi inserendo il tuo nome e cognome. <br/><br/>
              <strong className="font-semibold text-[#4a151d] block">Vi chiediamo gentilmente di confermare entro il</strong>
              <StepperDate className="w-20 pt-2 block mx-0 lg:mx-auto"/>
            </p>
            <button
              onClick={onOpenAuth}
              className="px-8 py-4 rounded-2xl bg-[#4a151d] hover:bg-[#6d1828] text-white text-sm font-semibold uppercase tracking-wider transition-all"
            >
              Accedi al tuo Invito
            </button>
          </div>
        </div>
        </div>
      </section>
    );
  }

  return (
    <section id="rsvp" className="bg-[#fbf5f4]">

      {/* 1. Deep Burgundy Banner from grafica.svg */}
        <div className="relative overflow-hidden text-white pl-8 pr-8 pt-8 pb-10">
          {/* Organic soft pink blob at top right */}
          <ConfermaBolle className="absolute top-0 right-0 w-1/3 lg:w-[15%]" />

          <div className="flex flex-col items-start lg:items-center mt-6">
            <StepperTitle className="h-16 lg:h-20 w-auto mb-2" />
            <MiniWave color="#667b4e" className="w-44 lg:w-60 h-auto my-2" strokeWidth={1.5} lgStrokeWidth={1} />
            <p className="text-xs sm:text-sm text-burgundy/70 text-left lg:text-center">
            Gruppo: <strong className="text-burgundy font-semibold">{cluster.family_name}</strong> · {clusterGuests.length} {clusterGuests.length === 1 ? 'ospite' : 'ospiti'}
          </p>
          {!showRecap && (
            <p className="text-xs sm:text-sm font-semibold text-burgundy mt-2 text-left lg:text-center">
              <span className="block">{isSingleGuest ? 'Ti' : 'Vi'} chiediamo gentilmente di confermare entro il</span>
              <StepperDate className="w-20 pt-2 block mx-0 lg:mx-auto"/>
            </p>
            
          )}
          </div>
        </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        

        {/* Stepper Progress Indicator */}
        {!showRecap && (
          <div className="mb-8 max-w-lg mx-auto px-2">
            <div className="relative grid grid-cols-4 w-full">
              {/* Wave track connecting from Circle 1 to Circle 4 */}
              <div className="absolute left-[12.5%] right-[12.5%] top-5 -translate-y-1/2 h-6 pointer-events-none z-0">
                {/* Inactive background wave track */}
                <svg
                  viewBox="0 0 300 24"
                  fill="none"
                  preserveAspectRatio="none"
                  className="w-full h-full"
                  aria-hidden="true"
                >
                  <path
                    d="M 0 12 C 12.5 6, 37.5 6, 50 12 C 62.5 18, 87.5 18, 100 12 C 112.5 6, 137.5 6, 150 12 C 162.5 18, 187.5 18, 200 12 C 212.5 6, 237.5 6, 250 12 C 262.5 18, 287.5 18, 300 12"
                    stroke="#667b4e"
                    strokeOpacity="0.5"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Active filled wave track */}
                <svg
                  viewBox="0 0 300 24"
                  fill="none"
                  preserveAspectRatio="none"
                  className="absolute inset-0 w-full h-full transition-all duration-500 ease-in-out"
                  style={{
                    clipPath: `inset(0 ${100 - ((Math.min(step, 4) - 1) / 3) * 100}% 0 0)`,
                    WebkitClipPath: `inset(0 ${100 - ((Math.min(step, 4) - 1) / 3) * 100}% 0 0)`,
                  }}
                  aria-hidden="true"
                >
                  <path
                    d="M 0 12 C 12.5 6, 37.5 6, 50 12 C 62.5 18, 87.5 18, 100 12 C 112.5 6, 137.5 6, 150 12 C 162.5 18, 187.5 18, 200 12 C 212.5 6, 237.5 6, 250 12 C 262.5 18, 287.5 18, 300 12"
                    stroke="#4a151d"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

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
                          ? 'bg-blush text-burgundy ring-blush/30 group-hover:scale-110'
                          : 'bg-paper text-burgundy/60 border border-blush/40 hover:border-burgundy/40 hover:text-burgundy group-hover:scale-110'
                      }`}
                    >
                      {isPassed ? <Check className="w-4 h-4 text-paper" /> : s.num}
                    </div>
                    <span
                      className={`text-xs mt-1.5 font-medium transition-colors text-center hidden sm:block ${
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
        )}

        {/* Main Card */}
        <div className="relative p-6 mb-16 rounded-4xl bg-[#fffcf7] border-blush/30 overflow-hidden">
          <StepperBolle className="absolute top-0 right-0 w-40 lg:w-48 pointer-events-none z-0" />

          <div className="relative z-10">
            {savedSuccess ? (
            /* Success Completion Screen */
            <div className="text-center py-6 animate-fade-in relative">
              <div className="w-16 h-16 rounded-full bg-blush-soft text-burgundy flex items-center justify-center mx-auto mb-4 border border-blush/40 shadow-sm">
                <CarloFace className="w-8 h-8 object-contain" />
              </div>
              <h3 className="font-serif text-3xl text-burgundy mb-2">
                Grazie, {cluster.family_name}!
              </h3>
              <p className="text-sm text-burgundy/80 max-w-md mx-auto mb-6">
                {isSingleGuest ? 'Le tue risposte sono state salvate con successo.' : 'Le vostre risposte sono state salvate con successo.'}
                {hasAttending ? (
                  <span className="block mt-2 font-medium text-burgundy">
                    Siamo felicissimi di {isSingleGuest ? 'averti' : 'avervi'} con noi a Cascina Ranverso il 29 Maggio 2027!
                  </span>
                ) : (
                  <span className="block mt-2">
                    {isSingleGuest
                      ? 'Ci dispiace che non puoi esserci, ti porteremo comunque nel cuore!'
                      : 'Ci dispiace che non possiate esserci, vi porteremo comunque nel cuore!'}
                  </span>
                )}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setSavedSuccess(false);
                    setIsEditing(true);
                    setStep(1);
                  }}
                  className="px-6 py-2.5 rounded-2xl border border-blush bg-[#fffcf7] text-burgundy text-xs font-semibold hover:bg-cream transition-colors relative z-10"
                >
                  Modifica risposte
                </button>
              </div>
              <StepperOnde className="absolute -bottom-8 -left-10 lg:-bottom-10 lg:-left-10 w-36 sm:w-44 pointer-events-none z-0 opacity-80" />
            </div>
          ) : hasAlreadyResponded && !isEditing ? (
            /* Already Responded Card */
            <div className="text-center py-6 animate-fade-in relative">
              <CarloFace className="w-20 h-20 rounded-full p-2 bg-[#FFF] text-burgundy flex items-center justify-center mx-auto mb-4 border border-blush/40 shadow-sm"/>
              <h3 className="font-serif text-2xl text-burgundy mb-2">
                {isSingleGuest ? 'Hai già risposto all\'invito!' : 'Avete già risposto all\'invito!'}
              </h3>
              <p className="text-sm text-burgundy/80 max-w-md mx-auto mb-6 leading-relaxed">
                {hasAttending ? (
                  isSingleGuest ? (
                    <span>La tua presenza è confermata. Non vediamo l'ora di festeggiare insieme a Cascina Ranverso!</span>
                  ) : (
                    <span>
                      Avete confermato la presenza per{' '}
                      <strong className="text-burgundy">{attendingGuests.length} {attendingGuests.length === 1 ? 'persona' : 'persone'}</strong> su {guestForms.length}.
                      Non vediamo l'ora di festeggiare insieme!
                    </span>
                  )
                ) : (
                  <span>
                    {isSingleGuest
                      ? 'Hai indicato che non potrai esserci. Ci dispiace che non puoi esserci, ti porteremo comunque nel cuore!'
                      : 'Avete indicato che non potrete esserci. Ci dispiace che non possiate esserci, vi porteremo comunque nel cuore!'}
                  </span>
                )}
              </p>

              {/* Guest status recap chips */}
              <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-md mx-auto">
                {guestForms.map(g => (
                  <span
                    key={g.id}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium border shadow-xs ${
                      g.is_attending
                        ? 'bg-blush-soft text-burgundy border-blush/40'
                        : 'bg-cream text-burgundy/60 border-blush/20'
                    }`}
                  >
                    {g.is_attending ? (
                      <Check className="w-3.5 h-3.5 text-burgundy" strokeWidth={2.5} />
                    ) : (
                      <X className="w-3.5 h-3.5 text-burgundy/50" />
                    )}
                    <span>{g.first_name} {g.last_name}</span>
                    <span className="text-[10px] opacity-75 font-serif italic">
                      {g.is_attending ? '(Presente)' : '(Assente)'}
                    </span>
                  </span>
                ))}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(true);
                    setStep(1);
                  }}
                  className="px-8 py-3.5 rounded-2xl bg-burgundy hover:bg-burgundy-light text-paper text-xs font-semibold uppercase tracking-wider shadow-wedding hover:shadow-wedding-lg hover:-translate-y-0.5 transition-all inline-flex items-center gap-2 relative z-10"
                >
                  <span>Modifica le risposte</span>
                </button>
              </div>
              <StepperOnde className="absolute -bottom-8 -left-10 lg:-bottom-10 lg:-left-10 w-36 sm:w-44 pointer-events-none z-0 opacity-80" />
            </div>
          ) : (
            <>
              {/* If isEditing is active, offer a cancel link back to already responded recap */}
            
              {/* STEP 1: Individual Member Attendance */}
              {step === 1 && (
                <div className="animate-fade-in">
                  <div className="mb-6">
                    <h3 className="font-serif text-2xl text-burgundy">
                      Presenza
                    </h3>
                  </div>

                  {/* Individual Guest Cards */}
                  <div>
                    {guestForms.map((guest, idx) => {
                      const isAttending = guest.is_attending === true;
                      const isDeclined = guest.is_attending === false;

                      return (
                        <div
                          key={guest.id}
                          className={`pb-4 pt-4 rounded-3xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 `}
                        >
                          <div className="flex items-center gap-3">
                          
                            <div>
                              <span className="font-serif text-m font-medium text-burgundy block leading-tight">
                                {guest.first_name} {guest.last_name}
                              </span>
                              <span className="text-xs text-burgundy/60 font-medium">
                                {guest.is_child ? 'Bambino' : 'Adulto'}
                              </span>
                            </div>
                          </div>

                          {/* Attendance Options for this Member */}
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => updateGuest(guest.id, { is_attending: true })}
                              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
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
                              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
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
                      <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 text-xs">
                        {unconfirmedGuests.length} da confermare
                      </span>
                    )}
                  </div>

                  {/* Case A: Everyone Declines */}
                  {allDeclined && (
                    <div className="mt-4 space-y-3 animate-fade-in">
                      
                      <div className="pt-6 flex justify-end relative">
                        <StepperOnde className="absolute -bottom-8 -left-10 lg:-left-15 w-36 sm:w-44 pointer-events-none z-0 opacity-80" />
                        <button
                          onClick={handleSaveRsvp}
                          disabled={isSaving}
                        className="py-3.5 px-7 rounded-2xl bg-burgundy hover:bg-burgundy-light text-paper text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm disabled:opacity-50 relative z-10"
                        >
                          {isSaving ? 'Salvataggio in corso...' : 'Invia Risposta'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Case B: At least one person attending */}
                  {hasAttending && (
                    <div className="pt-6 flex justify-end relative">
                      <StepperOnde className="absolute -bottom-8 -left-10 lg:-left-10 w-36 sm:w-44 pointer-events-none z-0 opacity-80" />
                      <button
                        onClick={() => setStep(2)}
                        disabled={!allAnswered}
                        className="py-3.5 px-7 rounded-2xl bg-burgundy hover:bg-burgundy-light text-paper text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm disabled:opacity-50 relative z-10"
                      >
                        <span>Continua</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: Menu & Dietary Details (ONLY FOR ATTENDING GUESTS) */}
              {step === 2 && (
                <div className="relative z-10 space-y-8 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-2xl text-burgundy">
                        Esigenze Alimentari
                      </h3>
                  
                    </div>
                  
                  </div>

                  <div className="space-y-6">
                    {attendingGuests.map((guest, idx) => (
                      <div
                        key={guest.id}
                        className="space-y-4"
                      >
                        {/* Guest Header */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-serif text-m font-medium text-burgundy">
                            {guest.first_name} {guest.last_name}
                          </span>
                        </div>

                        {/* Dietary Tags */}
                        <div>
                        
                          <div className="flex flex-wrap gap-1.5">
                            {DIETARY_OPTIONS.map(opt => {
                              const selected = (guest.dietary_tags || []).includes(opt.id);
                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() => toggleDietaryTag(guest.id, opt.id)}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
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
                            value={guest.dietary_notes || ''}
                            onChange={e => updateGuest(guest.id, { dietary_notes: e.target.value })}
                            placeholder="Altre allergie gravi o note particolari..."
                            className="w-full px-4 py-2 rounded-xl border border-blush/40 text-xs text-burgundy bg-paper outline-none focus:border-burgundy"
                          />
                        </div>

                        {/* Bus seat checkbox (flag-controlled) */}
                        {settings.features?.enableShuttleBuses && (
                          <label className="flex items-center gap-2.5 cursor-pointer pt-1">
                            <input
                              type="checkbox"
                              checked={Boolean(guest.bus_seat_reserved)}
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

                  <div className="pt-6 flex justify-between items-center relative">
                    <StepperOnde className="absolute -bottom-8 -left-10 lg:-left-10 w-36 sm:w-44 pointer-events-none z-0 opacity-80" />
                    <button
                      onClick={() => setStep(1)}
                      className="py-3 px-5 rounded-2xl border border-blush/50 bg-[#fffcf7] text-burgundy text-xs font-semibold uppercase tracking-wider flex items-center gap-2 hover:bg-cream transition-colors relative z-10 shadow-xs"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Indietro</span>
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="py-3 px-6 rounded-2xl bg-burgundy hover:bg-burgundy-light text-paper text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm relative z-10"
                    >
                      <span>Continua</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: DJ Set Songs (ONLY FOR ATTENDING GUESTS) */}
              {step === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="text-left">
                    
                    <h3 className="font-serif text-2xl text-burgundy">
                      La canzone per la festa
                    </h3>
                    <p className="text-xs text-burgundy/70 mt-1">
                      Quale canzone vi farà correre a ballare?
                    </p>
                  </div>

                  <div className="space-y-4">
                    {attendingGuests.map((guest) => (
                      <div key={guest.id} className="">
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

                  <div className="pt-6 flex justify-between items-center relative">
                    <StepperOnde className="absolute -bottom-8 -left-10 lg:-left-10 w-36 sm:w-44 pointer-events-none z-0 opacity-80" />
                    <button
                      onClick={() => setStep(2)}
                      className="py-3 px-5 rounded-2xl border border-blush/50 bg-[#fffcf7] text-burgundy text-xs font-semibold uppercase tracking-wider flex items-center gap-2 hover:bg-cream transition-colors relative z-10 shadow-xs"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Indietro</span>
                    </button>
                    <button
                      onClick={() => setStep(4)}
                      className="py-3 px-6 rounded-2xl bg-burgundy hover:bg-burgundy-light text-paper text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm relative z-10"
                    >
                      <span>Riepilogo</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Review and Submit */}
              {step === 4 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="text-left mb-6">
                    <h3 className="font-serif text-2xl text-burgundy">
                      Riepilogo Risposte
                    </h3>
                    <p className="text-xs text-burgundy/70 mt-1">
                      Controlla le scelte prima di confermare.
                    </p>
                  </div>

                  <div className="pb-4 pt-4">
                  

                    {/* Attending guests list */}
                    {attendingGuests.length > 0 && (
                      <div className="space-y-3">
                        <div className="text-xs uppercase tracking-wider font-semibold text-burgundy flex items-center gap-1.5">
                        
                          <span>Ospiti Presenti:</span>
                        </div>
                        {attendingGuests.map(guest => (
                          <div key={guest.id} className="text-s text-burgundy space-y-1 pb-2 border-b border-blush/10">
                            <div className="font-semibold flex items-baseline">
                              <span>{guest.first_name} {guest.last_name}</span>
                              <span className="text-xs text-burgundy pl-2">
                                {guest.is_child ? 'Bambino' : 'Adulto'}
                              </span>
                            </div>
                            {(guest.dietary_tags || []).length > 0 && (
                              <div className="text-xs text-burgundy/70">
                                Menu: {(guest.dietary_tags || []).includes('none')
                                  ? 'Nessuna intolleranza'
                                  : (guest.dietary_tags || []).map(t => DIETARY_OPTIONS.find(o => o.id === t)?.label || t).join(', ')}
                              </div>
                            )}
                            {guest.dietary_notes && (
                              <div className="text-xs text-burgundy/70 italic">
                                Note: "{guest.dietary_notes}"
                              </div>
                            )}
                            {settings.features?.enableShuttleBuses && guest.bus_seat_reserved && (
                              <div className="text-xs text-burgundy/80 font-medium flex items-center gap-1.5">
                                <Bus className="w-3.5 h-3.5 text-burgundy" />
                                <span>Posto navetta riservato</span>
                              </div>
                            )}
                            {guest.song_request && (
                              <div className="text-xs text-burgundy/80 flex items-center gap-1.5">
                                <Music className="w-3.5 h-3.5 text-burgundy" />
                                <span>Brano per il DJ: "{guest.song_request}"</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Declined guests list */}
                    {declinedGuests.length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t border-blush/20">
                        <div className="text-xs uppercase tracking-wider font-semibold text-burgundy/60 flex items-center gap-1.5">
                          <X className="w-3.5 h-3.5 text-burgundy/60" />
                          <span>Ospiti Assenti ({declinedGuests.length}):</span>
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

                  <div className="pt-6 flex justify-between items-center relative">
                    <StepperOnde className="absolute -bottom-8 -left-10 lg:-left-10 w-36 sm:w-44 pointer-events-none z-0 opacity-80" />
                    <button
                      onClick={() => setStep(3)}
                      className="py-3 px-5 rounded-2xl border border-blush/50 bg-[#fffcf7] text-burgundy text-xs font-semibold uppercase tracking-wider flex items-center gap-2 hover:bg-cream transition-colors relative z-10 shadow-xs"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Modifica</span>
                    </button>
                    <button
                      onClick={handleSaveRsvp}
                      disabled={isSaving}
                      className="py-4 px-8 rounded-2xl bg-burgundy hover:bg-burgundy-light text-paper text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all shadow-wedding hover:shadow-wedding-lg relative z-10"
                    >
                      <span>{isSaving ? 'Salvataggio in corso...' : 'Invia'}</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
          </div>
        </div>
      </div>
    </section>
  );
};
