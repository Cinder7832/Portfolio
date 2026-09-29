import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
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

type CatalogOverlayType = "all-projects" | "all-artwork";

export type OverlayState =
  | { type: "all-projects" }
  | { type: "project"; project: Project; navigationDirection?: -1 | 1; origin?: "all-projects" }
  | { type: "all-artwork" }
  | { type: "artwork"; artwork: Artwork; navigationDirection?: -1 | 1; origin?: "all-artwork" };

const imageFor = (seed: string, width = 1920, height = 1080) =>
  `https://picsum.photos/seed/${seed}/${width}/${height}`;

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
        .to(panel, { opacity: 0, y: 16, scale: 0.985, duration: MOTION.fast, ease: "power2.in" }, 0)
        .to(root, { opacity: 0, duration: MOTION.fast, ease: "power2.in" }, 0.04);
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
        timeline.to(panel, {
          opacity: 0,
          duration: MOTION.fast,
          ease: "power2.in",
          onComplete: () => {
            skipCatalogEntrance.current = true;
            setRendered(state);
            window.requestAnimationFrame(() => catalogReturnFocus.current?.focus({ preventScroll: true }));
          },
        });
      } else if (detailSwap && media && copy) {
        timeline
          .to(copy, { opacity: 0, x: direction * -8, duration: MOTION.fast, ease: "power2.in" }, 0)
          .to(media, { opacity: 0, duration: MOTION.fast, ease: "power2.in" }, 0);
      } else if (content) {
        timeline.to(content, {
          opacity: 0,
          y: 10,
          duration: MOTION.fast,
          ease: "power2.in",
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
      const timeline = gsap.timeline({ defaults: { ease: MOTION.easeOut } });

      if (isDetailState(rendered) && mediaRef.current && copyRef.current) {
        gsap.set(panel, { opacity: 0 });
        timeline
          .to(root, { opacity: 1, duration: MOTION.base, clearProps: "opacity" }, 0)
          .to(panel, { opacity: 1, duration: MOTION.base, clearProps: "opacity" }, 0.04)
          .fromTo(
            mediaRef.current,
            { opacity: 0 },
            { opacity: 1, duration: MOTION.base, clearProps: "opacity" },
            0.08,
          )
          .fromTo(
            copyRef.current,
            { opacity: 0, x: 8 },
            { opacity: 1, x: 0, duration: MOTION.base, clearProps: "transform,opacity" },
            0.08,
          );
      } else {
        gsap.set(panel, { opacity: 0, y: 8, scale: 0.995 });
        timeline
          .to(root, { opacity: 1, duration: 0.18, clearProps: "opacity" }, 0)
          .to(panel, { opacity: 1, y: 0, scale: 1, duration: 0.22, clearProps: "transform,opacity" }, 0.02)
          .fromTo(content, { opacity: 0 }, { opacity: 1, duration: 0.16, clearProps: "opacity" }, 0.04);
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
          { opacity: 0, scale: 0.985 },
          { opacity: 1, scale: 1, duration: MOTION.base, ease: MOTION.easeOut, clearProps: "transform,opacity" },
          0,
        );
      }
      timeline
        .fromTo(
          mediaRef.current,
          { opacity: 0 },
          { opacity: 1, duration: MOTION.base, ease: MOTION.easeOut, clearProps: "opacity" },
          0,
        )
        .fromTo(
          copyRef.current,
          { opacity: 0, x: direction * 8 },
          { opacity: 1, x: 0, duration: MOTION.base, ease: MOTION.easeOut, clearProps: "transform,opacity" },
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
        urls.push(imageFor(project.imageSeed));
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
  const detailPanelClass = "h-[min(46rem,86dvh)] w-full max-w-5xl overflow-hidden rounded-[18px] bg-chalk outline-none dark:bg-[#191a1f] dark:shadow-[0_34px_110px_rgba(0,0,0,0.72),0_0_48px_rgba(255,255,255,0.06)]";

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-50 grid place-items-center bg-ink/72 px-4 py-6 backdrop-blur-md dark:bg-black/82"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeCurrentView();
      }}
    >
      {detail && (
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
        <ChevronLeft size={18} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
        Back
      </button>
      <button
        type="button"
        className={`${buttonClass} right-4 2xl:right-10`}
        aria-label={`Next ${noun}`}
        onClick={onNext}
      >
        Next
        <ChevronRight size={18} className="transition-transform duration-300 group-hover:translate-x-0.5" />
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
            <img src={imageFor(project.imageSeed)} alt="" className="h-full min-h-[20rem] w-full object-cover" />
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
            {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 rounded-full px-[22px] py-[11px] text-[17px] font-medium transition-[background-color,box-shadow,transform] duration-300 hover:bg-white/70 active:scale-95 dark:text-white dark:hover:bg-white/10">Live site<ArrowUpRight size={17} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></a>}
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
          {filtered.map((project) => <button key={project.id} type="button" className="catalog-card group grid overflow-hidden rounded-[18px] bg-canvas text-left shadow-[0_12px_30px_rgba(29,29,31,0.06)] outline-none transition-shadow duration-500 hover:shadow-[0_18px_46px_rgba(29,29,31,0.12)] focus-visible:ring-4 focus-visible:ring-blueFocus/35 dark:bg-[#24252b] sm:grid-cols-[11rem_1fr]" onClick={() => onChange({ type: "project", project, origin: "all-projects" })}><div className="h-44 overflow-hidden sm:h-full"><img src={imageFor(project.imageSeed, 900, 700)} alt="" className="catalog-card-image catalog-project-image h-full w-full object-cover brightness-[0.72] contrast-[1.1] saturate-[0.76] transition-[transform,filter] duration-700 ease-out group-hover:scale-[1.035] group-hover:brightness-100 group-hover:contrast-100 group-hover:saturate-100" /></div><div className="p-5"><h3 className="text-2xl font-semibold">{project.title}</h3><p className="mt-3 text-sm leading-6 text-ink/70 dark:text-white/70">{project.summary}</p></div></button>)}
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
    <label className="flex h-12 min-h-12 w-full min-w-0 flex-none items-center gap-3 rounded-full bg-white/90 px-5 text-ink shadow-[0_14px_34px_rgba(29,29,31,0.07)] dark:bg-[#24252b] dark:text-white md:h-11 md:min-h-11 md:flex-1">
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

function FilterMenu({ label, open, setOpen, items, selected, onSelect }: { label: string; open: boolean; setOpen: (open: boolean) => void; items: string[]; selected: string; onSelect: (item: string) => void }) {
  return <div className="relative w-full md:w-auto"><button type="button" className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-canvas px-5 text-sm font-medium transition-[background-color,color,transform] duration-300 active:scale-95 dark:bg-[#24252b] dark:text-white md:w-auto" aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen(!open)}><SlidersHorizontal size={17} />{label}</button>{open && <div className="filter-menu absolute left-0 right-0 top-14 z-30 w-full rounded-[18px] bg-canvas p-2 shadow-[0_18px_48px_rgba(29,29,31,0.16)] dark:bg-[#24252b] md:left-auto md:w-48" role="menu">{items.map((item) => <button key={item} type="button" className={`flex w-full items-center justify-between rounded-[14px] px-4 py-3 text-left text-sm font-medium transition-[background-color] duration-200 ${selected === item ? "bg-ink text-white dark:bg-white dark:text-ink" : "text-ink/70 hover:bg-chalk dark:text-white/70 dark:hover:bg-white/10"}`} role="menuitemradio" aria-checked={selected === item} onClick={() => { onSelect(item); setOpen(false); }}>{item}{selected === item && <Check size={16} className="filter-check" />}</button>)}</div>}</div>;
}

function EmptyResults({ noun }: { noun: string }) {
  return <div className="empty-results rounded-[18px] bg-canvas p-10 text-center dark:bg-[#24252b]"><p className="text-lg font-medium">No {noun} found</p><p className="mt-2 text-sm text-ink/60 dark:text-white/60">Try a different title, medium, tool, or keyword.</p></div>;
}
