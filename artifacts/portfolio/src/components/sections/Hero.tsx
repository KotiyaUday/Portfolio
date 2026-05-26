import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Download, ArrowRight, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { getSettings, type PortfolioSettings } from "@/lib/firestore";

const roles = ["Flutter Developer", "MERN Stack Developer", "AI/ML Learner", "Open Source Enthusiast"];

const roleColors: Record<string, string> = {
  "Flutter Developer": "from-cyan-400 to-blue-500",
  "MERN Stack Developer": "from-green-400 to-emerald-500",
  "AI/ML Learner": "from-purple-400 to-violet-500",
  "Open Source Enthusiast": "from-orange-400 to-pink-500",
};

function TypewriterText() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState<"typing" | "pause" | "deleting">("typing");

  useEffect(() => {
    const current = roles[roleIndex];

    if (phase === "typing") {
      if (displayed.length < current.length) {
        const t = setTimeout(
          () => setDisplayed(current.slice(0, displayed.length + 1)),
          55 + Math.random() * 25
        );
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase("pause"), 2000);
        return () => clearTimeout(t);
      }
    }

    if (phase === "pause") {
      const t = setTimeout(() => setPhase("deleting"), 300);
      return () => clearTimeout(t);
    }

    if (phase === "deleting") {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 28);
        return () => clearTimeout(t);
      } else {
        setRoleIndex((i) => (i + 1) % roles.length);
        setPhase("typing");
      }
    }
  }, [displayed, phase, roleIndex]);

  const gradient = roleColors[roles[roleIndex]];

  return (
    <span
      className={`inline-flex items-center gap-1 bg-gradient-to-r ${gradient} bg-clip-text text-transparent font-bold`}
    >
      {displayed || "\u00A0"}
      <span
        className="inline-block w-[3px] rounded-full self-stretch"
        style={{
          background: "currentColor",
          WebkitTextFillColor: "initial",
          backgroundImage: "none",
          backgroundColor: "#60a5fa",
          animation: "blink 1s step-start infinite",
        }}
      />
    </span>
  );
}

const defaultSettings: PortfolioSettings = {
  resumeUrl: "",
  githubUrl: "https://github.com/udaykotiya",
  linkedinUrl: "https://linkedin.com/in/udaykotiya",
  email: "udaykotiya@gmail.com",
  heroTagline:
    "Computer Engineering student passionate about Flutter development, web technologies, and AI/ML. Building practical applications and modern digital experiences.",
};

export default function Hero() {
  const [settings, setSettings] = useState<PortfolioSettings>(defaultSettings);

  useEffect(() => {
    getSettings().then(setSettings).catch(() => {});
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const socials = [
    { href: settings.githubUrl, icon: Github, label: "GitHub" },
    { href: settings.linkedinUrl, icon: Linkedin, label: "LinkedIn" },
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0F172A]"
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(59,130,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Open to opportunities
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight"
          data-testid="hero-name"
        >
          Hi, I'm{" "}
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            Uday Kotiya
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 min-h-[3.5rem] flex flex-col items-center justify-center"
          data-testid="hero-roles"
        >
          <div className="flex items-center justify-center gap-3 px-5 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm">
            <span className="text-slate-400 text-base sm:text-lg font-medium tracking-wide">I'm a</span>
            <span className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
              <TypewriterText />
            </span>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-slate-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
          data-testid="hero-intro"
        >
          {settings.heroTagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {settings.resumeUrl ? (
            <a
              href={settings.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
              data-testid="btn-download-resume"
            >
              <Download className="w-4 h-4" />
              Download Resume
            </a>
          ) : (
            <span
              className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-slate-500 font-semibold rounded-xl cursor-not-allowed select-none"
              title="Resume not available yet"
              data-testid="btn-download-resume-disabled"
            >
              <Download className="w-4 h-4" />
              Download Resume
            </span>
          )}
          <button
            onClick={() => scrollTo("contact")}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105"
            data-testid="btn-contact"
          >
            Contact Me
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex justify-center gap-4"
        >
          {socials.map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-[#1E293B] border border-slate-700 text-slate-400 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-200 hover:scale-110"
              data-testid={`link-social-${label.toLowerCase()}`}
              aria-label={label}
            >
              <Icon className="w-5 h-5" />
            </a>
          ))}
        </motion.div>
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        onClick={() => scrollTo("about")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-500 hover:text-slate-300 transition-colors"
        data-testid="btn-scroll-down"
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.button>
    </section>
  );
}
