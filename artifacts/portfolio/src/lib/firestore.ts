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

async function getCollection<T>(col: string): Promise<T[]> {
  const q = query(collection(db, col), orderBy("order", "asc"));
  const snap = await getDocs(q).catch(async () => {
    return getDocs(collection(db, col));
  });
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as T));
}

export const getProjects = () => getCollection<Project>("projects");
export const getSkills = () => getCollection<Skill>("skills");
export const getExperience = () => getCollection<Experience>("experience");
export const getCertifications = () => getCollection<Certification>("certifications");
export const getSocials = () => getCollection<Social>("socials");

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
