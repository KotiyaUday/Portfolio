import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getCertifications, addCertification, updateCertification, deleteCertification, type Certification } from "@/lib/firestore";
import { Plus, Pencil, Trash2, X, Check, Award } from "lucide-react";
import { toast } from "sonner";

const empty: Omit<Certification, "id"> = { title: "", issuer: "", date: "", credentialUrl: "", order: 0 };

export default function AdminCertifications() {
  const [items, setItems] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Certification | null>(null);
  const [form, setForm] = useState<Omit<Certification, "id">>(empty);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = () => { setLoading(true); getCertifications().then(setItems).catch(console.error).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(empty); setShowForm(true); };
  const openEdit = (c: Certification) => { setEditing(c); setForm({ title: c.title, issuer: c.issuer, date: c.date, credentialUrl: c.credentialUrl, order: c.order ?? 0 }); setShowForm(true); };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    try {
      if (editing?.id) { await updateCertification(editing.id, form); toast.success("Updated"); }
      else { await addCertification(form); toast.success("Added"); }
      setShowForm(false); load();
    } catch { toast.error("Failed"); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    setDeleting(id);
    try { await deleteCertification(id); toast.success("Deleted"); load(); }
    catch { toast.error("Failed"); } finally { setDeleting(null); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white font-bold text-2xl sm:text-3xl">Certifications</h1>
          <p className="text-slate-400 mt-1">{items.length} certification{items.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium rounded-xl transition-all text-sm" data-testid="btn-add-cert">
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1E293B] rounded-2xl border border-slate-700/50 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-700/50">
              <h2 className="text-white font-bold">{editing ? "Edit Certification" : "New Certification"}</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              {[
                { label: "Title *", key: "title", placeholder: "AWS Certified Developer" },
                { label: "Issuer", key: "issuer", placeholder: "Amazon Web Services" },
                { label: "Date", key: "date", placeholder: "2024" },
                { label: "Credential URL", key: "credentialUrl", placeholder: "https://..." },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-slate-400 text-sm mb-1.5">{label}</label>
                  <input type="text" value={(form as Record<string, unknown>)[key] as string ?? ""} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} className="w-full px-3 py-2.5 bg-[#0F172A] border border-slate-700 focus:border-blue-500 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none" data-testid={`input-cert-${key}`} />
                </div>
              ))}
            </div>
            <div className="flex gap-3 p-5 border-t border-slate-700/50">
              <button onClick={() => setShowForm(false)} className="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2" data-testid="btn-save-cert">
                {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Check className="w-4 h-4" /> Save</>}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {loading ? (
        <div className="grid sm:grid-cols-2 gap-4">{[1,2].map(i => <div key={i} className="h-28 bg-[#1E293B] rounded-2xl animate-pulse" />)}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-slate-500"><Award className="w-12 h-12 mx-auto mb-4 opacity-30" /><p>No certifications yet.</p></div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map((cert, i) => (
            <motion.div key={cert.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="bg-[#1E293B] rounded-2xl p-5 border border-slate-700/50" data-testid={`row-cert-${cert.id}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="w-10 h-10 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-center justify-center mb-3">
                    <Award className="w-5 h-5 text-yellow-400" />
                  </div>
                  <h3 className="text-white font-semibold text-sm leading-snug mb-1">{cert.title}</h3>
                  <p className="text-blue-400 text-xs mb-1">{cert.issuer}</p>
                  <p className="text-slate-500 text-xs">{cert.date}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(cert)} className="p-1.5 text-slate-500 hover:text-blue-400 rounded-lg transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => cert.id && handleDelete(cert.id)} disabled={deleting === cert.id} className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg transition-colors">
                    {deleting === cert.id ? <div className="w-3.5 h-3.5 border border-red-400/30 border-t-red-400 rounded-full animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
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
