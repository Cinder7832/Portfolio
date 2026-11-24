import { useRef } from "react";
import CaseStudyShell from "./CaseStudyShell";
import { CaseStudyShowcaseImage, CaseStudyShowcaseRail } from "./CaseStudyMedia";
import { caseStudyDefinitions } from "./definitions";
import { usePrefersReducedMotion } from "../motion";

const aztecImage = (file: string) => `${import.meta.env.BASE_URL}projects/aztec-temple/${file}`;

function Heading({ children, intro, onLight = false }: { children: string; intro?: string; onLight?: boolean }) {
  return (
    <div className="max-w-5xl">
      <h3 className="text-5xl font-semibold leading-[0.9] tracking-[-0.06em] md:text-8xl">{children}</h3>
      {intro && <p className={`mt-7 max-w-4xl text-lg leading-8 ${onLight ? "text-[#24170c]/70" : "text-[#f4e8c8]/68"}`}>{intro}</p>}
    </div>
  );
}

export default function AztecTempleProjectView({ onClose }: { onClose: () => void }) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const showcaseRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  const scrollShowcase = (direction: -1 | 1) => {
    const rail = showcaseRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * Math.min(rail.clientWidth * 0.82, 680), behavior: reducedMotion ? "auto" : "smooth" });
  };

  return (
    <CaseStudyShell definition={caseStudyDefinitions["aztec-temple"]} scrollRef={scrollRef} onClose={onClose} className="bg-[#17120b] text-[#f4e8c8]">
      <header className="relative min-h-[42rem] overflow-hidden bg-[#080706] md:min-h-[52rem]">
        <img src={aztecImage("temple-vista.png")} alt="Aztec Temple scene framed by mountains, trees, water and warm sunlight" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080706]/92 via-[#080706]/26 to-[#080706]/5" aria-hidden="true" />
        <div className="relative mx-auto flex min-h-[42rem] max-w-7xl flex-col justify-end px-5 pb-16 pt-28 md:min-h-[52rem] md:px-8 md:pb-24">
          <h2 className="max-w-6xl text-[clamp(3.8rem,12vw,9.5rem)] font-semibold leading-[0.84] tracking-[-0.07em]">Aztec Temple</h2>
          <p className="mt-8 max-w-4xl text-lg leading-8 text-[#f4e8c8]/78">A navigable Unity HDRP environment that applies Mesoamerican architecture research, terrain composition, atmosphere, sourced assets and material repair.</p>
        </div>
      </header>

      <CaseStudyShowcaseRail background="#21170d" railRef={showcaseRef} onScroll={scrollShowcase}>
        {[
          ["temple-silhouette.png", "Temple silhouette framed by the HDRP terrain and sun"],
          ["jungle-route.png", "Final jungle route leading toward the temple"],
          ["summit-interior.png", "Temple summit interior containing pottery and a skull"],
          ["bridge-detail.png", "Bridge, rocks and vegetation used as a point of interest"],
          ["controller-test.png", "Player controller and collider test in the environment"],
        ].map(([file, alt]) => (
          <div key={file} className="w-[86vw] shrink-0 snap-start md:w-[62vw] lg:w-[48rem]">
            <CaseStudyShowcaseImage src={aztecImage(file)} alt={alt} title={alt} />
          </div>
        ))}
      </CaseStudyShowcaseRail>

      <section id="overview" data-case-study-chapter className="scroll-mt-16 bg-[#17120b] py-32 md:py-44">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Heading intro="The study covers the complete Aztec Temple project. Earlier Unity exercises in the source deck are separate course work and are not part of this game environment.">Overview</Heading>
          <div className="mt-16 grid grid-flow-dense gap-y-0 border-y border-white/70 md:grid-cols-12 [&>article]:rounded-none [&>article]:border-b [&>article]:border-white/70 [&>article]:bg-transparent [&>article]:px-0 [&>article]:py-10 [&>article]:text-[#f4e8c8] [&>article]:shadow-none [&>article_p]:!text-[#f4e8c8]/68">
            <article className="rounded-[28px] bg-[#f0dfb9] p-8 text-[#24170c] md:col-span-7 md:border-r md:border-white/70 md:!pr-12 md:p-11"><h4 className="text-3xl font-semibold tracking-[-0.035em]">Environment goal</h4><p className="mt-6 max-w-2xl text-lg leading-8 text-[#24170c]/72">The scene places a stepped temple inside a dense landscape. Mountains, fog, water, vegetation and warm sunlight frame the structure, while a visible route directs the player toward it.</p></article>
            <article className="rounded-[28px] bg-[#6d3d20] p-8 md:col-span-5 md:!pl-12 md:p-10"><h4 className="text-3xl font-semibold tracking-[-0.035em]">Responsibility</h4><p className="mt-6 text-lg leading-8 text-[#f4e8c8]/72">I researched the setting, shaped the terrain, built the temple from Unity cubes, configured HDRP, integrated sourced assets, repaired shaders, adjusted materials and tested navigation.</p></article>
            <article className="rounded-[28px] bg-[#2b2117] p-8 md:col-span-5 md:border-r md:border-white/70 md:!pr-12"><h4 className="text-2xl font-semibold">Technical setup</h4><p className="mt-4 leading-8 text-[#f4e8c8]/66">Unity, High Definition Render Pipeline, Terrain Tools, Unity Version Control and Unity Cloud supported the environment work.</p></article>
            <article className="rounded-[28px] bg-[#322518] p-8 md:col-span-7 md:!pl-12"><h4 className="text-2xl font-semibold">Delivered outcome</h4><p className="mt-4 leading-8 text-[#f4e8c8]/66">The result is a navigable environment with a working first or third person controller, colliders on selected trees and rocks, a readable path and several points of interest.</p></article>
          </div>
        </div>
      </section>

      <section id="research" data-case-study-chapter className="scroll-mt-16 bg-[#ead9b6] py-32 text-[#24170c] md:py-44">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Heading onLight intro="The research connected Unity terrain features, Mesoamerican architecture, specific historic sites and game environment references to decisions in the final scene.">Research</Heading>
          <div className="mt-16 grid grid-flow-dense gap-y-0 border-t border-black/70 md:grid-cols-12 [&>article]:rounded-none [&>article]:border-b [&>article]:border-black/70 [&>article]:bg-transparent [&>article]:px-0 [&>article]:py-10 [&>article]:text-[#24170c]">
            <article className="rounded-[28px] bg-[#fff8e8] p-8 md:col-span-7 md:border-r md:border-black/70 md:!pr-12 md:p-10"><h4 className="text-3xl font-semibold">Mesoamerican temple form</h4><p className="mt-5 text-lg leading-8 text-[#24170c]/70">The research identified square bases, stepped faces, central stairways and flat summit temples as recurring features. The temple uses a square plan with stairs on all four sides to represent ceremonial access.</p></article>
            <article className="rounded-[28px] bg-[#d7a867] p-8 md:col-span-5 md:!pl-12 md:p-10"><h4 className="text-3xl font-semibold">Ziggurat comparison</h4><p className="mt-5 text-lg leading-8 text-[#24170c]/74">The flat top, summit structure and stepped profile aligned more closely with the documented ziggurat comparison than with a smooth sided Egyptian pyramid.</p></article>
            <article className="rounded-[28px] bg-[#c88745] p-8 md:col-span-4 md:border-r md:border-black/70 md:!pr-8"><h4 className="text-2xl font-semibold">Cholula</h4><p className="mt-4 leading-8 text-[#24170c]/72">The Great Pyramid of Cholula established a reference for a broad monumental footprint. The source records a base of about 300 by 315 metres and a height of 25 metres.</p></article>
            <article className="rounded-[28px] bg-[#f6ead0] p-8 md:col-span-4 md:border-r md:border-black/70 md:!px-8"><h4 className="text-2xl font-semibold">Santa Cecilia Acatitlan</h4><p className="mt-4 leading-8 text-[#24170c]/72">Its Nahuatl name, translated in the source as “place among the reeds,” connected the temple research to the use of water and wetland imagery in the scene.</p></article>
            <article className="rounded-[28px] bg-[#b67739] p-8 md:col-span-4 md:!pl-8"><h4 className="text-2xl font-semibold">El Tepozteco</h4><p className="mt-4 leading-8 text-[#24170c]/74">The documented summit rooms and ritual offerings informed the interior opening, pottery, skulls and other set dressing at the top of the temple.</p></article>
            <article className="rounded-[28px] bg-[#3d2717] p-8 text-[#f4e8c8] md:col-span-7 md:border-r md:border-black/70 md:!pr-12 md:p-10"><h4 className="text-3xl font-semibold">Terrain Tools</h4><p className="mt-5 text-lg leading-8 !text-[#24170c]/72">The research covered sculpting and height painting, blended terrain textures, tree and detail placement, and stitching for neighbouring terrain tiles. Stamp and noise brushes became the main tools for this project.</p></article>
            <article className="rounded-[28px] bg-[#5b3820] p-8 text-[#f4e8c8] md:col-span-5 md:!pl-12 md:p-10"><h4 className="text-3xl font-semibold">Game references</h4><p className="mt-5 text-lg leading-8 !text-[#24170c]/72">Shadow of the Tomb Raider informed the dense jungle, silhouette lighting and guided path. Temple Run provided another reference for a readable route through a temple environment.</p></article>
          </div>
          <figure className="mt-4 overflow-hidden rounded-[32px] bg-[#3d2717] shadow-[0_24px_54px_rgba(55,32,14,0.2)]"><img src={aztecImage("temple-silhouette.png")} alt="Temple silhouette used to assess the final composition and lighting" className="aspect-[21/9] w-full object-cover" /></figure>
        </div>
      </section>

      <section id="experience" data-case-study-chapter className="scroll-mt-16 bg-[#6a3c20] py-32 md:py-44">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Heading intro="The interaction layer focuses on exploration. The route, collision and points of interest support movement through the environment without adding a separate combat or puzzle system.">Gameplay</Heading>
          <div className="mt-16 grid grid-flow-dense gap-4 md:grid-cols-12 [&>article]:min-h-[24rem] [&>article]:flex [&>article]:flex-col [&>article]:justify-end [&>article]:rounded-[42%_42%_28px_28px]">
            <article className="min-h-72 rounded-[28px] bg-[#24170c] p-8 md:col-span-7 md:p-10"><h4 className="text-3xl font-semibold">Guided route</h4><p className="mt-5 max-w-2xl text-lg leading-8 text-[#f4e8c8]/68">A painted mud path gives the player a clear approach. Terrain height, fog and vegetation frame the temple so it remains visible as the main destination.</p></article>
            <article className="min-h-72 rounded-[28px] bg-[#d7a867] p-8 text-[#24170c] md:col-span-5 md:p-10"><h4 className="text-3xl font-semibold">Player controller</h4><p className="mt-5 text-lg leading-8 text-[#24170c]/72">The final environment supports a working first or third person controller. Colliders on selected trees and rocks prevent the player from moving through major objects.</p></article>
            <article className="rounded-[28px] bg-[#4b2917] p-8 md:col-span-12 md:p-10"><h4 className="text-3xl font-semibold">Points of interest</h4><p className="mt-5 max-w-5xl text-lg leading-8 text-[#f4e8c8]/68">The temple silhouette, water edge, bridge, summit opening, pottery, skulls, rocks and dense vegetation create destinations along the route and reward closer inspection of the environment.</p></article>
          </div>
        </div>
      </section>

      <section id="process" data-case-study-chapter className="scroll-mt-16 bg-[#17120b] py-32 md:py-44">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Heading intro="The recorded process moves from renderer selection and terrain composition through construction, atmosphere, vegetation, detail and navigation checks.">Process</Heading>
          <div className="mt-20 grid gap-y-0 border-b border-[#d7a867]/30 md:grid-cols-2 [&>article]:rounded-none [&>article]:border-t [&>article]:border-[#d7a867]/30 [&>article]:bg-transparent [&>article]:px-0 [&>article]:py-10">
            {[
              ["Renderer and atmosphere", "The first URP setup did not provide the intended lighting features. The project moved to HDRP, enabled volumetric clouds and water, raised the fog volume and adjusted the sunlight toward a warmer colour."],
              ["Terrain composition", "Terrain Tools added extra brushes. Stamp and noise brushes shaped mountains around the temple, while the elevated fog helped separate the landmark from the surrounding terrain."],
              ["Temple construction", "Unity cube objects formed the square base, four central stairways, flat summit and brick side railings. Moving the sun above the mountain strengthened the silhouette established in the moodboard."],
              ["Water and route", "Water and clouds expanded the atmosphere. A mud texture created the approach path, with the wetland research providing a reason to place water near the temple."],
              ["Vegetation repair", "Book of the Dead grass replaced the first purple grass. Tree shaders were repaired, but the earlier trees were later replaced with Book of the Dead trees to achieve a more consistent dense jungle."],
              ["Rock and surface pass", "Terrain Sample rocks added smaller landmarks. A rock texture covered the mountains, and tree colour temperatures were adjusted to sit more naturally in the warm scene."],
              ["Summit revision", "An early summit room contained pottery and skulls but disrupted the exterior. The final version restored the simpler temple top and cut an opening into it so the ritual set dressing remained inside."],
              ["Navigation check", "The final pass tested the first or third person controller and added collision to selected trees and rocks. The route and landmark framing remained the main measures of readability."],
            ].map(([title, body], index) => <article key={title} className={`rounded-[28px] bg-[#241b13] p-8 md:p-10 ${index === 0 || index === 5 ? "md:col-span-2" : ""} ${[1, 3, 6].includes(index) ? "md:border-r md:border-[#d7a867]/30 md:!pr-12" : ""} ${[2, 4, 7].includes(index) ? "md:!pl-12" : ""}`}><h4 className="text-3xl font-semibold tracking-[-0.035em] text-[#d7a867]">{title}</h4><p className="mt-5 text-lg leading-8 text-[#f4e8c8]/68">{body}</p></article>)}
          </div>
        </div>
      </section>

      <section id="extras" data-case-study-chapter className="scroll-mt-16 bg-[#2b2117] py-32 md:py-44">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Heading intro="The technical choices and sourced assets below supported the environment without changing the documented project scope.">Extras</Heading>
          <div className="mt-16 grid grid-flow-dense gap-y-0 border-t border-[#f4e8c8]/30 md:grid-cols-12 [&>article]:rounded-none [&>article]:border-b [&>article]:border-[#f4e8c8]/30 [&>article]:bg-transparent [&>article]:px-0 [&>article]:py-10 [&>article]:text-[#f4e8c8] [&>article_p]:!text-[#f4e8c8]/68">
            <article id="aztec-temple-renderer" className="rounded-[28px] bg-[#17120b] p-8 md:col-span-5 md:border-r md:border-[#f4e8c8]/30 md:!pr-12 md:p-10"><h4 className="text-3xl font-semibold">Renderer decision</h4><p className="mt-5 text-lg leading-8 text-[#f4e8c8]/68">HDRP supplied the water, volumetric clouds, fog controls, global illumination and screen space reflections required by the visual direction.</p></article>
            <article id="aztec-temple-assets" className="rounded-[28px] bg-[#ead9b6] p-8 text-[#24170c] md:col-span-7 md:!pl-12 md:p-10"><h4 className="text-3xl font-semibold">Asset sources</h4><p className="mt-5 text-lg leading-8 text-[#24170c]/72">Book of the Dead and Terrain Sample assets came from Unity Technologies. The bridge, pots, skull and bones came from Sketchfab. Poly Haven supplied surface textures.</p></article>
            <article id="aztec-temple-materials" className="rounded-[28px] bg-[#754322] p-8 md:col-span-7 md:border-r md:border-[#f4e8c8]/30 md:!pr-12 md:p-10"><h4 className="text-3xl font-semibold">Material repair</h4><p className="mt-5 text-lg leading-8 text-[#f4e8c8]/70">Correcting diffusion shader problems restored vegetation that appeared pink. Poly Haven materials and normal maps added surface depth to the cube based temple.</p></article>
            <article className="rounded-[28px] bg-[#382719] p-8 md:col-span-5 md:!pl-12 md:p-10"><h4 className="text-3xl font-semibold">Performance check</h4><p className="mt-5 text-lg leading-8 text-[#f4e8c8]/68">The summit detail pass included an experiment with level of detail assets so distant objects could use simpler geometry.</p></article>
          </div>
        </div>
      </section>

      <section id="reflection" data-case-study-chapter className="scroll-mt-16 bg-[#ead9b6] py-32 text-[#24170c] md:py-44">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Heading onLight intro="The final reflection identifies the limits of cube based construction and the practical techniques used to complete the environment.">Reflection</Heading>
          <div className="mt-16 grid gap-y-0 border-t border-black/70 md:grid-cols-12 [&>article]:rounded-none [&>article]:border-b [&>article]:border-black/70 [&>article]:bg-transparent [&>article]:px-0 [&>article]:py-10 [&>article]:text-[#24170c]">
            <article className="rounded-[28px] bg-[#fff8e8] p-8 md:col-span-7 md:border-r md:border-black/70 md:!pr-12 md:p-10"><h4 className="text-3xl font-semibold">Temple texturing</h4><p className="mt-5 text-lg leading-8 text-[#24170c]/72">Basic Unity cubes limited the surface detail that could be built into the structure. The reflection identifies custom Blender construction as a future route once those modelling skills improve.</p></article>
            <article className="rounded-[28px] bg-[#d7a867] p-8 md:col-span-5 md:!pl-12 md:p-10"><h4 className="text-3xl font-semibold">Practical response</h4><p className="mt-5 text-lg leading-8 text-[#24170c]/74">Poly Haven materials, normal maps and controlled sunlight reduced the flat appearance. The silhouette also kept attention on the overall temple form.</p></article>
            <article className="rounded-[28px] bg-[#3d2717] p-8 text-[#f4e8c8] md:col-span-12 md:p-10"><h4 className="text-3xl font-semibold">Technical learning</h4><p className="mt-5 max-w-5xl text-lg leading-8 !text-[#24170c]/72">Diagnosing the broken diffusion shaders, replacing unsuitable vegetation and revising the summit showed the value of testing assets inside the target render pipeline before committing to a final composition.</p></article>
          </div>
        </div>
      </section>
    </CaseStudyShell>
  );
}
