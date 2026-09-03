export type Project = {
  id: string;
  title: string;
  category: "Games" | "3D" | "2D Art" | "Tools";
  summary: string;
  description: string;
  stack: string[];
  highlights: string[];
  imageSeed: string;
  githubUrl?: string;
  liveUrl?: string;
};

export const profile = {
  name: "Devanand Asai",
  role: "Developer focused on clean, practical digital products.",
  email: "devanandasai08@gmail.com",
  github: "https://github.com/Cinder7832",
  linkedin: "https://www.linkedin.com/in/devanand-asai/",
};

export const projects: Project[] = [
  {
    id: "ops-dashboard",
    title: "Operations Dashboard",
    category: "Tools",
    summary: "A responsive analytics surface for tracking tasks, signals, and team momentum.",
    description:
      "A focused dashboard concept built around quick scanning, clear hierarchy, and low-friction decision making. The interface is designed for repeated daily use rather than one-time presentation.",
    stack: ["React", "TypeScript", "Tailwind", "Charts"],
    highlights: [
      "Dense summary cards with stable responsive sizing.",
      "Filtering-ready data model for future API integration.",
      "Calm interface language for operational workflows.",
    ],
    imageSeed: "developer-dashboard-workspace",
    githubUrl: "https://github.com/Cinder7832",
  },
  {
    id: "portfolio-system",
    title: "Portfolio System",
    category: "Tools",
    summary: "A clean personal site architecture with editable project data and animated case-study overlays.",
    description:
      "The portfolio you are viewing: a single-page, GitHub Pages-ready React site with project content isolated into a data file and interaction behavior kept accessible.",
    stack: ["Vite", "React", "GSAP", "GitHub Pages"],
    highlights: [
      "Single-page navigation with smooth anchored sections.",
      "Accessible project overlay with Escape and backdrop close.",
      "Production build configured for repository-based Pages hosting.",
    ],
    imageSeed: "minimal-portfolio-interface",
    liveUrl: "https://cinder7832.github.io/Portfolio/",
  },
  {
    id: "automation-lab",
    title: "Automation Lab",
    category: "Games",
    summary: "Prototype tooling for turning repetitive manual workflows into dependable browser actions.",
    description:
      "A placeholder case study for automation experiments, built to show problem framing, interaction design, and engineering taste. Replace this with one of your real repositories when ready.",
    stack: ["JavaScript", "APIs", "Workflow Design"],
    highlights: [
      "Maps manual processes into observable steps.",
      "Separates configuration from execution behavior.",
      "Designed with verification checkpoints before completion.",
    ],
    imageSeed: "automation-code-lab",
    githubUrl: "https://github.com/Cinder7832",
  },
  {
    id: "learning-platform",
    title: "Learning Platform Concept",
    category: "2D Art",
    summary: "A study-friendly interface for organizing topics, progress, notes, and next actions.",
    description:
      "A concept project shaped around clarity and momentum: what to learn next, what has been completed, and what needs review. It is ready to be swapped with a finished academic or product project.",
    stack: ["React", "UX Systems", "Local Data"],
    highlights: [
      "Progress-first information architecture.",
      "Simple card model that scales into lessons or modules.",
      "Readable visual system for long study sessions.",
    ],
    imageSeed: "learning-platform-minimal",
  },
];
