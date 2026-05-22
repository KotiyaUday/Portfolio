import { useEffect, useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { getProjects, type Project } from "@/lib/firestore";
import { Github, ExternalLink, Star, FolderOpen } from "lucide-react";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "featured">("all");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "featured" ? projects.filter((p) => p.featured) : projects;

  return (
    <section id="projects" className="py-24 bg-[#0F172A] relative overflow-hidden">
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-blue-400 font-medium text-sm uppercase tracking-wider">What I've built</span>
          <h2 className="text-4xl font-bold text-white mt-2">
            My <span className="text-blue-400">Projects</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full" />
        </motion.div>

        {/* Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center gap-3 mb-10"
        >
          {(["all", "featured"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === f
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                  : "bg-[#1E293B] text-slate-400 hover:text-white border border-slate-700"
              }`}
              data-testid={`btn-project-filter-${f}`}
            >
              {f === "all" ? "All Projects" : "Featured"}
            </button>
          ))}
        </motion.div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-72 bg-[#1E293B] rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="group relative bg-[#1E293B] rounded-2xl overflow-hidden border border-slate-700/50 hover:border-blue-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
                  data-testid={`card-project-${project.id}`}
                >
                  {/* Image */}
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={project.image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop"}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B] via-transparent to-transparent" />
                    {project.featured && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-full text-yellow-400 text-xs font-medium">
                        <Star className="w-3 h-3 fill-yellow-400" />
                        Featured
                      </div>
                    )}
                    {/* Hover overlay with buttons */}
                    <div className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-sm flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium rounded-xl transition-all hover:scale-105"
                          data-testid={`link-github-${project.id}`}
                        >
                          <Github className="w-4 h-4" />
                          GitHub
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600/80 hover:bg-blue-600 text-white text-sm font-medium rounded-xl transition-all hover:scale-105"
                          data-testid={`link-live-${project.id}`}
                        >
                          <ExternalLink className="w-4 h-4" />
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-white font-bold text-lg mb-2 group-hover:text-blue-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {(project.technologies || []).slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs rounded-lg"
                        >
                          {tech}
                        </span>
                      ))}
                      {(project.technologies || []).length > 4 && (
                        <span className="px-2 py-0.5 bg-slate-700 text-slate-400 text-xs rounded-lg">
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No projects yet. Add some from the admin panel.</p>
          </div>
        )}
      </div>
    </section>
  );
}
