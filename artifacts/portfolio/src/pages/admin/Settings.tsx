import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getSettings, updateSettings, type PortfolioSettings } from "@/lib/firestore";
import { Save, FileText, Github, Linkedin, Mail, ExternalLink, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

const defaultSettings: PortfolioSettings = {
  resumeUrl: "",
  githubUrl: "https://github.com/udaykotiya",
  linkedinUrl: "https://linkedin.com/in/udaykotiya",
  email: "udaykotiya@gmail.com",
  heroTagline: "Computer Engineering student passionate about Flutter development, web technologies, and AI/ML.",
};

export default function AdminSettings() {
  const [form, setForm] = useState<PortfolioSettings>(defaultSettings);
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
      toast.success("Settings saved! Changes are now live on your portfolio.");
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

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Portfolio Settings</h1>
          <p className="text-slate-400 text-sm mt-1">
            Configure your resume link, social profiles, and hero tagline.
          </p>
        </div>

        {/* Resume Section */}
        <div className="bg-[#1E293B] rounded-2xl p-6 border border-slate-700/50 mb-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold">Resume / CV</h2>
              <p className="text-slate-500 text-xs">Paste a public download link — Google Drive, Dropbox, etc.</p>
            </div>
          </div>

          <label className="block text-slate-400 text-sm mb-2">Direct Download URL</label>
          <input
            type="url"
            value={form.resumeUrl}
            onChange={(e) => set("resumeUrl", e.target.value)}
            placeholder="https://drive.google.com/uc?export=download&id=..."
            className="w-full px-4 py-3 bg-[#0F172A] border border-slate-700 focus:border-blue-500 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
          />

          <div className="mt-3 p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl">
            <p className="text-blue-400 text-xs font-medium mb-1">How to get a Google Drive direct download link:</p>
            <ol className="text-slate-400 text-xs space-y-0.5 list-decimal list-inside">
              <li>Upload your PDF to Google Drive</li>
              <li>Right-click → Share → Change to "Anyone with the link"</li>
              <li>Copy the file ID from the share URL (the long string after /d/)</li>
              <li>Use: <code className="text-blue-300 bg-blue-500/10 px-1 rounded">https://drive.google.com/uc?export=download&id=YOUR_FILE_ID</code></li>
            </ol>
          </div>

          {form.resumeUrl && (
            <a
              href={form.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-xs text-green-400 hover:text-green-300 transition-colors"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Test link
              <ExternalLink className="w-3 h-3" />
            </a>
          )}

          {!form.resumeUrl && (
            <p className="mt-3 flex items-center gap-1.5 text-xs text-amber-400">
              <AlertCircle className="w-3.5 h-3.5" />
              No resume URL set — the download button will be disabled on your portfolio.
            </p>
          )}
        </div>

        {/* Social Links */}
        <div className="bg-[#1E293B] rounded-2xl p-6 border border-slate-700/50 mb-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Github className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold">Social Links</h2>
              <p className="text-slate-500 text-xs">Shown in the Hero and Footer sections.</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { key: "githubUrl" as const, label: "GitHub URL", icon: Github, placeholder: "https://github.com/yourusername", color: "text-slate-300" },
              { key: "linkedinUrl" as const, label: "LinkedIn URL", icon: Linkedin, placeholder: "https://linkedin.com/in/yourprofile", color: "text-blue-400" },
              { key: "email" as const, label: "Email Address", icon: Mail, placeholder: "you@example.com", color: "text-green-400" },
            ].map(({ key, label, icon: Icon, placeholder, color }) => (
              <div key={key}>
                <label className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                  <Icon className={`w-3.5 h-3.5 ${color}`} />
                  {label}
                </label>
                <input
                  type={key === "email" ? "email" : "url"}
                  value={form[key]}
                  onChange={(e) => set(key, e.target.value)}
                  placeholder={placeholder}
                  className="w-full px-4 py-3 bg-[#0F172A] border border-slate-700 focus:border-blue-500 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Hero Tagline */}
        <div className="bg-[#1E293B] rounded-2xl p-6 border border-slate-700/50 mb-8">
          <h2 className="text-white font-semibold mb-1">Hero Tagline</h2>
          <p className="text-slate-500 text-xs mb-4">The short bio shown below your name on the home page.</p>
          <textarea
            rows={3}
            value={form.heroTagline}
            onChange={(e) => set("heroTagline", e.target.value)}
            className="w-full px-4 py-3 bg-[#0F172A] border border-slate-700 focus:border-blue-500 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors text-sm resize-none"
          />
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="btn-save-settings"
        >
          {saving ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
          ) : (
            <><Save className="w-4 h-4" /> Save Settings</>
          )}
        </button>
      </motion.div>
    </div>
  );
}
