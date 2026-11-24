export type Project = {
  id: string;
  title: string;
  category: "Games" | "3D" | "2D Art" | "Tools";
  caseStudyStatus: "published" | "draft";
  summary: string;
  description: string;
  stack: string[];
  highlights: string[];
  imageSeed: string;
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
};

export type ArtworkViewerConfig = {
  preset?: "blender-studio";
  exposure?: number;
  cameraDistanceMultiplier?: number;
  targetYOffset?: number;
  modelYaw?: number;
  keyIntensity?: number;
  fillIntensity?: number;
  rimIntensity?: number;
  autoRotate?: boolean;
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
  viewer?: ArtworkViewerConfig;
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
    id: "cubo",
    title: "Cubo",
    category: "Games",
    caseStudyStatus: "published",
    summary: "A 2D Metroidvania with combat, exploration, and boss fights.",
    description:
      "Cubo is a solo Unity project set in an abandoned crystal mine. I designed and built the connected world, movement, combat, enemies, bosses, interface, lighting, shaders, and progression systems, then kept iterating after the original submission.",
    stack: ["Unity 6", "C#", "Aseprite", "ShaderLab", "GitHub"],
    highlights: [
      "Ground slam combat, sprinting, wall climbing, variable jumps, and full gamepad support with haptics.",
      "Two bosses with multiple phases, different damage loops, and progression gated by abilities.",
      "Custom 2D lighting, reflected water, contextual tutorials, settings, respawning, and an optional speedrun timer.",
    ],
    imageSeed: "cubo-crystal-caverns",
    imageUrl: "projects/cubo/world.png",
  },
  {
    id: "everdew",
    title: "Everdew",
    category: "Games",
    caseStudyStatus: "published",
    summary: "A top down pixel farming game made by four students during a three week game jam.",
    description:
      "Everdew is a top down farming game created for New College Swindon's A New Path game jam. I worked on the environment, game design, programming, and interface. The team replaced the first implementation with smaller systems and continued updating the game after the jam.",
    stack: ["Unity", "C#", "Aseprite", "GitHub", "Trello"],
    highlights: [
      "Farming, inventory, shops, animals, day and night, NPCs, perks, and a 30-day economy loop.",
      "Four person development using modular scripts, version control, Trello, and assigned production roles.",
      "Later releases added balance changes, shop restocking, interface updates, and save/load support.",
    ],
    imageSeed: "everdew-pixel-farm",
    imageUrl: "projects/everdew/farm-village.png",
    liveUrl: "https://cinder7832.itch.io/everdew",
  },
  {
    id: "ravensdown",
    title: "Ravensdown",
    category: "Games",
    caseStudyStatus: "published",
    summary: "A medieval Unreal Engine environment about a settlement left behind after war and disease.",
    description:
      "Ravensdown is a solo environment study created for the theme After the Fall. I planned the route, assembled six modular houses, created reusable Packed Level Actors, customised the terrain material, revised the forest, and developed the final HDRI lighting and atmosphere.",
    stack: ["Unreal Engine 5.8", "Landscape", "Packed Level Actors", "Quixel Megascans", "Trello"],
    highlights: [
      "One readable route through six modular house variations, a waterwheel area, and a candle lit cemetery ending.",
      "A production change from experimental Mesh Terrain to the established Landscape workflow.",
      "A complete atmosphere revision using taiga trees, an HDRI sky, Local Fog Volumes, and controlled warm lighting.",
    ],
    imageSeed: "ravensdown-medieval-valley",
    imageUrl: "projects/ravensdown/image1.png",
  },
  {
    id: "forgotten-line",
    title: "The Forgotten Line",
    category: "Games",
    caseStudyStatus: "published",
    summary: "A team horror environment linking a Victorian hotel to an abandoned underground mine.",
    description:
      "The Forgotten Line is a three person Unity HDRP project. I set up the project and collaboration workflow, revised the hotel lobby, helped complete the elevator transition, built the interface and controller support, lit the tunnels, and constructed the final cavern section.",
    stack: ["Unity 2022.3", "HDRP", "C#", "Blender", "GitHub", "Scene Fusion"],
    highlights: [
      "A linear flashlight led route with walking, sprinting, crouching, audio triggers, and environmental storytelling.",
      "Main menu, pause menu, quality presets, resolution, fullscreen, volume, gamepad input, and a virtual cursor.",
      "Original jug, crate, and table assets documented alongside the hotel and mine production process.",
    ],
    imageSeed: "forgotten-line-horror-tunnel",
    imageUrl: "projects/forgotten-line/image40.png",
  },
  {
    id: "constructed",
    title: "Constructed",
    category: "Games",
    caseStudyStatus: "published",
    summary: "A third person construction site speedrun built around machinery and physics hazards.",
    description:
      "Constructed is a solo Unity platformer with a continuous speedrun route. I built the site with ProBuilder, customised the third person controller, and created moving pistons, pipes, rotating boards, a Hinge Joint wrecking ball, hazard respawning, menus, and a timer.",
    stack: ["Unity", "HDRP", "C#", "ProBuilder", "Blender", "GitHub"],
    highlights: [
      "Grounded obstacle design based on construction machinery instead of floating platforms.",
      "A continuous route with no checkpoints and a timer displaying minutes, seconds, and milliseconds.",
      "A grey and white prototype visual system supported by volumetric clouds, global illumination, and ambient occlusion.",
    ],
    imageSeed: "constructed-platformer-site",
    imageUrl: "projects/constructed/image1.png",
  },
  {
    id: "automation-lab",
    title: "Automation Lab",
    category: "Games",
    caseStudyStatus: "draft",
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
    caseStudyStatus: "draft",
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

export const publishedProjects = projects.filter(
  (project): project is Project & { caseStudyStatus: "published" } => project.caseStudyStatus === "published",
);

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
    id: "primordial-jade-winged-spear",
    title: "Primordial Jade Winged-Spear (Genshin Impact)",
    kind: "3D",
    medium: "Stylized 3D model",
    year: "2025",
    summary: "A stylized 3D model of the Primordial Jade Winged-Spear from Genshin Impact.",
    description: "A game-ready 3D prop with a clean wireframe and topology.",
    tags: ["3D", "Prop", "Stylized"],
    imageSeed: "primordial-jade-winged-spear",
    modelUrl: "artwork/Primordial Jade Winged-Spear.glb",
    aspect: "portrait",
  },
  {
    id: "blockbench-skeleton",
    title: "Blockbench Skeleton",
    kind: "3D",
    medium: "Character model",
    year: "2026",
    summary: "A character model created in Blockbench.",
    description: "A character model created in Blockbench.",
    tags: ["3D", "Character", "Blockbench"],
    imageSeed: "blockbench-skeleton",
    modelUrl: "artwork/Skeleton.gltf",
    aspect: "portrait",
  },
  {
    id: "blockbench-spider-queen",
    title: "Blockbench Spider Queen",
    kind: "3D",
    medium: "Character model",
    year: "2026",
    summary: "A character model of a boss for Rebound created in Blockbench.",
    description: "A character model of a boss for Rebound created in Blockbench.",
    tags: ["3D", "Character", "Blockbench"],
    imageSeed: "blockbench-spider-queen",
    modelUrl: "artwork/Spider Queen.gltf",
    aspect: "portrait",
  },
  {
    id: "cup",
    title: "Cup",
    kind: "3D",
    medium: "Prop model",
    year: "2026",
    summary: "A 3D model of a cup created in Blender.",
    description: "A 3D model of a cup created in Blender.",
    tags: ["3D", "Prop", "Blender"],
    imageSeed: "cup-3d-model",
    modelUrl: "artwork/Cup.glb",
    aspect: "portrait",
  },
  {
    id: "tnt",
    title: "Blockbench TNT",
    kind: "3D",
    medium: "Prop model",
    year: "2026",
    summary: "A 3D model of a TNT created in Blockbench.",
    description: "A 3D model of a TNT created in Blockbench.",
    tags: ["3D", "Prop", "Blockbench"],
    imageSeed: "tnt-3d-model",
    modelUrl: "artwork/TNT.gltf",
    aspect: "portrait",
  },
  {
    id: "jug",
    title: "Jug",
    kind: "3D",
    medium: "Prop model",
    year: "2026",
    summary: "A 3D model of a Jug created in Blender.",
    description: "A 3D model of a Jug created in Blender.",
    tags: ["3D", "Prop", "Blender"],
    imageSeed: "jug-3d-model",
    modelUrl: "artwork/Jug.glb",
    aspect: "portrait",
  },
  {
    id: "barrel",
    title: "Barrel",
    kind: "3D",
    medium: "Prop model",
    year: "2026",
    summary: "A 3D model of a Barrel created in Blender.",
    description: "A 3D model of a Barrel created in Blender.",
    tags: ["3D", "Prop", "Blender"],
    imageSeed: "barrel-3d-model",
    modelUrl: "artwork/Barrel.glb",
    aspect: "portrait",
  },
  {
    id: "woven-basket",
    title: "Woven Basket",
    kind: "3D",
    medium: "Prop model",
    year: "2026",
    summary: "A 3D model of a Woven Basket created in Blender.",
    description: "A 3D model of a Woven Basket created in Blender.",
    tags: ["3D", "Prop", "Blender"],
    imageSeed: "woven-basket-3d-model",
    modelUrl: "artwork/Woven Basket.glb",
    aspect: "portrait",
  },
  {
    id: "banana",
    title: "Banana",
    kind: "3D",
    medium: "Prop model",
    year: "2026",
    summary: "A 3D model of a Banana created in Blender.",
    description: "A 3D model of a Banana created in Blender.",
    tags: ["3D", "Prop", "Blender"],
    imageSeed: "banana-3d-model",
    modelUrl: "artwork/Banana.glb",
    aspect: "portrait",
  },
  {
    id: "chair",
    title: "Chair",
    kind: "3D",
    medium: "Prop model",
    year: "2026",
    summary: "A 3D model of a Chair created in Blender.",
    description: "A 3D model of a Chair created in Blender.",
    tags: ["3D", "Prop", "Blender"],
    imageSeed: "chair-3d-model",
    modelUrl: "artwork/Chair.glb",
    aspect: "portrait",
  },
  {
    id: "candle",
    title: "Candle",
    kind: "3D",
    medium: "Prop model",
    year: "2026",
    summary: "A 3D model of a Candle created in Blender.",
    description: "A 3D model of a Candle created in Blender.",
    tags: ["3D", "Prop", "Blender"],
    imageSeed: "candle-3d-model",
    modelUrl: "artwork/Candle.glb",
    aspect: "portrait",
  },
  {
    id: "casket",
    title: "Casket",
    kind: "3D",
    medium: "Prop model",
    year: "2026",
    summary: "A 3D model of a Casket created in Blender.",
    description: "A 3D model of a Casket created in Blender.",
    tags: ["3D", "Prop", "Blender"],
    imageSeed: "casket-3d-model",
    modelUrl: "artwork/Casket.glb",
    aspect: "portrait",
  },
];
