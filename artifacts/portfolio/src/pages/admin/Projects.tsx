import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  getProjects, addProject, updateProject, deleteProject, type Project,
} from "@/lib/firestore";
import { Plus, Pencil, Trash2, Star, X, Check, FolderKanban } from "lucide-react";
import { toast } from "sonner";

const empty: Omit<Project, "id"> = {
  title: "", description: "", image: "", technologies: [], githubUrl: "", liveUrl: "", featured: false, order: 0,
};

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<Omit<Project, "id">>(empty);
  const [techInput, setTechInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    getProjects().then(setProjects).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(empty); setTechInput(""); setShowForm(true); };
  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({ title: p.title, description: p.description, image: p.image, technologies: p.technologies, githubUrl: p.githubUrl, liveUrl: p.liveUrl, featured: p.featured, order: p.order ?? 0 });
    setTechInput("");
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    try {
      if (editing?.id) {
        await updateProject(editing.id, form);
        toast.success("Project updated");
      } else {
        await addProject(form);
        toast.success("Project added");
      }
      setShowForm(false);
      load();
    } catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    setDeleting(id);
    try { await deleteProject(id); toast.success("Deleted"); load(); }
    catch { toast.error("Failed to delete"); }
    finally { setDeleting(null); }
  };

  const toggleFeatured = async (p: Project) => {
    if (!p.id) return;
    await updateProject(p.id, { featured: !p.featured });
    load();
  };

  const addTech = () => {
    const t = techInput.trim();
    if (t && !form.technologies.includes(t)) {
      setForm({ ...form, technologies: [...form.technologies, t] });
    }
    setTechInput("");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white font-bold text-2xl sm:text-3xl">Projects</h1>
          <p className="text-slate-400 mt-1">{projects.length} project{projects.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-500/20 text-sm"
          data-testid="btn-add-project"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1E293B] rounded-2xl border border-slate-700/50 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-700/50">
              <h2 className="text-white font-bold">{editing ? "Edit Project" : "New Project"}</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              {[
                { label: "Title *", key: "title", type: "text", placeholder: "Project name" },
                { label: "Image URL", key: "image", type: "url", placeholder: "https://..." },
                { label: "GitHub URL", key: "githubUrl", type: "url", placeholder: "https://github.com/..." },
                { label: "Live URL / APK", key: "liveUrl", type: "url", placeholder: "https://..." },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-slate-400 text-sm mb-1.5">{label}</label>
                  <input
                    type={type}
                    value={(form as Record<string, unknown>)[key] as string}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full px-3 py-2.5 bg-[#0F172A] border border-slate-700 focus:border-blue-500 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none"
                    data-testid={`input-project-${key}`}
                  />
                </div>
              ))}
              <div>
                <label className="block text-slate-400 text-sm mb-1.5">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#0F172A] border border-slate-700 focus:border-blue-500 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none resize-none"
                  placeholder="Project description..."
                  data-testid="input-project-description"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1.5">Technologies</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
                    placeholder="e.g. Flutter"
                    className="flex-1 px-3 py-2 bg-[#0F172A] border border-slate-700 focus:border-blue-500 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none"
                    data-testid="input-project-tech"
                  />
                  <button onClick={addTech} className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm transition-colors">Add</button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {form.technologies.map((t) => (
                    <span key={t} className="flex items-center gap-1 px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs rounded-lg">
                      {t}
                      <button onClick={() => setForm({ ...form, technologies: form.technologies.filter((x) => x !== t) })} className="hover:text-red-400"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setForm({ ...form, featured: !form.featured })}
                  className={`w-10 h-6 rounded-full transition-colors ${form.featured ? "bg-blue-600" : "bg-slate-600"} relative`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${form.featured ? "translate-x-5" : "translate-x-1"}`} />
                </div>
                <span className="text-slate-300 text-sm">Featured project</span>
              </label>
            </div>
            <div className="flex gap-3 p-5 border-t border-slate-700/50">
              <button onClick={() => setShowForm(false)} className="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2" data-testid="btn-save-project">
                {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Check className="w-4 h-4" /> Save</>}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {loading ? (
        <div className="grid sm:grid-cols-2 gap-4">{[1,2,3].map(i => <div key={i} className="h-40 bg-[#1E293B] rounded-2xl animate-pulse" />)}</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 text-slate-500"><FolderKanban className="w-12 h-12 mx-auto mb-4 opacity-30" /><p>No projects yet. Click "Add Project" to get started.</p></div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {projects.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="bg-[#1E293B] rounded-2xl border border-slate-700/50 overflow-hidden group" data-testid={`row-project-${p.id}`}>
              {p.image && <div className="h-32 overflow-hidden"><img src={p.image} alt={p.title} className="w-full h-full object-cover" /></div>}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-white font-semibold">{p.title}</h3>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => toggleFeatured(p)} className={`p-1.5 rounded-lg transition-colors ${p.featured ? "text-yellow-400 bg-yellow-400/10" : "text-slate-500 hover:text-yellow-400"}`} data-testid={`btn-featured-${p.id}`}>
                      <Star className="w-3.5 h-3.5" fill={p.featured ? "currentColor" : "none"} />
                    </button>
                    <button onClick={() => openEdit(p)} className="p-1.5 text-slate-500 hover:text-blue-400 rounded-lg transition-colors" data-testid={`btn-edit-project-${p.id}`}><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => p.id && handleDelete(p.id)} disabled={deleting === p.id} className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg transition-colors disabled:opacity-50" data-testid={`btn-delete-project-${p.id}`}>
                      {deleting === p.id ? <div className="w-3.5 h-3.5 border border-red-400/30 border-t-red-400 rounded-full animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <p className="text-slate-400 text-xs line-clamp-2 mb-3">{p.description}</p>
                <div className="flex flex-wrap gap-1">
                  {(p.technologies || []).slice(0, 3).map(t => <span key={t} className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs rounded-lg">{t}</span>)}
                  {(p.technologies || []).length > 3 && <span className="px-2 py-0.5 bg-slate-700 text-slate-400 text-xs rounded-lg">+{p.technologies.length - 3}</span>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
