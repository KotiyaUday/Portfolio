import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, Github, Linkedin, MapPin, Download } from "lucide-react";
import { getSettings, DEFAULT_SETTINGS, type PortfolioSettings } from "@/lib/firestore";

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const [settings, setSettings] = useState<PortfolioSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    getSettings().then(setSettings).catch(() => {});
  }, []);

  const contacts = [
    {
      icon: Mail,
      label: "Email",
      value: settings.email,
      href: `mailto:${settings.email}`,
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "Connect Professionally",
      href: settings.linkedinUrl,
    },
    {
      icon: Github,
      label: "GitHub",
      value: "View My Projects",
      href: settings.githubUrl,
    },
  ];

  return (
    <section
      id="contact"
      className="py-24 bg-[#0F172A]/80 relative overflow-hidden"
    >
      {/* Background Blur */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div
        className="max-w-5xl mx-auto px-4 sm:px-6"
        ref={ref}
      >
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-blue-400 font-medium text-sm uppercase tracking-wider">
            Let's Connect
          </span>

          <h2 className="text-4xl font-bold text-white mt-2">
            Get In <span className="text-blue-400">Touch</span>
          </h2>

          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full" />

          <p className="text-slate-400 mt-6 max-w-xl mx-auto">
            Feel free to connect with me for opportunities,
            collaborations, or project discussions.
          </p>
        </motion.div>

        {/* Contact Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {contacts.map(({ icon: Icon, label, value, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 p-6 bg-[#1E293B]/70 border border-slate-700/50 rounded-2xl hover:border-blue-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                <Icon className="w-6 h-6 text-blue-400" />
              </div>

              <div>
                <p className="text-slate-400 text-sm">{label}</p>
                <p className="text-white font-medium">{value}</p>
              </div>
            </a>
          ))}
        </motion.div>

        {/* Availability Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8"
        >
          <div className="p-6 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-2xl border border-blue-500/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-green-400" />
              </div>

              <div>
                <h3 className="text-white font-semibold mb-2">
                  Availability
                </h3>

                <p className="text-slate-300 leading-relaxed">
                  {settings.availabilityText}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Resume Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center mt-10"
        >
          <a
            href="https://drive.google.com/file/d/1r0bExWyzjIEU8gtBO-QIbx9LAn3nI_Rf/view?usp=drive_link"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
          >
            <Download className="w-5 h-5" />
            Download Resume
          </a>
        </motion.div>
      </div>
    </section>
  );
}