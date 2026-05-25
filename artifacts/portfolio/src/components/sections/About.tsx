import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { GraduationCap, MapPin, Code, Brain, Sparkles, CalendarDays, BookOpen } from "lucide-react";
import { getSettings, parseInterests, parseFocusedOn, DEFAULT_SETTINGS, type PortfolioSettings } from "@/lib/firestore";

const stats = [
  { value: "3+", label: "Projects Built" },
  { value: "5+", label: "Technologies" },
  { value: "1+", label: "Internships" },
  { value: "2+", label: "Certifications" },
];

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [settings, setSettings] = useState<PortfolioSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    getSettings().then(setSettings).catch(() => {});
  }, []);

  const interests = parseInterests(settings.interests);
  const focusedOn = parseFocusedOn(settings.currentlyFocusedOn);

  return (
    <section id="about" className="py-24 bg-[#0F172A] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-blue-400 font-medium text-sm uppercase tracking-wider">Get to know me</span>
          <h2 className="text-4xl font-bold text-white mt-2">
            About <span className="text-blue-400">Me</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* ── Left column ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-5"
          >
            {/* Who I Am */}
            <div className="bg-[#1E293B] rounded-2xl p-6 border border-slate-700/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Code className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-white font-semibold text-lg">Who I Am</h3>
              </div>
              <p className="text-slate-400 leading-relaxed">{settings.bio}</p>
            </div>

            {/* Education */}
            <div className="bg-[#1E293B] rounded-2xl p-6 border border-slate-700/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-white font-semibold text-lg">Education</h3>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-purple-500 mt-1 flex-shrink-0" />
                  <div className="w-0.5 flex-1 bg-gradient-to-b from-purple-500/50 to-transparent mt-1" />
                </div>
                <div className="pb-2">
                  <p className="text-white font-semibold text-base">{settings.educationDegree}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    <p className="text-slate-400 text-sm">{settings.educationSchool}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <CalendarDays className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                    <p className="text-blue-400 text-sm font-medium">{settings.educationDuration}</p>
                  </div>
                  {settings.educationDescription && (
                    <div className="flex items-start gap-2 mt-2">
                      <BookOpen className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mt-0.5" />
                      <p className="text-slate-500 text-sm">{settings.educationDescription}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Current Interests */}
            <div className="bg-[#1E293B] rounded-2xl p-6 border border-slate-700/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Brain className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="text-white font-semibold text-lg">Current Interests</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {interests.length > 0 ? interests.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white/5 border border-white/10 text-slate-300 hover:border-blue-500/40 transition-colors cursor-default"
                  >
                    {item}
                  </span>
                )) : (
                  <p className="text-slate-500 text-sm">No interests listed yet.</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* ── Right column ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-5"
          >
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                  className="bg-[#1E293B] rounded-2xl p-6 border border-slate-700/50 text-center hover:border-blue-500/30 transition-colors"
                >
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-slate-400 text-sm mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* What Drives Me */}
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl p-6 border border-blue-500/20">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <h3 className="text-white font-semibold">What Drives Me</h3>
              </div>
              <p className="text-slate-300 leading-relaxed text-sm">{settings.whatDrivesMe}</p>
            </div>

            {/* Currently Focused On */}
            <div className="bg-[#1E293B] rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-white font-semibold mb-5">Currently Focused On</h3>
              {focusedOn.length > 0 ? (
                <div className="space-y-4">
                  {focusedOn.map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-slate-300 font-medium">{item.label}</span>
                        <span className="text-blue-400 font-semibold">{item.pct}%</span>
                      </div>
                      <div className="h-2 bg-slate-700/60 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={inView ? { width: `${item.pct}%` } : {}}
                          transition={{ duration: 1, delay: 0.6 }}
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm">No focus items set yet.</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
