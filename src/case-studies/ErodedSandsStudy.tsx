import { useRef, useState } from "react";
import { ExternalLink } from "lucide-react";
import CaseStudyShell from "./CaseStudyShell";
import { caseStudyDefinitions } from "./definitions";
import { CaseStudyShowcaseImage, CaseStudyShowcaseRail } from "./CaseStudyMedia";
import ChangelogAccordion from "./ChangelogAccordion";
import { usePrefersReducedMotion } from "../motion";

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
    body: "The red, brown, pink, and gold range in Navajo sandstone comes from different amounts and forms of iron oxide. The scene uses a similarly narrow warm range so the imported rocks and sand read as one location.",
    href: "https://www.nps.gov/zion/learn/nature/navajo-colors.htm",
    source: "US National Park Service",
  },
  {
    title: "Layered geology",
    body: "Sedimentary rock is formed from compacted material and often presents visible bedding. Repeating horizontal strata across the large rock masses helps the separate scans read as related formations.",
    href: "https://www.nps.gov/subjects/geology/sedimentary.htm",
    source: "US National Park Service",
  },
  {
    title: "Environment assembly",
    body: "Epic's environment art training combines landscape tools, Megascans assets, foliage, materials, lighting, and shadows. This project applies the same assembly mindset at diorama scale.",
    href: "https://dev.epicgames.com/community/learning/tutorials/ReZm/unreal-engine-advanced-skill-sets-for-environment-art-introduction",
    source: "Epic Games",
  },
  {
    title: "Dust behaviour",
    body: "Epic's Niagara dust guide uses random lifetime, size, and rotation, then balances velocity, acceleration, drag, and an erosion curve. Those principles explain why variation and a controlled fade are useful for windblown dust.",
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
  const [openVersion, setOpenVersion] = useState<string | null>("1.0.0");

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
            <p className="mt-8 max-w-2xl text-lg leading-8 text-white/78 md:text-xl">A compact Unreal Engine diorama that turns a small set of Quixel Megascans assets into a cohesive abandoned mining site.</p>
          </div>
        </div>
      </section>

      <CaseStudyShowcaseRail background="#e9b07b" railRef={showcaseRef} onScroll={scrollShowcase}>
        {showcase.map((item) => (
          <div key={item.file} className="w-[86vw] shrink-0 snap-start md:w-[62vw] lg:w-[48rem]">
            <CaseStudyShowcaseImage src={image(item.file)} alt={item.alt} title={item.title} />
          </div>
        ))}
      </CaseStudyShowcaseRail>

      <section id="overview" data-case-study-chapter className="scroll-mt-16 bg-[#f3d1aa] px-5 py-32 text-[#2c170e] md:px-8 md:py-44">
        <div className="mx-auto max-w-7xl">
          <SectionHeading dark intro="The project was a short, self directed exercise in environment assembly, composition, and atmosphere rather than a full playable level.">Overview</SectionHeading>
          <div className="mt-16 grid auto-rows-fr grid-flow-dense grid-cols-1 gap-4 md:grid-cols-12">
            <article className="rounded-[28px] bg-[#7d2f19] p-7 text-white shadow-[0_24px_60px_rgba(74,30,15,0.2)] md:col-span-7 md:p-10"><h4 className="text-3xl font-semibold tracking-[-0.04em]">Intent</h4><p className="mt-5 max-w-2xl text-lg leading-8 text-white/76">Build a readable desert diorama in a few hours and make sourced assets feel like one destroyed mining area. The work focused on selection, scale, placement, lighting, and final framing.</p></article>
            <article className="rounded-[28px] bg-[#d58b51] p-7 shadow-[0_24px_60px_rgba(74,30,15,0.14)] md:col-span-5 md:p-10"><h4 className="text-3xl font-semibold tracking-[-0.04em]">Scope</h4><p className="mt-5 text-lg leading-8 text-[#2c170e]/72">One composed scene, one principal camera angle, nine progress and final captures, and a wind dust effect. There is no player route or interaction system.</p></article>
            <article className="rounded-[28px] bg-[#e9b879] p-7 shadow-[0_20px_48px_rgba(74,30,15,0.12)] md:col-span-4"><h4 className="text-2xl font-semibold">Role</h4><p className="mt-4 leading-7 text-[#2c170e]/70">Environment assembly, art direction, composition, lighting, prop placement, and VFX integration.</p></article>
            <article className="rounded-[28px] bg-[#bd6033] p-7 text-white shadow-[0_20px_48px_rgba(74,30,15,0.16)] md:col-span-4"><h4 className="text-2xl font-semibold">Tools</h4><p className="mt-4 leading-7 text-white/76">Unreal Engine and Quixel Megascans, supported by a tutorial while creating the wind dust effect.</p></article>
            <article className="rounded-[28px] bg-[#f7e1c7] p-7 shadow-[0_20px_48px_rgba(74,30,15,0.12)] md:col-span-4"><h4 className="text-2xl font-semibold">Outcome</h4><p className="mt-4 leading-7 text-[#2c170e]/70">A finished environment study with a clear mine focal point, layered depth, and a restrained desert palette.</p></article>
          </div>
        </div>
      </section>

      <section id="research" data-case-study-chapter className="scroll-mt-16 bg-[#21110b] px-5 py-32 md:px-8 md:py-44">
        <div className="mx-auto max-w-7xl">
          <SectionHeading intro="This retrospective research connects visible decisions in the finished scene to geology and Unreal Engine production principles. It does not claim that every source was consulted during the original few hour build.">Research</SectionHeading>
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
          <SectionHeading dark intro="The image is organised as a single environmental read. Foreground clues establish abandonment, the open sand creates a visual route, and the mine entrance provides the destination.">Scene Experience</SectionHeading>
          <div className="mt-16 grid gap-5 lg:grid-cols-12">
            <div className="overflow-hidden rounded-[28px] bg-[#a44c27] shadow-[0_28px_70px_rgba(72,29,12,0.22)] lg:col-span-7"><img src={image("final.png")} alt="Final Eroded Sands composition" className="aspect-[16/10] h-full w-full object-cover" /></div>
            <div className="grid gap-5 lg:col-span-5">
              <article className="rounded-[28px] bg-[#f3d1aa] p-7 shadow-[0_20px_54px_rgba(72,29,12,0.14)]"><h4 className="text-2xl font-semibold">Focal point</h4><p className="mt-4 leading-7 text-[#2c170e]/72">The dark mine opening has the strongest value contrast in the scene. The cart, timber frame, broken rails, and rock edge all collect around it, making the purpose of the location readable without text.</p></article>
              <article className="rounded-[28px] bg-[#7d2f19] p-7 text-white shadow-[0_20px_54px_rgba(72,29,12,0.2)]"><h4 className="text-2xl font-semibold">Depth and balance</h4><p className="mt-4 leading-7 text-white/74">Bones and a dead tree sit close to the camera. Large rock masses anchor both sides. The open centre exposes a distant ridge, separating foreground, middle ground, and background while keeping the frame asymmetrical.</p></article>
              <article className="rounded-[28px] bg-[#f0bd7b] p-7 shadow-[0_20px_54px_rgba(72,29,12,0.12)]"><h4 className="text-2xl font-semibold">Colour and light</h4><p className="mt-4 leading-7 text-[#2c170e]/72">Sand, timber, and sandstone stay within a warm orange range. The pale blue sky provides temperature contrast, while hard sunlight and deep shade reveal the rock layers and protect the mine entrance as the darkest shape.</p></article>
            </div>
          </div>
        </div>
      </section>

      <section id="process" data-case-study-chapter className="scroll-mt-16 bg-[#160d09] px-5 py-32 md:px-8 md:py-44">
        <div className="mx-auto max-w-7xl">
          <SectionHeading intro="The saved renders record a compact assembly pass. The broad composition stays stable while structural clues, ground detail, and atmosphere accumulate.">Process</SectionHeading>
          <div className="mt-16 grid gap-10">
            {[
              ["rock-layout.png", "Establish the frame", "Large sandstone scans form an enclosed basin. The opening between the left and right masses creates a central route and preserves a strip of distant landscape."],
              ["mine-opening.png", "Define the site", "A dark opening cut into the right formation establishes the mine. The first cart and timber pieces add human scale and explain how the space was used."],
              ["structure-pass.png", "Build the abandoned history", "Broken rails, scattered planks, supports, barrels, bones, and dead trees distribute evidence across the frame. Their irregular placement keeps the site from reading as an untouched asset arrangement."],
              ["dust-pass.png", "Add atmospheric movement", "The final pass introduces windblown dust through the centre of the basin. It softens the distant ridge, connects the open sand to the weather, and adds motion without changing the composition."],
            ].map(([file, title, body], index) => (
              <article key={file} className={`grid items-center gap-7 lg:grid-cols-12 ${index % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
                <div className="overflow-hidden rounded-[28px] shadow-[0_28px_74px_rgba(0,0,0,0.3)] lg:col-span-7"><img src={image(file)} alt={`${title} render`} className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.025]" /></div>
                <div className="rounded-[28px] bg-[#2d190f] p-7 shadow-[0_22px_58px_rgba(0,0,0,0.24)] lg:col-span-5 lg:p-9"><h4 className="text-3xl font-semibold tracking-[-0.04em]">{title}</h4><p className="mt-5 text-lg leading-8 text-white/64">{body}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="extras" data-case-study-chapter className="scroll-mt-16 bg-[#efd0ab] px-5 py-32 text-[#2c170e] md:px-8 md:py-44">
        <div className="mx-auto max-w-7xl">
          <SectionHeading dark intro="These notes separate the authored environment decisions from sourced assets and tutorial assisted technical work.">Extras</SectionHeading>
          <div className="mt-16 grid gap-5 lg:grid-cols-2">
            <article id="eroded-sands-assets" className="rounded-[28px] bg-[#f8e5ce] p-8 shadow-[0_22px_60px_rgba(72,29,12,0.14)] md:p-10"><h4 className="text-3xl font-semibold tracking-[-0.04em]">Asset authorship</h4><p className="mt-5 text-lg leading-8 text-[#2c170e]/72">Quixel Megascans supplied the environment assets. My contribution was the selection, scale, rotation, layering, prop distribution, lighting, colour relationship, and camera composition that turned those assets into one mining site.</p></article>
            <article id="eroded-sands-vfx" className="rounded-[28px] bg-[#85351c] p-8 text-white shadow-[0_22px_60px_rgba(72,29,12,0.22)] md:p-10"><h4 className="text-3xl font-semibold tracking-[-0.04em]">Dust VFX</h4><p className="mt-5 text-lg leading-8 text-white/74">I created the wind dust effect with help from a tutorial. Its purpose is environmental rather than decorative: the lateral movement makes the exposed basin feel active and adds a layer of depth over the distant rocks.</p></article>
          </div>
        </div>
      </section>

      <ChangelogAccordion
        entries={[{ version: "1.0.0", date: "Single session", title: "Diorama complete", body: ["- Assembled the desert rock layout and mining site", "- Added props, rails, timber supports, lighting, and final framing", "- Created the wind dust effect with tutorial guidance"] }]}
        openVersion={openVersion}
        onToggle={setOpenVersion}
        idPrefix="eroded-sands"
        description="The project was completed as one short environment exercise, so the record contains a single finished state."
        variant="cinematic"
      />

      <section id="reflection" data-case-study-chapter className="scroll-mt-16 relative overflow-hidden bg-[#6d2916] px-5 py-32 md:px-8 md:py-44">
        <img src={image("final.png")} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-[#5c2112]/84" />
        <div className="relative mx-auto max-w-5xl">
          <SectionHeading intro="The limited scope kept the work focused on one readable image and made it possible to reach a finished state within a few hours.">Reflection</SectionHeading>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <p className="rounded-[26px] bg-black/24 p-7 text-lg leading-8 text-white/72 shadow-[0_20px_56px_rgba(0,0,0,0.24)]">The strongest result is the composition. The dark mine entrance, open sand route, foreground debris, and distant ridge give the scene a clear hierarchy. Repeated sandstone colour and strata help assets from different scans read as one place.</p>
            <p className="rounded-[26px] bg-black/24 p-7 text-lg leading-8 text-white/72 shadow-[0_20px_56px_rgba(0,0,0,0.24)]">The main limitation is coverage. Most captures preserve nearly the same camera angle, so the study documents iteration more clearly than spatial exploration. A future pass would add close views, a side view of the mine structure, and a short VFX clip showing the dust movement.</p>
          </div>
        </div>
      </section>
    </CaseStudyShell>
  );
}
