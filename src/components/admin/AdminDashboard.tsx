import React, { useState, useEffect } from 'react';
import { Users, Gift, MapPin, Search, Music, AlertTriangle, LogOut, CheckCircle2, XCircle, Clock, Edit2, Check, X, Trash2, MessageCircle, HelpCircle, UserPlus, Copy, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { weddingApi } from '../../services/supabase';
import { Cluster } from '../../types';

interface AdminDashboardProps {
  cluster: Cluster;
  onLogout: () => void;
}

import { AdminSettings } from './AdminSettings';
import { Settings } from 'lucide-react';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'guests' | 'gifts' | 'add' | 'places' | 'settings' | 'faq'>('guests');
  const [guests, setGuests] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '', category: 'info', sort_order: 10 });
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [editFaqData, setEditFaqData] = useState<any>({});
  const [gifts, setGifts] = useState<any[]>([]);
  const [places, setPlaces] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [foodCategories, setFoodCategories] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortField, setSortField] = useState<'first_name' | 'last_name' | 'family_name' | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [placeSearchQuery, setPlaceSearchQuery] = useState('');
  const [placeCategoryFilter, setPlaceCategoryFilter] = useState<string>('all');

  const [showAddGuestModal, setShowAddGuestModal] = useState(false);
  const [singleGuestData, setSingleGuestData] = useState<{
    firstName: string;
    lastName: string;
    gender: 'M' | 'F';
    isChild: boolean;
    clusterMode: 'existing' | 'new';
    clusterId: string;
    newFamilyName: string;
  }>({
    firstName: '',
    lastName: '',
    gender: 'M',
    isChild: false,
    clusterMode: 'existing',
    clusterId: '',
    newFamilyName: '',
  });

  const [newFamilyName, setNewFamilyName] = useState('');
  const [newGuests, setNewGuests] = useState<{ firstName: string, lastName: string, gender: 'M' | 'F', isChild: boolean }[]>([{ firstName: '', lastName: '', gender: 'M', isChild: false }]);

  const [editingGuestId, setEditingGuestId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});

  const startEditing = (guest: any) => {
    setEditingGuestId(guest.id);
    setEditData({
      first_name: guest.first_name,
      last_name: guest.last_name,
      gender: guest.gender || 'M',
      is_child: Boolean(guest.is_child),
      cluster_id: guest.cluster_id,
      is_attending: guest.is_attending,
      dietary_notes: guest.dietary_notes || '',
      song_request: guest.song_request || ''
    });
  };

  const handleSaveEdit = async () => {
    if (!editingGuestId) return;
    const success = await weddingApi.updateGuest(editingGuestId, editData);
    if (success) {
      setEditingGuestId(null);
      fetchData();
    } else {
      alert('Errore durante l\'aggiornamento');
    }
  };

  const [editingPlaceId, setEditingPlaceId] = useState<string | null>(null);
  const [editPlaceData, setEditPlaceData] = useState<any>({});

  const startEditingPlace = (place: any) => {
    setEditingPlaceId(place.id);
    setEditPlaceData({
      name: place.name,
      category: place.category,
      food_type: place.food_type || '',
      address: place.address,
      latitude: place.latitude || '',
      longitude: place.longitude || '',
      is_primary: place.is_primary
    });
  };

  const handleSavePlaceEdit = async () => {
    if (!editingPlaceId) return;
    const dataToSave = {
      ...editPlaceData,
      latitude: parseFloat(editPlaceData.latitude),
      longitude: parseFloat(editPlaceData.longitude),
      food_type: editPlaceData.category === 'food' ? editPlaceData.food_type : null,
    };
    if (isNaN(dataToSave.latitude) || isNaN(dataToSave.longitude)) {
      return alert('Coordinate non valide');
    }

    const success = await weddingApi.updatePlace(editingPlaceId, dataToSave);
    if (success) {
      setEditingPlaceId(null);
      fetchData();
    } else {
      alert('Errore durante l\'aggiornamento');
    }
  };

  const handleDeleteGuest = async (id: string) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo ospite?')) return;
    const success = await weddingApi.deleteGuest(id);
    if (success) fetchData();
    else alert('Errore durante l\'eliminazione');
  };

  const handleDeletePlace = async (id: string) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo luogo?')) return;
    const success = await weddingApi.deletePlace(id);
    if (success) fetchData();
    else alert('Errore durante l\'eliminazione');
  };

  const [newPlace, setNewPlace] = useState({
    name: '',
    category: 'hotel',
    food_type: '',
    latitude: '',
    longitude: '',
    address: '',
    phone: '',
    website_url: '',
    sposi_note: '',
    is_primary: false,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [g, gi, c, fc, p] = await Promise.all([
      weddingApi.getAllGuestsAdmin(),
      weddingApi.getAllGiftMessages(),
      weddingApi.getPlaceCategories(),
      weddingApi.getFoodCategories(),
      weddingApi.getPlaces(),
    ]);
    setGuests(g);
    setGifts(gi);
    setCategories(c);
    setFoodCategories(fc);
    setPlaces(p);
    weddingApi.getFaqs().then(setFaqs);
  };

  const handleAddGuestRow = () => {
    setNewGuests([...newGuests, { firstName: '', lastName: '', gender: 'M', isChild: false }]);
  };

  const handleSaveGuests = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFamilyName) return alert('Inserisci il nome della famiglia');
    const validGuests = newGuests.filter(g => g.firstName && g.lastName);
    if (validGuests.length === 0) return alert('Inserisci almeno un ospite valido');

    const success = await weddingApi.createClusterAndGuests(newFamilyName, validGuests);
    if (success) {
      alert('Famiglia e ospiti aggiunti con successo!');
      setNewFamilyName('');
      setNewGuests([{ firstName: '', lastName: '', gender: 'M', isChild: false }]);
      fetchData();
      setActiveTab('guests');
    } else {
      alert('Errore durante il salvataggio');
    }
  };

  const existingClusters = Array.from(
    new Map(
      guests
        .filter(g => g?.cluster_id && (g.clusters?.family_name || (Array.isArray(g.clusters) && g.clusters[0]?.family_name)))
        .map(g => {
          const familyName = g.clusters?.family_name || (Array.isArray(g.clusters) && g.clusters[0]?.family_name) || 'Gruppo';
          const inviteCode = g.clusters?.invite_code || (Array.isArray(g.clusters) && g.clusters[0]?.invite_code) || '';
          return [g.cluster_id, { id: g.cluster_id, name: familyName as string, inviteCode: inviteCode as string }];
        })
    ).values()
  ).sort((a, b) => (a.name || '').localeCompare(b.name || ''));

  // Gestione Modifica Nome Famiglia
  const [editingCluster, setEditingCluster] = useState<{ id: string; name: string } | null>(null);
  const [editingClusterNewName, setEditingClusterNewName] = useState('');
  const [isSavingCluster, setIsSavingCluster] = useState(false);
  const [showFamiliesModal, setShowFamiliesModal] = useState(false);
  const [familySearchQuery, setFamilySearchQuery] = useState('');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const handleOpenEditFamily = (clusterId: string, currentName: string) => {
    setEditingCluster({ id: clusterId, name: currentName });
    setEditingClusterNewName(currentName);
  };

  const handleSaveFamilyName = async () => {
    if (!editingCluster || !editingClusterNewName.trim()) return;
    setIsSavingCluster(true);
    const success = await weddingApi.updateCluster(editingCluster.id, editingClusterNewName.trim());
    setIsSavingCluster(false);
    if (success) {
      setEditingCluster(null);
      fetchData();
    } else {
      alert('Errore durante il salvataggio del nome della famiglia');
    }
  };

  const handleCopyInviteCode = (clusterId: string, code: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCodeId(clusterId);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const clustersWithMembers = existingClusters.map(c => {
    const members = guests.filter(g => g.cluster_id === c.id);
    return {
      ...c,
      members,
      count: members.length,
    };
  });

  const filteredClustersWithMembers = clustersWithMembers.filter(c => {
    const q = familySearchQuery.toLowerCase();
    const nameMatch = c.name.toLowerCase().includes(q);
    const codeMatch = c.inviteCode.toLowerCase().includes(q);
    const memberMatch = c.members.some(m => `${m.first_name || ''} ${m.last_name || ''}`.toLowerCase().includes(q));
    return nameMatch || codeMatch || memberMatch;
  });

  const handleSaveSingleGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleGuestData.firstName.trim() || !singleGuestData.lastName.trim()) {
      return alert('Inserisci nome e cognome');
    }
    if (singleGuestData.clusterMode === 'new' && !singleGuestData.newFamilyName.trim()) {
      return alert('Inserisci il nome della nuova famiglia o gruppo');
    }
    if (singleGuestData.clusterMode === 'existing' && !singleGuestData.clusterId) {
      return alert('Seleziona una famiglia esistente');
    }

    const success = await weddingApi.addSingleGuest({
      firstName: singleGuestData.firstName.trim(),
      lastName: singleGuestData.lastName.trim(),
      gender: singleGuestData.gender,
      isChild: singleGuestData.isChild,
      clusterId: singleGuestData.clusterMode === 'existing' ? singleGuestData.clusterId : undefined,
      newFamilyName: singleGuestData.clusterMode === 'new' ? singleGuestData.newFamilyName.trim() : undefined,
    });

    if (success) {
      alert('Ospite aggiunto con successo!');
      setShowAddGuestModal(false);
      setSingleGuestData({
        firstName: '',
        lastName: '',
        gender: 'M',
        isChild: false,
        clusterMode: existingClusters.length > 0 ? 'existing' : 'new',
        clusterId: existingClusters[0]?.id || '',
        newFamilyName: '',
      });
      fetchData();
    } else {
      alert('Errore durante l\'aggiunta dell\'ospite');
    }
  };


  const handleAddFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await weddingApi.createFaq(newFaq);
    if (success) {
      setNewFaq({ question: '', answer: '', category: 'info', sort_order: 10 });
      weddingApi.getFaqs().then(setFaqs);
      alert('FAQ aggiunta!');
    }
  };


  const handleUpdateFaq = async (id: string) => {
    const success = await weddingApi.updateFaq(id, {
      question: editFaqData.question,
      answer: editFaqData.answer,
      category: editFaqData.category
    });
    if (success) {
      setEditingFaqId(null);
      weddingApi.getFaqs().then(setFaqs);
    } else {
      alert('Errore durante il salvataggio.');
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!window.confirm('Eliminare questa FAQ?')) return;
    const success = await weddingApi.deleteFaq(id);
    if (success) weddingApi.getFaqs().then(setFaqs);
  };

  const handleSavePlace = async (e: React.FormEvent) => {
    e.preventDefault();
    const placeData = {
      ...newPlace,
      latitude: parseFloat(newPlace.latitude),
      longitude: parseFloat(newPlace.longitude),
      food_type: newPlace.category === 'food' ? newPlace.food_type : null,
    };

    if (isNaN(placeData.latitude) || isNaN(placeData.longitude)) {
      return alert('Coordinate non valide');
    }

    const success = await weddingApi.createPlace(placeData);
    if (success) {
      alert('Luogo aggiunto con successo!');
      setNewPlace({
        name: '', category: 'hotel', food_type: '', latitude: '', longitude: '',
        address: '', phone: '', website_url: '', sposi_note: '', is_primary: false
      });
      fetchData();
    } else {
      alert('Errore durante il salvataggio');
    }
  };

  const totalGuests = guests.length;
  const totalAdults = guests.filter(g => !g.is_child).length;
  const totalChildren = guests.filter(g => Boolean(g.is_child)).length;

  const confirmed = guests.filter(g => g.is_attending === true);
  const confirmedAdults = confirmed.filter(g => !g.is_child).length;
  const confirmedChildren = confirmed.filter(g => Boolean(g.is_child)).length;

  const declined = guests.filter(g => g.is_attending === false);
  const declinedAdults = declined.filter(g => !g.is_child).length;
  const declinedChildren = declined.filter(g => Boolean(g.is_child)).length;

  const pending = guests.filter(g => g.is_attending === null);
  const pendingAdults = pending.filter(g => !g.is_child).length;
  const pendingChildren = pending.filter(g => Boolean(g.is_child)).length;

  const filteredGuests = guests.filter(g => {
    const s = searchQuery.toLowerCase();
    const fullName = `${g?.first_name || ''} ${g?.last_name || ''}`.toLowerCase();
    const familyName = (g?.clusters?.family_name || (Array.isArray(g?.clusters) && g.clusters[0]?.family_name) || '').toLowerCase();
    const nameMatch = fullName.includes(s);
    const familyMatch = familyName.includes(s);
    if (!nameMatch && !familyMatch) return false;

    if (filterStatus === 'confirmed' && g.is_attending !== true) return false;
    if (filterStatus === 'declined' && g.is_attending !== false) return false;
    if (filterStatus === 'pending' && g.is_attending !== null) return false;
    if (filterStatus === 'adults' && g.is_child) return false;
    if (filterStatus === 'children' && !g.is_child) return false;

    return true;
  });

  const handleSort = (field: 'first_name' | 'last_name' | 'family_name') => {
    if (sortField === field) {
      if (sortOrder === 'asc') {
        setSortOrder('desc');
      } else {
        setSortField(null);
        setSortOrder('asc');
      }
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedGuests = [...filteredGuests].sort((a, b) => {
    if (!sortField) return 0;

    let valA = '';
    let valB = '';

    if (sortField === 'first_name') {
      valA = (a.first_name || '').toLowerCase();
      valB = (b.first_name || '').toLowerCase();
    } else if (sortField === 'last_name') {
      valA = (a.last_name || '').toLowerCase();
      valB = (b.last_name || '').toLowerCase();
    } else if (sortField === 'family_name') {
      valA = ((a.clusters?.family_name || (Array.isArray(a.clusters) && a.clusters[0]?.family_name)) || '').toLowerCase();
      valB = ((b.clusters?.family_name || (Array.isArray(b.clusters) && b.clusters[0]?.family_name)) || '').toLowerCase();
    }

    const cmp = valA.localeCompare(valB, 'it', { sensitivity: 'base' });
    return sortOrder === 'asc' ? cmp : -cmp;
  });

  const filteredPlaces = places.filter(p => {
    const s = placeSearchQuery.toLowerCase();
    const nameMatch = (p?.name || '').toLowerCase().includes(s);
    const addressMatch = (p?.address || '').toLowerCase().includes(s);
    if (!nameMatch && !addressMatch) return false;

    if (placeCategoryFilter !== 'all' && p.category !== placeCategoryFilter) return false;

    return true;
  });

  const downloadCSV = (filename: string, rows: string[][]) => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadIntolerances = () => {
    const rows = [["Nome", "Cognome", "Famiglia", "Intolleranze/Note Alimentari"]];
    guests.filter(g => g.dietary_notes).forEach(g => {
      rows.push([g.first_name, g.last_name, g.clusters?.family_name || '', `"${g.dietary_notes.replace(/"/g, '""')}"`]);
    });
    downloadCSV("intolleranze.csv", rows);
  };

  const handleDownloadSongs = () => {
    const rows = [["Nome", "Cognome", "Famiglia", "Canzone Richiesta"]];
    guests.filter(g => g.song_request).forEach(g => {
      rows.push([g.first_name, g.last_name, g.clusters?.family_name || '', `"${g.song_request.replace(/"/g, '""')}"`]);
    });
    downloadCSV("canzoni.csv", rows);
  };

  return (
    <div className="min-h-screen bg-cream text-burgundy font-sans">
      <nav className="bg-paper border-b border-blush/20 py-4 px-6 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <h1 className="text-2xl font-bold">Portale Admin Matrimonio</h1>
        <button onClick={onLogout} className="flex items-center gap-2 text-sm font-semibold opacity-80 hover:opacity-100 transition-opacity">
          <LogOut className="w-4 h-4" /> Esci
        </button>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-wrap gap-4 mb-8">
          <button onClick={() => setActiveTab('guests')} className={`px-4 py-2 rounded-2xl text-sm font-semibold transition-all ${activeTab === 'guests' ? 'bg-burgundy text-paper' : 'bg-paper text-burgundy border border-blush/40 hover:border-burgundy'}`}>
            <Users className="w-4 h-4 inline-block mr-2" /> Ospiti & Metriche
          </button>
          <button onClick={() => setActiveTab('places')} className={`px-4 py-2 rounded-2xl text-sm font-semibold transition-all ${activeTab === 'places' ? 'bg-burgundy text-paper' : 'bg-paper text-burgundy border border-blush/40 hover:border-burgundy'}`}>
            <MapPin className="w-4 h-4 inline-block mr-2" /> Luoghi Mappa
          </button>
          <button onClick={() => setActiveTab('gifts')} className={`px-4 py-2 rounded-2xl text-sm font-semibold transition-all ${activeTab === 'gifts' ? 'bg-burgundy text-paper' : 'bg-paper text-burgundy border border-blush/40 hover:border-burgundy'}`}>
            <Gift className="w-4 h-4 inline-block mr-2" /> Messaggi Regali
          </button>
          <button onClick={() => setActiveTab('add')} className={`px-4 py-2 rounded-2xl text-sm font-semibold transition-all ${activeTab === 'add' ? 'bg-burgundy text-paper' : 'bg-paper text-burgundy border border-blush/40 hover:border-burgundy'}`}>
            + Aggiungi Dati
          </button>
          <button onClick={() => setActiveTab('faq')} className={`px-4 py-2 rounded-2xl text-sm font-semibold transition-all ${activeTab === 'faq' ? 'bg-burgundy text-paper' : 'bg-paper text-burgundy border border-blush/40 hover:border-burgundy'}`}>
            <HelpCircle className="w-4 h-4 inline-block mr-2" /> FAQ
          </button>
          <button onClick={() => setActiveTab('settings')} className={`px-4 py-2 rounded-2xl text-sm font-semibold transition-all ${activeTab === 'settings' ? 'bg-burgundy text-paper' : 'bg-paper text-burgundy border border-blush/40 hover:border-burgundy'}`}>
            <Settings className="w-4 h-4 inline-block mr-2" /> Impostazioni
          </button>
        </div>

        {activeTab === 'settings' && <AdminSettings />}

        {activeTab === 'faq' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-3xl font-semibold">Gestione FAQ</h2>
              <button onClick={() => setActiveTab('add')} className="px-4 py-2 body uppercase tracking-widest font-semibold bg-cream text-burgundy hover:bg-blush-soft border border-blush/30 rounded-2xl transition-colors">
                + Aggiungi FAQ
              </button>
            </div>
            <div className="space-y-3">
              {faqs.map(faq => (
                <div key={faq.id} className="flex justify-between items-center p-4 bg-paper border border-blush/20 rounded-xl hover:bg-cream/20 shadow-sm">
                  {editingFaqId === faq.id ? (
                    <div className="flex-1 space-y-3 mr-4">
                      <input type="text" value={editFaqData.question} onChange={e => setEditFaqData({ ...editFaqData, question: e.target.value })} className="w-full px-3 py-1.5 rounded-lg border border-blush/40 text-sm bg-cream/30 focus:outline-none focus:border-burgundy" placeholder="Domanda" />
                      <textarea value={editFaqData.answer} onChange={e => setEditFaqData({ ...editFaqData, answer: e.target.value })} className="w-full px-3 py-1.5 rounded-lg border border-blush/40 text-sm bg-cream/30 focus:outline-none focus:border-burgundy resize-y" rows={2} placeholder="Risposta" />
                      <select value={editFaqData.category} onChange={e => setEditFaqData({ ...editFaqData, category: e.target.value })} className="w-full px-3 py-1.5 rounded-lg border border-blush/40 text-sm bg-cream/30 focus:outline-none focus:border-burgundy">
                        <option value="info">Info Utili</option>
                        <option value="locations">Location</option>
                        <option value="gifts">Regali</option>
                      </select>
                      <div className="flex gap-2">
                        <button onClick={() => handleUpdateFaq(faq.id)} className="px-4 py-1.5 bg-burgundy text-paper body rounded-lg font-semibold hover:bg-burgundy-light transition-colors">Salva</button>
                        <button onClick={() => setEditingFaqId(null)} className="px-4 py-1.5 bg-cream text-burgundy body rounded-lg border border-blush/40 hover:border-burgundy transition-colors">Annulla</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 mr-4">
                        <p className="font-semibold text-burgundy text-sm">{faq.question}</p>
                        <p className="body text-burgundy/70 mt-1 whitespace-pre-wrap">{faq.answer}</p>
                        <span className="inline-block mt-2 text-[10px] uppercase font-bold tracking-widest text-blush bg-blush-soft px-2 py-0.5 rounded-full">{faq.category}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => { setEditingFaqId(faq.id); setEditFaqData({ ...faq }); }} className="p-2 text-burgundy/60 hover:text-burgundy hover:bg-cream rounded-full transition-all">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteFaq(faq.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-full transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
              {faqs.length === 0 && <p className="text-center text-sm opacity-60 py-8">Nessuna FAQ presente.</p>}
            </div>
          </div>
        )}


        {activeTab === 'guests' && (
          <div className="space-y-8 animate-fade-in">
            {/* Schede di Riepilogo Principali */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Totale Ospiti */}
              <div className="bg-paper p-5 sm:p-6 rounded-3xl border border-blush/30 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blush-soft flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6 text-burgundy" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-burgundy">{totalGuests}</div>
                  <div className="body uppercase tracking-wider font-semibold opacity-70 text-xs">Totale Ospiti</div>
                  <div className="text-xs text-burgundy/70 mt-1 font-medium">{totalAdults} adulti • {totalChildren} bambini</div>
                </div>
              </div>

              {/* Confermati */}
              <div className="bg-paper p-5 sm:p-6 rounded-3xl border border-blush/30 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <Check className="w-6 h-6 text-emerald-700" strokeWidth={2.5} />
                </div>
                <div>
                  <div className="text-3xl font-bold text-emerald-700">{confirmed.length}</div>
                  <div className="body uppercase tracking-wider font-semibold opacity-70 text-xs text-emerald-800">Confermati</div>
                  <div className="text-xs text-emerald-700/80 mt-1 font-medium">{confirmedAdults} adulti • {confirmedChildren} bambini</div>
                </div>
              </div>

              {/* In Attesa */}
              <div className="bg-paper p-5 sm:p-6 rounded-3xl border border-blush/30 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-amber-700">{pending.length}</div>
                  <div className="body uppercase tracking-wider font-semibold opacity-70 text-xs text-amber-800">In Attesa</div>
                  <div className="text-xs text-amber-700/80 mt-1 font-medium">{pendingAdults} adulti • {pendingChildren} bambini</div>
                </div>
              </div>

              {/* Declinati */}
              <div className="bg-paper p-5 sm:p-6 rounded-3xl border border-blush/30 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                  <XCircle className="w-6 h-6 text-rose-600" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-rose-700">{declined.length}</div>
                  <div className="body uppercase tracking-wider font-semibold opacity-70 text-xs text-rose-800">Declinati</div>
                  <div className="text-xs text-rose-700/80 mt-1 font-medium">{declinedAdults} adulti • {declinedChildren} bambini</div>
                </div>
              </div>
            </div>

            {/* Scheda Dedicata Conteggio Adulti e Bambini */}
            <div className="bg-paper p-6 rounded-3xl border border-blush/30 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blush/20 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blush-soft flex items-center justify-center text-burgundy shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-burgundy">Conteggio Adulti e Bambini</h3>
                    <p className="text-xs text-burgundy/60">Dettaglio presenze suddiviso tra adulti e bambini</p>
                  </div>
                </div>
              </div>

              {/* Tabella Riassuntiva Compatta */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-cream/40 uppercase tracking-wider text-burgundy/60 border-y border-blush/20">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold">Categoria</th>
                      <th className="py-2.5 px-3 font-semibold text-center">Totale</th>
                      <th className="py-2.5 px-3 font-semibold text-center text-emerald-700">Confermati</th>
                      <th className="py-2.5 px-3 font-semibold text-center text-amber-700">In Attesa</th>
                      <th className="py-2.5 px-3 font-semibold text-center text-rose-700">Declinati</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blush/10 font-medium">
                    <tr className="hover:bg-cream/20">
                      <td className="py-2.5 px-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-burgundy"></span>
                        Adulti
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-burgundy">{totalAdults}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-emerald-700">{confirmedAdults}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-amber-700">{pendingAdults}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-rose-700">{declinedAdults}</td>
                    </tr>
                    <tr className="hover:bg-cream/20">
                      <td className="py-2.5 px-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                        Bambini
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-burgundy">{totalChildren}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-emerald-700">{confirmedChildren}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-amber-700">{pendingChildren}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-rose-700">{declinedChildren}</td>
                    </tr>
                    <tr className="bg-cream/40 font-bold border-t border-blush/30">
                      <td className="py-2.5 px-3 text-burgundy">Totale Complessivo</td>
                      <td className="py-2.5 px-3 text-center text-burgundy">{totalGuests}</td>
                      <td className="py-2.5 px-3 text-center text-emerald-700">{confirmed.length}</td>
                      <td className="py-2.5 px-3 text-center text-amber-700">{pending.length}</td>
                      <td className="py-2.5 px-3 text-center text-rose-700">{declined.length}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setShowFamiliesModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-cream text-burgundy body font-semibold border border-blush/40 hover:border-burgundy hover:bg-blush-soft transition-colors shadow-sm"
                >
                  <Users className="w-4 h-4" /> Gestione Famiglie ({existingClusters.length})
                </button>
                <button onClick={handleDownloadIntolerances} className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-rose-50 text-rose-700 body font-semibold border border-rose-200 hover:bg-rose-100 transition-colors">
                  <AlertTriangle className="w-4 h-4" /> Scarica CSV Intolleranze
                </button>
                <button onClick={handleDownloadSongs} className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-50 text-blue-700 body font-semibold border border-blue-200 hover:bg-blue-100 transition-colors">
                  <Music className="w-4 h-4" /> Scarica CSV Canzoni
                </button>
              </div>
              <button
                onClick={() => {
                  setSingleGuestData(prev => ({
                    ...prev,
                    clusterMode: existingClusters.length > 0 ? 'existing' : 'new',
                    clusterId: existingClusters[0]?.id || '',
                  }));
                  setShowAddGuestModal(true);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-burgundy hover:bg-burgundy-light text-paper body font-semibold tracking-wider uppercase shadow-sm transition-all"
              >
                <UserPlus className="w-4 h-4" /> Aggiungi Ospite
              </button>
            </div>

            <div className="bg-paper rounded-3xl border border-blush/30 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-blush/20 bg-cream/50 flex flex-col lg:flex-row items-center justify-between gap-4">
                <h3 className="text-xl font-semibold shrink-0">Lista Ospiti</h3>
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
                    <input type="text" placeholder="Cerca per nome o famiglia..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-9 pr-3 py-2 rounded-full body border border-blush/40 bg-paper focus:outline-none focus:border-burgundy transition-colors" />
                  </div>
                  <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 rounded-full body border border-blush/40 bg-paper focus:outline-none focus:border-burgundy transition-colors appearance-none">
                    <option value="all">Tutti gli Stati</option>
                    <option value="confirmed">Confermati</option>
                    <option value="pending">In Attesa</option>
                    <option value="declined">Declinati</option>
                    <option value="adults">Solo Adulti</option>
                    <option value="children">Solo Bambini</option>
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-cream/50 body uppercase tracking-wider opacity-70">
                    <tr>
                      <th className="p-4 font-semibold">
                        <button
                          type="button"
                          onClick={() => handleSort('first_name')}
                          className="flex items-center gap-1.5 hover:text-burgundy transition-colors uppercase tracking-wider font-semibold group cursor-pointer"
                        >
                          <span>Nome</span>
                          {sortField === 'first_name' ? (
                            sortOrder === 'asc' ? (
                              <ArrowUp className="w-3.5 h-3.5 text-burgundy" />
                            ) : (
                              <ArrowDown className="w-3.5 h-3.5 text-burgundy" />
                            )
                          ) : (
                            <ArrowUpDown className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100" />
                          )}
                        </button>
                      </th>
                      <th className="p-4 font-semibold">
                        <button
                          type="button"
                          onClick={() => handleSort('last_name')}
                          className="flex items-center gap-1.5 hover:text-burgundy transition-colors uppercase tracking-wider font-semibold group cursor-pointer"
                        >
                          <span>Cognome</span>
                          {sortField === 'last_name' ? (
                            sortOrder === 'asc' ? (
                              <ArrowUp className="w-3.5 h-3.5 text-burgundy" />
                            ) : (
                              <ArrowDown className="w-3.5 h-3.5 text-burgundy" />
                            )
                          ) : (
                            <ArrowUpDown className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100" />
                          )}
                        </button>
                      </th>
                      <th className="p-4 font-semibold text-center">Sesso</th>
                      <th className="p-4 font-semibold text-center">Tipo</th>
                      <th className="p-4 font-semibold">
                        <button
                          type="button"
                          onClick={() => handleSort('family_name')}
                          className="flex items-center gap-1.5 hover:text-burgundy transition-colors uppercase tracking-wider font-semibold group cursor-pointer"
                        >
                          <span>Famiglia</span>
                          {sortField === 'family_name' ? (
                            sortOrder === 'asc' ? (
                              <ArrowUp className="w-3.5 h-3.5 text-burgundy" />
                            ) : (
                              <ArrowDown className="w-3.5 h-3.5 text-burgundy" />
                            )
                          ) : (
                            <ArrowUpDown className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100" />
                          )}
                        </button>
                      </th>
                      <th className="p-4 font-semibold text-center">Stato</th>
                      <th className="p-4 font-semibold">Intolleranze</th>
                      <th className="p-4 font-semibold">Canzoni</th>
                      <th className="p-4 font-semibold text-center">Azioni</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blush/20">
                    {sortedGuests.map(g => (
                      <tr key={g.id} className="hover:bg-cream/30 transition-colors">
                        {editingGuestId === g.id ? (
                          <>
                            <td className="p-2">
                              <input type="text" value={editData.first_name} onChange={e => setEditData({ ...editData, first_name: e.target.value })} className="w-full px-2 py-1 rounded body border border-blush/40 bg-white" />
                            </td>
                            <td className="p-2">
                              <input type="text" value={editData.last_name} onChange={e => setEditData({ ...editData, last_name: e.target.value })} className="w-full px-2 py-1 rounded body border border-blush/40 bg-white" />
                            </td>
                            <td className="p-2 text-center">
                              <select value={editData.gender || 'M'} onChange={e => setEditData({ ...editData, gender: e.target.value as 'M' | 'F' })} className="px-2 py-1 rounded body border border-blush/40 bg-white">
                                <option value="M">M</option>
                                <option value="F">F</option>
                              </select>
                            </td>
                            <td className="p-2 text-center">
                              <select value={editData.is_child ? 'child' : 'adult'} onChange={e => setEditData({ ...editData, is_child: e.target.value === 'child' })} className="px-2 py-1 rounded body border border-blush/40 bg-white">
                                <option value="adult">Adulto</option>
                                <option value="child">Bambino</option>
                              </select>
                            </td>
                            <td className="p-2">
                              <div className="flex items-center gap-1">
                                <select
                                  value={editData.cluster_id || g.cluster_id}
                                  onChange={e => setEditData({ ...editData, cluster_id: e.target.value })}
                                  className="px-2 py-1 rounded body border border-blush/40 bg-white text-xs max-w-[130px]"
                                >
                                  {existingClusters.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                  ))}
                                </select>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const targetClusterId = editData.cluster_id || g.cluster_id;
                                    const currentName = existingClusters.find(c => c.id === targetClusterId)?.name || (g.clusters?.family_name || (Array.isArray(g.clusters) && g.clusters[0]?.family_name)) || '';
                                    handleOpenEditFamily(targetClusterId, currentName);
                                  }}
                                  title="Rinomina questa famiglia"
                                  className="p-1 text-burgundy hover:bg-blush-soft rounded transition-colors shrink-0"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                            <td className="p-2">
                              <select value={editData.is_attending === null ? 'null' : editData.is_attending.toString()} onChange={e => setEditData({ ...editData, is_attending: e.target.value === 'null' ? null : e.target.value === 'true' })} className="w-full px-2 py-1 rounded body border border-blush/40 bg-white">
                                <option value="null">In Attesa</option>
                                <option value="true">Confermato</option>
                                <option value="false">Declinato</option>
                              </select>
                            </td>
                            <td className="p-2">
                              <input type="text" value={editData.dietary_notes} onChange={e => setEditData({ ...editData, dietary_notes: e.target.value })} className="w-full px-2 py-1 rounded body border border-blush/40 bg-white" placeholder="Nessuna" />
                            </td>
                            <td className="p-2">
                              <input type="text" value={editData.song_request} onChange={e => setEditData({ ...editData, song_request: e.target.value })} className="w-full px-2 py-1 rounded body border border-blush/40 bg-white" placeholder="Nessuna" />
                            </td>
                            <td className="p-2 text-center">
                              <button onClick={handleSaveEdit} className="p-1.5 text-burgundy hover:bg-blush-soft rounded-full transition-colors mx-1">
                                <Check className="w-4 h-4" />
                              </button>
                              <button onClick={() => setEditingGuestId(null)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-full transition-colors mx-1">
                                <X className="w-4 h-4" />
                              </button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="p-4 font-medium">{g.first_name}</td>
                            <td className="p-4 font-medium">{g.last_name}</td>
                            <td className="p-4 text-center">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${g.gender === 'F' ? 'bg-pink-50 text-pink-700 border-pink-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                                }`}>
                                {g.gender === 'F' ? 'Femmina (F)' : 'Maschio (M)'}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${g.is_child ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-gray-100 text-gray-700 border-gray-200'
                                }`}>
                                {g.is_child ? 'Bambino' : 'Adulto'}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-1.5 group">
                                <span className="opacity-80 font-medium">
                                  {g.clusters?.family_name || (Array.isArray(g.clusters) && g.clusters[0]?.family_name) || 'Senza Famiglia'}
                                </span>
                                {g.cluster_id && (
                                  <button
                                    onClick={() => handleOpenEditFamily(
                                      g.cluster_id,
                                      g.clusters?.family_name || (Array.isArray(g.clusters) && g.clusters[0]?.family_name) || ''
                                    )}
                                    title="Modifica nome famiglia"
                                    className="opacity-0 group-hover:opacity-100 p-1 text-burgundy/60 hover:text-burgundy hover:bg-cream rounded transition-all"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              {g.is_attending === true && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-widest border border-emerald-200">Confermato</span>}
                              {g.is_attending === false && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 uppercase tracking-widest">Declinato</span>}
                              {g.is_attending === null && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 uppercase tracking-widest">In Attesa</span>}
                            </td>
                            <td className="p-4">
                              {g.dietary_notes && (
                                <div className="flex items-center gap-1.5 body text-rose-600 bg-rose-50 px-2 py-1 rounded-md border border-rose-100 inline-flex">
                                  <AlertTriangle className="w-3.5 h-3.5" />
                                  <span className="truncate max-w-[150px]" title={g.dietary_notes}>{g.dietary_notes}</span>
                                </div>
                              )}
                            </td>
                            <td className="p-4">
                              {g.song_request && (
                                <div className="flex items-center gap-1.5 body text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100 inline-flex">
                                  <Music className="w-3.5 h-3.5" />
                                  <span className="truncate max-w-[150px]" title={g.song_request}>{g.song_request}</span>
                                </div>
                              )}
                            </td>
                            <td className="p-4 text-center whitespace-nowrap">
                              <button onClick={() => startEditing(g)} className="p-1.5 text-burgundy opacity-60 hover:opacity-100 hover:bg-cream rounded-full transition-all mx-0.5">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDeleteGuest(g.id)} className="p-1.5 text-rose-600 opacity-60 hover:opacity-100 hover:bg-rose-50 rounded-full transition-all mx-0.5">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                    {sortedGuests.length === 0 && (
                      <tr>
                        <td colSpan={9} className="p-8 text-center opacity-60">Nessun ospite trovato.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Aggiungi Ospite */}
            {showAddGuestModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                <div className="bg-paper w-full max-w-lg rounded-3xl border border-blush/40 shadow-2xl p-6 sm:p-8 space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-blush/20">
                    <h3 className="text-2xl font-semibold text-burgundy flex items-center gap-2">
                      <UserPlus className="w-5 h-5 text-blush" /> Aggiungi Nuovo Ospite
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowAddGuestModal(false)}
                      className="p-1 rounded-full text-burgundy/60 hover:text-burgundy hover:bg-cream transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveSingleGuest} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block body font-semibold uppercase tracking-wider opacity-70 mb-1">Nome</label>
                        <input
                          type="text"
                          required
                          placeholder="es. Mario"
                          value={singleGuestData.firstName}
                          onChange={e => setSingleGuestData({ ...singleGuestData, firstName: e.target.value })}
                          className="w-full px-4 py-2 rounded-xl border border-blush/40 bg-cream/30 focus:outline-none focus:border-burgundy text-sm"
                        />
                      </div>
                      <div>
                        <label className="block body font-semibold uppercase tracking-wider opacity-70 mb-1">Cognome</label>
                        <input
                          type="text"
                          required
                          placeholder="es. Rossi"
                          value={singleGuestData.lastName}
                          onChange={e => setSingleGuestData({ ...singleGuestData, lastName: e.target.value })}
                          className="w-full px-4 py-2 rounded-xl border border-blush/40 bg-cream/30 focus:outline-none focus:border-burgundy text-sm"
                        />
                      </div>
                    </div>

                    {/* Sesso / Genere */}
                    <div>
                      <label className="block body font-semibold uppercase tracking-wider opacity-70 mb-2">
                        Sesso
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setSingleGuestData({ ...singleGuestData, gender: 'M' })}
                          className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl body font-bold border transition-all ${singleGuestData.gender === 'M'
                              ? 'bg-blue-50 border-blue-400 text-blue-800 shadow-sm'
                              : 'bg-cream/40 border-blush/30 text-burgundy/70 hover:border-blush'
                            }`}
                        >
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                          Maschio (M)
                        </button>
                        <button
                          type="button"
                          onClick={() => setSingleGuestData({ ...singleGuestData, gender: 'F' })}
                          className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl body font-bold border transition-all ${singleGuestData.gender === 'F'
                              ? 'bg-pink-50 border-pink-400 text-pink-800 shadow-sm'
                              : 'bg-cream/40 border-blush/30 text-burgundy/70 hover:border-blush'
                            }`}
                        >
                          <span className="w-2.5 h-2.5 rounded-full bg-pink-500 inline-block" />
                          Femmina (F)
                        </button>
                      </div>
                    </div>

                    {/* Bambino */}
                    <div className="pt-1">
                      <label className="flex items-center gap-2 body font-semibold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={singleGuestData.isChild}
                          onChange={e => setSingleGuestData({ ...singleGuestData, isChild: e.target.checked })}
                          className="w-4 h-4 rounded border-blush text-burgundy focus:ring-burgundy"
                        />
                        È un bambino / ragazzo
                      </label>
                    </div>

                    {/* Assegna Famiglia o Gruppo */}
                    <div className="pt-2 border-t border-blush/20 space-y-3">
                      <label className="block body font-semibold uppercase tracking-wider opacity-70">
                        Famiglia o Gruppo
                      </label>
                      <div className="flex gap-4 body font-semibold">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="clusterMode"
                            checked={singleGuestData.clusterMode === 'existing'}
                            onChange={() => setSingleGuestData({ ...singleGuestData, clusterMode: 'existing' })}
                            className="text-burgundy focus:ring-burgundy"
                          />
                          Famiglia esistente
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="clusterMode"
                            checked={singleGuestData.clusterMode === 'new'}
                            onChange={() => setSingleGuestData({ ...singleGuestData, clusterMode: 'new' })}
                            className="text-burgundy focus:ring-burgundy"
                          />
                          Nuova famiglia / singolo
                        </label>
                      </div>

                      {singleGuestData.clusterMode === 'existing' ? (
                        <div>
                          {existingClusters.length > 0 ? (
                            <select
                              value={singleGuestData.clusterId}
                              onChange={e => setSingleGuestData({ ...singleGuestData, clusterId: e.target.value })}
                              className="w-full px-4 py-2.5 rounded-xl border border-blush/40 bg-cream/30 body font-medium focus:outline-none focus:border-burgundy"
                            >
                              {existingClusters.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                              ))}
                            </select>
                          ) : (
                            <p className="body text-burgundy/60 italic">Nessuna famiglia esistente, creane una nuova sotto.</p>
                          )}
                        </div>
                      ) : (
                        <input
                          type="text"
                          required
                          placeholder="es. Famiglia Rossi oppure Nome Singolo..."
                          value={singleGuestData.newFamilyName}
                          onChange={e => setSingleGuestData({ ...singleGuestData, newFamilyName: e.target.value })}
                          className="w-full px-4 py-2 rounded-xl border border-blush/40 bg-cream/30 focus:outline-none focus:border-burgundy text-sm"
                        />
                      )}
                    </div>

                    <div className="pt-4 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowAddGuestModal(false)}
                        className="flex-1 py-2.5 rounded-full border border-blush/40 hover:bg-cream body font-semibold uppercase tracking-wider text-burgundy/80 transition-colors"
                      >
                        Annulla
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2.5 rounded-full bg-burgundy hover:bg-burgundy-light text-paper body font-semibold uppercase tracking-wider shadow-sm transition-all"
                      >
                        Salva Ospite
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Modal Gestione Famiglie e Gruppi */}
            {showFamiliesModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                <div className="bg-paper w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl border border-blush/40 shadow-2xl overflow-hidden">
                  <div className="p-6 border-b border-blush/20 flex items-center justify-between bg-cream/40 shrink-0">
                    <div>
                      <h3 className="text-2xl font-semibold text-burgundy flex items-center gap-2">
                        <Users className="w-5 h-5 text-blush" /> Gestione Famiglie & Gruppi
                      </h3>
                      <p className="text-xs text-burgundy/60 mt-0.5">
                        {existingClusters.length} famiglie registrate • Modifica i nomi delle famiglie o visualizza i codici invito
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowFamiliesModal(false)}
                      className="p-1 rounded-full text-burgundy/60 hover:text-burgundy hover:bg-cream transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-4 border-b border-blush/20 bg-paper shrink-0">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
                      <input
                        type="text"
                        placeholder="Cerca famiglia, codice invito o invitato..."
                        value={familySearchQuery}
                        onChange={e => setFamilySearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-full body border border-blush/40 bg-cream/20 focus:outline-none focus:border-burgundy text-sm"
                      />
                    </div>
                  </div>

                  <div className="p-6 overflow-y-auto space-y-3 flex-1 divide-y divide-blush/10">
                    {filteredClustersWithMembers.map(c => (
                      <div key={c.id} className="pt-3 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-burgundy text-base">{c.name}</span>
                            <button
                              onClick={() => handleOpenEditFamily(c.id, c.name)}
                              title="Modifica nome famiglia"
                              className="p-1 text-burgundy/60 hover:text-burgundy hover:bg-cream rounded-full transition-all"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blush-soft text-burgundy uppercase tracking-wider">
                              {c.count} {c.count === 1 ? 'ospite' : 'ospiti'}
                            </span>
                          </div>
                          <div className="text-xs text-burgundy/70">
                            {c.members.map(m => `${m.first_name} ${m.last_name}`).join(', ')}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                          {c.inviteCode && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-cream/60 border border-blush/30 text-xs font-mono text-burgundy">
                              <span className="text-[10px] uppercase font-bold text-burgundy/50 tracking-wider">Codice:</span>
                              <span className="font-bold">{c.inviteCode}</span>
                              <button
                                onClick={() => handleCopyInviteCode(c.id, c.inviteCode)}
                                title="Copia codice invito"
                                className="ml-1 p-1 hover:text-burgundy text-burgundy/60 rounded transition-colors"
                              >
                                {copiedCodeId === c.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          )}
                          <button
                            onClick={() => handleOpenEditFamily(c.id, c.name)}
                            className="px-3 py-1 rounded-xl text-xs font-semibold bg-burgundy/10 hover:bg-burgundy hover:text-white text-burgundy transition-all"
                          >
                            Modifica Nome
                          </button>
                        </div>
                      </div>
                    ))}
                    {filteredClustersWithMembers.length === 0 && (
                      <div className="py-8 text-center text-sm opacity-60">Nessuna famiglia trovata.</div>
                    )}
                  </div>

                  <div className="p-4 border-t border-blush/20 bg-cream/30 flex justify-end shrink-0">
                    <button
                      onClick={() => setShowFamiliesModal(false)}
                      className="px-5 py-2 rounded-xl bg-burgundy text-paper text-sm font-semibold hover:bg-burgundy-light transition-all"
                    >
                      Chiudi
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Modifica Nome Famiglia */}
            {editingCluster && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                <div className="bg-paper w-full max-w-md rounded-3xl border border-blush/40 shadow-2xl p-6 sm:p-8 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-blush/20">
                    <h3 className="text-xl font-semibold text-burgundy flex items-center gap-2">
                      <Edit2 className="w-5 h-5 text-blush" /> Modifica Nome Famiglia
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingCluster(null)}
                      className="p-1 rounded-full text-burgundy/60 hover:text-burgundy hover:bg-cream transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={e => { e.preventDefault(); handleSaveFamilyName(); }} className="space-y-4">
                    <div>
                      <label className="block body font-semibold uppercase tracking-wider opacity-70 mb-1 text-xs">
                        Nome Famiglia o Gruppo
                      </label>
                      <input
                        type="text"
                        required
                        value={editingClusterNewName}
                        onChange={e => setEditingClusterNewName(e.target.value)}
                        placeholder="es. Famiglia Rossi"
                        className="w-full px-4 py-2.5 rounded-xl border border-blush/40 bg-cream/30 focus:outline-none focus:border-burgundy text-sm font-medium"
                        autoFocus
                      />
                    </div>
                    <p className="text-xs text-burgundy/60 leading-relaxed bg-cream/40 p-3 rounded-xl border border-blush/20">
                      ℹ️ Il nuovo nome verrà assegnato automaticamente a tutti i membri appartenenti a questo nucleo.
                    </p>

                    <div className="flex justify-end gap-3 pt-3 border-t border-blush/20">
                      <button
                        type="button"
                        onClick={() => setEditingCluster(null)}
                        className="px-4 py-2 rounded-xl border border-blush/40 text-burgundy text-sm font-semibold hover:bg-cream transition-colors"
                      >
                        Annulla
                      </button>
                      <button
                        type="submit"
                        disabled={isSavingCluster || !editingClusterNewName.trim()}
                        className="px-5 py-2 rounded-xl bg-burgundy hover:bg-burgundy-light text-paper text-sm font-semibold transition-all disabled:opacity-50"
                      >
                        {isSavingCluster ? 'Salvataggio...' : 'Salva Modifica'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'gifts' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-3xl font-semibold mb-2">Messaggi Regali Ricevuti</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gifts.map(g => (
                <div key={g.id} className="bg-paper p-6 rounded-3xl border border-blush/30 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="body uppercase tracking-wider font-semibold opacity-60 mb-1">{new Date(g.created_at).toLocaleString('it-IT', { dateStyle: 'short', timeStyle: 'short' })}</div>
                    <div className="text-xl font-semibold mb-3 text-burgundy">{g.sender_name}</div>
                    {g.wishes && <div className="text-sm italic opacity-80 mb-3 line-clamp-4">"{g.wishes}"</div>}
                  </div>
                  {g.amount_note && (
                    <div className="mt-4 pt-4 border-t border-blush/20 body font-semibold text-burgundy bg-blush-soft px-3 py-2 rounded-xl text-center">
                      Bonifico comunicato: {g.amount_note}
                    </div>
                  )}
                </div>
              ))}
              {gifts.length === 0 && (
                <div className="col-span-full text-center py-10 opacity-60">Nessun messaggio regalo ricevuto ancora.</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'places' && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-paper rounded-3xl border border-blush/30 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-blush/20 bg-cream/50 flex flex-col lg:flex-row items-center justify-between gap-4">
                <h3 className="text-xl font-semibold shrink-0">Lista Luoghi Mappa</h3>
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
                    <input type="text" placeholder="Cerca luogo o indirizzo..." value={placeSearchQuery} onChange={e => setPlaceSearchQuery(e.target.value)} className="w-full pl-9 pr-3 py-2 rounded-full body border border-blush/40 bg-paper focus:outline-none focus:border-burgundy transition-colors" />
                  </div>
                  <select value={placeCategoryFilter} onChange={e => setPlaceCategoryFilter(e.target.value)} className="px-3 py-2 rounded-full body border border-blush/40 bg-paper focus:outline-none focus:border-burgundy transition-colors appearance-none">
                    <option value="all">Tutte le Categorie</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-cream/50 body uppercase tracking-wider opacity-70">
                    <tr>
                      <th className="p-4 font-semibold">Nome</th>
                      <th className="p-4 font-semibold">Categoria</th>
                      <th className="p-4 font-semibold">Indirizzo</th>
                      <th className="p-4 font-semibold">Latitudine</th>
                      <th className="p-4 font-semibold">Longitudine</th>
                      <th className="p-4 font-semibold text-center">Azioni</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blush/20">
                    {filteredPlaces.map(p => (
                      <tr key={p.id} className="hover:bg-cream/30 transition-colors">
                        {editingPlaceId === p.id ? (
                          <>
                            <td className="p-2">
                              <input type="text" value={editPlaceData.name} onChange={e => setEditPlaceData({ ...editPlaceData, name: e.target.value })} className="w-full px-2 py-1 rounded body border border-blush/40 bg-white" />
                            </td>
                            <td className="p-2">
                              <div className="flex gap-1 flex-col">
                                <select value={editPlaceData.category} onChange={e => setEditPlaceData({ ...editPlaceData, category: e.target.value })} className="w-full px-2 py-1 rounded body border border-blush/40 bg-white">
                                  {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                </select>
                                {editPlaceData.category === 'food' && (
                                  <select value={editPlaceData.food_type} onChange={e => setEditPlaceData({ ...editPlaceData, food_type: e.target.value })} className="w-full px-2 py-1 rounded body border border-blush/40 bg-white mt-1">
                                    <option value="">Seleziona...</option>
                                    {foodCategories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                  </select>
                                )}
                              </div>
                            </td>
                            <td className="p-2">
                              <input type="text" value={editPlaceData.address} onChange={e => setEditPlaceData({ ...editPlaceData, address: e.target.value })} className="w-full px-2 py-1 rounded body border border-blush/40 bg-white" />
                            </td>
                            <td className="p-2">
                              <input type="number" step="any" value={editPlaceData.latitude} onChange={e => setEditPlaceData({ ...editPlaceData, latitude: e.target.value })} className="w-full px-2 py-1 rounded body border border-blush/40 bg-white" />
                            </td>
                            <td className="p-2">
                              <input type="number" step="any" value={editPlaceData.longitude} onChange={e => setEditPlaceData({ ...editPlaceData, longitude: e.target.value })} className="w-full px-2 py-1 rounded body border border-blush/40 bg-white" />
                            </td>
                            <td className="p-2 text-center whitespace-nowrap">
                              <button onClick={handleSavePlaceEdit} className="p-1.5 text-burgundy hover:bg-blush-soft rounded-full transition-colors mx-0.5">
                                <Check className="w-4 h-4" />
                              </button>
                              <button onClick={() => setEditingPlaceId(null)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-full transition-colors mx-0.5">
                                <X className="w-4 h-4" />
                              </button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="p-4 font-medium flex items-center gap-2">
                              {p.is_primary && <MapPin className="w-4 h-4 text-burgundy" />}
                              {p.name}
                            </td>
                            <td className="p-4 opacity-80">
                              {p.category === 'food'
                                ? (foodCategories.find(c => c.id === p.food_type)?.label || p.food_type)
                                : (categories.find(c => c.id === p.category)?.label || p.category)}
                            </td>
                            <td className="p-4 opacity-80 body">{p.address}</td>
                            <td className="p-4 opacity-80 body">{p.latitude}</td>
                            <td className="p-4 opacity-80 body">{p.longitude}</td>
                            <td className="p-4 text-center whitespace-nowrap">
                              <button onClick={() => startEditingPlace(p)} className="p-1.5 text-burgundy opacity-60 hover:opacity-100 hover:bg-cream rounded-full transition-all mx-0.5">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDeletePlace(p.id)} className="p-1.5 text-rose-600 opacity-60 hover:opacity-100 hover:bg-rose-50 rounded-full transition-all mx-0.5">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                    {filteredPlaces.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center opacity-60">Nessun luogo trovato.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'add' && (
          <div className="space-y-8 animate-fade-in max-w-2xl mx-auto">

            {/* Aggiungi FAQ */}
            <div className="bg-paper p-6 sm:p-10 rounded-3xl border border-blush/30 shadow-sm mt-8">
              <h2 className="text-3xl font-semibold mb-6 text-center">Aggiungi FAQ</h2>
              <form onSubmit={handleAddFaq} className="space-y-4">
                <div>
                  <label className="block body font-semibold uppercase tracking-wider opacity-70 mb-1">Domanda</label>
                  <input required type="text" value={newFaq.question} onChange={e => setNewFaq({ ...newFaq, question: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-blush/40 bg-cream/30 focus:outline-none focus:border-burgundy" />
                </div>
                <div>
                  <label className="block body font-semibold uppercase tracking-wider opacity-70 mb-1">Risposta</label>
                  <input required type="text" value={newFaq.answer} onChange={e => setNewFaq({ ...newFaq, answer: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-blush/40 bg-cream/30 focus:outline-none focus:border-burgundy" />
                </div>
                <div>
                  <label className="block body font-semibold uppercase tracking-wider opacity-70 mb-1">Categoria</label>
                  <select value={newFaq.category} onChange={e => setNewFaq({ ...newFaq, category: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-blush/40 bg-cream/30 focus:outline-none focus:border-burgundy">
                    <option value="info">Info Utili</option>
                    <option value="locations">Location</option>
                    <option value="gifts">Regali</option>
                  </select>
                </div>
                <div className="pt-6 border-t border-blush/20">
                  <button type="submit" className="btn-primary w-full py-3 body sm:text-sm">Salva FAQ</button>
                </div>
              </form>
            </div>

            {/* Aggiungi Famiglia */}
            <div className="bg-paper p-6 sm:p-10 rounded-3xl border border-blush/30 shadow-sm">
              <h2 className="text-3xl font-semibold mb-6 text-center">Aggiungi Nuova Famiglia</h2>
              <form onSubmit={handleSaveGuests} className="space-y-6">
                <div>
                  <label className="block body font-semibold uppercase tracking-wider opacity-70 mb-1">Nome Famiglia o Gruppo</label>
                  <input type="text" required value={newFamilyName} onChange={e => setNewFamilyName(e.target.value)} placeholder="es. Famiglia Rossi, Amici Uni..." className="w-full px-4 py-2 rounded-xl border border-blush/40 bg-cream/30 focus:outline-none focus:border-burgundy" />
                </div>
                <div className="space-y-4">
                  <label className="block body font-semibold uppercase tracking-wider opacity-70 mb-1">Membri (Ospiti)</label>
                  {newGuests.map((g, idx) => (
                    <div key={idx} className="flex flex-wrap sm:flex-nowrap gap-3 items-center">
                      <input type="text" required placeholder="Nome" value={g.firstName} onChange={e => { const updated = [...newGuests]; updated[idx].firstName = e.target.value; setNewGuests(updated); }} className="flex-1 min-w-[120px] px-4 py-2 rounded-xl border border-blush/40 bg-cream/30 focus:outline-none focus:border-burgundy" />
                      <input type="text" required placeholder="Cognome" value={g.lastName} onChange={e => { const updated = [...newGuests]; updated[idx].lastName = e.target.value; setNewGuests(updated); }} className="flex-1 min-w-[120px] px-4 py-2 rounded-xl border border-blush/40 bg-cream/30 focus:outline-none focus:border-burgundy" />
                      <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-blush/40 bg-cream/30 shrink-0">
                        <span className="body font-semibold text-burgundy/70">Sesso:</span>
                        <select value={g.gender} onChange={e => { const updated = [...newGuests]; updated[idx].gender = e.target.value as 'M' | 'F'; setNewGuests(updated); }} className="bg-transparent body font-bold text-burgundy focus:outline-none cursor-pointer">
                          <option value="M">Maschio (M)</option>
                          <option value="F">Femmina (F)</option>
                        </select>
                      </div>
                      <label className="flex items-center gap-2 body font-semibold cursor-pointer shrink-0">
                        <input type="checkbox" checked={g.isChild} onChange={e => { const updated = [...newGuests]; updated[idx].isChild = e.target.checked; setNewGuests(updated); }} className="w-4 h-4 rounded border-blush text-burgundy focus:ring-burgundy" />
                        Bambino
                      </label>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={handleAddGuestRow} className="body font-semibold uppercase tracking-wider opacity-70 hover:opacity-100 transition-opacity flex items-center gap-1">+ Aggiungi Ospite</button>

                <div className="pt-6 border-t border-blush/20">
                  <button type="submit" className="btn-primary w-full py-3 body sm:text-sm">Salva nel Database</button>
                </div>
              </form>
            </div>

            {/* Aggiungi Luogo */}
            <div className="bg-paper p-6 sm:p-10 rounded-3xl border border-blush/30 shadow-sm">
              <h2 className="text-3xl font-semibold mb-6 text-center">Aggiungi Luogo Mappa</h2>
              <form onSubmit={handleSavePlace} className="space-y-4">
                <div>
                  <label className="block body font-semibold uppercase tracking-wider opacity-70 mb-1">Nome del Luogo</label>
                  <input type="text" required value={newPlace.name} onChange={e => setNewPlace({ ...newPlace, name: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-blush/40 bg-cream/30 focus:outline-none focus:border-burgundy" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block body font-semibold uppercase tracking-wider opacity-70 mb-1">Categoria</label>
                    <select required value={newPlace.category} onChange={e => setNewPlace({ ...newPlace, category: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-blush/40 bg-cream/30 focus:outline-none focus:border-burgundy">
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  {newPlace.category === 'food' && (
                    <div>
                      <label className="block body font-semibold uppercase tracking-wider opacity-70 mb-1">Tipo di Cibo</label>
                      <select required value={newPlace.food_type} onChange={e => setNewPlace({ ...newPlace, food_type: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-blush/40 bg-cream/30 focus:outline-none focus:border-burgundy">
                        <option value="">-- Seleziona --</option>
                        {foodCategories.map(c => (
                          <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block body font-semibold uppercase tracking-wider opacity-70 mb-1">Indirizzo</label>
                  <input type="text" required value={newPlace.address} onChange={e => setNewPlace({ ...newPlace, address: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-blush/40 bg-cream/30 focus:outline-none focus:border-burgundy" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block body font-semibold uppercase tracking-wider opacity-70 mb-1">Latitudine</label>
                    <input type="number" step="any" required value={newPlace.latitude} onChange={e => setNewPlace({ ...newPlace, latitude: e.target.value })} placeholder="Es. 45.075" className="w-full px-4 py-2 rounded-xl border border-blush/40 bg-cream/30 focus:outline-none focus:border-burgundy" />
                  </div>
                  <div>
                    <label className="block body font-semibold uppercase tracking-wider opacity-70 mb-1">Longitudine</label>
                    <input type="number" step="any" required value={newPlace.longitude} onChange={e => setNewPlace({ ...newPlace, longitude: e.target.value })} placeholder="Es. 7.689" className="w-full px-4 py-2 rounded-xl border border-blush/40 bg-cream/30 focus:outline-none focus:border-burgundy" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block body font-semibold uppercase tracking-wider opacity-70 mb-1">Telefono (Opzionale)</label>
                    <input type="text" value={newPlace.phone} onChange={e => setNewPlace({ ...newPlace, phone: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-blush/40 bg-cream/30 focus:outline-none focus:border-burgundy" />
                  </div>
                  <div>
                    <label className="block body font-semibold uppercase tracking-wider opacity-70 mb-1">Sito Web (Opzionale)</label>
                    <input type="url" value={newPlace.website_url} onChange={e => setNewPlace({ ...newPlace, website_url: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-blush/40 bg-cream/30 focus:outline-none focus:border-burgundy" />
                  </div>
                </div>
                <div>
                  <label className="block body font-semibold uppercase tracking-wider opacity-70 mb-1">Nota degli sposi (Opzionale)</label>
                  <textarea rows={2} value={newPlace.sposi_note} onChange={e => setNewPlace({ ...newPlace, sposi_note: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-blush/40 bg-cream/30 focus:outline-none focus:border-burgundy resize-none" />
                </div>
                <label className="flex items-center gap-2 body font-semibold cursor-pointer">
                  <input type="checkbox" checked={newPlace.is_primary} onChange={e => setNewPlace({ ...newPlace, is_primary: e.target.checked })} className="w-4 h-4 rounded border-blush text-burgundy focus:ring-burgundy" />
                  Luogo Principale (Cerimonia / Ricevimento)
                </label>

                <div className="pt-6 border-t border-blush/20">
                  <button type="submit" className="btn-primary w-full py-3 body sm:text-sm">Salva nel Database</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
