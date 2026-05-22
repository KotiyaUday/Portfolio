import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getSkills, addSkill, updateSkill, deleteSkill, type Skill } from "@/lib/firestore";
import { Plus, Pencil, Trash2, X, Check, Wrench } from "lucide-react";
import { toast } from "sonner";

const empty: Omit<Skill, "id"> = { name: "", category: "Programming Languages", icon: "", proficiency: 80, order: 0 };

const categories = [
  "Programming Languages", "Flutter Development", "Web Development", "Database", "Tools", "AI/ML",
];

export default function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [form, setForm] = useState<Omit<Skill, "id">>(empty);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = () => { setLoading(true); getSkills().then(setSkills).catch(console.error).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(empty); setShowForm(true); };
  const openEdit = (s: Skill) => { setEditing(s); setForm({ name: s.name, category: s.category, icon: s.icon, proficiency: s.proficiency, order: s.order ?? 0 }); setShowForm(true); };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    try {
      if (editing?.id) { await updateSkill(editing.id, form); toast.success("Skill updated"); }
      else { await addSkill(form); toast.success("Skill added"); }
      setShowForm(false); load();
    } catch { toast.error("Failed to save"); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this skill?")) return;
    setDeleting(id);
    try { await deleteSkill(id); toast.success("Deleted"); load(); }
    catch { toast.error("Failed to delete"); } finally { setDeleting(null); }
  };

  const grouped = categories.reduce<Record<string, Skill[]>>((acc, cat) => {
    acc[cat] = skills.filter((s) => s.category === cat);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white font-bold text-2xl sm:text-3xl">Skills</h1>
          <p className="text-slate-400 mt-1">{skills.length} skill{skills.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-500/20 text-sm" data-testid="btn-add-skill">
          <Plus className="w-4 h-4" /> Add Skill
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1E293B] rounded-2xl border border-slate-700/50 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-700/50">
              <h2 className="text-white font-bold">{editing ? "Edit Skill" : "New Skill"}</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-slate-400 text-sm mb-1.5">Skill Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Flutter" className="w-full px-3 py-2.5 bg-[#0F172A] border border-slate-700 focus:border-blue-500 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none" data-testid="input-skill-name" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1.5">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2.5 bg-[#0F172A] border border-slate-700 focus:border-blue-500 rounded-xl text-white text-sm focus:outline-none" data-testid="select-skill-category">
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1.5">Icon Name (react-icons/si)</label>
                <input type="text" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="e.g. SiFlutter" className="w-full px-3 py-2.5 bg-[#0F172A] border border-slate-700 focus:border-blue-500 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none" data-testid="input-skill-icon" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1.5">Proficiency: {form.proficiency}%</label>
                <input type="range" min={0} max={100} value={form.proficiency} onChange={(e) => setForm({ ...form, proficiency: Number(e.target.value) })} className="w-full accent-blue-500" data-testid="range-skill-proficiency" />
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t border-slate-700/50">
              <button onClick={() => setShowForm(false)} className="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2" data-testid="btn-save-skill">
                {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Check className="w-4 h-4" /> Save</>}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-20 bg-[#1E293B] rounded-2xl animate-pulse" />)}</div>
      ) : skills.length === 0 ? (
        <div className="text-center py-20 text-slate-500"><Wrench className="w-12 h-12 mx-auto mb-4 opacity-30" /><p>No skills yet.</p></div>
      ) : (
        <div className="space-y-8">
          {categories.filter(cat => grouped[cat]?.length > 0).map((cat) => (
            <div key={cat}>
              <h3 className="text-slate-400 text-sm font-medium mb-3 uppercase tracking-wider">{cat}</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {grouped[cat].map((skill, i) => (
                  <motion.div key={skill.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="bg-[#1E293B] rounded-xl p-4 border border-slate-700/50 flex items-center justify-between gap-3" data-testid={`row-skill-${skill.id}`}>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm">{skill.name}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: `${skill.proficiency}%` }} />
                        </div>
                        <span className="text-slate-500 text-xs">{skill.proficiency}%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => openEdit(skill)} className="p-1.5 text-slate-500 hover:text-blue-400 rounded-lg transition-colors" data-testid={`btn-edit-skill-${skill.id}`}><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => skill.id && handleDelete(skill.id)} disabled={deleting === skill.id} className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg transition-colors" data-testid={`btn-delete-skill-${skill.id}`}>
                        {deleting === skill.id ? <div className="w-3.5 h-3.5 border border-red-400/30 border-t-red-400 rounded-full animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
