const fs = require('fs');

let dashboardCode = fs.readFileSync('src/components/admin/AdminDashboard.tsx', 'utf8');

// Add Edit2 import
dashboardCode = dashboardCode.replace(
  /import \{ (.*?)Trash2(.*?) \} from 'lucide-react';/,
  `import { $1Trash2$2, Edit2 } from 'lucide-react';`
);

// Add editing states
dashboardCode = dashboardCode.replace(
  /const \[newFaq, setNewFaq\] = useState\(\{ question: '', answer: '', category: 'info', sort_order: 10 \}\);/,
  `const [newFaq, setNewFaq] = useState({ question: '', answer: '', category: 'info', sort_order: 10 });\n  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);\n  const [editFaqData, setEditFaqData] = useState<any>({});`
);

// Add handleUpdateFaq
const updateHandler = `
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
`;

dashboardCode = dashboardCode.replace(
  /const handleDeleteFaq = async/,
  `${updateHandler}\n  const handleDeleteFaq = async`
);

// Replace FAQ render logic
const oldFaqRender = /<div key=\{faq\.id\} className="flex justify-between items-center p-4 bg-paper border border-blush\/20 rounded-xl hover:bg-cream\/20 shadow-sm">[\s\S]*?<\/button>\n\s*<\/div>/g;

const newFaqRender = `<div key={faq.id} className="flex justify-between items-center p-4 bg-paper border border-blush/20 rounded-xl hover:bg-cream/20 shadow-sm">
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
                </div>`;

dashboardCode = dashboardCode.replace(oldFaqRender, newFaqRender);

fs.writeFileSync('src/components/admin/AdminDashboard.tsx', dashboardCode);

