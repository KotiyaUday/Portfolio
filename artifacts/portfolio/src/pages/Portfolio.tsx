import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import ExperienceSection from "@/components/sections/Experience";
import Certifications from "@/components/sections/Certifications";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/Footer";
import { seedFirestoreIfEmpty } from "@/lib/seed";
import { Code2 } from "lucide-react";

function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-[#0F172A] z-[200] flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-2 border-transparent border-t-blue-500 border-r-purple-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Code2 className="w-6 h-6 text-blue-400" />
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-white font-bold text-2xl">Uday Kotiya</h2>
          <p className="text-slate-400 text-sm mt-1">Loading portfolio...</p>
        </div>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Portfolio() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    seedFirestoreIfEmpty().finally(() => {
      setTimeout(() => setLoading(false), 1200);
    });
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <ExperienceSection />
        <Certifications />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
