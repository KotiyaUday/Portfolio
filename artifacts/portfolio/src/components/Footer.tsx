import { useEffect, useState } from "react";
import { Github, Linkedin, Mail, Code2, Heart } from "lucide-react";
import { getSettings, DEFAULT_SETTINGS, type PortfolioSettings } from "@/lib/firestore";

export default function Footer() {
  const [settings, setSettings] = useState<PortfolioSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    getSettings().then(setSettings).catch(() => {});
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const socials = [
    { href: settings.githubUrl, icon: Github, label: "GitHub" },
    { href: settings.linkedinUrl, icon: Linkedin, label: "LinkedIn" },
    { href: `mailto:${settings.email}`, icon: Mail, label: "Email" },
  ];

  return (
    <footer className="bg-[#0F172A] border-t border-slate-800 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Code2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold text-xl">Uday Kotiya</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              {settings.heroTagline}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "About", id: "about" },
                { label: "Skills", id: "skills" },
                { label: "Projects", id: "projects" },
                { label: "Experience", id: "experience" },
                { label: "Certifications", id: "certifications" },
                { label: "Contact", id: "contact" },
              ].map(({ label, id }) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className="text-left text-slate-400 hover:text-blue-400 text-sm transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <div className="flex gap-3">
              {socials.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target={label === "Email" ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="p-3 bg-[#1E293B] border border-slate-700 rounded-xl text-slate-400 hover:text-white hover:border-blue-500/50 transition-all"
                  aria-label={label}
                  data-testid={`link-footer-${label.toLowerCase()}`}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
            <p className="text-slate-600 text-xs mt-4 leading-relaxed">
              Update links anytime from the<br />admin → Settings panel.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Uday Kotiya. All rights reserved.
          </p>
          <p className="text-slate-500 text-sm flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> using React & Firebase
          </p>
        </div>
      </div>
    </footer>
  );
}
