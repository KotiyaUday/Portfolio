import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { getCertifications, type Certification } from "@/lib/firestore";
import { Award, Calendar, ExternalLink } from "lucide-react";

export default function Certifications() {
  const [certs, setCerts] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    getCertifications()
      .then(setCerts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="certifications" className="py-24 bg-[#0F172A] relative overflow-hidden">
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-blue-400 font-medium text-sm uppercase tracking-wider">Achievements</span>
          <h2 className="text-4xl font-bold text-white mt-2">
            <span className="text-blue-400">Certifications</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full" />
        </motion.div>

        {loading ? (
          <div className="grid sm:grid-cols-2 gap-5">
            {[1, 2].map((i) => (
              <div key={i} className="h-36 bg-[#1E293B] rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            {certs.map((cert, i) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group bg-[#1E293B] rounded-2xl p-6 border border-slate-700/50 hover:border-yellow-500/30 transition-all hover:shadow-lg hover:shadow-yellow-500/5"
                data-testid={`card-cert-${cert.id}`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Award className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold leading-snug mb-1">{cert.title}</h3>
                    <p className="text-blue-400 text-sm mb-3">{cert.issuer}</p>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                        <Calendar className="w-3.5 h-3.5" />
                        {cert.date}
                      </div>
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                          data-testid={`link-cert-${cert.id}`}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          View
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && certs.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <Award className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No certifications yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
