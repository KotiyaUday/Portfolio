import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { getProjects, getSkills, getExperience, getCertifications } from "@/lib/firestore";
import { FolderKanban, Wrench, Briefcase, Award, TrendingUp, ArrowRight, Star } from "lucide-react";

export default function Dashboard() {
  const [counts, setCounts] = useState({ projects: 0, skills: 0, experience: 0, certifications: 0, featured: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProjects(), getSkills(), getExperience(), getCertifications()])
      .then(([projects, skills, experience, certifications]) => {
        setCounts({
          projects: projects.length,
          skills: skills.length,
          experience: experience.length,
          certifications: certifications.length,
          featured: projects.filter((p) => p.featured).length,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: "Projects", value: counts.projects, icon: FolderKanban, color: "from-blue-500 to-cyan-500", href: "/admin/projects" },
    { label: "Skills", value: counts.skills, icon: Wrench, color: "from-purple-500 to-pink-500", href: "/admin/skills" },
    { label: "Experience", value: counts.experience, icon: Briefcase, color: "from-green-500 to-emerald-500", href: "/admin/experience" },
    { label: "Certifications", value: counts.certifications, icon: Award, color: "from-yellow-500 to-orange-500", href: "/admin/certifications" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-white font-bold text-2xl sm:text-3xl">Dashboard</h1>
        <p className="text-slate-400 mt-1">Overview of your portfolio content</p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <Link
              href={stat.href}
              className="block bg-[#1E293B] rounded-2xl p-5 border border-slate-700/50 hover:border-blue-500/30 transition-all group"
              data-testid={`stat-card-${stat.label.toLowerCase()}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg opacity-90`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />
              </div>
              <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {loading ? "—" : stat.value}
              </div>
              <div className="text-slate-400 text-sm mt-1">{stat.label}</div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-[#1E293B] rounded-2xl p-6 border border-slate-700/50"
        >
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <h3 className="text-white font-semibold">Featured Projects</h3>
          </div>
          <div className="text-4xl font-bold text-yellow-400 mb-1">{loading ? "—" : counts.featured}</div>
          <p className="text-slate-400 text-sm">out of {counts.projects} total projects marked as featured</p>
          <Link href="/admin/projects" className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm mt-4 transition-colors">
            Manage <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="bg-[#1E293B] rounded-2xl p-6 border border-slate-700/50"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <h3 className="text-white font-semibold">Quick Actions</h3>
          </div>
          <div className="space-y-2">
            {[
              { label: "Add new project", href: "/admin/projects" },
              { label: "Add new skill", href: "/admin/skills" },
              { label: "Add experience", href: "/admin/experience" },
              { label: "Add certification", href: "/admin/certifications" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors group"
              >
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full group-hover:scale-125 transition-transform" />
                {label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
