import { useState, useEffect, useCallback } from 'react';
import { Cluster } from '../types';
import { weddingApi } from '../services/supabase';

const AUTH_STORAGE_KEY = 'wedding_saved_invite_code';

export function useAuth() {
  const [cluster, setCluster] = useState<Cluster | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize from URL query param (?code=...) or localStorage
  useEffect(() => {
    async function initAuth() {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams(window.location.search);
      const urlCode = params.get('code') || params.get('invito');

      const codeToUse = urlCode || localStorage.getItem(AUTH_STORAGE_KEY);

      if (codeToUse) {
        try {
          const found = await weddingApi.getClusterByCode(codeToUse);
          if (found) {
            setCluster(found);
            localStorage.setItem(AUTH_STORAGE_KEY, found.invite_code);
          } else {
            // If code from storage was invalid, clean it
            if (!urlCode) localStorage.removeItem(AUTH_STORAGE_KEY);
            setError('Invito non trovato. Prova ad accedere inserendo nome e cognome.');
          }
        } catch (err) {
          console.error(err);
          setError('Errore di connessione durante la verifica dell\'invito.');
        }
      }
      setLoading(false);
    }

    initAuth();
  }, []);

  const loginWithCode = useCallback(async (code: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const found = await weddingApi.getClusterByCode(code);
      if (found) {
        setCluster(found);
        localStorage.setItem(AUTH_STORAGE_KEY, found.invite_code);
        setLoading(false);
        return true;
      } else {
        setError('Codice invito non valido.');
        setLoading(false);
        return false;
      }
    } catch {
      setError('Si è verificato un errore.');
      setLoading(false);
      return false;
    }
  }, []);

  const loginWithName = useCallback(async (firstName: string, lastName: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const found = await weddingApi.searchClusterByName(firstName, lastName);
      if (found) {
        setCluster(found);
        localStorage.setItem(AUTH_STORAGE_KEY, found.invite_code);
        setLoading(false);
        return true;
      } else {
        setError('Nessun invito trovato con questo nome e cognome.');
        setLoading(false);
        return false;
      }
    } catch {
      setError('Si è verificato un errore durante la ricerca.');
      setLoading(false);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setCluster(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    // Remove query param from URL cleanly
    if (window.location.search) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const refreshCluster = useCallback(async () => {
    if (!cluster) return;
    const refreshed = await weddingApi.getClusterByCode(cluster.invite_code);
    if (refreshed) setCluster(refreshed);
  }, [cluster]);

  return {
    cluster,
    loading,
    error,
    isAuthenticated: Boolean(cluster),
    loginWithCode,
    loginWithName,
    logout,
    refreshCluster,
  };
}
