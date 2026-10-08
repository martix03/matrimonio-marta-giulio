import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { weddingApi } from '../services/supabase';
import { weddingConfig as defaultConfig } from '../config/wedding.config';

export interface WeddingSettings {
  couple: {
    bride: string;
    groom: string;
    fullName: string;
    hashtag: string;
  };
  event: {
    date: string;
    displayDate: string;
    city: string;
    ceremonyTime: string;
    receptionTime: string; time?: string;
  };
  rsvp: {
    deadline: string;
  };
  registry: {
    bank: string;
    iban: string;
    holder: string;
    bic: string;
  };
  contacts: {
    marta: { name: string; phone: string; email: string };
    giulio: { name: string; phone: string; email: string };
  };
  // We keep features and locations static for now unless needed
  features?: any;
  locations?: any;
}

interface SettingsContextProps {
  settings: WeddingSettings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextProps>({
  settings: {
    ...defaultConfig,
    rsvp: { deadline: '2027-03-15' }
  },
  loading: true,
  refreshSettings: async () => {},
});

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<WeddingSettings>({
    ...defaultConfig,
    rsvp: { deadline: '2027-03-15' }
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await weddingApi.getSettings();
      if (data && data.config) {
        setSettings({
          ...defaultConfig,
          ...data.config,
          rsvp: data.config.rsvp || { deadline: '2027-03-15' }
        });
      }
    } catch (e) {
      console.error('Error fetching settings:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
