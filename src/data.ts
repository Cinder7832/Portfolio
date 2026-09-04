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

export type Artwork = {
  id: string;
  title: string;
  kind: "2D" | "3D";
  medium: string;
  year: string;
  summary: string;
  description: string;
  tags: string[];
  imageSeed: string;
  imageUrl?: string;
  modelUrl?: string;
  aspect: "portrait" | "landscape" | "square" | "tall";
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

export const artworks: Artwork[] = [
  {
    id: "watchful-eye-study",
    title: "Watchful Eye Study",
    kind: "2D",
    medium: "Graphite sketch",
    year: "2026",
    summary: "A close study of texture, shadow, and tension in a single framed moment.",
    description:
      "Built around tight pencil marks and dense contrast, this piece focuses on expression through cropping and surface detail.",
    tags: ["Sketching", "Graphite", "Character"],
    imageSeed: "graphite-eye-hands-study",
    aspect: "tall",
  },
  {
    id: "hanging-houses",
    title: "Hanging Houses",
    kind: "2D",
    medium: "Concept art",
    year: "2026",
    summary: "Layered architectural forms designed as a compact fantasy environment.",
    description:
      "A worldbuilding piece exploring stacked homes, wood structures, and readable silhouettes for a game-ready space.",
    tags: ["Environment", "Architecture", "Worldbuilding"],
    imageSeed: "fantasy-hanging-houses-concept",
    aspect: "landscape",
  },
  {
    id: "okinawa-poster",
    title: "Okinawa Poster",
    kind: "2D",
    medium: "Digital poster",
    year: "2025",
    summary: "A bold poster-style image using graphic shape, flat colour, and travel-inspired composition.",
    description:
      "This poster leans into clean colour blocks and simplified natural forms, balancing readable typography with an illustrated focal point.",
    tags: ["Poster", "Digital", "Graphic"],
    imageSeed: "okinawa-poster-bonsai",
    aspect: "portrait",
  },
  {
    id: "ruined-chapel",
    title: "Ruined Chapel",
    kind: "2D",
    medium: "Environment study",
    year: "2025",
    summary: "A quiet architectural scene focused on atmosphere, scale, and negative space.",
    description:
      "A moody environment study shaped around stone textures, winter light, and the feeling of discovering a place with history.",
    tags: ["Environment", "Architecture", "Mood"],
    imageSeed: "snow-ruined-chapel-art",
    aspect: "portrait",
  },
  {
    id: "mechanical-parts",
    title: "Mechanical Parts",
    kind: "2D",
    medium: "Prop sheet",
    year: "2025",
    summary: "A reusable set of industrial prop details for worldbuilding and scene dressing.",
    description:
      "A prop exploration focused on pipes, valves, worn metal, and repeatable shapes that can support a larger environment.",
    tags: ["Props", "Industrial", "Reference"],
    imageSeed: "copper-pipes-prop-sheet",
    aspect: "square",
  },
  {
    id: "night-tree",
    title: "Night Tree",
    kind: "2D",
    medium: "Digital painting",
    year: "2025",
    summary: "A vertical atmospheric piece built with deep contrast and a sharp silhouette.",
    description:
      "This study experiments with dramatic tree shapes, low light, and a narrow vertical crop to create a more cinematic frame.",
    tags: ["Digital", "Atmosphere", "Silhouette"],
    imageSeed: "dark-night-tree-silhouette",
    aspect: "tall",
  },
  {
    id: "stylised-crate-model",
    title: "Stylised Crate Model",
    kind: "3D",
    medium: "Low-poly 3D model",
    year: "2026",
    summary: "A compact prop model focused on readable silhouette, bevels, and game-ready shape language.",
    description:
      "A 3D prop study for practicing clean forms, simple material separation, and a turntable-ready presentation style.",
    tags: ["3D", "Prop", "Low-poly"],
    imageSeed: "stylised-wooden-crate-model",
    aspect: "square",
  },
  {
    id: "modular-tower-model",
    title: "Modular Tower Model",
    kind: "3D",
    medium: "Environment asset",
    year: "2026",
    summary: "A vertical modular structure exploring stacked shapes, roof forms, and fantasy asset proportions.",
    description:
      "A model-viewer entry for environment assets. Replace the procedural preview with a real GLB file when the finished model is ready.",
    tags: ["3D", "Environment", "Modular"],
    imageSeed: "fantasy-modular-tower-model",
    aspect: "portrait",
  },
];
