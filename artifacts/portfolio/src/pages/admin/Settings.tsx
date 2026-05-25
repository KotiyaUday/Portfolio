import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  getSettings, updateSettings,
  type PortfolioSettings, DEFAULT_SETTINGS,
} from "@/lib/firestore";
import {
  Save, FileText, Github, Linkedin, Mail, ExternalLink,
  CheckCircle, AlertCircle, Loader2, User, GraduationCap,
  Brain, Sparkles, Target, MapPin,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminSettings() {
  const [form, setForm] = useState<PortfolioSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSettings()
      .then((s) => setForm(s))
      .finally(() => setLoading(false));
  }, []);

  const set = (key: keyof PortfolioSettings, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings(form);
      toast.success("Settings saved — all changes are now live on your portfolio.");
    } catch {
      toast.error("Could not save — make sure Firestore is set up in Firebase Console.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    );
  }

  const inputClass =
    "w-full px-4 py-3 bg-[#0F172A] border border-slate-700 focus:border-blue-500 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors text-sm";
  const taClass = `${inputClass} resize-none`;

  const Section = ({ icon: Icon, color, title, subtitle, children }: {
    icon: React.ElementType; color: string; title: string; subtitle: string; children: React.ReactNode;
  }) => (
    <div className="bg-[#1E293B] rounded-2xl p-6 border border-slate-700/50 mb-5">
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-white font-semibold">{title}</h2>
          <p className="text-slate-500 text-xs">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Portfolio Settings</h1>
          <p className="text-slate-400 text-sm mt-1">
            Edit anything here — changes go live on your portfolio instantly after saving.
          </p>
        </div>

        {/* ── Social / Contact ── */}
        <Section icon={Mail} color="bg-green-500/20 text-green-400" title="Contact & Social Links"
          subtitle="Used everywhere — Hero, About, Contact section, and the contact form.">
          <div className="space-y-4">
            {([
              { key: "email" as const, label: "Email Address", icon: Mail, type: "email", placeholder: "you@example.com", hint: "Contact form messages will be delivered here." },
              { key: "githubUrl" as const, label: "GitHub URL", icon: Github, type: "url", placeholder: "https://github.com/yourusername", hint: "" },
              { key: "linkedinUrl" as const, label: "LinkedIn URL", icon: Linkedin, type: "url", placeholder: "https://linkedin.com/in/yourprofile", hint: "" },
            ] as const).map(({ key, label, icon: Icon, type, placeholder, hint }) => (
              <div key={key}>
                <label className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                  <Icon className="w-3.5 h-3.5" />{label}
                </label>
                <input type={type} value={form[key]} onChange={(e) => set(key, e.target.value)}
                  placeholder={placeholder} className={inputClass} />
                {hint && <p className="text-slate-600 text-xs mt-1">{hint}</p>}
              </div>
            ))}
          </div>
        </Section>

        {/* ── Hero ── */}
        <Section icon={FileText} color="bg-blue-500/20 text-blue-400" title="Hero Section"
          subtitle="Resume link and the tagline shown below your name.">
          <div className="space-y-4">
            <div>
              <label className="block text-slate-400 text-sm mb-2">Resume / CV Download URL</label>
              <input type="url" value={form.resumeUrl} onChange={(e) => set("resumeUrl", e.target.value)}
                placeholder="https://drive.google.com/uc?export=download&id=..." className={inputClass} />
              <div className="mt-2 p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                <p className="text-blue-400 text-xs font-medium mb-1">Google Drive direct link:</p>
                <p className="text-slate-500 text-xs">
                  Share your PDF → "Anyone with link" → copy file ID → use{" "}
                  <code className="text-blue-300">https://drive.google.com/uc?export=download&id=FILE_ID</code>
                </p>
              </div>
              {form.resumeUrl ? (
                <a href={form.resumeUrl} target="_blank" rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 text-xs text-green-400 hover:text-green-300">
                  <CheckCircle className="w-3.5 h-3.5" /> Test link <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-amber-400">
                  <AlertCircle className="w-3.5 h-3.5" /> No URL — Download Resume button will be disabled.
                </p>
              )}
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-2">Hero Tagline</label>
              <textarea rows={3} value={form.heroTagline} onChange={(e) => set("heroTagline", e.target.value)}
                className={taClass} placeholder="Short bio shown below your name..." />
            </div>
          </div>
        </Section>

        {/* ── About — Who I Am ── */}
        <Section icon={User} color="bg-blue-500/20 text-blue-400" title="About — Who I Am"
          subtitle="The bio paragraph in the About section.">
          <textarea rows={4} value={form.bio} onChange={(e) => set("bio", e.target.value)}
            className={taClass} placeholder="Write a short bio about yourself..." />
        </Section>

        {/* ── About — Education ── */}
        <Section icon={GraduationCap} color="bg-purple-500/20 text-purple-400" title="About — Education"
          subtitle="Your degree, school, and the years you attended.">
          <div className="space-y-4">
            <div>
              <label className="block text-slate-400 text-sm mb-2">Degree / Program</label>
              <input value={form.educationDegree} onChange={(e) => set("educationDegree", e.target.value)}
                className={inputClass} placeholder="B.E. Computer Engineering" />
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-2">School / University</label>
              <input value={form.educationSchool} onChange={(e) => set("educationSchool", e.target.value)}
                className={inputClass} placeholder="Government Engineering College, Rajkot" />
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-2">Duration</label>
              <input value={form.educationDuration} onChange={(e) => set("educationDuration", e.target.value)}
                className={inputClass} placeholder="2022 – 2026" />
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-2">Description <span className="text-slate-600">(optional)</span></label>
              <textarea rows={2} value={form.educationDescription}
                onChange={(e) => set("educationDescription", e.target.value)}
                className={taClass} placeholder="Focused on software engineering and full-stack development..." />
            </div>
          </div>
        </Section>

        {/* ── About — Interests ── */}
        <Section icon={Brain} color="bg-green-500/20 text-green-400" title="About — Current Interests"
          subtitle="Comma-separated list of topics you're interested in.">
          <textarea rows={3} value={form.interests} onChange={(e) => set("interests", e.target.value)}
            className={taClass} placeholder="Flutter Development, Firebase, MERN Stack, Data Science, AI/ML" />
          <p className="text-slate-600 text-xs mt-2">Separate each interest with a comma.</p>
        </Section>

        {/* ── About — What Drives Me ── */}
        <Section icon={Sparkles} color="bg-yellow-500/20 text-yellow-400" title="About — What Drives Me"
          subtitle="The motivational paragraph shown in the gradient card.">
          <textarea rows={4} value={form.whatDrivesMe} onChange={(e) => set("whatDrivesMe", e.target.value)}
            className={taClass} placeholder="What motivates you as a developer?" />
        </Section>

        {/* ── About — Currently Focused On ── */}
        <Section icon={Target} color="bg-red-500/20 text-red-400" title="About — Currently Focused On"
          subtitle="Progress bars shown in the About section. One item per line.">
          <textarea rows={5} value={form.currentlyFocusedOn}
            onChange={(e) => set("currentlyFocusedOn", e.target.value)}
            className={taClass}
            placeholder={"Building Flutter apps: 88\nLearning MERN Stack: 75\nExploring AI/ML: 60"} />
          <p className="text-slate-600 text-xs mt-2">
            Format: <code className="text-blue-400 bg-blue-500/10 px-1 rounded">Label: percentage</code> — one per line. Percentage is 0–100.
          </p>
        </Section>

        {/* ── Contact Section ── */}
        <Section icon={MapPin} color="bg-emerald-500/20 text-emerald-400" title="Contact Section"
          subtitle="The availability blurb and your location shown in the Contact section.">
          <div className="space-y-4">
            <div>
              <label className="block text-slate-400 text-sm mb-2">Availability Text</label>
              <textarea rows={3} value={form.availabilityText}
                onChange={(e) => set("availabilityText", e.target.value)}
                className={taClass}
                placeholder="Currently open to freelance projects, internship opportunities..." />
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-2">Location</label>
              <input value={form.location} onChange={(e) => set("location", e.target.value)}
                className={inputClass} placeholder="Rajkot, Gujarat, India" />
            </div>
          </div>
        </Section>

        {/* ── Save ── */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed text-base"
          data-testid="btn-save-settings"
        >
          {saving ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
          ) : (
            <><Save className="w-4 h-4" /> Save All Settings</>
          )}
        </button>
        <p className="text-center text-slate-600 text-xs mt-3">Changes go live on your portfolio immediately after saving.</p>
      </motion.div>
    </div>
  );
}
