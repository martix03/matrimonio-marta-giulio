import React, { useState, useEffect } from 'react';
import { Menu, X, UserCheck, KeyRound } from 'lucide-react';
import { Cluster } from '../types';
import { useSettings } from '../contexts/SettingsContext';
import { CarloFace } from './home/GraficaElements';

interface NavbarProps {
  cluster: Cluster | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ cluster, onOpenAuth, onLogout }) => {
  const { settings } = useSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [activeSection, setActiveSection] = useState<string>('#home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sectionIds = ['home', 'dettagli', 'rsvp', 'logistica', 'lista-nozze', 'mappa', 'faq'];
      const scrollPosition = window.scrollY + 140;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(`#${id}`);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
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
          ? 'bg-[#fbf5f4]/85 backdrop-blur-md py-3 shadow-xs border-b border-blush/20'
          : 'bg-transparent py-4 border-b border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand with Carlo avatar */}
        <a href="#home" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-full bg-[#fde7e2] p-0.5 border border-[#dfb0b0]/60 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <CarloFace className="w-full h-full object-contain" />
          </div>
          <span className="font-serif text-lg sm:text-xl font-normal text-[#4a151d] tracking-wide group-hover:text-burgundy-light transition-colors">
            Marta <span className="text-[#667b4e] font-serif italic">&amp;</span> Giulio
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs uppercase tracking-widest font-medium text-[#4a151d]/85">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setActiveSection(link.href)}
                className={`relative py-1 transition-all ${
                  isActive
                    ? 'text-[#4a151d] font-bold after:w-full'
                    : 'text-[#4a151d]/75 hover:text-[#4a151d] hover:scale-105 after:w-0 hover:after:w-full'
                } after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-[#667b4e] after:transition-all after:duration-300`}
              >
                {link.name}
              </a>
            );
          })}
        </nav>

        {/* Auth / Action Button */}
        <div className="hidden sm:flex items-center gap-3">
          {cluster ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAuth}
                className="px-3.5 py-1.5 rounded-2xl bg-blush-soft border border-blush/40 text-burgundy text-xs font-medium flex items-center gap-1.5 hover:bg-blush/30 transition-colors"
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
              className="px-4 py-1.5 rounded-2xl bg-burgundy hover:bg-burgundy-light text-paper text-xs font-semibold tracking-wider uppercase transition-all shadow-sm flex items-center gap-1.5"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Accedi</span>
            </button>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-2xl text-burgundy hover:bg-blush-soft transition-colors"
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-nav border-b border-blush/40 px-6 py-5 animate-fade-in shadow-xl">
          <nav className="flex flex-col gap-3 text-sm font-medium uppercase tracking-wider text-burgundy">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => {
                    setActiveSection(link.href);
                    setMobileMenuOpen(false);
                  }}
                  className={`py-2.5 px-3.5 rounded-xl transition-all flex items-center justify-between ${
                    isActive
                      ? 'bg-[#e5edd8] text-[#4a151d] font-bold border-l-4 border-[#667b4e]'
                      : 'hover:bg-blush-soft text-[#4a151d]/80'
                  }`}
                >
                  <span>{link.name}</span>
                  {isActive && <div className="w-2 h-2 rounded-full bg-[#667b4e]" />}
                </a>
              );
            })}
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
                  className="w-full py-3 rounded-2xl bg-burgundy text-paper text-xs font-semibold uppercase tracking-wider shadow-sm flex items-center justify-center gap-2"
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
