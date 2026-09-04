import { useEffect, useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Github,
  Linkedin,
  Mail,
  Menu,
  Moon,
  MoveRight,
  FileText,
  SlidersHorizontal,
  Search,
  Sun,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Artwork, Project, artworks, profile, projects } from "./data";

gsap.registerPlugin(ScrollTrigger);

const imageFor = (seed: string, width = 1920, height = 1080) =>
  `https://picsum.photos/seed/${seed}/${width}/${height}`;

const profilePicture = `${import.meta.env.BASE_URL}profile-picture.jpg`;
const cvUrl = `${import.meta.env.BASE_URL}CV-Devanand-Asai.pdf`;

const scrollToSection = (targetId: string) => {
  document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
  window.history.replaceState(null, "", window.location.pathname);
};

const artworkAspectClass = (aspect: Artwork["aspect"]) => {
  const classes: Record<Artwork["aspect"], string> = {
    landscape: "aspect-[4/3]",
    portrait: "aspect-[3/4]",
    square: "aspect-square",
    tall: "aspect-[3/5]",
  };

  return classes[aspect];
};

const artworkMediaAspectClass = (artwork: Artwork) => {
  if (artwork.kind === "3D") {
    return "aspect-[4/3]";
  }

  return artworkAspectClass(artwork.aspect);
};

const artworkImageFor = (artwork: Artwork, width = 900, height = 1200) => {
  if (!artwork.imageUrl) {
    return imageFor(artwork.imageSeed, width, height);
  }

  if (/^https?:\/\//.test(artwork.imageUrl)) {
    return artwork.imageUrl;
  }

  return `${import.meta.env.BASE_URL}${artwork.imageUrl.replace(/^\/+/, "")}`;
};

const artworkModelFor = (artwork: Artwork) => {
  if (!artwork.modelUrl) {
    return null;
  }

  if (/^https?:\/\//.test(artwork.modelUrl)) {
    return artwork.modelUrl;
  }

  return `${import.meta.env.BASE_URL}${artwork.modelUrl.replace(/^\/+/, "")}`;
};

function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [showAllArtwork, setShowAllArtwork] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const savedTheme = window.localStorage.getItem("theme");
    return savedTheme === "dark";
  });
  const lastFocusedElement = useRef<HTMLElement | null>(null);
  const hasMountedTheme = useRef(false);
  const overlayOpen = Boolean(selectedProject || showAllProjects || selectedArtwork || showAllArtwork);
  const showPreviousProject = () => {
    setSelectedProject((currentProject) => {
      if (!currentProject) {
        return currentProject;
      }

      const currentIndex = projects.findIndex((project) => project.id === currentProject.id);
      return projects[(currentIndex - 1 + projects.length) % projects.length];
    });
  };
  const showNextProject = () => {
    setSelectedProject((currentProject) => {
      if (!currentProject) {
        return currentProject;
      }

      const currentIndex = projects.findIndex((project) => project.id === currentProject.id);
      return projects[(currentIndex + 1) % projects.length];
    });
  };
  const showPreviousArtwork = () => {
    setSelectedArtwork((currentArtwork) => {
      if (!currentArtwork) {
        return currentArtwork;
      }

      const currentIndex = artworks.findIndex((artwork) => artwork.id === currentArtwork.id);
      return artworks[(currentIndex - 1 + artworks.length) % artworks.length];
    });
  };
  const showNextArtwork = () => {
    setSelectedArtwork((currentArtwork) => {
      if (!currentArtwork) {
        return currentArtwork;
      }

      const currentIndex = artworks.findIndex((artwork) => artwork.id === currentArtwork.id);
      return artworks[(currentIndex + 1) % artworks.length];
    });
  };

  useGSAP(() => {
    gsap.fromTo(
      ".site-nav",
      { opacity: 0 },
      { opacity: 1, duration: 0.65, ease: "power3.out" },
    );

    gsap.fromTo(
      ".hero-copy > *",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: "power3.out" },
    );

    gsap.fromTo(
      ".profile-photo",
      { opacity: 0, scale: 0.92, rotate: -2 },
      { opacity: 1, scale: 1, rotate: 0, duration: 0.9, delay: 0.18, ease: "power3.out" },
    );

    gsap.utils.toArray<HTMLElement>(".reveal").forEach((element) => {
      gsap.fromTo(
        element,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 82%",
          },
        },
      );
    });

    gsap.utils.toArray<HTMLElement>(".project-card").forEach((card, index) => {
      gsap.fromTo(
        card,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.7,
          delay: index * 0.035,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 86%",
          },
        },
      );
    });

    gsap.fromTo(
      ".projects-section",
      {
        borderTopLeftRadius: "44px",
        borderTopRightRadius: "44px",
      },
      {
        borderTopLeftRadius: "0px",
        borderTopRightRadius: "0px",
        ease: "none",
        scrollTrigger: {
          trigger: ".projects-section",
          start: "top 92%",
          end: "top 16%",
          scrub: true,
        },
      },
    );

    gsap.utils.toArray<HTMLElement>(".scroll-image").forEach((image) => {
      gsap.fromTo(
        image,
        { scale: 0.82, opacity: 0.55, filter: "brightness(0.72) contrast(1.1) saturate(0.76)" },
        {
          scale: 1,
          opacity: 1,
          filter: "brightness(1) contrast(1) saturate(1)",
          ease: "none",
          scrollTrigger: {
            trigger: image,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    });

    gsap.utils.toArray<HTMLElement>(".stack-card").forEach((card, index) => {
      gsap.to(card, {
        y: -index * 18,
        scale: 1 - index * 0.015,
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top 78%",
          end: "bottom 35%",
          scrub: true,
        },
      });
    });

    gsap.utils.toArray<HTMLElement>(".artwork-tile").forEach((tile, index) => {
      gsap.fromTo(
        tile,
        { opacity: 0, y: 28, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          delay: index * 0.04,
          ease: "power2.out",
          scrollTrigger: {
            trigger: tile,
            start: "top 88%",
          },
        },
      );
    });
  });

  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  useEffect(() => {
    const shouldAnimateTheme = hasMountedTheme.current;
    hasMountedTheme.current = true;

    if (shouldAnimateTheme) {
      document.documentElement.classList.add("theme-changing");
    }

    document.documentElement.classList.toggle("dark", darkMode);
    window.localStorage.setItem("theme", darkMode ? "dark" : "light");

    if (!shouldAnimateTheme) {
      return;
    }

    const timeout = window.setTimeout(() => {
      document.documentElement.classList.remove("theme-changing");
    }, 320);

    return () => window.clearTimeout(timeout);
  }, [darkMode]);

  useEffect(() => {
    if (!overlayOpen) {
      document.documentElement.classList.remove("overlay-open");
      document.body.classList.remove("overlay-open");
      return;
    }

    lastFocusedElement.current = document.activeElement as HTMLElement;
    document.documentElement.classList.add("overlay-open");
    document.body.classList.add("overlay-open");

    return () => {
      document.documentElement.classList.remove("overlay-open");
      document.body.classList.remove("overlay-open");
      lastFocusedElement.current?.focus();
    };
  }, [overlayOpen]);

  useEffect(() => {
    let scrollTimeout = 0;
    let pointerTimeout = 0;

    const markScrolling = () => {
      document.documentElement.classList.add("is-scrolling");
      window.clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(() => {
        document.documentElement.classList.remove("is-scrolling");
      }, 900);
    };

    const markPointerActive = () => {
      document.documentElement.classList.add("is-pointer-active");
      window.clearTimeout(pointerTimeout);
      pointerTimeout = window.setTimeout(() => {
        document.documentElement.classList.remove("is-pointer-active");
      }, 900);
    };

    window.addEventListener("scroll", markScrolling, { passive: true });
    window.addEventListener("mousemove", markPointerActive, { passive: true });
    return () => {
      window.clearTimeout(scrollTimeout);
      window.clearTimeout(pointerTimeout);
      window.removeEventListener("scroll", markScrolling);
      window.removeEventListener("mousemove", markPointerActive);
      document.documentElement.classList.remove("is-scrolling");
      document.documentElement.classList.remove("is-pointer-active");
    };
  }, []);

  useEffect(() => {
    if (!selectedProject) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedProject(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedProject]);

  return (
    <main className="w-full max-w-full overflow-x-hidden bg-canvas text-ink transition-colors duration-300 dark:bg-[#101114] dark:text-[#f5f5f7]">
      <Navigation darkMode={darkMode} onToggleTheme={() => setDarkMode((value) => !value)} />
      <Hero />
      <Projects onSelect={setSelectedProject} onViewAll={() => setShowAllProjects(true)} />
      <ArtworkSection onSelect={setSelectedArtwork} onViewAll={() => setShowAllArtwork(true)} />
      <About />
      <Contact />
      <ProjectOverlay
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onPrevious={showPreviousProject}
        onNext={showNextProject}
      />
      <ArtworkOverlay
        artwork={selectedArtwork}
        onClose={() => setSelectedArtwork(null)}
        onPrevious={showPreviousArtwork}
        onNext={showNextArtwork}
      />
      <AllProjectsOverlay
        open={showAllProjects}
        onClose={() => setShowAllProjects(false)}
        onSelect={setSelectedProject}
      />
      <AllArtworkOverlay
        open={showAllArtwork}
        onClose={() => setShowAllArtwork(false)}
        onSelect={setSelectedArtwork}
      />
    </main>
  );
}

function Navigation({
  darkMode,
  onToggleTheme,
}: {
  darkMode: boolean;
  onToggleTheme: () => void;
}) {
  const [open, setOpen] = useState(false);
  const links = [
    ["Home", "home"],
    ["Projects", "projects"],
    ["Artwork", "artwork"],
    ["About", "about"],
    ["Contact", "contact"],
  ];

  return (
    <header className="fixed left-0 right-0 top-0 z-40 px-4 pt-4 md:px-8">
        <div className="site-nav mx-auto flex w-fit items-center justify-center gap-2">
          <nav className="flex h-[58px] w-fit items-center justify-center rounded-full bg-chalk/86 px-2 shadow-nav backdrop-blur-xl transition-colors duration-300 dark:bg-[rgba(37,38,48,0.66)] dark:shadow-[0_30px_90px_rgba(0,0,0,0.58),0_12px_34px_rgba(0,0,0,0.38),0_0_34px_rgba(255,255,255,0.06)] dark:backdrop-blur-2xl">
            <div className="hidden items-center gap-1 md:flex">
              {links.map(([label, href]) => (
                <button
                  key={label}
                  type="button"
                  className="rounded-full px-5 py-2.5 text-sm font-medium text-ink/70 transition-all duration-[250ms] ease-out hover:bg-ink hover:text-white hover:shadow-[0_8px_24px_rgba(29,29,31,0.14)] active:scale-95 dark:text-white/80 dark:hover:bg-white dark:hover:text-ink dark:hover:shadow-[0_12px_30px_rgba(255,255,255,0.18)]"
                  onClick={() => scrollToSection(href)}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="rounded-full px-3 py-2 text-ink transition-transform duration-300 hover:scale-105 active:scale-95 dark:text-white md:hidden"
              aria-label="Open navigation"
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X size={19} /> : <Menu size={19} />}
            </button>
          </nav>
          <button
            type="button"
            className="grid size-[58px] place-items-center rounded-full bg-chalk/86 text-ink/70 shadow-nav backdrop-blur-xl transition-all duration-[250ms] hover:bg-ink hover:text-white hover:shadow-[0_16px_42px_rgba(29,29,31,0.22)] active:scale-95 dark:bg-[rgba(37,38,48,0.66)] dark:text-white/80 dark:shadow-[0_30px_90px_rgba(0,0,0,0.58),0_12px_34px_rgba(0,0,0,0.38),0_0_34px_rgba(255,255,255,0.06)] dark:backdrop-blur-2xl dark:hover:bg-white dark:hover:text-ink dark:hover:shadow-[0_18px_48px_rgba(0,0,0,0.58),0_0_34px_rgba(255,255,255,0.12)]"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            aria-pressed={darkMode}
            onClick={onToggleTheme}
          >
            {darkMode ? <Sun size={19} /> : <Moon size={19} />}
          </button>
        </div>
      {open && (
        <div className="mx-auto mt-2 grid max-w-6xl gap-1 rounded-3xl bg-chalk/95 p-3 shadow-soft backdrop-blur-xl transition-colors duration-300 dark:bg-[#24252b]/95 dark:shadow-[0_26px_80px_rgba(0,0,0,0.55)] md:hidden">
          {links.map(([label, href]) => (
            <button
              key={label}
              type="button"
              className="rounded-2xl px-4 py-3 text-sm text-ink/75 transition-all duration-[250ms] hover:bg-canvas hover:pl-5 dark:text-white/80 dark:hover:bg-white/12"
              onClick={() => {
                scrollToSection(href);
                setOpen(false);
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="home" className="relative min-h-[84vh] overflow-hidden bg-canvas px-4 pb-16 pt-28 transition-colors duration-300 dark:bg-[#101114] md:px-8 md:pb-20 md:pt-32">
      <div className="relative mx-auto grid min-h-[58vh] max-w-7xl items-center gap-10 lg:grid-cols-[1fr_0.78fr]">
        <div className="hero-copy mx-auto max-w-6xl text-center lg:mx-0 lg:text-left">
          <h1 className="max-w-6xl text-[clamp(3rem,6vw,5.4rem)] font-semibold leading-[1.03] tracking-[-0.01em]">
            Devanand Asai
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-[21px] leading-[1.25] text-ink/80 transition-colors duration-300 dark:text-white/80 lg:mx-0">
            Portfolio, projects, and ways to get in touch.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <button
              type="button"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-ink px-[22px] py-[11px] text-[17px] font-medium text-white transition-all duration-300 hover:bg-black hover:shadow-[0_14px_34px_rgba(29,29,31,0.18)] active:scale-95 dark:bg-white dark:text-ink dark:hover:bg-white/90 dark:hover:shadow-[0_14px_34px_rgba(255,255,255,0.12)]"
              onClick={() => scrollToSection("projects")}
            >
              View projects
              <MoveRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-transparent px-[22px] py-[11px] text-[17px] font-medium text-ink transition-all duration-300 hover:bg-chalk hover:shadow-[0_12px_30px_rgba(29,29,31,0.10)] active:scale-95 dark:text-white dark:hover:bg-white/10 dark:hover:shadow-[0_18px_48px_rgba(0,0,0,0.42)]"
            >
              LinkedIn
              <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
        <div className="mx-auto grid w-full max-w-[22rem] place-items-center md:max-w-[26rem]">
          <img
            src={profilePicture}
            alt="Devanand Asai profile picture"
            className="profile-photo aspect-square w-full rounded-full bg-canvas object-cover shadow-[0_16px_45px_rgba(29,29,31,0.12)] transition-all duration-700 ease-out hover:scale-[1.025] hover:shadow-[0_22px_58px_rgba(29,29,31,0.16)] dark:bg-white dark:shadow-[0_0_0_1px_rgba(255,255,255,0.18),0_28px_80px_rgba(0,0,0,0.62),0_0_64px_rgba(255,255,255,0.10)] dark:hover:shadow-[0_0_0_1px_rgba(255,255,255,0.22),0_34px_96px_rgba(0,0,0,0.72),0_0_78px_rgba(255,255,255,0.13)]"
          />
        </div>
      </div>
    </section>
  );
}

function Projects({
  onSelect,
  onViewAll,
}: {
  onSelect: (project: Project) => void;
  onViewAll: () => void;
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const scrollProjects = (direction: "left" | "right") => {
    const cardWidth = scrollerRef.current?.querySelector(".project-card")?.getBoundingClientRect().width ?? 420;

    scrollerRef.current?.scrollBy({
      left: direction === "left" ? -(cardWidth + 24) : cardWidth + 24,
      behavior: "smooth",
    });
  };

  return (
    <section id="projects" className="projects-section overflow-hidden bg-chalk py-20 transition-colors duration-300 dark:bg-[#191a1f] md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="reveal mb-10 flex flex-col justify-between gap-6 px-4 md:flex-row md:items-end md:px-8 xl:px-0">
          <div>
            <h2 className="max-w-4xl text-[clamp(2.3rem,5vw,4rem)] font-semibold leading-[1.08] tracking-[-0.01em]">
              Projects
            </h2>
            <p className="mt-4 max-w-2xl text-[17px] leading-[1.47] text-ink/70 transition-colors duration-300 dark:text-white/70">
              Games, tools, and development experiments with case studies.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <div className="flex w-fit gap-1 rounded-full bg-canvas/75 p-1 shadow-[0_12px_30px_rgba(29,29,31,0.08)] backdrop-blur-xl dark:bg-[#24252b] dark:shadow-[0_18px_46px_rgba(0,0,0,0.46)]">
              <button
                type="button"
                className="group grid size-10 place-items-center rounded-full text-ink/72 transition-all duration-300 hover:bg-ink hover:text-white active:scale-95 dark:text-white/75 dark:hover:bg-white dark:hover:text-ink"
                aria-label="Scroll projects left"
                onClick={() => scrollProjects("left")}
              >
                <ChevronLeft size={20} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
              </button>
              <button
                type="button"
                className="group grid size-10 place-items-center rounded-full text-ink/72 transition-all duration-300 hover:bg-ink hover:text-white active:scale-95 dark:text-white/75 dark:hover:bg-white dark:hover:text-ink"
                aria-label="Scroll projects right"
                onClick={() => scrollProjects("right")}
              >
                <ChevronRight size={20} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>
            </div>
            <button
              type="button"
              className="group inline-flex w-fit items-center gap-2 rounded-full bg-ink px-[22px] py-[11px] text-[17px] font-medium text-white transition-all duration-300 hover:bg-black hover:shadow-[0_14px_34px_rgba(29,29,31,0.18)] active:scale-95 dark:bg-white dark:text-ink dark:hover:bg-white/90 dark:hover:shadow-[0_14px_34px_rgba(255,255,255,0.12)]"
              onClick={onViewAll}
            >
              View all
              <ArrowUpRight size={17} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
        <div
          ref={scrollerRef}
          className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] flex w-screen snap-x snap-mandatory gap-4 overflow-x-auto pl-4 pr-[max(1rem,6vw)] pb-28 pt-16 [-ms-overflow-style:none] [scrollbar-width:none] md:gap-6 md:pl-8 md:pr-[max(2rem,8vw)] md:pb-32 xl:pl-[calc((100vw-80rem)/2)] [&::-webkit-scrollbar]:hidden"
        >
          {projects.map((project, index) => {
            return (
              <button
                key={project.id}
                type="button"
                className="project-card group relative h-[24rem] w-[82vw] shrink-0 snap-center overflow-hidden rounded-[18px] bg-canvas text-left shadow-[0_16px_38px_rgba(29,29,31,0.08)] outline-none transition-shadow duration-500 ease-out hover:shadow-[0_22px_52px_rgba(29,29,31,0.14)] focus-visible:ring-4 focus-visible:ring-blueFocus/35 dark:bg-[#24252b] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_34px_86px_rgba(0,0,0,0.66),0_0_42px_rgba(255,255,255,0.06)] dark:hover:shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_42px_104px_rgba(0,0,0,0.78),0_0_58px_rgba(255,255,255,0.09)] sm:w-[28rem] lg:w-[38rem]"
                onClick={() => onSelect(project)}
              >
                <img
                  src={imageFor(project.imageSeed)}
                  alt=""
                  className="h-full w-full object-cover brightness-[0.68] contrast-[1.12] saturate-[0.72] transition duration-700 ease-out group-hover:scale-[1.035] group-hover:brightness-100 group-hover:contrast-100 group-hover:saturate-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/42 to-transparent transition-opacity duration-500 group-hover:opacity-92" />
                <div className="pointer-events-none absolute inset-y-0 left-[-55%] w-1/2 -skew-x-12 bg-white/14 opacity-0 blur-sm transition-all duration-700 ease-out group-hover:left-[115%] group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white transition-transform duration-500 ease-out group-hover:-translate-y-1">
                  <h3 className="text-2xl font-semibold tracking-[-0.01em]">{project.title}</h3>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-white/80 transition-opacity duration-500 group-hover:opacity-95">
                    {project.summary}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ModelViewer({
  artwork,
  compact = false,
}: {
  artwork: Artwork;
  compact?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [viewerVersion, setViewerVersion] = useState(0);
  const zoomControlsRef = useRef<{
    zoomIn: () => void;
    zoomOut: () => void;
  } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    const cameraDirection = new THREE.Vector3(3.1, 2.2, 4.2).normalize();
    let targetDistance = 5.55;
    const setCameraDistance = (distance: number) => {
      targetDistance = THREE.MathUtils.clamp(distance, 2.7, 8);
      camera.position.copy(cameraDirection).multiplyScalar(targetDistance);
      camera.lookAt(0, 0, 0);
    };
    setCameraDistance(targetDistance);
    zoomControlsRef.current = {
      zoomIn: () => setCameraDistance(targetDistance - 0.45),
      zoomOut: () => setCameraDistance(targetDistance + 0.45),
    };

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.inset = "0";
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.zIndex = "1";
    container.appendChild(renderer.domElement);

    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    const ambientLight = new THREE.AmbientLight(0xffffff, 2.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.8);
    keyLight.position.set(3, 5, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xb9d2ff, 1.7);
    fillLight.position.set(-4, 2, -2);
    scene.add(fillLight);

    const floorGeometry = new THREE.CircleGeometry(1.65, 72);
    const floorMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.08,
      side: THREE.DoubleSide,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.08;
    scene.add(floor);

    let loadedModel: THREE.Object3D | null = null;
    const modelUrl = artworkModelFor(artwork);

    if (modelUrl) {
      const loader = new GLTFLoader();
      loader.load(modelUrl, (gltf) => {
        loadedModel = gltf.scene;
        const box = new THREE.Box3().setFromObject(loadedModel);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);
        const largestSide = Math.max(size.x, size.y, size.z) || 1;
        loadedModel.position.sub(center);
        loadedModel.scale.setScalar(2.35 / largestSide);
        modelGroup.clear();
        modelGroup.add(loadedModel);
      });
    }

    if (!modelUrl) {
      const baseMaterial = new THREE.MeshStandardMaterial({
        color: artwork.id.includes("tower") ? 0x8a98a8 : 0xb87b44,
        roughness: 0.68,
        metalness: 0.08,
      });
      const accentMaterial = new THREE.MeshStandardMaterial({
        color: artwork.id.includes("tower") ? 0xd7c3a2 : 0x3d2b1f,
        roughness: 0.82,
      });
      const edgeMaterial = new THREE.MeshStandardMaterial({
        color: 0x1f2328,
        roughness: 0.62,
        metalness: 0.18,
      });

      const bodyGeometry = artwork.id.includes("tower")
        ? new THREE.CylinderGeometry(0.8, 1, 2.2, 6)
        : new THREE.BoxGeometry(1.75, 1.25, 1.45);
      const body = new THREE.Mesh(bodyGeometry, baseMaterial);
      modelGroup.add(body);

      if (artwork.id.includes("tower")) {
        const roof = new THREE.Mesh(new THREE.ConeGeometry(1.05, 0.8, 6), accentMaterial);
        roof.position.y = 1.5;
        modelGroup.add(roof);

        const bands = [-0.64, 0.1, 0.84];
        bands.forEach((position) => {
          const band = new THREE.Mesh(new THREE.CylinderGeometry(0.84, 0.98, 0.08, 6), edgeMaterial);
          band.position.y = position;
          modelGroup.add(band);
        });
      } else {
        const slats = [
          { x: 0, y: 0.68, z: 0, sx: 1.98, sy: 0.12, sz: 1.64 },
          { x: 0, y: -0.68, z: 0, sx: 1.98, sy: 0.12, sz: 1.64 },
          { x: -0.94, y: 0, z: 0, sx: 0.12, sy: 1.45, sz: 1.62 },
          { x: 0.94, y: 0, z: 0, sx: 0.12, sy: 1.45, sz: 1.62 },
        ];
        slats.forEach((slat) => {
          const mesh = new THREE.Mesh(new THREE.BoxGeometry(slat.sx, slat.sy, slat.sz), edgeMaterial);
          mesh.position.set(slat.x, slat.y, slat.z);
          modelGroup.add(mesh);
        });

        const brace = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.85, 1.62), accentMaterial);
        brace.rotation.z = Math.PI / 4;
        modelGroup.add(brace);
      }
    }

    let pointerDown = false;
    let pointerX = 0;
    let targetRotation = 0;
    let frameId = 0;
    let remountTimeout = 0;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const onPointerDown = (event: PointerEvent) => {
      pointerDown = true;
      pointerX = event.clientX;
      container.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!pointerDown) {
        return;
      }

      const delta = event.clientX - pointerX;
      pointerX = event.clientX;
      targetRotation += delta * 0.01;
    };

    const onPointerUp = (event: PointerEvent) => {
      pointerDown = false;
      if (container.hasPointerCapture(event.pointerId)) {
        container.releasePointerCapture(event.pointerId);
      }
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      setCameraDistance(targetDistance + event.deltaY * 0.004);
    };
    const onContextLost = (event: Event) => {
      event.preventDefault();
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(remountTimeout);
      remountTimeout = window.setTimeout(() => {
        setViewerVersion((version) => version + 1);
      }, 160);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerup", onPointerUp);
    container.addEventListener("pointercancel", onPointerUp);
    container.addEventListener("wheel", onWheel, { passive: false });
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);
    resize();

    const animate = () => {
      targetRotation += pointerDown ? 0 : 0.006;
      modelGroup.rotation.y += (targetRotation - modelGroup.rotation.y) * 0.08;
      modelGroup.rotation.x = Math.sin(targetRotation * 0.35) * 0.08;
      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(remountTimeout);
      resizeObserver.disconnect();
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointercancel", onPointerUp);
      container.removeEventListener("wheel", onWheel);
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
      zoomControlsRef.current = null;
      renderer.dispose();
      floorGeometry.dispose();
      floorMaterial.dispose();
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) {
          return;
        }

        object.geometry.dispose();
        const material = object.material;
        if (Array.isArray(material)) {
          material.forEach((item) => item.dispose());
          return;
        }

        material.dispose();
      });
      loadedModel = null;
      renderer.domElement.remove();
    };
  }, [artwork, viewerVersion]);

  return (
    <div
      ref={containerRef}
      className={`relative isolate cursor-grab overflow-hidden bg-[#202124] active:cursor-grabbing ${
        compact ? "h-full w-full" : "h-full min-h-[22rem] max-h-[78vh] w-full rounded-[14px]"
      }`}
      aria-label={`${artwork.title} interactive 3D model viewer`}
      role="img"
    >
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_35%_20%,rgba(255,255,255,0.18),transparent_32%),radial-gradient(circle_at_70%_80%,rgba(118,144,180,0.18),transparent_36%)]" />
      {!compact && (
        <div className="absolute bottom-4 right-4 z-10 flex gap-2">
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full bg-white/12 text-white/82 backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-ink active:scale-95"
            aria-label="Zoom model out"
            onClick={() => zoomControlsRef.current?.zoomOut()}
          >
            <ZoomOut size={18} />
          </button>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full bg-white/12 text-white/82 backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-ink active:scale-95"
            aria-label="Zoom model in"
            onClick={() => zoomControlsRef.current?.zoomIn()}
          >
            <ZoomIn size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

function ArtworkSection({
  onSelect,
  onViewAll,
}: {
  onSelect: (artwork: Artwork) => void;
  onViewAll: () => void;
}) {
  const featuredArtworks = [
    ...artworks.filter((artwork) => artwork.kind === "2D").slice(0, 4),
    ...artworks.filter((artwork) => artwork.kind === "3D").slice(0, 2),
  ];

  return (
    <section id="artwork" className="overflow-hidden bg-canvas px-4 py-20 transition-colors duration-300 dark:bg-[#101114] md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="reveal mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 className="max-w-5xl text-[clamp(2.3rem,5vw,4rem)] font-semibold leading-[1.08] tracking-[-0.01em]">
              Artwork
            </h2>
            <p className="mt-4 max-w-2xl text-[17px] leading-[1.47] text-ink/70 transition-colors duration-300 dark:text-white/70">
              Sketches, concepts, 3D models, studies, and visual experiments.
            </p>
          </div>
          <button
            type="button"
            className="group inline-flex w-fit items-center gap-2 rounded-full bg-ink px-[22px] py-[11px] text-[17px] font-medium text-white transition-all duration-300 hover:bg-black hover:shadow-[0_14px_34px_rgba(29,29,31,0.18)] active:scale-95 dark:bg-white dark:text-ink dark:hover:bg-white/90 dark:hover:shadow-[0_14px_34px_rgba(255,255,255,0.12)]"
            onClick={onViewAll}
          >
            View all
            <ArrowUpRight size={17} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
        </div>

        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {featuredArtworks.map((artwork, index) => (
            <button
              key={artwork.id}
              type="button"
              className="artwork-tile group mb-4 block w-full break-inside-avoid overflow-hidden rounded-[18px] bg-chalk text-left shadow-[0_16px_38px_rgba(29,29,31,0.08)] outline-none transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_22px_52px_rgba(29,29,31,0.14)] focus-visible:ring-4 focus-visible:ring-blueFocus/35 dark:bg-[#1c1d23] dark:shadow-[0_24px_70px_rgba(0,0,0,0.56)] dark:hover:shadow-[0_30px_86px_rgba(0,0,0,0.7)]"
              style={{ animationDelay: `${index * 45}ms` }}
              onClick={() => onSelect(artwork)}
            >
              <div className={`overflow-hidden ${artworkMediaAspectClass(artwork)}`}>
                {artwork.kind === "3D" ? (
                  <ModelViewer artwork={artwork} compact />
                ) : (
                  <img
                    src={artworkImageFor(artwork, 900, 1200)}
                    alt=""
                    className="h-full w-full object-cover brightness-[0.86] contrast-[1.08] saturate-[0.82] transition duration-700 ease-out group-hover:scale-[1.045] group-hover:brightness-100 group-hover:contrast-100 group-hover:saturate-100"
                  />
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-semibold tracking-[-0.01em]">{artwork.title}</h3>
                  <span className="mt-0.5 shrink-0 rounded-full bg-canvas px-3 py-1 text-xs font-semibold text-ink/55 dark:bg-[#30313a] dark:text-white/55">
                    {artwork.kind}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-ink/65 dark:text-white/65">{artwork.summary}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function AllProjectsOverlay({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (project: Project) => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"All" | Project["category"]>("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(open);
  const [visible, setVisible] = useState(false);
  const [resultsAnimating, setResultsAnimating] = useState(false);
  const categories: Array<"All" | Project["category"]> = ["All", "Games", "Tools"];
  const normalizedQuery = query.trim().toLowerCase();
  const filteredProjects = useMemo(
    () =>
      projects.filter((project) => {
        const searchableText = [
          project.title,
          project.category,
          project.summary,
          project.description,
          ...project.stack,
          ...project.highlights,
        ]
          .join(" ")
          .toLowerCase();

        const matchesSearch = searchableText.includes(normalizedQuery);
        const matchesCategory = category === "All" || project.category === category;

        return matchesSearch && matchesCategory;
      }),
    [category, normalizedQuery],
  );
  const [displayedProjects, setDisplayedProjects] = useState<Project[]>(filteredProjects);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      return;
    }

    setVisible(false);
    const timeout = window.setTimeout(() => setShouldRender(false), 360);
    return () => window.clearTimeout(timeout);
  }, [open]);

  useEffect(() => {
    if (!shouldRender) {
      return;
    }

    const timeout = window.setTimeout(() => setVisible(open), 20);
    return () => window.clearTimeout(timeout);
  }, [open, shouldRender]);

  useEffect(() => {
    if (!shouldRender) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [shouldRender, onClose]);

  useEffect(() => {
    if (!shouldRender) {
      setDisplayedProjects(filteredProjects);
      setResultsAnimating(false);
      return;
    }

    setResultsAnimating(true);
    const timeout = window.setTimeout(() => {
      setDisplayedProjects(filteredProjects);
      window.requestAnimationFrame(() => setResultsAnimating(false));
    }, 140);

    return () => window.clearTimeout(timeout);
  }, [filteredProjects, shouldRender]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-40 flex items-center justify-center bg-ink/70 px-4 py-6 backdrop-blur-md transition-opacity duration-300 ease-out dark:bg-black/80 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
          return;
        }
        setFilterOpen(false);
      }}
    >
      <section
        className={`flex h-[88vh] w-full max-w-6xl flex-col overflow-hidden rounded-[18px] bg-chalk transition-all duration-300 ease-out dark:bg-[#191a1f] dark:shadow-[0_34px_110px_rgba(0,0,0,0.72),0_0_48px_rgba(255,255,255,0.06)] md:h-[46rem] md:max-h-[88vh] ${
          visible ? "scale-100 opacity-100" : "scale-[0.98] opacity-0"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="all-projects-title"
      >
        <div className="p-5 pb-4 md:p-8 md:pb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="all-projects-title" className="text-4xl font-semibold leading-[1.08] tracking-[-0.01em] md:text-6xl">
                All projects
              </h2>
              <p className="mt-3 text-sm text-muted dark:text-white/60">{displayedProjects.length} project results</p>
            </div>
            <button
              type="button"
              className="shrink-0 rounded-full bg-[#d2d2d7]/70 p-3 text-ink transition-all duration-300 hover:rotate-90 hover:bg-[#d2d2d7] active:scale-95 dark:bg-[#2a2b32] dark:text-white dark:shadow-[0_10px_28px_rgba(0,0,0,0.36)] dark:hover:bg-[#343640]"
              aria-label="Close all projects"
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>
          <div className="mt-7 flex flex-col gap-3 md:flex-row">
            <label className="flex h-11 min-w-0 flex-1 items-center gap-3 rounded-full bg-white/90 px-5 text-ink shadow-[0_14px_34px_rgba(29,29,31,0.07)] dark:bg-[#24252b] dark:text-white dark:shadow-[0_16px_42px_rgba(0,0,0,0.42)]">
              <Search size={19} className="shrink-0 text-ink/50 dark:text-white/50" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by title, category, or detail"
                className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-ink/40 dark:placeholder:text-white/50"
                autoFocus
              />
            </label>
            <div className="relative">
              <button
                type="button"
                className={`flex h-11 w-full items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition-all duration-300 md:w-auto ${
                  filterOpen || category !== "All"
                    ? "bg-ink text-white shadow-[0_12px_30px_rgba(29,29,31,0.14)] dark:bg-white dark:text-ink dark:shadow-[0_14px_34px_rgba(255,255,255,0.13)]"
                    : "bg-canvas text-ink hover:bg-white hover:shadow-[0_12px_30px_rgba(29,29,31,0.10)] dark:bg-[#24252b] dark:text-white dark:shadow-[0_16px_42px_rgba(0,0,0,0.42)] dark:hover:bg-[#2d2e35] dark:hover:shadow-[0_20px_52px_rgba(0,0,0,0.56)]"
                }`}
                aria-expanded={filterOpen}
                aria-haspopup="menu"
                onMouseDown={(event) => event.stopPropagation()}
                onClick={() => setFilterOpen((value) => !value)}
              >
                <SlidersHorizontal size={17} />
                {category === "All" ? "Filter" : category}
              </button>
              {filterOpen && (
                <div
                  className="filter-menu absolute right-0 top-14 z-10 w-56 rounded-[18px] bg-canvas p-2 shadow-[0_18px_48px_rgba(29,29,31,0.16)] dark:bg-[#24252b] dark:shadow-[0_28px_78px_rgba(0,0,0,0.68),0_0_28px_rgba(255,255,255,0.05)]"
                  role="menu"
                  onMouseDown={(event) => event.stopPropagation()}
                >
                  {categories.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={`flex w-full items-center justify-between rounded-[14px] px-4 py-3 text-left text-sm font-medium transition-colors duration-200 ${
                        category === item ? "bg-ink text-white dark:bg-white dark:text-ink" : "text-ink/70 hover:bg-chalk hover:text-ink dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
                      }`}
                      role="menuitemradio"
                      aria-checked={category === item}
                      onClick={() => {
                        setCategory(item);
                        setFilterOpen(false);
                      }}
                    >
                      {item}
                      {category === item && <Check size={16} className="filter-check shrink-0" strokeWidth={2.5} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-5 pt-3 md:p-8 md:pt-4">
          {displayedProjects.length ? (
            <div
              className={`grid gap-4 transition-all duration-300 ease-out md:grid-cols-2 ${
                resultsAnimating ? "translate-y-1 opacity-0" : "translate-y-0 opacity-100"
              }`}
            >
              {displayedProjects.map((project, index) => (
                <button
                  key={project.id}
                  type="button"
                  className="filter-result-card group grid overflow-hidden rounded-[18px] bg-canvas text-left shadow-[0_12px_30px_rgba(29,29,31,0.06)] outline-none transition-shadow duration-500 ease-out hover:shadow-[0_18px_46px_rgba(29,29,31,0.12)] focus-visible:ring-4 focus-visible:ring-blueFocus/35 dark:bg-[#24252b] dark:shadow-[0_20px_54px_rgba(0,0,0,0.48)] dark:hover:shadow-[0_26px_70px_rgba(0,0,0,0.62)] sm:grid-cols-[11rem_1fr]"
                  style={{ animationDelay: `${index * 35}ms` }}
                  onClick={() => onSelect(project)}
                >
                  <div className="h-44 overflow-hidden sm:h-full">
                    <img
                      src={imageFor(project.imageSeed, 900, 700)}
                      alt=""
                      className="h-full w-full object-cover brightness-[0.72] contrast-[1.1] saturate-[0.76] transition duration-700 ease-out group-hover:scale-[1.035] group-hover:brightness-100 group-hover:contrast-100 group-hover:saturate-100"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-2xl font-semibold tracking-[-0.01em]">{project.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-ink/70 dark:text-white/70">{project.summary}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div
              className={`empty-results rounded-[18px] bg-canvas p-10 text-center shadow-[0_12px_30px_rgba(29,29,31,0.06)] transition-all duration-300 ease-out dark:bg-[#24252b] dark:shadow-[0_20px_54px_rgba(0,0,0,0.48)] ${
                resultsAnimating ? "translate-y-1 opacity-0" : "translate-y-0 opacity-100"
              }`}
            >
              <p className="text-lg font-medium">No projects found</p>
              <p className="mt-2 text-sm text-ink/60 dark:text-white/60">Try a different title, tool, or keyword.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function AllArtworkOverlay({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (artwork: Artwork) => void;
}) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<"All" | Artwork["kind"]>("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(open);
  const [visible, setVisible] = useState(false);
  const [resultsAnimating, setResultsAnimating] = useState(false);
  const artworkKinds: Array<"All" | Artwork["kind"]> = ["All", "2D", "3D"];
  const normalizedQuery = query.trim().toLowerCase();
  const filteredArtworks = useMemo(
    () =>
      artworks.filter((artwork) => {
        const matchesKind = kind === "All" || artwork.kind === kind;
        const matchesSearch = [artwork.title, artwork.kind, artwork.medium, artwork.year, artwork.summary, artwork.description, ...artwork.tags]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

        return matchesKind && matchesSearch;
      }),
    [kind, normalizedQuery],
  );
  const [displayedArtworks, setDisplayedArtworks] = useState<Artwork[]>(filteredArtworks);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      return;
    }

    setVisible(false);
    const timeout = window.setTimeout(() => setShouldRender(false), 360);
    return () => window.clearTimeout(timeout);
  }, [open]);

  useEffect(() => {
    if (!shouldRender) {
      return;
    }

    const timeout = window.setTimeout(() => setVisible(open), 20);
    return () => window.clearTimeout(timeout);
  }, [open, shouldRender]);

  useEffect(() => {
    if (!shouldRender) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [shouldRender, onClose]);

  useEffect(() => {
    if (!shouldRender) {
      setDisplayedArtworks(filteredArtworks);
      setResultsAnimating(false);
      return;
    }

    setResultsAnimating(true);
    const timeout = window.setTimeout(() => {
      setDisplayedArtworks(filteredArtworks);
      window.requestAnimationFrame(() => setResultsAnimating(false));
    }, 140);

    return () => window.clearTimeout(timeout);
  }, [filteredArtworks, shouldRender]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-40 flex items-center justify-center bg-ink/70 px-4 py-6 backdrop-blur-md transition-opacity duration-300 ease-out dark:bg-black/80 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
          return;
        }
        setFilterOpen(false);
      }}
    >
      <section
        className={`flex h-[88vh] w-full max-w-7xl flex-col overflow-hidden rounded-[18px] bg-chalk transition-all duration-300 ease-out dark:bg-[#191a1f] dark:shadow-[0_34px_110px_rgba(0,0,0,0.72),0_0_48px_rgba(255,255,255,0.06)] md:max-h-[88vh] ${
          visible ? "scale-100 opacity-100" : "scale-[0.98] opacity-0"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="all-artwork-title"
      >
        <div className="p-5 pb-4 md:p-8 md:pb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="all-artwork-title" className="text-4xl font-semibold leading-[1.08] tracking-[-0.01em] md:text-6xl">
                All artwork
              </h2>
              <p className="mt-3 text-sm text-muted dark:text-white/60">{displayedArtworks.length} artwork results</p>
            </div>
            <button
              type="button"
              className="shrink-0 rounded-full bg-[#d2d2d7]/70 p-3 text-ink transition-all duration-300 hover:rotate-90 hover:bg-[#d2d2d7] active:scale-95 dark:bg-[#2a2b32] dark:text-white dark:shadow-[0_10px_28px_rgba(0,0,0,0.36)] dark:hover:bg-[#343640]"
              aria-label="Close all artwork"
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>
          <div className="mt-7 flex flex-col gap-3 md:flex-row md:items-center">
            <label className="flex h-11 min-w-0 flex-1 items-center gap-3 rounded-full bg-white/90 px-5 text-ink shadow-[0_14px_34px_rgba(29,29,31,0.07)] dark:bg-[#24252b] dark:text-white dark:shadow-[0_16px_42px_rgba(0,0,0,0.42)]">
              <Search size={19} className="shrink-0 text-ink/50 dark:text-white/50" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search artwork by title, medium, or tag"
                className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-ink/40 dark:placeholder:text-white/50"
                autoFocus
              />
            </label>
            <div className="relative">
              <button
                type="button"
                className={`flex h-11 w-full items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition-all duration-300 md:w-auto ${
                  filterOpen || kind !== "All"
                    ? "bg-ink text-white shadow-[0_12px_30px_rgba(29,29,31,0.14)] dark:bg-white dark:text-ink dark:shadow-[0_14px_34px_rgba(255,255,255,0.13)]"
                    : "bg-white/90 text-ink hover:bg-canvas hover:shadow-[0_12px_30px_rgba(29,29,31,0.10)] dark:bg-[#24252b] dark:text-white dark:shadow-[0_16px_42px_rgba(0,0,0,0.42)] dark:hover:bg-[#2d2e35] dark:hover:shadow-[0_20px_52px_rgba(0,0,0,0.56)]"
                }`}
                aria-expanded={filterOpen}
                aria-haspopup="menu"
                onMouseDown={(event) => event.stopPropagation()}
                onClick={() => setFilterOpen((value) => !value)}
              >
                <SlidersHorizontal size={17} />
                {kind === "All" ? "Filter" : kind}
              </button>
              {filterOpen && (
                <div
                  className="filter-menu absolute right-0 top-14 z-10 w-48 rounded-[18px] bg-canvas p-2 shadow-[0_18px_48px_rgba(29,29,31,0.16)] dark:bg-[#24252b] dark:shadow-[0_28px_78px_rgba(0,0,0,0.68),0_0_28px_rgba(255,255,255,0.05)]"
                  role="menu"
                  onMouseDown={(event) => event.stopPropagation()}
                >
                  {artworkKinds.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={`flex w-full items-center justify-between rounded-[14px] px-4 py-3 text-left text-sm font-medium transition-colors duration-200 ${
                        kind === item ? "bg-ink text-white dark:bg-white dark:text-ink" : "text-ink/70 hover:bg-chalk hover:text-ink dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
                      }`}
                      role="menuitemradio"
                      aria-checked={kind === item}
                      onClick={() => {
                        setKind(item);
                        setFilterOpen(false);
                      }}
                    >
                      {item}
                      {kind === item && <Check size={16} className="filter-check shrink-0" strokeWidth={2.5} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-5 pt-3 md:p-8 md:pt-4">
          {displayedArtworks.length ? (
            <div
              className={`columns-1 gap-4 transition-all duration-300 ease-out sm:columns-2 lg:columns-3 xl:columns-4 ${
                resultsAnimating ? "translate-y-1 opacity-0" : "translate-y-0 opacity-100"
              }`}
            >
              {displayedArtworks.map((artwork, index) => (
                <button
                  key={artwork.id}
                  type="button"
                  className="filter-result-card group mb-4 block w-full break-inside-avoid overflow-hidden rounded-[18px] bg-canvas text-left shadow-[0_12px_30px_rgba(29,29,31,0.06)] outline-none transition-shadow duration-500 ease-out hover:shadow-[0_18px_46px_rgba(29,29,31,0.12)] focus-visible:ring-4 focus-visible:ring-blueFocus/35 dark:bg-[#24252b] dark:shadow-[0_20px_54px_rgba(0,0,0,0.48)] dark:hover:shadow-[0_26px_70px_rgba(0,0,0,0.62)]"
                  style={{ animationDelay: `${index * 30}ms` }}
                  onClick={() => onSelect(artwork)}
                >
                  <div className={`overflow-hidden ${artworkMediaAspectClass(artwork)}`}>
                    {artwork.kind === "3D" ? (
                      <ModelViewer artwork={artwork} compact />
                    ) : (
                      <img
                        src={artworkImageFor(artwork, 900, 1200)}
                        alt=""
                        className="h-full w-full object-cover brightness-[0.86] contrast-[1.08] saturate-[0.82] transition duration-700 ease-out group-hover:scale-[1.045] group-hover:brightness-100 group-hover:contrast-100 group-hover:saturate-100"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-semibold tracking-[-0.01em]">{artwork.title}</h3>
                      <span className="mt-0.5 shrink-0 rounded-full bg-chalk px-2.5 py-1 text-xs font-semibold text-ink/55 dark:bg-[#30313a] dark:text-white/55">
                        {artwork.kind}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-ink/60 dark:text-white/60">
                      {artwork.medium} · {artwork.year}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div
              className={`empty-results rounded-[18px] bg-canvas p-10 text-center shadow-[0_12px_30px_rgba(29,29,31,0.06)] transition-all duration-300 ease-out dark:bg-[#24252b] dark:shadow-[0_20px_54px_rgba(0,0,0,0.48)] ${
                resultsAnimating ? "translate-y-1 opacity-0" : "translate-y-0 opacity-100"
              }`}
            >
              <p className="text-lg font-medium">No artwork found</p>
              <p className="mt-2 text-sm text-ink/60 dark:text-white/60">Try a different title, medium, or tag.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function About() {
  const skills = ["2D Art", "3D Modelling", "Level Design"];
  const tools = [
    "Blender",
    "Unity",
    "Unreal Engine",
    "Photoshop",
    "Aseprite",
    "Blockbench",
    "ChatGPT",
    "Claude",
    "Gemini",
    "GitHub",
    "Visual Studio",
  ];

  return (
    <section id="about" className="bg-canvas px-4 py-20 transition-colors duration-300 dark:bg-[#101114] md:px-8 md:py-24">
      <div className="reveal mx-auto max-w-3xl text-center">
        <div>
          <h2 className="text-[clamp(2.4rem,5vw,4.5rem)] font-semibold leading-[1.03] tracking-[-0.01em]">
            About me
          </h2>
          <div className="mx-auto mt-7 max-w-2xl space-y-5 text-[17px] leading-[1.47] text-ink/75 transition-colors duration-300 dark:text-white/80">
            <p>
              Game Development &amp; Creative Media student at New College Swindon.
            </p>
          </div>
          <div className="mx-auto mt-10 grid max-w-2xl gap-6">
            <div className="rounded-[18px] bg-chalk p-5 shadow-[0_12px_30px_rgba(29,29,31,0.04)] transition-colors duration-300 dark:bg-[#1c1d23] dark:shadow-[0_22px_60px_rgba(0,0,0,0.46)]">
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted dark:text-white/60">Skills</h3>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-canvas px-4 py-2 text-sm font-medium text-ink transition-colors duration-300 dark:bg-[#30313a] dark:text-white/80"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-[18px] bg-chalk p-5 shadow-[0_12px_30px_rgba(29,29,31,0.04)] transition-colors duration-300 dark:bg-[#1c1d23] dark:shadow-[0_22px_60px_rgba(0,0,0,0.46)]">
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted dark:text-white/60">Tools</h3>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {tools.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-full bg-canvas px-4 py-2 text-sm font-medium text-ink transition-colors duration-300 dark:bg-[#30313a] dark:text-white/80"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <a
            href={cvUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-ink px-[22px] py-[11px] text-[17px] font-medium text-white transition-all duration-300 hover:bg-black hover:shadow-[0_14px_34px_rgba(29,29,31,0.18)] active:scale-95 dark:bg-white dark:text-ink dark:hover:bg-white/90 dark:hover:shadow-[0_14px_34px_rgba(255,255,255,0.12)]"
          >
            <FileText size={18} />
            View CV
          </a>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="bg-canvas px-4 py-20 transition-colors duration-300 dark:bg-[#101114] md:px-8 md:py-24">
      <div className="reveal mx-auto max-w-6xl text-center">
        <h2 className="text-[clamp(2.6rem,6vw,5rem)] font-semibold leading-[1.05] tracking-[-0.01em]">
          Contact
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-[21px] leading-[1.25] text-ink/75 transition-colors duration-300 dark:text-white/80">
          Reach out for development work or collaboration.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={`mailto:${profile.email}`}
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-ink px-[22px] py-[11px] text-[17px] font-medium text-white transition-all duration-300 hover:bg-black hover:shadow-[0_14px_34px_rgba(29,29,31,0.18)] active:scale-95 dark:bg-white dark:text-ink dark:hover:bg-white/90 dark:hover:shadow-[0_14px_34px_rgba(255,255,255,0.12)]"
          >
            <Mail size={18} />
            Email me
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-transparent px-[22px] py-[11px] text-[17px] font-medium text-ink transition-all duration-300 hover:bg-chalk hover:shadow-[0_12px_30px_rgba(29,29,31,0.10)] active:scale-95 dark:text-white dark:hover:bg-white/10 dark:hover:shadow-[0_18px_48px_rgba(0,0,0,0.42)]"
          >
            <Github size={18} />
            GitHub
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-transparent px-[22px] py-[11px] text-[17px] font-medium text-ink transition-all duration-300 hover:bg-chalk hover:shadow-[0_12px_30px_rgba(29,29,31,0.10)] active:scale-95 dark:text-white dark:hover:bg-white/10 dark:hover:shadow-[0_18px_48px_rgba(0,0,0,0.42)]"
          >
            <Linkedin size={18} />
            LinkedIn
          </a>
        </div>
      </div>
      <footer className="mx-auto mt-20 max-w-6xl border-t border-hairline pt-8 text-center text-xs text-muted transition-colors duration-300 dark:border-white/10 dark:text-white/60">
        <p>&copy; 2026 Devanand Asai. All rights reserved.</p>
      </footer>
    </section>
  );
}

function ProjectOverlay({
  project,
  onClose,
  onPrevious,
  onNext,
}: {
  project: Project | null;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const [displayProject, setDisplayProject] = useState<Project | null>(project);
  const [shouldRender, setShouldRender] = useState(Boolean(project));
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (project) {
      setShouldRender(true);
      setDisplayProject(project);
      return;
    }

    setVisible(false);
    const timeout = window.setTimeout(() => {
      setShouldRender(false);
      setDisplayProject(null);
    }, 360);

    return () => window.clearTimeout(timeout);
  }, [project]);

  useEffect(() => {
    if (!project) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        onPrevious();
      }

      if (event.key === "ArrowRight") {
        onNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onNext, onPrevious, project]);

  useEffect(() => {
    if (!shouldRender) {
      return;
    }

    const timeout = window.setTimeout(() => setVisible(Boolean(project)), 20);
    return () => window.clearTimeout(timeout);
  }, [project, shouldRender]);

  if (!shouldRender || !displayProject) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-ink/70 px-4 py-6 backdrop-blur-md transition-opacity duration-300 ease-out dark:bg-black/80 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center bg-gradient-to-r from-ink/34 via-ink/10 to-transparent px-3 md:px-7">
        <button
          type="button"
          className="pointer-events-auto group inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-ink shadow-[0_18px_44px_rgba(0,0,0,0.24)] transition-all duration-300 hover:bg-ink hover:text-white active:scale-95 dark:bg-ink dark:text-white dark:hover:bg-white dark:hover:text-ink"
          aria-label="Previous project"
          onClick={onPrevious}
        >
          <ChevronLeft size={17} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
          Back
        </button>
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 flex items-center bg-gradient-to-l from-ink/34 via-ink/10 to-transparent px-3 md:px-7">
        <button
          type="button"
          className="pointer-events-auto group inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-ink shadow-[0_18px_44px_rgba(0,0,0,0.24)] transition-all duration-300 hover:bg-ink hover:text-white active:scale-95 dark:bg-ink dark:text-white dark:hover:bg-white dark:hover:text-ink"
          aria-label="Next project"
          onClick={onNext}
        >
          Next
          <ChevronRight size={17} className="transition-transform duration-300 group-hover:translate-x-0.5" />
        </button>
      </div>
      <article
        className={`h-[min(46rem,86vh)] w-full max-w-5xl overflow-hidden rounded-[18px] bg-chalk outline-none transition-all duration-300 ease-out dark:bg-[#191a1f] dark:shadow-[0_34px_110px_rgba(0,0,0,0.72),0_0_48px_rgba(255,255,255,0.06)] ${
          visible ? "scale-100 opacity-100" : "scale-[0.98] opacity-0"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-title"
        tabIndex={-1}
      >
        <div
          className="grid h-full lg:grid-cols-[0.9fr_1.1fr]"
        >
          <div className="relative min-h-[20rem] overflow-hidden lg:min-h-full">
            <img
              src={imageFor(displayProject.imageSeed)}
              alt=""
              className="h-full min-h-[20rem] w-full object-cover brightness-[0.72] contrast-[1.1] saturate-[0.76]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/65 to-transparent" />
          </div>
          <div className="overflow-y-auto p-6 md:p-10">
            <div className="mb-8 flex items-start justify-between gap-4">
              <h3 id="project-title" className="text-4xl font-semibold leading-[1.08] tracking-[-0.01em] md:text-6xl">
                {displayProject.title}
              </h3>
              <button
                type="button"
                className="shrink-0 rounded-full bg-[#d2d2d7]/70 p-3 text-ink transition-all duration-300 hover:rotate-90 hover:bg-[#d2d2d7] active:scale-95 dark:bg-[#2a2b32] dark:text-white dark:shadow-[0_10px_28px_rgba(0,0,0,0.36)] dark:hover:bg-[#343640]"
                aria-label="Close project details"
                onClick={onClose}
                autoFocus
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-[17px] leading-[1.47] text-ink/75 dark:text-white/80">{displayProject.description}</p>
            <div className="mt-10 grid gap-3">
              {displayProject.highlights.map((highlight) => (
                <p key={highlight} className="rounded-[18px] bg-white/75 p-4 text-sm leading-6 text-ink/75 dark:bg-[#24252b] dark:text-white/80 dark:shadow-[0_12px_32px_rgba(0,0,0,0.30)]">
                  {highlight}
                </p>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              {displayProject.githubUrl && (
                <a
                  href={displayProject.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full bg-ink px-[22px] py-[11px] text-[17px] font-medium text-white transition-all duration-300 hover:bg-black hover:shadow-[0_14px_34px_rgba(29,29,31,0.18)] active:scale-95 dark:bg-white dark:text-ink dark:hover:bg-white/90 dark:hover:shadow-[0_14px_34px_rgba(255,255,255,0.12)]"
                >
                  <Github size={17} />
                  Repository
                </a>
              )}
              {displayProject.liveUrl && (
                <a
                  href={displayProject.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full bg-transparent px-[22px] py-[11px] text-[17px] font-medium text-ink transition-all duration-300 hover:bg-chalk hover:shadow-[0_12px_30px_rgba(29,29,31,0.10)] active:scale-95 dark:text-white dark:hover:bg-white/10 dark:hover:shadow-[0_18px_48px_rgba(0,0,0,0.42)]"
                >
                  Live site
                  <ArrowUpRight size={17} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

function ArtworkOverlay({
  artwork,
  onClose,
  onPrevious,
  onNext,
}: {
  artwork: Artwork | null;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const [displayArtwork, setDisplayArtwork] = useState<Artwork | null>(artwork);
  const [shouldRender, setShouldRender] = useState(Boolean(artwork));
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (artwork) {
      setShouldRender(true);
      setDisplayArtwork(artwork);
      return;
    }

    setVisible(false);
    const timeout = window.setTimeout(() => {
      setShouldRender(false);
      setDisplayArtwork(null);
    }, 360);

    return () => window.clearTimeout(timeout);
  }, [artwork]);

  useEffect(() => {
    if (!artwork) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        onPrevious();
      }

      if (event.key === "ArrowRight") {
        onNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [artwork, onNext, onPrevious]);

  useEffect(() => {
    if (!shouldRender) {
      return;
    }

    const timeout = window.setTimeout(() => setVisible(Boolean(artwork)), 20);
    return () => window.clearTimeout(timeout);
  }, [artwork, shouldRender]);

  useEffect(() => {
    if (!shouldRender) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [shouldRender, onClose]);

  if (!shouldRender || !displayArtwork) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-ink/72 px-4 py-6 backdrop-blur-md transition-opacity duration-300 ease-out dark:bg-black/82 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center bg-gradient-to-r from-ink/34 via-ink/10 to-transparent px-3 md:px-7">
        <button
          type="button"
          className="pointer-events-auto group inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-ink shadow-[0_18px_44px_rgba(0,0,0,0.24)] transition-all duration-300 hover:bg-ink hover:text-white active:scale-95 dark:bg-ink dark:text-white dark:hover:bg-white dark:hover:text-ink"
          aria-label="Previous artwork"
          onClick={onPrevious}
        >
          <ChevronLeft size={17} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
          Back
        </button>
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 flex items-center bg-gradient-to-l from-ink/34 via-ink/10 to-transparent px-3 md:px-7">
        <button
          type="button"
          className="pointer-events-auto group inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-ink shadow-[0_18px_44px_rgba(0,0,0,0.24)] transition-all duration-300 hover:bg-ink hover:text-white active:scale-95 dark:bg-ink dark:text-white dark:hover:bg-white dark:hover:text-ink"
          aria-label="Next artwork"
          onClick={onNext}
        >
          Next
          <ChevronRight size={17} className="transition-transform duration-300 group-hover:translate-x-0.5" />
        </button>
      </div>
      <article
        className={`max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[18px] bg-chalk outline-none transition-all duration-300 ease-out dark:bg-[#191a1f] dark:shadow-[0_34px_110px_rgba(0,0,0,0.72),0_0_48px_rgba(255,255,255,0.06)] ${
          visible ? "scale-100 opacity-100" : "scale-[0.98] opacity-0"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="artwork-title"
        tabIndex={-1}
      >
        <div
          className="grid min-h-[min(46rem,86vh)] lg:grid-cols-[1.15fr_0.85fr]"
        >
          <div className="relative grid min-h-[22rem] place-items-center overflow-hidden bg-[#202124] p-4 dark:bg-[#202124] md:min-h-[34rem] md:p-6 lg:min-h-0">
            {displayArtwork.kind === "3D" ? (
              <ModelViewer artwork={displayArtwork} />
            ) : (
              <img
                src={artworkImageFor(displayArtwork, 1400, 1800)}
                alt=""
                className="h-full max-h-[78vh] w-full rounded-[14px] bg-[#202124] object-contain dark:bg-[#202124]"
              />
            )}
          </div>
          <div className="p-6 md:p-10">
            <div className="mb-8 flex items-start justify-between gap-4">
              <div>
                <h3 id="artwork-title" className="text-4xl font-semibold leading-[1.08] tracking-[-0.01em] md:text-6xl">
                  {displayArtwork.title}
                </h3>
                <p className="mt-4 text-sm font-medium text-muted dark:text-white/60">
                  {displayArtwork.kind} · {displayArtwork.medium} · {displayArtwork.year}
                </p>
              </div>
              <button
                type="button"
                className="shrink-0 rounded-full bg-[#d2d2d7]/70 p-3 text-ink transition-all duration-300 hover:rotate-90 hover:bg-[#d2d2d7] active:scale-95 dark:bg-[#2a2b32] dark:text-white dark:shadow-[0_10px_28px_rgba(0,0,0,0.36)] dark:hover:bg-[#343640]"
                aria-label="Close artwork details"
                onClick={onClose}
                autoFocus
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-[17px] leading-[1.47] text-ink/75 dark:text-white/80">{displayArtwork.description}</p>
            <div className="mt-10 flex flex-wrap gap-2">
              {displayArtwork.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/75 px-4 py-2 text-sm font-medium text-ink/70 dark:bg-[#24252b] dark:text-white/75 dark:shadow-[0_12px_32px_rgba(0,0,0,0.30)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

export default App;
