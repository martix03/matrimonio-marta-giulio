import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Cluster, Guest, CarpoolingPost, PlacePOI, RegistryStage } from '../types';
import { mockClusters, mockCarpooling, mockPlaces, mockRegistryStages } from './mockData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured && supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const STORAGE_KEYS = {
  CLUSTERS: 'wedding_clusters_data',
  CARPOOLING: 'wedding_carpooling_data',
  BUS_RESERVED: 'wedding_bus_reserved_count',
};

// Initialize localStorage with mock data if not present
function getLocalClusters(): Cluster[] {
  const data = localStorage.getItem(STORAGE_KEYS.CLUSTERS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.CLUSTERS, JSON.stringify(mockClusters));
    return mockClusters;
  }
  try {
    return JSON.parse(data);
  } catch {
    return mockClusters;
  }
}

function saveLocalClusters(clusters: Cluster[]) {
  localStorage.setItem(STORAGE_KEYS.CLUSTERS, JSON.stringify(clusters));
}

function getLocalCarpooling(): CarpoolingPost[] {
  const data = localStorage.getItem(STORAGE_KEYS.CARPOOLING);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.CARPOOLING, JSON.stringify(mockCarpooling));
    return mockCarpooling;
  }
  try {
    return JSON.parse(data);
  } catch {
    return mockCarpooling;
  }
}

function saveLocalCarpooling(posts: CarpoolingPost[]) {
  localStorage.setItem(STORAGE_KEYS.CARPOOLING, JSON.stringify(posts));
}

// Data service methods
export const weddingApi = {
  async getClusterByCode(code: string): Promise<Cluster | null> {
    const cleanCode = code.trim().toUpperCase();

    if (isSupabaseConfigured && supabase) {
      const { data: cluster, error: clusterError } = await supabase
        .from('clusters')
        .select('*, guests(*)')
        .eq('invite_code', cleanCode)
        .single();

      if (clusterError || !cluster) return null;
      return cluster as Cluster;
    }

    // Local fallback
    const clusters = getLocalClusters();
    const found = clusters.find(c => c.invite_code.toUpperCase() === cleanCode);
    return found || null;
  },

  async searchClusterByName(firstName: string, lastName: string): Promise<Cluster | null> {
    const fn = firstName.trim().toLowerCase();
    const ln = lastName.trim().toLowerCase();

    if (isSupabaseConfigured && supabase) {
      const { data: guests } = await supabase
        .from('guests')
        .select('cluster_id')
        .ilike('first_name', `%${fn}%`)
        .ilike('last_name', `%${ln}%`)
        .limit(1);

      if (guests && guests.length > 0) {
        const { data: cluster } = await supabase
          .from('clusters')
          .select('*, guests(*)')
          .eq('id', guests[0].cluster_id)
          .single();
        return cluster as Cluster || null;
      }
      return null;
    }

    // Local fallback
    const clusters = getLocalClusters();
    for (const cluster of clusters) {
      const match = cluster.guests.some(
        g => g.first_name.toLowerCase().includes(fn) && g.last_name.toLowerCase().includes(ln)
      );
      if (match) return cluster;
    }
    return null;
  },

  async saveRsvp(clusterId: string, updatedGuests: Guest[]): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      for (const guest of updatedGuests) {
        const { error } = await supabase
          .from('guests')
          .update({
            is_attending: guest.is_attending,
            is_child: guest.is_child,
            dietary_tags: guest.dietary_tags,
            dietary_notes: guest.dietary_notes,
            song_request: guest.song_request,
            bus_seat_reserved: guest.bus_seat_reserved,
            updated_at: new Date().toISOString(),
          })
          .eq('id', guest.id);
        if (error) console.error('Error updating guest', error);
      }
      return true;
    }

    // Local fallback
    const clusters = getLocalClusters();
    const clusterIndex = clusters.findIndex(c => c.id === clusterId);
    if (clusterIndex !== -1) {
      clusters[clusterIndex].guests = updatedGuests;
      saveLocalClusters(clusters);
      return true;
    }
    return false;
  },

  async hasSentGiftMessage(senderName: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('gift_messages')
        .select('id')
        .eq('sender_name', senderName)
        .limit(1);
      if (data && data.length > 0) return true;
    }
    const localSent = localStorage.getItem(`gift_sent_${senderName}`);
    return localSent === 'true';
  },

  async saveGiftMessage(senderName: string, amountNote: string, wishes: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('gift_messages')
        .insert([{ sender_name: senderName, amount_note: amountNote, wishes: wishes }]);
      if (error) {
        console.error('Error saving gift message', error);
        return false;
      }
      localStorage.setItem(`gift_sent_${senderName}`, 'true');
      return true;
    }
    // Mock fallback: just simulate success
    console.log('Saved message locally:', { senderName, amountNote, wishes });
    localStorage.setItem(`gift_sent_${senderName}`, 'true');
    return true;
  },

  async getCarpooling(): Promise<CarpoolingPost[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('carpooling_posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data as CarpoolingPost[];
    }
    return getLocalCarpooling();
  },

  async addCarpooling(post: Omit<CarpoolingPost, 'id' | 'created_at'>): Promise<CarpoolingPost> {
    const newPost: CarpoolingPost = {
      ...post,
      id: 'cp-' + Date.now(),
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('carpooling_posts')
        .insert([newPost])
        .select()
        .single();
      if (!error && data) return data as CarpoolingPost;
    }

    const posts = getLocalCarpooling();
    const updated = [newPost, ...posts];
    saveLocalCarpooling(updated);
    return newPost;
  },

  async getBusSeatsInfo(): Promise<{ total: number; reserved: number }> {
    const total = 50;
    if (isSupabaseConfigured && supabase) {
      const { count } = await supabase
        .from('guests')
        .select('*', { count: 'exact', head: true })
        .eq('bus_seat_reserved', true)
        .eq('is_attending', true);
      return { total, reserved: count || 14 };
    }

    // Calculate from local clusters
    const clusters = getLocalClusters();
    let reserved = 0;
    clusters.forEach(c => {
      c.guests.forEach(g => {
        if (g.bus_seat_reserved && g.is_attending !== false) reserved++;
      });
    });
    return { total, reserved: Math.max(14, reserved) };
  },

  async getPlaces(): Promise<PlacePOI[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('places').select('*');
      if (error) console.error('Error fetching places', error);
      else if (data) return data as PlacePOI[];
    }
    return mockPlaces;
  },

  async getPlaceCategories(): Promise<any[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('place_categories').select('*').order('sort_order', { ascending: true });
      if (error) console.error('Error fetching categories', error);
      else if (data) return data;
    }
    return [];
  },

  getRegistryStages(): RegistryStage[] {
    return mockRegistryStages;
  }
};
