import { useRef, useState } from "react";
import { caseStudyDefinitions } from "./definitions";
import CaseStudyShell from "./CaseStudyShell";
import { CaseStudyShowcaseImage, CaseStudyShowcaseRail } from "./CaseStudyMedia";
import ChangelogAccordion, { type ChangelogEntry } from "./ChangelogAccordion";
import { usePrefersReducedMotion } from "../motion";
import { projectSummary } from "./projectSummary";

type StudyId = "ravensdown" | "forgotten-line" | "constructed";

type Media = {
  file: string;
  title: string;
  alt: string;
};

type StudyDesign = "editorial" | "cinematic" | "industrial";

type StudyConfig = {
  id: StudyId;
  design: StudyDesign;
  title: string;
  hero: Media;
  palette: {
    page: string;
    panel: string;
    accent: string;
    soft: string;
  };
  summary: string;
  meta: Array<[string, string]>;
  showcase: Media[];
  overview: Array<{ title: string; body: string }>;
  researchIntro: string;
  research: Array<{ title: string; body: string }>;
  gameplayIntro: string;
  gameplay: Array<{ title: string; body: string; media?: Media }>;
  processIntro: string;
  process: Array<{ title: string; body: string; media: Media }>;
  extrasIntro: string;
  extras: Array<{ title: string; body: string; media: Media[] }>;
  changelog: ChangelogEntry[];
  reflection: string[];
  reflectionMedia: Media;
};

const image = (id: StudyId, file: string) => `${import.meta.env.BASE_URL}projects/${id}/${file}`;

const studies: Record<StudyId, StudyConfig> = {
  ravensdown: {
    id: "ravensdown",
    design: "editorial",
    title: "Ravensdown",
    hero: { file: "image1.png", title: "Ravensdown valley", alt: "Dark medieval settlement in a forested mountain valley" },
    palette: { page: "#0b0d0d", panel: "#151918", accent: "#d8a258", soft: "#c9d0c8" },
    summary: "A medieval environment created for the theme After the Fall. The route presents a remote settlement after war and disease disrupted the community that lived there.",
    meta: [["Role", "Environment design and technical assembly"], ["Engine", "Unreal Engine 5.8"], ["Scope", "Solo college project"], ["Outcome", "Explorable medieval environment"]],
    showcase: [
      { file: "image1.png", title: "Valley route", alt: "Ravensdown route through a dark mountain valley" },
      { file: "image3.png", title: "Village approach", alt: "Medieval houses beside the forest route" },
      { file: "image78.png", title: "Waterwheel area", alt: "Abandoned waterwheel building beside dark water" },
      { file: "image79.png", title: "Cemetery ending", alt: "Candle lit cemetery at the end of the route" },
      { file: "image4.png", title: "Settlement layout", alt: "Elevated view of the Ravensdown settlement" },
      { file: "image67.png", title: "Taiga forest", alt: "Dark taiga trees framing the village route" },
    ],
    overview: [
      { title: "Brief", body: "The project required one focused outcome based on After the Fall, supported by research, planning, development, iteration, and reflection." },
      { title: "Interpretation", body: "The environment shows the period after a collapse rather than the disaster itself. Empty paths, neglected buildings, overgrowth, and isolated lights suggest that ordinary life stopped." },
      { title: "Contribution", body: "I built the terrain, planned the route, assembled six houses from modular parts, created reusable Packed Level Actors, customised the landscape material, and developed the lighting and atmosphere." },
      { title: "Intended experience", body: "The route uses slow exploration and environmental storytelling. Cold moonlight and dark vegetation create uncertainty, while limited warm lights mark important areas." },
    ],
    researchIntro: "Research covered medieval settlement structure, material choices, environmental storytelling, reference games, and the Unreal Engine systems needed to build the scene.",
    research: [
      { title: "Historical context", body: "Research into the Black Death and abandoned settlements supported a location where buildings, paths, tools, and boundaries remain while vegetation begins to return." },
      { title: "Settlement structure", body: "Historic settlement research supported uneven spacing, a bending route, and a mix of timber and stone surfaces instead of a regular grid." },
      { title: "Game references", body: "A Plague Tale: Requiem informed restricted sightlines and warm local lights. Elden Ring informed landmarks and visual layering. Kingdom Come: Deliverance informed the scale and spacing of ordinary medieval buildings." },
      { title: "Technical research", body: "The project compared Mesh Terrain with the established Landscape system, then reviewed HDRI lighting, Lumen, foliage placement, Volumetric Fog, and Local Fog Volumes." },
    ],
    gameplayIntro: "Ravensdown is structured as a readable exploration route rather than a combat level. The environment carries the narrative and guides movement through composition.",
    gameplay: [
      { title: "Route", body: "The path bends through the settlement and limits long views. Buildings, slopes, and vegetation reveal the location in stages.", media: { file: "image66.png", title: "Route framing", alt: "Village route framed by trees and mountains" } },
      { title: "Landmarks", body: "The mountain range remains visible as a background landmark. Repeated houses and warm lights help identify the direction of travel.", media: { file: "image76.png", title: "Mountain landmark", alt: "Ravensdown with mountains visible behind the forest" } },
      { title: "Ending", body: "A candle lit cemetery gives the route a defined destination and leaves the source of the lights unresolved.", media: { file: "image5.png", title: "Cemetery", alt: "Cemetery area lit by candles" } },
    ],
    processIntro: "The environment moved from terrain and white boxes to modular buildings, a revised forest, and a controlled final atmosphere.",
    process: [
      { title: "Terrain and whiteboxing", body: "The first pass established the valley, mountains, settlement area, and route. Ground level tests changed the spacing and position of several structures.", media: { file: "image71.png", title: "Early terrain", alt: "Early Unreal Engine terrain before the village was built" } },
      { title: "Modular houses", body: "I assembled six house variations from stone walls, timber supports, roofs, and smaller details. Packed Level Actors made each building easier to reuse and reposition.", media: { file: "image60.png", title: "House variations", alt: "Several modular medieval house variations in Unreal Engine" } },
      { title: "Landscape material", body: "An existing landscape master material provided the technical base. I replaced its textures and adjusted the blend for mud, grass, and rough ground.", media: { file: "image64.png", title: "Landscape material", alt: "Unreal Engine material settings for the landscape" } },
      { title: "Atmosphere", body: "The default sky and heavy global fog did not provide the required control. An HDRI sky, restrained fog, and selected Local Fog Volumes produced the final overcast lighting.", media: { file: "image69.png", title: "HDRI lighting", alt: "Ravensdown environment using the final HDRI sky" } },
    ],
    extrasIntro: "The project used sourced modular and natural assets. These details document how they were selected, organised, and adapted within the environment.",
    extras: [
      { title: "Asset assembly", body: "The Medieval Village pack supplied compatible architectural pieces. Quixel Megascans supplied terrain, rock, and vegetation assets. My work focused on selection, scale, placement, repetition control, layout, and integration.", media: [
        { file: "image26.png", title: "Modular source", alt: "Modular medieval building pieces in Unreal Engine" },
        { file: "image58.png", title: "House assembly", alt: "First modular house under construction" },
        { file: "image62.png", title: "Packed Level Actor", alt: "Completed medieval house prepared as a reusable asset" },
      ] },
      { title: "Production organisation", body: "A Trello board tracked research, blockout, environment work, lighting, optimisation, and documentation. The project folders separated maps, materials, village content, foliage, and effects.", media: [
        { file: "image55.png", title: "Trello board", alt: "Trello production board for Ravensdown" },
        { file: "image75.png", title: "Content folders", alt: "Organised Unreal Engine content folders" },
        { file: "image57.png", title: "Repository", alt: "GitHub repository used as an online backup" },
      ] },
      { title: "Major visual iteration", body: "The first European trees felt too green for the mountain setting. Darker taiga trees improved the silhouettes and colour palette, so the forest framing was rebuilt around them.", media: [
        { file: "image34.png", title: "European trees", alt: "Earlier greener tree set in the environment" },
        { file: "image65.png", title: "Taiga trees", alt: "Darker taiga trees used in the revised environment" },
        { file: "image77.png", title: "Atmosphere iteration", alt: "Revised sky and atmosphere across the route" },
      ] },
    ],
    changelog: [
      { version: "1.0.0", date: "2026-10-15", title: "First release", body: ["- Fully playable version of Ravensdown"] },
    ],
    reflection: [
      "The project improved my understanding of terrain, modular construction, Packed Level Actors, landscape materials, foliage, HDRI lighting, and atmospheric effects.",
      "The strongest result is the atmosphere created by the overcast sky, taiga trees, mountain backdrop, and limited warm lighting. The six modular houses add variation without introducing unrelated architectural styles.",
      "Some shadows still hide surface detail. A further pass would add environmental sound and subtle motion such as wind, rolling fog, and a moving waterwheel.",
    ],
    reflectionMedia: { file: "image3.png", title: "Final settlement", alt: "Final Ravensdown settlement beneath the mountain sky" },
  },
  "forgotten-line": {
    id: "forgotten-line",
    design: "cinematic",
    title: "The Forgotten Line",
    hero: { file: "image40.png", title: "The Forgotten Line tunnel", alt: "Dark abandoned mine tunnel lit by a flashlight" },
    palette: { page: "#090806", panel: "#18110d", accent: "#df683c", soft: "#d9c9bd" },
    summary: "A team horror project set in a Victorian hotel and an abandoned mine. The player follows a linear route using a flashlight, environmental detail, and audio cues to understand what happened.",
    meta: [["Role", "Environment, interface, controls, and technical setup"], ["Engine", "Unity 2022.3.9f1 HDRP"], ["Team", "Devanand Asai, Riley Gough, Hiro Starritt"], ["Date", "November 2025"]],
    showcase: [
      { file: "image38.png", title: "Victorian hotel", alt: "Red Victorian hotel room in The Forgotten Line" },
      { file: "image39.png", title: "Cave route", alt: "Rock tunnel lit from deeper inside the cave" },
      { file: "image40.png", title: "Flashlight exploration", alt: "Dark tunnel illuminated by the player's flashlight" },
      { file: "image60.png", title: "Mine chamber", alt: "Large mine chamber with rails and scattered props" },
      { file: "image66.png", title: "Red tunnel", alt: "Mine passage lit with a red light" },
      { file: "image70.png", title: "Water cavern", alt: "Cavern environment with water and a wooden structure" },
    ],
    overview: [
      { title: "Premise", body: "A technician arrives at a Victorian hotel to repair an elevator. The elevator falls through the foundations into a forgotten mine, where the player must find a route out." },
      { title: "Direction", body: "The project avoids constant jump scares. Lighting, restricted visibility, voices, ambient audio, and environmental details create tension and leave the cause of the collapse unresolved." },
      { title: "My responsibility", body: "I set up the Unity project and collaboration workflow, reduced the hotel lobby scope, helped complete the elevator transition, built the interface and options, refactored controls, lit the tunnels, and constructed the second cavern section." },
      { title: "Scope", body: "The final build focuses on exploration. Planned flashlight battery management and interaction outlines were cut after technical issues and time constraints." },
    ],
    researchIntro: "The team used horror games, film and television references, tunnel plans, and early playtesting to define the route and atmosphere.",
    research: [
      { title: "Visual references", body: "Resident Evil, A Plague Tale: Requiem, Stranger Things, Outlast, and Gurren Lagann informed the dark hotel, underground setting, lighting, and enclosed route." },
      { title: "Level planning", body: "Concept sketches divided the project into a hotel opening and a linear mine route. The smaller scope helped the team focus on atmosphere and the required environment work." },
      { title: "Playtesting", body: "Early feedback identified missing collision, unclear direction, limited audio, and an atmosphere that was only mildly effective. The production work then added boundaries, route cues, lighting, and audio systems." },
      { title: "Asset research", body: "Quixel Megascans provided cave materials, ZNS3D provided Victorian elements, and Poly Haven supplied textures. The team reduced oversized Megascans downloads after they increased the project size." },
    ],
    gameplayIntro: "The player walks, sprints, and crouches through a linear horror route. A flashlight and controlled sightlines support navigation while audio triggers suggest events outside the visible space.",
    gameplay: [
      { title: "Movement", body: "The controller supports keyboard, mouse, and gamepad input. Crouching opens hidden paths and the virtual cursor supports controller navigation in menus.", media: { file: "image58.png", title: "Interaction prompt", alt: "Interaction prompt inside the hotel" } },
      { title: "Atmosphere", body: "The scenes remove natural directional light. Vignette, brightness, contrast, local lights, and fog support the claustrophobic presentation.", media: { file: "image61.png", title: "Fog and light", alt: "Foggy mine chamber with a bright overhead light" } },
      { title: "Audio route", body: "Footsteps, radios, ambient sound, music, clocks, and triggered voices build tension. The ending slows the player, disables the flashlight, and uses sound before the credits.", media: { file: "image53.png", title: "Radio", alt: "Interactive radio in the hotel scene" } },
    ],
    processIntro: "Production moved from collaborative planning to the hotel, then the elevator transition, tunnel environment, interface, and final atmosphere.",
    process: [
      { title: "Project setup", body: "I created the Unity HDRP project and integrated Scene Fusion so the team could work in the same scene. The team also used GitHub for version control.", media: { file: "image55.png", title: "Organised project", alt: "Organised Unity project folders for The Forgotten Line" } },
      { title: "Hotel revision", body: "The first lobby was too large for the available assets. I reduced it to a smaller, denser room and the team enabled light shadow casting to correct the indoor lighting.", media: { file: "image42.png", title: "Hotel development", alt: "Victorian hotel scene during Unity development" } },
      { title: "Tunnel construction", body: "Hiro mapped the first section. I lit that route, added minecarts and rails, finalised crouching, and built the second section as a large cavern with HDRP water and an illuminated escape route.", media: { file: "image57.png", title: "Cave layout", alt: "Cave geometry during Unity development" } },
      { title: "Interface and controls", body: "I created the main menu, shared pause menu, quality presets, resolution control, fullscreen setting, and volume slider. The movement system was refactored to Unity's Input System for controller support.", media: { file: "image52.png", title: "Graphics settings", alt: "Graphics settings menu with resolution and quality controls" } },
    ],
    extrasIntro: "The assignment also required original assets and documented production decisions. These materials are grouped here because they support the environment rather than the core route.",
    extras: [
      { title: "Original prop work", body: "I created a jug, crate, and table in Blender. The jug used loop cuts, a curve handle, Solidify, and Subdivision Surface. The crate used manual UV work and wood textures. The table used primitive forms, bevelled edges, and BlenderKit materials.", media: [
        { file: "image21.png", title: "Jug render", alt: "Rendered jug model created for the project" },
        { file: "image28.png", title: "Crate render", alt: "Rendered wooden crate created for the project" },
        { file: "image33.png", title: "Table render", alt: "Rendered wooden table created for the project" },
      ] },
      { title: "Interface", body: "The main menu, graphics settings, and pause menu use a monochrome horror style with high contrast controls. Interaction prompts were tested in the hotel scene.", media: [
        { file: "image51.png", title: "Main menu", alt: "The Forgotten Line main menu" },
        { file: "image52.png", title: "Options", alt: "The Forgotten Line graphics settings" },
        { file: "image54.png", title: "Pause menu", alt: "The Forgotten Line pause menu" },
      ] },
      { title: "Cut door interaction", body: "A supplied door had an incorrect pivot. I corrected the model in Blender, but the fixed version was not integrated before the deadline.", media: [
        { file: "image72.png", title: "Door before correction", alt: "Door model with its original pivot in Blender" },
        { file: "image73.png", title: "Door correction", alt: "Door model after pivot correction in Blender" },
      ] },
    ],
    changelog: [
      { version: "0.1.0", date: "2026-01-03", title: "First release", body: ["- Fully playable version of The Forgotten Line"] },
    ],
    reflection: [
      "The team completed the hotel, elevator sequence, tunnel route, interface, audio systems, and ending within the project deadline.",
      "The main production problems came from oversized assets, missing Victorian content, merge conflicts, Git LFS bandwidth, rendering issues with outlines, and Unity builds that required temporary files to be cleared.",
      "A future project would begin with a shared naming convention and a smaller asset resolution target. The team also recorded a future goal to focus more directly on mechanics after this level design project.",
    ],
    reflectionMedia: { file: "image68.png", title: "Final route", alt: "Final red lit mine passage in The Forgotten Line" },
  },
  constructed: {
    id: "constructed",
    design: "industrial",
    title: "Constructed",
    hero: { file: "image1.png", title: "Constructed site", alt: "White box construction site level with cranes and obstacles" },
    palette: { page: "#0d1012", panel: "#1a1f22", accent: "#ef6c43", soft: "#d5dadd" },
    summary: "A solo third person speedrun level set on a construction site. Obstacles use construction machinery and physically plausible movement instead of floating platforms.",
    meta: [["Role", "Solo design and development"], ["Engine", "Unity HDRP"], ["Tools", "ProBuilder, Blender, GitHub"], ["Date", "November 2025"]],
    showcase: [
      { file: "image1.png", title: "Construction site", alt: "Wide view of the Constructed level" },
      { file: "image17.jpg", title: "Site route", alt: "Construction route with platforms and a crane" },
      { file: "image19.jpg", title: "Wrecking ball", alt: "Wrecking ball obstacle suspended from a crane" },
      { file: "image20.jpg", title: "Piston section", alt: "Piston and pipe obstacles in the level" },
      { file: "image23.jpg", title: "Industrial obstacles", alt: "Construction obstacles and cargo arranged along the route" },
      { file: "image34.png", title: "Speedrun HUD", alt: "Constructed gameplay with the speedrun timer visible" },
    ],
    overview: [
      { title: "Concept", body: "The level uses a construction site theme and avoids floating platforms or structures that contradict the setting. The obstacles remain recognisable as machinery, pipes, boards, and building elements." },
      { title: "Goal", body: "The player completes one continuous route as quickly as possible. There are no checkpoints. Contact with a hazard returns the player to the start." },
      { title: "Visual direction", body: "A grey and white prototype style keeps the route readable. HDRP lighting, volumetric clouds, global illumination, and ambient occlusion add depth to the simple forms." },
      { title: "Scope", body: "The final project includes a third person controller, moving machinery, physics hazards, a timer, a main menu, a pause menu, audio control, and a completed route." },
    ],
    researchIntro: "Research compared platformers, construction games, prototype styled games, and a hand drawn route plan before production began.",
    research: [
      { title: "Platform references", body: "Hollow Knight, Fall Guys, and Sonic the Hedgehog provided examples of movement, obstacle readability, and route pacing across different platformer styles." },
      { title: "Visual references", body: "Construction Simulator informed the machinery and setting. Karlson and Banana Shooter informed the raw prototype surfaces and limited palette." },
      { title: "Route plan", body: "The top down map kept the level short enough for the deadline and organised the route into an introduction, exploration, harder challenge section, and goal area." },
      { title: "Technical reference", body: "Unity Starter Assets provided the controller base. A tutorial supported the Hinge Joint chain used for the wrecking ball, and Pixabay supplied the background music." },
    ],
    gameplayIntro: "Constructed combines third person movement with a continuous speedrun route. The obstacle set becomes more demanding near the end while keeping each hazard tied to the construction theme.",
    gameplay: [
      { title: "Player movement", body: "A customised Starter Assets controller handles movement, sprint interpolation, jumping, and gravity. A camera collider prevents Cinemachine from passing through level geometry.", media: { file: "image22.png", title: "Player route", alt: "Third person player moving through Constructed" } },
      { title: "Moving machinery", body: "Pistons use PingPong movement. Pipes interpolate between two points. Rotating boards use continuous time based rotation.", media: { file: "image20.jpg", title: "Moving machinery", alt: "Moving pipe and piston obstacles" } },
      { title: "Physics hazards", body: "The wrecking ball uses Hinge Joints for the chain and repeated force to maintain its swing. Touching a hazard returns the player to the start.", media: { file: "image19.jpg", title: "Crane hazard", alt: "Crane and wrecking ball obstacle" } },
      { title: "Speedrun loop", body: "Trigger volumes start and stop a timer that displays minutes, seconds, and milliseconds. The lack of checkpoints makes the full route one continuous attempt.", media: { file: "image34.png", title: "Timer", alt: "Speedrun timer displayed during gameplay" } },
    ],
    processIntro: "The project used an in engine blockout so platform distances and obstacle timing could be tested without repeated exports.",
    process: [
      { title: "Map and blockout", body: "The route was sketched before production, then built with Unity primitives and ProBuilder. The short plan protected the deadline and kept the level focused.", media: { file: "image16.jpeg", title: "Top down plan", alt: "Hand drawn top down plan for Constructed" } },
      { title: "Environment construction", body: "Buildings, cargo, cranes, and structural forms were made in Unity. ProBuilder made it possible to change height and spacing during playtests.", media: { file: "image18.png", title: "Unity blockout", alt: "Constructed level open in the Unity editor" } },
      { title: "Obstacle scripting", body: "Separate scripts control pistons, pipes, rotating boards, the wrecking ball, hazards, and the timer. The implementation keeps each obstacle behaviour focused.", media: { file: "image29.png", title: "Obstacle code", alt: "Constructed obstacle script in the code editor" } },
      { title: "Menus and audio", body: "The final loop includes a main menu, pause menu, and volume control. Pausing reduces the background music level.", media: { file: "image26.png", title: "Main menu", alt: "Constructed main menu in the Unity editor" } },
    ],
    extrasIntro: "Supporting work covered project organisation, version control, and one original Blender asset used as an Easter egg.",
    extras: [
      { title: "Professional practice", body: "The Unity hierarchy and project files were organised into folders and subfolders. GitHub stored the project history and backup.", media: [
        { file: "image25.png", title: "Unity hierarchy", alt: "Organised Constructed hierarchy and assets" },
        { file: "image27.png", title: "Version history", alt: "Git version history for Constructed" },
        { file: "image28.png", title: "Repository", alt: "Constructed repository on GitHub" },
      ] },
      { title: "Gurren Lagann glasses", body: "I created the red glasses from flat planes in Blender, duplicated vertices to form the silhouette, and used Solidify to add thickness. A translucent red material separates the asset from the grey environment.", media: [
        { file: "image33.png", title: "Glasses model", alt: "Red stylised glasses model created in Blender" },
      ] },
      { title: "Script evidence", body: "The project documentation records focused scripts for movement, the timer, triggers, obstacle motion, rotation, and the wrecking ball force.", media: [
        { file: "image30.png", title: "Timer code", alt: "Speedrun timer code for Constructed" },
        { file: "image31.png", title: "Movement code", alt: "Movement script for a Constructed obstacle" },
        { file: "image32.png", title: "Hazard code", alt: "Hazard control script for Constructed" },
      ] },
    ],
    changelog: [
      { version: "0.1.0", date: "2026-01-03", title: "First release", body: ["- Fully playable version of Constructed"] },
    ],
    reflection: [
      "The largest production challenge was the wrecking ball. Building the crane and connecting each chain element with Hinge Joints took longer than writing the force script.",
      "The project met the core goal of a short construction themed route with machinery based obstacles, a continuous speedrun loop, and a clear prototype visual style.",
      "More building interiors and a ledge grab were removed because of the deadline. Future work would also test the difficulty with more players because a failure near the end currently restarts the whole route.",
    ],
    reflectionMedia: { file: "image24.jpg", title: "Final route", alt: "Final wide view across the Constructed level" },
  },
};

function SectionHeading({ children, intro, design = "editorial", dark = true }: { children: string; intro?: string; design?: StudyDesign; dark?: boolean }) {
  const headingClass = design === "editorial"
    ? "max-w-3xl font-medium leading-[0.94] tracking-[-0.06em]"
    : design === "cinematic"
      ? "max-w-5xl font-semibold leading-[0.88] tracking-[-0.065em]"
      : "max-w-5xl font-semibold uppercase leading-[0.86] tracking-[-0.075em]";
  return (
    <div className="max-w-4xl">
      <h3 className={`text-5xl md:text-8xl ${headingClass}`}>{children}</h3>
      {intro && <p className={`mt-7 max-w-3xl text-lg leading-8 ${dark ? "text-white/64" : "opacity-65"}`}>{intro}</p>}
    </div>
  );
}

function StudyPage({ id, onClose }: { id: StudyId; onClose: () => void }) {
  const config = studies[id];
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const showcaseRef = useRef<HTMLDivElement | null>(null);
  const [openChangelog, setOpenChangelog] = useState<string | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const editorial = config.design === "editorial";
  const cinematic = config.design === "cinematic";
  const industrial = config.design === "industrial";
  const tagline = projectSummary(config.id, config.summary);

  const scrollShowcase = (direction: -1 | 1) => {
    const rail = showcaseRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * Math.min(rail.clientWidth * 0.82, 680), behavior: reducedMotion ? "auto" : "smooth" });
  };

  return (
    <CaseStudyShell definition={caseStudyDefinitions[id]} scrollRef={scrollRef} onClose={onClose} className="text-white" >
      <header className="relative min-h-[42rem] overflow-hidden md:min-h-[52rem]" style={{ background: config.palette.page }}>
        <img src={image(id, config.hero.file)} alt={config.hero.alt} className="absolute inset-0 h-full w-full object-cover opacity-85" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-black/5" />
        <div className="relative mx-auto flex min-h-[42rem] max-w-7xl flex-col justify-end px-5 pb-16 pt-28 md:min-h-[52rem] md:px-8 md:pb-24">
          <h2 className="max-w-6xl text-[clamp(4rem,13vw,10rem)] font-semibold leading-[0.82] tracking-[-0.07em]">{config.title}</h2>
          <p className="mt-8 max-w-3xl text-lg leading-8 text-white/76">{tagline}</p>
        </div>
      </header>

      <CaseStudyShowcaseRail background={config.palette.page} railRef={showcaseRef} onScroll={scrollShowcase}>
        {config.showcase.map((media) => (
          <figure key={media.file} className="w-[min(82vw,43rem)] shrink-0 snap-center overflow-hidden rounded-[22px] bg-black">
            <CaseStudyShowcaseImage src={image(id, media.file)} alt={media.alt} title={media.title} />
          </figure>
        ))}
      </CaseStudyShowcaseRail>

      <section id="overview" data-case-study-chapter className={`scroll-mt-16 ${industrial ? "py-24 md:py-32" : "py-32 md:py-44"}`} style={{ background: config.palette.panel }}>
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHeading design={config.design}>Overview</SectionHeading>
          <div className={`mt-16 grid grid-flow-dense ${editorial ? "gap-y-0 border-t border-white/18 md:grid-cols-[0.72fr_1.28fr]" : cinematic ? "gap-3 md:grid-cols-12" : "overflow-hidden rounded-[30px] bg-[#ef6c43] gap-px md:grid-cols-2"}`}>
            <article className={editorial ? "border-b border-white/18 py-10 md:row-span-4 md:pr-16" : cinematic ? "rounded-[28px] bg-black/30 p-8 text-white md:col-span-9 md:p-12" : "bg-[#ef6c43] p-8 text-[#0d1012] md:col-span-2 md:p-12"}>
              <p className={`max-w-4xl font-semibold leading-[1.12] tracking-[-0.04em] ${editorial ? "text-3xl md:text-4xl" : "text-3xl md:text-5xl"}`}>{tagline}</p>
            </article>
            {config.overview.map((item, index) => <article key={item.title} className={editorial ? "border-b border-white/18 py-9 md:pl-16" : cinematic ? `${index === 0 || index === 3 ? "md:col-span-7" : "md:col-span-5"} min-h-64 rounded-[24px] bg-black/35 p-7 md:p-9` : "min-h-64 bg-[#151a1d] p-7 md:p-9"}><h4 className={`font-semibold ${industrial ? "text-3xl uppercase tracking-[-0.04em] text-[#ef6c43]" : "text-2xl"}`}>{item.title}</h4><p className="mt-5 text-lg leading-8 text-white/64">{item.body}</p></article>)}
          </div>
          <dl className={`mt-12 grid sm:grid-cols-2 lg:grid-cols-4 ${id === "ravensdown" ? "gap-3" : editorial ? "border-y border-white/18" : cinematic ? "gap-3" : "overflow-hidden rounded-[24px] gap-px bg-white/15"}`}>
            {config.meta.map(([term, value]) => <div key={term} className={id === "ravensdown" ? "rounded-[22px] p-6" : editorial ? "py-6 lg:border-r lg:border-white/18 lg:px-6 lg:first:pl-0 lg:last:border-r-0" : cinematic ? "rounded-[20px] bg-black/30 p-6" : "bg-[#0d1012] p-6"}><dt className={`text-sm font-semibold ${industrial ? "text-[#ef6c43]" : "text-white/45"}`}>{term}</dt><dd className="mt-3 text-lg font-semibold text-white/86">{value}</dd></div>)}
          </dl>
        </div>
      </section>

      <section id="research" data-case-study-chapter className="scroll-mt-16 py-32 md:py-44" style={{ background: config.palette.page }}>
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHeading design={config.design} intro={config.researchIntro}>Research</SectionHeading>
          <div className={`mt-16 grid ${editorial ? "gap-x-16 gap-y-12 border-t border-white/18 pt-12 md:grid-cols-2" : cinematic ? "gap-0 border-y border-white/14" : "grid-flow-dense gap-3 md:grid-cols-12"}`}>
            {config.research.map((item, index) => <article key={item.title} className={editorial ? `${index === 0 ? "md:col-span-2 md:grid md:grid-cols-2 md:gap-16" : ""}` : cinematic ? "grid gap-5 border-b border-white/14 py-9 last:border-b-0 md:grid-cols-[0.65fr_1.35fr] md:py-12" : `${index === 0 || index === 3 ? "md:col-span-7" : "md:col-span-5"} rounded-[22px] bg-[#151a1d] p-7 md:p-9`}><h4 className={`${industrial ? "text-2xl uppercase text-[#ef6c43]" : cinematic ? "text-3xl text-[#df683c]" : "text-3xl"} font-semibold tracking-[-0.03em]`}>{item.title}</h4><p className={`${editorial && index === 0 ? "md:mt-0" : "mt-5"} text-lg leading-8 text-white/62`}>{item.body}</p></article>)}
          </div>
        </div>
      </section>

      <section id="experience" data-case-study-chapter className="scroll-mt-16 py-32 md:py-44" style={{ background: config.palette.soft, color: config.palette.page }}>
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHeading design={config.design} intro={config.gameplayIntro} dark={false}>Gameplay</SectionHeading>
          <div className={`mt-16 grid grid-flow-dense ${editorial ? "gap-x-12 gap-y-20 md:grid-cols-2" : cinematic ? "gap-4 md:grid-cols-12" : "overflow-hidden rounded-[30px] gap-px bg-[#0d1012] md:grid-cols-2"}`}>
            {config.gameplay.map((item, index) => <article key={item.title} className={editorial ? `${index % 2 ? "md:mt-24" : ""}` : cinematic ? `${index === 0 || index === 3 ? "md:col-span-7" : "md:col-span-5"} overflow-hidden rounded-[28px] bg-[#0d0908] text-white` : "overflow-hidden bg-[#f4f0e8]"}>{item.media && <img src={image(id, item.media.file)} alt={item.media.alt} className={`${editorial ? "aspect-[4/3] rounded-[26px]" : cinematic ? "aspect-[16/10] grayscale-[0.35]" : "aspect-[16/9] border-b-8 border-[#ef6c43]"} w-full object-cover`} />}<div className={editorial ? id === "ravensdown" ? "py-7" : "border-t border-black/25 py-7" : cinematic ? "p-7 md:p-9" : "p-7 md:p-9"}><h4 className={`${industrial ? "text-3xl uppercase tracking-[-0.05em]" : "text-3xl tracking-[-0.03em]"} font-semibold`}>{item.title}</h4><p className={`mt-5 text-lg leading-8 ${cinematic ? "text-white/62" : "opacity-65"}`}>{item.body}</p></div></article>)}
          </div>
        </div>
      </section>

      <section id="process" data-case-study-chapter className="scroll-mt-16 py-32 md:py-44" style={{ background: config.palette.page }}>
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHeading design={config.design} intro={config.processIntro}>Process</SectionHeading>
          <div className={industrial ? "mt-16 grid gap-4 md:grid-cols-2" : cinematic ? "mt-20 space-y-3" : "mt-24 space-y-28"}>
            {config.process.map((item, index) => <article key={item.title} className={editorial ? "grid border-t border-white/20 pt-8 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16" : cinematic ? "grid min-h-[28rem] overflow-hidden rounded-[30px] bg-[#050505] lg:grid-cols-[0.9fr_1.1fr]" : "overflow-hidden rounded-[24px] bg-[#151a1d]"}><img src={image(id, item.media.file)} alt={item.media.alt} className={editorial ? `aspect-[16/10] w-full rounded-[28px] object-cover ${index % 2 ? "lg:order-2" : ""}` : cinematic ? `h-full min-h-80 w-full object-cover grayscale-[0.45] ${index % 2 ? "lg:order-2" : ""}` : "aspect-[16/10] w-full border-b-2 border-[#ef6c43] object-cover"} /><div className={editorial ? `flex flex-col justify-end py-8 ${index % 2 ? "lg:order-1" : ""}` : cinematic ? "flex flex-col justify-end p-8 md:p-12" : "p-7 md:p-9"}><h4 className={`${industrial ? "text-3xl uppercase text-[#ef6c43] md:text-4xl" : "text-4xl md:text-6xl"} font-semibold tracking-[-0.04em]`}>{item.title}</h4><p className="mt-6 max-w-xl text-lg leading-8 text-white/62">{item.body}</p></div></article>)}
          </div>
        </div>
      </section>

      <section id="extras" data-case-study-chapter className="scroll-mt-16 py-32 md:py-44" style={{ background: config.palette.panel }}>
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHeading design={config.design} intro={config.extrasIntro}>Extras</SectionHeading>
          <div className={editorial ? id === "ravensdown" ? "mt-16 border-t border-white/18" : "mt-24 space-y-32" : cinematic ? "mt-20 space-y-16" : "mt-16 grid gap-4 lg:grid-cols-2"}>
            {config.extras.map((extra, extraIndex) => <article key={extra.title} className={editorial ? id === "ravensdown" ? "border-b border-white/18 py-16" : "border-t border-white/18 pt-10" : cinematic ? "rounded-[28px] bg-black/22 p-7 md:p-10" : `${extraIndex === 0 ? "lg:col-span-2" : ""} rounded-[24px] bg-white/[0.035] p-6 md:p-8`}><div className={editorial ? "max-w-4xl md:grid md:grid-cols-[0.7fr_1.3fr] md:gap-16" : "max-w-3xl"}><h4 className={`${industrial ? "text-3xl uppercase text-[#ef6c43] md:text-5xl" : "text-4xl md:text-6xl"} font-semibold tracking-[-0.04em]`}>{extra.title}</h4><p className={`${editorial ? "md:mt-0" : "mt-6"} text-lg leading-8 text-white/62`}>{extra.body}</p></div><div className={`mt-10 grid grid-flow-dense ${editorial ? "gap-8" : cinematic ? "gap-2" : "gap-3"} ${extra.media.length === 1 ? "max-w-4xl" : "md:grid-cols-3"}`}>{extra.media.map((media, mediaIndex) => <figure key={media.file} className={editorial ? `${mediaIndex === 0 && extra.media.length > 1 ? "md:col-span-2" : ""} ${id === "ravensdown" ? "" : "border-t border-white/18 pt-3"}` : cinematic ? "overflow-hidden rounded-[22px] bg-black/45" : "overflow-hidden rounded-[20px] bg-[#0d1012]"}><img src={image(id, media.file)} alt={media.alt} className={`${editorial && mediaIndex === 0 ? "aspect-video" : industrial ? "aspect-video" : "aspect-[4/3]"} w-full rounded-[22px] object-cover`} /><figcaption className={`p-4 text-sm font-medium ${industrial ? "uppercase tracking-[0.08em] text-[#ef6c43]" : "text-white/62"}`}>{media.title}</figcaption></figure>)}</div></article>)}
          </div>
        </div>
      </section>

      <div style={{ background: config.palette.page }}>
        <ChangelogAccordion entries={config.changelog} openVersion={openChangelog} onToggle={setOpenChangelog} idPrefix={id} gameTitle={config.title} description="Recorded development stages from the supplied project documentation." variant={config.design} />
      </div>

      <section id="reflection" data-case-study-chapter className={`relative scroll-mt-16 overflow-hidden ${industrial ? "border-t-8 border-[#ef6c43] py-24 md:py-32" : "py-32 md:py-44"}`} style={{ background: config.palette.panel }}>
        <img src={image(id, config.reflectionMedia.file)} alt="" className={`absolute inset-0 h-full w-full object-cover ${editorial ? "opacity-18" : cinematic ? "grayscale opacity-28" : "opacity-16"}`} />
        <div className={`absolute inset-0 ${editorial ? "bg-[#151918]/75" : cinematic ? "bg-[linear-gradient(90deg,rgba(9,8,6,0.96),rgba(9,8,6,0.72),rgba(9,8,6,0.35))]" : "bg-[#0d1012]/82"}`} />
        <div className={`relative mx-auto max-w-7xl px-5 md:px-8 ${editorial ? "md:grid md:grid-cols-[0.65fr_1.35fr] md:gap-20" : ""}`}>
          <SectionHeading design={config.design}>Reflection</SectionHeading>
          <div className={`space-y-6 text-xl leading-9 text-white/74 ${editorial ? "mt-12 border-l border-white/24 pl-7 md:mt-0 md:pl-12" : cinematic ? "mt-16 max-w-3xl rounded-[28px] bg-black/25 p-7 md:p-12" : "mt-14 max-w-4xl rounded-[28px] bg-[#0d1012]/78 p-7 md:p-10"}`}>{config.reflection.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        </div>
      </section>
    </CaseStudyShell>
  );
}

export function RavensdownProjectView({ onClose }: { onClose: () => void }) {
  return <StudyPage id="ravensdown" onClose={onClose} />;
}

export function ForgottenLineProjectView({ onClose }: { onClose: () => void }) {
  return <StudyPage id="forgotten-line" onClose={onClose} />;
}

export function ConstructedProjectView({ onClose }: { onClose: () => void }) {
  return <StudyPage id="constructed" onClose={onClose} />;
}
