import { useEffect, useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
} from "lucide-react";
import { Project, profile, projects } from "./data";

gsap.registerPlugin(ScrollTrigger);

const imageFor = (seed: string, width = 1920, height = 1080) =>
  `https://picsum.photos/seed/${seed}/${width}/${height}`;

const profilePicture = `${import.meta.env.BASE_URL}profile-picture.jpg`;
const cvUrl = `${import.meta.env.BASE_URL}CV-Devanand-Asai.pdf`;

const scrollToSection = (targetId: string) => {
  document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
  window.history.replaceState(null, "", window.location.pathname);
};

function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const savedTheme = window.localStorage.getItem("theme");
    return savedTheme === "dark";
  });
  const lastFocusedElement = useRef<HTMLElement | null>(null);
  const overlayOpen = Boolean(selectedProject || showAllProjects);

  useGSAP(() => {
    gsap.fromTo(
      ".site-nav",
      { y: -18, opacity: 0, scale: 0.98 },
      { y: 0, opacity: 1, scale: 1, duration: 0.65, ease: "power3.out" },
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
  });

  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.add("theme-changing");
    document.documentElement.classList.toggle("dark", darkMode);
    window.localStorage.setItem("theme", darkMode ? "dark" : "light");
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
      <About />
      <Contact />
      <ProjectOverlay project={selectedProject} onClose={() => setSelectedProject(null)} />
      <AllProjectsOverlay
        open={showAllProjects}
        onClose={() => setShowAllProjects(false)}
        onSelect={setSelectedProject}
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
    ["About", "about"],
    ["Contact", "contact"],
  ];

  return (
    <header className="fixed left-0 right-0 top-0 z-40 px-4 pt-4 md:px-8">
        <div className="site-nav mx-auto flex w-fit items-center justify-center gap-2">
          <nav className="flex h-[58px] w-fit items-center justify-center rounded-full bg-chalk/86 px-2 shadow-nav backdrop-blur-xl transition-colors duration-300 dark:bg-[#24252b]/90 dark:shadow-[0_28px_88px_rgba(0,0,0,0.68),0_12px_34px_rgba(0,0,0,0.46),0_0_26px_rgba(255,255,255,0.05)]">
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
            className="grid size-[58px] place-items-center rounded-full bg-chalk/86 text-ink/70 shadow-nav backdrop-blur-xl transition-all duration-[250ms] hover:bg-ink hover:text-white hover:shadow-[0_16px_42px_rgba(29,29,31,0.22)] active:scale-95 dark:bg-[#24252b]/90 dark:text-white/80 dark:shadow-[0_28px_88px_rgba(0,0,0,0.68),0_12px_34px_rgba(0,0,0,0.46),0_0_26px_rgba(255,255,255,0.05)] dark:hover:bg-white dark:hover:text-ink dark:hover:shadow-[0_18px_48px_rgba(0,0,0,0.58),0_0_34px_rgba(255,255,255,0.12)]"
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
            className="profile-photo aspect-square w-full rounded-full bg-canvas object-cover shadow-[0_16px_45px_rgba(29,29,31,0.12)] transition-all duration-700 ease-out hover:scale-[1.025] hover:shadow-[0_22px_58px_rgba(29,29,31,0.16)] dark:bg-white dark:shadow-[0_26px_74px_rgba(0,0,0,0.55),0_0_42px_rgba(255,255,255,0.06)] dark:hover:shadow-[0_32px_88px_rgba(0,0,0,0.66),0_0_52px_rgba(255,255,255,0.08)]"
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
    scrollerRef.current?.scrollBy({
      left: direction === "left" ? -420 : 420,
      behavior: "smooth",
    });
  };

  return (
    <section id="projects" className="projects-section overflow-hidden bg-chalk px-4 py-20 transition-colors duration-300 dark:bg-[#191a1f] md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="reveal mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 className="max-w-4xl text-[clamp(2.3rem,5vw,4rem)] font-semibold leading-[1.08] tracking-[-0.01em]">
            Projects
          </h2>
          <button
            type="button"
            className="group inline-flex w-fit items-center gap-2 rounded-full bg-ink px-[22px] py-[11px] text-[17px] font-medium text-white transition-all duration-300 hover:bg-black hover:shadow-[0_14px_34px_rgba(29,29,31,0.18)] active:scale-95 dark:bg-white dark:text-ink dark:hover:bg-white/90 dark:hover:shadow-[0_14px_34px_rgba(255,255,255,0.12)]"
            onClick={onViewAll}
          >
            View all
            <ArrowUpRight size={17} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
        </div>
        <div className="mb-5 flex justify-end gap-2">
          <button
            type="button"
            className="group rounded-full bg-[#d2d2d7]/70 p-3 text-ink transition-all duration-300 hover:bg-[#d2d2d7] hover:shadow-[0_10px_26px_rgba(29,29,31,0.12)] active:scale-95 dark:bg-[#2a2b32] dark:text-white/80 dark:shadow-[0_12px_32px_rgba(0,0,0,0.36)] dark:hover:bg-[#343640] dark:hover:shadow-[0_16px_42px_rgba(0,0,0,0.48)]"
            aria-label="Scroll projects left"
            onClick={() => scrollProjects("left")}
          >
            <ChevronLeft size={20} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
          </button>
          <button
            type="button"
            className="group rounded-full bg-[#d2d2d7]/70 p-3 text-ink transition-all duration-300 hover:bg-[#d2d2d7] hover:shadow-[0_10px_26px_rgba(29,29,31,0.12)] active:scale-95 dark:bg-[#2a2b32] dark:text-white/80 dark:shadow-[0_12px_32px_rgba(0,0,0,0.36)] dark:hover:bg-[#343640] dark:hover:shadow-[0_16px_42px_rgba(0,0,0,0.48)]"
            aria-label="Scroll projects right"
            onClick={() => scrollProjects("right")}
          >
            <ChevronRight size={20} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </div>
        <div
          ref={scrollerRef}
          className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-10 py-16 [-ms-overflow-style:none] [scrollbar-width:none] md:-mx-8 md:px-16 [&::-webkit-scrollbar]:hidden"
        >
          {projects.map((project, index) => {
            return (
              <button
                key={project.id}
                type="button"
                className="project-card group relative h-[24rem] w-[82vw] shrink-0 snap-start overflow-hidden rounded-[18px] bg-canvas text-left shadow-[0_16px_38px_rgba(29,29,31,0.08)] outline-none transition-shadow duration-500 ease-out hover:shadow-[0_22px_52px_rgba(29,29,31,0.14)] focus-visible:ring-4 focus-visible:ring-blueFocus/35 dark:bg-[#24252b] dark:shadow-[0_24px_70px_rgba(0,0,0,0.56),0_0_30px_rgba(255,255,255,0.04)] dark:hover:shadow-[0_30px_86px_rgba(0,0,0,0.68),0_0_42px_rgba(255,255,255,0.06)] sm:w-[28rem] lg:w-[34rem]"
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
  const categories: Array<"All" | Project["category"]> = ["All", "Games", "3D", "2D Art", "Tools"];
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
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const [displayProject, setDisplayProject] = useState<Project | null>(project);
  const [shouldRender, setShouldRender] = useState(Boolean(project));
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (project) {
      setDisplayProject(project);
      setShouldRender(true);
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
      <article
        className={`max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[18px] bg-chalk outline-none transition-all duration-300 ease-out dark:bg-[#191a1f] dark:shadow-[0_34px_110px_rgba(0,0,0,0.72),0_0_48px_rgba(255,255,255,0.06)] ${
          visible ? "scale-100 opacity-100" : "scale-[0.98] opacity-0"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-title"
        tabIndex={-1}
      >
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-[20rem] overflow-hidden lg:min-h-full">
            <img
              src={imageFor(displayProject.imageSeed)}
              alt=""
              className="h-full min-h-[20rem] w-full object-cover brightness-[0.72] contrast-[1.1] saturate-[0.76]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/65 to-transparent" />
          </div>
          <div className="p-6 md:p-10">
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

export default App;
