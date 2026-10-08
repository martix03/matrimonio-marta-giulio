import React, { useState, useEffect } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { weddingApi } from '../../services/supabase';
import { Settings, Save, Plus, Trash2, Users, Calendar, MapPin, CreditCard } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { settings, refreshSettings } = useSettings();
  const [formData, setFormData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  
  const [faqs, setFaqs] = useState<any[]>([]);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '', category: 'info', sort_order: 10 });
  
  useEffect(() => {
    weddingApi.getFaqs().then(setFaqs);
    if (settings) {
      setFormData(JSON.parse(JSON.stringify(settings)));
    }
  }, [settings]);

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      const success = await weddingApi.updateSettings(formData);
      if (success) {
        alert('Impostazioni salvate con successo!');
        await refreshSettings();
      } else {
        alert('Errore nel salvataggio.');
      }
    } catch (e) {
      alert('Errore imprevisto.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await weddingApi.createFaq(newFaq);
    if (success) {
      setNewFaq({ question: '', answer: '', category: 'info', sort_order: 10 });
      weddingApi.getFaqs().then(setFaqs);
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!window.confirm('Eliminare questa FAQ?')) return;
    const success = await weddingApi.deleteFaq(id);
    if (success) weddingApi.getFaqs().then(setFaqs);
  };

  if (!formData) return <div>Caricamento...</div>;

  const handleChange = (section: string, field: string, value: string, subsection?: string) => {
    setFormData((prev: any) => {
      const newData = { ...prev };
      if (subsection) {
        if (!newData[section][subsection]) newData[section][subsection] = {};
        newData[section][subsection][field] = value;
      } else {
        if (!newData[section]) newData[section] = {};
        newData[section][field] = value;
      }
      return newData;
    });
  };

  const InputField = ({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) => (
    <div className="mb-3">
      <label className="block text-[10px] font-bold text-burgundy/60 uppercase tracking-wider mb-1">{label}</label>
      <input 
        type="text" 
        value={value || ''} 
        onChange={(e) => onChange(e.target.value)} 
        className="w-full p-2.5 rounded-xl border border-blush/40 text-sm bg-cream/50 outline-none focus:border-burgundy focus:bg-paper transition-colors"
      />
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-paper p-6 rounded-3xl border border-blush/30 shadow-sm">
        <h2 className="text-xl font-serif font-bold text-burgundy mb-6 flex items-center gap-2">
          <Settings className="w-5 h-5" /> Impostazioni Globali
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
          
          {/* Gli Sposi */}
          <div className="space-y-4">
            <h3 className="font-semibold text-burgundy flex items-center gap-2 border-b border-blush/30 pb-2">
              <Users className="w-4 h-4 text-blush" /> Gli Sposi
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Sposa" value={formData?.couple?.bride} onChange={(v) => handleChange('couple', 'bride', v)} />
              <InputField label="Sposo" value={formData?.couple?.groom} onChange={(v) => handleChange('couple', 'groom', v)} />
            </div>
            <InputField label="Nome Completo" value={formData?.couple?.fullName} onChange={(v) => handleChange('couple', 'fullName', v)} />
            <InputField label="Hashtag" value={formData?.couple?.hashtag} onChange={(v) => handleChange('couple', 'hashtag', v)} />
          </div>

          {/* Dettagli Evento */}
          <div className="space-y-4">
            <h3 className="font-semibold text-burgundy flex items-center gap-2 border-b border-blush/30 pb-2">
              <Calendar className="w-4 h-4 text-blush" /> Date & Orari
            </h3>
            <InputField label="Data Mostrata (es. Sabato 29 Maggio 2027)" value={formData?.event?.displayDate} onChange={(v) => handleChange('event', 'displayDate', v)} />
            <InputField label="Città" value={formData?.event?.city} onChange={(v) => handleChange('event', 'city', v)} />
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Info Cerimonia (es. ore 16:45)" value={formData?.event?.ceremonyTime} onChange={(v) => handleChange('event', 'ceremonyTime', v)} />
              <InputField label="Info Ricevimento" value={formData?.event?.receptionTime} onChange={(v) => handleChange('event', 'receptionTime', v)} />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="font-semibold text-burgundy flex items-center gap-2 border-b border-blush/30 pb-2">
              <MapPin className="w-4 h-4 text-blush" /> Location
            </h3>
            <div className="space-y-3">
              <div className="text-xs font-bold text-burgundy">Sede Cerimonia</div>
              <InputField label="Nome" value={formData?.locations?.ceremony?.name} onChange={(v) => handleChange('locations', 'name', v, 'ceremony')} />
              <InputField label="Indirizzo" value={formData?.locations?.ceremony?.address} onChange={(v) => handleChange('locations', 'address', v, 'ceremony')} />
              <InputField label="URL Google Maps" value={formData?.locations?.ceremony?.googleMapsUrl} onChange={(v) => handleChange('locations', 'googleMapsUrl', v, 'ceremony')} />
            </div>
            <div className="space-y-3 mt-4">
              <div className="text-xs font-bold text-burgundy">Sede Ricevimento</div>
              <InputField label="Nome" value={formData?.locations?.reception?.name} onChange={(v) => handleChange('locations', 'name', v, 'reception')} />
              <InputField label="Indirizzo" value={formData?.locations?.reception?.address} onChange={(v) => handleChange('locations', 'address', v, 'reception')} />
              <InputField label="URL Google Maps" value={formData?.locations?.reception?.googleMapsUrl} onChange={(v) => handleChange('locations', 'googleMapsUrl', v, 'reception')} />
            </div>
          </div>

          {/* Iban / Lista Nozze */}
          <div className="space-y-4">
            <h3 className="font-semibold text-burgundy flex items-center gap-2 border-b border-blush/30 pb-2">
              <CreditCard className="w-4 h-4 text-blush" /> Lista Nozze & IBAN
            </h3>
            <InputField label="Intestatario IBAN" value={formData?.registry?.holder} onChange={(v) => handleChange('registry', 'holder', v)} />
            <InputField label="IBAN" value={formData?.registry?.iban} onChange={(v) => handleChange('registry', 'iban', v)} />
            <InputField label="Nome Banca" value={formData?.registry?.bank} onChange={(v) => handleChange('registry', 'bank', v)} />
          </div>

        </div>

        <div className="mt-8 flex justify-end border-t border-blush/20 pt-6">
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="px-8 py-3 bg-burgundy text-paper rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-burgundy-light transition-all shadow-sm hover:shadow"
          >
            <Save className="w-4 h-4" /> {saving ? 'Salvataggio in corso...' : 'Salva Impostazioni'}
          </button>
        </div>
      </div>

      <div className="bg-paper p-6 rounded-3xl border border-blush/30 shadow-sm">
        <h2 className="text-xl font-serif font-bold text-burgundy mb-4">Gestione FAQ</h2>
        
        <form onSubmit={handleAddFaq} className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end bg-cream/30 p-4 rounded-2xl border border-blush/20">
          <div>
            <label className="block text-xs font-semibold text-burgundy/80 uppercase tracking-wider mb-1">Domanda</label>
            <input required type="text" value={newFaq.question} onChange={e=>setNewFaq({...newFaq, question: e.target.value})} className="w-full p-2.5 rounded-xl border border-blush/40 text-sm bg-paper outline-none focus:border-burgundy" />
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-xs font-semibold text-burgundy/80 uppercase tracking-wider mb-1">Risposta</label>
            <input required type="text" value={newFaq.answer} onChange={e=>setNewFaq({...newFaq, answer: e.target.value})} className="w-full p-2.5 rounded-xl border border-blush/40 text-sm bg-paper outline-none focus:border-burgundy" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-burgundy/80 uppercase tracking-wider mb-1">Categoria</label>
            <select value={newFaq.category} onChange={e=>setNewFaq({...newFaq, category: e.target.value})} className="w-full p-2.5 rounded-xl border border-blush/40 text-sm bg-paper outline-none focus:border-burgundy">
              <option value="info">Info Utili</option>
              <option value="locations">Location</option>
              <option value="gifts">Regali</option>
            </select>
          </div>
          <button type="submit" className="w-full py-2.5 bg-burgundy text-paper rounded-xl text-sm font-semibold flex justify-center items-center gap-2 hover:bg-burgundy-light transition-all">
            <Plus className="w-4 h-4" /> Aggiungi
          </button>
        </form>

        <div className="space-y-3">
          {faqs.map(faq => (
            <div key={faq.id} className="flex justify-between items-center p-4 border border-blush/20 rounded-xl hover:bg-cream/20">
              <div>
                <p className="font-semibold text-burgundy text-sm">{faq.question}</p>
                <p className="text-xs text-burgundy/70 mt-1 line-clamp-1">{faq.answer}</p>
                <span className="inline-block mt-2 text-[10px] uppercase font-bold tracking-widest text-blush bg-blush-soft px-2 py-0.5 rounded-full">{faq.category}</span>
              </div>
              <button onClick={() => handleDeleteFaq(faq.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-full transition-all shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
