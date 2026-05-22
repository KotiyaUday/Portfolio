# Uday Kotiya Portfolio

A full-stack developer portfolio website for Uday Kotiya, built with React + Vite, Firebase Firestore (dynamic content), Firebase Authentication (admin panel), and Framer Motion animations.

## Run & Operate

- `pnpm --filter @workspace/portfolio run dev` — run the portfolio (port auto-assigned)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS + Framer Motion
- Auth: Firebase Authentication
- Database: Firebase Firestore (dynamic content)
- Icons: lucide-react + react-icons/si
- API: Express 5 (for health check only — content comes from Firestore)

## Where things live

- `artifacts/portfolio/src/` — main portfolio app
  - `pages/Portfolio.tsx` — main portfolio page (all sections)
  - `pages/AdminLogin.tsx` — admin login
  - `pages/admin/` — admin CRUD pages
  - `components/sections/` — Hero, About, Skills, Projects, Experience, Certifications, Contact
  - `components/admin/AdminLayout.tsx` — admin sidebar layout
  - `lib/firebase.ts` — Firebase app initialization
  - `lib/firestore.ts` — Firestore CRUD helpers
  - `lib/seed.ts` — auto-seeds default data on first load
  - `contexts/ThemeContext.tsx` — dark/light theme
  - `contexts/AuthContext.tsx` — Firebase auth state

## Firestore Collections

- `projects` — title, description, image, technologies[], githubUrl, liveUrl, featured, order
- `skills` — name, category, icon (SiIconName), proficiency (0-100), order
- `experience` — role, company, duration, description, technologies[], order
- `certifications` — title, issuer, date, credentialUrl, order

## Architecture decisions

- All portfolio content is dynamic from Firestore — updating the DB updates the site without code changes.
- Firebase Authentication protects the admin panel at `/admin`.
- On first load, `seed.ts` auto-populates Firestore with default data (3 projects, 15 skills, 1 experience, 1 certification) if collections are empty.
- No backend API is needed for portfolio content — Firestore is called directly from the frontend.
- The shared Express API server only handles `/api/healthz`.

## Product

A professional developer portfolio with 7 sections (Hero, About, Skills, Projects, Experience, Certifications, Contact), a dark/light theme toggle, scroll progress indicator, and a full admin dashboard for managing all content.

## User preferences

- Color theme: #0F172A background, #3B82F6 accent, #8B5CF6 secondary accent
- Typography: Inter font
- Dark mode by default

## Gotchas

- **Firestore must be enabled** in Firebase Console before the portfolio can load data. Go to Firebase Console → Firestore Database → Create database → Start in test mode.
- Firebase Auth must have the Email/Password sign-in method enabled for the admin panel.
- Skill icons use the `react-icons/si` naming convention (e.g. `SiFlutter`, `SiReact`).
- The `VITE_` prefix is required for all env vars used in the frontend.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
