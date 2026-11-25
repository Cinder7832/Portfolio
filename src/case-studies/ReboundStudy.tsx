import { useRef, useState } from "react";
import CaseStudyShell from "./CaseStudyShell";
import { caseStudyDefinitions } from "./definitions";
import { CaseStudyShowcaseImage, CaseStudyShowcaseRail } from "./CaseStudyMedia";
import ChangelogAccordion, { type ChangelogEntry } from "./ChangelogAccordion";
import { usePrefersReducedMotion } from "../motion";
import { projectSummary } from "./projectSummary";

type ReboundMedia = {
  file: string;
  title: string;
  alt: string;
};

const reboundImage = (file: string) => `${import.meta.env.BASE_URL}projects/rebound/${file}`;

const showcase: ReboundMedia[] = [
  { file: "gameplay-boomerang.png", title: "Boomerang combat", alt: "First person view of the boomerang inside the green lit dungeon" },
  { file: "dungeon-environment.png", title: "Dungeon environment", alt: "Green lit prison corridor assembled in Unity" },
  { file: "mimic-room.png", title: "Chest mimic room", alt: "Room filled with open chest mimics in the dungeon" },
  { file: "library-area.png", title: "Library route", alt: "Dungeon library with shelves, desk props, and green lamps" },
  { file: "perk-tree.png", title: "Perk tree", alt: "Upgrade screen showing health, movement, drill, and combat perks" },
  { file: "spider-queen.png", title: "Spider Queen", alt: "Purple and black Spider Queen model in Blockbench" },
];

const processMedia: ReboundMedia[] = [
  { file: "early-gameplay.png", title: "Early gameplay pass", alt: "Early Unity gameplay test with a skeleton, chest, and TNT" },
  { file: "environment-pass.png", title: "Environment pass", alt: "Unity scene view of the dungeon environment and props" },
  { file: "checkpoint.png", title: "Checkpoint implementation", alt: "Checkpoint banner and trigger being configured in Unity" },
];

const reboundChangelog: ChangelogEntry[] = [
  {
    version: "0.0.1",
    date: "2026-08-17",
    title: "Initial Beta Release",
    body: ["Rebound beta released!"],
  },
];

export default function ReboundProjectView({ onClose }: { onClose: () => void }) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const showcaseRef = useRef<HTMLDivElement | null>(null);
  const [openChangelog, setOpenChangelog] = useState<string | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const tagline = projectSummary("rebound", "A three week first person dungeon game built around a returning boomerang and an upgradeable drill.");

  const scrollShowcase = (direction: -1 | 1) => {
    const rail = showcaseRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * Math.min(rail.clientWidth * 0.82, 980), behavior: reducedMotion ? "auto" : "smooth" });
  };

  return (
    <CaseStudyShell definition={caseStudyDefinitions.rebound} scrollRef={scrollRef} onClose={onClose} className="bg-[#050806] text-white">
      <section className="relative flex min-h-[clamp(34rem,72vh,52rem)] items-end overflow-hidden bg-black px-5 pb-12 pt-28 md:px-8 md:pb-16">
        <img src={reboundImage("gameplay-boomerang.png")} alt="" className="absolute inset-0 h-full w-full object-cover object-center opacity-72" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(2,5,3,0.3)_45%,#050806_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_42%,rgba(70,255,111,0.12),transparent_38%)]" />
        <div className="relative mx-auto w-full max-w-7xl">
          <h1 className="max-w-6xl text-[clamp(4.8rem,14vw,11rem)] font-semibold leading-[0.78] tracking-[-0.075em]">Rebound</h1>
          <p className="mt-8 max-w-3xl text-lg leading-8 text-white/72 md:text-xl">
            {tagline}
          </p>
        </div>
      </section>

      <CaseStudyShowcaseRail background="#07120b" railRef={showcaseRef} onScroll={scrollShowcase}>
        {showcase.map((media) => (
          <div key={media.file} className="w-[86vw] shrink-0 snap-center md:w-[62vw] lg:w-[48rem]">
            <CaseStudyShowcaseImage src={reboundImage(media.file)} alt={media.alt} title={media.title} />
          </div>
        ))}
      </CaseStudyShowcaseRail>

      <section id="overview" data-case-study-chapter className="scroll-mt-16 px-5 py-28 md:px-8 md:py-40">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-14 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
            <div>
              <h2 className="max-w-5xl text-5xl font-semibold tracking-[-0.055em] md:text-8xl">Overview</h2>
              <p className="mt-8 max-w-3xl text-xl leading-9 text-white/68">
                {tagline}
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-x-7 gap-y-8 rounded-[24px] bg-[#0d1710] p-7 shadow-[0_28px_80px_rgba(0,0,0,0.26)] md:p-9">
              <div><dt className="text-sm text-white/44">Role</dt><dd className="mt-2 font-semibold">3D art, player systems, UI, VFX</dd></div>
              <div><dt className="text-sm text-white/44">Duration</dt><dd className="mt-2 font-semibold">Three weeks</dd></div>
              <div><dt className="text-sm text-white/44">Engine</dt><dd className="mt-2 font-semibold">Unity 6</dd></div>
              <div><dt className="text-sm text-white/44">Modelling</dt><dd className="mt-2 font-semibold">Blockbench</dd></div>
            </dl>
          </div>
          <div className="mt-20 grid grid-flow-dense overflow-hidden rounded-[26px] bg-[#9affaa]/28 md:grid-cols-2 lg:grid-cols-4">
            <article className="min-h-72 bg-[#102116] p-7 lg:col-span-2 lg:p-10"><h3 className="text-3xl font-semibold">My contribution</h3><p className="mt-5 max-w-2xl leading-8 text-white/64">I created a large portion of the models, textured many of the assets, contributed to the player controller, built the chest mimic enemy, and worked on the interface, visual effects, and general polish.</p></article>
            <article className="min-h-72 bg-[#132c1b] p-7 lg:p-10"><h3 className="text-2xl font-semibold">Core loop</h3><p className="mt-5 leading-8 text-white/64">Explore the dungeon, defeat enemies, break barrels, open chests, collect resources, and purchase upgrades before the boss route.</p></article>
            <article className="min-h-72 bg-[#d9ffdf] p-7 text-[#07120b] lg:p-10"><h3 className="text-2xl font-semibold">Outcome</h3><p className="mt-5 leading-8 text-[#07120b]/68">A playable first person dungeon with weapon switching, perks, enemy encounters, and two connected boss objectives.</p></article>
          </div>
        </div>
      </section>

      <section id="research" data-case-study-chapter className="scroll-mt-16 bg-[#d9ffdf] px-5 py-28 text-[#07120b] md:px-8 md:py-40">
        <div className="mx-auto max-w-7xl">
          <h2 className="max-w-5xl text-5xl font-semibold tracking-[-0.055em] md:text-8xl">Research</h2>
          <p className="mt-8 max-w-3xl text-xl leading-9 text-[#07120b]/68">The short schedule made concept selection and asset production method part of the design problem.</p>
          <div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-0 md:[&>article+article]:pl-10 md:[&>article:not(:last-child)]:pr-10">
            <article><h3 className="text-2xl font-semibold">Initial concepts</h3><p className="mt-4 leading-8 text-[#07120b]/68">The team considered several interpretations of Less is More. One concept used a car with a limited battery inside a racing game. The final direction reduced the structure to one dungeon route and a focused combat system.</p></article>
            <article><h3 className="text-2xl font-semibold">Combat reference</h3><p className="mt-4 leading-8 text-[#07120b]/68">Ultrakill informed the decision to use fast first person movement, direct combat feedback, and a final boss as the end point. Rebound uses its own boomerang and drill interaction instead of reproducing that game’s weapon set.</p></article>
            <article><h3 className="text-2xl font-semibold">Production method</h3><p className="mt-4 leading-8 text-[#07120b]/68">Blockbench was selected because its low polygon workflow allowed the team to create and texture readable models within three weeks. The shared block based language also kept enemies, props, and architecture visually consistent.</p></article>
          </div>
        </div>
      </section>

      <section id="experience" data-case-study-chapter className="scroll-mt-16 px-5 py-28 md:px-8 md:py-40">
        <div className="mx-auto max-w-7xl">
          <h2 className="max-w-5xl text-5xl font-semibold tracking-[-0.055em] md:text-8xl">Gameplay</h2>
          <div className="mt-16 grid grid-flow-dense overflow-hidden rounded-[26px] bg-[#9affaa]/28 lg:grid-cols-12 lg:grid-rows-2">
            <article className="bg-[#0d1710] p-7 md:p-9 lg:col-span-7 lg:row-span-2">
              <h3 className="text-3xl font-semibold md:text-4xl">Escape and return</h3>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/64">The player begins in a prison and obtains a key to break free. The first weapon is a boomerang that can strike enemies, ricochet from walls, and return to the player. The route then opens into combat spaces, resource rooms, checkpoints, and boss objectives.</p>
              <img src={reboundImage("control-prompts.png")} alt="On screen controls for hand mode, boomerang mode, interaction, jumping, and crouching" className="mt-10 max-h-80 w-full rounded-[20px] bg-black object-contain" />
            </article>
            <article className="bg-[#132c1b] p-7 md:p-9 lg:col-span-5"><h3 className="text-2xl font-semibold">Resources</h3><p className="mt-4 leading-8 text-white/64">Barrels and chests award Craig Coins and Rubies. These resources purchase movement, health, critical chance, and weapon upgrades through the perk tree.</p></article>
            <article className="bg-[#d9ffdf] p-7 text-[#07120b] md:p-9 lg:col-span-5"><h3 className="text-2xl font-semibold">Progression</h3><p className="mt-4 leading-8 text-[#07120b]/68">Orbs found in the world are placed on pedestals to unlock the Skeleton King. One required orb is awarded after the Spider Queen encounter, connecting exploration to the final fight.</p></article>
          </div>
        </div>
      </section>

      <section id="process" data-case-study-chapter className="scroll-mt-16 bg-[#081109] px-5 py-28 md:px-8 md:py-40">
        <div className="mx-auto max-w-7xl">
          <h2 className="max-w-5xl text-5xl font-semibold tracking-[-0.055em] md:text-8xl">Process</h2>
          <p className="mt-8 max-w-3xl text-xl leading-9 text-white/64">The build moved from isolated controller and combat tests to a dressed dungeon with checkpoints, interface feedback, and progression systems.</p>
          <div className="mt-16 overflow-hidden rounded-[26px]">
            {processMedia.map((media, index) => (
              <article key={media.file} className="grid bg-[#0b160d] lg:grid-cols-[1.18fr_0.82fr] lg:items-stretch">
                <img src={reboundImage(media.file)} alt={media.alt} className={`aspect-video h-full w-full bg-black object-cover ${index % 2 ? "lg:order-2" : ""}`} />
                <div className={`flex flex-col justify-center p-8 md:p-12 ${index % 2 ? "lg:order-1" : ""}`}>
                  <h3 className="text-3xl font-semibold md:text-4xl">{media.title}</h3>
                  <p className="mt-5 max-w-xl leading-8 text-white/64">
                    {index === 0 && "Early tests established the first person controller, boomerang, drill, skeleton target, destructible TNT, and resource pickups before the final environment was assembled."}
                    {index === 1 && "The dungeon was built from reusable walls, pipes, lamps, crates, fences, rubble, and set dressing. Green light became the main route and interaction colour."}
                    {index === 2 && "The later pass added checkpoints, perk interface work, clearer control prompts, combat VFX, and polish needed to connect the separate rooms into one playable route."}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="extras" data-case-study-chapter className="scroll-mt-16 px-5 pb-20 pt-28 md:px-8 md:pb-28 md:pt-40">
        <div className="mx-auto max-w-7xl pb-14">
          <h2 className="max-w-5xl text-5xl font-semibold tracking-[-0.055em] md:text-8xl">Extras</h2>
          <p className="mt-8 max-w-3xl text-xl leading-9 text-white/64">Detailed work on the weapon modes, enemy roster, bosses, and original assets.</p>
        </div>
      </section>

      <section id="rebound-combat" className="px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div><h2 className="text-5xl font-semibold tracking-[-0.05em] md:text-7xl">Combat modes</h2><p className="mt-7 text-lg leading-8 text-white/64">The player can switch between a punch, the standard boomerang, and a combined boomerang and drill mode after buying the drill. Spinning the drill increases the boomerang’s spin rate, travel distance, speed, and damage. The upgrade extends the original weapon instead of replacing it.</p></div>
          <img src={reboundImage("drill-test.png")} alt="Unity scene showing the boomerang and drill attached to the player controller" className="aspect-video w-full rounded-[24px] bg-black object-cover shadow-[0_28px_80px_rgba(0,0,0,0.3)]" />
        </div>
      </section>

      <section id="rebound-enemies" className="bg-[#132c1b] px-5 py-28 md:px-8 md:py-40">
        <div className="mx-auto max-w-7xl">
          <h2 className="max-w-5xl text-5xl font-semibold tracking-[-0.055em] md:text-7xl">Enemies and bosses</h2>
          <div className="mt-16 grid grid-flow-dense overflow-hidden rounded-[26px] bg-[#9affaa]/24 md:grid-cols-2 lg:grid-cols-4">
            <article className="bg-[#09150d] p-7 lg:col-span-2 lg:p-10"><h3 className="text-2xl font-semibold">Skeleton</h3><p className="mt-4 leading-8 text-white/64">A humanoid dungeon enemy used throughout the route and as the visual base for the Skeleton King boss.</p></article>
            <article className="bg-[#183a22] p-7 lg:p-10"><h3 className="text-2xl font-semibold">Spider</h3><p className="mt-4 leading-8 text-white/64">A low profile enemy paired with the larger Spider Queen encounter.</p></article>
            <article className="bg-[#d9ffdf] p-7 text-[#07120b] lg:p-10"><h3 className="text-2xl font-semibold">Chest mimic</h3><p className="mt-4 leading-8 text-[#07120b]/68">I built the mimic as a hostile version of a familiar reward object, using an opening chest and visible teeth to signal the change.</p></article>
            <article className="overflow-hidden bg-black md:col-span-2"><img src={reboundImage("spider.png")} alt="Black and red spider enemy model in Blockbench" className="h-full min-h-80 w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.025]" /></article>
            <article className="bg-[#09150d] p-7 md:col-span-2 lg:p-10"><h3 className="text-3xl font-semibold">Boss route</h3><p className="mt-5 leading-8 text-white/64">The Spider Queen awards one of the orbs needed for progression. The player places collected orbs on pedestals to access the Skeleton King, making the first boss part of the final objective rather than an isolated encounter.</p></article>
          </div>
        </div>
      </section>

      <section id="rebound-assets" className="px-5 py-28 md:px-8 md:py-40">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl"><h2 className="text-5xl font-semibold tracking-[-0.055em] md:text-7xl">Blockbench assets</h2><p className="mt-7 max-w-3xl text-lg leading-8 text-white/64">The asset workflow used simple forms and compact textures so props and enemies could be produced during the jam. I created and textured a large share of this set.</p></div>
          <div className="mt-16 grid grid-flow-dense gap-0 overflow-hidden rounded-[26px] md:grid-cols-2 lg:grid-cols-3 [&>img]:transition-opacity [&>img]:duration-500 hover:[&>img]:opacity-90">
            <img src={reboundImage("crate-model.png")} alt="Crate and fence models being built in Blockbench" className="aspect-video w-full object-cover lg:col-span-2" />
            <img src={reboundImage("fence-texture.png")} alt="Fence texture being painted in Blockbench" className="aspect-video h-full w-full object-cover" />
            <img src={reboundImage("dirt-texture.png")} alt="Pixel dirt texture being painted in Blockbench" className="aspect-video w-full object-cover" />
            <img src={reboundImage("skeleton-model.png")} alt="Small render of the Blockbench skeleton character" className="aspect-video w-full bg-[#111] object-contain" />
            <img src={reboundImage("lantern-detail.png")} alt="Green dungeon lantern configured with movement in Unity" className="aspect-video w-full object-cover" />
          </div>
        </div>
      </section>

      <div className="bg-[#081109]">
        <ChangelogAccordion
          entries={reboundChangelog}
          openVersion={openChangelog}
          onToggle={setOpenChangelog}
          idPrefix="rebound"
          gameTitle="Rebound"
          description="Release notes for Rebound."
        />
      </div>

      <section id="reflection" data-case-study-chapter className="scroll-mt-16 relative overflow-hidden px-5 py-28 text-center md:px-8 md:py-40">
        <img src={reboundImage("dungeon-environment.png")} alt="" className="absolute inset-0 h-full w-full object-cover opacity-28" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(5,8,6,0.35),#050806_76%)]" />
        <div className="relative mx-auto max-w-4xl">
          <h2 className="text-5xl font-semibold tracking-[-0.055em] md:text-8xl">Reflection</h2>
          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-white/68">The three week limit required the team to select a concept quickly and reuse the same systems across combat, exploration, and progression. The boomerang supported that constraint because one mechanic could handle direct attacks, ricochets, return timing, and later drill upgrades.</p>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-white/68">My work covered art and implementation rather than one isolated role. Producing models while contributing to the player, mimic, interface, effects, and polish showed where a consistent asset language and small reusable systems helped the team reach a complete route within the jam schedule.</p>
        </div>
      </section>
    </CaseStudyShell>
  );
}
