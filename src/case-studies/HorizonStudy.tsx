import { useRef } from "react";
import { ExternalLink } from "lucide-react";
import CaseStudyShell from "./CaseStudyShell";
import { caseStudyDefinitions } from "./definitions";
import { CaseStudyShowcaseImage, CaseStudyShowcaseRail } from "./CaseStudyMedia";
import { usePrefersReducedMotion } from "../motion";
import { projectSummary } from "./projectSummary";

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
    body: "Unreal Engine's Foliage Mode supports painting varied instance sets across a landscape and controlling their density, scale, and spacing. I used those controls to create the irregular mixture of grass, shrubs, and trees visible in the final frame.",
    href: "https://dev.epicgames.com/documentation/unreal-engine/foliage-mode-in-unreal-engine",
    source: "Epic Games",
  },
  {
    title: "Atmospheric depth",
    body: "Exponential Height Fog can increase its density in lower areas while leaving higher terrain clearer. I used a similar visual principle by keeping the foreground plants dark and detailed while allowing the distant ridges to become lighter and less distinct.",
    href: "https://dev.epicgames.com/documentation/unreal-engine/exponential-height-fog-in-unreal-engine",
    source: "Epic Games",
  },
  {
    title: "Sunset colour",
    body: "At sunset, sunlight travels through more of the atmosphere and the shorter blue wavelengths scatter away, leaving more red and orange light. I exaggerated that warm range across the clouds, grass, terrain, and haze to make the lighting condition clear.",
    href: "https://weather.metoffice.gov.uk/learn-about/weather/optical-effects/why-is-the-sky-blue",
    source: "Met Office",
  },
  {
    title: "Meadow structure",
    body: "Mountain meadow plant communities commonly combine grasses, flowering plants, and shrubs. I used several vegetation types and scales in the final pass so the field would not look like one repeated layer of grass.",
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
  const tagline = projectSummary("horizon", "I created this small Unreal Engine meadow study around warm sunset light and a distant ruined arch.");

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
            <p className="mt-8 max-w-2xl text-lg leading-8 text-white/80 md:text-xl">{tagline}</p>
          </div>
        </div>
      </section>

      <CaseStudyShowcaseRail background="#d5b483" railRef={showcaseRef} onScroll={scrollShowcase}>
        {showcase.map((item) => (
          <div key={item.file} className="w-[86vw] shrink-0 snap-center md:w-[62vw] lg:w-[48rem]">
            <CaseStudyShowcaseImage src={image(item.file)} alt={item.alt} title={item.title} />
          </div>
        ))}
      </CaseStudyShowcaseRail>

      <section id="overview" data-case-study-chapter className="scroll-mt-16 bg-[#e7d7b9] px-5 py-32 text-[#253022] md:px-8 md:py-44">
        <div className="mx-auto max-w-7xl">
          <SectionHeading dark intro="Horizon is a focused landscape exercise where I worked around one viewpoint and one sunset lighting condition. The project records how the scene developed from an open field into a denser meadow environment.">Overview</SectionHeading>
          <div className="mt-16 grid auto-rows-fr grid-flow-dense grid-cols-1 overflow-hidden rounded-[32px] md:grid-cols-12">
            <article className="bg-[#4f6244] p-7 text-white md:col-span-7 md:p-10"><h4 className="text-3xl font-semibold tracking-[-0.04em]">Intent</h4><p className="mt-5 max-w-2xl text-lg leading-8 text-white/76">My goal was to create a calm and readable meadow with enough variation to support a wide view. I used vegetation, rocks, architecture, lighting, and haze to establish scale without adding gameplay systems that would take attention away from the landscape work.</p></article>
            <article className="bg-[#c79663] p-7 md:col-span-5 md:p-10"><h4 className="text-3xl font-semibold tracking-[-0.04em]">Scope</h4><p className="mt-5 text-lg leading-8 text-[#253022]/72">I kept the scope to one landscape, one main sunset direction, and five unique captures. The final composition focuses on the relationship between the open meadow and the ruined arch.</p></article>
            <article className="bg-[#bbc49e] p-7 md:col-span-4"><h4 className="text-2xl font-semibold">Role</h4><p className="mt-4 leading-7 text-[#253022]/70">My work covered the landscape composition, foliage distribution, lighting, atmosphere, landmark placement, and final camera framing.</p></article>
            <article className="bg-[#7f8b60] p-7 text-white md:col-span-4"><h4 className="text-2xl font-semibold">Tools</h4><p className="mt-4 leading-7 text-white/76">I used Unreal Engine's landscape, foliage, lighting, sky, and atmospheric systems to build and present the scene.</p></article>
            <article className="bg-[#f2e8d4] p-7 md:col-span-4"><h4 className="text-2xl font-semibold">Outcome</h4><p className="mt-4 leading-7 text-[#253022]/70">I completed a final environment image with clear foreground, middle ground, and background layers.</p></article>
          </div>
        </div>
      </section>

      <section id="research" data-case-study-chapter className="scroll-mt-16 bg-[#182017] px-5 py-32 md:px-8 md:py-44">
        <div className="mx-auto max-w-7xl">
          <SectionHeading intro="I completed this research retrospectively to explain the visual principles that can be seen in the final image. It does not mean that I used every source during the original build.">Research</SectionHeading>
          <div className="mt-16 grid overflow-hidden rounded-[32px] md:grid-cols-2">
            {research.map((item) => (
              <article key={item.title} className="bg-[#263223] p-7 md:p-9">
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
          <SectionHeading dark intro="I arranged the final image so the eye moves from the dark foreground foliage, through the sunlit field and stone arch, and then toward the softened mountain ridges and pale sky.">Project Details</SectionHeading>
          <div className="mt-16 grid overflow-hidden rounded-[32px] lg:grid-cols-12">
            <div className="overflow-hidden bg-[#59664a] lg:col-span-7"><img src={image("final-meadow.png")} alt="Final Horizon meadow composition" className="aspect-[16/10] h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.025]" /></div>
            <div className="grid lg:col-span-5">
              <article className="bg-[#ece2ca] p-7"><h4 className="text-2xl font-semibold">Landmark</h4><p className="mt-4 leading-7 text-[#253022]/72">I placed the ruined arch close to the centre so it breaks the horizontal line of the meadow. Its simple silhouette gives the eye a destination without becoming more important than the wider landscape.</p></article>
              <article className="bg-[#44553c] p-7 text-white"><h4 className="text-2xl font-semibold">Layered depth</h4><p className="mt-4 leading-7 text-white/74">I overlapped large plants and rocks across the lower frame, then placed smaller shrubs and the ruin in the middle distance. Each mountain band becomes lighter and less detailed toward the horizon, which helps the landscape feel deeper.</p></article>
              <article className="bg-[#d2a36f] p-7"><h4 className="text-2xl font-semibold">Colour and light</h4><p className="mt-4 leading-7 text-[#253022]/72">I carried the warm gold light across the grass, clouds, terrain, and haze. Dark olive vegetation provides the main contrast, while pale lavender in the sky and distant ridges stops the whole image becoming uniformly orange.</p></article>
            </div>
          </div>
          <article id="horizon-landmark" className="mt-5 rounded-[28px] bg-[#f1e7d4] p-8 md:p-10"><h4 className="text-3xl font-semibold tracking-[-0.04em]">Ruined landmark</h4><p className="mt-5 max-w-4xl text-lg leading-8 text-[#253022]/72">I used the arch to introduce a clear sign of human history without allowing it to dominate the valley. Its opening repeats the bright gap between the mountains, linking the architectural shape with the wider horizon.</p></article>
        </div>
      </section>

      <section id="process" data-case-study-chapter className="scroll-mt-16 bg-[#111710] px-5 py-32 md:px-8 md:py-44">
        <div className="mx-auto max-w-7xl">
          <SectionHeading intro="The saved sequence records the small framing and lighting changes I made across the open meadow, followed by a much larger final pass that added density and history.">Process</SectionHeading>
          <div className="mt-16 overflow-hidden rounded-[32px]">
            {[
              ["open-meadow-flowers.png", "Establish the valley", "I shaped the rolling terrain into a shallow basin between the mountain ridges. White flowers and long grass anchor the foreground, while the low sun gives the horizon a clear direction."],
              ["open-meadow-light.png", "Tune the sunset", "Across the next captures, I adjusted the balance between the bright cloud light, glowing field, and darker terrain. I kept the sun low and central so the lighting direction also supports the composition."],
              ["open-meadow-wide.png", "Refine the frame", "I widened the view to give the foreground ridge more weight and open up the central field. The curved bands of illuminated grass help guide the eye toward the gap in the distant mountains."],
              ["final-meadow.png", "Add density and history", "In the final pass, I replaced the exposed early field with shrubs, trees, rocks, mist, and a ruined arch. These vertical forms add overlap and scale while keeping the mountain horizon visible."],
            ].map(([file, title, body], index) => (
              <article key={file} className={`grid items-stretch lg:grid-cols-12 ${index % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
                <div className="overflow-hidden lg:col-span-7"><img src={image(file)} alt={`${title} render`} className="aspect-[16/10] h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.025]" /></div>
                <div className="flex flex-col justify-center bg-[#253023] p-7 lg:col-span-5 lg:p-10"><h4 className="text-3xl font-semibold tracking-[-0.04em]">{title}</h4><p className="mt-5 text-lg leading-8 text-white/64">{body}</p></div>
              </article>
            ))}
          </div>
          <article id="horizon-captures" className="mt-5 rounded-[28px] bg-[#526247] p-8 text-white md:p-10"><h4 className="text-3xl font-semibold tracking-[-0.04em]">Render sequence</h4><p className="mt-5 max-w-4xl text-lg leading-8 text-white/74">My project folder contains five unique captures and one duplicate. Four of the images preserve the open meadow with small camera or lighting changes, while the fifth records the denser final state. I have presented them as an iteration sequence rather than describing them as separate areas.</p></article>
        </div>
      </section>

      <section id="reflection" data-case-study-chapter className="scroll-mt-16 relative overflow-hidden bg-[#34422f] px-5 py-32 md:px-8 md:py-44">
        <img src={image("final-meadow.png")} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-[#263322]/84" />
        <div className="relative mx-auto max-w-5xl">
          <SectionHeading intro="The final pass helped me turn a broad lighting study into a more specific place while keeping the sunset and mountain gap that defined the original frame.">Reflection</SectionHeading>
          <div className="mt-12 grid overflow-hidden rounded-[28px] bg-black/24 md:grid-cols-2">
            <p className="p-7 text-lg leading-8 text-white/72 md:p-9">I think the strongest result is the separation of depth. The dark detailed plants, lit middle field, stone arch, repeated mountain silhouettes, and bright haze create a readable sequence from the foreground to the horizon.</p>
            <p className="p-7 text-lg leading-8 text-white/72 md:p-9">My captures only document one broad direction, so they do not show close detail, alternate times of day, or movement in the grass. In a future pass, I would add a closer view of the landmark and a short sequence showing the foliage and light changing over time.</p>
          </div>
        </div>
      </section>
    </CaseStudyShell>
  );
}
