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
  const tagline = projectSummary("independent-level-project", "I created this first person runner level in Unity to teach the player how to jump through a white box obstacle course.");

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
          <Heading dark intro="The assignment asked me to create a tutorial level that teaches one mechanic: jumping. My final submission includes a working Unity course and documents the decisions that changed the route during production.">Overview</Heading>
          <div className="mt-16 grid grid-flow-dense gap-4 md:grid-cols-12">
            <article className="rounded-[28px] bg-white p-8 shadow-[0_20px_55px_rgba(10,49,53,0.08)] md:col-span-7 md:p-11"><h4 className="text-3xl font-semibold tracking-[-0.035em]">Project goal</h4><p className="mt-6 max-w-2xl text-lg leading-8 text-[#102327]/72">The brief defined a first person runner tutorial made from primitive geometry. I needed to teach running and jumping through the route, beginning with a safe first jump before gradually asking the player to deal with harder timings and smaller landing areas.</p></article>
            <article className="rounded-[28px] bg-[#58c4c6] p-8 text-[#071619] md:col-span-5 md:p-10"><h4 className="text-3xl font-semibold tracking-[-0.035em]">Responsibility</h4><p className="mt-6 text-lg leading-8 text-[#071619]/76">I developed the concept, drew the route iterations, created the key moment artwork, built the Unity level, added its mechanisms, and revised the layout within the available classroom sessions.</p></article>
            <article className="rounded-[28px] bg-[#102f34] p-8 text-white md:col-span-5"><h4 className="text-2xl font-semibold">Technical setup</h4><p className="mt-4 leading-8 text-white/66">I used Unity 6 with URP and ProBuilder to create the playable blockout, then used the Starter Assets First Person Character as the controller and scale reference.</p></article>
            <article className="rounded-[28px] bg-[#173f45] p-8 text-white md:col-span-7"><h4 className="text-2xl font-semibold">Delivered outcome</h4><p className="mt-4 leading-8 text-white/66">I completed a route with jump platforms, pistons, pipe traversal, a floating platform, and a final platform sequence. The documentation also records the visual and pacing goals that I was not able to resolve within the available sessions.</p></article>
          </div>
        </div>
      </section>

      <section id="research" data-case-study-chapter className="scroll-mt-16 bg-[#071619] py-32 md:py-44">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Heading intro="I combined the assignment constraints with game references and three map iterations. These early sketches show how the route expanded and changed before I began building it in Unity.">Research</Heading>
          <div className="mt-16 grid grid-flow-dense gap-4 md:grid-cols-12">
            <article className="rounded-[28px] bg-[#12353a] p-8 md:col-span-7 md:p-10"><h4 className="text-3xl font-semibold">Game references</h4><p className="mt-5 text-lg leading-8 text-white/68">I looked at Mirror's Edge, Ghostrunner, and Cyberpunk 2077 when deciding on the original direction. Their strong contrast, lighting, fast pace, and continuous challenges became the main qualities I wanted to explore in my own route.</p></article>
            <article className="rounded-[28px] bg-[#58c4c6] p-8 text-[#071619] md:col-span-5 md:p-10"><h4 className="text-3xl font-semibold">Initial concept</h4><p className="mt-5 text-lg leading-8 text-[#071619]/76">My initial idea followed an escaped cyborg crossing the rooftops of a data city. I wanted the movement to feel fast while the scale of the city created a sense of wonder.</p></article>
            <article className="rounded-[28px] bg-[#0e292e] p-8 md:col-span-12 md:p-10"><h4 className="text-3xl font-semibold">Route iteration</h4><p className="mt-5 max-w-5xl text-lg leading-8 text-white/68">My first sketch established the route and the main hazards. In the second version, I added hidden rooms and safe areas, then used the third version to include more hidden spaces and stars that were intended to increase the player's score.</p></article>
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
          <Heading dark intro="I turned the jump tutorial into one continuous route. The first static gaps introduce the movement safely, then the mechanisms and narrower surfaces change the timing and reduce the amount of landing space available.">Project Details</Heading>
          <div className="mt-16 grid grid-flow-dense gap-4 md:grid-cols-12">
            <article className="rounded-[28px] bg-[#e9f4f1] p-8 md:col-span-7 md:p-10"><h4 className="text-3xl font-semibold">Critical path</h4><p className="mt-5 text-lg leading-8 text-[#071619]/72">I kept the player on one main route through enclosed passages, gaps, hazard rooms, a curved section, and the final platforms. I used the first person controller as the scale reference so the geometry remained readable from the player's point of view.</p></article>
            <article className="rounded-[28px] bg-[#102f34] p-8 text-white md:col-span-5 md:p-10"><h4 className="text-3xl font-semibold">Pistons</h4><p className="mt-5 text-lg leading-8 text-white/68">I made the piston mechanisms push the player away on contact, turning them into timing hazards rather than static obstacles. In a later revision, I added more pistons to the middle section and used them to replace the earlier long hallway.</p></article>
            <article className="rounded-[28px] bg-[#17454b] p-8 text-white md:col-span-5 md:p-10"><h4 className="text-3xl font-semibold">Moving platform</h4><p className="mt-5 text-lg leading-8 text-white/68">I added a floating platform that carries the player into the next area. This introduced a moving surface into a route that was otherwise built from fixed ProBuilder geometry.</p></article>
            <article className="rounded-[28px] bg-[#d8eeea] p-8 md:col-span-7 md:p-10"><h4 className="text-3xl font-semibold">Final revision</h4><p className="mt-5 text-lg leading-8 text-[#071619]/72">In the revised middle section, the player has to cross pipes while avoiding piston hazards. I also removed the broad floor at the ending and replaced it with separate platforms, which makes the final movements more deliberate.</p></article>
          </div>
        </div>
      </section>

      <section id="process" data-case-study-chapter className="scroll-mt-16 bg-[#e9f4f1] py-32 text-[#102327] md:py-44">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Heading dark intro="I began with paper planning, then moved into ProBuilder construction, a basic visual pass, and the mechanism work. Testing the level led to a substantial revision of the route before the final submission.">Process</Heading>
          <div className="mt-16 grid gap-4 md:grid-cols-2">
            {[
              ["Preproduction", "I used the tutorial requirement from the brief as the starting constraint. Before building anything in Unity, I explored the route through three paper layouts and a key moment drawing."],
              ["Initial blockout", "I built the level with ProBuilder and kept the floors and walls as separate objects. This allowed me to show or hide different parts of the course while editing without disturbing the rest of the layout."],
              ["Visual pass", "I applied a cyan material and the Free Stylized Skybox by Yuki2022 to give the white box a consistent colour and a clearer horizon. This remained a simple visual pass rather than a finished art direction."],
              ["Mechanism pass", "I introduced the pistons as contact hazards, then added the floating platform to carry the player into the next area. These mechanisms helped the level move beyond a sequence of static jumps."],
              ["Route expansion", "I continued extending the level toward the planned ending. I considered an air current and a large moving piston, but there was not enough time to implement and test them properly."],
              ["Final revision", "I replaced the middle hallway with the piston and pipe section, then removed the broad floor at the ending and rebuilt it as separate platforms. These changes produced the final layout recorded in the last screenshot."],
            ].map(([title, body], index) => <article key={title} className={`rounded-[28px] p-8 md:p-10 ${index === 0 || index === 5 ? "bg-[#102f34] text-white md:col-span-2" : "bg-white shadow-[0_20px_55px_rgba(10,49,53,0.07)]"}`}><h4 className={`text-3xl font-semibold ${index === 0 || index === 5 ? "text-[#58c4c6]" : ""}`}>{title}</h4><p className={`mt-5 text-lg leading-8 ${index === 0 || index === 5 ? "text-white/68" : "text-[#102327]/70"}`}>{body}</p></article>)}
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <img src={projectImage("material-skybox-pass.png")} alt="Cyan material and stylised skybox applied to the growing ProBuilder route" className="aspect-[16/10] w-full rounded-[28px] object-cover" />
            <img src={projectImage("expanded-layout.png")} alt="Orthographic Unity view of the expanded level and piston room" className="aspect-[16/10] w-full rounded-[28px] object-cover" />
          </div>
          <article id="independent-level-project-workflow" className="mt-4 rounded-[28px] bg-[#12353a] p-8 text-white md:p-10"><h4 className="text-3xl font-semibold">Build workflow</h4><p className="mt-5 max-w-4xl text-lg leading-8 text-white/68">I kept the floor and wall geometry separate so I could enable or disable sections independently while working. I also used orthographic views to check the full route and make sure the course still connected properly as it expanded.</p></article>
        </div>
      </section>

      <section id="extras" data-case-study-chapter className="scroll-mt-16 bg-[#0b2428] py-32 md:py-44">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Heading intro="This record separates the Unity work I completed from the features that remained planned, and it identifies the external asset I used for the sky.">Extras</Heading>
          <div className="mt-16 grid grid-flow-dense gap-4 md:grid-cols-12">
            <article id="independent-level-project-source" className="rounded-[28px] bg-[#58c4c6] p-8 text-[#071619] md:col-span-5 md:p-10"><h4 className="text-3xl font-semibold">Asset source</h4><p className="mt-5 text-lg leading-8 text-[#071619]/76">I used Free Stylized Skybox by Yuki2022 from the Unity Asset Store during the visual pass. I built the documented level geometry myself with ProBuilder.</p></article>
            <article id="independent-level-project-scope" className="rounded-[28px] bg-[#e9f4f1] p-8 text-[#102327] md:col-span-7 md:p-10"><h4 className="text-3xl font-semibold">Scope control</h4><p className="mt-5 text-lg leading-8 text-[#102327]/72">I planned a large moving piston and an air current that would push against the player near the ending. Neither feature reached the final build because I used the remaining time to complete and revise the route that was already playable.</p></article>
            <figure className="overflow-hidden rounded-[28px] bg-[#071619] md:col-span-5"><img src={projectImage("planned-ending.png")} alt="Unity layout view recorded while planning the end of the level" className="aspect-[4/3] h-full w-full object-cover" /></figure>
          </div>
        </div>
      </section>

      <section id="reflection" data-case-study-chapter className="scroll-mt-16 bg-[#e9f4f1] py-32 text-[#102327] md:py-44">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Heading dark intro="In this debrief, I compare the finished level with my original concept and explain the production limits without presenting unfinished ideas as completed work.">Reflection</Heading>
          <div className="mt-16 grid grid-flow-dense gap-4 md:grid-cols-12">
            <article className="rounded-[28px] bg-white p-8 shadow-[0_20px_55px_rgba(10,49,53,0.08)] md:col-span-7 md:p-10"><h4 className="text-3xl font-semibold">Result against the concept</h4><p className="mt-5 text-lg leading-8 text-[#102327]/72">The finished level works, but its visual style moved away from the moodboard and the movement is slower than the original references. The route also changed substantially from my first plan once I began testing the spaces and mechanisms in Unity.</p></article>
            <article className="rounded-[28px] bg-[#58c4c6] p-8 text-[#071619] md:col-span-5 md:p-10"><h4 className="text-3xl font-semibold">Production limit</h4><p className="mt-5 text-lg leading-8 text-[#071619]/76">I began this project soon after another platformer, which affected my energy for developing a similar idea again. The scripting also took longer than I expected, and I used AI assistance for parts of that work, which I have recorded as a limitation rather than presenting it as entirely independent code.</p></article>
            <article className="rounded-[28px] bg-[#102f34] p-8 text-white md:col-span-12 md:p-10"><h4 className="text-3xl font-semibold">Planning lesson</h4><p className="mt-5 max-w-5xl text-lg leading-8 text-white/68">This project showed me that detailed planning can help define a direction, but it can also make it harder to move away from the first idea. The final build only improved when I accepted that the route and mechanisms needed substantial changes after being tested in Unity.</p></article>
          </div>
        </div>
      </section>
    </CaseStudyShell>
  );
}
