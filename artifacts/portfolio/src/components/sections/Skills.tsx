import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { getSkills, type Skill } from "@/lib/firestore";
import * as SiIcons from "react-icons/si";
import { Layers } from "lucide-react";

const fallbackSkills: Omit<Skill, "id">[] = [
  { name: "Dart", category: "Flutter Development", icon: "SiDart", proficiency: 90, order: 1 },
  { name: "Flutter", category: "Flutter Development", icon: "SiFlutter", proficiency: 88, order: 2 },
  { name: "Firebase", category: "Flutter Development", icon: "SiFirebase", proficiency: 85, order: 3 },
  { name: "JavaScript", category: "Programming Languages", icon: "SiJavascript", proficiency: 82, order: 4 },
  { name: "Python", category: "Programming Languages", icon: "SiPython", proficiency: 78, order: 5 },
  { name: "C++", category: "Programming Languages", icon: "SiCplusplus", proficiency: 75, order: 6 },
  { name: "React.js", category: "Web Development", icon: "SiReact", proficiency: 80, order: 7 },
  { name: "Node.js", category: "Web Development", icon: "SiNodedotjs", proficiency: 75, order: 8 },
  { name: "Express.js", category: "Web Development", icon: "SiExpress", proficiency: 72, order: 9 },
  { name: "MongoDB", category: "Database", icon: "SiMongodb", proficiency: 78, order: 10 },
  { name: "MySQL", category: "Database", icon: "SiMysql", proficiency: 74, order: 11 },
  { name: "Git", category: "Tools", icon: "SiGit", proficiency: 85, order: 12 },
  { name: "VS Code", category: "Tools", icon: "SiVisualstudiocode", proficiency: 90, order: 13 },
  { name: "TensorFlow", category: "AI/ML", icon: "SiTensorflow", proficiency: 60, order: 14 },
  { name: "Pandas", category: "AI/ML", icon: "SiPandas", proficiency: 65, order: 15 },
];

const categoryColors: Record<string, string> = {
  "Flutter Development": "from-blue-500 to-cyan-400",
  "Programming Languages": "from-yellow-500 to-orange-400",
  "Web Development": "from-green-500 to-emerald-400",
  Database: "from-purple-500 to-pink-400",
  Tools: "from-slate-400 to-slate-300",
  "AI/ML": "from-red-500 to-orange-400",
};

const categoryBg: Record<string, string> = {
  "Flutter Development": "bg-blue-500/10 border-blue-500/20",
  "Programming Languages": "bg-yellow-500/10 border-yellow-500/20",
  "Web Development": "bg-green-500/10 border-green-500/20",
  Database: "bg-purple-500/10 border-purple-500/20",
  Tools: "bg-slate-500/10 border-slate-500/20",
  "AI/ML": "bg-red-500/10 border-red-500/20",
};

function SkillIcon({ iconName }: { iconName: string }) {
  const Icon = (SiIcons as Record<string, React.ComponentType<{ className?: string }>>)[iconName];
  if (!Icon) return <div className="w-6 h-6 rounded bg-slate-600" />;
  return <Icon className="w-6 h-6" />;
}

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    getSkills()
      .then((data) => {
        setSkills(data.length > 0 ? data : fallbackSkills.map((s, i) => ({ ...s, id: `fallback-${i}` })));
      })
      .catch(() => {
        setSkills(fallbackSkills.map((s, i) => ({ ...s, id: `fallback-${i}` })));
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = ["All", ...Array.from(new Set(skills.map((s) => s.category)))];
  const filtered = activeCategory === "All" ? skills : skills.filter((s) => s.category === activeCategory);

  return (
    <section id="skills" className="py-24 bg-[#0F172A]/80 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-blue-400 font-medium text-sm uppercase tracking-wider">What I work with</span>
          <h2 className="text-4xl font-bold text-white mt-2">
            Skills & <span className="text-blue-400">Technologies</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                  : "bg-[#1E293B] text-slate-400 hover:text-white border border-slate-700 hover:border-blue-500/40"
              }`}
              data-testid={`btn-skill-category-${cat.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-28 bg-[#1E293B] rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map((skill, i) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className={`group relative bg-[#1E293B] rounded-2xl p-5 border ${
                  categoryBg[skill.category] || "border-slate-700/50"
                } hover:scale-105 transition-all duration-200 cursor-default`}
                data-testid={`card-skill-${skill.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className={`text-2xl mb-3 bg-gradient-to-br ${categoryColors[skill.category] || "from-slate-400 to-slate-300"} bg-clip-text text-transparent`}>
                  <SkillIcon iconName={skill.icon} />
                </div>
                <p className="text-white text-sm font-semibold mb-2">{skill.name}</p>
                <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${skill.proficiency}%` } : {}}
                    transition={{ duration: 1, delay: 0.3 + i * 0.04 }}
                    className={`h-full rounded-full bg-gradient-to-r ${categoryColors[skill.category] || "from-slate-400 to-slate-300"}`}
                  />
                </div>
                <p className="text-slate-500 text-xs mt-1">{skill.proficiency}%</p>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <Layers className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No skills in this category yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
