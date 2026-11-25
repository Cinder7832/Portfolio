import { useRef, useState } from "react";
import { ExternalLink } from "lucide-react";
import CaseStudyShell from "./CaseStudyShell";
import { caseStudyDefinitions } from "./definitions";
import { CaseStudyShowcaseImage, CaseStudyShowcaseRail } from "./CaseStudyMedia";
import ChangelogAccordion from "./ChangelogAccordion";
import { usePrefersReducedMotion } from "../motion";
import { projectSummary } from "./projectSummary";

const image = (file: string) => `${import.meta.env.BASE_URL}projects/eroded-sands/${file}`;

const showcase = [
  { file: "final.png", title: "Final mining site", alt: "Abandoned mine entrance set into a red sandstone canyon with a cart, broken rails, and dead trees" },
  { file: "dust-pass.png", title: "Dust pass", alt: "Windblown dust crossing the open ground between the rock walls and mine entrance" },
  { file: "composition-pass.png", title: "Composition pass", alt: "Wide desert composition with foreground bones, a central route, and the mine entrance on the right" },
  { file: "structure-pass.png", title: "Structure pass", alt: "Desert mine scene after timber supports and scattered rail pieces were added" },
  { file: "mine-opening.png", title: "Mine opening pass", alt: "Early scene with the mine opening framed by layered sandstone rocks" },
  { file: "rock-layout.png", title: "Rock layout", alt: "Early desert layout built from large red sandstone formations" },
];

const sources = [
  {
    title: "Sandstone colour",
    body: "Navajo sandstone gains its red, brown, pink, and gold colours from different amounts and forms of iron oxide. I used a similarly narrow warm range so the imported rocks and sand feel like they belong to the same location.",
    href: "https://www.nps.gov/zion/learn/nature/navajo-colors.htm",
    source: "US National Park Service",
  },
  {
    title: "Layered geology",
    body: "Sedimentary rock is formed from compacted material and often shows visible bedding. Repeating those horizontal layers across the large rock masses helped me make separate scans read as parts of the same formation.",
    href: "https://www.nps.gov/subjects/geology/sedimentary.htm",
    source: "US National Park Service",
  },
  {
    title: "Environment assembly",
    body: "Epic's environment art training combines landscape tools, Megascans assets, foliage, materials, lighting, and shadows. I applied the same assembly approach at a smaller diorama scale, focusing on how the separate systems support one final image.",
    href: "https://dev.epicgames.com/community/learning/tutorials/ReZm/unreal-engine-advanced-skill-sets-for-environment-art-introduction",
    source: "Epic Games",
  },
  {
    title: "Dust behaviour",
    body: "Epic's Niagara dust guide uses varied lifetime, size, and rotation, then balances velocity, acceleration, drag, and an erosion curve. These principles helped me understand why windblown dust needs variation and a controlled fade instead of every particle moving in the same way.",
    href: "https://dev.epicgames.com/documentation/en-us/unreal-engine/quick-start-for-niagara-effects-in-unreal-engine",
    source: "Epic Games",
  },
];

function SectionHeading({ children, intro, dark = false }: { children: string; intro: string; dark?: boolean }) {
  return (
    <div className="max-w-4xl">
      <h3 className="text-5xl font-semibold tracking-[-0.055em] md:text-8xl">{children}</h3>
      <p className={`mt-7 max-w-3xl text-lg leading-8 ${dark ? "text-[#3a2116]/72" : "text-white/66"}`}>{intro}</p>
    </div>
  );
}

export default function ErodedSandsProjectView({ onClose }: { onClose: () => void }) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const showcaseRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [openVersion, setOpenVersion] = useState<string | null>(null);
  const tagline = projectSummary("eroded-sands", "I created this compact Unreal Engine desert diorama around the remains of an abandoned mining site.");

  const scrollShowcase = (direction: -1 | 1) => {
    const rail = showcaseRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * Math.max(320, rail.clientWidth * 0.72), behavior: reducedMotion ? "auto" : "smooth" });
  };

  return (
    <CaseStudyShell definition={caseStudyDefinitions["eroded-sands"]} scrollRef={scrollRef} onClose={onClose} className="w-full bg-[#140c08] text-white [container-type:size]">
      <section className="relative min-h-[max(22rem,calc(100cqh-4rem))] overflow-hidden bg-[#2b150d]">
        <img src={image("final.png")} alt="" className="absolute inset-0 h-full w-full object-cover object-[56%_center]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,8,4,0.9)_0%,rgba(18,8,4,0.55)_38%,rgba(18,8,4,0.08)_72%),linear-gradient(0deg,rgba(18,8,4,0.82)_0%,transparent_48%)]" />
        <div className="relative mx-auto flex min-h-[max(22rem,calc(100cqh-4rem))] max-w-7xl items-end px-5 pb-12 pt-20 md:px-8 md:pb-16 md:pt-24">
          <div className="max-w-5xl">
            <h2 className="max-w-5xl text-[clamp(4rem,9vw,8.8rem)] font-semibold leading-[0.82] tracking-[-0.075em]">Eroded Sands</h2>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-white/78 md:text-xl">{tagline}</p>
          </div>
        </div>
      </section>

      <CaseStudyShowcaseRail background="#e9b07b" railRef={showcaseRef} onScroll={scrollShowcase}>
        {showcase.map((item) => (
          <div key={item.file} className="w-[86vw] shrink-0 snap-center md:w-[62vw] lg:w-[48rem]">
            <CaseStudyShowcaseImage src={image(item.file)} alt={item.alt} title={item.title} />
          </div>
        ))}
      </CaseStudyShowcaseRail>

      <section id="overview" data-case-study-chapter className="scroll-mt-16 bg-[#f3d1aa] px-5 py-32 text-[#2c170e] md:px-8 md:py-44">
        <div className="mx-auto max-w-7xl">
          <SectionHeading dark intro="I treated this as a short, self directed exercise in environment assembly, composition, and atmosphere rather than trying to turn it into a full playable level.">Overview</SectionHeading>
          <div className="mt-16 grid auto-rows-fr grid-flow-dense grid-cols-1 gap-4 md:grid-cols-12">
            <article className="rounded-[28px] bg-[#7d2f19] p-7 text-white shadow-[0_24px_60px_rgba(74,30,15,0.2)] md:col-span-7 md:p-10"><h4 className="text-3xl font-semibold tracking-[-0.04em]">Intent</h4><p className="mt-5 max-w-2xl text-lg leading-8 text-white/76">My goal was to build a readable desert diorama in a few hours and make the sourced assets feel like parts of one destroyed mining area. I focused on asset selection, scale, placement, lighting, and the final camera framing.</p></article>
            <article className="rounded-[28px] bg-[#d58b51] p-7 shadow-[0_24px_60px_rgba(74,30,15,0.14)] md:col-span-5 md:p-10"><h4 className="text-3xl font-semibold tracking-[-0.04em]">Scope</h4><p className="mt-5 text-lg leading-8 text-[#2c170e]/72">I kept the project to one composed scene and one main camera angle, supported by nine progress and final captures and a wind dust effect. I did not add a player route or interaction system because the goal was to complete the environmental image.</p></article>
            <article className="rounded-[28px] bg-[#e9b879] p-7 shadow-[0_20px_48px_rgba(74,30,15,0.12)] md:col-span-4"><h4 className="text-2xl font-semibold">Role</h4><p className="mt-4 leading-7 text-[#2c170e]/70">My work covered the environment assembly, art direction, composition, lighting, prop placement, and integration of the dust effect.</p></article>
            <article className="rounded-[28px] bg-[#bd6033] p-7 text-white shadow-[0_20px_48px_rgba(74,30,15,0.16)] md:col-span-4"><h4 className="text-2xl font-semibold">Tools</h4><p className="mt-4 leading-7 text-white/76">I used Unreal Engine and Quixel Megascans for the environment, with tutorial guidance while I created the wind dust effect.</p></article>
            <article className="rounded-[28px] bg-[#f7e1c7] p-7 shadow-[0_20px_48px_rgba(74,30,15,0.12)] md:col-span-4"><h4 className="text-2xl font-semibold">Outcome</h4><p className="mt-4 leading-7 text-[#2c170e]/70">I completed the environment study with a clear mine entrance as the focal point, layered depth across the frame, and a restrained desert colour palette.</p></article>
          </div>
        </div>
      </section>

      <section id="research" data-case-study-chapter className="scroll-mt-16 bg-[#21110b] px-5 py-32 md:px-8 md:py-44">
        <div className="mx-auto max-w-7xl">
          <SectionHeading intro="I completed this research retrospectively to connect the visible decisions in the final scene with geology and Unreal Engine production principles. I have kept that distinction clear because I did not consult every source during the original few hour build.">Research</SectionHeading>
          <div className="mt-16 grid gap-4 md:grid-cols-2">
            {sources.map((source) => (
              <article key={source.title} className="rounded-[26px] bg-[#321b11] p-7 shadow-[0_20px_54px_rgba(0,0,0,0.25)] md:p-9">
                <h4 className="text-2xl font-semibold">{source.title}</h4>
                <p className="mt-5 leading-7 text-white/64">{source.body}</p>
                <a href={source.href} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#d76e3c] px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/35">{source.source}<ExternalLink size={16} /></a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="experience" data-case-study-chapter className="scroll-mt-16 bg-[#d99459] px-5 py-32 text-[#2c170e] md:px-8 md:py-44">
        <div className="mx-auto max-w-7xl">
          <SectionHeading dark intro="I organised the image so it can be understood as one environmental story. The foreground details establish the abandonment, the open sand creates a visual route, and the mine entrance gives that route a clear destination.">Project Details</SectionHeading>
          <div className="mt-16 grid gap-5 lg:grid-cols-12">
            <div className="overflow-hidden rounded-[28px] bg-[#a44c27] shadow-[0_28px_70px_rgba(72,29,12,0.22)] lg:col-span-7"><img src={image("final.png")} alt="Final Eroded Sands composition" className="aspect-[16/10] h-full w-full object-cover" /></div>
            <div className="grid gap-5 lg:col-span-5">
              <article className="rounded-[28px] bg-[#f3d1aa] p-7 shadow-[0_20px_54px_rgba(72,29,12,0.14)]"><h4 className="text-2xl font-semibold">Focal point</h4><p className="mt-4 leading-7 text-[#2c170e]/72">I kept the mine opening as the darkest shape so it has the strongest value contrast in the scene. The cart, timber frame, broken rails, and rock edge all gather around it, which explains the purpose of the location without needing text.</p></article>
              <article className="rounded-[28px] bg-[#7d2f19] p-7 text-white shadow-[0_20px_54px_rgba(72,29,12,0.2)]"><h4 className="text-2xl font-semibold">Depth and balance</h4><p className="mt-4 leading-7 text-white/74">I placed the bones and dead tree close to the camera and used large rock masses to anchor both sides of the frame. Leaving the centre open reveals the distant ridge, separates the foreground, middle ground, and background, and keeps the composition asymmetrical.</p></article>
              <article className="rounded-[28px] bg-[#f0bd7b] p-7 shadow-[0_20px_54px_rgba(72,29,12,0.12)]"><h4 className="text-2xl font-semibold">Colour and light</h4><p className="mt-4 leading-7 text-[#2c170e]/72">I kept the sand, timber, and sandstone within a warm orange range, then used the pale blue sky as a cooler contrast. The hard sunlight and deep shade reveal the rock layers while keeping the mine entrance as the darkest shape.</p></article>
            </div>
          </div>
        </div>
      </section>

      <section id="process" data-case-study-chapter className="scroll-mt-16 bg-[#160d09] px-5 py-32 md:px-8 md:py-44">
        <div className="mx-auto max-w-7xl">
          <SectionHeading intro="The saved renders show how I assembled the scene in one compact pass. I kept the broad composition stable while adding structural clues, ground detail, and atmosphere around it.">Process</SectionHeading>
          <div className="mt-16 grid gap-10">
            {[
              ["rock-layout.png", "Establish the frame", "I used large sandstone scans to form an enclosed basin. The opening between the left and right rock masses creates a central visual route while preserving a strip of the distant landscape."],
              ["mine-opening.png", "Define the site", "I cut a dark opening into the right formation to establish the mine, then added the first cart and timber pieces. These details introduce human scale and begin to explain how the space was used."],
              ["structure-pass.png", "Build the abandoned history", "I distributed broken rails, planks, supports, barrels, bones, and dead trees across the frame. Their irregular placement makes the area feel abandoned and stops it from looking like an untouched collection of assets."],
              ["dust-pass.png", "Add atmospheric movement", "In the final pass, I introduced windblown dust through the centre of the basin. It softens the distant ridge, connects the open sand with the weather, and adds movement without changing the main composition."],
            ].map(([file, title, body], index) => (
              <article key={file} className={`grid items-center gap-7 lg:grid-cols-12 ${index % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
                <div className="overflow-hidden rounded-[28px] shadow-[0_28px_74px_rgba(0,0,0,0.3)] lg:col-span-7"><img src={image(file)} alt={`${title} render`} className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.025]" /></div>
                <div className="rounded-[28px] bg-[#2d190f] p-7 shadow-[0_22px_58px_rgba(0,0,0,0.24)] lg:col-span-5 lg:p-9"><h4 className="text-3xl font-semibold tracking-[-0.04em]">{title}</h4><p className="mt-5 text-lg leading-8 text-white/64">{body}</p></div>
              </article>
            ))}
          </div>
          <article id="eroded-sands-vfx" className="mt-10 rounded-[28px] bg-[#85351c] p-8 text-white shadow-[0_22px_60px_rgba(72,29,12,0.22)] md:p-10"><h4 className="text-3xl font-semibold tracking-[-0.04em]">Dust VFX</h4><p className="mt-5 max-w-4xl text-lg leading-8 text-white/74">I created the wind dust effect with help from a tutorial. Its purpose is environmental rather than decorative: the lateral movement makes the exposed basin feel active and adds a layer of depth over the distant rocks.</p></article>
        </div>
      </section>

      <section id="extras" data-case-study-chapter className="scroll-mt-16 bg-[#efd0ab] px-5 py-32 text-[#2c170e] md:px-8 md:py-44">
        <div className="mx-auto max-w-7xl">
          <SectionHeading dark intro="These notes explain which parts of the final image came from sourced assets and which decisions were part of my own composition work.">Extras</SectionHeading>
          <div className="mt-16">
            <article id="eroded-sands-assets" className="rounded-[28px] bg-[#f8e5ce] p-8 shadow-[0_22px_60px_rgba(72,29,12,0.14)] md:p-10"><h4 className="text-3xl font-semibold tracking-[-0.04em]">Asset authorship</h4><p className="mt-5 max-w-4xl text-lg leading-8 text-[#2c170e]/72">Quixel Megascans supplied the environment assets. My contribution was the selection, scale, rotation, layering, prop distribution, lighting, colour relationship, and camera composition that turned those assets into one mining site.</p></article>
          </div>
        </div>
      </section>

      <ChangelogAccordion
        entries={[{ version: "1.0.0", date: "Single session", title: "Diorama complete", body: ["- Assembled the desert rock layout and mining site", "- Added props, rails, timber supports, lighting, and final framing", "- Created the wind dust effect with tutorial guidance"] }]}
        openVersion={openVersion}
        onToggle={setOpenVersion}
        idPrefix="eroded-sands"
        gameTitle="Eroded Sands"
        description="The project was completed as one short environment exercise, so the record contains a single finished state."
        variant="cinematic"
      />

      <section id="reflection" data-case-study-chapter className="scroll-mt-16 relative overflow-hidden bg-[#6d2916] px-5 py-32 md:px-8 md:py-44">
        <img src={image("final.png")} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-[#5c2112]/84" />
        <div className="relative mx-auto max-w-5xl">
          <SectionHeading intro="Keeping the scope limited to one readable image helped me reach a finished result within a few hours instead of leaving a larger environment incomplete.">Reflection</SectionHeading>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <p className="rounded-[26px] bg-black/24 p-7 text-lg leading-8 text-white/72 shadow-[0_20px_56px_rgba(0,0,0,0.24)]">I think the strongest result is the composition. The dark mine entrance, open sand route, foreground debris, and distant ridge create a clear hierarchy, while the repeated sandstone colours and layers help assets from different scans read as one place.</p>
            <p className="rounded-[26px] bg-black/24 p-7 text-lg leading-8 text-white/72 shadow-[0_20px_56px_rgba(0,0,0,0.24)]">The main limitation is that most of my captures use almost the same camera angle, so they explain the iteration more clearly than the wider space. In a future pass, I would add close views, a side view of the mine structure, and a short VFX clip that shows the dust moving through the basin.</p>
          </div>
        </div>
      </section>
    </CaseStudyShell>
  );
}
