import React, { useState, useEffect } from 'react';
import { Users, Gift, MapPin, Search, Music, AlertTriangle, LogOut, CheckCircle2, XCircle, Clock, Edit2, Check, X, Trash2, MessageCircle, HelpCircle } from 'lucide-react';
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
  
  const [placeSearchQuery, setPlaceSearchQuery] = useState('');
  const [placeCategoryFilter, setPlaceCategoryFilter] = useState<string>('all');

  const [newFamilyName, setNewFamilyName] = useState('');
  const [newGuests, setNewGuests] = useState<{ firstName: string, lastName: string, isChild: boolean }[]>([{ firstName: '', lastName: '', isChild: false }]);

  const [editingGuestId, setEditingGuestId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});

  const startEditing = (guest: any) => {
    setEditingGuestId(guest.id);
    setEditData({
      first_name: guest.first_name,
      last_name: guest.last_name,
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
    setNewGuests([...newGuests, { firstName: '', lastName: '', isChild: false }]);
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
      setNewGuests([{ firstName: '', lastName: '', isChild: false }]);
      fetchData();
      setActiveTab('guests');
    } else {
      alert('Errore durante il salvataggio');
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

  const confirmed = guests.filter(g => g.is_attending === true);
  const declined = guests.filter(g => g.is_attending === false);
  const pending = guests.filter(g => g.is_attending === null);

  const filteredGuests = guests.filter(g => {
    const s = searchQuery.toLowerCase();
    const nameMatch = `${g.first_name} ${g.last_name}`.toLowerCase().includes(s);
    const familyMatch = g.clusters?.family_name?.toLowerCase().includes(s);
    if (!nameMatch && !familyMatch) return false;

    if (filterStatus === 'confirmed' && g.is_attending !== true) return false;
    if (filterStatus === 'declined' && g.is_attending !== false) return false;
    if (filterStatus === 'pending' && g.is_attending !== null) return false;

    return true;
  });

  const filteredPlaces = places.filter(p => {
    const s = placeSearchQuery.toLowerCase();
    const nameMatch = p.name.toLowerCase().includes(s);
    const addressMatch = p.address.toLowerCase().includes(s);
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
        <h1 className="font-serif text-2xl font-bold">Portale Admin Matrimonio</h1>
        <button onClick={onLogout} className="flex items-center gap-2 text-sm font-semibold opacity-80 hover:opacity-100 transition-opacity">
          <LogOut className="w-4 h-4" /> Esci
        </button>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-wrap gap-4 mb-8">
          <button onClick={() => setActiveTab('guests')} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === 'guests' ? 'bg-burgundy text-paper' : 'bg-paper text-burgundy border border-blush/40 hover:border-burgundy'}`}>
            <Users className="w-4 h-4 inline-block mr-2" /> Ospiti & Metriche
          </button>
          <button onClick={() => setActiveTab('places')} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === 'places' ? 'bg-burgundy text-paper' : 'bg-paper text-burgundy border border-blush/40 hover:border-burgundy'}`}>
            <MapPin className="w-4 h-4 inline-block mr-2" /> Luoghi Mappa
          </button>
          <button onClick={() => setActiveTab('gifts')} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === 'gifts' ? 'bg-burgundy text-paper' : 'bg-paper text-burgundy border border-blush/40 hover:border-burgundy'}`}>
            <Gift className="w-4 h-4 inline-block mr-2" /> Messaggi Regali
          </button>
          <button onClick={() => setActiveTab('add')} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === 'add' ? 'bg-burgundy text-paper' : 'bg-paper text-burgundy border border-blush/40 hover:border-burgundy'}`}>
            + Aggiungi Dati
          </button>
          <button onClick={() => setActiveTab('faq')} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === 'faq' ? 'bg-burgundy text-paper' : 'bg-paper text-burgundy border border-blush/40 hover:border-burgundy'}`}>
            <HelpCircle className="w-4 h-4 inline-block mr-2" /> FAQ
          </button>
          <button onClick={() => setActiveTab('settings')} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === 'settings' ? 'bg-burgundy text-paper' : 'bg-paper text-burgundy border border-blush/40 hover:border-burgundy'}`}>
            <Settings className="w-4 h-4 inline-block mr-2" /> Impostazioni
          </button>
        </div>

        {activeTab === 'settings' && <AdminSettings />}

        {activeTab === 'faq' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-serif text-3xl font-medium">Gestione FAQ</h2>
              <button onClick={() => setActiveTab('add')} className="px-4 py-2 text-xs uppercase tracking-widest font-semibold bg-cream text-burgundy hover:bg-blush-soft border border-blush/30 rounded-full transition-colors">
                + Aggiungi FAQ
              </button>
            </div>
            <div className="space-y-3">
              {faqs.map(faq => (
                <div key={faq.id} className="flex justify-between items-center p-4 bg-paper border border-blush/20 rounded-xl hover:bg-cream/20 shadow-sm">
                  {editingFaqId === faq.id ? (
                    <div className="flex-1 space-y-3 mr-4">
                      <input type="text" value={editFaqData.question} onChange={e=>setEditFaqData({...editFaqData, question: e.target.value})} className="w-full px-3 py-1.5 rounded-lg border border-blush/40 text-sm bg-cream/30 focus:outline-none focus:border-burgundy" placeholder="Domanda" />
                      <textarea value={editFaqData.answer} onChange={e=>setEditFaqData({...editFaqData, answer: e.target.value})} className="w-full px-3 py-1.5 rounded-lg border border-blush/40 text-sm bg-cream/30 focus:outline-none focus:border-burgundy resize-y" rows={2} placeholder="Risposta" />
                      <select value={editFaqData.category} onChange={e=>setEditFaqData({...editFaqData, category: e.target.value})} className="w-full px-3 py-1.5 rounded-lg border border-blush/40 text-sm bg-cream/30 focus:outline-none focus:border-burgundy">
                        <option value="info">Info Utili</option>
                        <option value="locations">Location</option>
                        <option value="gifts">Regali</option>
                      </select>
                      <div className="flex gap-2">
                        <button onClick={() => handleUpdateFaq(faq.id)} className="px-4 py-1.5 bg-burgundy text-paper text-xs rounded-lg font-semibold hover:bg-burgundy-light transition-colors">Salva</button>
                        <button onClick={() => setEditingFaqId(null)} className="px-4 py-1.5 bg-cream text-burgundy text-xs rounded-lg border border-blush/40 hover:border-burgundy transition-colors">Annulla</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 mr-4">
                        <p className="font-semibold text-burgundy text-sm">{faq.question}</p>
                        <p className="text-xs text-burgundy/70 mt-1 whitespace-pre-wrap">{faq.answer}</p>
                        <span className="inline-block mt-2 text-[10px] uppercase font-bold tracking-widest text-blush bg-blush-soft px-2 py-0.5 rounded-full">{faq.category}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => { setEditingFaqId(faq.id); setEditFaqData({...faq}); }} className="p-2 text-burgundy/60 hover:text-burgundy hover:bg-cream rounded-full transition-all">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-paper p-6 rounded-3xl border border-blush/30 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-emerald-700">{confirmed.length}</div>
                  <div className="text-xs uppercase tracking-wider font-semibold opacity-70">Confermati</div>
                </div>
              </div>
              <div className="bg-paper p-6 rounded-3xl border border-blush/30 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-amber-700">{pending.length}</div>
                  <div className="text-xs uppercase tracking-wider font-semibold opacity-70">In Attesa</div>
                </div>
              </div>
              <div className="bg-paper p-6 rounded-3xl border border-blush/30 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-rose-600" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-rose-700">{declined.length}</div>
                  <div className="text-xs uppercase tracking-wider font-semibold opacity-70">Declinati</div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button onClick={handleDownloadIntolerances} className="flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200 hover:bg-rose-100 transition-colors">
                <AlertTriangle className="w-4 h-4" /> Scarica CSV Intolleranze
              </button>
              <button onClick={handleDownloadSongs} className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200 hover:bg-blue-100 transition-colors">
                <Music className="w-4 h-4" /> Scarica CSV Canzoni
              </button>
            </div>

            <div className="bg-paper rounded-3xl border border-blush/30 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-blush/20 bg-cream/50 flex flex-col lg:flex-row items-center justify-between gap-4">
                <h3 className="font-serif text-xl font-medium shrink-0">Lista Ospiti</h3>
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
                    <input type="text" placeholder="Cerca per nome o famiglia..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-9 pr-3 py-2 rounded-full text-xs border border-blush/40 bg-paper focus:outline-none focus:border-burgundy transition-colors" />
                  </div>
                  <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 rounded-full text-xs border border-blush/40 bg-paper focus:outline-none focus:border-burgundy transition-colors appearance-none">
                    <option value="all">Tutti gli Stati</option>
                    <option value="confirmed">Confermati</option>
                    <option value="pending">In Attesa</option>
                    <option value="declined">Declinati</option>
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-cream/50 text-xs uppercase tracking-wider opacity-70">
                    <tr>
                      <th className="p-4 font-semibold">Nome</th>
                      <th className="p-4 font-semibold">Cognome</th>
                      <th className="p-4 font-semibold">Famiglia</th>
                      <th className="p-4 font-semibold text-center">Stato</th>
                      <th className="p-4 font-semibold">Intolleranze</th>
                      <th className="p-4 font-semibold">Canzoni</th>
                      <th className="p-4 font-semibold text-center">Azioni</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blush/20">
                    {filteredGuests.map(g => (
                      <tr key={g.id} className="hover:bg-cream/30 transition-colors">
                        {editingGuestId === g.id ? (
                          <>
                            <td className="p-2">
                              <input type="text" value={editData.first_name} onChange={e => setEditData({...editData, first_name: e.target.value})} className="w-full px-2 py-1 rounded text-xs border border-blush/40 bg-white" />
                            </td>
                            <td className="p-2">
                              <input type="text" value={editData.last_name} onChange={e => setEditData({...editData, last_name: e.target.value})} className="w-full px-2 py-1 rounded text-xs border border-blush/40 bg-white" />
                            </td>
                            <td className="p-4 opacity-80">{g.clusters?.family_name}</td>
                            <td className="p-2">
                              <select value={editData.is_attending === null ? 'null' : editData.is_attending.toString()} onChange={e => setEditData({...editData, is_attending: e.target.value === 'null' ? null : e.target.value === 'true'})} className="w-full px-2 py-1 rounded text-xs border border-blush/40 bg-white">
                                <option value="null">In Attesa</option>
                                <option value="true">Confermato</option>
                                <option value="false">Declinato</option>
                              </select>
                            </td>
                            <td className="p-2">
                              <input type="text" value={editData.dietary_notes} onChange={e => setEditData({...editData, dietary_notes: e.target.value})} className="w-full px-2 py-1 rounded text-xs border border-blush/40 bg-white" placeholder="Nessuna" />
                            </td>
                            <td className="p-2">
                              <input type="text" value={editData.song_request} onChange={e => setEditData({...editData, song_request: e.target.value})} className="w-full px-2 py-1 rounded text-xs border border-blush/40 bg-white" placeholder="Nessuna" />
                            </td>
                            <td className="p-2 text-center">
                              <button onClick={handleSaveEdit} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors mx-1">
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
                            <td className="p-4 opacity-80">{g.clusters?.family_name}</td>
                            <td className="p-4 text-center">
                              {g.is_attending === true && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase tracking-widest">Confermato</span>}
                              {g.is_attending === false && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 uppercase tracking-widest">Declinato</span>}
                              {g.is_attending === null && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 uppercase tracking-widest">In Attesa</span>}
                            </td>
                            <td className="p-4">
                              {g.dietary_notes && (
                                <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 px-2 py-1 rounded-md border border-rose-100 inline-flex">
                                  <AlertTriangle className="w-3.5 h-3.5" />
                                  <span className="truncate max-w-[150px]" title={g.dietary_notes}>{g.dietary_notes}</span>
                                </div>
                              )}
                            </td>
                            <td className="p-4">
                              {g.song_request && (
                                <div className="flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100 inline-flex">
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
                    {filteredGuests.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-8 text-center opacity-60">Nessun ospite trovato.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'gifts' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="font-serif text-3xl font-medium mb-2">Messaggi Regali Ricevuti</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gifts.map(g => (
                <div key={g.id} className="bg-paper p-6 rounded-3xl border border-blush/30 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-wider font-semibold opacity-60 mb-1">{new Date(g.created_at).toLocaleString('it-IT', { dateStyle: 'short', timeStyle: 'short' })}</div>
                    <div className="font-serif text-xl font-medium mb-3 text-emerald-800">{g.sender_name}</div>
                    {g.wishes && <div className="text-sm italic opacity-80 mb-3 line-clamp-4">"{g.wishes}"</div>}
                  </div>
                  {g.amount_note && (
                    <div className="mt-4 pt-4 border-t border-blush/20 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl text-center">
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
                <h3 className="font-serif text-xl font-medium shrink-0">Lista Luoghi Mappa</h3>
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
                    <input type="text" placeholder="Cerca luogo o indirizzo..." value={placeSearchQuery} onChange={e => setPlaceSearchQuery(e.target.value)} className="w-full pl-9 pr-3 py-2 rounded-full text-xs border border-blush/40 bg-paper focus:outline-none focus:border-burgundy transition-colors" />
                  </div>
                  <select value={placeCategoryFilter} onChange={e => setPlaceCategoryFilter(e.target.value)} className="px-3 py-2 rounded-full text-xs border border-blush/40 bg-paper focus:outline-none focus:border-burgundy transition-colors appearance-none">
                    <option value="all">Tutte le Categorie</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-cream/50 text-xs uppercase tracking-wider opacity-70">
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
                              <input type="text" value={editPlaceData.name} onChange={e => setEditPlaceData({...editPlaceData, name: e.target.value})} className="w-full px-2 py-1 rounded text-xs border border-blush/40 bg-white" />
                            </td>
                            <td className="p-2">
                              <div className="flex gap-1 flex-col">
                                <select value={editPlaceData.category} onChange={e => setEditPlaceData({...editPlaceData, category: e.target.value})} className="w-full px-2 py-1 rounded text-xs border border-blush/40 bg-white">
                                  {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                </select>
                                {editPlaceData.category === 'food' && (
                                  <select value={editPlaceData.food_type} onChange={e => setEditPlaceData({...editPlaceData, food_type: e.target.value})} className="w-full px-2 py-1 rounded text-xs border border-blush/40 bg-white mt-1">
                                    <option value="">Seleziona...</option>
                                    {foodCategories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                  </select>
                                )}
                              </div>
                            </td>
                            <td className="p-2">
                              <input type="text" value={editPlaceData.address} onChange={e => setEditPlaceData({...editPlaceData, address: e.target.value})} className="w-full px-2 py-1 rounded text-xs border border-blush/40 bg-white" />
                            </td>
                            <td className="p-2">
                              <input type="number" step="any" value={editPlaceData.latitude} onChange={e => setEditPlaceData({...editPlaceData, latitude: e.target.value})} className="w-full px-2 py-1 rounded text-xs border border-blush/40 bg-white" />
                            </td>
                            <td className="p-2">
                              <input type="number" step="any" value={editPlaceData.longitude} onChange={e => setEditPlaceData({...editPlaceData, longitude: e.target.value})} className="w-full px-2 py-1 rounded text-xs border border-blush/40 bg-white" />
                            </td>
                            <td className="p-2 text-center whitespace-nowrap">
                              <button onClick={handleSavePlaceEdit} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors mx-0.5">
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
                            <td className="p-4 opacity-80 text-xs">{p.address}</td>
                            <td className="p-4 opacity-80 text-xs">{p.latitude}</td>
                            <td className="p-4 opacity-80 text-xs">{p.longitude}</td>
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
              <h2 className="font-serif text-3xl font-medium mb-6 text-center">Aggiungi FAQ</h2>
              <form onSubmit={handleAddFaq} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">Domanda</label>
                  <input required type="text" value={newFaq.question} onChange={e=>setNewFaq({...newFaq, question: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-blush/40 bg-cream/30 focus:outline-none focus:border-burgundy" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">Risposta</label>
                  <input required type="text" value={newFaq.answer} onChange={e=>setNewFaq({...newFaq, answer: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-blush/40 bg-cream/30 focus:outline-none focus:border-burgundy" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">Categoria</label>
                  <select value={newFaq.category} onChange={e=>setNewFaq({...newFaq, category: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-blush/40 bg-cream/30 focus:outline-none focus:border-burgundy">
                    <option value="info">Info Utili</option>
                    <option value="locations">Location</option>
                    <option value="gifts">Regali</option>
                  </select>
                </div>
                <div className="pt-6 border-t border-blush/20">
                  <button type="submit" className="w-full py-3 rounded-full bg-burgundy hover:bg-burgundy-light text-paper font-semibold uppercase tracking-widest text-sm shadow-sm transition-all">Salva FAQ</button>
                </div>
              </form>
            </div>

            {/* Aggiungi Famiglia */}
            <div className="bg-paper p-6 sm:p-10 rounded-3xl border border-blush/30 shadow-sm">
              <h2 className="font-serif text-3xl font-medium mb-6 text-center">Aggiungi Nuova Famiglia</h2>
              <form onSubmit={handleSaveGuests} className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">Nome Famiglia o Gruppo</label>
                  <input type="text" required value={newFamilyName} onChange={e => setNewFamilyName(e.target.value)} placeholder="es. Famiglia Rossi, Amici Uni..." className="w-full px-4 py-2 rounded-xl border border-blush/40 bg-cream/30 focus:outline-none focus:border-burgundy" />
                </div>
                <div className="space-y-4">
                  <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">Membri (Ospiti)</label>
                  {newGuests.map((g, idx) => (
                    <div key={idx} className="flex gap-4 items-center">
                      <input type="text" required placeholder="Nome" value={g.firstName} onChange={e => { const updated = [...newGuests]; updated[idx].firstName = e.target.value; setNewGuests(updated); }} className="flex-1 px-4 py-2 rounded-xl border border-blush/40 bg-cream/30 focus:outline-none focus:border-burgundy" />
                      <input type="text" required placeholder="Cognome" value={g.lastName} onChange={e => { const updated = [...newGuests]; updated[idx].lastName = e.target.value; setNewGuests(updated); }} className="flex-1 px-4 py-2 rounded-xl border border-blush/40 bg-cream/30 focus:outline-none focus:border-burgundy" />
                      <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer shrink-0">
                        <input type="checkbox" checked={g.isChild} onChange={e => { const updated = [...newGuests]; updated[idx].isChild = e.target.checked; setNewGuests(updated); }} className="w-4 h-4 rounded border-blush text-burgundy focus:ring-burgundy" />
                        Bambino
                      </label>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={handleAddGuestRow} className="text-xs font-semibold uppercase tracking-wider opacity-70 hover:opacity-100 transition-opacity flex items-center gap-1">+ Aggiungi Ospite</button>
                
                <div className="pt-6 border-t border-blush/20">
                  <button type="submit" className="w-full py-3 rounded-full bg-burgundy hover:bg-burgundy-light text-paper font-semibold uppercase tracking-widest text-sm shadow-sm transition-all">Salva nel Database</button>
                </div>
              </form>
            </div>

            {/* Aggiungi Luogo */}
            <div className="bg-paper p-6 sm:p-10 rounded-3xl border border-blush/30 shadow-sm">
              <h2 className="font-serif text-3xl font-medium mb-6 text-center">Aggiungi Luogo Mappa</h2>
              <form onSubmit={handleSavePlace} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">Nome del Luogo</label>
                  <input type="text" required value={newPlace.name} onChange={e => setNewPlace({...newPlace, name: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-blush/40 bg-cream/30 focus:outline-none focus:border-burgundy" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">Categoria</label>
                    <select required value={newPlace.category} onChange={e => setNewPlace({...newPlace, category: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-blush/40 bg-cream/30 focus:outline-none focus:border-burgundy">
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  {newPlace.category === 'food' && (
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">Tipo di Cibo</label>
                      <select required value={newPlace.food_type} onChange={e => setNewPlace({...newPlace, food_type: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-blush/40 bg-cream/30 focus:outline-none focus:border-burgundy">
                        <option value="">-- Seleziona --</option>
                        {foodCategories.map(c => (
                          <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">Indirizzo</label>
                  <input type="text" required value={newPlace.address} onChange={e => setNewPlace({...newPlace, address: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-blush/40 bg-cream/30 focus:outline-none focus:border-burgundy" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">Latitudine</label>
                    <input type="number" step="any" required value={newPlace.latitude} onChange={e => setNewPlace({...newPlace, latitude: e.target.value})} placeholder="Es. 45.075" className="w-full px-4 py-2 rounded-xl border border-blush/40 bg-cream/30 focus:outline-none focus:border-burgundy" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">Longitudine</label>
                    <input type="number" step="any" required value={newPlace.longitude} onChange={e => setNewPlace({...newPlace, longitude: e.target.value})} placeholder="Es. 7.689" className="w-full px-4 py-2 rounded-xl border border-blush/40 bg-cream/30 focus:outline-none focus:border-burgundy" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">Telefono (Opzionale)</label>
                    <input type="text" value={newPlace.phone} onChange={e => setNewPlace({...newPlace, phone: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-blush/40 bg-cream/30 focus:outline-none focus:border-burgundy" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">Sito Web (Opzionale)</label>
                    <input type="url" value={newPlace.website_url} onChange={e => setNewPlace({...newPlace, website_url: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-blush/40 bg-cream/30 focus:outline-none focus:border-burgundy" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">Nota degli sposi (Opzionale)</label>
                  <textarea rows={2} value={newPlace.sposi_note} onChange={e => setNewPlace({...newPlace, sposi_note: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-blush/40 bg-cream/30 focus:outline-none focus:border-burgundy resize-none" />
                </div>
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input type="checkbox" checked={newPlace.is_primary} onChange={e => setNewPlace({...newPlace, is_primary: e.target.checked})} className="w-4 h-4 rounded border-blush text-burgundy focus:ring-burgundy" />
                  Luogo Principale (Cerimonia / Ricevimento)
                </label>

                <div className="pt-6 border-t border-blush/20">
                  <button type="submit" className="w-full py-3 rounded-full bg-burgundy hover:bg-burgundy-light text-paper font-semibold uppercase tracking-widest text-sm shadow-sm transition-all">Salva nel Database</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
