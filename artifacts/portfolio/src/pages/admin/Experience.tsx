import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getExperience, addExperience, updateExperience, deleteExperience, type Experience } from "@/lib/firestore";
import { Plus, Pencil, Trash2, X, Check, Briefcase } from "lucide-react";
import { toast } from "sonner";

const empty: Omit<Experience, "id"> = { role: "", company: "", duration: "", description: "", technologies: [], order: 0 };

export default function AdminExperience() {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [form, setForm] = useState<Omit<Experience, "id">>(empty);
  const [techInput, setTechInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = () => { setLoading(true); getExperience().then(setItems).catch(console.error).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(empty); setTechInput(""); setShowForm(true); };
  const openEdit = (e: Experience) => { setEditing(e); setForm({ role: e.role, company: e.company, duration: e.duration, description: e.description, technologies: e.technologies, order: e.order ?? 0 }); setTechInput(""); setShowForm(true); };

  const handleSave = async () => {
    if (!form.role.trim()) { toast.error("Role is required"); return; }
    setSaving(true);
    try {
      if (editing?.id) { await updateExperience(editing.id, form); toast.success("Updated"); }
      else { await addExperience(form); toast.success("Added"); }
      setShowForm(false); load();
    } catch { toast.error("Failed"); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    setDeleting(id);
    try { await deleteExperience(id); toast.success("Deleted"); load(); }
    catch { toast.error("Failed"); } finally { setDeleting(null); }
  };

  const addTech = () => {
    const t = techInput.trim();
    if (t && !form.technologies.includes(t)) setForm({ ...form, technologies: [...form.technologies, t] });
    setTechInput("");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white font-bold text-2xl sm:text-3xl">Experience</h1>
          <p className="text-slate-400 mt-1">{items.length} entr{items.length !== 1 ? "ies" : "y"}</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium rounded-xl transition-all text-sm" data-testid="btn-add-experience">
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1E293B] rounded-2xl border border-slate-700/50 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-700/50">
              <h2 className="text-white font-bold">{editing ? "Edit Experience" : "New Experience"}</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              {[
                { label: "Role *", key: "role", placeholder: "Flutter Developer Intern" },
                { label: "Company", key: "company", placeholder: "Company name" },
                { label: "Duration", key: "duration", placeholder: "Jan 2024 – Mar 2024" },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-slate-400 text-sm mb-1.5">{label}</label>
                  <input type="text" value={(form as Record<string, unknown>)[key] as string} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} className="w-full px-3 py-2.5 bg-[#0F172A] border border-slate-700 focus:border-blue-500 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none" data-testid={`input-exp-${key}`} />
                </div>
              ))}
              <div>
                <label className="block text-slate-400 text-sm mb-1.5">Description</label>
                <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2.5 bg-[#0F172A] border border-slate-700 focus:border-blue-500 rounded-xl text-white text-sm focus:outline-none resize-none" placeholder="Describe your role..." data-testid="input-exp-description" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1.5">Technologies</label>
                <div className="flex gap-2 mb-2">
                  <input type="text" value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())} placeholder="e.g. Flutter" className="flex-1 px-3 py-2 bg-[#0F172A] border border-slate-700 focus:border-blue-500 rounded-xl text-white text-sm focus:outline-none" />
                  <button onClick={addTech} className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm transition-colors">Add</button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {form.technologies.map((t) => (
                    <span key={t} className="flex items-center gap-1 px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs rounded-lg">
                      {t}<button onClick={() => setForm({ ...form, technologies: form.technologies.filter((x) => x !== t) })}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t border-slate-700/50">
              <button onClick={() => setShowForm(false)} className="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2" data-testid="btn-save-experience">
                {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Check className="w-4 h-4" /> Save</>}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">{[1,2].map(i => <div key={i} className="h-32 bg-[#1E293B] rounded-2xl animate-pulse" />)}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-slate-500"><Briefcase className="w-12 h-12 mx-auto mb-4 opacity-30" /><p>No experience entries yet.</p></div>
      ) : (
        <div className="space-y-4">
          {items.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="bg-[#1E293B] rounded-2xl p-5 border border-slate-700/50" data-testid={`row-experience-${item.id}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-white font-bold">{item.role}</h3>
                    {item.company && <span className="text-blue-400 text-sm">@ {item.company}</span>}
                  </div>
                  {item.duration && <p className="text-slate-500 text-xs mb-2">{item.duration}</p>}
                  <p className="text-slate-400 text-sm">{item.description}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {(item.technologies || []).map(t => <span key={t} className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs rounded-lg">{t}</span>)}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(item)} className="p-1.5 text-slate-500 hover:text-blue-400 rounded-lg transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => item.id && handleDelete(item.id)} disabled={deleting === item.id} className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg transition-colors">
                    {deleting === item.id ? <div className="w-3.5 h-3.5 border border-red-400/30 border-t-red-400 rounded-full animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
