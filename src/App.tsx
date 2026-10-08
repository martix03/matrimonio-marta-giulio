import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { Navbar } from './components/Navbar';
import { Hero } from './components/home/Hero';
import { QuickFacts } from './components/home/QuickFacts';
import { RsvpStepper } from './components/rsvp/RsvpStepper';
import { LogisticsHub } from './components/logistics/LogisticsHub';
import { WeddingRegistry } from './components/registry/WeddingRegistry';
import { InteractiveMap } from './components/map/InteractiveMap';
import { FaqSection } from './components/faq/FaqSection';
import { Footer } from './components/Footer';
import { MagicLinkModal } from './components/auth/MagicLinkModal';
import { useSettings } from './contexts/SettingsContext';
import { AdminDashboard } from './components/admin/AdminDashboard';

export function App() {
  const { settings } = useSettings();
  const {
    cluster,
    loading,
    error,
    loginWithCode,
    loginWithName,
    logout,
    refreshCluster,
  } = useAuth();

  const [authModalOpen, setAuthModalOpen] = useState(false);

  if (cluster?.family_name === 'Admin') {
    return <AdminDashboard cluster={cluster} onLogout={logout} />;
  }

  return (
    <div className="min-h-screen bg-cream text-burgundy font-sans selection:bg-blush/30 selection:text-burgundy flex flex-col">
      {/* Top Fixed Navbar */}
      <Navbar
        cluster={cluster}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={logout}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero with Countdown & Contextual Greeting */}
        <Hero
          cluster={cluster}
          onOpenRsvp={() => {
            if (!cluster) setAuthModalOpen(true);
            const rsvpElem = document.getElementById('rsvp');
            if (rsvpElem) rsvpElem.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Wedding Flash Info Cards */}
        <QuickFacts />

        {/* Dynamic Multi-Step RSVP Form */}
        <RsvpStepper
          cluster={cluster}
          onOpenAuth={() => setAuthModalOpen(true)}
          onRsvpCompleted={refreshCluster}
        />

        {/* Logistics Hub (Shuttle Bus & Carpooling) - Flag-controlled */}
        {settings?.features?.enableLogisticsHub && <LogisticsHub />}

        {/* Honeymoon Registry */}
        <WeddingRegistry cluster={cluster} />

        {/* Interactive Leaflet Map & Local Recommendations */}
        <InteractiveMap />

        {/* FAQ Section */}
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Authentication & Cluster Modal */}
      <MagicLinkModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginCode={loginWithCode}
        onLoginName={loginWithName}
        currentFamily={cluster?.family_name}
        error={error}
      />
    </div>
  );
}

export default App;
