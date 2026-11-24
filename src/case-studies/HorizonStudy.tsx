import { useRef, useState } from "react";
import { ExternalLink } from "lucide-react";
import CaseStudyShell from "./CaseStudyShell";
import { caseStudyDefinitions } from "./definitions";
import { CaseStudyShowcaseImage, CaseStudyShowcaseRail } from "./CaseStudyMedia";
import ChangelogAccordion from "./ChangelogAccordion";
import { usePrefersReducedMotion } from "../motion";

const image = (file: string) => `${import.meta.env.BASE_URL}projects/horizon/${file}`;

const showcase = [
  { file: "final-meadow.png", title: "Final meadow", alt: "Sunset meadow with dense shrubs, trees, rocks, distant mountains, and a ruined stone arch" },
  { file: "open-meadow-wide.png", title: "Open meadow wide view", alt: "Wide sunset meadow with flowers in the foreground and mountains around the horizon" },
  { file: "open-meadow-centre.png", title: "Open meadow centre view", alt: "Open rolling meadow leading toward a low sun between distant mountain ridges" },
  { file: "open-meadow-light.png", title: "Open meadow light pass", alt: "Golden sunset light spreading across grass and low hills in an open valley" },
  { file: "open-meadow-flowers.png", title: "Open meadow flower pass", alt: "White meadow flowers and long grass framing a broad sunset valley" },
];

const research = [
  {
    title: "Foliage distribution",
    body: "Unreal Engine's Foliage Mode supports painting varied instance sets across a landscape and controlling density, scale, and spacing. Those controls support the irregular mix of grasses, shrubs, and trees visible in the final frame.",
    href: "https://dev.epicgames.com/documentation/unreal-engine/foliage-mode-in-unreal-engine",
    source: "Epic Games",
  },
  {
    title: "Atmospheric depth",
    body: "Exponential Height Fog can increase density in low areas while keeping higher terrain clearer. The final view uses a similar visual principle: foreground plants remain dark and detailed while distant ridges become lighter and less distinct.",
    href: "https://dev.epicgames.com/documentation/unreal-engine/exponential-height-fog-in-unreal-engine",
    source: "Epic Games",
  },
  {
    title: "Sunset colour",
    body: "At sunset, sunlight travels through more atmosphere and shorter blue wavelengths scatter away, leaving more red and orange light. The scene exaggerates that warm range across the clouds, grass, terrain, and haze.",
    href: "https://weather.metoffice.gov.uk/learn-about/weather/optical-effects/why-is-the-sky-blue",
    source: "Met Office",
  },
  {
    title: "Meadow structure",
    body: "Mountain meadow plant communities commonly combine grasses, flowering plants, and shrubs. The final pass uses several vegetation scales so the field does not read as one repeated grass layer.",
    href: "https://home.nps.gov/subjects/yellowstonescience/upload/2022_Yellowstone-Science_Grazing.pdf",
    source: "US National Park Service",
  },
];

function SectionHeading({ children, intro, dark = false }: { children: string; intro: string; dark?: boolean }) {
  return (
    <div className="max-w-4xl">
      <h3 className="text-5xl font-semibold tracking-[-0.055em] md:text-8xl">{children}</h3>
      <p className={`mt-7 max-w-3xl text-lg leading-8 ${dark ? "text-[#253022]/72" : "text-white/66"}`}>{intro}</p>
    </div>
  );
}

export default function HorizonProjectView({ onClose }: { onClose: () => void }) {
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
    <CaseStudyShell definition={caseStudyDefinitions.horizon} scrollRef={scrollRef} onClose={onClose} className="w-full bg-[#10150f] text-white [container-type:size]">
      <section className="relative min-h-[max(22rem,calc(100cqh-4rem))] overflow-hidden bg-[#303825]">
        <img src={image("final-meadow.png")} alt="" className="absolute inset-0 h-full w-full object-cover object-[52%_center]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,19,12,0.78)_0%,rgba(13,19,12,0.25)_46%,rgba(13,19,12,0.06)_72%),linear-gradient(0deg,rgba(13,19,12,0.82)_0%,transparent_55%)]" />
        <div className="relative mx-auto flex min-h-[max(22rem,calc(100cqh-4rem))] max-w-7xl items-end px-5 pb-12 pt-20 md:px-8 md:pb-16 md:pt-24">
          <div className="max-w-5xl">
            <h2 className="max-w-5xl text-[clamp(4.2rem,10vw,9.5rem)] font-semibold leading-[0.82] tracking-[-0.075em]">Horizon</h2>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-white/80 md:text-xl">A meadow environment study built around a low sun, layered mountain silhouettes, and a ruined stone arch within dense vegetation.</p>
          </div>
        </div>
      </section>

      <CaseStudyShowcaseRail background="#d5b483" railRef={showcaseRef} onScroll={scrollShowcase}>
        {showcase.map((item) => (
          <div key={item.file} className="w-[86vw] shrink-0 snap-start md:w-[62vw] lg:w-[48rem]">
            <CaseStudyShowcaseImage src={image(item.file)} alt={item.alt} title={item.title} />
          </div>
        ))}
      </CaseStudyShowcaseRail>

      <section id="overview" data-case-study-chapter className="scroll-mt-16 bg-[#e7d7b9] px-5 py-32 text-[#253022] md:px-8 md:py-44">
        <div className="mx-auto max-w-7xl">
          <SectionHeading dark intro="Horizon is a focused landscape exercise. The work centres on one viewpoint, one sunset lighting condition, and the transition from an open field to a denser meadow scene.">Overview</SectionHeading>
          <div className="mt-16 grid auto-rows-fr grid-flow-dense grid-cols-1 gap-4 md:grid-cols-12">
            <article className="rounded-[28px] bg-[#4f6244] p-7 text-white shadow-[0_24px_60px_rgba(36,49,31,0.2)] md:col-span-7 md:p-10"><h4 className="text-3xl font-semibold tracking-[-0.04em]">Intent</h4><p className="mt-5 max-w-2xl text-lg leading-8 text-white/76">Create a calm, readable meadow landscape with enough variation to support a wide view. The final scene uses vegetation, rocks, architecture, lighting, and haze to establish scale without adding gameplay systems.</p></article>
            <article className="rounded-[28px] bg-[#c79663] p-7 shadow-[0_24px_60px_rgba(55,42,28,0.14)] md:col-span-5 md:p-10"><h4 className="text-3xl font-semibold tracking-[-0.04em]">Scope</h4><p className="mt-5 text-lg leading-8 text-[#253022]/72">One landscape, one principal sunset direction, five unique captures, and a final composition centred on the relationship between the meadow and a ruined arch.</p></article>
            <article className="rounded-[28px] bg-[#bbc49e] p-7 shadow-[0_20px_48px_rgba(36,49,31,0.12)] md:col-span-4"><h4 className="text-2xl font-semibold">Role</h4><p className="mt-4 leading-7 text-[#253022]/70">Landscape composition, foliage distribution, lighting, atmosphere, landmark placement, and final camera framing.</p></article>
            <article className="rounded-[28px] bg-[#7f8b60] p-7 text-white shadow-[0_20px_48px_rgba(36,49,31,0.16)] md:col-span-4"><h4 className="text-2xl font-semibold">Tools</h4><p className="mt-4 leading-7 text-white/76">Unreal Engine landscape, foliage, lighting, sky, and atmospheric systems.</p></article>
            <article className="rounded-[28px] bg-[#f2e8d4] p-7 shadow-[0_20px_48px_rgba(36,49,31,0.12)] md:col-span-4"><h4 className="text-2xl font-semibold">Outcome</h4><p className="mt-4 leading-7 text-[#253022]/70">A completed environment image with distinct foreground, middle ground, and background layers.</p></article>
          </div>
        </div>
      </section>

      <section id="research" data-case-study-chapter className="scroll-mt-16 bg-[#182017] px-5 py-32 md:px-8 md:py-44">
        <div className="mx-auto max-w-7xl">
          <SectionHeading intro="This retrospective research explains the visual principles present in the final image. It does not imply that every source was used during the original build.">Research</SectionHeading>
          <div className="mt-16 grid gap-4 md:grid-cols-2">
            {research.map((item) => (
              <article key={item.title} className="rounded-[26px] bg-[#263223] p-7 shadow-[0_20px_54px_rgba(0,0,0,0.25)] md:p-9">
                <h4 className="text-2xl font-semibold">{item.title}</h4>
                <p className="mt-5 leading-7 text-white/64">{item.body}</p>
                <a href={item.href} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#b87547] px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/35">{item.source}<ExternalLink size={16} /></a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="experience" data-case-study-chapter className="scroll-mt-16 bg-[#b9b890] px-5 py-32 text-[#253022] md:px-8 md:py-44">
        <div className="mx-auto max-w-7xl">
          <SectionHeading dark intro="The final image reads from dark foreground foliage, through the sunlit field and stone arch, to softened mountain ridges and a pale sky.">Scene Experience</SectionHeading>
          <div className="mt-16 grid gap-5 lg:grid-cols-12">
            <div className="overflow-hidden rounded-[28px] bg-[#59664a] shadow-[0_28px_70px_rgba(36,49,31,0.22)] lg:col-span-7"><img src={image("final-meadow.png")} alt="Final Horizon meadow composition" className="aspect-[16/10] h-full w-full object-cover" /></div>
            <div className="grid gap-5 lg:col-span-5">
              <article className="rounded-[28px] bg-[#ece2ca] p-7 shadow-[0_20px_54px_rgba(36,49,31,0.14)]"><h4 className="text-2xl font-semibold">Landmark</h4><p className="mt-4 leading-7 text-[#253022]/72">The ruined arch sits close to the centre and breaks the horizontal meadow line. Its simple silhouette gives the eye a destination while remaining subordinate to the wider landscape.</p></article>
              <article className="rounded-[28px] bg-[#44553c] p-7 text-white shadow-[0_20px_54px_rgba(36,49,31,0.2)]"><h4 className="text-2xl font-semibold">Layered depth</h4><p className="mt-4 leading-7 text-white/74">Large plants and rocks overlap the lower frame. Smaller shrubs and the ruin occupy the middle distance. Each mountain band becomes lighter and less detailed as it approaches the horizon.</p></article>
              <article className="rounded-[28px] bg-[#d2a36f] p-7 shadow-[0_20px_54px_rgba(55,42,28,0.12)]"><h4 className="text-2xl font-semibold">Colour and light</h4><p className="mt-4 leading-7 text-[#253022]/72">Warm gold light joins the grass, clouds, terrain, and haze. Dark olive vegetation provides the main contrast, while pale lavender in the sky and distant ridges prevents the image from becoming uniformly orange.</p></article>
            </div>
          </div>
        </div>
      </section>

      <section id="process" data-case-study-chapter className="scroll-mt-16 bg-[#111710] px-5 py-32 md:px-8 md:py-44">
        <div className="mx-auto max-w-7xl">
          <SectionHeading intro="The saved sequence records small framing and lighting changes across the open meadow, followed by a substantial final enrichment pass.">Process</SectionHeading>
          <div className="mt-16 grid gap-10">
            {[
              ["open-meadow-flowers.png", "Establish the valley", "Rolling terrain creates a shallow basin between mountain ridges. White flowers and long grass anchor the foreground while the low sun defines the horizon."],
              ["open-meadow-light.png", "Tune the sunset", "Successive captures adjust the balance between bright cloud light, the glowing field, and darker terrain. The sun remains low and central so the lighting direction also supports the composition."],
              ["open-meadow-wide.png", "Refine the frame", "The wider view gives the foreground ridge more weight and opens the central field. Curving bands of illuminated grass guide the eye toward the distant gap."],
              ["final-meadow.png", "Add density and history", "Shrubs, trees, rocks, mist, and a ruined arch replace the exposed early field. The added vertical forms create more overlap and scale while keeping the mountain horizon visible."],
            ].map(([file, title, body], index) => (
              <article key={file} className={`grid items-center gap-7 lg:grid-cols-12 ${index % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
                <div className="overflow-hidden rounded-[28px] shadow-[0_28px_74px_rgba(0,0,0,0.3)] lg:col-span-7"><img src={image(file)} alt={`${title} render`} className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.025]" /></div>
                <div className="rounded-[28px] bg-[#253023] p-7 shadow-[0_22px_58px_rgba(0,0,0,0.24)] lg:col-span-5 lg:p-9"><h4 className="text-3xl font-semibold tracking-[-0.04em]">{title}</h4><p className="mt-5 text-lg leading-8 text-white/64">{body}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="extras" data-case-study-chapter className="scroll-mt-16 bg-[#e1d3b8] px-5 py-32 text-[#253022] md:px-8 md:py-44">
        <div className="mx-auto max-w-7xl">
          <SectionHeading dark intro="The additional notes explain the final landmark decision and the limits of the available development record.">Extras</SectionHeading>
          <div className="mt-16 grid gap-5 lg:grid-cols-2">
            <article id="horizon-landmark" className="rounded-[28px] bg-[#f1e7d4] p-8 shadow-[0_22px_60px_rgba(36,49,31,0.14)] md:p-10"><h4 className="text-3xl font-semibold tracking-[-0.04em]">Ruined landmark</h4><p className="mt-5 text-lg leading-8 text-[#253022]/72">The arch introduces a clear sign of human history without dominating the valley. Its opening repeats the bright gap between the mountains, linking the architectural shape to the wider horizon.</p></article>
            <article id="horizon-captures" className="rounded-[28px] bg-[#526247] p-8 text-white shadow-[0_22px_60px_rgba(36,49,31,0.22)] md:p-10"><h4 className="text-3xl font-semibold tracking-[-0.04em]">Render sequence</h4><p className="mt-5 text-lg leading-8 text-white/74">The folder contains five unique captures and one duplicate. Four preserve the open meadow with small camera or lighting changes. The fifth documents the denser final state, so the case study treats the images as an iteration record rather than separate areas.</p></article>
          </div>
        </div>
      </section>

      <ChangelogAccordion
        entries={[{ version: "1.0.0", date: "Single study", title: "Meadow scene complete", body: ["- Established the rolling meadow and mountain horizon", "- Developed the warm sunset lighting and atmospheric depth", "- Added dense vegetation, rocks, and the ruined arch for the final composition"] }]}
        openVersion={openVersion}
        onToggle={setOpenVersion}
        idPrefix="horizon"
        description="The available captures document one compact environment study and its final enrichment pass."
        variant="cinematic"
      />

      <section id="reflection" data-case-study-chapter className="scroll-mt-16 relative overflow-hidden bg-[#34422f] px-5 py-32 md:px-8 md:py-44">
        <img src={image("final-meadow.png")} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-[#263322]/84" />
        <div className="relative mx-auto max-w-5xl">
          <SectionHeading intro="The final pass turns a broad lighting study into a more specific place while preserving the sunset and mountain gap that defined the original frame.">Reflection</SectionHeading>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <p className="rounded-[26px] bg-black/24 p-7 text-lg leading-8 text-white/72 shadow-[0_20px_56px_rgba(0,0,0,0.24)]">The strongest result is the separation of depth. Dark detailed plants, a lit middle field, the stone arch, repeated mountain silhouettes, and bright haze create a readable sequence from foreground to horizon.</p>
            <p className="rounded-[26px] bg-black/24 p-7 text-lg leading-8 text-white/72 shadow-[0_20px_56px_rgba(0,0,0,0.24)]">The captures document only one broad direction and do not show close detail, alternate times of day, or movement in the grass. A future pass would add a closer landmark view and a short sequence showing foliage motion and changing light.</p>
          </div>
        </div>
      </section>
    </CaseStudyShell>
  );
}
