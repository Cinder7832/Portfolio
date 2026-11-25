import { useRef } from "react";
import CaseStudyShell from "./CaseStudyShell";
import { CaseStudyShowcaseImage, CaseStudyShowcaseRail } from "./CaseStudyMedia";
import { caseStudyDefinitions } from "./definitions";
import { usePrefersReducedMotion } from "../motion";
import { projectSummary } from "./projectSummary";

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
  const tagline = projectSummary("aztec-temple", "I created this Unity HDRP environment using documented Mesoamerican temples to guide the architecture, landscape, and atmosphere.");

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
          <p className="mt-8 max-w-4xl text-lg leading-8 text-[#f4e8c8]/78">{tagline}</p>
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
          <div key={file} className="w-[86vw] shrink-0 snap-center md:w-[62vw] lg:w-[48rem]">
            <CaseStudyShowcaseImage src={aztecImage(file)} alt={alt} title={alt} />
          </div>
        ))}
      </CaseStudyShowcaseRail>

      <section id="overview" data-case-study-chapter className="scroll-mt-16 bg-[#17120b] py-32 md:py-44">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Heading intro="This study covers my complete Aztec Temple project. The earlier Unity exercises shown in the source deck were separate course work, so I have not presented them as part of this environment.">Overview</Heading>
          <div className="mt-16 grid grid-flow-dense gap-y-0 border-y border-white/70 md:grid-cols-12 [&>article]:rounded-none [&>article]:border-b [&>article]:border-white/70 [&>article]:bg-transparent [&>article]:px-0 [&>article]:py-10 [&>article]:text-[#f4e8c8] [&>article]:shadow-none [&>article_p]:!text-[#f4e8c8]/68">
            <article className="rounded-[28px] bg-[#f0dfb9] p-8 text-[#24170c] md:col-span-7 md:border-r md:border-white/70 md:!pr-12 md:p-11"><h4 className="text-3xl font-semibold tracking-[-0.035em]">Environment goal</h4><p className="mt-6 max-w-2xl text-lg leading-8 text-[#24170c]/72">I placed a stepped temple inside a dense landscape so the structure feels connected to the wider environment. Mountains, fog, water, vegetation, and warm sunlight frame the temple, while a visible route guides the player toward it.</p></article>
            <article className="rounded-[28px] bg-[#6d3d20] p-8 md:col-span-5 md:!pl-12 md:p-10"><h4 className="text-3xl font-semibold tracking-[-0.035em]">Responsibility</h4><p className="mt-6 text-lg leading-8 text-[#f4e8c8]/72">I researched the setting, shaped the terrain, built the temple from Unity cubes, configured HDRP, integrated sourced assets, repaired shaders, adjusted materials and tested navigation.</p></article>
            <article className="rounded-[28px] bg-[#2b2117] p-8 md:col-span-5 md:border-r md:border-white/70 md:!pr-12"><h4 className="text-2xl font-semibold">Technical setup</h4><p className="mt-4 leading-8 text-[#f4e8c8]/66">I built the environment in Unity with the High Definition Render Pipeline and Terrain Tools, then used Unity Version Control and Unity Cloud to manage the project.</p></article>
            <article className="rounded-[28px] bg-[#322518] p-8 md:col-span-7 md:!pl-12"><h4 className="text-2xl font-semibold">Delivered outcome</h4><p className="mt-4 leading-8 text-[#f4e8c8]/66">I completed a navigable environment with a working first or third person controller, collision on selected trees and rocks, a readable path, and several points of interest along the route.</p></article>
          </div>
        </div>
      </section>

      <section id="research" data-case-study-chapter className="scroll-mt-16 bg-[#ead9b6] py-32 text-[#24170c] md:py-44">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Heading onLight intro="I connected research into Unity terrain features, Mesoamerican architecture, specific historic sites, and game environments to the decisions I made in the final scene.">Research</Heading>
          <div className="mt-16 grid grid-flow-dense gap-y-0 border-t border-black/70 md:grid-cols-12 [&>article]:rounded-none [&>article]:border-b [&>article]:border-black/70 [&>article]:bg-transparent [&>article]:px-0 [&>article]:py-10 [&>article]:text-[#24170c]">
            <article className="rounded-[28px] bg-[#fff8e8] p-8 md:col-span-7 md:border-r md:border-black/70 md:!pr-12 md:p-10"><h4 className="text-3xl font-semibold">Mesoamerican temple form</h4><p className="mt-5 text-lg leading-8 text-[#24170c]/70">My research identified square bases, stepped faces, central stairways, and flat summit temples as recurring features. I used a square plan with stairs on all four sides so the structure reflects the ceremonial access shown in those references.</p></article>
            <article className="rounded-[28px] bg-[#d7a867] p-8 md:col-span-5 md:!pl-12 md:p-10"><h4 className="text-3xl font-semibold">Ziggurat comparison</h4><p className="mt-5 text-lg leading-8 text-[#24170c]/74">The flat top, summit structure, and stepped profile matched the documented ziggurat comparison more closely than a smooth sided Egyptian pyramid. This helped me decide which large shapes the temple needed.</p></article>
            <article className="rounded-[28px] bg-[#c88745] p-8 md:col-span-4 md:border-r md:border-black/70 md:!pr-8"><h4 className="text-2xl font-semibold">Cholula</h4><p className="mt-4 leading-8 text-[#24170c]/72">I used the Great Pyramid of Cholula as a reference for a broad monumental footprint. The source records a base of about 300 by 315 metres and a height of 25 metres, which showed how wide the structure could feel compared with its height.</p></article>
            <article className="rounded-[28px] bg-[#f6ead0] p-8 md:col-span-4 md:border-r md:border-black/70 md:!px-8"><h4 className="text-2xl font-semibold">Santa Cecilia Acatitlan</h4><p className="mt-4 leading-8 text-[#24170c]/72">The source translates its Nahuatl name as “place among the reeds.” I connected that detail with the water and wetland imagery around the temple instead of treating the landscape as unrelated decoration.</p></article>
            <article className="rounded-[28px] bg-[#b67739] p-8 md:col-span-4 md:!pl-8"><h4 className="text-2xl font-semibold">El Tepozteco</h4><p className="mt-4 leading-8 text-[#24170c]/74">The documented summit rooms and ritual offerings guided the interior opening at the top of the temple. I used pottery, skulls, and other set dressing to suggest how that space might have been used.</p></article>
            <article className="rounded-[28px] bg-[#3d2717] p-8 text-[#f4e8c8] md:col-span-7 md:border-r md:border-black/70 md:!pr-12 md:p-10"><h4 className="text-3xl font-semibold">Terrain Tools</h4><p className="mt-5 text-lg leading-8 !text-[#24170c]/72">I researched sculpting, height painting, blended terrain textures, tree and detail placement, and stitching neighbouring terrain tiles. For this environment, the stamp and noise brushes became my main tools for shaping the mountains and surrounding ground.</p></article>
            <article className="rounded-[28px] bg-[#5b3820] p-8 text-[#f4e8c8] md:col-span-5 md:!pl-12 md:p-10"><h4 className="text-3xl font-semibold">Game references</h4><p className="mt-5 text-lg leading-8 !text-[#24170c]/72">I looked at Shadow of the Tomb Raider for its dense jungle, silhouette lighting, and guided paths. Temple Run gave me another example of how a clear route can lead the player through a temple environment.</p></article>
          </div>
          <figure className="mt-4 overflow-hidden rounded-[32px] bg-[#3d2717] shadow-[0_24px_54px_rgba(55,32,14,0.2)]"><img src={aztecImage("temple-silhouette.png")} alt="Temple silhouette used to assess the final composition and lighting" className="aspect-[21/9] w-full object-cover" /></figure>
        </div>
      </section>

      <section id="experience" data-case-study-chapter className="scroll-mt-16 bg-[#6a3c20] py-32 md:py-44">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Heading intro="I kept the interaction focused on exploration. The route, collision, and points of interest support movement through the environment without adding a separate combat or puzzle system that would distract from the level design.">Project Details</Heading>
          <div className="mt-16 grid grid-flow-dense gap-4 md:grid-cols-12 [&>article]:min-h-[24rem] [&>article]:flex [&>article]:flex-col [&>article]:justify-end [&>article]:rounded-[42%_42%_28px_28px]">
            <article className="min-h-72 rounded-[28px] bg-[#24170c] p-8 md:col-span-7 md:p-10"><h4 className="text-3xl font-semibold">Guided route</h4><p className="mt-5 max-w-2xl text-lg leading-8 text-[#f4e8c8]/68">I used a painted mud path to give the player a clear approach through the landscape. The terrain height, fog, and vegetation frame the temple so it remains visible as the main destination while the player moves closer.</p></article>
            <article className="min-h-72 rounded-[28px] bg-[#d7a867] p-8 text-[#24170c] md:col-span-5 md:p-10"><h4 className="text-3xl font-semibold">Player controller</h4><p className="mt-5 text-lg leading-8 text-[#24170c]/72">I tested the final environment with a working first or third person controller. I also added colliders to selected trees and rocks so the player cannot move through the major objects that define the route.</p></article>
            <article className="rounded-[28px] bg-[#4b2917] p-8 md:col-span-12 md:p-10"><h4 className="text-3xl font-semibold">Points of interest</h4><p className="mt-5 max-w-5xl text-lg leading-8 text-[#f4e8c8]/68">I used the temple silhouette, water edge, bridge, summit opening, pottery, skulls, rocks, and dense vegetation to create smaller destinations along the route. These details give the player reasons to look beyond the path and inspect the environment more closely.</p></article>
          </div>
        </div>
      </section>

      <section id="process" data-case-study-chapter className="scroll-mt-16 bg-[#17120b] py-32 md:py-44">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Heading intro="My recorded process begins with the renderer choice and terrain composition, then follows the project through construction, atmosphere, vegetation, detail work, and final navigation checks.">Process</Heading>
          <div className="mt-20 grid gap-y-0 border-b border-[#d7a867]/30 md:grid-cols-2 [&>article]:rounded-none [&>article]:border-t [&>article]:border-[#d7a867]/30 [&>article]:bg-transparent [&>article]:px-0 [&>article]:py-10">
            {[
              ["Renderer and atmosphere", "My first URP setup did not provide the lighting features I wanted for the scene. I moved the project to HDRP, enabled volumetric clouds and water, raised the fog volume, and adjusted the sunlight toward a warmer colour."],
              ["Terrain composition", "Terrain Tools gave me additional brushes for shaping the landscape. I used stamp and noise brushes to build the mountains around the temple, while elevated fog helped separate the landmark from the surrounding terrain."],
              ["Temple construction", "I formed the square base, four central stairways, flat summit, and brick side railings from Unity cube objects. Moving the sun above the mountain strengthened the silhouette I had established in the moodboard."],
              ["Water and route", "I added water and clouds to develop the atmosphere, then used a mud texture to create the approach path. The wetland research gave me a reason to place water near the temple rather than adding it only for visual variety."],
              ["Vegetation repair", "The first grass appeared purple, so I replaced it with grass from Book of the Dead. I repaired the earlier tree shaders as well, but later changed to the Book of the Dead trees because they created a more consistent dense jungle."],
              ["Rock and surface pass", "I used Terrain Sample rocks as smaller landmarks around the route and applied a rock texture across the mountains. I also adjusted the colour temperature of the trees so they sat more naturally inside the warm lighting."],
              ["Summit revision", "My early summit room contained pottery and skulls, but the larger structure disrupted the exterior shape of the temple. I restored the simpler summit and cut an opening into it so the ritual set dressing could remain inside without weakening the silhouette."],
              ["Navigation check", "In the final pass, I tested the first or third person controller and added collision to selected trees and rocks. I judged the route mainly by whether the path remained readable and the temple continued to work as the main landmark."],
            ].map(([title, body], index) => <article key={title} className={`rounded-[28px] bg-[#241b13] p-8 md:p-10 ${index === 0 || index === 5 ? "md:col-span-2" : ""} ${[1, 3, 6].includes(index) ? "md:border-r md:border-[#d7a867]/30 md:!pr-12" : ""} ${[2, 4, 7].includes(index) ? "md:!pl-12" : ""}`}><h4 className="text-3xl font-semibold tracking-[-0.035em] text-[#d7a867]">{title}</h4><p className="mt-5 text-lg leading-8 text-[#f4e8c8]/68">{body}</p></article>)}
          </div>
          <div className="mt-16 grid grid-flow-dense gap-4 md:grid-cols-12">
            <article id="aztec-temple-renderer" className="rounded-[28px] bg-[#24170c] p-8 md:col-span-5 md:p-10"><h4 className="text-3xl font-semibold">Renderer decision</h4><p className="mt-5 text-lg leading-8 text-[#f4e8c8]/68">I chose HDRP because it provided the water, volumetric clouds, fog controls, global illumination, and screen space reflections needed for the visual direction.</p></article>
            <article id="aztec-temple-materials" className="rounded-[28px] bg-[#754322] p-8 md:col-span-7 md:p-10"><h4 className="text-3xl font-semibold">Material repair</h4><p className="mt-5 text-lg leading-8 text-[#f4e8c8]/70">I corrected diffusion shader problems that were making the vegetation appear pink. I also used Poly Haven materials and normal maps to add surface depth to the cube based temple.</p></article>
            <article className="rounded-[28px] bg-[#382719] p-8 md:col-span-12 md:p-10"><h4 className="text-3xl font-semibold">Performance check</h4><p className="mt-5 text-lg leading-8 text-[#f4e8c8]/68">During the summit detail pass, I experimented with level of detail assets so distant objects could use simpler geometry and reduce the amount of detail being rendered.</p></article>
          </div>
        </div>
      </section>

      <section id="extras" data-case-study-chapter className="scroll-mt-16 bg-[#2b2117] py-32 md:py-44">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Heading intro="The sourced assets below supported the environment while the layout, composition, and documented project scope remained my own work.">Extras</Heading>
          <div className="mt-16">
            <article id="aztec-temple-assets" className="rounded-[28px] bg-[#ead9b6] p-8 text-[#24170c] md:p-10"><h4 className="text-3xl font-semibold">Asset sources</h4><p className="mt-5 max-w-4xl text-lg leading-8 text-[#24170c]/72">I used Book of the Dead and Terrain Sample assets from Unity Technologies for parts of the landscape. The bridge, pots, skull, and bones came from Sketchfab, while Poly Haven supplied the surface textures used across the environment.</p></article>
          </div>
        </div>
      </section>

      <section id="reflection" data-case-study-chapter className="scroll-mt-16 bg-[#ead9b6] py-32 text-[#24170c] md:py-44">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Heading onLight intro="In this reflection, I explain the limits I found with cube based construction and the practical techniques I used to complete the environment.">Reflection</Heading>
          <div className="mt-16 grid gap-y-0 border-t border-black/70 md:grid-cols-12 [&>article]:rounded-none [&>article]:border-b [&>article]:border-black/70 [&>article]:bg-transparent [&>article]:px-0 [&>article]:py-10 [&>article]:text-[#24170c]">
            <article className="rounded-[28px] bg-[#fff8e8] p-8 md:col-span-7 md:border-r md:border-black/70 md:!pr-12 md:p-10"><h4 className="text-3xl font-semibold">Temple texturing</h4><p className="mt-5 text-lg leading-8 text-[#24170c]/72">Using basic Unity cubes limited the amount of surface detail I could build into the temple. In a future version, I would create the structure in Blender once my modelling skills are strong enough to add that detail without making the scope unmanageable.</p></article>
            <article className="rounded-[28px] bg-[#d7a867] p-8 md:col-span-5 md:!pl-12 md:p-10"><h4 className="text-3xl font-semibold">Practical response</h4><p className="mt-5 text-lg leading-8 text-[#24170c]/74">I reduced the flat appearance with Poly Haven materials, normal maps, and more controlled sunlight. Keeping the temple partly silhouetted also helped the overall form remain more important than the missing surface detail.</p></article>
            <article className="rounded-[28px] bg-[#3d2717] p-8 text-[#f4e8c8] md:col-span-12 md:p-10"><h4 className="text-3xl font-semibold">Technical learning</h4><p className="mt-5 max-w-5xl text-lg leading-8 !text-[#24170c]/72">Diagnosing the broken diffusion shaders, replacing unsuitable vegetation, and revising the summit showed me why assets need to be tested inside the target render pipeline before I commit to the final composition.</p></article>
          </div>
        </div>
      </section>
    </CaseStudyShell>
  );
}
