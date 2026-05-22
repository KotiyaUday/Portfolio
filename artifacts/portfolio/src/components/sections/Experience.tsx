import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { getExperience, type Experience } from "@/lib/firestore";
import { Briefcase, Calendar, ChevronRight } from "lucide-react";

const fallbackExperience: Omit<Experience, "id">[] = [
  {
    role: "Flutter Developer Intern",
    company: "Tech Company",
    duration: "2024",
    description: "Worked on Flutter mobile application development, UI improvements, and API integration using Dart and Material Design. Built responsive layouts and integrated RESTful APIs for real-time data sync.",
    technologies: ["Flutter", "Dart", "Firebase", "REST API"],
    order: 1,
  },
];

export default function ExperienceSection() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    getExperience()
      .then((data) => {
        setExperiences(data.length > 0 ? data : fallbackExperience.map((e, i) => ({ ...e, id: `fallback-${i}` })));
      })
      .catch(() => {
        setExperiences(fallbackExperience.map((e, i) => ({ ...e, id: `fallback-${i}` })));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="experience" className="py-24 bg-[#0F172A]/80 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-blue-400 font-medium text-sm uppercase tracking-wider">Work history</span>
          <h2 className="text-4xl font-bold text-white mt-2">
            <span className="text-blue-400">Experience</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full" />
        </motion.div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-40 bg-[#1E293B] rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-transparent hidden sm:block" />
            <div className="space-y-8">
              {experiences.map((exp, i) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="relative sm:pl-16"
                  data-testid={`card-experience-${exp.id}`}
                >
                  <div className="hidden sm:flex absolute left-0 top-6 w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl items-center justify-center shadow-lg shadow-blue-500/20 z-10">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>

                  <div className="bg-[#1E293B] rounded-2xl p-6 border border-slate-700/50 hover:border-blue-500/30 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                      <div>
                        <h3 className="text-white font-bold text-xl">{exp.role}</h3>
                        <p className="text-blue-400 font-medium">{exp.company}</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 text-sm bg-slate-700/50 px-3 py-1.5 rounded-lg whitespace-nowrap">
                        <Calendar className="w-3.5 h-3.5" />
                        {exp.duration}
                      </div>
                    </div>

                    <p className="text-slate-400 leading-relaxed mb-4">{exp.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {(exp.technologies || []).map((tech) => (
                        <span
                          key={tech}
                          className="flex items-center gap-1 px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs rounded-lg"
                        >
                          <ChevronRight className="w-3 h-3" />
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
