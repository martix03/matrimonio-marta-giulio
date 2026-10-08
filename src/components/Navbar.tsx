import React, { useState, useEffect } from 'react';
import { Menu, X, UserCheck, KeyRound } from 'lucide-react';
import { Cluster } from '../types';
import { useSettings } from '../contexts/SettingsContext';
import logoImg from '../assets/logo.png';

interface NavbarProps {
  cluster: Cluster | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ cluster, onOpenAuth, onLogout }) => {
  const { settings } = useSettings();
  const { settings } = useSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Info & Orari', href: '#dettagli' },
    { name: 'RSVP', href: '#rsvp' },
    ...(settings.features.enableLogisticsHub
      ? [{ name: 'Logistica & Auto', href: '#logistica' }]
      : []),
    { name: 'Lista Nozze', href: '#lista-nozze' },
    { name: 'Guida & Mappa', href: '#mappa' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'glass-nav py-3 shadow-sm'
          : 'bg-cream/90 backdrop-blur-md py-4 border-b border-blush/20'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand */}
        <a href="#home" className="flex items-center gap-2 group">
          <img src={logoImg} alt="Logo" className="w-8 h-8 object-contain" />
          <span className="font-serif text-lg sm:text-xl font-normal text-burgundy tracking-wide group-hover:text-burgundy-light transition-colors">
            Marta <span className="text-blush font-serif italic">&</span> Giulio
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs uppercase tracking-widest font-medium text-burgundy/80">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="hover:text-burgundy hover:scale-105 transition-all relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-blush hover:after:w-full after:transition-all"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Auth / Action Button */}
        <div className="hidden sm:flex items-center gap-3">
          {cluster ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAuth}
                className="px-3.5 py-1.5 rounded-full bg-blush-soft border border-blush/40 text-burgundy text-xs font-medium flex items-center gap-1.5 hover:bg-blush/30 transition-colors"
                title="Gestisci nucleo familiare"
              >
                <UserCheck className="w-3.5 h-3.5 text-burgundy" />
                <span>{cluster.family_name}</span>
              </button>
              <button
                onClick={onLogout}
                className="text-[11px] text-burgundy/50 hover:text-burgundy underline transition-colors"
              >
                Esci
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-1.5 rounded-full bg-burgundy hover:bg-burgundy-light text-paper text-xs font-semibold tracking-wider uppercase transition-all shadow-sm flex items-center gap-1.5"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Accedi</span>
            </button>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl text-burgundy hover:bg-blush-soft transition-colors"
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-nav border-b border-blush/40 px-6 py-5 animate-fade-in shadow-xl">
          <nav className="flex flex-col gap-3 text-sm font-medium uppercase tracking-wider text-burgundy">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-xl hover:bg-blush-soft transition-colors"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-3 border-t border-blush/30 mt-2 flex flex-col gap-2">
              {cluster ? (
                <div className="flex items-center justify-between bg-blush-soft p-3 rounded-2xl">
                  <div className="flex items-center gap-2 text-xs font-medium text-burgundy">
                    <UserCheck className="w-4 h-4 text-burgundy" />
                    <span>{cluster.family_name}</span>
                  </div>
                  <button
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs text-burgundy/60 underline"
                  >
                    Esci
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onOpenAuth();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3 rounded-full bg-burgundy text-paper text-xs font-semibold uppercase tracking-wider shadow-sm flex items-center justify-center gap-2"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Accedi con Invito</span>
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
