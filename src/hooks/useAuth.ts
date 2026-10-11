import { useState, useEffect, useCallback } from 'react';
import { Cluster } from '../types';
import { weddingApi } from '../services/supabase';

const AUTH_STORAGE_KEY_ID = 'wedding_saved_cluster_id';
const AUTH_STORAGE_KEY_CODE = 'wedding_saved_invite_code';

export function useAuth() {
  const [cluster, setCluster] = useState<Cluster | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const saveSession = (c: Cluster) => {
    localStorage.setItem(AUTH_STORAGE_KEY_ID, c.id);
    if (c.invite_code) {
      localStorage.setItem(AUTH_STORAGE_KEY_CODE, c.invite_code);
    }
  };

  const clearSession = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY_ID);
    localStorage.removeItem(AUTH_STORAGE_KEY_CODE);
  };

  // Initialize from URL query param (?code=...) or localStorage (ID or code)
  useEffect(() => {
    async function initAuth() {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams(window.location.search);
      const urlCode = params.get('code') || params.get('invito');

      if (urlCode) {
        try {
          const found = await weddingApi.getClusterByCode(urlCode);
          if (found) {
            setCluster(found);
            saveSession(found);
            setLoading(false);
            return;
          } else {
            setError('Invito non trovato. Prova ad accedere inserendo nome e cognome.');
          }
        } catch (err) {
          console.error(err);
        }
      }

      // Check saved cluster ID first (most stable & unique across DB)
      const savedId = localStorage.getItem(AUTH_STORAGE_KEY_ID);
      if (savedId) {
        try {
          const found = await weddingApi.getClusterById(savedId);
          if (found) {
            setCluster(found);
            saveSession(found);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.error('Error fetching cluster by ID:', err);
        }
      }

      // Fallback check saved invite code
      const savedCode = localStorage.getItem(AUTH_STORAGE_KEY_CODE);
      if (savedCode) {
        try {
          const found = await weddingApi.getClusterByCode(savedCode);
          if (found) {
            setCluster(found);
            saveSession(found);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.error('Error fetching cluster by code:', err);
        }
      }

      // If we had stored items but none worked, clean them
      if (savedId || savedCode) {
        clearSession();
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
        saveSession(found);
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
        saveSession(found);
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
    clearSession();
    // Remove query param from URL cleanly
    if (window.location.search) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const refreshCluster = useCallback(async () => {
    if (!cluster) return;
    const refreshed = await weddingApi.getClusterById(cluster.id);
    if (refreshed) {
      setCluster(refreshed);
      saveSession(refreshed);
    }
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
