import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
import { artworks, projects } from "./data";
import DeferredModelViewer from "./DeferredModelViewer";
import { MOTION, usePrefersReducedMotion } from "./motion";

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
  if (!project.imageUrl) return imageFor(project.imageSeed, width, height);
  if (/^https?:\/\//.test(project.imageUrl)) return project.imageUrl;
  return `${import.meta.env.BASE_URL}${project.imageUrl.replace(/^\/+/, "")}`;
};

const cuboImage = (name: string) => `${import.meta.env.BASE_URL}projects/cubo/${name}`;

const artworkImageFor = (artwork: Artwork, width = 900, height = 1200) => {
  if (!artwork.imageUrl) {
    return imageFor(artwork.imageSeed, width, height);
  }
  if (/^https?:\/\//.test(artwork.imageUrl)) {
    return artwork.imageUrl;
  }
  return `${import.meta.env.BASE_URL}${artwork.imageUrl.replace(/^\/+/, "")}`;
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

const isSameDetailType = (next: OverlayState, current: OverlayState) =>
  isDetailState(next) && isDetailState(current) && next.type === current.type;

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

  const navigateArtwork = (offset: -1 | 1) => {
    const current = state?.type === "artwork" ? state.artwork : rendered?.type === "artwork" ? rendered.artwork : null;
    if (!current) return;
    const index = artworks.findIndex((artwork) => artwork.id === current.id);
    onChange({
      type: "artwork",
      artwork: artworks[(index + offset + artworks.length) % artworks.length],
      navigationDirection: offset,
      origin: state?.type === "artwork" ? state.origin : rendered?.type === "artwork" ? rendered.origin : undefined,
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
    const content = contentRef.current;
    const media = mediaRef.current;
    const copy = copyRef.current;

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
      timeline
        .to([content ?? panel, panel, root], { opacity: 0, duration: OVERLAY_MOTION.fade, ease: OVERLAY_MOTION.ease }, 0);
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

      const detailSwap = isSameDetailType(state, rendered);
      if (reducedMotion || (detailSwap ? !media || !copy : !content)) {
        if (returningToCatalog) skipCatalogEntrance.current = true;
        setRendered(state);
        return;
      }

      const direction = isDetailState(state) ? (state.navigationDirection ?? 1) : 1;
      const timeline = gsap.timeline({
        defaults: { overwrite: true },
        onComplete: () => setRendered(state),
      });

      if (returningToCatalog && panel) {
        timeline
          .to(content ?? panel, { opacity: 0, duration: OVERLAY_MOTION.fade, ease: OVERLAY_MOTION.ease }, 0)
          .to(panel, {
            opacity: 0,
            duration: OVERLAY_MOTION.fade,
            ease: OVERLAY_MOTION.ease,
            onComplete: () => {
            skipCatalogEntrance.current = true;
            setRendered(state);
            window.requestAnimationFrame(() => catalogReturnFocus.current?.focus({ preventScroll: true }));
            },
          }, 0.03);
      } else if (detailSwap && media && copy) {
        timeline
          .to(copy, { opacity: 0, duration: OVERLAY_MOTION.fade, ease: OVERLAY_MOTION.ease }, 0)
          .to(media, { opacity: 0, duration: OVERLAY_MOTION.fade, ease: OVERLAY_MOTION.ease }, 0);
      } else if (content) {
        timeline.to(content, {
          opacity: 0,
          duration: OVERLAY_MOTION.fade,
          ease: OVERLAY_MOTION.ease,
        });
      }

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
      gsap.set([root, panel, content, mediaRef.current, copyRef.current].filter(Boolean), { clearProps: "all" });
      panel.focus({ preventScroll: true });
      wasOpen.current = true;
      return;
    }

    if (!wasOpen.current) {
      lastFocused.current = document.activeElement as HTMLElement;
      gsap.set(root, { opacity: 0 });
      const timeline = gsap.timeline({ defaults: { ease: OVERLAY_MOTION.ease } });

      if (isDetailState(rendered) && mediaRef.current && copyRef.current) {
        gsap.set([panel, mediaRef.current, copyRef.current], { opacity: 0 });
        timeline
          .to(root, { opacity: 1, duration: OVERLAY_MOTION.fade, clearProps: "opacity" }, 0)
          .to(panel, { opacity: 1, duration: OVERLAY_MOTION.fade, clearProps: "opacity" }, 0)
          .fromTo(
            mediaRef.current,
            { opacity: 0 },
            { opacity: 1, duration: OVERLAY_MOTION.fade, clearProps: "opacity" },
            0,
          )
          .fromTo(
            copyRef.current,
            { opacity: 0 },
            { opacity: 1, duration: OVERLAY_MOTION.fade, clearProps: "opacity" },
            0,
          );
      } else {
        gsap.set([panel, content], { opacity: 0 });
        timeline
          .to(root, { opacity: 1, duration: OVERLAY_MOTION.fade, clearProps: "opacity" }, 0)
          .to(panel, { opacity: 1, duration: OVERLAY_MOTION.fade, clearProps: "opacity" }, 0)
          .to(content, { opacity: 1, duration: OVERLAY_MOTION.fade, clearProps: "opacity" }, 0);
      }
      panel.focus({ preventScroll: true });
      wasOpen.current = true;
      return () => {
        timeline.kill();
      };
    }

    const detailSwap = isDetailState(rendered) && Boolean(rendered.navigationDirection);
    const direction = isDetailState(rendered) ? (rendered.navigationDirection ?? 1) : 1;
    const timeline = gsap.timeline({ defaults: { overwrite: true } });

    if (isDetailState(rendered) && mediaRef.current && copyRef.current) {
      if (!detailSwap && panel) {
        timeline.fromTo(
          panel,
          { opacity: 0 },
          { opacity: 1, duration: OVERLAY_MOTION.fade, ease: OVERLAY_MOTION.ease, clearProps: "opacity" },
          0,
        );
      }
      timeline
        .fromTo(
          mediaRef.current,
          { opacity: 0 },
          { opacity: 1, duration: OVERLAY_MOTION.fade, ease: OVERLAY_MOTION.ease, clearProps: "opacity" },
          0,
        )
        .fromTo(
          copyRef.current,
          { opacity: 0 },
          { opacity: 1, duration: OVERLAY_MOTION.fade, ease: OVERLAY_MOTION.ease, clearProps: "opacity" },
          0,
        );
    } else {
      timeline.fromTo(
        content,
        { opacity: 0, y: -8 },
        {
          opacity: 1,
          y: 0,
          duration: MOTION.base,
          ease: MOTION.easeOut,
          clearProps: "transform,opacity",
        },
      );
    }
    if (!detailSwap) panel.focus({ preventScroll: true });
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
        urls.push(projectImageFor(project));
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

      if (rendered.type === "project" && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
        navigateProject(event.key === "ArrowLeft" ? -1 : 1);
      }

      if (rendered.type === "artwork" && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
        navigateArtwork(event.key === "ArrowLeft" ? -1 : 1);
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
  const catalogPanelClass = `flex h-[88vh] w-full flex-col overflow-hidden rounded-[18px] bg-chalk outline-none dark:bg-[#191a1f] dark:shadow-[0_34px_110px_rgba(0,0,0,0.72),0_0_48px_rgba(255,255,255,0.06)] ${
    backgroundCatalog === "all-projects" ? "max-w-6xl md:h-[46rem]" : "max-w-7xl"
  }`;
  const cuboDetail = rendered.type === "project" && rendered.project.id === "cubo";
  const detailPanelClass = `${cuboDetail ? "h-[92dvh] max-w-7xl" : "h-[min(46rem,86dvh)] max-w-5xl"} w-full overflow-hidden rounded-[18px] bg-chalk outline-none dark:bg-[#191a1f] dark:shadow-[0_34px_110px_rgba(0,0,0,0.72),0_0_48px_rgba(255,255,255,0.06)]`;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-50 grid place-items-center bg-ink/72 px-4 py-6 backdrop-blur-md dark:bg-black/82"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeCurrentView();
      }}
    >
      {detail && !cuboDetail && (
        <DesktopDetailNavigation
          noun={rendered.type === "project" ? "project" : "artwork"}
          onPrevious={() => rendered.type === "project" ? navigateProject(-1) : navigateArtwork(-1)}
          onNext={() => rendered.type === "project" ? navigateProject(1) : navigateArtwork(1)}
        />
      )}
      {backgroundCatalog && (
        <section
          ref={catalog ? panelRef : undefined}
          className={`${catalogPanelClass} col-start-1 row-start-1 ${stackedDetail ? "pointer-events-none scale-[0.975] blur-md transition-[transform,filter] duration-200" : ""}`}
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
              <ArtworkView artwork={rendered.artwork} mediaRef={mediaRef} copyRef={copyRef} onNavigate={navigateArtwork} onClose={closeCurrentView} />
            )}
          </div>
        </section>
      )}
    </div>
  );
}

function overlayLabel(state: OverlayState) {
  if (state.type === "project") return `${state.project.title} project details`;
  if (state.type === "artwork") return `${state.artwork.title} artwork details`;
  return state.type === "all-projects" ? "All projects" : "All artwork";
}

function CloseButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      className="shrink-0 rounded-full bg-[#d2d2d7]/70 p-3 text-ink transition-[background-color,color,transform] duration-300 hover:rotate-90 hover:bg-[#d2d2d7] active:scale-95 dark:bg-[#2a2b32] dark:text-white dark:hover:bg-[#343640]"
      aria-label={label}
      onClick={onClick}
    >
      <X size={20} />
    </button>
  );
}

function DesktopDetailNavigation({
  noun,
  onPrevious,
  onNext,
}: {
  noun: "project" | "artwork";
  onPrevious: () => void;
  onNext: () => void;
}) {
  const buttonClass =
    "group absolute top-1/2 z-20 hidden h-12 -translate-y-1/2 items-center gap-2 rounded-full border border-transparent bg-white px-5 text-sm font-semibold text-ink shadow-[0_18px_44px_rgba(0,0,0,0.28)] transition-[background-color,border-color,box-shadow,transform] duration-300 ease-out hover:scale-[1.03] hover:bg-[#f5f5f7] hover:shadow-[0_22px_54px_rgba(0,0,0,0.34)] active:scale-[0.97] dark:border-white/10 dark:bg-[#24252b] dark:text-white dark:shadow-[0_18px_44px_rgba(0,0,0,0.48)] dark:hover:bg-[#303139] dark:hover:shadow-[0_22px_54px_rgba(0,0,0,0.58)] xl:inline-flex";

  return (
    <>
      <button
        type="button"
        className={`${buttonClass} left-4 2xl:left-10`}
        aria-label={`Previous ${noun}`}
        onClick={onPrevious}
      >
        <ChevronLeft size={18} />
        Back
      </button>
      <button
        type="button"
        className={`${buttonClass} right-4 2xl:right-10`}
        aria-label={`Next ${noun}`}
        onClick={onNext}
      >
        Next
        <ChevronRight size={18} />
      </button>
    </>
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

  return (
    <div className="detail-scrollbar relative h-full touch-pan-y overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch] lg:overflow-hidden">
      <OverlayArrow direction="previous" onClick={() => onNavigate(-1)} label="Previous project" />
      <OverlayArrow direction="next" onClick={() => onNavigate(1)} label="Next project" />
      <div className="absolute right-4 top-4 z-30 md:right-6 md:top-6">
        <CloseButton label="Close project details" onClick={onClose} />
      </div>
      <div className="grid min-h-full lg:h-full lg:min-h-0 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-[20rem] overflow-hidden bg-[var(--model-viewer-bg)] lg:min-h-0">
          <div ref={mediaRef} className="absolute inset-0">
            <img src={projectImageFor(project)} alt="" className="h-full min-h-[20rem] w-full object-cover" />
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
  onNavigate,
  onClose,
}: {
  artwork: Artwork;
  mediaRef: React.RefObject<HTMLDivElement | null>;
  copyRef: React.RefObject<HTMLDivElement | null>;
  onNavigate: (offset: -1 | 1) => void;
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const artworkImage = artwork.kind === "2D" ? artworkImageFor(artwork, 1800, 2400) : null;

  return (
    <div className="detail-scrollbar relative h-full touch-pan-y overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch] lg:overflow-hidden">
      <OverlayArrow direction="previous" onClick={() => onNavigate(-1)} label="Previous artwork" />
      <OverlayArrow direction="next" onClick={() => onNavigate(1)} label="Next artwork" />
      <div className="absolute right-4 top-4 z-30 md:right-6 md:top-6">
        <CloseButton label="Close artwork details" onClick={onClose} />
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
                  className="absolute left-4 top-4 z-10 grid size-11 place-items-center rounded-full bg-white text-ink shadow-[0_18px_44px_rgba(0,0,0,0.28)] transition-[background-color,color,box-shadow,transform] duration-300 hover:scale-[1.04] hover:bg-[#f5f5f7] active:scale-95 dark:bg-[#24252b] dark:text-white dark:shadow-[0_18px_44px_rgba(0,0,0,0.48)] dark:hover:bg-[#303139] md:bottom-4 md:left-auto md:right-4 md:top-auto md:size-12"
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
        <ExpandedArtworkViewer
          open={expanded}
          src={artworkImage}
          title={artwork.title}
          onClose={() => setExpanded(false)}
        />
      )}
    </div>
  );
}

function ExpandedArtworkViewer({
  open,
  src,
  title,
  onClose,
}: {
  open: boolean;
  src: string;
  title: string;
  onClose: () => void;
}) {
  const [present, setPresent] = useState(open);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (open) setPresent(true);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopImmediatePropagation();
      onClose();
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [onClose, open]);

  useLayoutEffect(() => {
    if (!present) return;

    const root = rootRef.current;
    const image = imageRef.current;
    if (!root || !image) return;

    if (reducedMotion) {
      gsap.set([root, image], { clearProps: "all" });
      if (!open) setPresent(false);
      return;
    }

    const timeline = gsap.timeline({
      defaults: { overwrite: true },
      onComplete: () => {
        if (!open) setPresent(false);
      },
    });

    if (open) {
      timeline
        .fromTo(root, { opacity: 0 }, { opacity: 1, duration: MOTION.base, ease: MOTION.easeOut }, 0)
        .fromTo(
          image,
          { opacity: 0, scale: 0.985 },
          { opacity: 1, scale: 1, duration: MOTION.base, ease: MOTION.easeOut, clearProps: "transform,opacity" },
          0.04,
        );
    } else {
      timeline
        .to(image, { opacity: 0, scale: 0.985, duration: MOTION.fast, ease: "power2.in" }, 0)
        .to(root, { opacity: 0, duration: MOTION.fast, ease: "power2.in" }, 0.04);
    }

    return () => {
      timeline.kill();
    };
  }, [open, present, reducedMotion]);

  if (!present) return null;

  return createPortal(
    <div
      ref={rootRef}
      className="fixed inset-0 z-[80] grid place-items-center bg-[rgba(245,245,247,0.86)] p-4 backdrop-blur-2xl dark:bg-[rgba(0,0,0,0.86)]"
      role="dialog"
      aria-modal="true"
      aria-label={`${title} expanded artwork`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-white/10 dark:bg-[rgba(0,0,0,0.18)]" aria-hidden="true" />
      <button
        type="button"
        className="absolute right-4 top-4 z-10 rounded-full bg-[rgba(29,29,31,0.72)] p-3 text-white shadow-[0_18px_44px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-[background-color,transform] duration-300 hover:rotate-90 hover:bg-[rgba(29,29,31,0.86)] active:scale-95 dark:bg-white/16 dark:hover:bg-white/24 md:right-6 md:top-6"
        aria-label="Close expanded artwork"
        onClick={onClose}
      >
        <X size={21} />
      </button>
      <img
        ref={imageRef}
        src={src}
        alt={title}
        className="relative z-10 max-h-[92dvh] max-w-[94vw] object-contain shadow-[0_28px_90px_rgba(0,0,0,0.46)]"
      />
    </div>,
    document.body,
  );
}

function OverlayArrow({ direction, onClick, label }: { direction: "previous" | "next"; onClick: () => void; label: string }) {
  const previous = direction === "previous";
  return (
    <div className={`pointer-events-none absolute inset-y-0 z-20 flex items-center px-2 md:px-5 xl:hidden ${previous ? "left-0 bg-gradient-to-r from-ink/34 to-transparent" : "right-0 bg-gradient-to-l from-ink/34 to-transparent"}`}>
      <button type="button" className="pointer-events-auto grid size-11 place-items-center rounded-full bg-white text-ink shadow-[0_18px_44px_rgba(0,0,0,0.24)] transition-[background-color,color,transform] duration-300 hover:scale-105 hover:bg-ink hover:text-white active:scale-95 dark:bg-ink dark:text-white dark:hover:bg-white dark:hover:text-ink" aria-label={label} onClick={onClick}>
        {previous ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>
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
          {filtered.map((project) => <button key={project.id} type="button" className="catalog-card group grid overflow-hidden rounded-[18px] bg-canvas text-left shadow-[0_12px_30px_rgba(29,29,31,0.06)] outline-none transition-shadow duration-500 hover:shadow-[0_18px_46px_rgba(29,29,31,0.12)] focus-visible:ring-4 focus-visible:ring-blueFocus/35 dark:bg-[#24252b] sm:grid-cols-[11rem_1fr]" onClick={() => onChange({ type: "project", project, origin: "all-projects" })}><div className="h-44 overflow-hidden sm:h-full"><img src={projectImageFor(project, 900, 700)} alt="" className="catalog-card-image catalog-project-image h-full w-full object-cover brightness-[0.72] contrast-[1.1] saturate-[0.76] transition-[transform,filter] duration-700 ease-out group-hover:scale-[1.035] group-hover:brightness-100 group-hover:contrast-100 group-hover:saturate-100" /></div><div className="p-5"><h3 className="text-2xl font-semibold">{project.title}</h3><p className="mt-3 text-sm leading-6 text-ink/70 dark:text-white/70">{project.summary}</p></div></button>)}
        </div>
        {!filtered.length && <EmptyResults noun="projects" />}
      </div>
    </>
  );
}

function AllArtworkView({ onChange }: { onChange: (state: OverlayState | null) => void }) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<"All" | Artwork["kind"]>("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const filtered = useMemo(() => artworks.filter((artwork) => {
    const text = [artwork.title, artwork.kind, artwork.medium, artwork.year, artwork.summary, artwork.description, ...artwork.tags].join(" ").toLowerCase();
    return text.includes(query.trim().toLowerCase()) && (kind === "All" || artwork.kind === kind);
  }), [kind, query]);

  useLayoutEffect(() => {
    if (reducedMotion || !resultsRef.current) return;
    const tween = gsap.fromTo(resultsRef.current.children, { opacity: 0, y: 4 }, { opacity: 1, y: 0, duration: 0.16, stagger: 0.01, ease: MOTION.easeOut, overwrite: true });
    return () => {
      tween.kill();
    };
  }, [filtered, reducedMotion]);

  return (
    <>
      <CatalogHeader title="All artwork" count={`${filtered.length} artwork results`} onClose={() => onChange(null)}>
        <SearchField value={query} onChange={setQuery} placeholder="Search artwork by title, medium, or tag" />
        <FilterMenu label={kind === "All" ? "Filter" : kind} open={filterOpen} setOpen={setFilterOpen} items={["All", "2D", "3D"]} selected={kind} onSelect={(item) => setKind(item as typeof kind)} />
      </CatalogHeader>
      <div className="detail-scrollbar flex-1 touch-pan-y overflow-y-auto overscroll-contain p-5 pt-3 md:p-8 md:pt-4">
        <div ref={resultsRef} className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
          {filtered.map((artwork) => <button key={artwork.id} type="button" className="catalog-card group mb-4 block w-full break-inside-avoid overflow-hidden rounded-[18px] bg-canvas text-left shadow-[0_12px_30px_rgba(29,29,31,0.06)] outline-none transition-shadow duration-500 hover:shadow-[0_18px_46px_rgba(29,29,31,0.12)] focus-visible:ring-4 focus-visible:ring-blueFocus/35 dark:bg-[#24252b]" onClick={() => onChange({ type: "artwork", artwork, origin: "all-artwork" })}><div className={`overflow-hidden ${artworkAspectClass(artwork)}`}>{artwork.kind === "3D" ? <DeferredModelViewer artwork={artwork} compact /> : <img src={artworkImageFor(artwork)} alt="" className="catalog-card-image catalog-artwork-image h-full w-full object-cover brightness-[0.86] contrast-[1.08] saturate-[0.82] transition-[transform,filter] duration-700 ease-out group-hover:scale-[1.045] group-hover:brightness-100 group-hover:contrast-100 group-hover:saturate-100" />}</div><div className="p-4"><div className="flex items-start justify-between gap-3"><h3 className="text-lg font-semibold">{artwork.title}</h3><span className="rounded-full bg-chalk px-2.5 py-1 text-xs font-semibold text-ink/55 dark:bg-[#30313a] dark:text-white/55">{artwork.kind}</span></div><p className="mt-1 text-sm text-ink/60 dark:text-white/60">{artwork.medium} · {artwork.year}</p></div></button>)}
        </div>
        {!filtered.length && <EmptyResults noun="artwork" />}
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

const cuboBrief = "I planned Cubo as a 2D Metroidvania and Souls-like set in an abandoned crystal mine. The original brief called for one uninterrupted world, a tutorial embedded into the map, a ground-slam attack instead of a conventional sword slash, fast traversal, two bosses, several enemy types, chests, and enough environmental detail to make the cave feel inhabited and old.";

const cuboSystems = [
  {
    title: "Input and movement",
    copy: "The first controller used Unity's legacy Input Manager. I rebuilt it with the New Input System when controller support and more complex actions became difficult to scale. The final movement set includes variable jump height, aerial ground slam, dash, stamina-based sprinting, wall climbing, gamepad support, and controller rumble.",
  },
  {
    title: "Combat and player feedback",
    copy: "Ground slam is the main attack and connects traversal directly to combat. Hits trigger a white damage-flash shader, while player damage uses screen shake and a red screen flash. The wider feedback loop includes a smooth health bar, stamina, floating damage numbers, respawn fades, temporary invulnerability during Soul Charge, and tuned knockback and stun timing.",
  },
  {
    title: "World interactions",
    copy: "Contextual tutorial triggers teach mechanics inside the level. Chests reward exploration, spike traps control movement, gates lock boss arenas, and a lever-driven elevator can be called from another floor before automatically returning to its starting position when it is no longer in use.",
  },
  {
    title: "Enemy behaviours",
    copy: "The roster began with a patrol enemy moving between points and taking damage from the slam. It grew to include wall-crawling Crystal Crawlers inspired by Hollow Knight's Tiktiks, spear-throwing guards, patrolling mushroom enemies, and the two multi-phase bosses. Respawn timing, health, knockback, bounce height, and arena placement were later rebalanced.",
  },
  {
    title: "Interface and accessibility",
    copy: "The main menu and pause menu share settings for master volume, fullscreen mode, and resolution. Cursor visibility changes correctly between play and pause. Tutorial prompts appear in context, and the title screen turns Cubo into the letter O while the character's eyes track the mouse through a raycast-driven effect.",
  },
  {
    title: "Replay and completion",
    copy: "An optional speedrun timer tracks runtime and stores the best completion time. Later releases added total death tracking to the end screen. The full objective ends when the player defeats both bosses, collects the Power Supply, returns to the opening area, and uses it to power the generator.",
  },
];

const cuboFlow = [
  ["Tutorial", "Contextual triggers introduce movement, interaction, damage, and the ground slam without leaving the connected map."],
  ["Exploration", "The player navigates caves, elevators, hazards, enemies, chests, and vertical routes while new movement options open more of the world."],
  ["First boss", "Grump Rock tracks and rolls at the player, then adds shard projectiles. Successful timing earns the Boulder Key."],
  ["Second boss", "The Boulder Key opens the route to Shackled Bomber. The player dodges dynamite, gathers three Soul Essences, and fires Soul Charge."],
  ["Completion", "After the second phase, the player claims the Power Supply and returns it to the tutorial-area generator to finish the level."],
];

function CuboProjectView({
  onNavigate,
  onClose,
}: {
  onNavigate: (offset: -1 | 1) => void;
  onClose: () => void;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [openChangelogVersion, setOpenChangelogVersion] = useState<string | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return;

    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".cubo-scroll-image").forEach((target) => {
        gsap.timeline({
          scrollTrigger: {
            trigger: target,
            scroller: root,
            start: "top 92%",
            end: "bottom 12%",
            scrub: 0.6,
          },
        })
          .fromTo(target, { scale: 0.88, opacity: 0.38, filter: "brightness(0.65)" }, { scale: 1, opacity: 1, filter: "brightness(1)", duration: 0.58 })
          .to(target, { opacity: 0.24, filter: "brightness(0.55)", duration: 0.42 });
      });

      const revealWords = gsap.utils.toArray<HTMLElement>(".cubo-reveal-copy span");
      if (revealWords.length) {
        gsap.fromTo(revealWords, { opacity: 0.12 }, {
          opacity: 1,
          stagger: 0.025,
          ease: "none",
          scrollTrigger: {
            trigger: ".cubo-reveal-copy",
            scroller: root,
            start: "top 82%",
            end: "bottom 42%",
            scrub: 0.5,
          },
        });
      }

    }, root);

    ScrollTrigger.refresh();
    return () => context.revert();
  }, [reducedMotion]);

  const scrollToStory = () => {
    const root = rootRef.current;
    const story = root?.querySelector<HTMLElement>(".cubo-story");
    if (!root || !story) return;
    const destination = story.getBoundingClientRect().top - root.getBoundingClientRect().top + root.scrollTop - 72;
    if (reducedMotion) {
      root.scrollTo({ top: destination, behavior: "auto" });
      return;
    }
    gsap.to(root, { scrollTop: destination, duration: 0.95, ease: MOTION.easeInOut, overwrite: true });
  };

  return (
    <div ref={rootRef} className="detail-scrollbar relative h-full overflow-x-hidden overflow-y-auto bg-[#0b0909] font-['Outfit'] text-white">
      <nav className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-[#0b0909]/82 px-5 py-4 backdrop-blur-xl md:px-8">
        <button type="button" onClick={scrollToStory} className="text-sm font-semibold tracking-[-0.01em] text-white transition-opacity hover:opacity-70">Cubo case study</button>
        <div className="flex items-center gap-3">
          <button type="button" onClick={scrollToStory} className="hidden text-sm text-white/62 transition-colors hover:text-white sm:block">Development story</button>
          <CloseButton label="Close Cubo project details" onClick={onClose} />
        </div>
      </nav>

      <header className="relative grid min-h-[36rem] place-items-center overflow-hidden px-6 py-20 text-center md:min-h-[40rem]">
        <img src={cuboImage("world.png")} alt="Cubo exploring the abandoned crystal mine" className="absolute inset-0 h-full w-full scale-105 object-cover opacity-70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(157,53,21,0.08),rgba(11,9,9,0.42)_42%,#0b0909_86%)]" />
        <div className="relative mx-auto w-full max-w-6xl">
          <h2 className="font-semibold leading-[0.82] tracking-[-0.07em] text-white [font-size:clamp(5.5rem,17vw,13rem)]">Cubo</h2>
          <p className="mx-auto mt-8 max-w-3xl text-balance text-xl leading-relaxed text-white/76 md:text-2xl">
            2D Metroidvania
          </p>
        </div>
      </header>

      <main className="w-full">
        <section className="mx-auto max-w-7xl px-5 py-32 md:px-8 md:py-44">
          <div className="mb-14 max-w-4xl">
            <h3 className="text-4xl font-semibold tracking-[-0.045em] md:text-7xl">Gameplay</h3>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/62">The ground slam shaped traversal, regular enemies, and the first boss. The rest of the game expands from that simple physical idea.</p>
          </div>
          <div className="grid grid-flow-dense gap-0 overflow-hidden rounded-[24px] md:grid-cols-4 md:grid-rows-2">
            <article className="relative min-h-[34rem] overflow-hidden md:col-span-2 md:row-span-2">
              <img src={cuboImage("exploration.png")} alt="Cubo moving through a warm crystal cave" className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/86 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7 md:p-9"><h4 className="text-3xl font-semibold">Ground slam combat</h4><p className="mt-3 max-w-lg leading-7 text-white/70">Jump, reach the apex, then drive downward to damage enemies, break the rhythm of a chase, or meet Grump Rock head-on.</p></div>
            </article>
            <article className="min-h-[17rem] bg-[#21120e] p-7 md:col-span-2 md:p-9"><h4 className="text-3xl font-semibold">Movement</h4><p className="mt-4 max-w-xl leading-7 text-white/65">Variable jumps, dashing, wall climbing, and controller rumble established the core feel. Sprinting later replaced the ground dash so players could evade the second boss more reliably.</p></article>
            <article className="min-h-[17rem] bg-[#d95f27] p-7 text-[#1b0d08] md:p-9"><h4 className="text-2xl font-semibold">Atmosphere</h4><p className="mt-4 leading-7 text-[#1b0d08]/76">Global Light 2D, warm spotlights, vignette, animated candles, fireflies, and reflected water give the mine its visual identity.</p></article>
            <article className="min-h-[17rem] bg-[#181515] p-7 md:p-9"><h4 className="text-2xl font-semibold">Player systems</h4><p className="mt-4 leading-7 text-white/62">Health, stamina, respawning, i-frames, damage numbers, tutorial triggers, settings, and optional speedrun timing support the full loop.</p></article>
          </div>
        </section>

        <section className="bg-[#f0e9df] px-5 py-32 text-[#1c1613] md:px-8 md:py-44">
          <div className="mx-auto max-w-7xl">
            <h3 className="max-w-6xl text-5xl font-semibold leading-[0.98] tracking-[-0.055em] md:text-8xl">
              Research
            </h3>
            <p className="cubo-reveal-copy mt-14 max-w-5xl text-2xl leading-[1.45] tracking-[-0.02em] text-[#1c1613] md:text-4xl">
              {cuboBrief.split(" ").map((word, index) => <span key={`${word}-${index}`}>{word} </span>)}
            </p>
            <div className="mt-24 grid gap-12 border-t border-[#1c1613]/18 pt-12 md:grid-cols-2 lg:grid-cols-4">
              <article><h4 className="text-xl font-semibold">Metroidvania foundations</h4><p className="mt-4 leading-7 text-[#1c1613]/66">Research into Metroid focused the project on non-linear exploration, backtracking, power-up gating, and allowing the player to discover their own route and pace. The world uses environment and mechanical progression instead of relying on cutscenes or long dialogue.</p></article>
              <article><h4 className="text-xl font-semibold">Hollow Knight</h4><p className="mt-4 leading-7 text-[#1c1613]/66">The strongest influence was its cohesive, moody world, the way player and enemy designs feel part of the same place, environmental storytelling, and bosses that reward specific attacks or abilities.</p></article>
              <article><h4 className="text-xl font-semibold">Celeste and Rayman</h4><p className="mt-4 leading-7 text-[#1c1613]/66">Celeste informed clean platform readability and supported the decision to simplify the player into a geometric cube. Rayman Legends influenced layered environmental detail and bright, warm accents against dark surroundings.</p></article>
              <article><h4 className="text-xl font-semibold">Boss references</h4><p className="mt-4 leading-7 text-[#1c1613]/66">Grump Rock began with Elden Ring's rolling boulder enemy in mind. Shackled Bomber combines Touhou-style projectile pressure with the collect-and-fire rhythm of Soul Essence and Soul Charge, inspired by Critical.</p></article>
            </div>
          </div>
        </section>

        <section className="bg-[#151110] px-5 py-32 md:px-8 md:py-44">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-5xl"><h3 className="text-5xl font-semibold tracking-[-0.05em] md:text-8xl">Systems</h3><p className="mt-7 max-w-3xl text-lg leading-8 text-white/60">Cubo grew from a movement prototype into a complete playable loop. These are the systems documented across the build.</p></div>
            <div className="mt-20 border-y border-white/12">
              {cuboSystems.map((system, index) => (
                <article key={system.title} className="grid gap-4 border-b border-white/12 py-9 last:border-b-0 md:grid-cols-[0.7fr_1.3fr] md:gap-16 md:py-12">
                  <h4 className="text-2xl font-semibold md:text-3xl">{system.title}</h4>
                  <p className="max-w-3xl text-base leading-8 text-white/62">{system.copy}</p>
                  <span className="sr-only">System {index + 1}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-32 md:px-8 md:py-44">
          <div className="grid gap-16 lg:grid-cols-[0.78fr_1.22fr] lg:gap-24">
            <div><h3 className="text-5xl font-semibold tracking-[-0.05em] md:text-7xl">Engineering</h3><p className="mt-7 text-lg leading-8 text-white/60">Several systems changed because the first solution was too restrictive, too complex, or failed under real play.</p></div>
            <div className="space-y-14">
              <article><h4 className="text-2xl font-semibold">Input system</h4><p className="mt-4 leading-8 text-white/62">The legacy Input Manager worked for basic movement but became difficult once controller support, rumble, variable jump height, ground slam, and dashing shared the same controller. Moving to the New Input System gave each action a cleaner input path and made keyboard and gamepad behaviour consistent.</p></article>
              <article><h4 className="text-2xl font-semibold">Elevator system</h4><p className="mt-4 leading-8 text-white/62">An elevator tutorial produced a system that was more complex than this level needed and caused errors when customised. I replaced it with a smaller modular script. The lever can call the platform from the opposite floor, and the reset logic returns it when idle. ChatGPT helped produce and refine this targeted implementation.</p></article>
              <article><h4 className="text-2xl font-semibold">Projectile debugging</h4><p className="mt-4 leading-8 text-white/62">Shackled Bomber's dynamite targeting produced repeated errors. Debug logs narrowed the issue to the projectile logic, and the fix was tested in the arena rather than treated as an isolated script change. The same practical workflow supported the damage-flash shader and other feedback scripts.</p></article>
              <article><h4 className="text-2xl font-semibold">Playtesting</h4><p className="mt-4 leading-8 text-white/62">Playtesting showed that the original ground dash did not give players enough control to avoid repeated dynamite. A stamina-based sprint replaced it on the ground. Soul Charge also gained temporary invulnerability so a successful attack could not be cancelled by unavoidable contact during its animation.</p></article>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-32 md:px-8 md:py-44">
          <div className="grid gap-14 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <div><h3 className="text-5xl font-semibold tracking-[-0.05em] md:text-7xl">Art and assets</h3><p className="mt-7 text-lg leading-8 text-white/60">I made the game assets in Aseprite and used the visual constraints to keep production realistic while still building a distinct cave.</p></div>
            <div className="cubo-scroll-image overflow-hidden rounded-[24px]"><img src={cuboImage("world.png")} alt="Cubo's layered mine environment with crystals, lanterns, and mining structures" className="w-full object-cover" /></div>
          </div>
          <div className="mt-20 grid gap-x-14 gap-y-16 border-t border-white/12 pt-12 md:grid-cols-2">
            <article><h4 className="text-2xl font-semibold">Player design</h4><p className="mt-4 leading-7 text-white/62">Early player sprites were more complex, but detailed frame-by-frame animation would have consumed too much of the schedule. I changed the player to a simple cube so I could iterate on movement states quickly, keep the silhouette readable, and spend more time on mechanics and level design.</p></article>
            <article><h4 className="text-2xl font-semibold">Environment assets</h4><p className="mt-4 leading-7 text-white/62">The cave was assembled from a rocky ground tileset plus foliage, crystals, crates, minecarts, platforms, railings, lanterns, candles, mining equipment, and smaller dressing assets. Reusable tilemaps let those pieces form one large connected level.</p></article>
            <article><h4 className="text-2xl font-semibold">Lighting and post-processing</h4><p className="mt-4 leading-7 text-white/62">Global Light 2D establishes a dark baseline. Spot Light 2D components create warm pools around candles and lanterns, while a Global Volume adds vignette and colour correction. Animated candle sprites and firefly particles stop the still cave from feeling lifeless.</p></article>
            <article><h4 className="text-2xl font-semibold">Reflected water</h4><p className="mt-4 leading-7 text-white/62">The water effect uses a custom shader and a secondary camera to capture a reflected layer in real time. Ripple and distortion values deform that reflection, giving a stronger sense of movement and depth than a static surface.</p></article>
          </div>
        </section>

        <section className="cubo-story mx-auto grid max-w-7xl gap-16 px-5 py-32 md:px-8 md:py-44 lg:grid-cols-[0.72fr_1.28fr] lg:gap-24">
          <div className="h-fit max-w-md">
            <h3 className="text-5xl font-semibold tracking-[-0.05em] md:text-7xl">Level design</h3>
            <p className="mt-7 text-lg leading-8 text-white/58">I kept the tutorial inside the same scene so learning flows directly into exploration without breaking the world apart.</p>
          </div>
          <div className="space-y-28">
            <figure>
              <div className="cubo-scroll-image overflow-hidden rounded-[22px] bg-black"><img src={cuboImage("connected-map.png")} alt="Wide view of Cubo's connected cave map" className="aspect-video w-full object-cover" /></div>
              <figcaption className="mt-5 max-w-2xl text-base leading-7 text-white/58">The connected layout combines contextual tutorials, vertical routes, hazards, chests, and gated encounters in one continuous cave system.</figcaption>
            </figure>
            <figure>
              <div className="cubo-scroll-image overflow-hidden rounded-[22px] bg-black"><img src={cuboImage("elevator.png")} alt="Cubo's elevator room in the crystal mine" className="aspect-video w-full object-cover" /></div>
              <figcaption className="mt-5 max-w-2xl text-base leading-7 text-white/58">A modular lever system calls the elevator between floors and returns it to its starting position when it is no longer needed.</figcaption>
            </figure>
            <figure>
              <div className="cubo-scroll-image overflow-hidden rounded-[22px] bg-black"><img src={cuboImage("player-animator.png")} alt="Unity Animator graph for Cubo's player movement states" className="aspect-video w-full object-cover" /></div>
              <figcaption className="mt-5 max-w-2xl text-base leading-7 text-white/58">The New Input System supports keyboard and gamepad while the Animator coordinates idle, run, jump, landing, dash, and slam states.</figcaption>
            </figure>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-32 md:px-8 md:py-44">
          <div className="max-w-4xl"><h3 className="text-5xl font-semibold tracking-[-0.05em] md:text-7xl">Bosses</h3><p className="mt-7 max-w-2xl text-lg leading-8 text-white/60">Each encounter tests a different reading of the player's abilities while maintaining the Metroidvania progression between them.</p></div>
          <div className="mt-16 flex flex-col gap-4 lg:h-[34rem] lg:flex-row">
            <article className="group relative min-h-[28rem] flex-1 overflow-hidden rounded-[24px] transition-[flex] duration-700 ease-out hover:flex-[1.35]">
              <img src={cuboImage("grump-rock.png")} alt="Grump Rock rolling toward Cubo" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/12 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7 md:p-9"><h4 className="text-3xl font-semibold">Grump Rock</h4><p className="mt-3 max-w-xl leading-7 text-white/70">The arena gates close and the boss tracks and rolls toward the player, forcing a jump and downward slam at the moment of impact. A visible parry ring rewards perfect timing with bonus damage. The second phase adds thrown crystal shards, and victory opens a reward room containing the Boulder Key.</p></div>
            </article>
            <article className="group relative min-h-[28rem] flex-1 overflow-hidden rounded-[24px] transition-[flex] duration-700 ease-out hover:flex-[1.35]">
              <img src={cuboImage("shackled-bomber.png")} alt="Cubo facing the suspended Shackled Bomber" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/12 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7 md:p-9"><h4 className="text-3xl font-semibold">Shackled Bomber</h4><p className="mt-3 max-w-xl leading-7 text-white/70">The Boulder Key unlocks a boss positioned out of reach on the roof. Players sprint through dynamite patterns, collect three Soul Essences, and fire an invulnerable Soul Charge. In phase two the boss drops to the floor and bounces across the arena, returning the fight to ground-slam timing.</p></div>
            </article>
          </div>
          <div className="mt-16 grid gap-10 border-t border-white/12 pt-12 md:grid-cols-2">
            <article><h4 className="text-2xl font-semibold">Boss mechanics</h4><p className="mt-4 leading-8 text-white/62">The boss research looked at attacks that are unusually effective against a specific enemy, including Howling Wraiths against the stationary Flukemarm and missiles fired into Kraid's open mouth. Cubo applies the same principle by making the slam the natural answer to Grump Rock's low rolling body.</p></article>
            <article><h4 className="text-2xl font-semibold">Boss progression</h4><p className="mt-4 leading-8 text-white/62">The encounters also act as progression gates. Grump Rock teaches the core attack and awards the key to Shackled Bomber. The second fight introduces a different resource-and-projectile loop before bringing the slam back in its final phase, linking the two lessons together.</p></article>
          </div>
        </section>

        <section className="bg-[#d95f27] px-5 py-32 text-[#1b0d08] md:px-8 md:py-44">
          <div className="mx-auto max-w-7xl">
            <h3 className="max-w-5xl text-5xl font-semibold tracking-[-0.055em] md:text-8xl">Player progression</h3>
            <div className="mt-20 border-y border-[#1b0d08]/20">
              {cuboFlow.map(([title, copy], index) => (
                <article key={title} className="grid gap-4 border-b border-[#1b0d08]/20 py-8 last:border-b-0 md:grid-cols-[5rem_0.65fr_1.35fr] md:items-start md:gap-10 md:py-10">
                  <p className="text-sm font-semibold tabular-nums text-[#1b0d08]/52">{String(index + 1).padStart(2, "0")}</p>
                  <h4 className="text-2xl font-semibold md:text-3xl">{title}</h4>
                  <p className="max-w-3xl leading-8 text-[#1b0d08]/72">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f0e9df] px-5 py-32 text-[#1c1613] md:px-8 md:py-44">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-14 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
              <div><h3 className="text-5xl font-semibold tracking-[-0.05em] md:text-7xl">Interface</h3><p className="mt-7 text-lg leading-8 text-[#1c1613]/62">The main and pause menus include master volume, fullscreen, and resolution controls, with settings synchronised across scenes. Cursor visibility changes between gameplay and menu states, and later hotfixes protected button input after display changes.</p><p className="mt-5 text-lg leading-8 text-[#1c1613]/62">The optional speedrun timer records runtime and best completion time, while later builds added total death tracking to the end screen. On the title screen, Cubo replaces the letter O and its eyes follow the mouse through a raycast-driven effect.</p></div>
              <img src={cuboImage("main-menu.png")} alt="Cubo's main menu with the character forming the letter O" className="w-full rounded-[22px] shadow-[0_32px_80px_rgba(53,31,18,0.2)]" />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-32 md:px-8 md:py-44">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div className="cubo-scroll-image overflow-hidden rounded-[24px]"><img src={cuboImage("version-control.png")} alt="Cubo's private GitHub repository and organised Unity project history" className="w-full object-cover" /></div>
            <div><h3 className="text-5xl font-semibold tracking-[-0.05em] md:text-7xl">Development workflow</h3><p className="mt-7 text-lg leading-8 text-white/60">The Unity hierarchy was kept organised, and assets were separated into folders and subfolders so scenes, sprites, animation, enemies, UI, and scripts remained manageable as the project expanded.</p><p className="mt-5 text-lg leading-8 text-white/60">GitHub version control tracked the project throughout development and supported the post-submission release history. Player and enemy behaviours were separated into focused scripts, while debug logs were used to trace targeting and interaction problems before changes were tested in context.</p></div>
          </div>
        </section>

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

        <section className="relative overflow-hidden px-5 py-24 text-center md:px-8 md:py-32">
          <img src={cuboImage("pause-menu.png")} alt="Cubo paused inside the Crystal Caverns" className="absolute inset-0 h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(11,9,9,0.28),#0b0909_78%)]" />
          <div className="relative mx-auto max-w-4xl"><h3 className="text-5xl font-semibold tracking-[-0.055em] md:text-8xl">Reflection</h3><p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-white/66">Cubo taught me to protect the core feel of a game while changing the systems around it. I simplified the character art to prioritise mechanics, refactored input when the first approach became limiting, and used playtesting to reshape movement for the second boss.</p><p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/66">The main weakness remains character animation. Several enemies still lack dedicated attack or stun states because I was building confidence with fluid frame-by-frame work. A save and load system was also cut to keep the original schedule achievable. Those are the clearest priorities for the next development pass.</p><button type="button" onClick={() => onNavigate(1)} className="mt-10 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-[#171111] transition-transform hover:scale-[1.03] active:scale-95">Continue to next project <ArrowUpRight size={18} /></button></div>
        </section>
      </main>
    </div>
  );
}

function FilterMenu({ label, open, setOpen, items, selected, onSelect }: { label: string; open: boolean; setOpen: (open: boolean) => void; items: string[]; selected: string; onSelect: (item: string) => void }) {
  return <div className="relative w-full md:w-auto"><button type="button" className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-canvas px-5 text-sm font-medium shadow-[0_6px_18px_rgba(29,29,31,0.18)] transition-[background-color,box-shadow,transform] duration-300 hover:shadow-[0_8px_22px_rgba(29,29,31,0.24)] active:scale-95 dark:bg-[#24252b] dark:text-white md:w-auto" aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen(!open)}><SlidersHorizontal size={17} />{label}</button>{open && <div className="filter-menu absolute left-0 right-0 top-14 z-30 w-full rounded-[18px] bg-canvas p-2 shadow-[0_10px_28px_rgba(29,29,31,0.22)] dark:bg-[#24252b] md:left-auto md:w-48" role="menu">{items.map((item) => <button key={item} type="button" className={`flex w-full items-center justify-between rounded-[14px] px-4 py-3 text-left text-sm font-medium transition-[background-color] duration-200 ${selected === item ? "bg-ink text-white dark:bg-white dark:text-ink" : "text-ink/70 hover:bg-chalk dark:text-white/70 dark:hover:bg-white/10"}`} role="menuitemradio" aria-checked={selected === item} onClick={() => { onSelect(item); setOpen(false); }}>{item}{selected === item && <Check size={16} className="filter-check" />}</button>)}</div>}</div>;
}

function EmptyResults({ noun }: { noun: string }) {
  return <div className="empty-results rounded-[18px] bg-canvas p-10 text-center dark:bg-[#24252b]"><p className="text-lg font-medium">No {noun} found</p><p className="mt-2 text-sm text-ink/60 dark:text-white/60">Try a different title, medium, tool, or keyword.</p></div>;
}
