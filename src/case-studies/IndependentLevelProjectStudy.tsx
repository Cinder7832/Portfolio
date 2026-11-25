import { useRef } from "react";
import { usePrefersReducedMotion } from "../motion";
import CaseStudyShell from "./CaseStudyShell";
import { CaseStudyShowcaseImage, CaseStudyShowcaseRail } from "./CaseStudyMedia";
import { caseStudyDefinitions } from "./definitions";
import { projectSummary } from "./projectSummary";

const projectImage = (file: string) => `${import.meta.env.BASE_URL}projects/independent-level-project/${file}`;

function Heading({ children, intro, dark = false }: { children: string; intro?: string; dark?: boolean }) {
  return (
    <div className="max-w-5xl">
      <h3 className="text-5xl font-semibold leading-[0.9] tracking-[-0.06em] md:text-8xl">{children}</h3>
      {intro && <p className={`mt-7 max-w-4xl text-lg leading-8 ${dark ? "text-[#102327]/70" : "text-white/66"}`}>{intro}</p>}
    </div>
  );
}

export default function IndependentLevelProjectView({ onClose }: { onClose: () => void }) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const showcaseRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const tagline = projectSummary("independent-level-project", "A first person Unity runner level that teaches jumping through a white box obstacle course.");

  const scrollShowcase = (direction: -1 | 1) => {
    const rail = showcaseRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * Math.min(rail.clientWidth * 0.82, 680), behavior: reducedMotion ? "auto" : "smooth" });
  };

  return (
    <CaseStudyShell definition={caseStudyDefinitions["independent-level-project"]} scrollRef={scrollRef} onClose={onClose} className="bg-[#071619] text-white">
      <header className="relative min-h-[42rem] overflow-hidden bg-[#071619] md:min-h-[52rem]">
        <img src={projectImage("final-layout.png")} alt="Final Unity level layout with cyan platforms, curved corridors, pistons, and pipe traversal" className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,13,16,0.12),rgba(3,13,16,0.46)_45%,rgba(3,13,16,0.96))]" aria-hidden="true" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_28%,rgba(74,219,220,0.2),transparent_36%)]" aria-hidden="true" />
        <div className="relative mx-auto flex min-h-[42rem] max-w-7xl flex-col justify-end px-5 pb-16 pt-28 md:min-h-[52rem] md:px-8 md:pb-24">
          <h2 className="max-w-6xl text-[clamp(3.5rem,10vw,8.5rem)] font-semibold leading-[0.84] tracking-[-0.07em]">Independent Level Project</h2>
          <p className="mt-8 max-w-4xl text-lg leading-8 text-white/76">{tagline}</p>
        </div>
      </header>

      <CaseStudyShowcaseRail background="#0b2428" railRef={showcaseRef} onScroll={scrollShowcase}>
        {[
          ["final-layout.png", "Final Unity level layout showing the complete cyan and charcoal course"],
          ["moving-platform.png", "Unity editor view of the moving platform mechanism"],
          ["initial-blockout.png", "Initial ProBuilder blockout with floors separated from the walls"],
          ["sketch-3.jpg", "Third preliminary route sketch with hidden rooms and score stars"],
          ["concept-art.jpg", "Pencil concept art for a rooftop jump across the data city"],
        ].map(([file, alt]) => (
          <div key={file} className="w-[86vw] shrink-0 snap-center md:w-[62vw] lg:w-[48rem]">
            <CaseStudyShowcaseImage src={projectImage(file)} alt={alt} title={alt} />
          </div>
        ))}
      </CaseStudyShowcaseRail>

      <section id="overview" data-case-study-chapter className="scroll-mt-16 bg-[#e9f4f1] py-32 text-[#102327] md:py-44">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Heading dark intro="The assignment asked for a tutorial level that teaches one mechanic: jumping. The final submission records a working Unity course and the decisions that changed it during production.">Overview</Heading>
          <div className="mt-16 grid grid-flow-dense gap-4 md:grid-cols-12">
            <article className="rounded-[28px] bg-white p-8 shadow-[0_20px_55px_rgba(10,49,53,0.08)] md:col-span-7 md:p-11"><h4 className="text-3xl font-semibold tracking-[-0.035em]">Project goal</h4><p className="mt-6 max-w-2xl text-lg leading-8 text-[#102327]/72">The brief defined a first person runner tutorial built from primitive geometry. Running and jumping formed the required player actions, while the route had to establish a safe first jump before increasing the challenge.</p></article>
            <article className="rounded-[28px] bg-[#58c4c6] p-8 text-[#071619] md:col-span-5 md:p-10"><h4 className="text-3xl font-semibold tracking-[-0.035em]">Responsibility</h4><p className="mt-6 text-lg leading-8 text-[#071619]/76">I developed the concept, drew the route iterations, created the key moment artwork, built the Unity level, added its mechanisms, and revised the layout within the available classroom sessions.</p></article>
            <article className="rounded-[28px] bg-[#102f34] p-8 text-white md:col-span-5"><h4 className="text-2xl font-semibold">Technical setup</h4><p className="mt-4 leading-8 text-white/66">Unity 6, URP, ProBuilder, and the Starter Assets First Person Character supported the playable blockout.</p></article>
            <article className="rounded-[28px] bg-[#173f45] p-8 text-white md:col-span-7"><h4 className="text-2xl font-semibold">Delivered outcome</h4><p className="mt-4 leading-8 text-white/66">The completed route includes jump platforms, pistons, pipe traversal, a floating platform, and a final platform sequence. The documentation identifies visual and pacing goals that remained unresolved.</p></article>
          </div>
        </div>
      </section>

      <section id="research" data-case-study-chapter className="scroll-mt-16 bg-[#071619] py-32 md:py-44">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Heading intro="The research combined the assignment constraints with game references and three map iterations. The evidence records how the route expanded before it entered Unity.">Research</Heading>
          <div className="mt-16 grid grid-flow-dense gap-4 md:grid-cols-12">
            <article className="rounded-[28px] bg-[#12353a] p-8 md:col-span-7 md:p-10"><h4 className="text-3xl font-semibold">Game references</h4><p className="mt-5 text-lg leading-8 text-white/68">Mirror's Edge, Ghostrunner, and Cyberpunk 2077 informed the original direction. The notes identify their sharp contrast, lighting, fast pace, and continuous challenges as the main reference points.</p></article>
            <article className="rounded-[28px] bg-[#58c4c6] p-8 text-[#071619] md:col-span-5 md:p-10"><h4 className="text-3xl font-semibold">Initial concept</h4><p className="mt-5 text-lg leading-8 text-[#071619]/76">The player was described as an escaped cyborg crossing the rooftops of a data city. Speed and wonder were the intended feelings.</p></article>
            <article className="rounded-[28px] bg-[#0e292e] p-8 md:col-span-12 md:p-10"><h4 className="text-3xl font-semibold">Route iteration</h4><p className="mt-5 max-w-5xl text-lg leading-8 text-white/68">The first sketch established the route and major hazards. The second introduced hidden rooms and safe spots. The third added more hidden rooms and stars intended to increase score.</p></article>
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {[
              ["sketch-1.jpg", "First preliminary route sketch"],
              ["sketch-2.jpg", "Second route sketch with hidden rooms and safe spots"],
              ["sketch-3.jpg", "Third route sketch with more hidden rooms and score stars"],
            ].map(([file, alt]) => <figure key={file} className="overflow-hidden rounded-[28px] bg-[#0e292e]"><img src={projectImage(file)} alt={alt} className="aspect-[4/5] h-full w-full object-cover" /></figure>)}
          </div>
        </div>
      </section>

      <section id="experience" data-case-study-chapter className="scroll-mt-16 bg-[#58c4c6] py-32 text-[#071619] md:py-44">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Heading dark intro="The final course turns the jump tutorial into a continuous route. Static gaps introduce the movement, then mechanisms and narrower surfaces change the timing and available landing space.">Gameplay</Heading>
          <div className="mt-16 grid grid-flow-dense gap-4 md:grid-cols-12">
            <article className="rounded-[28px] bg-[#e9f4f1] p-8 md:col-span-7 md:p-10"><h4 className="text-3xl font-semibold">Critical path</h4><p className="mt-5 text-lg leading-8 text-[#071619]/72">The level keeps the player on one main route through enclosed passages, gaps, hazard rooms, a curved section, and the final platforms. The first person controller acts as the scale reference for the geometry.</p></article>
            <article className="rounded-[28px] bg-[#102f34] p-8 text-white md:col-span-5 md:p-10"><h4 className="text-3xl font-semibold">Pistons</h4><p className="mt-5 text-lg leading-8 text-white/68">Contact with the piston mechanisms pushes the player away. Later revisions place more pistons in the middle section to replace the earlier long hallway.</p></article>
            <article className="rounded-[28px] bg-[#17454b] p-8 text-white md:col-span-5 md:p-10"><h4 className="text-3xl font-semibold">Moving platform</h4><p className="mt-5 text-lg leading-8 text-white/68">A floating platform carries the player into the next area and adds movement to the otherwise fixed ProBuilder route.</p></article>
            <article className="rounded-[28px] bg-[#d8eeea] p-8 md:col-span-7 md:p-10"><h4 className="text-3xl font-semibold">Final revision</h4><p className="mt-5 text-lg leading-8 text-[#071619]/72">The revised middle asks the player to cross pipes between piston hazards. The ending removes the broad floor and replaces it with separate platforms that require more deliberate movement.</p></article>
          </div>
        </div>
      </section>

      <section id="process" data-case-study-chapter className="scroll-mt-16 bg-[#e9f4f1] py-32 text-[#102327] md:py-44">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Heading dark intro="The documented build moves from paper planning to ProBuilder construction, a basic visual pass, mechanism work, and a substantial route revision.">Process</Heading>
          <div className="mt-16 grid gap-4 md:grid-cols-2">
            {[
              ["Preproduction", "The brief established the tutorial constraint. Three paper layouts and the key moment drawing explored the route before construction began."],
              ["Initial blockout", "ProBuilder formed the level. Separate floors and walls made it possible to show or hide parts of the course independently while editing."],
              ["Visual pass", "A cyan material and the Free Stylized Skybox by Yuki2022 gave the white box a consistent colour and a readable horizon."],
              ["Mechanism pass", "Pistons introduced contact hazards. The floating platform added a moving surface that carries the player into the next area."],
              ["Route expansion", "The level grew toward the planned ending. An air current and large moving piston remained ideas because the schedule did not leave enough implementation time."],
              ["Final revision", "The middle hallway became a piston and pipe section. The final floor became separate platforms, producing the layout recorded in the last screenshot."],
            ].map(([title, body], index) => <article key={title} className={`rounded-[28px] p-8 md:p-10 ${index === 0 || index === 5 ? "bg-[#102f34] text-white md:col-span-2" : "bg-white shadow-[0_20px_55px_rgba(10,49,53,0.07)]"}`}><h4 className={`text-3xl font-semibold ${index === 0 || index === 5 ? "text-[#58c4c6]" : ""}`}>{title}</h4><p className={`mt-5 text-lg leading-8 ${index === 0 || index === 5 ? "text-white/68" : "text-[#102327]/70"}`}>{body}</p></article>)}
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <img src={projectImage("material-skybox-pass.png")} alt="Cyan material and stylised skybox applied to the growing ProBuilder route" className="aspect-[16/10] w-full rounded-[28px] object-cover" />
            <img src={projectImage("expanded-layout.png")} alt="Orthographic Unity view of the expanded level and piston room" className="aspect-[16/10] w-full rounded-[28px] object-cover" />
          </div>
        </div>
      </section>

      <section id="extras" data-case-study-chapter className="scroll-mt-16 bg-[#0b2428] py-32 md:py-44">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Heading intro="The project record distinguishes the completed Unity work from the planned features and identifies the external asset used for the sky.">Extras</Heading>
          <div className="mt-16 grid grid-flow-dense gap-4 md:grid-cols-12">
            <article id="independent-level-project-source" className="rounded-[28px] bg-[#58c4c6] p-8 text-[#071619] md:col-span-5 md:p-10"><h4 className="text-3xl font-semibold">Asset source</h4><p className="mt-5 text-lg leading-8 text-[#071619]/76">The visual pass used Free Stylized Skybox by Yuki2022 from the Unity Asset Store. The documented level geometry was built with ProBuilder.</p></article>
            <article id="independent-level-project-workflow" className="rounded-[28px] bg-[#12353a] p-8 md:col-span-7 md:p-10"><h4 className="text-3xl font-semibold">Build workflow</h4><p className="mt-5 text-lg leading-8 text-white/68">The floor and wall geometry remained separate so parts could be enabled or disabled independently. Orthographic views helped check the overall route as it expanded.</p></article>
            <article id="independent-level-project-scope" className="rounded-[28px] bg-[#e9f4f1] p-8 text-[#102327] md:col-span-7 md:p-10"><h4 className="text-3xl font-semibold">Scope control</h4><p className="mt-5 text-lg leading-8 text-[#102327]/72">The planned ending included a large moving piston and an air current that pushed against the player. Neither reached the final build because the available time was used to complete and revise the playable route.</p></article>
            <figure className="overflow-hidden rounded-[28px] bg-[#071619] md:col-span-5"><img src={projectImage("planned-ending.png")} alt="Unity layout view recorded while planning the end of the level" className="aspect-[4/3] h-full w-full object-cover" /></figure>
          </div>
        </div>
      </section>

      <section id="reflection" data-case-study-chapter className="scroll-mt-16 bg-[#e9f4f1] py-32 text-[#102327] md:py-44">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Heading dark intro="The debrief compares the finished level with the original concept and records the production limits without presenting unfinished ideas as delivered work.">Reflection</Heading>
          <div className="mt-16 grid grid-flow-dense gap-4 md:grid-cols-12">
            <article className="rounded-[28px] bg-white p-8 shadow-[0_20px_55px_rgba(10,49,53,0.08)] md:col-span-7 md:p-10"><h4 className="text-3xl font-semibold">Result against the concept</h4><p className="mt-5 text-lg leading-8 text-[#102327]/72">The level works, but the final visual style differs from the moodboard and the movement is less fast paced than the original references. The route also changed substantially from the first plan.</p></article>
            <article className="rounded-[28px] bg-[#58c4c6] p-8 text-[#071619] md:col-span-5 md:p-10"><h4 className="text-3xl font-semibold">Production limit</h4><p className="mt-5 text-lg leading-8 text-[#071619]/76">The debrief records fatigue after a previous platformer project and more scripting time than expected, including work completed with AI assistance.</p></article>
            <article className="rounded-[28px] bg-[#102f34] p-8 text-white md:col-span-12 md:p-10"><h4 className="text-3xl font-semibold">Planning lesson</h4><p className="mt-5 max-w-5xl text-lg leading-8 text-white/68">The reflection identifies a tension between detailed planning and practical progress. Extensive planning made it harder to move away from the initial idea, while the final build required substantial changes once the route and mechanisms were tested in Unity.</p></article>
          </div>
        </div>
      </section>
    </CaseStudyShell>
  );
}
