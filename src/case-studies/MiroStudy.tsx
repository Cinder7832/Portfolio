import { useRef } from "react";
import { usePrefersReducedMotion } from "../motion";
import CaseStudyShell from "./CaseStudyShell";
import { CaseStudyShowcaseImage, CaseStudyShowcaseRail } from "./CaseStudyMedia";
import { caseStudyDefinitions } from "./definitions";

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
          <p className="mt-8 max-w-4xl text-lg leading-8 text-white/78">A first person Unity HDRP vertical slice about a trash collector robot cleaning and progressing through an abandoned postindustrial alien city.</p>
        </div>
      </header>

      <CaseStudyShowcaseRail background="#0b151c" railRef={showcaseRef} onScroll={scrollShowcase}>
        {showcase.map(([file, alt]) => (
          <div key={file} className="w-[86vw] shrink-0 snap-start md:w-[62vw] lg:w-[48rem]">
            <CaseStudyShowcaseImage src={miroImage(file)} alt={alt} title={alt} />
          </div>
        ))}
      </CaseStudyShowcaseRail>

      <section id="overview" data-case-study-chapter className="scroll-mt-16 bg-[#d5b84a] py-32 text-[#11181c] md:py-44">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Heading dark intro="The project responds to the Another World brief with a playable 3D vertical slice for Cyan Worlds. The outcome uses exploration, environmental storytelling and nonviolent progression for an audience up to PEGI 12.">Overview</Heading>
          <div className="mt-16 overflow-hidden rounded-[32px] bg-[#101a20] text-white shadow-[0_30px_90px_rgba(16,26,32,0.24)]">
            <article className="grid gap-8 p-8 md:grid-cols-[0.8fr_1.2fr] md:p-12"><h4 className="text-4xl font-semibold tracking-[-0.05em] md:text-6xl">Project premise</h4><p className="text-xl leading-9 text-white/70">The player controls MIRO, a trash collector robot in a city of abandoned factories, polluted spaces and locked districts. Waste becomes currency, and currency funds upgrades that make later collection more efficient.</p></article>
            <div className="grid gap-0 md:grid-cols-3">
              <article className="bg-[#182a32] p-8 md:p-10"><h4 className="text-xl font-semibold text-[#d5b84a]">Responsibility</h4><p className="mt-5 leading-7 text-white/68">I developed the concept, environment, player movement, lighting, interaction systems, progression, interface, testing changes and production plan.</p></article>
              <article className="bg-[#182a32] p-8 md:p-10"><h4 className="text-xl font-semibold text-[#d5b84a]">Brief</h4><p className="mt-5 leading-7 text-white/68">The work required worldbuilding, atmosphere, visual storytelling or gameplay, plus a pitch, research, development evidence, feedback and a final showcase.</p></article>
              <article className="bg-[#182a32] p-8 md:p-10"><h4 className="text-xl font-semibold text-[#d5b84a]">Delivered scope</h4><p className="mt-5 leading-7 text-white/68">Trash spawning, raycast pickup, NPC selling, area progress, five upgrades, menus, loading feedback and a completed environment route.</p></article>
            </div>
          </div>
        </div>
      </section>

      <section id="research" data-case-study-chapter className="scroll-mt-16 bg-[#081016] py-32 md:py-44">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Heading intro="Research covered the client, target audience, game systems, film, real places and production scope. The findings shaped both the final direction and the concepts that were rejected.">Research</Heading>
          <div className="mt-16 grid gap-0 overflow-hidden rounded-[32px] lg:grid-cols-12 [&>article]:rounded-none">
            <article className="rounded-[28px] bg-[#14232c] p-8 lg:col-span-7 md:p-10"><h4 className="text-3xl font-semibold">Cyan Worlds and Myst</h4><p className="mt-5 text-lg leading-8 text-white/70">Cyan Worlds research focused on first person exploration, unusual technology, environmental clues, logic puzzles and worlds that explain themselves through observation. A recorded Myst playthrough reinforced the value of minimal instruction, remembered clues and experimentation.</p></article>
            <article className="rounded-[28px] bg-[#d5b84a] p-8 text-[#172025] lg:col-span-5 md:p-10"><h4 className="text-3xl font-semibold">Audience and rating</h4><p className="mt-5 text-lg leading-8 text-[#172025]/76">The design avoids graphic violence, gore and mature themes. Tension comes from the atmosphere, locked spaces and mystery, while progress comes from cleaning, collecting, upgrading and discovery.</p></article>
            <article className="rounded-[28px] bg-[#193441] p-8 lg:col-span-4"><h4 className="text-2xl font-semibold">Stray</h4><p className="mt-4 leading-8 text-white/68">Its robot city, narrow routes, vertical traversal and dense props informed the scale of a small nonhuman protagonist inside a layered urban environment.</p></article>
            <article className="rounded-[28px] bg-[#24343b] p-8 lg:col-span-4"><h4 className="text-2xl font-semibold">Cyberpunk 2077</h4><p className="mt-4 leading-8 text-white/68">Night City research informed industrial density, neon contrast, layered signage and lighting that supports mood and route readability.</p></article>
            <article className="rounded-[28px] bg-[#30454e] p-8 lg:col-span-4"><h4 className="text-2xl font-semibold">Elden Ring</h4><p className="mt-4 leading-8 text-white/68">Landmarks, region identity and environmental storytelling showed how a world can guide exploration. Its scale also exposed why the first fantasy concept was not achievable.</p></article>
            <article className="rounded-[28px] bg-[#dfe8e6] p-8 text-[#172025] lg:col-span-4"><h4 className="text-2xl font-semibold">Raft</h4><p className="mt-4 leading-8 text-[#172025]/72">Its connected collection, crafting, building and progression loop influenced the resource structure of Fisk and later the decision to build MIRO around one repeatable action.</p></article>
            <article className="rounded-[28px] bg-[#f5ebbd] p-8 text-[#172025] lg:col-span-4"><h4 className="text-2xl font-semibold">Leaf it Alone</h4><p className="mt-4 leading-8 text-[#172025]/72">Physical collection, disposal, visible area change and tool upgrades directly informed trash pickup, selling, area completion and upgrade progression.</p></article>
            <article className="rounded-[28px] bg-[#c7c9b6] p-8 text-[#172025] lg:col-span-4"><h4 className="text-2xl font-semibold">WALL-E</h4><p className="mt-4 leading-8 text-[#172025]/72">A small trash robot moving through a world shaped by waste connected the character role to environmental storytelling without requiring combat.</p></article>
            <article className="rounded-[28px] bg-[#0f1a20] p-8 lg:col-span-7 md:p-10"><h4 className="text-3xl font-semibold">Kowloon and Swindon</h4><p className="mt-5 text-lg leading-8 text-white/70">Kowloon Walled City informed tight passages, stacked structures, pipes and unplanned vertical growth. Swindon Railway Works informed workshops, engineering materials, machinery and the history of a large industrial site that later fell quiet.</p></article>
            <article className="rounded-[28px] bg-[#3b4d53] p-8 lg:col-span-5 md:p-10"><h4 className="text-3xl font-semibold">Research organisation</h4><p className="mt-5 text-lg leading-8 text-white/70">A Miro board gathered client research, visual references, atmosphere and design principles. The full board helped compare the evidence before the final concept was selected.</p></article>
          </div>
          <div className="mt-4 overflow-hidden rounded-[28px] bg-[#14232c]"><img src={miroImage("group-mindmap.png")} alt="Research mind map showing the influences and design questions for MIRO" className="aspect-video w-full object-cover" /></div>
        </div>
      </section>

      <section id="experience" data-case-study-chapter className="scroll-mt-16 bg-[#d5b84a] py-32 text-[#172025] md:py-44">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Heading dark intro="The final gameplay loop connects exploration, collection, currency, upgrades and visible area progress. Planned puzzle systems are documented separately because they did not reach the final build.">Gameplay</Heading>
          <div className="mt-16 grid grid-flow-dense overflow-hidden rounded-t-[30px] bg-[#101a20] md:grid-cols-12 md:gap-px [&>article]:rounded-none">
            {[
              ["Explore", "The first person controller moves through factories, alleys, platforms and polluted industrial spaces. Lighting and dense props identify the main route."],
              ["Collect", "Box Collider zones spawn trash. A camera raycast selects the object in view, while a white outline and prompt confirm that it can be collected."],
              ["Sell", "The player looks at the Sell NPC and holds the interaction. Trash is thrown from the inventory toward the NPC and converted into craig coins."],
              ["Improve", "Craig coins buy Multi Pick, Auto Pickup, Pickup Range, Carry Capacity and Move Speed. Area progress records how much waste has been removed."],
            ].map(([title, body], index) => <article key={title} className={`rounded-[28px] p-8 ${index === 0 || index === 3 ? "md:col-span-7" : "md:col-span-5"} ${index === 1 ? "md:-mb-px" : ""} ${index % 2 === 0 ? "bg-[#101a20] text-white" : "bg-[#f5ebbd]"}`}><h4 className="text-3xl font-semibold">{title}</h4><p className={`mt-5 text-base leading-7 ${index % 2 === 0 ? "text-white/70" : "text-[#172025]/74"}`}>{body}</p></article>)}
          </div>
          <div className="mt-0 grid gap-px overflow-hidden rounded-b-[30px] bg-[#101a20] lg:grid-cols-[1.15fr_0.85fr] [&>article]:rounded-none">
            <article className="rounded-[28px] bg-[#f5ebbd] p-8 md:p-10"><h4 className="text-3xl font-semibold">Area progress</h4><p className="mt-5 text-lg leading-8 text-[#172025]/74">Each defined area, including the Entrance, checks whether the player is inside its Box Collider. Trash collected there contributes to that area’s completion percentage, turning a repeated pickup action into a local objective.</p></article>
            <article className="rounded-[28px] bg-[#101a20] p-8 text-white md:p-10"><h4 className="text-3xl font-semibold">Upgrade architecture</h4><p className="mt-5 text-lg leading-8 text-white/70">Scriptable Objects store each upgrade’s name, level, cost and effect. This separates upgrade data from the purchase flow and allows more upgrades to be added without rebuilding the system.</p></article>
          </div>
          <img src={miroImage("trash-pickup.png")} alt="Trash pickup interaction with an object outline and area progress interface" className="mt-4 aspect-video w-full rounded-[28px] object-cover" />
        </div>
      </section>

      <section id="process" data-case-study-chapter className="scroll-mt-16 bg-[#edf0ed] py-32 text-[#172025] md:py-44">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Heading dark intro="The project moved through concept selection, production planning, whiteboxing, environment work, system development, interface work and testing.">Process</Heading>
          <div className="mt-16 grid gap-0 overflow-hidden rounded-[32px] lg:grid-cols-12 [&>article]:rounded-none">
            <article className="rounded-[28px] bg-[#182a32] p-8 text-white lg:col-span-5 md:p-10"><h4 className="text-3xl font-semibold">Tidesouls</h4><p className="mt-5 text-lg leading-8 text-white/70">The first concept placed a dark fantasy world beneath an upside down ocean. Combat, mutated enemies, bosses, complex animation and a large landscape exceeded the available time and current skill level.</p></article>
            <article className="rounded-[28px] bg-[#35535b] p-8 text-white lg:col-span-3 md:p-10"><h4 className="text-3xl font-semibold">Fisk</h4><p className="mt-5 text-lg leading-8 text-white/70">The second concept explored ocean survival, custom ships, loot and possible crews. Ship building, multiplayer and survival systems remained too broad, but resource collection carried into MIRO.</p></article>
            <article className="rounded-[28px] bg-[#d5b84a] p-8 lg:col-span-4 md:p-10"><h4 className="text-3xl font-semibold">MIRO</h4><p className="mt-5 text-lg leading-8 text-[#172025]/76">The final concept reduced the world to one robot, one postindustrial district and one complete play loop. First person movement also reduced the amount of character animation required.</p></article>
          </div>
          <img src={miroImage("world-sketch.png")} alt="Top down concept sketch for the MIRO industrial city route" className="mt-4 aspect-video w-full rounded-[28px] object-cover" />
          <div className="mt-4 grid gap-3 md:grid-cols-2 [&>article]:rounded-[10px] [&>article]:shadow-none">
            {[
              ["Narrative and visual direction", "MIRO begins as a trash collector in an abandoned city and reaches deeper districts by cleaning and upgrading. Dark grey, rust, brown, black and dark blue establish the industrial base. Cyan, green, yellow and orange identify machines, doors and interactive objects."],
              ["Planning and tools", "A five week plan covered concept and blockout, mechanics, progression, visual guidance, then testing and polish. Trello separated research, production, testing and presentation work. GitHub and Git LFS provided version history and a backup."],
              ["Whitebox", "Simple shapes tested player scale, the main route, puzzle spaces and the positions of trash, selling and upgrade areas before detailed assets were placed."],
              ["Environment", "Industrial buildings, platforms, pipes, factory pieces, scrap, fog and controlled lighting replaced the blockout. Smaller props and lighting around key spaces reduced empty areas and improved route guidance."],
              ["Custom asset work", "Modular pipes and chains were created for repeated use. Poly Haven textures replaced a failed BlenderKit workflow. A more complex truck remained incomplete and was not included as finished evidence."],
              ["Shader experiment", "A custom wind shader for tree leaves produced purple materials in HDRP. The effect was removed, but the test improved understanding of shader compatibility in the target pipeline."],
              ["Interaction systems", "Trash spawning zones reduced manual placement. Pickup changed to a camera raycast, selling received a separate input and physical throw feedback, then area progress and Scriptable Object upgrades completed the loop."],
              ["Interface", "The build includes a main menu with falling trash, a pause menu, loading spinner, fade transitions and an upgrade screen. Screen Space Camera composition places world elements behind and in front of the menu."],
              ["QA", "Riley found the world, trash outlines and PEGI 12 direction clear, while suggesting smaller NPC hitboxes and optional objective text. Ben identified unclear routes, sparse areas and a need for stronger context, which led to more industrial detail."],
            ].map(([title, body], index) => <article key={title} className={`grid gap-5 rounded-[28px] bg-white p-8 md:grid-cols-[0.7fr_1.3fr] md:p-10 ${index === 0 || index === 6 ? "md:col-span-2" : ""}`}><h4 className="text-3xl font-semibold tracking-[-0.035em]">{title}</h4><p className="text-lg leading-8 text-[#172025]/72">{body}</p></article>)}
          </div>
          <img src={miroImage("trello-plan.png")} alt="Trello board organising MIRO production tasks and weekly stages" className="mt-4 aspect-video w-full rounded-[28px] object-cover" />
        </div>
      </section>

      <section id="extras" data-case-study-chapter className="scroll-mt-16 bg-[#10202a] py-32 md:py-44">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Heading intro="Supporting production evidence records the technical setup, asset workflow, project organisation and final scope decisions. No video or 3D model embeds are included.">Extras</Heading>
        <div className="mt-16 grid grid-flow-dense gap-0 overflow-hidden rounded-[32px] lg:grid-cols-12 [&>article]:rounded-none">
            <article id="miro-custom-assets" className="rounded-[28px] bg-[#193441] p-8 lg:col-span-7 md:p-10"><h4 className="text-3xl font-semibold">Custom assets</h4><p className="mt-5 text-lg leading-8 text-white/70">Two modular pipe pieces used primitives, extrusion, inset, BoltFactory details and a Bezier curve for the bend. A torus became the chain link, with a colour ramp correcting the yellow cast in its Poly Haven material. Polygon counts remained limited for repeated environment use.</p></article>
            <article id="miro-production-workflow" className="rounded-[28px] bg-[#d5b84a] p-8 text-[#172025] lg:col-span-5 md:p-10"><h4 className="text-3xl font-semibold">Production workflow</h4><p className="mt-5 text-lg leading-8 text-[#172025]/76">Unity 6000.0.62f, HDRP, Blender, GitHub, Git LFS and Trello supported the project. Scans Factory, 3D Urban, Quixel Megascans, Easy Performant Outline and Poly Haven supplied additional environment or material resources.</p></article>
            <article className="rounded-[28px] bg-[#dfe8e6] p-8 text-[#172025] lg:col-span-5 md:p-10"><h4 className="text-3xl font-semibold">Project organisation</h4><p className="mt-5 text-lg leading-8 text-[#172025]/74">A clean Unity hierarchy and folder structure made scripts and objects easier to find during debugging. Inspector values exposed spawn amount, area and rate for faster balancing.</p></article>
            <article className="rounded-[28px] bg-[#243a44] p-8 lg:col-span-7 md:p-10"><h4 className="text-3xl font-semibold">Interface inventory</h4><p className="mt-5 text-lg leading-8 text-white/70">The final interface covers currency, trash feedback, area progress, purchase cost and upgrade level. Menus include Play, Options, Quit, Resume, Main Menu and Quit to Desktop, with a spinner for scene changes.</p></article>
            <article id="miro-scope-control" className="rounded-[28px] bg-[#f5ebbd] p-8 text-[#172025] lg:col-span-12 md:p-10"><h4 className="text-3xl font-semibold">Scope control</h4><p className="mt-5 max-w-5xl text-lg leading-8 text-[#172025]/74">The wider design proposed keys, access cards, power cells, machine parts, generators, notes, locked gates and chained environmental puzzles. These remained planned features. The final build concentrates on the complete collect, sell, upgrade and clear loop rather than presenting unfinished systems as delivered work.</p></article>
          </div>
        </div>
      </section>

      <section id="reflection" data-case-study-chapter className="scroll-mt-16 bg-[#edf0ed] py-32 text-[#172025] md:py-44">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Heading dark intro="The evaluation compares the final build with the brief and records both the completed work and the missing systems.">Reflection</Heading>
          <div className="mt-16 grid gap-0 overflow-hidden rounded-[30px] md:grid-cols-12 [&>article]:rounded-none">
            <article className="rounded-[28px] bg-white p-8 md:col-span-7 md:p-10"><h4 className="text-3xl font-semibold">What worked</h4><p className="mt-5 text-lg leading-8 text-[#172025]/72">The strongest relationship is between the robot, the abandoned city and the collection loop. Trash belongs in the setting, selling it produces a clear reward and upgrades give the player a reason to continue cleaning.</p></article>
            <article className="rounded-[28px] bg-[#d5b84a] p-8 md:col-span-5 md:p-10"><h4 className="text-3xl font-semibold">Scope decision</h4><p className="mt-5 text-lg leading-8 text-[#172025]/76">Moving from Tidesouls and Fisk to MIRO made the project achievable. Removing the unfinished puzzle items protected the quality of the main loop before the deadline.</p></article>
            <article className="rounded-[28px] bg-[#182a32] p-8 text-white md:col-span-12 md:p-10"><h4 className="text-3xl font-semibold">Further work</h4><p className="mt-5 max-w-5xl text-lg leading-8 text-white/70">The next iteration would restore puzzle chains with keys, access cards, power cells, generators and notes. It would also add more scrap types, improve the upgrade interface, expand unlockable areas, add robot assets and provide audio feedback for collecting, selling, powering machines and opening doors.</p></article>
          </div>
        </div>
      </section>
    </CaseStudyShell>
  );
}
