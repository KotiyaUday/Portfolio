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

// ── Settings ──────────────────────────────────────────────────────────────────

export type PortfolioSettings = {
  resumeUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  email: string;
  heroTagline: string;
};

const SETTINGS_DOC = "portfolio";

export async function getSettings(): Promise<PortfolioSettings> {
  const defaults: PortfolioSettings = {
    resumeUrl: "",
    githubUrl: "https://github.com/udaykotiya",
    linkedinUrl: "https://linkedin.com/in/udaykotiya",
    email: "udaykotiya@gmail.com",
    heroTagline: "Computer Engineering student passionate about Flutter development, web technologies, and AI/ML.",
  };
  try {
    const snap = await withTimeout(
      import("firebase/firestore").then(({ getDoc, doc }) => getDoc(doc(db, "settings", SETTINGS_DOC))),
      2000
    );
    if (snap.exists()) {
      return { ...defaults, ...(snap.data() as Partial<PortfolioSettings>) };
    }
    return defaults;
  } catch {
    return defaults;
  }
}

export async function updateSettings(data: Partial<PortfolioSettings>): Promise<void> {
  const { setDoc, doc, serverTimestamp } = await import("firebase/firestore");
  await setDoc(doc(db, "settings", SETTINGS_DOC), { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

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
