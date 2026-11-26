import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Github,
  Maximize2,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import type { Artwork, Project } from "./data";
import { artworks, publishedProjects as projects } from "./data";
import DeferredModelViewer from "./DeferredModelViewer";
import { MOTION, usePrefersReducedMotion } from "./motion";
import CaseStudyShell from "./case-studies/CaseStudyShell";
import { caseStudyDefinitions } from "./case-studies/definitions";
import ChangelogAccordion from "./case-studies/ChangelogAccordion";
import { CaseStudyShowcaseImage, CaseStudyShowcaseRail, ExpandedImageViewer } from "./case-studies/CaseStudyMedia";
import { ConstructedProjectView, ForgottenLineProjectView, RavensdownProjectView } from "./case-studies/NewProjectStudies";
import AztecTempleProjectView from "./case-studies/AztecTempleStudy";
import MiroProjectView from "./case-studies/MiroStudy";
import IndependentLevelProjectView from "./case-studies/IndependentLevelProjectStudy";
import ErodedSandsProjectView from "./case-studies/ErodedSandsStudy";
import HorizonProjectView from "./case-studies/HorizonStudy";
import ReboundProjectView from "./case-studies/ReboundStudy";
import ProjectCover from "./ProjectCover";
import { projectSummary } from "./case-studies/projectSummary";

gsap.registerPlugin(ScrollTrigger);

const OVERLAY_MOTION = {
  fade: 0.28,
  ease: "power2.inOut",
} as const;

type CatalogOverlayType = "all-projects" | "all-artwork";

export type OverlayState =
  | { type: "all-projects" }
  | { type: "project"; project: Project; navigationDirection?: -1 | 1; origin?: "all-projects" }
  | { type: "all-artwork" }
  | { type: "artwork"; artwork: Artwork; navigationDirection?: -1 | 1; origin?: "all-artwork" };

const imageFor = (seed: string, width = 1920, height = 1080) =>
  `https://picsum.photos/seed/${seed}/${width}/${height}`;

const projectImageFor = (project: Project, width = 1920, height = 1080) => {
  if (!project.imageUrl) return null;
  if (/^https?:\/\//.test(project.imageUrl)) return project.imageUrl;
  return `${import.meta.env.BASE_URL}${project.imageUrl.replace(/^\/+/, "")}`;
};

const cuboImage = (name: string) => `${import.meta.env.BASE_URL}projects/cubo/${name}`;
const everdewImage = (name: string) => `${import.meta.env.BASE_URL}projects/everdew/${name}`;

const artworkImageFor = (artwork: Artwork, width = 900, height = 1200) => {
  if (!artwork.imageUrl) {
    return imageFor(artwork.imageSeed, width, height);
  }
  if (/^https?:\/\//.test(artwork.imageUrl)) {
    return artwork.imageUrl;
  }
  return `${import.meta.env.BASE_URL}${artwork.imageUrl.replace(/^\/+/, "")}`;
};

const artworkCardImageFor = (artwork: Artwork, width = 900, height = 1200) => {
  const cardAssetPrefix = ["artwork/sketches/", "artwork/mobile-devices/"].find((prefix) =>
    artwork.imageUrl?.startsWith(prefix),
  );

  if (artwork.imageUrl && cardAssetPrefix) {
    const cardPath = artwork.imageUrl.replace(cardAssetPrefix, `${cardAssetPrefix}cards/`);
    return `${import.meta.env.BASE_URL}${cardPath}`;
  }

  return artworkImageFor(artwork, width, height);
};

const artworkAspectClass = (artwork: Artwork) => ({
  landscape: "aspect-[4/3]",
  portrait: "aspect-[3/4]",
  square: "aspect-square",
  tall: "aspect-[3/5]",
})[artwork.aspect];

const overlayKey = (state: OverlayState) => {
  if (state.type === "project") return `project:${state.project.id}`;
  if (state.type === "artwork") return `artwork:${state.artwork.id}`;
  return state.type;
};

const isDetailState = (state: OverlayState): state is Extract<OverlayState, { type: "project" | "artwork" }> =>
  state.type === "project" || state.type === "artwork";

const focusableSelector =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function OverlayHost({
  state,
  onChange,
}: {
  state: OverlayState | null;
  onChange: (state: OverlayState | null) => void;
}) {
  const [rendered, setRendered] = useState<OverlayState | null>(state);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const copyRef = useRef<HTMLDivElement | null>(null);
  const wasOpen = useRef(Boolean(state));
  const lastFocused = useRef<HTMLElement | null>(null);
  const catalogReturnFocus = useRef<HTMLElement | null>(null);
  const skipCatalogEntrance = useRef(false);
  const reducedMotion = usePrefersReducedMotion();

  const navigateProject = (offset: -1 | 1) => {
    const current = state?.type === "project" ? state.project : rendered?.type === "project" ? rendered.project : null;
    if (!current) return;
    const index = projects.findIndex((project) => project.id === current.id);
    onChange({
      type: "project",
      project: projects[(index + offset + projects.length) % projects.length],
      navigationDirection: offset,
      origin: state?.type === "project" ? state.origin : rendered?.type === "project" ? rendered.origin : undefined,
    });
  };

  const closeCurrentView = () => {
    const current = state ?? rendered;
    if (current?.type === "project" && current.origin) {
      onChange({ type: current.origin });
      return;
    }
    if (current?.type === "artwork" && current.origin) {
      onChange({ type: current.origin });
      return;
    }
    onChange(null);
  };

  useLayoutEffect(() => {
    const root = rootRef.current;
    const panel = panelRef.current;

    if (state && !rendered) {
      setRendered(state);
      return;
    }

    if (!state && rendered) {
      if (reducedMotion || !root || !panel) {
        setRendered(null);
        return;
      }

      const timeline = gsap.timeline({
        defaults: { overwrite: true },
        onComplete: () => setRendered(null),
      });
      timeline.to([panel, root].filter(Boolean), { opacity: 0, duration: OVERLAY_MOTION.fade, ease: OVERLAY_MOTION.ease }, 0);
      return () => {
        timeline.kill();
      };
    }

    if (state && rendered && overlayKey(state) !== overlayKey(rendered)) {
      const openingFromCatalog =
        isDetailState(state) && Boolean(state.origin) && rendered.type === state.origin;
      const returningToCatalog =
        isDetailState(rendered) && Boolean(rendered.origin) && state.type === rendered.origin;

      if (openingFromCatalog) {
        catalogReturnFocus.current = document.activeElement as HTMLElement;
        setRendered(state);
        return;
      }

      if (reducedMotion || !panel) {
        if (returningToCatalog) skipCatalogEntrance.current = true;
        setRendered(state);
        return;
      }

      const timeline = gsap.timeline({
        defaults: { overwrite: true },
        onComplete: () => {
          if (returningToCatalog) {
            skipCatalogEntrance.current = true;
          }
          setRendered(state);
          if (returningToCatalog) {
            window.requestAnimationFrame(() => catalogReturnFocus.current?.focus({ preventScroll: true }));
          }
        },
      });

      timeline.to(panel, { opacity: 0, duration: OVERLAY_MOTION.fade, ease: OVERLAY_MOTION.ease });

      return () => {
        timeline.kill();
      };
    }
  }, [reducedMotion, rendered, state]);

  useLayoutEffect(() => {
    if (!rendered) {
      wasOpen.current = false;
      return;
    }

    const root = rootRef.current;
    const panel = panelRef.current;
    const content = contentRef.current;
    if (!root || !panel || !content) return;

    if (skipCatalogEntrance.current && (rendered.type === "all-projects" || rendered.type === "all-artwork")) {
      skipCatalogEntrance.current = false;
      gsap.set([panel, content], { clearProps: "transform,opacity" });
      panel.focus({ preventScroll: true });
      return;
    }

    if (reducedMotion) {
      if (!wasOpen.current) {
        lastFocused.current = document.activeElement as HTMLElement;
      }
      gsap.set([root, panel, content].filter(Boolean), { clearProps: "all" });
      panel.focus({ preventScroll: true });
      wasOpen.current = true;
      return;
    }

    if (!wasOpen.current) {
      lastFocused.current = document.activeElement as HTMLElement;
      gsap.set([root, panel], { opacity: 0 });
      const timeline = gsap.timeline({ defaults: { ease: OVERLAY_MOTION.ease } });
      timeline
        .to(root, { opacity: 1, duration: OVERLAY_MOTION.fade, clearProps: "opacity" }, 0)
        .to(panel, { opacity: 1, duration: OVERLAY_MOTION.fade, clearProps: "opacity" }, 0);
      panel.focus({ preventScroll: true });
      wasOpen.current = true;
      return () => {
        timeline.kill();
      };
    }

    const timeline = gsap.fromTo(
      panel,
      { opacity: 0 },
      { opacity: 1, duration: OVERLAY_MOTION.fade, ease: OVERLAY_MOTION.ease, clearProps: "opacity" },
    );
    panel.focus({ preventScroll: true });
    return () => {
      timeline.kill();
    };
  }, [reducedMotion, rendered]);

  const isMounted = Boolean(rendered);

  useEffect(() => {
    if (!rendered || !isDetailState(rendered)) return;

    const urls: string[] = [];
    if (rendered.type === "project") {
      const index = projects.findIndex((project) => project.id === rendered.project.id);
      [-1, 1].forEach((offset) => {
        const project = projects[(index + offset + projects.length) % projects.length];
        const projectImage = projectImageFor(project);
        if (projectImage) urls.push(projectImage);
      });
    } else {
      const index = artworks.findIndex((artwork) => artwork.id === rendered.artwork.id);
      [-1, 1].forEach((offset) => {
        const artwork = artworks[(index + offset + artworks.length) % artworks.length];
        if (artwork.kind === "2D") urls.push(artworkImageFor(artwork, 1400, 1800));
      });
    }

    urls.forEach((url) => {
      const image = new Image();
      image.src = url;
      void image.decode?.().catch(() => undefined);
    });
  }, [rendered]);

  useEffect(() => {
    if (!isMounted) return;

    const scrollY = window.scrollY;
    const previousBodyPosition = document.body.style.position;
    const previousBodyTop = document.body.style.top;
    const previousBodyLeft = document.body.style.left;
    const previousBodyRight = document.body.style.right;
    const previousBodyWidth = document.body.style.width;

    document.documentElement.classList.add("overlay-open");
    document.body.classList.add("overlay-open");
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";

    return () => {
      document.documentElement.classList.remove("overlay-open");
      document.body.classList.remove("overlay-open");
      document.body.style.position = previousBodyPosition;
      document.body.style.top = previousBodyTop;
      document.body.style.left = previousBodyLeft;
      document.body.style.right = previousBodyRight;
      document.body.style.width = previousBodyWidth;
      window.scrollTo(0, scrollY);
      lastFocused.current?.focus({ preventScroll: true });
    };
  }, [isMounted]);

  useEffect(() => {
    if (!rendered) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeCurrentView();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(focusableSelector));
      if (!focusable.length) {
        event.preventDefault();
        panelRef.current.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onChange, rendered, state]);

  if (!rendered) return null;

  const catalog = rendered.type === "all-projects" || rendered.type === "all-artwork";
  const detail = isDetailState(rendered);
  const backgroundCatalog: CatalogOverlayType | null = catalog ? rendered.type : rendered.origin ?? null;
  const stackedDetail = detail && Boolean(rendered.origin);
  const returningToCatalog =
    (rendered.type === "project" && rendered.origin === "all-projects" && state?.type === "all-projects") ||
    (rendered.type === "artwork" && rendered.origin === "all-artwork" && state?.type === "all-artwork");
  const catalogPanelClass = `flex h-[88vh] w-full flex-col overflow-hidden rounded-[18px] bg-chalk shadow-[0_28px_80px_rgba(29,29,31,0.28)] outline-none dark:bg-[#191a1f] dark:shadow-[0_34px_110px_rgba(0,0,0,0.72),0_0_48px_rgba(255,255,255,0.06)] ${
    backgroundCatalog === "all-projects" ? "max-w-6xl md:h-[46rem]" : "max-w-7xl"
  }`;
  const detailPanelSizeClass = rendered.type === "project"
    ? "aspect-video w-[min(94vw,96rem,calc((100dvh-3rem)*16/9))]"
    : "h-[min(46rem,86dvh)] w-full max-w-5xl";
  const detailPanelClass = `${detailPanelSizeClass} overflow-hidden rounded-[18px] bg-chalk shadow-[0_28px_80px_rgba(29,29,31,0.28)] outline-none dark:bg-[#191a1f] dark:shadow-[0_34px_110px_rgba(0,0,0,0.72),0_0_48px_rgba(255,255,255,0.06)]`;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-50 grid place-items-center bg-ink/72 px-4 py-6 backdrop-blur-md dark:bg-black/82"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeCurrentView();
      }}
    >
      {backgroundCatalog && (
        <section
          ref={catalog ? panelRef : undefined}
          className={`${catalogPanelClass} col-start-1 row-start-1 transition-[filter] duration-300 ${stackedDetail ? "pointer-events-none" : ""} ${stackedDetail && !returningToCatalog ? "blur-md" : ""}`}
          role={catalog ? "dialog" : undefined}
          aria-modal={catalog ? "true" : undefined}
          aria-hidden={stackedDetail ? "true" : undefined}
          aria-label={catalog ? overlayLabel(rendered) : undefined}
          inert={stackedDetail ? true : undefined}
          tabIndex={catalog ? -1 : undefined}
        >
          <div ref={catalog ? contentRef : undefined} className="flex min-h-0 flex-1 flex-col">
            {backgroundCatalog === "all-projects" ? <AllProjectsView onChange={onChange} /> : <AllArtworkView onChange={onChange} />}
          </div>
        </section>
      )}
      {detail && (
        <section
          ref={panelRef}
          className={`${detailPanelClass} relative z-10 col-start-1 row-start-1`}
          role="dialog"
          aria-modal="true"
          aria-label={overlayLabel(rendered)}
          tabIndex={-1}
        >
          <div ref={contentRef} className="h-full">
            {rendered.type === "project" ? (
              <ProjectView project={rendered.project} mediaRef={mediaRef} copyRef={copyRef} onNavigate={navigateProject} onClose={closeCurrentView} />
            ) : (
              <ArtworkView artwork={rendered.artwork} mediaRef={mediaRef} copyRef={copyRef} onClose={closeCurrentView} />
            )}
          </div>
        </section>
      )}
    </div>
  );
}

function overlayLabel(state: OverlayState) {
  if (state.type === "project") return `${state.project.title} project details`;
  if (state.type === "artwork") return `${state.artwork.title} creative work details`;
  return state.type === "all-projects" ? "All projects" : "All creative work";
}

function CloseButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      className="icon-button-motion grid size-11 shrink-0 place-items-center rounded-full bg-[#d2d2d7]/70 text-ink hover:bg-[#d2d2d7] dark:bg-[#2a2b32] dark:text-white dark:hover:bg-[#343640]"
      aria-label={label}
      onClick={onClick}
    >
      <X size={20} />
    </button>
  );
}

function BackButton({ onClick, label, light = false }: { onClick: () => void; label: string; light?: boolean }) {
  return (
    <button
      type="button"
      className={`icon-button-motion grid size-11 shrink-0 place-items-center rounded-full text-ink ${light ? "bg-white hover:bg-white/85" : "bg-[#d2d2d7]/70 hover:bg-[#d2d2d7] dark:bg-[#2a2b32] dark:text-white dark:hover:bg-[#343640]"}`}
      aria-label={label}
      onClick={onClick}
    >
      <ChevronLeft size={20} />
    </button>
  );
}

function ProjectView({
  project,
  mediaRef,
  copyRef,
  onNavigate,
  onClose,
}: {
  project: Project;
  mediaRef: React.RefObject<HTMLDivElement | null>;
  copyRef: React.RefObject<HTMLDivElement | null>;
  onNavigate: (offset: -1 | 1) => void;
  onClose: () => void;
}) {
  if (project.id === "cubo") {
    return <CuboProjectView onNavigate={onNavigate} onClose={onClose} />;
  }

  if (project.id === "everdew") {
    return <EverdewProjectView onNavigate={onNavigate} onClose={onClose} />;
  }

  if (project.id === "rebound") {
    return <ReboundProjectView onClose={onClose} />;
  }

  if (project.id === "ravensdown") {
    return <RavensdownProjectView onClose={onClose} />;
  }

  if (project.id === "forgotten-line") {
    return <ForgottenLineProjectView onClose={onClose} />;
  }

  if (project.id === "constructed") {
    return <ConstructedProjectView onClose={onClose} />;
  }

  if (project.id === "aztec-temple") {
    return <AztecTempleProjectView onClose={onClose} />;
  }

  if (project.id === "miro") {
    return <MiroProjectView onClose={onClose} />;
  }

  if (project.id === "independent-level-project") {
    return <IndependentLevelProjectView onClose={onClose} />;
  }

  if (project.id === "eroded-sands") {
    return <ErodedSandsProjectView onClose={onClose} />;
  }

  if (project.id === "horizon") {
    return <HorizonProjectView onClose={onClose} />;
  }

  return (
    <div className="detail-scrollbar relative h-full touch-pan-y overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch] lg:overflow-hidden">
      <div className="absolute right-4 top-4 z-30 md:right-6 md:top-6">
        <BackButton label="Back to projects" onClick={onClose} />
      </div>
      <div className="grid min-h-full lg:h-full lg:min-h-0 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-[20rem] overflow-hidden bg-[var(--model-viewer-bg)] lg:min-h-0">
          <div ref={mediaRef} className="absolute inset-0">
            <ProjectCover project={project} className="h-full min-h-[20rem] w-full object-cover" />
          </div>
        </div>
        <div ref={copyRef} className="detail-scrollbar p-6 pr-20 md:p-10 md:pr-24 lg:h-full lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain lg:[scrollbar-gutter:stable]">
          <h2 className="mb-8 text-4xl font-semibold leading-[1.08] tracking-[-0.01em] md:text-6xl">{project.title}</h2>
          <p className="text-[17px] leading-[1.47] text-ink/75 dark:text-white/80">{project.description}</p>
          <div className="mt-10 grid gap-3">
            {project.highlights.map((highlight) => <p key={highlight} className="rounded-[18px] bg-white/75 p-4 text-sm leading-6 text-ink/75 dark:bg-[#24252b] dark:text-white/80">{highlight}</p>)}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-ink px-[22px] py-[11px] text-[17px] font-medium text-white transition-[background-color,box-shadow,transform] duration-300 hover:bg-black active:scale-95 dark:bg-white dark:text-ink"><Github size={17} />Repository</a>}
            {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 rounded-full px-[22px] py-[11px] text-[17px] font-medium transition-[background-color,box-shadow,transform] duration-300 hover:bg-white/70 active:scale-95 dark:text-white dark:hover:bg-white/10">Live site<ArrowUpRight size={17} /></a>}
          </div>
        </div>
      </div>
    </div>
  );
}

function ArtworkView({
  artwork,
  mediaRef,
  copyRef,
  onClose,
}: {
  artwork: Artwork;
  mediaRef: React.RefObject<HTMLDivElement | null>;
  copyRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const artworkImage = artwork.kind === "2D" ? artworkImageFor(artwork, 1800, 2400) : null;

  return (
    <div className="detail-scrollbar relative h-full touch-pan-y overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch] lg:overflow-hidden">
      <div className="absolute right-4 top-4 z-30 md:right-6 md:top-6">
        <BackButton label="Back to creative work" onClick={onClose} />
      </div>
      <div className="grid min-h-full lg:h-full lg:min-h-0 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="relative grid min-h-[22rem] place-items-stretch overflow-hidden bg-[var(--model-viewer-bg)] md:min-h-[34rem] lg:min-h-0">
          <div ref={mediaRef} className="absolute inset-0">
            {artwork.kind === "3D" ? (
              <DeferredModelViewer artwork={artwork} />
            ) : (
              <>
                <img
                  src={artworkImage ?? undefined}
                  alt=""
                  className="h-full min-h-[22rem] w-full object-cover"
                />
                <button
                  type="button"
                  className="icon-button-motion absolute left-4 top-4 z-10 grid size-11 place-items-center rounded-full bg-white text-ink shadow-[0_18px_44px_rgba(0,0,0,0.28)] hover:bg-[#f5f5f7] dark:bg-[#24252b] dark:text-white dark:shadow-[0_18px_44px_rgba(0,0,0,0.48)] dark:hover:bg-[#303139] md:bottom-4 md:left-auto md:right-4 md:top-auto md:size-12"
                  aria-label={`Maximise ${artwork.title}`}
                  onClick={() => setExpanded(true)}
                >
                  <Maximize2 size={18} />
                </button>
              </>
            )}
          </div>
        </div>
        <div ref={copyRef} className="detail-scrollbar p-6 pr-20 md:p-10 md:pr-24 lg:h-full lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain lg:[scrollbar-gutter:stable]">
          <h2 className="text-4xl font-semibold leading-[1.08] tracking-[-0.01em] md:text-6xl">{artwork.title}</h2>
          <p className="mt-4 text-sm font-medium text-muted dark:text-white/60">{artwork.kind} · {artwork.medium} · {artwork.year}</p>
          <p className="mt-8 text-[17px] leading-[1.47] text-ink/75 dark:text-white/80">{artwork.description}</p>
          <div className="mt-10 flex flex-wrap gap-2">{artwork.tags.map((tag) => <span key={tag} className="rounded-full bg-white/75 px-4 py-2 text-sm font-medium text-ink/70 dark:bg-[#24252b] dark:text-white/75">{tag}</span>)}</div>
        </div>
      </div>
      {artworkImage && (
        <ExpandedImageViewer
          open={expanded}
          src={artworkImage}
          title={artwork.title}
          onClose={() => setExpanded(false)}
        />
      )}
    </div>
  );
}

function AllProjectsView({ onChange }: { onChange: (state: OverlayState | null) => void }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"All" | Project["category"]>("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const filtered = useMemo(() => projects.filter((project) => {
    const text = [project.title, project.category, project.summary, project.description, ...project.stack, ...project.highlights].join(" ").toLowerCase();
    return text.includes(query.trim().toLowerCase()) && (category === "All" || project.category === category);
  }), [category, query]);

  useLayoutEffect(() => {
    if (reducedMotion || !resultsRef.current) return;
    const targets = resultsRef.current.children;
    const tween = gsap.fromTo(targets, { opacity: 0, y: 4 }, { opacity: 1, y: 0, duration: 0.16, stagger: 0.012, ease: MOTION.easeOut, overwrite: true });
    return () => {
      tween.kill();
    };
  }, [filtered, reducedMotion]);

  return (
    <>
      <CatalogHeader title="All projects" count={`${filtered.length} project results`} onClose={() => onChange(null)}>
        <SearchField value={query} onChange={setQuery} placeholder="Search by title, category, or detail" />
        <FilterMenu label={category === "All" ? "Filter" : category} open={filterOpen} setOpen={setFilterOpen} items={["All", "Games", "Tools"]} selected={category} onSelect={(item) => setCategory(item as typeof category)} />
      </CatalogHeader>
      <div className="detail-scrollbar flex-1 overflow-y-auto p-5 pt-3 md:p-8 md:pt-4">
        <div ref={resultsRef} className="grid gap-4 md:grid-cols-2">
          {filtered.map((project) => <button key={project.id} type="button" className="catalog-card group grid overflow-hidden rounded-[18px] bg-canvas text-left shadow-[0_10px_28px_rgba(29,29,31,0.16)] outline-none transition-shadow duration-500 hover:shadow-[0_16px_40px_rgba(29,29,31,0.24)] focus-visible:ring-4 focus-visible:ring-blueFocus/35 dark:bg-[#24252b] sm:h-48 sm:grid-cols-[11rem_1fr]" onClick={() => onChange({ type: "project", project, origin: "all-projects" })}><div className="h-44 overflow-hidden sm:h-full"><ProjectCover project={project} className="catalog-card-image catalog-project-image h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]" /></div><div className="p-5"><h3 className="text-2xl font-semibold">{project.title}</h3><p className="mt-3 text-sm leading-6 text-ink/70 dark:text-white/70">{project.summary}</p></div></button>)}
        </div>
        {!filtered.length && <EmptyResults noun="projects" />}
      </div>
    </>
  );
}

type ArtworkFilter = "All" | Artwork["kind"] | "Photographs" | "Sketches";

const matchesArtworkFilter = (artwork: Artwork, filter: ArtworkFilter) => {
  if (filter === "All") return true;
  if (filter === "2D" || filter === "3D") return artwork.kind === filter;

  const classification = [artwork.medium, ...artwork.tags].join(" ").toLowerCase();
  if (filter === "Photographs") return classification.includes("photograph");
  return classification.includes("sketch") || classification.includes("drawing");
};

function AllArtworkView({ onChange }: { onChange: (state: OverlayState | null) => void }) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<ArtworkFilter>("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const filtered = useMemo(() => artworks.filter((artwork) => {
    const text = [artwork.title, artwork.kind, artwork.medium, artwork.year, artwork.summary, artwork.description, ...artwork.tags].join(" ").toLowerCase();
    return text.includes(query.trim().toLowerCase()) && matchesArtworkFilter(artwork, kind);
  }), [kind, query]);

  useEffect(
    () => () => {
      window.dispatchEvent(new Event("artwork-model-cache-clear"));
    },
    [],
  );

  useLayoutEffect(() => {
    if (reducedMotion || !resultsRef.current) return;
    const tween = gsap.fromTo(resultsRef.current.children, { opacity: 0, y: 4 }, { opacity: 1, y: 0, duration: 0.16, stagger: 0.01, ease: MOTION.easeOut, overwrite: true });
    return () => {
      tween.kill();
    };
  }, [filtered, reducedMotion]);

  return (
    <>
      <CatalogHeader title="All creative work" count={`${filtered.length} creative work results`} onClose={() => onChange(null)}>
        <SearchField value={query} onChange={setQuery} placeholder="Search creative work by title, medium, or tag" />
        <FilterMenu label={kind === "All" ? "Filter" : kind} open={filterOpen} setOpen={setFilterOpen} items={["All", "Photographs", "Sketches", "2D", "3D"]} selected={kind} onSelect={(item) => setKind(item as ArtworkFilter)} />
      </CatalogHeader>
      <div className="detail-scrollbar flex-1 touch-pan-y overflow-y-auto overscroll-contain p-5 pt-3 md:p-8 md:pt-4">
        <div ref={resultsRef} className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
          {filtered.map((artwork) => artwork.kind === "2D" ? <ArtworkCatalogImageTile key={artwork.id} artwork={artwork} /> : <button key={artwork.id} type="button" aria-label={`View ${artwork.title}`} className="catalog-card group mb-4 block w-full break-inside-avoid overflow-hidden rounded-[18px] bg-canvas text-left shadow-[0_10px_28px_rgba(29,29,31,0.16)] outline-none transition-shadow duration-500 hover:shadow-[0_16px_40px_rgba(29,29,31,0.24)] focus-visible:ring-4 focus-visible:ring-blueFocus/35 dark:bg-[#24252b]" onClick={() => onChange({ type: "artwork", artwork, origin: "all-artwork" })}><div className={`overflow-hidden ${artworkAspectClass(artwork)}`}><DeferredModelViewer artwork={artwork} compact keepMounted /></div></button>)}
        </div>
        {!filtered.length && <EmptyResults noun="creative work" />}
      </div>
    </>
  );
}

function CatalogHeader({ title, count, onClose, children }: { title: string; count: string; onClose: () => void; children: React.ReactNode }) {
  return <div className="p-5 pb-4 md:p-8 md:pb-6"><div className="flex items-start justify-between gap-4"><div><h2 className="text-4xl font-semibold leading-[1.08] md:text-6xl">{title}</h2><p className="mt-3 text-sm text-muted dark:text-white/60">{count}</p></div><CloseButton label={`Close ${title.toLowerCase()}`} onClick={onClose} /></div><div className="mt-7 flex flex-col gap-3 md:flex-row">{children}</div></div>;
}

function SearchField({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <label className="flex h-12 min-h-12 w-full min-w-0 flex-none items-center gap-3 rounded-full bg-white/90 px-5 text-ink shadow-[0_6px_18px_rgba(29,29,31,0.18)] dark:bg-[#24252b] dark:text-white md:h-11 md:min-h-11 md:flex-1">
      <Search size={20} className="shrink-0 opacity-50 md:size-[19px]" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-full w-full min-w-0 bg-transparent text-[15px] leading-none outline-none placeholder:text-ink/40 dark:placeholder:text-white/50 md:text-sm"
      />
    </label>
  );
}

function ArtworkCatalogImageTile({ artwork }: { artwork: Artwork }) {
  const [expanded, setExpanded] = useState(false);
  const image = artworkImageFor(artwork, 1800, 2400);
  const cardImage = artworkCardImageFor(artwork, 900, 1200);

  return (
    <div className="catalog-card group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-[18px] bg-canvas text-left shadow-[0_10px_28px_rgba(29,29,31,0.16)] transition-shadow duration-500 hover:shadow-[0_16px_40px_rgba(29,29,31,0.24)] dark:bg-[#24252b]">
      <div className={`overflow-hidden ${artworkAspectClass(artwork)}`}>
        <img src={cardImage} alt={artwork.title} className="catalog-card-image catalog-artwork-image h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]" />
      </div>
      <button
        type="button"
        className="icon-button-motion absolute bottom-4 right-4 z-10 grid size-11 place-items-center rounded-full bg-white text-ink shadow-[0_18px_44px_rgba(0,0,0,0.28)] hover:bg-[#f5f5f7] focus-visible:ring-4 focus-visible:ring-blueFocus/35 dark:bg-[#24252b] dark:text-white dark:shadow-[0_18px_44px_rgba(0,0,0,0.48)] dark:hover:bg-[#303139]"
        aria-label={`Expand ${artwork.title}`}
        onClick={() => setExpanded(true)}
      >
        <Maximize2 size={18} />
      </button>
      <ExpandedImageViewer open={expanded} src={image} title={artwork.title} onClose={() => setExpanded(false)} />
    </div>
  );
}

function ExpandableEvidenceImage({ src, alt, title }: { src: string; alt: string; title: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <div className="relative overflow-hidden">
        <img src={src} alt={alt} className="aspect-[4/3] w-full object-cover" />
        <button
          type="button"
          className="icon-button-motion absolute bottom-4 right-4 z-10 grid size-11 place-items-center rounded-full bg-white text-ink shadow-[0_18px_44px_rgba(0,0,0,0.28)] hover:bg-[#f5f5f7] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/55"
          aria-label={`Expand ${title}`}
          onClick={() => setExpanded(true)}
        >
          <Maximize2 size={18} />
        </button>
      </div>
      <ExpandedImageViewer open={expanded} src={src} title={title} onClose={() => setExpanded(false)} />
    </>
  );
}

const everdewReleases = [
  { version: "0.4.2", date: "5 March 2026", title: "Small Adjustments and Fixes", body: ["- Fixed animals respawning after loading a save", "- Improved top down sprite sorting", "- Restored the survival time for pigs, cows, and sheep without food to five days", "- Restored tooltips for seed buttons"] },
  { version: "0.4.1", date: "16 February 2026", title: "Time & Save Fixes", body: ["- Fixed saved time of day", "- Fixed the day counter advancing at midnight", "- Fixed day and night lighting when loading a save", "- Fixed inconsistent clock speeds", "- Fixed shop stock resetting after loading a save", "- Disabled the fade image raycast during loading", "- Removed some nighttime scene lights"] },
  { version: "0.4.0", date: "4 February 2026", title: "Save & Load Update", body: ["- Added save and load", "- Added options to the main menu", "- Updated interface colours", "- Removed tooltips because of an interface issue"] },
  { version: "0.3.4", date: "19 January 2026", title: "Small additions and fixes", body: ["- Added fullscreen toggle to the pause menu", "- Added resolution dropdown to the pause menu", "- Updated the main-menu-to-game transition"] },
  { version: "0.3.3", date: "11 January 2026", title: "Hotfix 3", body: ["- Changed shop details to display shop stock instead of the shop owner", "- Updated shop detail visuals", "- Fixed the colours of Butter's sell interface"] },
  { version: "0.3.2", date: "11 January 2026", title: "Hotfix 2", body: ["- Fixed perk information display", "- Fixed a typo in Margaine's shop interface"] },
  { version: "0.3.1", date: "11 January 2026", title: "Hotfix 1", body: ["- Removed test items from the inventory"] },
  { version: "0.3.0", date: "11 January 2026", title: "Third release", body: ["- Added volume slider to pause menu", "- Added Drag Fertilising perk", "- Added perk information", "- Fixed a shop collider", "- Added item deselection after inactivity", "- Adjusted fertiliser drops from animals", "- Fixed a shop name", "- Various bug fixes and quality-of-life changes"] },
  { version: "0.2.1", date: "9 January 2026", title: "Hotfix", body: ["- Fixed shop restocking after purchase"] },
  { version: "0.2.0", date: "9 January 2026", title: "Second release", body: ["- Added stock limits and restocking", "- Added new Craig spawn points", "- Added shop names and opening hours", "- Added infected crops, composter, and Golden Fertilizer", "- Added interaction outlines", "- Added back buttons to menus", "- Added lofi toggle to pause menu", "- Added interaction range to barrels", "- Various bug fixes and quality-of-life changes"] },
  { version: "0.1.0", date: "3 January 2026", title: "First release", body: ["- Added the core gameplay loop"] },
];

const everdewSystems = [
  ["Farming", "The player prepares field plots, plants crops, waits through the day cycle, and then harvests the produce to sell. Drag planting, harvesting, and fertilising were added as purchasable perks, allowing players to complete repeated actions without clicking every tile separately."],
  ["Economy", "Our original goal of 10,000 gold was too easy to reach during playtests. We increased the target to 1,000,000 gold, then adjusted crop growth times, prices, shop stock, and the way items restock."],
  ["Animals", "Feeding the animals allows them to produce eggs or fertiliser. If the player leaves them unfed, they eventually become soul sprites that can be sold during the night."],
  ["Perks", "We stored the upgrades as ScriptableObjects so new perks could be added without rewriting the main purchase system. These upgrades include drag farming, animal access, additional field tiles, faster crop growth, and other bonuses."],
  ["Time", "The day and night cycle changes when different NPCs are available. Players can use a statue to skip the night, and testing led us to reduce its cost from 50 gold to 1 so it remained a useful option."],
  ["Interface", "We created interface screens for the shops, inventory, dialogue, tutorials, perks, display settings, audio controls, and main menu so the full loop could be managed consistently."],
];

const everdewInterfaceScreens = [
  ["interface-main-menu.png", "Everdew title screen with Play, Quit, and Options controls", "Main menu"],
  ["interface-load-game.png", "Load game screen showing four save slots and their progress details", "Save slots"],
  ["interface-new-game-confirmation.png", "Confirmation dialog for starting a new game in an empty save slot", "New game confirmation"],
  ["interface-delete-save-confirmation.png", "Confirmation dialog for deleting an existing save slot", "Delete confirmation"],
  ["interface-tutorial-choice.png", "Opening screen offering a choice between the tutorial and skipping it", "Tutorial choice"],
  ["interface-tutorial-guide.png", "Tutorial overlay explaining the village shops over a dimmed game view", "Guided tutorial"],
  ["interface-pause-settings.png", "Pause menu with volume, fullscreen, and resolution controls", "Pause and settings"],
  ["interface-inventory.png", "Inventory overlay showing held seeds and usable items", "Inventory"],
  ["interface-encyclopedia.png", "Animal consumption reference for chickens, cows, sheep, and pigs", "Encyclopedia"],
  ["interface-perks.png", "Perks screen with category tabs and connected farming upgrades", "Perks"],
  ["interface-npc-dialogue.png", "Shop conversation with Margaine and Buy, Close, and Sell actions", "NPC dialogue"],
  ["interface-buy-menu.png", "Buy menu listing seed prices, remaining stock, and restock times", "Buy menu"],
  ["interface-sell-menu.png", "Sell menu showing the player's available produce and Sell All action", "Sell menu"],
] as const;

function EverdewProjectView({
  onNavigate,
  onClose,
}: {
  onNavigate: (offset: -1 | 1) => void;
  onClose: () => void;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const showcaseRef = useRef<HTMLDivElement | null>(null);
  const interfaceRef = useRef<HTMLDivElement | null>(null);
  const [openChangelogVersion, setOpenChangelogVersion] = useState<string | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const tagline = projectSummary("everdew", "Everdew is a top down pixel farming game that four of us created during a three week game jam.");

  const story = "Everdew was created by a four person team for a three week game jam based on the theme A New Path. My role covered the base environment, game design, programming, and interface work. We began with a top down 3D version, but unreliable Blockbench imports led us to change the project to pixel art. We also replaced several large scripts with smaller systems that were easier to manage. The submitted build included a complete farming and economy loop, and we continued developing it after the jam.";

  const scrollShowcase = (direction: -1 | 1) => {
    const showcase = showcaseRef.current;
    if (!showcase) return;
    showcase.scrollBy({
      left: direction * Math.min(showcase.clientWidth * 0.82, 620),
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  const scrollInterface = (direction: -1 | 1) => {
    const interfaceRail = interfaceRef.current;
    if (!interfaceRail) return;
    interfaceRail.scrollBy({
      left: direction * Math.min(interfaceRail.clientWidth * 0.86, 760),
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <CaseStudyShell
      definition={caseStudyDefinitions.everdew}
      scrollRef={rootRef}
      onClose={onClose}
      className="bg-[#11140d] text-[#f5f4e9]"
    >
      <header className="relative min-h-[42rem] overflow-hidden bg-[#11140d] md:min-h-[52rem]">
        <img src={everdewImage("farm-village.png")} alt="Everdew's farm and village" className="absolute inset-0 h-full w-full scale-[1.02] object-cover object-[68%_center]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-black/5" aria-hidden="true" />
        <div className="relative z-10 mx-auto flex min-h-[42rem] max-w-7xl flex-col justify-end px-5 pb-16 pt-28 md:min-h-[52rem] md:px-8 md:pb-24">
          <div>
            <h2 className="max-w-6xl text-[clamp(4rem,13vw,10rem)] font-semibold leading-[0.82] tracking-[-0.07em] text-[#eef6c8]">Everdew</h2>
            <p className="mt-8 max-w-3xl text-lg leading-8 text-white/76">{tagline}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href="https://cinder7832.itch.io/everdew" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#d5f36a] px-6 py-3 font-semibold text-[#11140d] transition-transform hover:scale-[1.03] active:scale-95">Play the game <ArrowUpRight size={18} /></a>
            </div>
          </div>
        </div>
      </header>

        <CaseStudyShowcaseRail background="#1d2612" railRef={showcaseRef} onScroll={scrollShowcase}>
              <div className="w-[min(82vw,43rem)] shrink-0 snap-center overflow-hidden rounded-[22px] bg-black">
                <video className="aspect-[16/10] w-full object-cover" controls preload="metadata" poster={everdewImage("main-menu.png")} aria-label="Everdew gameplay video">
                  <source src={everdewImage("gameplay.mp4")} type="video/mp4" />
                </video>
              </div>
              {[
                ["farm-village.png", "Farm and village"],
                ["farming-ui.png", "Farming interface"],
                ["shop-ui.png", "Shop interface"],
                ["animal-pen.png", "Animal pen"],
                ["perks-ui.png", "Perk interface"],
              ].map(([image, title]) => (
                <figure key={image} className="w-[min(82vw,43rem)] shrink-0 snap-center overflow-hidden rounded-[22px] bg-[#11140d]">
                  <CaseStudyShowcaseImage src={everdewImage(image)} alt={title} title={title} />
                </figure>
              ))}
        </CaseStudyShowcaseRail>

        <section id="overview" data-case-study-chapter className="scroll-mt-16 mx-auto max-w-7xl px-5 py-32 md:px-8 md:py-44">
          <h3 className="text-4xl font-semibold tracking-[-0.04em] md:text-6xl">Overview</h3>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-white/68">
            {story}
          </p>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Tools", "Unity and Aseprite"],
              ["Constraints", "Pixel art or low poly, PEGI 7, playable on web or PC"],
              ["My role", "Environment, game design, programming, and interface design"],
              ["Delivery", "A playable prototype and promotional poster"],
            ].map(([title, copy]) => (
              <article key={title} className="rounded-[24px] bg-[#252c1c] p-6 text-white">
                <h4 className="font-semibold">{title}</h4>
                <p className="mt-3 leading-7 text-white/62">{copy}</p>
              </article>
            ))}
          </div>
          <div className="mt-24 grid gap-10 border-t border-white/12 pt-12 md:grid-cols-2 lg:grid-cols-4">
            <article><h4 className="text-xl font-semibold text-[#d5f36a]">Devanand Asai</h4><p className="mt-3 leading-7 text-white/62">I worked on the base environment, game design, programming, and interface design.</p></article>
            <article><h4 className="text-xl font-semibold">Riley</h4><p className="mt-3 leading-7 text-white/62">Riley worked on programming, player interactions, and the interface systems.</p></article>
            <article><h4 className="text-xl font-semibold">Hiro</h4><p className="mt-3 leading-7 text-white/62">Hiro focused on asset design and producing the environment artwork.</p></article>
            <article><h4 className="text-xl font-semibold">Johan</h4><p className="mt-3 leading-7 text-white/62">Johan created sprites and supported production, documentation, and marketing.</p></article>
          </div>
        </section>

        <section id="research" data-case-study-chapter className="scroll-mt-16 bg-[#17200f] px-5 py-32 text-white md:px-8 md:py-44">
          <div className="mx-auto max-w-7xl">
            <h3 className="max-w-6xl text-5xl font-semibold leading-[0.98] tracking-[-0.055em] md:text-8xl">Research</h3>
            <p className="mt-12 max-w-4xl text-2xl leading-[1.45] text-white/76 md:text-4xl">Before finalising our production approach, we reviewed references for the gameplay and character designs, then considered publishing options that could suit the game.</p>
            <div className="mt-20 grid grid-flow-dense gap-4 md:grid-cols-12">
              <article className="rounded-[26px] bg-[#eef0d9] p-8 text-[#17200f] md:col-span-6"><h4 className="text-2xl font-semibold">Stardew Valley</h4><p className="mt-4 leading-8 text-[#17200f]/68">We used Stardew Valley as a reference for the general farming experience. Its daily structure helped us consider how planting, harvesting, selling, upgrades, and time could form a repeatable gameplay loop.</p></article>
              <article className="rounded-[26px] bg-[#d5f36a] p-8 text-[#11140d] md:col-span-6"><h4 className="text-2xl font-semibold">Tribe Nine</h4><p className="mt-4 leading-8 text-[#11140d]/68">We used Tribe Nine as a reference for the character designs. Its distinctive character shapes and clothing informed our early visual direction before the team adapted the designs to Everdew's pixel art presentation.</p></article>
              <article className="rounded-[26px] bg-[#252c1c] p-8 md:col-span-12"><h4 className="text-2xl font-semibold">Publishing review</h4><p className="mt-4 max-w-3xl leading-8 text-white/62">We reviewed Raw Fury, Team17, Curve Games, and Critical Reflex to see how well their existing catalogues matched Everdew's art direction, farming loop, timed economy, and animal soul system.</p></article>
            </div>
          </div>
        </section>

        <section id="experience" data-case-study-chapter className="scroll-mt-16 bg-[#eef0d9] px-5 py-32 text-[#17200f] md:px-8 md:py-44">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-5xl">
              <h3 className="text-[clamp(3rem,7vw,7rem)] font-semibold leading-[0.95] tracking-[-0.06em]">Project Details</h3>
              <p className="mt-8 max-w-3xl text-lg leading-8 text-[#17200f]/68">The player manages a run down farm across 30 in game days. We connected farming, shops, animals, time, inventory, and perks into one economy where the work completed each day leads to upgrades and greater output later in the run.</p>
            </div>
            <div className="mt-20 grid grid-flow-dense grid-cols-1 gap-4 md:grid-cols-12">
              <article className="relative min-h-[34rem] overflow-hidden rounded-[28px] bg-[#35451d] md:col-span-8"><img src={everdewImage("farming-ui.png")} alt="Farming tools and inventory in Everdew" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/10 to-transparent" /><div className="absolute inset-x-0 bottom-0 p-7 text-white md:p-10"><h4 className="text-3xl font-semibold">Farming</h4><p className="mt-3 max-w-xl leading-7 text-white/72">The selected tool and the current crop state show the player which actions are available on each field tile, helping the farming loop remain readable as the farm grows.</p></div></article>
              <article className="flex min-h-[34rem] flex-col overflow-hidden rounded-[28px] bg-[#17200f] text-white md:col-span-4"><div className="overflow-hidden"><img src={everdewImage("perks-ui.png")} alt="Everdew perks interface" className="aspect-[16/10] w-full object-cover" /></div><div className="flex flex-1 flex-col justify-end p-7"><h4 className="text-3xl font-semibold">Perk system</h4><p className="mt-3 leading-7 text-white/62">We built the perks with ScriptableObjects so we could add new upgrades without changing the main purchase system each time.</p></div></article>
              {everdewSystems.slice(0, 3).map(([title, copy], index) => <article key={title} className={`rounded-[28px] p-7 md:col-span-4 ${index === 1 ? "bg-[#b8d5a5]" : "bg-white"}`}><h4 className="text-2xl font-semibold">{title}</h4><p className="mt-4 leading-7 text-[#17200f]/68">{copy}</p></article>)}
              <article className="overflow-hidden rounded-[28px] bg-[#283518] md:col-span-6"><img src={everdewImage("shop-ui.png")} alt="Everdew shop interface" className="aspect-[16/10] w-full object-cover" /><div className="p-7 text-white"><h4 className="text-2xl font-semibold">Shops and inventory</h4><p className="mt-3 leading-7 text-white/62">Riley and I replaced the original shop and inventory integration with systems that read from the same item data, which stopped information becoming inconsistent between screens.</p></div></article>
              <article className="overflow-hidden rounded-[28px] bg-[#283518] md:col-span-6"><img src={everdewImage("animal-pen.png")} alt="Animals and the nighttime statue in Everdew" className="aspect-[16/10] w-full object-cover" /><div className="p-7 text-white"><h4 className="text-2xl font-semibold">Animals</h4><p className="mt-3 leading-7 text-white/62">Feeding the animals allows them to produce useful items. If the player does not feed them, they become soul sprites that can be collected and sold at night.</p></div></article>
            </div>
          </div>
        </section>

        <section id="everdew-interface" className="bg-[#d5f36a] px-5 py-32 text-[#11140d] md:px-8 md:py-44">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
              <div>
                <h3 className="text-5xl font-semibold tracking-[-0.055em] md:text-8xl">Interface</h3>
                <p className="mt-7 max-w-2xl text-lg leading-8 text-[#11140d]/72">I worked on the interface design while Riley contributed to the interaction and interface systems. We kept the controls, headings, and feedback consistent with the pixel art presentation so players could move between farming, shops, inventory, perks, and settings without learning a different visual language for each screen.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <article className="rounded-[22px] bg-[#eef0d9] p-6"><h4 className="text-xl font-semibold">Entry and saving</h4><p className="mt-3 leading-7 text-[#11140d]/66">The opening flow covers the main menu, four save slots, and separate confirmation states for starting or deleting a game.</p></article>
                <article className="rounded-[22px] bg-[#eef0d9] p-6"><h4 className="text-xl font-semibold">Learning and settings</h4><p className="mt-3 leading-7 text-[#11140d]/66">Players can use a guided tutorial, check animal feeding rules, pause the game, and change volume, fullscreen mode, or resolution.</p></article>
                <article className="rounded-[22px] bg-[#eef0d9] p-6"><h4 className="text-xl font-semibold">Economy controls</h4><p className="mt-3 leading-7 text-[#11140d]/66">Inventory, dialogue, buying, selling, and perks show prices, stock, restock timing, currencies, and available upgrades close to the relevant action.</p></article>
              </div>
            </div>

            <div className="mt-16 flex items-end justify-between gap-6">
              <p className="max-w-2xl text-sm leading-6 text-[#11140d]/58">The later interface pass added save management and options to the main menu, then continued with display controls, shop information, and fixes recorded in the post submission releases.</p>
              <div className="flex shrink-0 gap-1 rounded-full bg-[#11140d] p-1 text-white shadow-[0_14px_34px_rgba(17,20,13,0.22)]">
                <button type="button" className="icon-button-motion grid size-10 place-items-center rounded-full text-white/72 hover:bg-white hover:text-[#11140d] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#11140d]/25" aria-label="Show previous interface screen" onClick={() => scrollInterface(-1)}><ChevronLeft size={20} /></button>
                <button type="button" className="icon-button-motion grid size-10 place-items-center rounded-full text-white/72 hover:bg-white hover:text-[#11140d] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#11140d]/25" aria-label="Show next interface screen" onClick={() => scrollInterface(1)}><ChevronRight size={20} /></button>
              </div>
            </div>
            <div ref={interfaceRef} className="mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {everdewInterfaceScreens.map(([image, alt, title]) => (
                <figure key={image} className="w-[min(88vw,58rem)] shrink-0 snap-start overflow-hidden rounded-[26px] bg-[#11140d] text-white">
                  <img src={everdewImage(image)} alt={alt} width="1920" height="1200" className="aspect-[8/5] w-full object-cover" />
                  <figcaption className="px-6 py-5 text-lg font-semibold">{title}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section id="process" data-case-study-chapter className="scroll-mt-16 mx-auto max-w-7xl px-5 py-32 md:px-8 md:py-44">
          <div className="mb-16 max-w-3xl"><h3 className="text-5xl font-semibold tracking-[-0.055em] md:text-8xl">Process</h3><p className="mt-7 text-lg leading-8 text-white/60">The project began as a 3D prototype before we changed it into a pixel art game. Once the new visual direction was working, we rewrote the inventory and shop systems so they could support the rest of the game more reliably.</p></div>
          <div className="space-y-10">
            <article className="grid min-h-[32rem] overflow-hidden rounded-[30px] bg-[#252c1c] shadow-[0_34px_90px_rgba(0,0,0,0.45)] lg:grid-cols-2"><img src={everdewImage("prototype-3d-unity.png")} alt="The original top down 3D Everdew prototype in the Unity editor" width="320" height="328" className="h-full min-h-[24rem] w-full bg-[#2f3034] object-contain" /><div className="flex flex-col justify-end p-8 md:p-12"><h4 className="text-4xl font-semibold md:text-6xl">3D prototype</h4><p className="mt-6 max-w-xl text-lg leading-8 text-white/62">Our first version used a top down 3D controller. When the Blockbench models repeatedly failed to import correctly, we decided that continuing to repair the 3D pipeline would take too much time away from the game itself.</p></div></article>
            <article className="grid min-h-[32rem] overflow-hidden rounded-[30px] bg-[#6b7d31] shadow-[0_34px_90px_rgba(0,0,0,0.48)] lg:grid-cols-2"><div className="order-2 flex flex-col justify-end p-8 md:p-12 lg:order-1"><h4 className="text-4xl font-semibold md:text-6xl">Pixel art version</h4><p className="mt-6 max-w-xl text-lg leading-8 text-white/75">We changed the project to pixel art and worked remotely in Aseprite, which gave everyone a more reliable shared workflow. Cainos' Pixel Art Top Down Basic pack provided the starting environment assets while we developed the rest of the visual direction.</p></div><img src={everdewImage("early-environment.png")} alt="Early pixel environment for Everdew" className="order-1 h-full min-h-[24rem] w-full object-cover lg:order-2" /></article>
            <article className="grid min-h-[32rem] overflow-hidden rounded-[30px] bg-[#d5f36a] text-[#11140d] shadow-[0_34px_90px_rgba(0,0,0,0.5)] lg:grid-cols-2"><img src={everdewImage("inventory-ui.png")} alt="Inventory system running in Everdew" className="h-full min-h-[24rem] w-full object-cover" /><div className="flex flex-col justify-end p-8 md:p-12"><h4 className="text-4xl font-semibold md:text-6xl">System rewrite</h4><p className="mt-6 max-w-xl text-lg leading-8 text-[#11140d]/68">The inventory and shop data did not sort or communicate correctly in the original integration. Riley and I replaced it and divided the larger scripts into smaller components, which later gave us a better base for animals, perks, NPCs, and saving.</p></div></article>
          </div>
        </section>

        <section id="everdew-management" className="bg-[#eef0d9] px-5 py-32 text-[#17200f] md:px-8 md:py-44">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-16 lg:grid-cols-[0.72fr_1.28fr] lg:items-center"><div><h3 className="text-5xl font-semibold tracking-[-0.055em] md:text-7xl">Project management</h3><p className="mt-7 text-lg leading-8 text-[#17200f]/65">We assigned production roles at the start and used Trello to keep the tasks visible across the team. GitHub and Unity Version Control gave us shared project history, while vFolders 2 and vHierarchy 2 helped us keep the Unity assets and scene objects organised.</p></div><div className="grid gap-4 sm:grid-cols-2"><img src={everdewImage("trello-board.png")} alt="Everdew Trello planning board" width="1920" height="1032" className="aspect-[80/43] w-full rounded-[22px] object-cover shadow-xl sm:col-span-2" /><img src={everdewImage("organized-assets.png")} alt="Organised Everdew Unity project folders" width="1920" height="1020" className="aspect-[32/17] w-full rounded-[22px] object-cover shadow-xl" /><img src={everdewImage("organized-hierarchy.png")} alt="Organised Everdew Unity hierarchy" width="1920" height="1020" className="aspect-[32/17] w-full rounded-[22px] object-cover shadow-xl" /><img src={everdewImage("unity-collab.png")} alt="Everdew Unity Version Control history" width="1920" height="1020" className="aspect-[32/17] w-full rounded-[22px] object-cover shadow-xl" /><img src={everdewImage("github-repo.png")} alt="Everdew GitHub repository" width="1920" height="1020" className="aspect-[32/17] w-full rounded-[22px] object-cover shadow-xl" /></div></div>
            <div className="mt-24 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{[["code-shop.png", "Shop data"], ["code-inventory.png", "Inventory flow"], ["code-npc.png", "NPC behaviour"], ["code-perks.png", "Perk system"]].map(([image, title]) => <figure key={image} className="overflow-hidden rounded-[20px] bg-[#17200f]"><ExpandableEvidenceImage src={everdewImage(image)} alt={`${title} code from Everdew`} title={title} /><figcaption className="p-5 font-semibold text-white">{title}</figcaption></figure>)}</div>
          </div>
        </section>

        <section id="extras" data-case-study-chapter className="scroll-mt-16 bg-[#11140d] px-5 pt-32 text-white md:px-8 md:pt-44">
          <div className="mx-auto max-w-7xl pb-16 md:pb-20">
            <h3 className="text-5xl font-semibold tracking-[-0.055em] md:text-8xl">Extras</h3>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/60">This supporting material explains how we promoted the game and how we compared possible publishers with the direction of the project.</p>
          </div>
        </section>

        <section id="everdew-promotion" className="mx-auto max-w-7xl px-5 py-32 md:px-8 md:py-44">
          <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-center"><img src={everdewImage("poster.jpeg")} alt="Everdew game jam poster with QR code" width="595" height="842" className="mx-auto aspect-[595/842] w-full max-w-[32rem] rounded-[24px] object-cover shadow-[0_30px_90px_rgba(0,0,0,0.5)]" /><div><h3 className="text-5xl font-semibold tracking-[-0.055em] md:text-7xl">Promotion</h3><p className="mt-7 text-lg leading-8 text-white/62">We designed the poster around the same green palette, pixel font, and logo used in the game. It also includes the PEGI 7 rating and a QR code that takes viewers directly to the itch.io page.</p><div className="mt-12 grid gap-8 border-t border-white/12 pt-10 sm:grid-cols-2"><article><h4 className="text-xl font-semibold">Raw Fury</h4><p className="mt-3 leading-7 text-white/58">We considered Raw Fury because it publishes independent games with clearly defined art direction.</p></article><article><h4 className="text-xl font-semibold">Team17</h4><p className="mt-3 leading-7 text-white/58">We considered Team17 because it supports independent games across a broad range of platforms.</p></article><article><h4 className="text-xl font-semibold">Curve Games</h4><p className="mt-3 leading-7 text-white/58">We considered Curve Games because its catalogue includes games built around repeatable systems and long term progression.</p></article><article><h4 className="text-xl font-semibold">Critical Reflex</h4><p className="mt-3 leading-7 text-white/58">We considered Critical Reflex because it works with games that use unusual or experimental mechanical systems.</p></article></div></div></div>
        </section>

        <EverdewChangelog openVersion={openChangelogVersion} onToggle={setOpenChangelogVersion} />

        <section id="reflection" data-case-study-chapter className="scroll-mt-16 relative overflow-hidden bg-[#d5f36a] px-5 py-32 text-center text-[#11140d] md:px-8 md:py-44"><img src={everdewImage("farm-street.png")} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" /><div className="absolute inset-0 bg-[#d5f36a]/85" /><div className="relative mx-auto max-w-4xl"><h3 className="text-5xl font-semibold tracking-[-0.06em] md:text-8xl">Reflection</h3><p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-[#11140d]/85">As a four person team, we completed the main game loop in about two weeks of active development. Reworking the interface, shared item data, and script boundaries showed me where the first structure was making new features harder to add. I used AI assistance for parts of the scripting, so one of my goals for a future project is to implement more of that logic independently and make sure I understand each system fully.</p></div></section>
    </CaseStudyShell>
  );
}

function EverdewChangelog({
  openVersion,
  onToggle,
}: {
  openVersion: string | null;
  onToggle: (version: string | null) => void;
}) {
  return (
    <ChangelogAccordion
      entries={everdewReleases}
      openVersion={openVersion}
      onToggle={onToggle}
      idPrefix="everdew"
      gameTitle="Everdew"
      description="Release notes for Everdew."
    />
  );

  /* Kept unreachable temporarily so the in-progress case-study work remains recoverable in the dirty worktree.
  return (
    <section id="changelog" data-case-study-chapter className="scroll-mt-16 mx-auto max-w-7xl px-5 py-32 md:px-8 md:py-44">
      <div className="max-w-4xl">
        <h3 className="text-5xl font-semibold tracking-[-0.055em] md:text-8xl">Changelog</h3>
        <p className="mt-7 text-lg leading-8 text-white/60">Release notes for Everdew.</p>
      </div>
      <div className="mt-16 divide-y divide-white/12 border-y border-white/12">
        {everdewReleases.map((entry) => {
          const isOpen = openVersion === entry.version;

          return (
            <article key={entry.version} className="py-6">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`everdew-changelog-${entry.version}`}
                onClick={() => onToggle(isOpen ? null : entry.version)}
                className="flex w-full cursor-pointer flex-wrap items-center justify-between gap-x-8 gap-y-2 text-left"
              >
                <span className="text-2xl font-semibold">v{entry.version}</span>
                <span className="flex-1 text-lg text-white/70 md:text-right">{entry.title}</span>
                <span className="text-sm text-white/45">{entry.date}</span>
                <span aria-hidden="true" className={`text-2xl leading-none text-white/55 transition-transform duration-300 ${isOpen ? "rotate-45" : "rotate-0"}`}>+</span>
              </button>
              <div id={`everdew-changelog-${entry.version}`} className={`cubo-changelog-panel ${isOpen ? "is-open" : ""}`}>
                <div className="min-h-0 overflow-hidden">
                  <div className="cubo-changelog-content mt-7 grid max-w-4xl gap-2 border-l border-white/60 pl-5 text-[0.98rem] leading-7 text-white/64">
                    {entry.body.map((line, index) => <p key={`${entry.version}-${index}`} className="relative pl-5 before:absolute before:left-0 before:content-['â€¢']">{line.slice(2)}</p>)}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
  */
}

const cuboChangelog = [
  { version: "0.4.0", date: "28 May 2026", title: "Save & Load, Breeze Client Splash & Stability Fixes", body: ["Headline Features:", "- Added a save and load system with 4 save slots that players can manage", "- Updated the Main Menu with load game functionality and confirmation dialogs for save management", "- Added a new boot splash screen for Breeze Client", "- Time-Dialled now requires stamina", "- Implemented Parry Stun for Grump Rock", "- Fixed fullscreen crashes when tabbing out of the game", "Gameplay & Combat:", "- Removed the parry circle for Shackled Bomber", "- Added hit flash to Shackled Bomber, which was missing in previous versions", "- Added Duk to one of the chests", "Quality of Life:", "- Press Escape in UI menus to go back", "- Made the pause menu slide transition faster to match the main menu", "- Refined tutorial prompts to use PlayerPrefs for one time display logic to work with the save and load system", "- Improved navigation settings for Main Menu and Pause Menu UI elements", "- Added controller volume repeat delay, repeat rate, and step settings for improved audio control", "Focus & Display:", "- Added application focus management to the Main Menu and Pause Menu to prevent input when the game is not in focus", "- Updated cursor visibility and lock state based on focus changes", "- The game now runs in the background", "- Resolution is only applied from saved preferences when explicitly set by the user", "- First launch now uses the system default resolution when no saved preference exists", "Visual & World:", "- Adjusted local positions of game objects for better alignment", "- Modified tilemap indices and sprite references for improved visual consistency", "- Updated the sprite for lost gold", "- Enhanced dropped Tinted Gold with settling mechanics and bobbing for better visual feedback", "Bug Fixes:", "- Fixed a bug where lost gold could not be picked up"] },
  { version: "0.3.0", date: "17 April 2026", title: "Controller Support, Gameplay Tweaks & Visual Improvements", body: ["Headline Feature:", "- Added keyboard and controller support for easier menu navigation", "Quality of Life:", "- Moved the location of the Grump Rock Cooler", "- Decreased Spear Guard health", "- Changed the elevator logic so that it starts when the player is on it", "Visual Consistency Fixes:", "- Added more corner tiles that were missed on the map", "- Changed the size of buttons in the Main Menu", "- Revamped the look of the starting area", "Bug Fix:", "- Fixed a bug which caused the game to crash when switching tabs"] },
  { version: "0.2.11", date: "14 March 2026", title: "Small Adjustments and Fixes", body: ["- Fixed the version text displaying the incorrect version number", "- The UI for a cooler was incorrectly aligned causing the UI to go off screen", "- Fixed the position of a cooler"] },
  { version: "0.2.10", date: "14 March 2026", title: "Small Adjustments and Fixes", body: ["- Changed the colour and anchor of the version text", "- Slightly adjusted the position of the tutorial text due to it overlapping with some of the UI elements"] },
  { version: "0.2.9", date: "13 February 2026", title: "Small Adjustments and Fixes", body: ["- Fixed misalignment issues with the Chest and Cooler UI", "- Slightly adjusted the color and position of the Boulder Key Gate", "- Improved the visual presentation of tutorial prompts", "- Adjusted the position of the version number text", "- Corrected the formatting of the Best Time display", "- Made minor layout improvements to the Options menu"] },
  { version: "0.2.8", date: "12 February 2026", title: "Hotfix", body: ["- The player was set to the wrong spawn and has been fixed", "- Added a version number text in main menu", "- Slightly updated the format of the timer"] },
  { version: "0.2.7", date: "12 February 2026", title: "Gameplay Improvements & Arena Update", body: ["- Reworked the \"Grump Rock\" Arena with layout improvements and gameplay adjustments", "- Added a Speedrun Timer toggle in the Options menu", "- The game now tracks total player deaths and displays them on the end screen", "- Moved a Cooler inside the \"Grump Rock\" arena to improve respawn flow", "- Rebalanced Crystal Crawlers (reduced health and fixed respawn delay)", "- Adjusted Spear Guard knockback distance", "- Added an additional Patrolling Shroom enemy", "- Fixed a bug where standing below gold could push the player into the tilemap", "- Adjusted bounce height for one of the mushrooms", "- Updated an overlooked area with additional sprites and tiles for improved visuals"] },
  { version: "0.2.6", date: "7 February 2026", title: "Adjustments and Fixes", body: ["- Gump Rock now has increased health and improved movement speed", "- Time Dialled state should now work reliably", "- Adjusted background colors to feel more distant and less visually distracting", "- Rebalanced Spear Guard health", "- Fixed a bounce mushroom that was slightly misaligned", "- Added back the missing fade in the main menu"] },
  { version: "0.2.5", date: "5 February 2026", title: "Hotfix", body: ["- Fixed an issue that caused the main menu title to look weird", "- Gold can now be picked up correctly after death", "- The size of the trigger for the cavern safe point has been increased"] },
  { version: "0.2.4", date: "4 February 2026", title: "Hotfix", body: ["- Fixed fullscreen handling to reduce brief taskbar/desktop flashes during gameplay", "- Adjusted the knockback of the Spear Gaurd", "- Bosses now stay in the stunned state for a bit longer when parried", "- Cursor now hides on game start and shows when the pause menu opens"] },
  { version: "0.2.3", date: "2 February 2026", title: "Hotfix", body: ["- Cubo"] },
  { version: "0.2.2", date: "2 February 2026", title: "Hotfix", body: ["- Fixed some missing corner tiles in the environment", "- Platforms now come back if the player falls off while they’re moving", "- Player control is disabled during the Chapter Intro"] },
  { version: "0.2.1", date: "2 February 2026", title: "Hotfix", body: ["- Synced main menu and pause menu settings across scenes", "- Fixed pause menu button input not working after changes in display settings"] },
  { version: "0.2.0", date: "2 February 2026", title: "Update", body: ["- Completed Crystal Caverns", "- Added new enemies and bosses", "- Introduced new player mechanics", "- Implemented a main menu and pause menu", "- Fixed bugs and improved performance"] },
  { version: "0.1.0", date: "3 January 2026", title: "Test Build", body: ["- Under Development"] },
];

const cuboProcessStages = [
  {
    title: "Concept and scope",
    copy: "I began with the idea of a Metroidvania set inside an abandoned crystal mine. Instead of keeping the tutorial in a separate scene, I made it the opening area of one connected map. My initial scope included a slam attack, dash movement, two bosses, several enemies, chests, and enough environmental detail to make the cave feel like one place.",
  },
  {
    title: "Art direction and scope change",
    copy: "I looked at Hollow Knight for its connected cave setting and atmosphere, Celeste for readable platforming spaces, and Rayman Legends for layered environments and lighting contrast. My first detailed character sprites took too long to animate, so I simplified the player into a cube and used the saved time to improve the movement and gameplay logic.",
  },
  {
    title: "Environment assets",
    copy: "I started the art production in Aseprite by creating rocky ground tiles, foliage, crates, minecarts, platforms, crystals, lanterns, and other mine props. These assets gave me enough material to build the first playable rooms, and I revised them as the connected map became larger.",
  },
  {
    title: "Player movement prototype",
    copy: "My first controller used Unity's legacy Input Manager. When I needed gamepad support and more actions, I moved it to the New Input System instead of extending the older setup. I gradually added variable jump height, dashing, the ground slam, sprinting, and wall climbing. I then added the Time Dash so the player could dash farther forwards than they can with the standard dash, with the Animator coordinating how those movement states connect.",
  },
  {
    title: "Lighting and atmosphere",
    copy: "Once the core movement was working, I developed the atmosphere with Global Light 2D, a Global Volume for post processing, local lights, animated candle sprites, and firefly particles. I also created a water reflection with a custom shader and a secondary camera, then added ripple and distortion effects so the surface did not look static.",
  },
  {
    title: "Interactions and level structure",
    copy: "As the map expanded, I added pickups, chests, contextual prompts, damage numbers, respawn points, bounce mushrooms, hazards, and camera bounds. I replaced an overly complex elevator implementation with a lever controlled version that was easier to understand and maintain. I then used a generator and linked platform to create a final return objective in the opening area.",
  },
  {
    title: "Combat and player feedback",
    copy: "I used a patrolling enemy as the first combat test and made it vulnerable only to the ground slam so the attack had a clear purpose. A white flash shader confirms enemy hits, while screen shake and a red flash show when the player takes damage. Health, stamina, floating damage numbers, and fade transitions then support the full damage and respawn flow.",
  },
  {
    title: "Grump Rock",
    copy: "Grump Rock began as a rolling rock sprite with a simple tracking script. I developed it into a gated encounter where the arena tests the player's jump and slam timing. Below half health, the boss launches crystal shards, while a parry window rewards more precise timing. Defeating it opens the arena and gives the player the Boulder Key.",
  },
  {
    title: "Shackled Bomber",
    copy: "Shackled Bomber began as a projectile prototype, and I used debug logs to isolate problems in the dynamite targeting logic. I then added the explosion animation, Soul Essence collection, Soul Charge, a dedicated arena, and a second phase. I removed an early hanging chain system because its rotation remained inconsistent and was making the encounter less reliable.",
  },
  {
    title: "Playtesting and balance",
    copy: "Testing showed me that the player could not avoid repeated dynamite attacks reliably. I replaced the ground dash with a stamina based sprint for this encounter and gave Soul Charge temporary invulnerability during its attack animation. I also adjusted boss health, projectile frequency, knockback, stun duration, and the arena layouts after further playtests.",
  },
  {
    title: "Enemy and hazard expansion",
    copy: "During the later production pass, I added the Spear Guard, the wall crawling Crystal Crawler, falling stalactites, spike traps, and more patrol enemies. I changed the Crystal Crawler from manual wall checks to automatic ground and wall detection so it could move around the tile map more reliably.",
  },
  {
    title: "Progression and completion",
    copy: "I used the Boulder Key gate to connect the two boss encounters. After defeating Shackled Bomber, the player collects the Power Supply and returns to the generator near the opening. Activating the connected platform starts the end sequence and completes the route from the tutorial to the final objective.",
  },
  {
    title: "Menus and final details",
    copy: "In the final production stage, I added the pause menu, main menu, volume, fullscreen and resolution options, a speedrun timer, tutorial triggers, and menu particles. I used the player sprite as the letter O in the title and made its eyes follow the cursor through a raycast. My final testing covered the display settings, menu input, respawns, and the completion sequence.",
  },
  {
    title: "Release iteration",
    copy: "After the initial submission, I continued updating the project instead of leaving the first build unchanged. I synchronised settings across scenes, repaired missing tiles and moving platforms, improved fullscreen and cursor behaviour, fixed gold and spawn issues, and adjusted safe point triggers. Later updates rebalanced enemies and bosses, revised the Grump Rock arena, added death tracking, refined the tutorials and menus, and corrected the timer and version displays.",
  },
  {
    title: "Project organisation",
    copy: "Throughout development, I separated scenes, sprites, animation, enemies, interface elements, and scripts in the Unity hierarchy and asset folders. GitHub recorded the project history and later releases. I also used debug logs and repeated in game tests to find problems with boss targeting, interactions, movement, and interface behaviour.",
  },
];

const cuboFlow = [
  ["Tutorial", "I use contextual triggers to introduce movement, interaction, damage, and the ground slam before the route opens into the wider cave environment."],
  ["Exploration", "The main exploration spaces combine caves, elevators, hazards, enemies, chests, and vertical routes so the player regularly changes how they move through the map."],
  ["First boss", "Grump Rock tests the player's timing through rolling attacks and shard projectiles. Defeating it rewards the Boulder Key and opens the next part of the progression route."],
  ["Second boss", "The Boulder Key gives the player access to Shackled Bomber, where the encounter combines dynamite avoidance, Soul Essence collection, and the Soul Charge attack."],
  ["Completion", "After the second boss, the player takes the Power Supply back to the opening generator and uses it to complete the final objective."],
];

function CuboResearchSection() {
  return (
    <section id="research" data-case-study-chapter className="scroll-mt-16 bg-[#f0e9df] px-5 py-32 text-[#1c1613] md:px-8 md:py-44">
      <div className="mx-auto max-w-7xl">
        <h3 className="max-w-6xl text-5xl font-semibold leading-[0.98] tracking-[-0.055em] md:text-8xl">Research</h3>
        <p className="mt-14 max-w-5xl text-2xl leading-[1.45] tracking-[-0.02em] text-[#1c1613] md:text-4xl">I researched the development of 2D games and the Metroidvania genre, using Metroid, Hollow Knight, and Axiom Verge to understand how exploration and ability based progression work together.</p>
        <div className="mt-24 grid grid-flow-dense gap-12 border-t border-[#1c1613]/18 pt-12 md:grid-cols-2 lg:grid-cols-4">
          <article><h4 className="text-xl font-semibold">2D games</h4><p className="mt-4 leading-7 text-[#1c1613]/66">Early games relied on 2D graphics and pixel art because of hardware limits. Looking at later games showed me how pixel art developed into an intentional visual style rather than remaining only a technical compromise.</p></article>
          <article><h4 className="text-xl font-semibold">Metroid</h4><p className="mt-4 leading-7 text-[#1c1613]/66">Metroid, released in 1986, helped establish non linear exploration and ability based gating. I used this structure as a reference for how new items and abilities can make earlier areas worth revisiting.</p></article>
          <article><h4 className="text-xl font-semibold">Modern examples</h4><p className="mt-4 leading-7 text-[#1c1613]/66">Hollow Knight and Axiom Verge both use acquired abilities to open routes that were previously unavailable. These examples helped me understand how exploration can show the player's growth instead of acting as a separate activity.</p></article>
          <article><h4 className="text-xl font-semibold">Story and art</h4><p className="mt-4 leading-7 text-[#1c1613]/66">I looked at how atmosphere, environmental clues, and hidden details can communicate story without relying entirely on dialogue. I also compared pixel art, painterly 2.5D, vector art, and hand drawn styles before settling on the direction for Cubo.</p></article>
        </div>
      </div>
    </section>
  );
}

function CuboProjectView({
  onNavigate,
  onClose,
}: {
  onNavigate: (offset: -1 | 1) => void;
  onClose: () => void;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const showcaseRef = useRef<HTMLDivElement | null>(null);
  const interfaceCarouselRef = useRef<HTMLDivElement | null>(null);
  const [openChangelogVersion, setOpenChangelogVersion] = useState<string | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const tagline = projectSummary("cubo", "A 2D Metroidvania with combat, exploration, and boss fights.");

  const scrollShowcase = (direction: -1 | 1) => {
    const showcase = showcaseRef.current;
    if (!showcase) return;
    showcase.scrollBy({
      left: direction * Math.min(showcase.clientWidth * 0.82, 620),
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  const scrollInterfaceCarousel = (direction: -1 | 1) => {
    const carousel = interfaceCarouselRef.current;
    if (!carousel) return;
    carousel.scrollBy({
      left: direction * carousel.clientWidth,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <CaseStudyShell
      definition={caseStudyDefinitions.cubo}
      scrollRef={rootRef}
      onClose={onClose}
      className="bg-[#0b0909] text-white"
    >
      <header className="relative min-h-[42rem] overflow-hidden md:min-h-[52rem]">
        <img src={cuboImage("Cover - Cubo.png")} alt="Cubo cover artwork for Crystal Caverns" className="absolute inset-0 h-full w-full scale-105 object-cover opacity-85" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0909]/55 via-[#0b0909]/20 to-[#0b0909]/5" />
        <div className="relative mx-auto flex min-h-[42rem] max-w-7xl flex-col justify-end px-5 pb-16 pt-28 md:min-h-[52rem] md:px-8 md:pb-24">
          <h2 className="max-w-6xl text-[clamp(4rem,13vw,10rem)] font-semibold leading-[0.82] tracking-[-0.07em] text-white">Cubo</h2>
          <p className="mt-8 max-w-3xl text-lg leading-8 text-white/76">{tagline}</p>
        </div>
      </header>

        <CaseStudyShowcaseRail background="#12100f" railRef={showcaseRef} onScroll={scrollShowcase}>
              {[
                ["Screenshot 2026-11-25 093118.png", "Crystal mine"],
                ["Screenshot 2026-11-25 093131.png", "Exploration"],
                ["ground-slam-cubo.png", "Ground slam combat"],
                ["Grump Rock Boss - Cubo.png", "Grump Rock"],
                ["Screenshot 2026-11-25 093233.png", "Combat"],
                ["Screenshot 2026-11-25 093313.png", "Cave route"],
                ["Screenshot 2026-11-25 093349.png", "Traversal"],
                ["Screenshot 2026-11-25 093547.png", "Mine interior"],
                ["Screenshot 2026-11-25 093804.png", "Crystal mine route"],
                ["Screenshot 2026-11-25 093903.png", "Cave encounter"],
                ["Screenshot 2026-11-25 093918.png", "Crystal mine platforming"],
                ["Screenshot 2026-11-25 094002.png", "Mine traversal"],
                ["Screenshot 2026-11-25 094020.png", "Crystal cave"],
                ["Screenshot 2026-11-25 094113.png", "Mine exploration"],
                ["Screenshot 2026-11-25 094125.png", "Cave scene"],
                ["Screenshot 2026-11-25 100331.png", "Crystal mine environment"],
                ["elevator-cubo.png", "Elevator lever"],
                ["Shackled Bomber Boss - Cubo.jpg", "Shackled Bomber"],
              ].map(([image, title]) => (
                <figure key={image} className="w-[min(82vw,43rem)] shrink-0 snap-center overflow-hidden rounded-[22px] bg-[#1a1716]">
                  <CaseStudyShowcaseImage src={cuboImage(image)} alt={title} title={title} />
                </figure>
              ))}
        </CaseStudyShowcaseRail>

        <section id="overview" data-case-study-chapter className="scroll-mt-16 mx-auto max-w-7xl px-5 py-32 md:px-8 md:py-44">
          <div className="grid gap-14 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <div>
              <h3 className="text-5xl font-semibold tracking-[-0.05em] md:text-7xl">Overview</h3>
              <p className="mt-7 text-lg leading-8 text-white/60">I began Cubo as a solo 2D game coursework project. The original brief required an essay, two level plans, original tile and character art, a Unity tutorial level, and a gameplay recording, which I submitted in February 2026 before continuing to expand the game.</p>
            </div>
            <div className="grid grid-flow-dense gap-4 sm:grid-cols-2">
              <article className="rounded-[24px] bg-[#21120e] p-7"><h4 className="text-2xl font-semibold">Tools</h4><p className="mt-4 leading-7 text-white/62">I used Unity to build the game, Aseprite to create the pixel art, and GitHub to track the project as it developed.</p></article>
              <article className="rounded-[24px] bg-[#d95f27] p-7 text-[#1b0d08] sm:col-span-2"><h4 className="text-2xl font-semibold">Delivered</h4><p className="mt-4 max-w-3xl leading-7 text-[#1b0d08]/76">For the coursework submission, I delivered the supporting research, level plans, original environment assets, Unity implementation, and gameplay recordings that documented the working tutorial level.</p></article>
            </div>
          </div>
        </section>

        <CuboResearchSection />

        <section id="experience" data-case-study-chapter className="scroll-mt-16 mx-auto max-w-7xl px-5 py-32 md:px-8 md:py-44">
          <div className="mb-14 max-w-4xl">
            <h3 className="text-4xl font-semibold tracking-[-0.045em] md:text-7xl">Project Details</h3>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/62">I built the experience around a ground slam, fluid movement, combat, exploration, and progression. Bounce mushrooms and hazards change how the player moves through the cave, while harder enemies, keys, and resources give them reasons to explore beyond the main route.</p>
          </div>
          <div className="grid grid-flow-dense gap-0 overflow-hidden rounded-[24px] md:grid-cols-4 md:grid-rows-2">
            <article className="relative min-h-[34rem] overflow-hidden md:col-span-2 md:row-span-2">
              <img src={cuboImage("ground-slam-cubo.png")} alt="Cubo using the ground slam against enemies in the crystal mine" className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/86 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7 md:p-9"><h4 className="text-3xl font-semibold">Ground slam combat</h4><p className="mt-3 max-w-lg leading-7 text-white/70">The ground slam lets the player descend quickly from the air and is used against regular enemies, traversal obstacles, and the Grump Rock boss.</p></div>
            </article>
            <article className="min-h-[17rem] bg-[#21120e] p-7 md:col-span-2 md:p-9"><h4 className="text-3xl font-semibold">Movement</h4><p className="mt-4 max-w-xl leading-7 text-white/65">The movement system combines variable jumps, wall climbing, sprinting, and two types of dash. The standard dash supports shorter movements, while the Time Dash lets the player dash farther forwards when they need to cross a larger gap.</p></article>
            <article className="min-h-[17rem] bg-[#d95f27] p-7 text-[#1b0d08] md:p-9"><h4 className="text-2xl font-semibold">Atmosphere</h4><p className="mt-4 leading-7 text-[#1b0d08]/76">I used global lights, post processing through a Global Volume, animated sprites, and a custom water reflection to give the cave more depth and movement.</p></article>
            <article className="min-h-[17rem] bg-[#181515] p-7 md:p-9"><h4 className="text-2xl font-semibold">Player systems</h4><p className="mt-4 leading-7 text-white/62">Health and stamina support the combat and movement systems, while respawning returns the player to a safe point after a failed section.</p></article>
          </div>
        </section>

        <section id="cubo-bosses" className="mx-auto max-w-7xl px-5 pb-32 pt-16 md:px-8 md:pb-44 md:pt-20">
          <div className="max-w-4xl"><h3 className="text-5xl font-semibold tracking-[-0.05em] md:text-7xl">Bosses</h3><p className="mt-7 max-w-2xl text-lg leading-8 text-white/60">I designed each boss encounter to test a different part of the combat system while also controlling how the player progresses through the cave.</p></div>
          <div className="mt-16 flex flex-col gap-4 lg:h-[34rem] lg:flex-row">
            <article className="group relative min-h-[28rem] flex-1 overflow-hidden rounded-[24px] transition-[flex] duration-700 ease-out hover:flex-[1.35]">
              <img src={cuboImage("Grump Rock Boss - Cubo.png")} alt="Grump Rock rolling toward Cubo" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/12 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7 md:p-9"><h4 className="text-3xl font-semibold">Grump Rock</h4><p className="mt-3 max-w-xl leading-7 text-white/70">When the encounter begins, the arena gates close and Grump Rock starts tracking and rolling toward the player. The player has to time the ground slam to counter the attack, while a smaller parry window rewards more precise timing with extra damage. Below half health, the boss adds crystal shards, and defeating it rewards the Boulder Key.</p></div>
            </article>
            <article className="group relative min-h-[28rem] flex-1 overflow-hidden rounded-[24px] transition-[flex] duration-700 ease-out hover:flex-[1.35]">
              <img src={cuboImage("Shackled Bomber Boss - Cubo.jpg")} alt="Cubo facing the suspended Shackled Bomber" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/12 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7 md:p-9"><h4 className="text-3xl font-semibold">Shackled Bomber</h4><p className="mt-3 max-w-xl leading-7 text-white/70">The Boulder Key unlocks the room containing this ceiling mounted boss. During the first phase, the player avoids dynamite, collects three Soul Essences, and uses Soul Charge to attack. In the second phase, the boss moves down to the arena floor and brings the combat back to ground slam timing.</p></div>
            </article>
          </div>
          <div className="mt-16 grid gap-10 border-t border-white/12 pt-12 md:grid-cols-2">
            <article><h4 className="text-2xl font-semibold">Boss mechanics</h4><p className="mt-4 leading-8 text-white/62">I researched attacks that only work under specific enemy conditions, including Howling Wraiths against Flukemarm and missiles against Kraid's open mouth. I applied the same principle to Grump Rock by making the player time the ground slam against its rolling attack.</p></article>
            <article><h4 className="text-2xl font-semibold">Boss progression</h4><p className="mt-4 leading-8 text-white/62">Grump Rock introduces the main combat action and rewards the key needed to reach Shackled Bomber. The second encounter adds resource collection and projectile combat before returning to ground slam timing in its final phase.</p></article>
          </div>
        </section>

        <section id="cubo-progression" className="bg-[#d95f27] px-5 py-32 text-[#1b0d08] md:px-8 md:py-44">
          <div className="mx-auto max-w-7xl">
            <h3 className="max-w-5xl text-5xl font-semibold tracking-[-0.055em] md:text-8xl">Player progression</h3>
            <div className="mt-20 border-y border-[#1b0d08]/20">
              {cuboFlow.map(([title, copy]) => (
                <article key={title} className="grid gap-4 border-b border-[#1b0d08]/20 py-8 last:border-b-0 md:grid-cols-[0.65fr_1.35fr] md:items-start md:gap-10 md:py-10">
                  <h4 className="text-2xl font-semibold md:text-3xl">{title}</h4>
                  <p className="max-w-3xl leading-8 text-[#1b0d08]/72">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="cubo-interface" className="bg-[#f0e9df] px-5 py-32 text-[#1c1613] md:px-8 md:py-44">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-14 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
              <div><h3 className="text-5xl font-semibold tracking-[-0.05em] md:text-7xl">Interface</h3><p className="mt-7 text-lg leading-8 text-[#1c1613]/62">I created main and pause menus with controls for the master volume, fullscreen mode, and resolution. The settings remain synchronised across scenes, while the cursor changes between locked gameplay and visible menu states. In later updates, I also protected the button input from breaking after display changes.</p><p className="mt-5 text-lg leading-8 text-[#1c1613]/62">The optional speedrun timer records the current run and the best completion time, and later builds added total death tracking to the end screen. On the title screen, I replaced the letter O with Cubo and used raycasts to make the character's eyes follow the cursor.</p></div>
              <div className="min-w-0">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold text-[#1c1613]/58">Menu and settings screens</p>
                  <div className="flex shrink-0 gap-1 rounded-full bg-[#1c1613] p-1 text-white shadow-[0_14px_32px_rgba(53,31,18,0.16)]">
                    <button type="button" className="icon-button-motion grid size-10 place-items-center rounded-full transition-colors hover:bg-white hover:text-[#1c1613] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1c1613]/25" aria-label="Show previous interface screen" onClick={() => scrollInterfaceCarousel(-1)}><ChevronLeft size={20} /></button>
                    <button type="button" className="icon-button-motion grid size-10 place-items-center rounded-full transition-colors hover:bg-white hover:text-[#1c1613] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1c1613]/25" aria-label="Show next interface screen" onClick={() => scrollInterfaceCarousel(1)}><ChevronRight size={20} /></button>
                  </div>
                </div>
                <div ref={interfaceCarouselRef} className="flex snap-x snap-mandatory overflow-x-auto rounded-[22px] shadow-[0_32px_80px_rgba(53,31,18,0.2)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {[
                    ["Main Menu - Cubo.png", "Cubo's main menu with the character forming the letter O", "Main menu"],
                    ["Intro Sequence - Cubo.png", "Cubo's intro sequence", "Intro sequence"],
                    ["Load Game Menu - Cubo.png", "Cubo's load game menu", "Load game"],
                    ["Pause Menu - Cubo.png", "Cubo's pause menu", "Pause menu"],
                    ["Options in Main Menu - Cubo.png", "Cubo's options menu from the main menu", "Main menu options"],
                    ["Options in Game - Cubo.png", "Cubo's options menu during gameplay", "In game options"],
                  ].map(([image, alt, label]) => (
                    <figure key={image} className="relative w-full shrink-0 snap-start overflow-hidden bg-[#17110e]">
                      <img src={cuboImage(image)} alt={alt} width="2560" height="1440" className="aspect-video w-full object-cover" />
                      <figcaption className="absolute bottom-4 left-4 rounded-full bg-[#1c1613]/88 px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(0,0,0,0.22)]">{label}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="process" data-case-study-chapter className="scroll-mt-16 bg-[#151110] px-5 py-32 md:px-8 md:py-44">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-5xl"><h3 className="text-5xl font-semibold tracking-[-0.05em] md:text-8xl">Process</h3><p className="mt-7 max-w-3xl text-lg leading-8 text-white/60">I began with the idea of one connected cave and developed it through art production, movement tests, level assembly, combat, bosses, and interface work. After completing the first build, I continued improving the project through later release updates.</p></div>
            <div className="mt-20 border-y border-white/12">
              {cuboProcessStages.map((stage) => (
                <article key={stage.title} className="grid gap-4 border-b border-white/12 py-9 last:border-b-0 md:grid-cols-[0.7fr_1.3fr] md:gap-16 md:py-12">
                  <h4 className="text-2xl font-semibold md:text-3xl">{stage.title}</h4>
                  <p className="max-w-3xl text-base leading-8 text-white/62">{stage.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="cubo-story mx-auto max-w-7xl px-5 py-32 md:px-8 md:py-44">
          <div className="max-w-3xl">
            <h3 className="text-5xl font-semibold tracking-[-0.05em] md:text-7xl">Development evidence</h3>
            <p className="mt-7 text-lg leading-8 text-white/58">These examples show three parts of my production process and explain how I organised the connected map, coordinated the player movement states, and simplified the elevator system.</p>
          </div>
          <div className="mt-16 grid gap-12 md:grid-cols-2 md:gap-16">
            <figure className="md:col-span-2">
              <div className="cubo-scroll-image overflow-hidden rounded-[22px] bg-black"><img src={cuboImage("Map - Cubo.png")} alt="Wide view of Cubo's connected cave map" className="aspect-video w-full object-cover" /></div>
              <figcaption className="mt-5 max-w-2xl text-base leading-7 text-white/58">I kept the tutorial, exploration routes, hazards, chests, boss gates, and final return objective inside one connected scene so progress through the cave feels continuous.</figcaption>
            </figure>
            <figure>
              <div className="cubo-scroll-image overflow-hidden rounded-[22px] bg-black"><img src={cuboImage("elevator-cubo.png")} alt="Cubo beside the elevator lever in the crystal mine" className="aspect-video w-full object-cover" /></div>
              <figcaption className="mt-5 max-w-2xl text-base leading-7 text-white/58">I revised the elevator so the player can use a lever to call the platform between floors, with the system resetting after each journey.</figcaption>
            </figure>
            <figure>
              <div className="cubo-scroll-image overflow-hidden rounded-[22px] bg-black"><img src={cuboImage("player-animator-cubo.png")} alt="Unity Animator graph for Cubo's player movement states" className="aspect-video w-full object-cover" /></div>
              <figcaption className="mt-5 max-w-2xl text-base leading-7 text-white/58">After moving to the New Input System, I used the player Animator to coordinate the idle, run, jump, landing, dash, and slam states.</figcaption>
            </figure>
          </div>
        </section>

        <section id="cubo-workflow" className="mx-auto max-w-7xl px-5 py-32 md:px-8 md:py-44">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div className="cubo-scroll-image overflow-hidden rounded-[24px]"><img src={cuboImage("Github Version Control - Cubo.png")} alt="Cubo's private GitHub repository and organised Unity project history" width="1881" height="993" className="aspect-[32/17] w-full object-cover" /></div>
            <div><h3 className="text-5xl font-semibold tracking-[-0.05em] md:text-7xl">Development workflow</h3><p className="mt-7 text-lg leading-8 text-white/60">I organised the Unity hierarchy by function and separated the assets into scenes, sprites, animation, enemies, interface elements, and scripts. This made the project easier to navigate as the cave and its systems expanded.</p><p className="mt-5 text-lg leading-8 text-white/60">I used GitHub to track development and the later releases. Player and enemy behaviours remained in separate scripts, and I used debug logs to isolate targeting and interaction issues before testing them in the game.</p></div>
          </div>
        </section>

        <ChangelogAccordion
          entries={cuboChangelog}
          openVersion={openChangelogVersion}
          onToggle={setOpenChangelogVersion}
          idPrefix="cubo"
          gameTitle="Cubo"
          description="Complete release notes for Cubo, from the first test build to the latest update."
        />
        {false && (
        <section className="mx-auto max-w-7xl px-5 py-32 md:px-8 md:py-44">
          <div className="max-w-4xl">
            <h3 className="text-5xl font-semibold tracking-[-0.05em] md:text-7xl">Changelog</h3>
            <p className="mt-7 text-lg leading-8 text-white/60">Complete release notes for Cubo, from the first test build to the latest update.</p>
          </div>
          <div className="mt-16 divide-y divide-white/12 border-y border-white/12">
            {cuboChangelog.map((entry) => {
              const isOpen = openChangelogVersion === entry.version;

              return (
              <article key={entry.version} className="py-6">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`changelog-${entry.version}`}
                  onClick={() => setOpenChangelogVersion(isOpen ? null : entry.version)}
                  className="flex w-full cursor-pointer flex-wrap items-center justify-between gap-x-8 gap-y-2 text-left"
                >
                  <span className="text-2xl font-semibold">v{entry.version}</span>
                  <span className="flex-1 text-lg text-white/70 md:text-right">{entry.title}</span>
                  <span className="text-sm text-white/45">{entry.date}</span>
                  <span aria-hidden="true" className={`text-2xl leading-none text-white/55 transition-transform duration-300 ${isOpen ? "rotate-45" : "rotate-0"}`}>+</span>
                </button>
                <div id={`changelog-${entry.version}`} className={`cubo-changelog-panel ${isOpen ? "is-open" : ""}`}>
                  <div className="min-h-0 overflow-hidden">
                    <div className="cubo-changelog-content mt-7 grid max-w-4xl gap-2 border-l border-white/60 pl-5 text-[0.98rem] leading-7 text-white/64">
                      {entry.body.map((line, index) => line.endsWith(":")
                        ? <p key={`${entry.version}-${index}`} className="mt-3 font-semibold text-white first:mt-0">{line.slice(0, -1)}</p>
                        : <p key={`${entry.version}-${index}`} className="relative pl-5 before:absolute before:left-0 before:content-['•']">{line.startsWith("- ") ? line.slice(2) : line}</p>)}
                    </div>
                  </div>
                </div>
              </article>
            )})}
          </div>
        </section>
        )}

        <section id="reflection" data-case-study-chapter className="scroll-mt-16 relative overflow-hidden px-5 py-24 text-center md:px-8 md:py-32">
          <img src={cuboImage("Screenshot 2026-11-25 093118.png")} alt="Cubo exploring the Crystal Caverns" className="absolute inset-0 h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(11,9,9,0.28),#0b0909_78%)]" />
          <div className="relative mx-auto max-w-4xl"><h3 className="text-5xl font-semibold tracking-[-0.055em] md:text-8xl">Reflection</h3><p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-white/66">The assignment originally required research, level planning, original art, and basic movement, but I later expanded the project into a connected world with revised input, new level layouts, and boss encounters. To protect the implementation time, I reduced the complexity of the character art, replaced the input system so I could support controller features, and changed the ground movement after testing the second boss.</p><p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/66">I left save and load support out of the initial submission because of the deadline, then added four managed save slots and updated tutorial persistence. The enemy attacks are working, but most enemies still use only an idle animation instead of having separate movement and attack animations. My next step would be to create those animations and review the combat timing across the full game.</p></div>
        </section>
    </CaseStudyShell>
  );
}

function FilterMenu({ label, open, setOpen, items, selected, onSelect }: { label: string; open: boolean; setOpen: (open: boolean) => void; items: string[]; selected: string; onSelect: (item: string) => void }) {
  return <div className="relative w-full md:w-auto"><button type="button" className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-canvas px-5 text-sm font-medium shadow-[0_6px_18px_rgba(29,29,31,0.18)] transition-[background-color,box-shadow,transform] duration-300 hover:shadow-[0_8px_22px_rgba(29,29,31,0.24)] active:scale-95 dark:bg-[#24252b] dark:text-white md:w-auto" aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen(!open)}><SlidersHorizontal size={17} />{label}</button>{open && <div className="filter-menu absolute left-0 right-0 top-14 z-30 w-full rounded-[18px] bg-canvas p-2 shadow-[0_10px_28px_rgba(29,29,31,0.22)] dark:bg-[#24252b] md:left-auto md:w-48" role="menu">{items.map((item) => <button key={item} type="button" className={`flex w-full items-center justify-between rounded-[14px] px-4 py-3 text-left text-sm font-medium transition-[background-color] duration-200 ${selected === item ? "bg-ink text-white dark:bg-white dark:text-ink" : "text-ink/70 hover:bg-chalk dark:text-white/70 dark:hover:bg-white/10"}`} role="menuitemradio" aria-checked={selected === item} onClick={() => { onSelect(item); setOpen(false); }}>{item}{selected === item && <Check size={16} className="filter-check" />}</button>)}</div>}</div>;
}

function EmptyResults({ noun }: { noun: string }) {
  return <div className="empty-results rounded-[18px] bg-canvas p-10 text-center dark:bg-[#24252b]"><p className="text-lg font-medium">No {noun} found</p><p className="mt-2 text-sm text-ink/60 dark:text-white/60">Try a different title, medium, tool, or keyword.</p></div>;
}
