const fs = require('fs');

// 1. Remove FAQ from AdminSettings.tsx
let adminSettingsCode = fs.readFileSync('src/components/admin/AdminSettings.tsx', 'utf8');

// remove states
adminSettingsCode = adminSettingsCode.replace(
  /const \[faqs, setFaqs\] = useState<any\[\]>\(\[\]\);\n\s*const \[newFaq, setNewFaq\] = useState\(\{ question: '', answer: '', category: 'info', sort_order: 10 \}\);/,
  ''
);

// remove getFaqs
adminSettingsCode = adminSettingsCode.replace(
  /weddingApi\.getFaqs\(\)\.then\(setFaqs\);\n\s*/,
  ''
);

// remove handlers
adminSettingsCode = adminSettingsCode.replace(
  /const handleAddFaq = async \([\s\S]*?const handleDeleteFaq = async \([^}]+\} catch[^}]+\}[^}]+\};\n?/g,
  ''
);
// just in case regex failed, we manually remove handleAddFaq and handleDeleteFaq:
adminSettingsCode = adminSettingsCode.replace(/const handleAddFaq = async \([\s\S]*?\} ?\};\n/g, '');
adminSettingsCode = adminSettingsCode.replace(/const handleDeleteFaq = async \([\s\S]*?\} ?\};\n/g, '');

// remove UI block
adminSettingsCode = adminSettingsCode.replace(
  /<div className="bg-paper p-6 rounded-3xl border border-blush\/30 shadow-sm">\s*<h2 className="text-xl font-serif font-bold text-burgundy mb-4">Gestione FAQ<\/h2>[\s\S]*?<\/div>\n\s*<\/div>/,
  '</div>'
);
fs.writeFileSync('src/components/admin/AdminSettings.tsx', adminSettingsCode);


// 2. Add to AdminDashboard.tsx
let dashboardCode = fs.readFileSync('src/components/admin/AdminDashboard.tsx', 'utf8');

// Add MessageCircle import
dashboardCode = dashboardCode.replace(
  /import \{ (.*?) \} from 'lucide-react';/,
  `import { $1, MessageCircle, HelpCircle } from 'lucide-react';`
);

// Add activeTab type
dashboardCode = dashboardCode.replace(
  /useState<'guests' \| 'gifts' \| 'add' \| 'places' \| 'settings'>/,
  `useState<'guests' | 'gifts' | 'add' | 'places' | 'settings' | 'faq'>`
);

// Add states
dashboardCode = dashboardCode.replace(
  /const \[guests, setGuests\] = useState<any\[\]>\(\[\]\);/,
  `const [guests, setGuests] = useState<any[]>([]);\n  const [faqs, setFaqs] = useState<any[]>([]);\n  const [newFaq, setNewFaq] = useState({ question: '', answer: '', category: 'info', sort_order: 10 });`
);

// Add API fetch
dashboardCode = dashboardCode.replace(
  /weddingApi\.getGifts\(\)\.then\(setGifts\);/,
  `weddingApi.getGifts().then(setGifts);\n      weddingApi.getFaqs().then(setFaqs);`
);

// Add Handlers
const handlers = `
  const handleAddFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await weddingApi.createFaq(newFaq);
    if (success) {
      setNewFaq({ question: '', answer: '', category: 'info', sort_order: 10 });
      weddingApi.getFaqs().then(setFaqs);
      alert('FAQ aggiunta!');
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!window.confirm('Eliminare questa FAQ?')) return;
    const success = await weddingApi.deleteFaq(id);
    if (success) weddingApi.getFaqs().then(setFaqs);
  };
`;
dashboardCode = dashboardCode.replace(
  /const handleSavePlace = async/,
  `${handlers}\n  const handleSavePlace = async`
);

// Add FAQ Tab button
const faqBtn = `<button onClick={() => setActiveTab('faq')} className={\`px-4 py-2 rounded-full text-sm font-semibold transition-all \${activeTab === 'faq' ? 'bg-burgundy text-paper' : 'bg-paper text-burgundy border border-blush/40 hover:border-burgundy'}\`}>
            <HelpCircle className="w-4 h-4 inline-block mr-2" /> FAQ
          </button>`;
dashboardCode = dashboardCode.replace(
  /<button onClick=\{\(\) => setActiveTab\('settings'\)\}/,
  `${faqBtn}\n          <button onClick={() => setActiveTab('settings')}`
);


// Add FAQ List UI in faq tab
const faqListUI = `
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
                  <div>
                    <p className="font-semibold text-burgundy text-sm">{faq.question}</p>
                    <p className="text-xs text-burgundy/70 mt-1">{faq.answer}</p>
                    <span className="inline-block mt-2 text-[10px] uppercase font-bold tracking-widest text-blush bg-blush-soft px-2 py-0.5 rounded-full">{faq.category}</span>
                  </div>
                  <button onClick={() => handleDeleteFaq(faq.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-full transition-all shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {faqs.length === 0 && <p className="text-center text-sm opacity-60 py-8">Nessuna FAQ presente.</p>}
            </div>
          </div>
        )}
`;

dashboardCode = dashboardCode.replace(
  /\{activeTab === 'settings' && <AdminSettings \/>\}/,
  `{activeTab === 'settings' && <AdminSettings />}\n${faqListUI}`
);

// Add Add FAQ Form to the add tab
const faqFormUI = `
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
`;

dashboardCode = dashboardCode.replace(
  /\{activeTab === 'add' && \([\s\S]*?Aggiungi Famiglia \*\/\}[\s\S]*?<div className="bg-paper p-6 sm:p-10 rounded-3xl border border-blush\/30 shadow-sm">/,
  match => match.replace(
    /\{activeTab === 'add' && \([\s\S]*?Aggiungi Famiglia \*\/\}/,
    `{activeTab === 'add' && (\n          <div className="space-y-8 animate-fade-in max-w-2xl mx-auto">\n${faqFormUI}\n            {/* Aggiungi Famiglia */}`
  )
);

fs.writeFileSync('src/components/admin/AdminDashboard.tsx', dashboardCode);

