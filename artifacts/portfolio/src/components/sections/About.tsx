import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { GraduationCap, MapPin, Code, Brain, Sparkles } from "lucide-react";

const interests = [
  { label: "Flutter Development", color: "from-blue-500 to-cyan-500" },
  { label: "Firebase", color: "from-orange-500 to-yellow-500" },
  { label: "MERN Stack", color: "from-green-500 to-emerald-500" },
  { label: "Data Science", color: "from-purple-500 to-pink-500" },
  { label: "AI/ML", color: "from-red-500 to-orange-500" },
];

const stats = [
  { value: "3+", label: "Projects Built" },
  { value: "5+", label: "Technologies" },
  { value: "1+", label: "Internships" },
  { value: "2+", label: "Certifications" },
];

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

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

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-[#1E293B] rounded-2xl p-6 border border-slate-700/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Code className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-white font-semibold text-lg">Who I Am</h3>
              </div>
              <p className="text-slate-400 leading-relaxed">
                I'm a passionate Computer Engineering student with a deep interest in mobile app development,
                web technologies, and emerging AI/ML domains. I love turning ideas into functional, polished
                applications that make a real difference.
              </p>
            </div>

            <div className="bg-[#1E293B] rounded-2xl p-6 border border-slate-700/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-white font-semibold text-lg">Education</h3>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">B.E. Computer Engineering</p>
                  <p className="text-slate-400 text-sm">Government Engineering College, Rajkot</p>
                </div>
              </div>
            </div>

            <div className="bg-[#1E293B] rounded-2xl p-6 border border-slate-700/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <Brain className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="text-white font-semibold text-lg">Current Interests</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {interests.map((item) => (
                  <span
                    key={item.label}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white/5 border border-white/10 text-slate-300 hover:border-blue-500/40 transition-colors"
                  >
                    {item.label}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                  className="bg-[#1E293B] rounded-2xl p-6 border border-slate-700/50 text-center hover:border-blue-500/30 transition-colors"
                  data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-slate-400 text-sm mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl p-6 border border-blue-500/20">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <h3 className="text-white font-semibold">What drives me</h3>
              </div>
              <p className="text-slate-300 leading-relaxed text-sm">
                I believe in learning by building. Each project is a chance to explore new technologies,
                solve real problems, and grow as a developer. I'm always eager to collaborate, contribute
                to open source, and push the boundaries of what I can create.
              </p>
            </div>

            <div className="bg-[#1E293B] rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-white font-semibold mb-4">Currently focused on</h3>
              <div className="space-y-3">
                {[
                  { label: "Building Flutter apps", pct: 88 },
                  { label: "Learning MERN Stack", pct: 75 },
                  { label: "Exploring AI/ML", pct: 60 },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">{item.label}</span>
                      <span className="text-blue-400">{item.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
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
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
