import React, { useState, useEffect } from 'react';
import { Users, Gift, MapPin, Search, Music, AlertTriangle, LogOut, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { weddingApi } from '../../services/supabase';
import { Cluster } from '../../types';

interface AdminDashboardProps {
  cluster: Cluster;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'guests' | 'gifts' | 'add_guest' | 'places'>('guests');
  const [guests, setGuests] = useState<any[]>([]);
  const [gifts, setGifts] = useState<any[]>([]);
  const [places, setPlaces] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [foodCategories, setFoodCategories] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFamily, setFilterFamily] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [newFamilyName, setNewFamilyName] = useState('');
  const [newGuests, setNewGuests] = useState<{ firstName: string, lastName: string, isChild: boolean }[]>([{ firstName: '', lastName: '', isChild: false }]);

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
    // Search filter
    const s = searchQuery.toLowerCase();
    const nameMatch = `${g.first_name} ${g.last_name}`.toLowerCase().includes(s);
    const familyMatch = g.clusters?.family_name?.toLowerCase().includes(s);
    if (!nameMatch && !familyMatch) return false;

    // Family filter
    if (filterFamily !== 'all' && g.clusters?.family_name !== filterFamily) return false;

    // Status filter
    if (filterStatus === 'confirmed' && g.is_attending !== true) return false;
    if (filterStatus === 'declined' && g.is_attending !== false) return false;
    if (filterStatus === 'pending' && g.is_attending !== null) return false;

    return true;
  });

  const uniqueFamilies = Array.from(new Set(guests.map(g => g.clusters?.family_name).filter(Boolean))).sort();

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
          <button onClick={() => setActiveTab('gifts')} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === 'gifts' ? 'bg-burgundy text-paper' : 'bg-paper text-burgundy border border-blush/40 hover:border-burgundy'}`}>
            <Gift className="w-4 h-4 inline-block mr-2" /> Messaggi Regali
          </button>
          <button onClick={() => setActiveTab('add_guest')} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === 'add_guest' ? 'bg-burgundy text-paper' : 'bg-paper text-burgundy border border-blush/40 hover:border-burgundy'}`}>
            + Aggiungi Ospiti
          </button>
          <button onClick={() => setActiveTab('places')} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === 'places' ? 'bg-burgundy text-paper' : 'bg-paper text-burgundy border border-blush/40 hover:border-burgundy'}`}>
            <MapPin className="w-4 h-4 inline-block mr-2" /> Gestione Luoghi
          </button>
        </div>

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
                  <select value={filterFamily} onChange={e => setFilterFamily(e.target.value)} className="px-3 py-2 rounded-full text-xs border border-blush/40 bg-paper focus:outline-none focus:border-burgundy transition-colors appearance-none">
                    <option value="all">Tutte le Famiglie</option>
                    {uniqueFamilies.map((fam: any) => (
                      <option key={fam} value={fam}>{fam}</option>
                    ))}
                  </select>
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
                      <th className="p-4 font-semibold">Famiglia</th>
                      <th className="p-4 font-semibold text-center">Stato</th>
                      <th className="p-4 font-semibold">Intolleranze</th>
                      <th className="p-4 font-semibold">Canzoni</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blush/20">
                    {filteredGuests.map(g => (
                      <tr key={g.id} className="hover:bg-cream/30 transition-colors">
                        <td className="p-4 font-medium">{g.first_name} {g.last_name}</td>
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
                              <span className="truncate max-w-[200px]" title={g.dietary_notes}>{g.dietary_notes}</span>
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          {g.song_request && (
                            <div className="flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100 inline-flex">
                              <Music className="w-3.5 h-3.5" />
                              <span className="truncate max-w-[200px]" title={g.song_request}>{g.song_request}</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                    {filteredGuests.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center opacity-60">Nessun ospite trovato.</td>
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

        {activeTab === 'add_guest' && (
          <div className="bg-paper p-6 sm:p-10 rounded-3xl border border-blush/30 shadow-sm animate-fade-in max-w-2xl mx-auto">
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
        )}

        {activeTab === 'places' && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-paper rounded-3xl border border-blush/30 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-blush/20 bg-cream/50">
                <h3 className="font-serif text-xl font-medium">Lista Luoghi Mappa</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-cream/50 text-xs uppercase tracking-wider opacity-70">
                    <tr>
                      <th className="p-4 font-semibold">Nome</th>
                      <th className="p-4 font-semibold">Categoria</th>
                      <th className="p-4 font-semibold">Indirizzo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blush/20">
                    {places.map(p => (
                      <tr key={p.id} className="hover:bg-cream/30 transition-colors">
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
                      </tr>
                    ))}
                    {places.length === 0 && (
                      <tr>
                        <td colSpan={3} className="p-8 text-center opacity-60">Nessun luogo trovato.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-paper p-6 sm:p-10 rounded-3xl border border-blush/30 shadow-sm max-w-2xl mx-auto">
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
