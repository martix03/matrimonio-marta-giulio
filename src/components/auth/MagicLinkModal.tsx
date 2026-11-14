import React, { useState, useEffect } from "react";
import { X, UserSearch, Check } from "lucide-react";

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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;
    setIsSubmitting(true);
    setSuccessMessage(null);
    const success = await onLoginName(firstName.trim(), lastName.trim());
    setIsSubmitting(false);
    if (success) {
      setSuccessMessage("Invito trovato!");
      setTimeout(() => {
        onClose();
        setSuccessMessage(null);
        setTimeout(() => {
          const banner = document.getElementById("banner-benvenuto");
          if (banner) {
            banner.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 120);
      }, 750);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-burgundy/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-paper rounded-4xl shadow-wedding-lg p-6 sm:p-8 border border-blush/30 text-bordeaux">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-2xl text-bordeaux/60 hover:text-bordeaux hover:bg-cream transition-colors"
          aria-label="Chiudi"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-blush-soft text-bordeaux flex items-center justify-center mx-auto mb-3">
            <UserSearch className="w-6 h-6 text-bordeaux" />
          </div>
          <h2 className="titolo font-semibold text-bordeaux">
            {currentFamily ? "Il tuo Invito Personale" : "Accedi al tuo Invito"}
          </h2>
          <p className="sottotitolo text-bordeaux/70 mt-1">
            {currentFamily
              ? `Attualmente connesso come: ${currentFamily}`
              : "Inserisci il tuo nome e cognome per trovare il tuo invito."}
          </p>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 body rounded-xl border border-red-200">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-3 bg-blush-soft text-bordeaux body rounded-xl border border-blush/40 flex items-center gap-2">
            <Check className="w-4 h-4 text-bordeaux" strokeWidth={2.5} />
            {successMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleNameSubmit} className="flex flex-col">
          <div className="mb-3.5">
            <label className="block body font-semibold uppercase tracking-wider text-bordeaux/80 mb-1">
              Nome
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="es. Marco"
              className="w-full px-4 py-2.5 rounded-2xl border border-blush/60 focus:border-burgundy focus:ring-2 focus:ring-burgundy/10 sottotitolo text-bordeaux outline-none transition-all"
            />
          </div>
          <div>
            <label className="block body font-semibold uppercase tracking-wider text-bordeaux/80 mb-1">
              Cognome
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="es. Rossi"
              className="w-full px-4 py-2.5 rounded-2xl border border-blush/60 focus:border-burgundy focus:ring-2 focus:ring-burgundy/10 sottotitolo text-bordeaux outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !firstName.trim() || !lastName.trim()}
            className="btn-primary w-full mt-6 lg:mt-8 sm:mt-8 py-3 body sottotitolo cursor-pointer"
          >
            {isSubmitting ? "Ricerca in corso..." : "Trova il mio Invito"}
          </button>
        </form>
      </div>
    </div>
  );
};
