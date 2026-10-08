import React, { useState, useEffect } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { weddingApi } from '../../services/supabase';
import { Settings, Save, Plus, Trash2, Edit2 } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { settings, refreshSettings } = useSettings();
  const [formData, setFormData] = useState(JSON.stringify(settings, null, 2));
  const [saving, setSaving] = useState(false);
  
  const [faqs, setFaqs] = useState<any[]>([]);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '', category: 'info', sort_order: 10 });
  
  useEffect(() => {
    weddingApi.getFaqs().then(setFaqs);
    setFormData(JSON.stringify(settings, null, 2));
  }, [settings]);

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      const parsed = JSON.parse(formData);
      const success = await weddingApi.updateSettings(parsed);
      if (success) {
        alert('Impostazioni salvate con successo!');
        await refreshSettings();
      } else {
        alert('Errore nel salvataggio.');
      }
    } catch (e) {
      alert('Formato JSON non valido. Controlla la sintassi.');
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

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-paper p-6 rounded-3xl border border-blush/30 shadow-sm">
        <h2 className="text-xl font-serif font-bold text-burgundy mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" /> Impostazioni Globali (JSON)
        </h2>
        <p className="text-sm text-burgundy/70 mb-4">
          Modifica con attenzione i dati del matrimonio (Nomi, Date, IBAN, ecc). Usa il formato JSON.
        </p>
        <textarea
          value={formData}
          onChange={(e) => setFormData(e.target.value)}
          className="w-full h-96 font-mono text-xs p-4 rounded-xl border border-blush/40 bg-cream/50 outline-none focus:border-burgundy"
        />
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="px-6 py-2 bg-burgundy text-paper rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-burgundy-light transition-all"
          >
            <Save className="w-4 h-4" /> {saving ? 'Salvataggio...' : 'Salva Impostazioni'}
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
