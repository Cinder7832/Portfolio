import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  overviewIntro?: string;
  meta: Array<[string, string]>;
  showcase: Media[];
  overview: Array<{ title: string; body: string }>;
  researchIntro: string;
  research: Array<{ title: string; body: string }>;
  experienceIntro: string;
  experience: Array<{ title: string; body: string; media?: Media }>;
  processIntro: string;
  process: Array<{ title: string; body: string; media: Media }>;
  extrasIntro: string;
  deepDives: Array<{ id: string; placement: "experience" | "process" | "extras"; title: string; body: string; media: Media[] }>;
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
    summary: "I created Ravensdown as a medieval environment for the theme After the Fall. I focused on showing what remained after war and disease disrupted a remote settlement, using the route and atmosphere to explain the story through the environment.",
    overviewIntro: "Ravensdown is a solo Unreal Engine environment project created for the theme After the Fall. I developed an explorable medieval settlement in a mountain valley, using terrain, sourced modular architecture, landscape materials, foliage, lighting, and local fog to define one readable route. Research into abandoned settlements informed the uneven village layout and signs of a community that had disappeared. The final route uses controlled sightlines, a waterwheel, cemetery, and distant mountains to guide the player through the story without dialogue.",
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
      { title: "Brief", body: "For this project, I needed to create one focused outcome based on the theme After the Fall. I supported the final environment with research and planning, then documented how it developed through testing, iteration, and reflection." },
      { title: "Interpretation", body: "I chose to show the period after the collapse instead of the disaster itself. Empty paths, neglected buildings, overgrowth, and a small number of isolated lights suggest that ordinary life stopped some time ago." },
      { title: "Solo project scope", body: "I completed the full environment independently. I designed the terrain and route, assembled six houses from sourced modular parts, created reusable Packed Level Actors, customised the landscape material, and produced the final lighting and atmosphere." },
      { title: "Intended experience", body: "I designed the route around slow exploration and environmental storytelling. The cold moonlight and dark vegetation create uncertainty, while the limited warm lights help the player recognise important areas and follow the route." },
      { title: "Audience", body: "The intended audience is players aged approximately 12 and above who enjoy fantasy environments and exploration. The setting deals with war, disease, and social collapse without using visible bodies, gore, or graphic violence." },
      { title: "Success criteria", body: "I judged the outcome by whether it communicated the theme, made the village appear abandoned, kept the route understandable, and combined architecture, landscape, and vegetation into one location. The lighting also needed to create tension without hiding the environmental detail." },
      { title: "Environmental narrative", body: "The fictional settlement was isolated during a civil war after a weaponised plague spread through the area. The final scene shows the period after the inhabitants fled or died. A small number of unexplained lights leave open the possibility that someone remains." },
    ],
    researchIntro: "I divided the research into historical context, visual references, and technical tests. Each area needed to lead to a visible decision in the environment rather than remain separate from production.",
    research: [
      { title: "Historical context", body: "I looked into the Black Death and abandoned settlements to understand what might remain after a community disappeared. This supported a location where buildings, paths, tools, and boundaries are still visible while vegetation slowly begins to return." },
      { title: "Settlement structure", body: "Research into medieval settlements and Historic England's record of West Cotton helped me avoid arranging the village as a clean grid. I used uneven spacing, a bending route, and a mixture of timber and stone surfaces so the location appears to have developed gradually." },
      { title: "Architecture and materials", body: "I studied stone foundations, timber framing, worn plaster, rough supports, and damaged roof surfaces. Because I used sourced building parts, my decisions focused on selecting compatible pieces and controlling their scale, rotation, placement, and repetition." },
      { title: "Environmental storytelling", body: "The scene needed to communicate that people once lived here, normal life ended, and nature began to reclaim the settlement. Empty buildings, neglected roads, dense vegetation, dark windows, and isolated lights carry that information without dialogue." },
      { title: "Game references", body: "I used A Plague Tale: Requiem as a reference for restricted sightlines and warm local lights. Elden Ring helped me think about landmarks and visual layering, while Kingdom Come: Deliverance helped with the scale and spacing of ordinary medieval buildings." },
      { title: "Technical research", body: "I compared Mesh Terrain with Unreal Engine's established Landscape system before choosing the approach for the scene. I then reviewed HDRI lighting, Lumen, foliage placement, Volumetric Fog, and Local Fog Volumes so I understood how each system could support the atmosphere." },
      { title: "Colour and surface direction", body: "The palette combines cold blue grey light, desaturated vegetation, muddy brown ground, dark stone, and limited warm orange light. Rough, stained, and uneven surfaces reduce the clean appearance of newly placed assets, while the warm areas identify focal points." },
    ],
    experienceIntro: "I structured Ravensdown as a readable exploration route rather than a combat level. Because there are no combat systems carrying the experience, the environment needs to explain the story and guide the player through its composition.",
    experience: [
      { title: "Route", body: "I made the path bend through the settlement so the player cannot see the whole location at once. Buildings, slopes, and vegetation limit the longer views and allow each part of the village to appear in stages.", media: { file: "image66.png", title: "Route framing", alt: "Village route framed by trees and mountains" } },
      { title: "Landmarks", body: "I kept the mountain range visible in the background so the player always has a larger landmark to orient themselves around. Repeated house shapes and small areas of warm light then help indicate the direction of travel within the settlement.", media: { file: "image76.png", title: "Mountain landmark", alt: "Ravensdown with mountains visible behind the forest" } },
      { title: "Waterwheel area", body: "A waterwheel building and dark water plane create a distinct point along the route. The reflections break up the ground surface and the surrounding vegetation frames the building without closing the path.", media: { file: "image70.png", title: "Waterwheel area", alt: "Abandoned waterwheel building beside a dark water plane" } },
      { title: "Ending", body: "The route ends at a cemetery lit by candles, giving the player a clear destination after moving through the village. I left the source of the lights unexplained so the ending keeps some of the uncertainty established earlier in the environment.", media: { file: "image5.png", title: "Cemetery", alt: "Cemetery area lit by candles" } },
    ],
    processIntro: "I started with the terrain and simple white box shapes, then tested each major system before committing to it. The final workflow prioritised a stable route, reusable buildings, controlled atmosphere, and detail where the player could see it.",
    process: [
      { title: "Terrain and whiteboxing", body: "My first pass established the valley, mountains, settlement area, and the main route between them. Testing the layout from ground level showed that several structures were too close together or poorly positioned, so I adjusted their spacing before adding detail.", media: { file: "image71.png", title: "Early terrain", alt: "Early Unreal Engine terrain before the village was built" } },
      { title: "Modular houses", body: "I assembled six house variations from stone walls, timber supports, roofs, and smaller details. Turning them into Packed Level Actors made each building easier to reuse, reposition, and manage as the settlement layout changed.", media: { file: "image60.png", title: "House variations", alt: "Several modular medieval house variations in Unreal Engine" } },
      { title: "Terrain system decision", body: "I first tested Unreal Engine's experimental Mesh Terrain system because it supported more complex forms. It was harder to control and caused more lag in this project, so I returned to the established Landscape system to protect the schedule and keep later editing responsive.", media: { file: "image63.png", title: "Mesh Terrain test", alt: "Experimental Unreal Engine Mesh Terrain test with a playable character" } },
      { title: "Landscape material", body: "I used an existing landscape master material as the technical base rather than rebuilding the full system. I replaced its textures and adjusted how mud, grass, and rough ground blended together so it matched the visual direction of Ravensdown.", media: { file: "image64.png", title: "Landscape material", alt: "Unreal Engine material settings for the landscape" } },
      { title: "Atmosphere", body: "The default sky and heavy global fog did not give me enough control over the scene. I moved to an HDRI sky, reduced the overall fog, and used selected Local Fog Volumes to build the final overcast atmosphere without hiding the route.", media: { file: "image69.png", title: "HDRI lighting", alt: "Ravensdown environment using the final HDRI sky" } },
      { title: "Local effects", body: "I placed Local Fog Volumes in selected low areas and between visual layers instead of increasing fog across the whole level. Water planes added dark reflections around the waterwheel and gave the route another surface treatment without changing the broader terrain system.", media: { file: "image31.png", title: "Local fog pass", alt: "Local fog separating the forest route from the mountain background" } },
      { title: "Optimisation and capture", body: "I removed trees, grass, and small assets outside the direct viewing areas, reduced detail in distant spaces, and avoided filling every gap with foliage. I checked the final cameras from the playable route so the buildings, route, and mountain silhouettes remained readable.", media: { file: "image4.png", title: "Final layout review", alt: "Elevated view used to review the final village layout and vegetation density" } },
    ],
    extrasIntro: "These supporting studies document asset authorship, production organisation, and the larger visual changes made during development.",
    deepDives: [
      { id: "ravensdown-assets", placement: "extras", title: "Asset assembly", body: "The Medieval Village pack from Fab provided the architectural pieces, while Quixel Megascans provided terrain, rocks, and vegetation. I selected compatible parts, assembled six house variations, and controlled their scale, placement, rotation, repetition, and connection to the landscape. I used Unreal Sensei's landscape master material as a technical base, then replaced its original textures and adjusted the blends for the muddy route, grass, and rough ground.", media: [
        { file: "image26.png", title: "Modular source", alt: "Modular medieval building pieces in Unreal Engine" },
        { file: "image58.png", title: "House assembly", alt: "First modular house under construction" },
        { file: "image62.png", title: "Packed Level Actor", alt: "Completed medieval house prepared as a reusable asset" },
      ] },
      { id: "ravensdown-production", placement: "extras", title: "Production organisation", body: "I used Trello to track research, whiteboxing, environment work, lighting, optimisation, and documentation. Inside Unreal Engine, I separated maps, materials, village content, foliage, and effects into clear folders. I also created a GitHub repository as an online backup. For a future Unreal project of this size, I would configure Git LFS before adding large assets so the backup history remains easier to manage.", media: [
        { file: "image55.png", title: "Trello board", alt: "Trello production board for Ravensdown" },
        { file: "image75.png", title: "Content folders", alt: "Organised Unreal Engine content folders" },
        { file: "image57.png", title: "Repository", alt: "GitHub repository used as an online backup" },
      ] },
      { id: "ravensdown-iteration", placement: "extras", title: "Atmosphere iteration", body: "The early environment used the default sky, heavier global fog, and no clear destination. I replaced that setup with an HDRI sky, kept the broader fog subtle, and used Local Fog Volumes where the composition needed depth. I then added the candle lit cemetery so the route ends at a visible destination rather than unfinished terrain.", media: [
        { file: "image77.png", title: "Sky atmosphere", alt: "Cloudy sky atmosphere test in the Ravensdown Unreal Engine scene" },
        { file: "image65.png", title: "Landscape lighting", alt: "Landscape lighting test showing the route and surrounding environment" },
      ] },
      { id: "ravensdown-tree-changes", placement: "extras", title: "Tree changes", body: "The first European tree set felt too bright and green for the mountain setting. I changed to darker taiga trees, which created narrower silhouettes and a better match for the grey HDRI sky, muddy landscape, and limited warm lights. Because the trees affected visibility and performance across the level, I rebuilt their placement around the playable route and removed instances that blocked important views.", media: [
        { file: "image34.png", title: "European trees", alt: "Earlier Ravensdown village layout surrounded by brighter European trees" },
        { file: "image35.png", title: "Taiga trees", alt: "Revised Ravensdown route framed by darker taiga trees" },
      ] },
    ],
    changelog: [
      { version: "1.0.0", date: "2026-10-15", title: "First release", body: ["Fully playable version of Ravensdown"] },
    ],
    reflection: [
      "This project helped me improve my understanding of terrain, modular construction, Packed Level Actors, landscape materials, foliage, HDRI lighting, and atmospheric effects. It also gave me more practice in bringing those systems together instead of treating them as separate tasks.",
      "I think the strongest part of the final environment is the atmosphere created by the overcast sky, taiga trees, mountain backdrop, and limited warm lighting. The six modular houses add enough variation to make the settlement feel considered without introducing unrelated architectural styles.",
      "Peer feedback confirmed that the forest, abandoned buildings, and overcast sky communicated the theme. It also identified dark screenshots and unclear route guidance as weaknesses. I responded by reviewing the final camera positions and using buildings, terrain, vegetation, and warm light to make the direction of travel easier to read.",
      "Some shadows still hide more surface detail than I would like. I did not have enough time to add motion and sound to a consistent standard. With another pass, I would add environmental audio, selected wind movement, rolling fog, and a moving waterwheel controlled through Blueprints.",
    ],
    reflectionMedia: { file: "image3.png", title: "Final settlement", alt: "Final Ravensdown settlement beneath the mountain sky" },
  },
  "forgotten-line": {
    id: "forgotten-line",
    design: "cinematic",
    title: "The Forgotten Line",
    hero: { file: "image40.png", title: "The Forgotten Line tunnel", alt: "Dark abandoned mine tunnel lit by a flashlight" },
    palette: { page: "#090806", panel: "#18110d", accent: "#df683c", soft: "#d9c9bd" },
    summary: "The Forgotten Line is a team horror project set across a Victorian hotel and an abandoned mine. We built a linear route where the player uses a flashlight, environmental details, and audio cues to piece together what happened.",
    overviewIntro: "The Forgotten Line is a team horror project set across a Victorian hotel and an abandoned mine. The player begins as a technician arriving to repair an elevator, then follows the route underground after the lift falls through the foundations. We designed the experience around exploration, controlled visibility, environmental details, and triggered audio rather than repeated jump scares. My contribution covered the Unity HDRP setup, collaboration workflow, environment work, interface, controller changes, lighting, and the second cavern section.",
    meta: [["Role", "Environment, interface, controls, and technical setup"], ["Engine", "Unity 2022.3.9f1 HDRP"], ["Team", "Devanand Asai, Riley Gough, Hiro Starritt"], ["Date", "November 2025"]],
    showcase: [
      { file: "image40.png", title: "Lamp lit tunnel", alt: "Dark mine tunnel lit by a single warm lamp" },
      { file: "image41.png", title: "Hotel interior", alt: "Victorian hotel room with warm lamps and a table" },
      { file: "showcase-red-mine.jpg", title: "Red mine passage", alt: "Mine passage lit by a red work light" },
      { file: "showcase-low-tunnel.jpg", title: "Low tunnel", alt: "Low stone tunnel leading toward a warm light" },
      { file: "image38.png", title: "Hotel corridor", alt: "Victorian hotel corridor with red walls and warm lamp light" },
    ],
    overview: [
      { title: "Premise", body: "The player takes the role of a technician who arrives at a Victorian hotel to repair an elevator. When the elevator falls through the foundations into a forgotten mine, the goal changes from completing the repair to finding a way back out." },
      { title: "Direction", body: "We did not want the horror to depend on constant jump scares. Instead, we used lighting, restricted visibility, voices, ambient audio, and environmental details to create tension while leaving the cause of the collapse unresolved." },
      { title: "My responsibility", body: "I set up the Unity project and the collaboration workflow for the team. During production, I reduced the scope of the hotel lobby, helped complete the elevator transition, built the interface and options, refactored the controls, lit the tunnels, and constructed the second cavern section." },
      { title: "Scope", body: "We kept the final build focused on exploration so the route could be completed to a consistent standard. Flashlight battery management and interaction outlines were planned, but we removed them after technical issues and time constraints made them unreliable." },
    ],
    researchIntro: "As a team, we used horror games, film and television references, tunnel plans, and early playtesting to decide how the route should work and what kind of atmosphere we wanted to create.",
    research: [
      { title: "Visual references", body: "We looked at Resident Evil, A Plague Tale: Requiem, Stranger Things, Outlast, and Gurren Lagann when developing the visual direction. These references helped us think about the dark hotel, underground setting, lighting, and the enclosed structure of the route." },
      { title: "Level planning", body: "Our concept sketches divided the project into a hotel opening followed by a linear mine route. Keeping the structure small gave us more time to focus on the atmosphere and the environment work needed to support it." },
      { title: "Playtesting", body: "Early playtests showed that collision was missing in places, the direction of travel was unclear, the audio was limited, and the atmosphere was only mildly effective. We responded by adding better boundaries, clearer route cues, more controlled lighting, and additional audio systems." },
      { title: "Asset research", body: "We used Quixel Megascans for cave materials, ZNS3D for Victorian elements, and Poly Haven for additional textures. When large Megascans downloads increased the project size too quickly, we reduced the resolution and became more selective about what we imported." },
    ],
    experienceIntro: "The player can walk, sprint, and crouch through the linear horror route. We used a flashlight and controlled sightlines to support navigation, while audio triggers suggest that events are happening beyond what the player can see.",
    experience: [
      { title: "Movement", body: "I adapted the controller to support keyboard, mouse, and gamepad input. Crouching allows the player to reach hidden paths, while a virtual cursor makes the menus usable with a controller as well as a mouse." },
      { title: "Atmosphere", body: "We removed natural directional light from the scenes so the player relies more heavily on the flashlight and local lighting. Vignette, brightness, contrast, fog, and carefully placed lights then help create the enclosed presentation." },
      { title: "Audio route", body: "Footsteps, radios, ambient sound, music, clocks, and triggered voices gradually build tension along the route. At the ending, we slow the player and disable the flashlight so the final moment is carried by sound before the credits appear." },
    ],
    processIntro: "We began with collaborative planning, then developed the hotel, elevator transition, and tunnel environment in stages. The interface, controls, lighting, and final atmosphere were added as the full route became playable.",
    process: [
      { title: "Project setup", body: "I created the Unity HDRP project and integrated Scene Fusion so we could work in the same scene more easily. We also used GitHub for version control so the team had a shared history and backup of the project.", media: { file: "image55.png", title: "Organised project", alt: "Organised Unity project folders for The Forgotten Line" } },
      { title: "Hotel revision", body: "The first hotel lobby was too large for the number of suitable assets we had available. I reduced it to a smaller and denser room, and we enabled shadow casting on the lights to correct the flat indoor lighting.", media: { file: "image42.png", title: "Hotel development", alt: "Victorian hotel scene during Unity development" } },
      { title: "Tunnel construction", body: "Hiro mapped the first tunnel section, and I developed it further through lighting, minecarts, and rails. I also finalised the crouching system and built the second section as a large cavern with HDRP water and a clearly illuminated escape route.", media: { file: "image57.png", title: "Cave layout", alt: "Cave geometry during Unity development" } },
    ],
    extrasIntro: "This final part documents a corrected door interaction that I completed, but which we were not able to integrate before the deadline.",
    deepDives: [
      { id: "forgotten-line-props", placement: "process", title: "Original prop work", body: "I created a jug, crate, and table in Blender so the project included some original prop work alongside the sourced assets. For the jug, I used loop cuts, a curve handle, Solidify, and Subdivision Surface. I made the crate with manual UV work and wood textures, while the table used primitive forms, bevelled edges, and BlenderKit materials.", media: [
        { file: "image21.png", title: "Jug render", alt: "Rendered jug model created for the project" },
        { file: "image28.png", title: "Crate render", alt: "Rendered wooden crate created for the project" },
        { file: "image33.png", title: "Table render", alt: "Rendered wooden table created for the project" },
      ] },
      { id: "forgotten-line-interface", placement: "experience", title: "Interface", body: "I created the main menu, shared pause menu, graphics settings, quality presets, resolution control, fullscreen setting, and volume slider in a monochrome horror style that matched the rest of the project. The controls use strong contrast for readability, and I tested interaction prompts inside the hotel scene before applying them across the route. I also refactored movement to use Unity's Input System so the final build supported controllers and a virtual cursor for menu navigation.", media: [
        { file: "image51.png", title: "Main menu", alt: "The Forgotten Line main menu" },
        { file: "image52.png", title: "Options", alt: "The Forgotten Line graphics settings" },
        { file: "image54.png", title: "Pause menu", alt: "The Forgotten Line pause menu" },
      ] },
      { id: "forgotten-line-door", placement: "extras", title: "Cut door interaction", body: "One of the supplied door models had an incorrect pivot, which stopped it from opening correctly. I fixed the pivot in Blender, but there was not enough time to integrate and test the corrected version before the deadline.", media: [
        { file: "image72.png", title: "Door before correction", alt: "Door model with its original pivot in Blender" },
        { file: "image73.png", title: "Door correction", alt: "Door model after pivot correction in Blender" },
      ] },
    ],
    changelog: [
      { version: "0.1.0", date: "2026-01-03", title: "First release", body: ["- Fully playable version of The Forgotten Line"] },
    ],
    reflection: [
      "We completed the hotel, elevator sequence, tunnel route, interface, audio systems, and ending within the project deadline. Keeping the final route focused helped us bring the separate pieces together into one playable build.",
      "The main production problems came from oversized assets, missing Victorian content, merge conflicts, Git LFS bandwidth, rendering issues with outlines, and Unity builds that only worked after temporary files were cleared. These issues took time away from features that had been planned earlier in production.",
      "For a future team project, I would begin with a shared naming convention and a lower asset resolution target so the project remains easier to manage. We also agreed that our next project should focus more directly on mechanics after spending this project developing our level design and atmosphere skills.",
    ],
    reflectionMedia: { file: "image68.png", title: "Final route", alt: "Final red lit mine passage in The Forgotten Line" },
  },
  constructed: {
    id: "constructed",
    design: "industrial",
    title: "Constructed",
    hero: { file: "image1.png", title: "Constructed site", alt: "White box construction site level with cranes and obstacles" },
    palette: { page: "#0d1012", panel: "#1a1f22", accent: "#ef6c43", soft: "#d5dadd" },
    summary: "Constructed is a solo third person speedrun level set on a construction site. I designed the obstacles around recognisable machinery and believable movement so the route feels connected to its setting instead of relying on floating platforms.",
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
      { title: "Concept", body: "I based the level around a construction site and avoided floating platforms or structures that would contradict the setting. Each obstacle remains recognisable as machinery, pipes, boards, or part of a building, which helps the route feel like one connected place." },
      { title: "Goal", body: "The player has to complete one continuous route as quickly as possible. I chose not to include checkpoints, so touching a hazard returns the player to the start and makes each completed run feel earned." },
      { title: "Visual direction", body: "I used a grey and white prototype style to keep the route easy to read while I developed it. HDRP lighting, volumetric clouds, global illumination, and ambient occlusion add depth without hiding the simple forms that explain each obstacle." },
      { title: "Scope", body: "The final project includes a third person controller, moving machinery, physics hazards, a timer, a main menu, a pause menu, audio control, and one completed route. I kept the scope focused so each of these parts could work together in the final build." },
    ],
    researchIntro: "Before production began, I compared different platformers, construction games, and games with a prototype visual style. I then used those references to support a hand drawn route plan for the level.",
    research: [
      { title: "Platform references", body: "I looked at Hollow Knight, Fall Guys, and Sonic the Hedgehog for examples of movement, readable obstacles, and route pacing across different platformer styles. I did not copy one structure directly, but used the comparison to decide how quickly the challenges should develop." },
      { title: "Visual references", body: "Construction Simulator helped me understand how the machinery and setting could remain recognisable. Karlson and Banana Shooter influenced the raw prototype surfaces and limited palette used to keep the route visually clear." },
      { title: "Route plan", body: "I created a top down map to keep the level short enough for the deadline. The plan divided the route into an introduction, an exploration section, a harder set of challenges, and a final goal area." },
      { title: "Technical reference", body: "Unity Starter Assets provided the controller base that I customised for the project. I also followed a tutorial for the Hinge Joint chain used by the wrecking ball, while the background music came from Pixabay." },
    ],
    experienceIntro: "Constructed combines third person movement with one continuous speedrun route. I made the obstacles more demanding near the end, while keeping every hazard connected to the construction theme so the difficulty increases without losing the visual idea.",
    experience: [
      { title: "Player movement", body: "I customised the Starter Assets controller to handle movement, smoother sprint transitions, jumping, and gravity. I also added a camera collider so Cinemachine does not pass through the level geometry when the player moves close to walls.", media: { file: "image22.png", title: "Player route", alt: "Third person player moving through Constructed" } },
      { title: "Moving machinery", body: "I gave each type of machinery a focused movement script. Pistons use PingPong movement, pipes move between two defined points, and rotating boards use continuous time based rotation to create predictable hazards.", media: { file: "image20.jpg", title: "Moving machinery", alt: "Moving pipe and piston obstacles" } },
      { title: "Physics hazards", body: "The wrecking ball uses Hinge Joints to connect the chain, with repeated force maintaining the swing. Like the other hazards, touching it returns the player to the start and restarts the attempt.", media: { file: "image19.jpg", title: "Crane hazard", alt: "Crane and wrecking ball obstacle" } },
      { title: "Speedrun loop", body: "Trigger volumes start and stop a timer that displays minutes, seconds, and milliseconds. Because there are no checkpoints, the player has to complete the whole route in one attempt before receiving a final time.", media: { file: "image34.png", title: "Timer", alt: "Speedrun timer displayed during gameplay" } },
    ],
    processIntro: "I built the blockout directly in Unity so I could test platform distances and obstacle timing without repeatedly exporting the level from another tool.",
    process: [
      { title: "Map and blockout", body: "I sketched the route before production, then rebuilt it with Unity primitives and ProBuilder. Keeping the plan short protected the deadline and gave me a clear structure to test before I added more detailed obstacles.", media: { file: "image16.jpeg", title: "Top down plan", alt: "Hand drawn top down plan for Constructed" } },
      { title: "Environment construction", body: "I made the buildings, cargo, cranes, and structural forms directly in Unity. Using ProBuilder meant I could change their height and spacing during playtests instead of treating the first layout as final.", media: { file: "image18.png", title: "Unity blockout", alt: "Constructed level open in the Unity editor" } },
      { title: "Obstacle scripting", body: "I kept the obstacle behaviours in separate scripts for the pistons, pipes, rotating boards, wrecking ball, hazards, and timer. This made each behaviour easier to understand, test, and adjust without changing unrelated parts of the level.", media: { file: "image29.png", title: "Obstacle code", alt: "Constructed obstacle script in the code editor" } },
      { title: "Menus and audio", body: "I completed the gameplay loop with a main menu, pause menu, and volume control. When the game is paused, the background music becomes quieter so the interface state is also clear through audio.", media: { file: "image26.png", title: "Main menu", alt: "Constructed main menu in the Unity editor" } },
    ],
    extrasIntro: "This supporting evidence shows how I organised the project and used version control as part of my working process.",
    deepDives: [
      { id: "constructed-practice", placement: "extras", title: "Professional practice", body: "I organised the Unity hierarchy and project files into clear folders and subfolders so the level remained manageable as it grew. I also used GitHub to store the project history and provide an online backup of the work.", media: [
        { file: "image25.png", title: "Unity hierarchy", alt: "Organised Constructed hierarchy and assets" },
        { file: "image27.png", title: "Version history", alt: "Git version history for Constructed" },
        { file: "image28.png", title: "Repository", alt: "Constructed repository on GitHub" },
      ] },
      { id: "constructed-glasses", placement: "process", title: "Gurren Lagann glasses", body: "I created the red glasses from flat planes in Blender, duplicating vertices until the silhouette matched the reference. I then used Solidify to add thickness and applied a translucent red material so the asset stands out against the grey environment.", media: [
        { file: "image33.png", title: "Glasses model", alt: "Red stylised glasses model created in Blender" },
      ] },
      { id: "constructed-scripts", placement: "process", title: "Script evidence", body: "The project documentation includes the focused scripts I used for movement, the timer, triggers, obstacle motion, rotation, and the wrecking ball force. Keeping these responsibilities separate made it easier to test and adjust each part of the route.", media: [
        { file: "image30.png", title: "Timer code", alt: "Speedrun timer code for Constructed" },
        { file: "image31.png", title: "Movement code", alt: "Movement script for a Constructed obstacle" },
        { file: "image32.png", title: "Hazard code", alt: "Hazard control script for Constructed" },
      ] },
    ],
    changelog: [
      { version: "0.1.0", date: "2026-01-03", title: "First release", body: ["- Fully playable version of Constructed"] },
    ],
    reflection: [
      "The largest production challenge was the wrecking ball. Building the crane and connecting every chain element with Hinge Joints took much longer than writing the force script, but it helped me understand how the physical setup and the code depend on each other.",
      "I met the main goal of creating a short construction themed route with machinery based obstacles, a continuous speedrun loop, and a clear prototype visual style. Keeping those ideas consistent made the final level feel more complete even with its limited scope.",
      "I removed additional building interiors and a ledge grab because they could not be completed properly before the deadline. If I continue the project, I would also test the difficulty with more players because failing near the end currently restarts the entire route.",
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
  const useStandardHeroOverlay = id === "ravensdown" || id === "forgotten-line";
  const hasExtras = config.deepDives.some((item) => item.placement === "extras");
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const showcaseRef = useRef<HTMLDivElement | null>(null);
  const deepDiveRailsRef = useRef<Record<string, HTMLDivElement | null>>({});
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

  const scrollDeepDiveRail = (id: string, direction: -1 | 1) => {
    const rail = deepDiveRailsRef.current[id];
    if (!rail) return;
    rail.scrollBy({ left: direction * rail.clientWidth, behavior: reducedMotion ? "auto" : "smooth" });
  };

  const renderDeepDives = (placement: StudyConfig["deepDives"][number]["placement"]) => {
    const items = config.deepDives.filter((item) => item.placement === placement);
    if (!items.length) return null;

    return (
      <div className="mt-20 grid gap-6">
        {items.map((item) => {
          const isInterfaceCarousel = item.id === "forgotten-line-interface";
          return <article
            key={item.id}
            id={item.id}
            className="overflow-hidden rounded-[28px] p-7 md:p-10"
            style={{ background: placement === "experience" ? config.palette.page : config.palette.panel, color: "white" }}
          >
            <div className="max-w-4xl">
              <h4 className={`${industrial ? "text-3xl uppercase text-[#ef6c43] md:text-5xl" : "text-4xl md:text-6xl"} font-semibold tracking-[-0.04em]`}>{item.title}</h4>
              <p className="mt-6 text-lg leading-8 text-white/64">{item.body}</p>
            </div>
            {isInterfaceCarousel ? (
              <div className="mt-10 min-w-0">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold text-white/54">Menu and settings screens</p>
                  <div className="flex shrink-0 gap-1 rounded-full bg-white p-1 text-[#171717] shadow-[0_14px_32px_rgba(0,0,0,0.28)]">
                    <button type="button" className="icon-button-motion grid size-10 place-items-center rounded-full transition-colors hover:bg-[#171717] hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/35" aria-label="Show previous interface screen" onClick={() => scrollDeepDiveRail(item.id, -1)}><ChevronLeft size={20} /></button>
                    <button type="button" className="icon-button-motion grid size-10 place-items-center rounded-full transition-colors hover:bg-[#171717] hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/35" aria-label="Show next interface screen" onClick={() => scrollDeepDiveRail(item.id, 1)}><ChevronRight size={20} /></button>
                  </div>
                </div>
                <div ref={(node) => { deepDiveRailsRef.current[item.id] = node; }} className="flex snap-x snap-mandatory overflow-x-auto rounded-[22px] bg-black/35 shadow-[0_28px_70px_rgba(0,0,0,0.28)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {item.media.map((media) => (
                    <figure key={media.file} className="relative w-full shrink-0 snap-start overflow-hidden bg-black">
                      <img src={image(id, media.file)} alt={media.alt} className="aspect-video w-full object-cover" />
                      <figcaption className="absolute bottom-4 left-4 rounded-full bg-black/80 px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(0,0,0,0.34)]">{media.title}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            ) : (
              <div className={`mt-10 grid grid-flow-dense items-start gap-3 ${item.media.length === 1 ? "max-w-4xl" : item.media.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
                {item.media.map((media, mediaIndex) => (
                  <figure key={media.file} className={`${mediaIndex === 0 && item.media.length > 2 ? item.id === "ravensdown-production" || item.id === "ravensdown-assets" || item.id === "forgotten-line-props" ? "md:col-span-2 md:row-span-2" : "md:col-span-2" : ""} ${item.id === "forgotten-line-props" && mediaIndex === 2 ? "md:col-start-3" : ""} overflow-hidden rounded-[20px] bg-black/35`}>
                    <img src={image(id, media.file)} alt={media.alt} className="aspect-[4/3] w-full object-cover" />
                    <figcaption className={`p-4 text-sm font-medium ${industrial ? "uppercase tracking-[0.08em] text-[#ef6c43]" : "text-white/62"}`}>{media.title}</figcaption>
                  </figure>
                ))}
              </div>
            )}
          </article>
        })}
      </div>
    );
  };

  return (
    <CaseStudyShell definition={caseStudyDefinitions[id]} scrollRef={scrollRef} onClose={onClose} className="text-white" >
      <header className="relative min-h-[42rem] overflow-hidden md:min-h-[52rem]" style={{ background: config.palette.page }}>
        <img src={image(id, config.hero.file)} alt={config.hero.alt} className="absolute inset-0 h-full w-full object-cover opacity-85" />
        <div
          className={
            useStandardHeroOverlay
              ? "absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.9)_0%,rgba(0,0,0,0.55)_38%,rgba(0,0,0,0.08)_72%),linear-gradient(0deg,rgba(0,0,0,0.82)_0%,transparent_48%)]"
              : "absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-black/5"
          }
        />
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
            {config.overviewIntro ? (
              <article className={editorial ? "border-b border-white/18 py-10 md:col-span-2" : "rounded-[28px] bg-black/30 p-8 text-white md:col-span-12 md:p-12"}>
                <p className="max-w-none text-lg leading-8 text-white/68">{config.overviewIntro}</p>
              </article>
            ) : (
              <article className={editorial ? `border-b border-white/18 py-10 ${id === "ravensdown" ? "md:col-span-2" : "md:row-span-4 md:pr-16"}` : cinematic ? "rounded-[28px] bg-black/30 p-8 text-white md:col-span-9 md:p-12" : "bg-[#ef6c43] p-8 text-[#0d1012] md:col-span-2 md:p-12"}>
                <p className={`max-w-4xl font-semibold leading-[1.12] tracking-[-0.04em] ${editorial ? "text-3xl md:text-4xl" : "text-3xl md:text-5xl"}`}>{tagline}</p>
              </article>
            )}
            {config.overview.map((item, index) => <article key={item.title} className={editorial ? `border-b border-white/18 py-9 md:pl-16 ${id === "ravensdown" ? "md:col-span-2" : ""}` : cinematic ? `${index === 0 || index === 3 ? "md:col-span-7" : "md:col-span-5"} min-h-64 rounded-[24px] bg-black/35 p-7 md:p-9` : "min-h-64 bg-[#151a1d] p-7 md:p-9"}><h4 className={`font-semibold ${industrial ? "text-3xl uppercase tracking-[-0.04em] text-[#ef6c43]" : "text-2xl"}`}>{item.title}</h4><p className="mt-5 text-lg leading-8 text-white/64">{item.body}</p></article>)}
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
            {config.research.map((item, index) => <article key={item.title} className={editorial ? `${index === 0 ? "md:col-span-2" : ""}` : cinematic ? "grid gap-5 border-b border-white/14 py-9 last:border-b-0 md:grid-cols-[0.65fr_1.35fr] md:py-12" : `${index === 0 || index === 3 ? "md:col-span-7" : "md:col-span-5"} rounded-[22px] bg-[#151a1d] p-7 md:p-9`}><h4 className={`${industrial ? "text-2xl uppercase text-[#ef6c43]" : cinematic ? "text-3xl text-[#df683c]" : "text-3xl"} font-semibold tracking-[-0.03em]`}>{item.title}</h4><p className="mt-5 text-lg leading-8 text-white/62">{item.body}</p></article>)}
          </div>
        </div>
      </section>

      <section id="experience" data-case-study-chapter className="scroll-mt-16 py-32 md:py-44" style={{ background: config.palette.soft, color: config.palette.page }}>
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHeading design={config.design} intro={config.experienceIntro} dark={false}>{caseStudyDefinitions[id].sections.experience.label}</SectionHeading>
          <div className={`mt-16 grid grid-flow-dense ${editorial ? "gap-x-12 gap-y-20 md:grid-cols-2" : cinematic ? "gap-4 md:grid-cols-12" : "overflow-hidden rounded-[30px] gap-px bg-[#0d1012] md:grid-cols-2"}`}>
            {config.experience.map((item, index) => <article key={item.title} className={editorial ? `${index % 2 ? "md:mt-24" : ""}` : cinematic ? `${id === "forgotten-line" && item.title === "Audio route" ? "md:col-span-12" : index === 0 || index === 3 ? "md:col-span-7" : "md:col-span-5"} overflow-hidden rounded-[28px] bg-[#0d0908] text-white` : "overflow-hidden bg-[#f4f0e8]"}>{item.media && <img src={image(id, item.media.file)} alt={item.media.alt} className={`${editorial ? "aspect-[4/3] rounded-[26px]" : cinematic ? "aspect-[16/10] grayscale-[0.35]" : "aspect-[16/9] border-b-8 border-[#ef6c43]"} w-full object-cover`} />}<div className={editorial ? id === "ravensdown" ? "py-7" : "border-t border-black/25 py-7" : cinematic ? "p-7 md:p-9" : "p-7 md:p-9"}><h4 className={`${industrial ? "text-3xl uppercase tracking-[-0.05em]" : "text-3xl tracking-[-0.03em]"} font-semibold`}>{item.title}</h4><p className={`mt-5 text-lg leading-8 ${cinematic ? "text-white/62" : "opacity-65"}`}>{item.body}</p></div></article>)}
          </div>
          {renderDeepDives("experience")}
        </div>
      </section>

      <section id="process" data-case-study-chapter className="scroll-mt-16 py-32 md:py-44" style={{ background: config.palette.page }}>
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHeading design={config.design} intro={config.processIntro}>Process</SectionHeading>
          <div className={industrial ? "mt-16 grid gap-4 md:grid-cols-2" : cinematic ? "mt-20 space-y-3" : "mt-24 space-y-28"}>
            {config.process.map((item, index) => <article key={item.title} className={editorial ? "grid border-t border-white/20 pt-8 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16" : cinematic ? "grid min-h-[28rem] overflow-hidden rounded-[30px] bg-[#050505] lg:grid-cols-[0.9fr_1.1fr]" : "overflow-hidden rounded-[24px] bg-[#151a1d]"}><img src={image(id, item.media.file)} alt={item.media.alt} className={editorial ? `aspect-[16/10] w-full rounded-[28px] object-cover ${index % 2 ? "lg:order-2" : ""}` : cinematic ? `h-full min-h-80 w-full object-cover grayscale-[0.45] ${index % 2 ? "lg:order-2" : ""}` : "aspect-[16/10] w-full border-b-2 border-[#ef6c43] object-cover"} /><div className={editorial ? `flex flex-col justify-end py-8 ${index % 2 ? "lg:order-1" : ""}` : cinematic ? "flex flex-col justify-end p-8 md:p-12" : "p-7 md:p-9"}><h4 className={`${industrial ? "text-3xl uppercase text-[#ef6c43] md:text-4xl" : "text-4xl md:text-6xl"} font-semibold tracking-[-0.04em]`}>{item.title}</h4><p className="mt-6 max-w-xl text-lg leading-8 text-white/62">{item.body}</p></div></article>)}
          </div>
          {renderDeepDives("process")}
        </div>
      </section>

      {hasExtras && <section id="extras" data-case-study-chapter className="scroll-mt-16 py-32 md:py-44" style={{ background: config.palette.panel }}>
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHeading design={config.design} intro={config.extrasIntro}>Extras</SectionHeading>
          <div className={editorial ? id === "ravensdown" ? "mt-16 border-t border-white/18" : "mt-24 space-y-32" : cinematic ? "mt-20 space-y-16" : "mt-16 grid gap-4 lg:grid-cols-2"}>
            {config.deepDives.filter((item) => item.placement === "extras").map((extra, extraIndex) => <article key={extra.id} id={extra.id} className={editorial ? id === "ravensdown" ? "border-b border-white/18 py-16" : "border-t border-white/18 pt-10" : cinematic ? "rounded-[28px] bg-black/22 p-7 md:p-10" : `${extraIndex === 0 ? "lg:col-span-2" : ""} rounded-[24px] bg-white/[0.035] p-6 md:p-8`}><div className={editorial ? "max-w-4xl md:grid md:grid-cols-[0.7fr_1.3fr] md:gap-16" : "max-w-3xl"}><h4 className={`${industrial ? "text-3xl uppercase text-[#ef6c43] md:text-5xl" : "text-4xl md:text-6xl"} font-semibold tracking-[-0.04em]`}>{extra.title}</h4><p className={`${editorial ? "md:mt-0" : "mt-6"} text-lg leading-8 text-white/62`}>{extra.body}</p></div><div className={`mt-10 grid grid-flow-dense ${editorial ? "gap-8" : cinematic ? "gap-2" : "gap-3"} ${extra.media.length === 1 ? "max-w-4xl" : "md:grid-cols-3"}`}>{extra.media.map((media, mediaIndex) => <figure key={media.file} className={editorial ? `${mediaIndex === 0 && extra.media.length > 1 ? "md:col-span-2" : ""} ${id === "ravensdown" ? "" : "border-t border-white/18 pt-3"}` : cinematic ? "overflow-hidden rounded-[22px] bg-black/45" : "overflow-hidden rounded-[20px] bg-[#0d1012]"}><img src={image(id, media.file)} alt={media.alt} className={`${editorial && mediaIndex === 0 ? "aspect-video" : industrial ? "aspect-video" : "aspect-[4/3]"} w-full rounded-[22px] object-cover`} /><figcaption className={`p-4 text-sm font-medium ${industrial ? "uppercase tracking-[0.08em] text-[#ef6c43]" : "text-white/62"}`}>{media.title}</figcaption></figure>)}</div></article>)}
          </div>
        </div>
      </section>}

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
