import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, Github, Linkedin, Send, CheckCircle } from "lucide-react";

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSent(true);
    setLoading(false);
    setForm({ name: "", email: "", message: "" });
  };

  const contacts = [
    { icon: Mail, label: "Email", value: "udaykotiya@gmail.com", href: "mailto:udaykotiya@gmail.com" },
    { icon: Linkedin, label: "LinkedIn", value: "linkedin.com/in/udaykotiya", href: "https://linkedin.com/in/udaykotiya" },
    { icon: Github, label: "GitHub", value: "github.com/udaykotiya", href: "https://github.com/udaykotiya" },
  ];

  return (
    <section id="contact" className="py-24 bg-[#0F172A]/80 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-blue-400 font-medium text-sm uppercase tracking-wider">Get in touch</span>
          <h2 className="text-4xl font-bold text-white mt-2">
            Contact <span className="text-blue-400">Me</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full" />
          <p className="text-slate-400 mt-6 max-w-xl mx-auto">
            Have a project in mind or just want to chat? Feel free to reach out — I'm always open to new opportunities and collaborations.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-5"
          >
            {contacts.map(({ icon: Icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 bg-[#1E293B] rounded-2xl border border-slate-700/50 hover:border-blue-500/30 transition-all group hover:shadow-lg hover:shadow-blue-500/5"
                data-testid={`link-contact-${label.toLowerCase()}`}
              >
                <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors flex-shrink-0">
                  <Icon className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-wide">{label}</p>
                  <p className="text-white font-medium">{value}</p>
                </div>
              </a>
            ))}

            <div className="p-6 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-2xl border border-blue-500/20">
              <p className="text-slate-300 text-sm leading-relaxed">
                Currently open to freelance projects, internship opportunities, and full-time roles. Based in Rajkot, Gujarat, India. Available for remote work.
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center h-full py-16 text-center"
              >
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-white font-bold text-xl mb-2">Message sent!</h3>
                <p className="text-slate-400">Thank you for reaching out. I'll get back to you soon.</p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-6 text-blue-400 hover:text-blue-300 text-sm"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Your Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 bg-[#1E293B] border border-slate-700 focus:border-blue-500 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                    placeholder="John Doe"
                    data-testid="input-contact-name"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 bg-[#1E293B] border border-slate-700 focus:border-blue-500 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                    placeholder="john@example.com"
                    data-testid="input-contact-email"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 bg-[#1E293B] border border-slate-700 focus:border-blue-500 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
                    placeholder="Tell me about your project..."
                    data-testid="input-contact-message"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="btn-submit-contact"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
