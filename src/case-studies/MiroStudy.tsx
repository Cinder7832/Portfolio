import { useRef } from "react";
import { usePrefersReducedMotion } from "../motion";
import CaseStudyShell from "./CaseStudyShell";
import { CaseStudyShowcaseImage, CaseStudyShowcaseRail } from "./CaseStudyMedia";
import { caseStudyDefinitions } from "./definitions";
import { projectSummary } from "./projectSummary";

const miroImage = (file: string) => `${import.meta.env.BASE_URL}projects/miro/${file}`;

function Heading({ children, intro, dark = false }: { children: string; intro?: string; dark?: boolean }) {
  return (
    <div className="max-w-5xl">
      <h3 className="text-5xl font-semibold leading-[0.9] tracking-[-0.065em] md:text-8xl">{children}</h3>
      {intro && <p className={`mt-7 max-w-4xl text-lg leading-8 ${dark ? "text-[#172025]/70" : "text-white/68"}`}>{intro}</p>}
    </div>
  );
}

export default function MiroProjectView({ onClose }: { onClose: () => void }) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const showcaseRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const tagline = projectSummary("miro", "A first person vertical slice about a trash collector robot in a post industrial alien city.");

  const scrollShowcase = (direction: -1 | 1) => {
    const rail = showcaseRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * Math.min(rail.clientWidth * 0.82, 680), behavior: reducedMotion ? "auto" : "smooth" });
  };

  const showcase = [
    ["industrial-courtyard.png", "Yellow lit industrial courtyard in the completed MIRO environment"],
    ["vertical-city.png", "Vertical view through pipes, bridges and industrial buildings"],
    ["trash-pickup.png", "Trash pickup interaction with an outline and area progress interface"],
    ["sell-npc.png", "Sell NPC interaction inside the industrial environment"],
    ["upgrade-screen.png", "Upgrade screen for collection and movement abilities"],
    ["main-menu.png", "MIRO main menu over the game environment"],
  ];

  return (
    <CaseStudyShell definition={caseStudyDefinitions.miro} scrollRef={scrollRef} onClose={onClose} className="bg-[#081016] text-white">
      <header className="relative min-h-[42rem] overflow-hidden bg-[#081016] md:min-h-[52rem]">
        <img src={miroImage("vertical-city.png")} alt="MIRO industrial city with pipes and raised structures" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,16,22,0.92)_0%,rgba(8,16,22,0.54)_52%,rgba(8,16,22,0.08)_100%)]" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#081016]/88 via-transparent to-[#081016]/10" aria-hidden="true" />
        <div className="relative mx-auto flex min-h-[42rem] max-w-7xl flex-col justify-end px-5 pb-16 pt-28 md:min-h-[52rem] md:px-8 md:pb-24">
          <h2 className="max-w-6xl text-[clamp(4.2rem,13vw,10rem)] font-semibold leading-[0.82] tracking-[-0.075em]">MIRO</h2>
          <p className="mt-8 max-w-4xl text-lg leading-8 text-white/78">{tagline}</p>
        </div>
      </header>

      <CaseStudyShowcaseRail background="#0b151c" railRef={showcaseRef} onScroll={scrollShowcase}>
        {showcase.map(([file, alt]) => (
          <div key={file} className="w-[86vw] shrink-0 snap-center md:w-[62vw] lg:w-[48rem]">
            <CaseStudyShowcaseImage src={miroImage(file)} alt={alt} title={alt} />
          </div>
        ))}
      </CaseStudyShowcaseRail>

      <section id="overview" data-case-study-chapter className="scroll-mt-16 bg-[#d5b84a] py-32 text-[#11181c] md:py-44">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Heading dark intro="I created MIRO in response to the Another World brief, which asked for a playable 3D vertical slice for Cyan Worlds. I focused on exploration, environmental storytelling, and nonviolent progression so the final idea remained suitable for an audience up to PEGI 12.">Overview</Heading>
          <div className="mt-16 overflow-hidden rounded-[32px] bg-[#101a20] text-white shadow-[0_30px_90px_rgba(16,26,32,0.24)]">
            <article className="grid gap-8 p-8 md:grid-cols-[0.8fr_1.2fr] md:p-12"><h4 className="text-4xl font-semibold tracking-[-0.05em] md:text-6xl">Project premise</h4><p className="text-xl leading-9 text-white/70">The player controls MIRO, a trash collecting robot working through a city of abandoned factories, polluted spaces, and locked districts. Collecting waste gives the player currency, which can be spent on upgrades that make later areas faster and easier to clear.</p></article>
            <div className="grid gap-0 md:grid-cols-3">
              <article className="bg-[#182a32] p-8 md:p-10"><h4 className="text-xl font-semibold text-[#d5b84a]">Responsibility</h4><p className="mt-5 leading-7 text-white/68">I was responsible for the concept, environment, player movement, lighting, interaction systems, progression, interface, testing changes, and production plan.</p></article>
              <article className="bg-[#182a32] p-8 md:p-10"><h4 className="text-xl font-semibold text-[#d5b84a]">Brief</h4><p className="mt-5 leading-7 text-white/68">The brief required me to explore worldbuilding, atmosphere, visual storytelling, or gameplay. I also needed to support the final outcome with a pitch, research, development evidence, feedback, and a final showcase.</p></article>
              <article className="bg-[#182a32] p-8 md:p-10"><h4 className="text-xl font-semibold text-[#d5b84a]">Delivered scope</h4><p className="mt-5 leading-7 text-white/68">The final build includes trash spawning, raycast pickup, NPC selling, area progress, five upgrades, menus, loading feedback, and a completed route through the environment.</p></article>
            </div>
          </div>
        </div>
      </section>

      <section id="research" data-case-study-chapter className="scroll-mt-16 bg-[#081016] py-32 md:py-44">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Heading intro="I researched the client, target audience, game systems, film references, real places, and the production scope. This helped me understand why the final direction was suitable and why the earlier concepts needed to be reduced or replaced.">Research</Heading>
          <div className="mt-16 grid gap-0 overflow-hidden rounded-[32px] lg:grid-cols-12 [&>article]:rounded-none">
            <article className="rounded-[28px] bg-[#14232c] p-8 lg:col-span-7 md:p-10"><h4 className="text-3xl font-semibold">Cyan Worlds and Myst</h4><p className="mt-5 text-lg leading-8 text-white/70">My research into Cyan Worlds focused on first person exploration, unusual technology, environmental clues, logic puzzles, and worlds that explain themselves through observation. Recording a Myst playthrough also showed me how minimal instruction, remembered clues, and experimentation can support the player without constantly directing them.</p></article>
            <article className="rounded-[28px] bg-[#d5b84a] p-8 text-[#172025] lg:col-span-5 md:p-10"><h4 className="text-3xl font-semibold">Audience and rating</h4><p className="mt-5 text-lg leading-8 text-[#172025]/76">To keep the project suitable for a younger audience, I avoided graphic violence, gore, and mature themes. I created tension through the atmosphere, locked spaces, and mystery instead, while progress comes from cleaning, collecting, upgrading, and discovering new areas.</p></article>
            <article className="rounded-[28px] bg-[#193441] p-8 lg:col-span-4"><h4 className="text-2xl font-semibold">Stray</h4><p className="mt-4 leading-8 text-white/68">I used Stray's robot city, narrow routes, vertical traversal, and dense prop placement to understand how a small nonhuman character can feel grounded inside a much larger layered environment.</p></article>
            <article className="rounded-[28px] bg-[#24343b] p-8 lg:col-span-4"><h4 className="text-2xl font-semibold">Cyberpunk 2077</h4><p className="mt-4 leading-8 text-white/68">My research into Night City helped me think about industrial density, neon contrast, layered signage, and how lighting can support the atmosphere while still making the route readable.</p></article>
            <article className="rounded-[28px] bg-[#30454e] p-8 lg:col-span-4"><h4 className="text-2xl font-semibold">Elden Ring</h4><p className="mt-4 leading-8 text-white/68">Elden Ring showed me how landmarks, regional identity, and environmental storytelling can guide exploration. Its scale also made it clear that my first fantasy concept was too large to complete within the project.</p></article>
            <article className="rounded-[28px] bg-[#dfe8e6] p-8 text-[#172025] lg:col-span-4"><h4 className="text-2xl font-semibold">Raft</h4><p className="mt-4 leading-8 text-[#172025]/72">Raft connects collection, crafting, building, and progression into one resource loop. I first used that structure in the Fisk concept, then carried the idea of one repeatable action into MIRO.</p></article>
            <article className="rounded-[28px] bg-[#f5ebbd] p-8 text-[#172025] lg:col-span-4"><h4 className="text-2xl font-semibold">Leaf it Alone</h4><p className="mt-4 leading-8 text-[#172025]/72">Leaf it Alone directly influenced the physical collection, disposal, visible area changes, and tool upgrades. I adapted those ideas into MIRO's trash pickup, selling, area completion, and upgrade progression.</p></article>
            <article className="rounded-[28px] bg-[#c7c9b6] p-8 text-[#172025] lg:col-span-4"><h4 className="text-2xl font-semibold">WALL-E</h4><p className="mt-4 leading-8 text-[#172025]/72">WALL-E showed how a small trash collecting robot can explain its role through the environment and the work it performs. This helped me connect MIRO's character, setting, and gameplay without relying on combat.</p></article>
            <article className="rounded-[28px] bg-[#0f1a20] p-8 lg:col-span-7 md:p-10"><h4 className="text-3xl font-semibold">Kowloon and Swindon</h4><p className="mt-5 text-lg leading-8 text-white/70">I looked at Kowloon Walled City for its tight passages, stacked structures, exposed pipes, and unplanned vertical growth. Swindon Railway Works gave me references for workshops, engineering materials, machinery, and the history of a large industrial site that later became quiet.</p></article>
            <article className="rounded-[28px] bg-[#3b4d53] p-8 lg:col-span-5 md:p-10"><h4 className="text-3xl font-semibold">Research organisation</h4><p className="mt-5 text-lg leading-8 text-white/70">I used a Miro board to collect the client research, visual references, atmosphere ideas, and design principles in one place. Seeing the full board together made it easier to compare the evidence before choosing the final concept.</p></article>
          </div>
          <div className="mt-4 overflow-hidden rounded-[28px] bg-[#14232c]"><img src={miroImage("group-mindmap.png")} alt="Research mind map showing the influences and design questions for MIRO" className="aspect-video w-full object-cover" /></div>
        </div>
      </section>

      <section id="experience" data-case-study-chapter className="scroll-mt-16 bg-[#d5b84a] py-32 text-[#172025] md:py-44">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Heading dark intro="In the final build, I connected exploration, collection, currency, upgrades, and visible area progress into one loop. I have documented the planned puzzle systems separately because they did not reach a complete enough state to include as delivered features.">Project Details</Heading>
          <div className="mt-16 grid grid-flow-dense overflow-hidden rounded-t-[30px] bg-[#101a20] md:grid-cols-12 md:gap-px [&>article]:rounded-none">
            {[
              ["Explore", "The first person controller allows the player to move through factories, alleys, platforms, and polluted industrial spaces. I used lighting and dense prop placement to identify the main route without adding constant objective markers."],
              ["Collect", "Box Collider zones control where trash can spawn. A camera raycast selects the object in view, while a white outline and prompt make it clear when that object can be collected."],
              ["Sell", "The player looks at the Sell NPC and holds the interaction to begin selling. Trash is thrown from the inventory toward the NPC and converted into craig coins, giving the transaction visible feedback."],
              ["Improve", "The player spends craig coins on Multi Pick, Auto Pickup, Pickup Range, Carry Capacity, and Move Speed. Area progress also records how much waste has been removed, giving the repeated collection action a clear local goal."],
            ].map(([title, body], index) => <article key={title} className={`rounded-[28px] p-8 ${index === 0 || index === 3 ? "md:col-span-7" : "md:col-span-5"} ${index === 1 ? "md:-mb-px" : ""} ${index % 2 === 0 ? "bg-[#101a20] text-white" : "bg-[#f5ebbd]"}`}><h4 className="text-3xl font-semibold">{title}</h4><p className={`mt-5 text-base leading-7 ${index % 2 === 0 ? "text-white/70" : "text-[#172025]/74"}`}>{body}</p></article>)}
          </div>
          <div className="mt-0 grid gap-px overflow-hidden rounded-b-[30px] bg-[#101a20] lg:grid-cols-[1.15fr_0.85fr] [&>article]:rounded-none">
            <article className="rounded-[28px] bg-[#f5ebbd] p-8 md:p-10"><h4 className="text-3xl font-semibold">Area progress</h4><p className="mt-5 text-lg leading-8 text-[#172025]/74">I defined areas such as the Entrance with Box Colliders that check where the player is standing. Trash collected inside each collider contributes to that area's completion percentage, turning the repeated pickup action into a clear local objective.</p></article>
            <article className="rounded-[28px] bg-[#101a20] p-8 text-white md:p-10"><h4 className="text-3xl font-semibold">Upgrade architecture</h4><p className="mt-5 text-lg leading-8 text-white/70">I used ScriptableObjects to store each upgrade's name, level, cost, and effect. Keeping this data separate from the purchase flow means I can add more upgrades without rebuilding the main system.</p></article>
          </div>
          <article className="mt-4 rounded-[28px] bg-[#243a44] p-8 text-white md:p-10"><h4 className="text-3xl font-semibold">Interface</h4><p className="mt-5 max-w-4xl text-lg leading-8 text-white/70">I designed the final interface to show currency, trash feedback, area progress, purchase costs, and upgrade levels without covering too much of the environment. The menus include Play, Options, Quit, Resume, Main Menu, and Quit to Desktop, with a spinner providing feedback during scene changes.</p></article>
          <img src={miroImage("trash-pickup.png")} alt="Trash pickup interaction with an object outline and area progress interface" className="mt-4 aspect-video w-full rounded-[28px] object-cover" />
        </div>
      </section>

      <section id="process" data-case-study-chapter className="scroll-mt-16 bg-[#edf0ed] py-32 text-[#172025] md:py-44">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Heading dark intro="I developed the project through concept selection, production planning, whiteboxing, environment work, system development, interface work, and testing. Each stage helped me reduce the original idea into a complete and achievable final loop.">Process</Heading>
          <div className="mt-16 grid gap-0 overflow-hidden rounded-[32px] lg:grid-cols-12 [&>article]:rounded-none">
            <article className="rounded-[28px] bg-[#182a32] p-8 text-white lg:col-span-5 md:p-10"><h4 className="text-3xl font-semibold">Tidesouls</h4><p className="mt-5 text-lg leading-8 text-white/70">My first concept was a dark fantasy world beneath an upside down ocean. Once I broke down the work, the combat, mutated enemies, bosses, complex animation, and large landscape were clearly beyond the available time and my current skill level.</p></article>
            <article className="rounded-[28px] bg-[#35535b] p-8 text-white lg:col-span-3 md:p-10"><h4 className="text-3xl font-semibold">Fisk</h4><p className="mt-5 text-lg leading-8 text-white/70">My second concept explored ocean survival through custom ships, loot, and possible crews. Ship building, multiplayer, and survival systems were still too broad, but the idea of resource collection carried forward into MIRO.</p></article>
            <article className="rounded-[28px] bg-[#d5b84a] p-8 lg:col-span-4 md:p-10"><h4 className="text-3xl font-semibold">MIRO</h4><p className="mt-5 text-lg leading-8 text-[#172025]/76">For the final concept, I reduced the world to one robot, one postindustrial district, and one complete play loop. Choosing first person movement also reduced the amount of character animation required, giving me more time to focus on the environment and systems.</p></article>
          </div>
          <img src={miroImage("world-sketch.png")} alt="Top down concept sketch for the MIRO industrial city route" className="mt-4 aspect-video w-full rounded-[28px] object-cover" />
          <div className="mt-4 grid gap-3 md:grid-cols-2 [&>article]:rounded-[10px] [&>article]:shadow-none">
            {[
              ["Narrative and visual direction", "I introduced MIRO as a trash collector in an abandoned city who reaches deeper districts by cleaning and upgrading. Dark grey, rust, brown, black, and dark blue establish the industrial base, while cyan, green, yellow, and orange help the player recognise machines, doors, and interactive objects."],
              ["Planning and tools", "I created a five week plan covering the concept and blockout, mechanics, progression, visual guidance, testing, and polish. Trello separated the research, production, testing, and presentation tasks, while GitHub and Git LFS gave me version history and an online backup."],
              ["Whitebox", "I used simple shapes to test the player's scale, the main route, possible puzzle spaces, and the positions of the trash, selling, and upgrade areas before spending time on detailed assets."],
              ["Environment", "I gradually replaced the blockout with industrial buildings, platforms, pipes, factory pieces, scrap, fog, and controlled lighting. Adding smaller props and stronger lighting around key spaces reduced the empty areas and made the route easier to follow."],
              ["Custom asset work", "I created modular pipes and chains so the same assets could be repeated throughout the environment. When the BlenderKit workflow failed, I replaced its materials with Poly Haven textures. I also started a more complex truck, but left it out of the finished evidence because it remained incomplete."],
              ["Shader experiment", "I tested a custom wind shader on the tree leaves, but it produced purple materials in HDRP. I removed the effect from the final build, although the test helped me understand how shader compatibility can change between render pipelines."],
              ["Interaction systems", "I created spawning zones so I did not have to place every piece of trash manually. I then changed pickup to a camera raycast, gave selling its own input and physical throw feedback, and completed the loop with area progress and ScriptableObject upgrades."],
              ["Interface", "I built a main menu with falling trash, a pause menu, loading spinner, fade transitions, and an upgrade screen. Using Screen Space Camera composition allowed me to place world elements both behind and in front of the menu artwork."],
              ["QA", "Riley found the world, trash outlines, and PEGI 12 direction clear, while suggesting smaller NPC hitboxes and optional objective text. Ben identified unclear routes, sparse areas, and a need for stronger context, so I added more industrial detail and improved the guidance through the environment."],
            ].map(([title, body], index) => <article key={title} className={`grid gap-5 rounded-[28px] bg-white p-8 md:grid-cols-[0.7fr_1.3fr] md:p-10 ${index === 0 || index === 6 ? "md:col-span-2" : ""}`}><h4 className="text-3xl font-semibold tracking-[-0.035em]">{title}</h4><p className="text-lg leading-8 text-[#172025]/72">{body}</p></article>)}
          </div>
          <img src={miroImage("trello-plan.png")} alt="Trello board organising MIRO production tasks and weekly stages" className="mt-4 aspect-video w-full rounded-[28px] object-cover" />
          <div className="mt-16 grid grid-flow-dense gap-4 lg:grid-cols-12">
            <article id="miro-custom-assets" className="rounded-[28px] bg-[#193441] p-8 text-white lg:col-span-7 md:p-10"><h4 className="text-3xl font-semibold">Custom assets</h4><p className="mt-5 text-lg leading-8 text-white/70">I built two modular pipe pieces from primitives, using extrusion, inset, BoltFactory details, and a Bezier curve to create the bend. I turned a torus into the chain link and used a colour ramp to correct the yellow cast in its Poly Haven material. I kept the polygon counts limited because both assets needed to be repeated throughout the environment.</p></article>
            <article id="miro-production-workflow" className="rounded-[28px] bg-[#d5b84a] p-8 text-[#172025] lg:col-span-5 md:p-10"><h4 className="text-3xl font-semibold">Production workflow</h4><p className="mt-5 text-lg leading-8 text-[#172025]/76">I built the project with Unity 6000.0.62f, HDRP, Blender, GitHub, Git LFS, and Trello. Scans Factory, 3D Urban, Quixel Megascans, Easy Performant Outline, and Poly Haven supplied additional environment assets or material resources where creating everything from the beginning was outside the scope.</p></article>
            <article className="rounded-[28px] bg-[#dfe8e6] p-8 text-[#172025] lg:col-span-12 md:p-10"><h4 className="text-3xl font-semibold">Project organisation</h4><p className="mt-5 text-lg leading-8 text-[#172025]/74">I kept the Unity hierarchy and folders organised so scripts and objects were easier to find while debugging. I also exposed the spawn amount, area, and rate in the Inspector, which let me balance the system without changing the code for every test.</p></article>
          </div>
        </div>
      </section>

      <section id="extras" data-case-study-chapter className="scroll-mt-16 bg-[#10202a] py-32 md:py-44">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Heading intro="These notes separate the systems I planned from the features that were complete and working in the final build.">Extras</Heading>
        <div className="mt-16">
            <article id="miro-scope-control" className="rounded-[28px] bg-[#f5ebbd] p-8 text-[#172025] md:p-10"><h4 className="text-3xl font-semibold">Scope control</h4><p className="mt-5 max-w-5xl text-lg leading-8 text-[#172025]/74">The wider design included keys, access cards, power cells, machine parts, generators, notes, locked gates, and connected environmental puzzles. These remained planned features, so I kept the final build focused on the complete collect, sell, upgrade, and clear loop instead of presenting unfinished systems as delivered work.</p></article>
          </div>
        </div>
      </section>

      <section id="reflection" data-case-study-chapter className="scroll-mt-16 bg-[#edf0ed] py-32 text-[#172025] md:py-44">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Heading dark intro="In this evaluation, I compare the final build with the original brief and record both what I completed and what still needs further development.">Reflection</Heading>
          <div className="mt-16 grid gap-0 overflow-hidden rounded-[30px] md:grid-cols-12 [&>article]:rounded-none">
            <article className="rounded-[28px] bg-white p-8 md:col-span-7 md:p-10"><h4 className="text-3xl font-semibold">What worked</h4><p className="mt-5 text-lg leading-8 text-[#172025]/72">I think the strongest relationship is between the robot, the abandoned city, and the collection loop. Trash belongs naturally in the setting, selling it produces a clear reward, and the upgrades give the player a reason to continue cleaning.</p></article>
            <article className="rounded-[28px] bg-[#d5b84a] p-8 md:col-span-5 md:p-10"><h4 className="text-3xl font-semibold">Scope decision</h4><p className="mt-5 text-lg leading-8 text-[#172025]/76">Moving from Tidesouls and Fisk to MIRO made the project achievable within the time available. Removing the unfinished puzzle items also protected the quality of the main loop before the deadline.</p></article>
            <article className="rounded-[28px] bg-[#182a32] p-8 text-white md:col-span-12 md:p-10"><h4 className="text-3xl font-semibold">Further work</h4><p className="mt-5 max-w-5xl text-lg leading-8 text-white/70">In the next iteration, I would add the connected puzzle chains using keys, access cards, power cells, generators, and notes. I would also create more scrap types, improve the upgrade interface, expand the unlockable areas, add more robot assets, and provide audio feedback for collecting, selling, powering machines, and opening doors.</p></article>
          </div>
        </div>
      </section>
    </CaseStudyShell>
  );
}
