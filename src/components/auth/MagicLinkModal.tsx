import React, { useState } from 'react';
import { X, UserSearch, Sparkles, CheckCircle2 } from 'lucide-react';

interface MagicLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginCode: (code: string) => Promise<boolean>;
  onLoginName: (firstName: string, lastName: string) => Promise<boolean>;
  currentFamily?: string;
  error?: string | null;
}

export const MagicLinkModal: React.FC<MagicLinkModalProps> = ({
  isOpen,
  onClose,
  onLoginCode,
  onLoginName,
  currentFamily,
  error,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;
    setIsSubmitting(true);
    setSuccessMessage(null);
    const success = await onLoginName(firstName.trim(), lastName.trim());
    setIsSubmitting(false);
    if (success) {
      setSuccessMessage('Invito trovato!');
      setTimeout(() => {
        onClose();
        setSuccessMessage(null);
      }, 1000);
    }
  };

  const handleQuickDemo = (demoCode: string) => {
    onLoginCode(demoCode).then((ok) => {
      if (ok) {
        setSuccessMessage('Accesso demo riuscito!');
        setTimeout(() => {
          onClose();
          setSuccessMessage(null);
        }, 1000);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-burgundy/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-paper rounded-4xl shadow-wedding-lg p-6 sm:p-8 border border-blush/30 text-burgundy">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-burgundy/60 hover:text-burgundy hover:bg-cream transition-colors"
          aria-label="Chiudi"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-blush-soft text-burgundy flex items-center justify-center mx-auto mb-3">
            <UserSearch className="w-6 h-6 text-burgundy" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-burgundy">
            {currentFamily ? 'Il tuo Invito Personale' : 'Accedi al tuo Invito'}
          </h2>
          <p className="text-xs sm:text-sm text-burgundy/70 mt-1">
            {currentFamily
              ? `Attualmente connesso come: ${currentFamily}`
              : 'Inserisci il tuo nome e cognome per trovare il tuo invito.'}
          </p>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {successMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleNameSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy/80 mb-1">
              Nome
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="es. Marco"
              className="w-full px-4 py-2.5 rounded-2xl border border-blush/60 focus:border-burgundy focus:ring-2 focus:ring-burgundy/10 text-sm text-burgundy outline-none transition-all"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy/80 mb-1">
              Cognome
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="es. Rossi"
              className="w-full px-4 py-2.5 rounded-2xl border border-blush/60 focus:border-burgundy focus:ring-2 focus:ring-burgundy/10 text-sm text-burgundy outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !firstName.trim() || !lastName.trim()}
            className="w-full mt-4 py-3.5 px-6 rounded-full bg-burgundy hover:bg-burgundy-light text-paper font-semibold text-sm shadow-wedding hover:shadow-wedding-lg transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Ricerca in corso...' : 'Trova il mio Invito'}
          </button>
        </form>

        {/* Quick Demo Selector */}
        <div className="mt-6 pt-4 border-t border-blush/30 text-center">
          <div className="flex items-center justify-center gap-1 text-[11px] text-burgundy/60 mb-2 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-accentGold" />
            <span>Vuoi testare subito un gruppo di esempio?</span>
          </div>
          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('ROSSI26')}
              className="px-3 py-1 text-xs rounded-full bg-cream hover:bg-blush/20 text-burgundy font-medium border border-blush/40 transition-colors"
            >
              Fam. Rossi
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('FERRARI26')}
              className="px-3 py-1 text-xs rounded-full bg-cream hover:bg-blush/20 text-burgundy font-medium border border-blush/40 transition-colors"
            >
              Marta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
