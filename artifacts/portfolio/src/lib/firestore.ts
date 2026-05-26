import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export type Project = {
  id?: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
  order?: number;
};

export type Skill = {
  id?: string;
  name: string;
  category: string;
  icon: string;
  proficiency: number;
  order?: number;
};

export type Experience = {
  id?: string;
  role: string;
  company: string;
  duration: string;
  description: string;
  technologies: string[];
  order?: number;
};

export type Certification = {
  id?: string;
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
  order?: number;
};

export type Social = {
  id?: string;
  platform: string;
  url: string;
  icon: string;
};

// ── Settings (single Firestore document: settings/portfolio) ─────────────────

export type PortfolioSettings = {
  // Hero
  resumeUrl: string;
  heroTagline: string;

  // Social / contact
  githubUrl: string;
  linkedinUrl: string;
  email: string;

  // About — Who I Am
  bio: string;

  // About — Education (one entry; add more via experience section if needed)
  educationDegree: string;
  educationSchool: string;
  educationDuration: string;
  educationDescription: string;

  educationDegree1: string;
  educationSchool1: string;
  educationDuration1: string;
  educationDescription1: string;

  // About — Current Interests  (comma-separated list)
  interests: string;

  // About — What Drives Me
  whatDrivesMe: string;

  // About — Currently Focused On  (one item per line: "Label: 88")
  currentlyFocusedOn: string;

  // Contact section
  availabilityText: string;
  location: string;
};

export const DEFAULT_SETTINGS: PortfolioSettings = {
  resumeUrl: "",
  heroTagline:
    "Computer Engineering student passionate about Flutter development, web technologies, and AI/ML. Building practical applications and modern digital experiences.",

  githubUrl: "https://github.com/udaykotiya",
  linkedinUrl: "https://linkedin.com/in/udaykotiya",
  email: "udaykotiya@gmail.com",

  bio: "I'm a passionate Computer Engineering student with a deep interest in mobile app development, web technologies, and emerging AI/ML domains. I love turning ideas into functional, polished applications that make a real difference.",

  educationDegree: "B.E. Computer Engineering",
  educationSchool: "Government Engineering College, Rajkot",
  educationDuration: "2022 – 2026",
  educationDescription: "Focused on software engineering, data structures, and full-stack development.",

  interests: "Flutter Development,Firebase,MERN Stack,Data Science,AI/ML",

  whatDrivesMe:
    "I believe in learning by building. Each project is a chance to explore new technologies, solve real problems, and grow as a developer. I'm always eager to collaborate, contribute to open source, and push the boundaries of what I can create.",

  currentlyFocusedOn: "Building Flutter apps: 88\nLearning MERN Stack: 75\nExploring AI/ML: 60",

  availabilityText:
    "Currently open to freelance projects, internship opportunities, and full-time roles. Based in Rajkot, Gujarat, India. Available for remote work.",
  location: "Rajkot, Gujarat, India",
};

// ── helpers ───────────────────────────────────────────────────────────────────

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Firestore timeout")), ms)
    ),
  ]);
}

async function getCollection<T>(col: string): Promise<T[]> {
  try {
    const q = query(collection(db, col), orderBy("order", "asc"));
    const snap = await withTimeout(getDocs(q), 2000);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as T));
  } catch {
    return [];
  }
}

export const getProjects = () => getCollection<Project>("projects");
export const getSkills = () => getCollection<Skill>("skills");
export const getExperience = () => getCollection<Experience>("experience");
export const getCertifications = () => getCollection<Certification>("certifications");
export const getSocials = () => getCollection<Social>("socials");

// ── Settings CRUD ─────────────────────────────────────────────────────────────

const SETTINGS_DOC = "portfolio";

export async function getSettings(): Promise<PortfolioSettings> {
  try {
    const snap = await withTimeout(
      import("firebase/firestore").then(({ getDoc, doc: fsDoc }) =>
        getDoc(fsDoc(db, "settings", SETTINGS_DOC))
      ),
      2000
    );
    if (snap.exists()) {
      return { ...DEFAULT_SETTINGS, ...(snap.data() as Partial<PortfolioSettings>) };
    }
    return DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function updateSettings(data: Partial<PortfolioSettings>): Promise<void> {
  const { setDoc, doc: fsDoc, serverTimestamp: sts } = await import("firebase/firestore");
  await setDoc(
    fsDoc(db, "settings", SETTINGS_DOC),
    { ...data, updatedAt: sts() },
    { merge: true }
  );
}

// ── Content CRUD helpers ──────────────────────────────────────────────────────

async function addItem(col: string, data: object) {
  return addDoc(collection(db, col), { ...data, order: Date.now(), createdAt: serverTimestamp() });
}
async function updateItem(col: string, id: string, data: object) {
  return updateDoc(doc(db, col, id), { ...data, updatedAt: serverTimestamp() });
}
async function deleteItem(col: string, id: string) {
  return deleteDoc(doc(db, col, id));
}

export const addProject = (data: Omit<Project, "id">) => addItem("projects", data);
export const updateProject = (id: string, data: Partial<Project>) => updateItem("projects", id, data);
export const deleteProject = (id: string) => deleteItem("projects", id);

export const addSkill = (data: Omit<Skill, "id">) => addItem("skills", data);
export const updateSkill = (id: string, data: Partial<Skill>) => updateItem("skills", id, data);
export const deleteSkill = (id: string) => deleteItem("skills", id);

export const addExperience = (data: Omit<Experience, "id">) => addItem("experience", data);
export const updateExperience = (id: string, data: Partial<Experience>) => updateItem("experience", id, data);
export const deleteExperience = (id: string) => deleteItem("experience", id);

export const addCertification = (data: Omit<Certification, "id">) => addItem("certifications", data);
export const updateCertification = (id: string, data: Partial<Certification>) => updateItem("certifications", id, data);
export const deleteCertification = (id: string) => deleteItem("certifications", id);

// ── Parsers for settings fields ───────────────────────────────────────────────

/** "Flutter Development,Firebase,MERN Stack" → string[] */
export function parseInterests(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** "Building Flutter apps: 88\nLearning MERN Stack: 75" → [{label, pct}] */
export function parseFocusedOn(raw: string): { label: string; pct: number }[] {
  return raw
    .split("\n")
    .map((line) => {
      const idx = line.lastIndexOf(":");
      if (idx === -1) return null;
      const label = line.slice(0, idx).trim();
      const pct = parseInt(line.slice(idx + 1).trim(), 10);
      if (!label || isNaN(pct)) return null;
      return { label, pct: Math.min(100, Math.max(0, pct)) };
    })
    .filter((x): x is { label: string; pct: number } => x !== null);
}
