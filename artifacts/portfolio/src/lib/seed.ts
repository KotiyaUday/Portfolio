import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

const defaultProjects = [
  {
    title: "Crack DDCET",
    description: "A comprehensive exam preparation app for DDCET aspirants with topic-wise practice questions, mock tests, and performance analytics.",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop",
    technologies: ["Flutter", "Firebase", "Dart", "Firestore"],
    githubUrl: "https://github.com/udaykotiya",
    liveUrl: "",
    featured: true,
    order: 1,
  },
  {
    title: "Headlines Hub",
    description: "A modern news aggregator app that fetches real-time headlines across categories with offline reading, bookmarks, and a clean reader mode.",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop",
    technologies: ["Flutter", "REST API", "Dart", "Provider"],
    githubUrl: "https://github.com/udaykotiya",
    liveUrl: "",
    featured: true,
    order: 2,
  },
  {
    title: "Lost & Found Hub",
    description: "A community platform to report lost items and find them back. Features real-time notifications, image upload, location tagging, and chat.",
    image: "https://images.unsplash.com/photo-1586892478382-8e64fc0eefca?w=800&auto=format&fit=crop",
    technologies: ["Flutter", "Firebase", "Firestore", "Cloud Storage"],
    githubUrl: "https://github.com/udaykotiya",
    liveUrl: "",
    featured: true,
    order: 3,
  },
];

const defaultSkills = [
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

const defaultExperience = [
  {
    role: "Flutter Developer Intern",
    company: "Tech Company",
    duration: "2024",
    description: "Worked on Flutter mobile application development, UI improvements, and API integration using Dart and Material Design. Built responsive layouts and integrated RESTful APIs for real-time data sync.",
    technologies: ["Flutter", "Dart", "Firebase", "REST API"],
    order: 1,
  },
];

const defaultCertifications = [
  {
    title: "Finishing School Training Program",
    issuer: "Knowledge Consortium of Gujarat (KCG), Government of Gujarat",
    date: "2024",
    credentialUrl: "",
    order: 1,
  },
];

export async function seedFirestoreIfEmpty() {
  try {
    const projectsSnap = await getDocs(collection(db, "projects"));
    if (!projectsSnap.empty) return;

    const adds = [
      ...defaultProjects.map((p) => addDoc(collection(db, "projects"), { ...p, createdAt: serverTimestamp() })),
      ...defaultSkills.map((s) => addDoc(collection(db, "skills"), { ...s, createdAt: serverTimestamp() })),
      ...defaultExperience.map((e) => addDoc(collection(db, "experience"), { ...e, createdAt: serverTimestamp() })),
      ...defaultCertifications.map((c) => addDoc(collection(db, "certifications"), { ...c, createdAt: serverTimestamp() })),
    ];
    await Promise.all(adds);
    console.log("Firestore seeded with default data.");
  } catch (err) {
    console.warn("Could not seed Firestore (may not be configured yet):", err);
  }
}
