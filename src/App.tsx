import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Github,
  Linkedin,
  Mail,
  Menu,
  Moon,
  MoveRight,
  FileText,
  Sun,
  X,
} from "lucide-react";
import { Artwork, Project, artworks, profile, projects } from "./data";
import DeferredModelViewer from "./DeferredModelViewer";
import OverlayHost, { type OverlayState } from "./OverlayHost";
import { MOTION, prefersReducedMotion } from "./motion";

gsap.registerPlugin(ScrollTrigger);

const imageFor = (seed: string, width = 1920, height = 1080) =>
  `https://picsum.photos/seed/${seed}/${width}/${height}`;

const profilePicture = `${import.meta.env.BASE_URL}profile-picture.jpg`;
const cvUrl = `${import.meta.env.BASE_URL}CV-Devanand-Asai.pdf`;

let activeScrollTween: gsap.core.Tween | null = null;
let removeScrollInterruptionListeners: (() => void) | null = null;

const scrollToSection = (targetId: string) => {
  const target = document.getElementById(targetId);
  if (!target) return;

  activeScrollTween?.kill();
  removeScrollInterruptionListeners?.();

  if (prefersReducedMotion()) {
    target.scrollIntoView({ behavior: "auto" });
  } else {
    const scrollState = { y: window.scrollY };
    const destination = target.getBoundingClientRect().top + window.scrollY;
    const duration = Math.min(1.25, Math.max(0.55, Math.abs(destination - window.scrollY) / 2200));
    const stop = () => activeScrollTween?.kill();
    const cleanup = () => {
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
      removeScrollInterruptionListeners = null;
    };

    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchstart", stop, { passive: true });
    removeScrollInterruptionListeners = cleanup;
    activeScrollTween = gsap.to(scrollState, {
      y: destination,
      duration,
      ease: MOTION.easeInOut,
      overwrite: true,
      onUpdate: () => {
        document.documentElement.scrollTop = scrollState.y;
        document.body.scrollTop = scrollState.y;
      },
      onComplete: cleanup,
      onInterrupt: cleanup,
    });
  }
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

function App() {
  const [overlay, setOverlay] = useState<OverlayState | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const savedTheme = window.localStorage.getItem("theme");
    return savedTheme === "dark";
  });
  const hasMountedTheme = useRef(false);
  const appRef = useRef<HTMLElement | null>(null);

  useGSAP(() => {
    const profilePhoto = document.querySelector<HTMLImageElement>(".profile-photo");
    let introTimeline: gsap.core.Timeline | null = null;
    let cancelled = false;
    let refreshCall: gsap.core.Tween | null = null;
    const media = gsap.matchMedia();

    const finishIntro = () => {
      document.documentElement.classList.remove("js-intro-pending");
      gsap.set([".site-nav", ".hero-copy > *", ".profile-photo"], {
        clearProps: "willChange",
      });
      ScrollTrigger.refresh();
    };

    media.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set([".site-nav", ".hero-copy > *", ".profile-photo"], {
        clearProps: "all",
      });
      finishIntro();
    });

    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.set(".site-nav", { opacity: 0 });
      gsap.set(".hero-copy > *", { y: 28, opacity: 0, force3D: true, willChange: "transform,opacity" });
      gsap.set(".profile-photo", {
        opacity: 0,
        scale: 0.94,
        rotate: -1.5,
        transformOrigin: "50% 50%",
        force3D: true,
        willChange: "transform,opacity",
      });

      const fontReady = document.fonts?.ready.catch(() => undefined) ?? Promise.resolve();
      const profileReady =
        profilePhoto && !profilePhoto.complete
          ? new Promise<void>((resolve) => {
              profilePhoto.addEventListener("load", () => resolve(), { once: true });
              profilePhoto.addEventListener("error", () => resolve(), { once: true });
            })
          : (profilePhoto?.decode?.().catch(() => undefined) ?? Promise.resolve());

      const readinessTimeout = new Promise<void>((resolve) => window.setTimeout(resolve, 1600));

      Promise.race([Promise.all([fontReady, profileReady]).then(() => undefined), readinessTimeout])
        .then(
          () =>
            new Promise<void>((resolve) => {
              window.requestAnimationFrame(() => {
                window.requestAnimationFrame(() => resolve());
              });
            }),
        )
        .then(() => {
          if (cancelled) {
            return;
          }

          document.documentElement.classList.remove("js-intro-pending");
          introTimeline = gsap.timeline({
            defaults: { ease: MOTION.easeOut },
            onComplete: finishIntro,
          });

          introTimeline
            .to(".site-nav", { opacity: 1, duration: 0.52, clearProps: "opacity" }, 0)
            .to(
              ".hero-copy > *",
              { y: 0, opacity: 1, duration: 0.76, stagger: 0.09, clearProps: "transform,opacity,willChange" },
              0.08,
            )
            .to(
              ".profile-photo",
              { opacity: 1, scale: 1, rotate: 0, duration: 0.86, clearProps: "transform,opacity,willChange" },
              0.16,
            );
        });
      gsap.set(".reveal", { opacity: 0, y: 22 });
      ScrollTrigger.batch(".reveal", {
        start: "top 86%",
        once: true,
        onEnter: (batch) => gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.68,
          stagger: 0.08,
          ease: MOTION.easeOut,
          clearProps: "transform,opacity",
        }),
      });

      const projectCards = gsap.utils.toArray<HTMLElement>(".project-card");
      gsap.set(projectCards, { opacity: 0, y: 24 });
      ScrollTrigger.create({
        trigger: ".projects-scroller",
        start: "top 86%",
        once: true,
        onEnter: () => gsap.to(projectCards, {
          opacity: 1,
          y: 0,
          duration: 0.64,
          stagger: 0.055,
          ease: MOTION.easeOut,
          clearProps: "transform,opacity",
        }),
      });

      const artworkTiles = gsap.utils.toArray<HTMLElement>(".artwork-tile");
      gsap.set(artworkTiles, { opacity: 0, y: 24, scale: 0.975 });
      ScrollTrigger.batch(artworkTiles, {
        start: "top 90%",
        once: true,
        onEnter: (batch) => gsap.to(batch, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.64,
          stagger: 0.055,
          ease: MOTION.easeOut,
          clearProps: "transform,opacity",
        }),
      });

      gsap.fromTo(".projects-section", {
        borderTopLeftRadius: "44px",
        borderTopRightRadius: "44px",
      }, {
        borderTopLeftRadius: "0px",
        borderTopRightRadius: "0px",
        ease: "none",
        scrollTrigger: {
          trigger: ".projects-section",
          start: "top 92%",
          end: "top 18%",
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });

      const aboutWords = gsap.utils.toArray<HTMLElement>(".about-word");
      if (aboutWords.length) {
        gsap.set(aboutWords, { opacity: 0.14 });
        gsap.to(aboutWords, {
          opacity: 1,
          stagger: 0.045,
          ease: "none",
          scrollTrigger: {
            trigger: ".about-copy",
            start: "top 82%",
            end: "bottom 52%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      }
    });

    media.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const cards = gsap.utils.toArray<HTMLElement>(".about-stack-card");
      cards.forEach((card, index) => {
        gsap.fromTo(card, {
          y: 26 + index * 20,
          scale: 1 - index * 0.018,
          zIndex: cards.length - index,
        }, {
          y: 0,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".about-stack",
            start: "top 82%",
            end: "bottom 55%",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
      });
    });

    const scheduleRefresh = () => {
      refreshCall?.kill();
      refreshCall = gsap.delayedCall(0.12, () => ScrollTrigger.refresh());
    };
    const resizeObserver = new ResizeObserver(scheduleRefresh);
    if (appRef.current) resizeObserver.observe(appRef.current);
    window.addEventListener("load", scheduleRefresh, { once: true });

    return () => {
      cancelled = true;
      introTimeline?.kill();
      refreshCall?.kill();
      resizeObserver.disconnect();
      window.removeEventListener("load", scheduleRefresh);
      media.revert();
      document.documentElement.classList.remove("js-intro-pending");
    };
  }, { scope: appRef });

  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  useLayoutEffect(() => {
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

    return () => {
      window.clearTimeout(timeout);
      document.documentElement.classList.remove("theme-changing");
    };
  }, [darkMode]);

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

  return (
    <main ref={appRef} className="w-full max-w-full overflow-x-hidden bg-canvas text-ink transition-[background-color] duration-300 dark:bg-[#101114] dark:text-[#f5f5f7]">
      <Navigation darkMode={darkMode} onToggleTheme={() => setDarkMode((value) => !value)} />
      <Hero />
      <Projects
        onSelect={(project) => setOverlay({ type: "project", project })}
        onViewAll={() => setOverlay({ type: "all-projects" })}
      />
      <ArtworkSection
        onSelect={(artwork) => setOverlay({ type: "artwork", artwork })}
        onViewAll={() => setOverlay({ type: "all-artwork" })}
      />
      <About />
      <Contact />
      <OverlayHost state={overlay} onChange={setOverlay} />
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
  const menuRef = useRef<HTMLDivElement | null>(null);
  const links = [
    ["Home", "home"],
    ["Projects", "projects"],
    ["Artwork", "artwork"],
    ["About", "about"],
    ["Contact", "contact"],
  ];

  useGSAP(() => {
    const menu = menuRef.current;
    if (!menu) return;
    const openPadding = 24;
    const menuHeight = menu.scrollHeight + openPadding;

    if (prefersReducedMotion()) {
      gsap.set(menu, {
        height: open ? menuHeight : 0,
        paddingTop: open ? "0.75rem" : 0,
        paddingBottom: open ? "0.75rem" : 0,
        autoAlpha: open ? 1 : 0,
        y: 0,
      });
      return;
    }

    const tween = gsap.to(menu, {
      height: open ? menuHeight : 0,
      paddingTop: open ? "0.75rem" : 0,
      paddingBottom: open ? "0.75rem" : 0,
      autoAlpha: open ? 1 : 0,
      y: open ? 0 : -8,
      duration: open ? MOTION.base : MOTION.fast,
      ease: open ? MOTION.easeOut : "power2.in",
      overwrite: true,
    });
    return () => tween.kill();
  }, { dependencies: [open], scope: menuRef });

  return (
    <header className="fixed left-0 right-0 top-0 z-40 px-4 pt-4 md:px-8">
        <div className="site-nav mx-auto flex w-fit items-center justify-center gap-2">
          <nav className="glass-nav-surface flex h-[58px] w-fit items-center justify-center rounded-full px-2 transition-[background-color,box-shadow] duration-300">
            <div className="hidden items-center gap-1 md:flex">
              {links.map(([label, href]) => (
                <button
                  key={label}
                  type="button"
                  className="rounded-full px-5 py-2.5 text-sm font-medium text-ink/70 transition-[background-color,color,box-shadow,transform] duration-[250ms] ease-out hover:bg-ink hover:text-white hover:shadow-[0_8px_24px_rgba(29,29,31,0.14)] active:scale-95 dark:text-white/80 dark:hover:bg-white dark:hover:text-ink dark:hover:shadow-[0_12px_30px_rgba(255,255,255,0.18)]"
                  onClick={() => scrollToSection(href)}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="rounded-full px-3 py-2 text-ink transition-transform duration-300 hover:scale-105 active:scale-95 dark:text-white md:hidden"
              aria-label={open ? "Close navigation" : "Open navigation"}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X size={19} /> : <Menu size={19} />}
            </button>
          </nav>
          <button
            type="button"
            className="glass-nav-surface grid size-[58px] place-items-center rounded-full text-ink/70 transition-[background-color,color,box-shadow,transform] duration-[250ms] hover:bg-ink hover:text-white hover:shadow-[0_16px_42px_rgba(29,29,31,0.22)] active:scale-95 dark:text-white/80 dark:hover:bg-white dark:hover:text-ink dark:hover:shadow-[0_18px_48px_rgba(0,0,0,0.58),0_0_34px_rgba(255,255,255,0.12)]"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            aria-pressed={darkMode}
            onClick={onToggleTheme}
          >
            {darkMode ? <Sun size={19} /> : <Moon size={19} />}
          </button>
        </div>
        <div
          ref={menuRef}
          className="invisible mx-auto mt-2 grid h-0 max-w-6xl gap-1 overflow-hidden rounded-3xl bg-chalk/95 px-3 opacity-0 shadow-soft backdrop-blur-xl transition-[background-color,box-shadow] duration-300 dark:bg-[#24252b]/95 dark:shadow-[0_26px_80px_rgba(0,0,0,0.55)] md:hidden"
          aria-hidden={!open}
        >
          {links.map(([label, href]) => (
            <button
              key={label}
              type="button"
              className="rounded-2xl px-4 py-3 text-sm text-ink/75 transition-[background-color,color,padding] duration-[250ms] hover:bg-canvas hover:pl-5 dark:text-white/80 dark:hover:bg-white/12"
              tabIndex={open ? 0 : -1}
              onClick={() => {
                scrollToSection(href);
                setOpen(false);
              }}
            >
              {label}
            </button>
          ))}
        </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="home" className="relative min-h-[84vh] overflow-hidden bg-canvas px-4 pb-16 pt-28 transition-[background-color] duration-300 dark:bg-[#101114] md:px-8 md:pb-20 md:pt-32">
      <div className="relative mx-auto grid min-h-[58vh] max-w-7xl items-center gap-10 lg:grid-cols-[1fr_0.78fr]">
        <div className="hero-copy order-2 mx-auto max-w-6xl text-center lg:order-none lg:mx-0 lg:text-left">
          <h1 className="max-w-6xl text-[clamp(3rem,6vw,5.4rem)] font-semibold leading-[1.03] tracking-[-0.01em]">
            Devanand Asai
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-[21px] leading-[1.25] text-ink/80 dark:text-white/80 lg:mx-0">
            Game Development &amp; Creative Media student at New College Swindon.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <button
              type="button"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-ink px-[22px] py-[11px] text-[17px] font-medium text-white transition-[background-color,color,box-shadow,transform] duration-300 hover:bg-black hover:shadow-[0_14px_34px_rgba(29,29,31,0.18)] active:scale-95 dark:bg-white dark:text-ink dark:hover:bg-white/90 dark:hover:shadow-[0_14px_34px_rgba(255,255,255,0.12)]"
              onClick={() => scrollToSection("projects")}
            >
              View projects
              <MoveRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-transparent px-[22px] py-[11px] text-[17px] font-medium text-ink transition-[background-color,color,box-shadow,transform] duration-300 hover:bg-chalk hover:shadow-[0_12px_30px_rgba(29,29,31,0.10)] active:scale-95 dark:text-white dark:hover:bg-white/10 dark:hover:shadow-[0_18px_48px_rgba(0,0,0,0.42)]"
            >
              LinkedIn
              <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
        <div className="order-1 mx-auto grid w-full max-w-[12rem] place-items-center sm:max-w-[16rem] md:max-w-[20rem] lg:order-none lg:max-w-[26rem]">
          <img
            src={profilePicture}
            alt="Devanand Asai profile picture"
            className="profile-photo aspect-square w-full rounded-full bg-canvas object-cover shadow-[0_16px_45px_rgba(29,29,31,0.12)] transition-shadow duration-700 ease-out hover:shadow-[0_22px_58px_rgba(29,29,31,0.16)] dark:bg-white dark:shadow-[0_0_0_1px_rgba(255,255,255,0.18),0_28px_80px_rgba(0,0,0,0.62),0_0_64px_rgba(255,255,255,0.10)] dark:hover:shadow-[0_0_0_1px_rgba(255,255,255,0.22),0_34px_96px_rgba(0,0,0,0.72),0_0_78px_rgba(255,255,255,0.13)]"
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
  const targetIndexRef = useRef(0);
  const programmaticScrollRef = useRef(false);
  const scrollEndTimerRef = useRef(0);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const syncNearestCard = () => {
      const cards = Array.from(scroller.querySelectorAll<HTMLElement>(".project-card"));
      if (!cards.length) return;

      const maxScroll = scroller.scrollWidth - scroller.clientWidth;
      if (scroller.scrollLeft <= 1) {
        targetIndexRef.current = 0;
        return;
      }
      if (scroller.scrollLeft >= maxScroll - 1) {
        targetIndexRef.current = cards.length - 1;
        return;
      }
      targetIndexRef.current = cards.reduce((nearestIndex, card, index) => {
        const cardTarget = Math.min(
          maxScroll,
          Math.max(0, card.offsetLeft - (scroller.clientWidth - card.offsetWidth) / 2),
        );
        const nearestCard = cards[nearestIndex];
        const nearestTarget = Math.min(
          maxScroll,
          Math.max(0, nearestCard.offsetLeft - (scroller.clientWidth - nearestCard.offsetWidth) / 2),
        );
        return Math.abs(cardTarget - scroller.scrollLeft) < Math.abs(nearestTarget - scroller.scrollLeft)
          ? index
          : nearestIndex;
      }, 0);
    };

    const finishProgrammaticScroll = () => {
      programmaticScrollRef.current = false;
      syncNearestCard();
    };

    const onScroll = () => {
      window.clearTimeout(scrollEndTimerRef.current);
      scrollEndTimerRef.current = window.setTimeout(finishProgrammaticScroll, 140);
      if (!programmaticScrollRef.current) syncNearestCard();
    };

    const interruptProgrammaticScroll = () => {
      programmaticScrollRef.current = false;
      window.clearTimeout(scrollEndTimerRef.current);
      syncNearestCard();
    };

    syncNearestCard();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    scroller.addEventListener("pointerdown", interruptProgrammaticScroll, { passive: true });
    scroller.addEventListener("touchstart", interruptProgrammaticScroll, { passive: true });
    scroller.addEventListener("wheel", interruptProgrammaticScroll, { passive: true });

    return () => {
      window.clearTimeout(scrollEndTimerRef.current);
      scroller.removeEventListener("scroll", onScroll);
      scroller.removeEventListener("pointerdown", interruptProgrammaticScroll);
      scroller.removeEventListener("touchstart", interruptProgrammaticScroll);
      scroller.removeEventListener("wheel", interruptProgrammaticScroll);
    };
  }, []);

  const scrollProjects = (direction: "left" | "right") => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const cards = Array.from(scroller.querySelectorAll<HTMLElement>(".project-card"));
    if (!cards.length) return;

    const offset = direction === "left" ? -1 : 1;
    const nextIndex = Math.min(cards.length - 1, Math.max(0, targetIndexRef.current + offset));
    const target = cards[nextIndex];
    const maxScroll = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
    const destination = Math.min(
      maxScroll,
      Math.max(0, target.offsetLeft - (scroller.clientWidth - target.offsetWidth) / 2),
    );

    if (nextIndex === targetIndexRef.current && Math.abs(destination - scroller.scrollLeft) < 1) {
      programmaticScrollRef.current = false;
      return;
    }

    targetIndexRef.current = nextIndex;
    programmaticScrollRef.current = true;
    window.clearTimeout(scrollEndTimerRef.current);
    scroller.scrollTo({
      left: destination,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  return (
    <section id="projects" className="projects-section overflow-hidden bg-chalk py-20 transition-[background-color] duration-300 dark:bg-[#191a1f] md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="reveal mb-6 flex flex-col justify-between gap-6 px-4 md:mb-7 md:flex-row md:items-end md:px-8 xl:px-0">
          <div>
            <h2 className="max-w-4xl text-[clamp(2.3rem,5vw,4rem)] font-semibold leading-[1.08] tracking-[-0.01em]">
              Projects
            </h2>
            <p className="mt-4 max-w-2xl text-[17px] leading-[1.47] text-ink/70 dark:text-white/70">
              Games, tools, and development experiments with case studies.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <div className="flex w-fit gap-1 rounded-full bg-canvas/75 p-1 shadow-[0_12px_30px_rgba(29,29,31,0.08)] backdrop-blur-xl dark:bg-[#24252b] dark:shadow-[0_18px_46px_rgba(0,0,0,0.46)]">
              <button
                type="button"
                className="group grid size-10 place-items-center rounded-full text-ink/72 transition-[background-color,color,transform] duration-300 hover:bg-ink hover:text-white active:scale-95 dark:text-white/75 dark:hover:bg-white dark:hover:text-ink"
                aria-label="Scroll projects left"
                onClick={() => scrollProjects("left")}
              >
                <ChevronLeft size={20} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
              </button>
              <button
                type="button"
                className="group grid size-10 place-items-center rounded-full text-ink/72 transition-[background-color,color,transform] duration-300 hover:bg-ink hover:text-white active:scale-95 dark:text-white/75 dark:hover:bg-white dark:hover:text-ink"
                aria-label="Scroll projects right"
                onClick={() => scrollProjects("right")}
              >
                <ChevronRight size={20} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>
            </div>
            <button
              type="button"
              className="group inline-flex w-fit items-center gap-2 rounded-full bg-ink px-[22px] py-[11px] text-[17px] font-medium text-white transition-[background-color,color,box-shadow,transform] duration-300 hover:bg-black hover:shadow-[0_14px_34px_rgba(29,29,31,0.18)] active:scale-95 dark:bg-white dark:text-ink dark:hover:bg-white/90 dark:hover:shadow-[0_14px_34px_rgba(255,255,255,0.12)]"
              onClick={onViewAll}
            >
              View all
              <ArrowUpRight size={17} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
        <div
          ref={scrollerRef}
          className="projects-scroller -mx-10 flex w-[calc(100%+5rem)] snap-x snap-mandatory gap-4 overflow-x-auto px-14 pb-28 pt-8 [-ms-overflow-style:none] [scrollbar-width:none] md:-mx-12 md:w-[calc(100%+6rem)] md:gap-6 md:px-20 md:pb-32 xl:-mx-16 xl:w-[calc(100%+8rem)] xl:px-16 [&::-webkit-scrollbar]:hidden"
        >
          {projects.map((project, index) => {
            return (
              <button
                key={project.id}
                type="button"
                className="project-card group relative h-[24rem] w-[min(24rem,calc(100%_-_2rem))] shrink-0 snap-center overflow-hidden rounded-[18px] bg-canvas text-left shadow-[0_16px_38px_rgba(29,29,31,0.08)] outline-none transition-shadow duration-500 ease-out hover:shadow-[0_22px_52px_rgba(29,29,31,0.14)] focus-visible:ring-4 focus-visible:ring-blueFocus/35 dark:bg-[#24252b] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_34px_86px_rgba(0,0,0,0.66),0_0_42px_rgba(255,255,255,0.06)] dark:hover:shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_42px_104px_rgba(0,0,0,0.78),0_0_58px_rgba(255,255,255,0.09)] sm:w-[28rem] lg:w-[38rem]"
                onClick={() => onSelect(project)}
              >
                <img
                  src={imageFor(project.imageSeed)}
                  alt=""
                  className="h-full w-full object-cover brightness-[0.68] contrast-[1.12] saturate-[0.72] transition duration-700 ease-out group-hover:scale-[1.035] group-hover:brightness-100 group-hover:contrast-100 group-hover:saturate-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/42 to-transparent transition-opacity duration-500 group-hover:opacity-92" />
                <div className="pointer-events-none absolute inset-y-0 left-[-55%] w-1/2 -skew-x-12 bg-white/14 opacity-0 blur-sm transition-[left,opacity] duration-700 ease-out group-hover:left-[115%] group-hover:opacity-100" />
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
    <section id="artwork" className="overflow-hidden bg-canvas px-4 py-20 transition-[background-color] duration-300 dark:bg-[#101114] md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="reveal mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 className="max-w-5xl text-[clamp(2.3rem,5vw,4rem)] font-semibold leading-[1.08] tracking-[-0.01em]">
              Artwork
            </h2>
            <p className="mt-4 max-w-2xl text-[17px] leading-[1.47] text-ink/70 dark:text-white/70">
              Sketches, concepts, 3D models, studies, and visual experiments.
            </p>
          </div>
          <button
            type="button"
            className="group inline-flex w-fit items-center gap-2 rounded-full bg-ink px-[22px] py-[11px] text-[17px] font-medium text-white transition-[background-color,color,box-shadow,transform] duration-300 hover:bg-black hover:shadow-[0_14px_34px_rgba(29,29,31,0.18)] active:scale-95 dark:bg-white dark:text-ink dark:hover:bg-white/90 dark:hover:shadow-[0_14px_34px_rgba(255,255,255,0.12)]"
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
              className="artwork-tile group mb-4 block w-full break-inside-avoid overflow-hidden rounded-[18px] bg-chalk text-left shadow-[0_16px_38px_rgba(29,29,31,0.08)] outline-none transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_22px_52px_rgba(29,29,31,0.14)] focus-visible:ring-4 focus-visible:ring-blueFocus/35 dark:bg-[#1c1d23] dark:shadow-[0_24px_70px_rgba(0,0,0,0.56)] dark:hover:shadow-[0_30px_86px_rgba(0,0,0,0.7)]"
              style={{ animationDelay: `${index * 45}ms` }}
              onClick={() => onSelect(artwork)}
            >
              <div className={`overflow-hidden ${artworkMediaAspectClass(artwork)}`}>
                {artwork.kind === "3D" ? (
                  <DeferredModelViewer artwork={artwork} compact keepMounted preload />
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

function About() {
  const introduction = "Game Development & Creative Media student at New College Swindon.";
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
    <section id="about" className="bg-canvas px-4 py-20 transition-[background-color] duration-300 dark:bg-[#101114] md:px-8 md:py-24">
      <div className="reveal mx-auto max-w-3xl text-center">
        <div>
          <h2 className="text-[clamp(2.4rem,5vw,4.5rem)] font-semibold leading-[1.03] tracking-[-0.01em]">
            About me
          </h2>
          <div className="about-copy mx-auto mt-7 max-w-2xl space-y-5 text-[17px] leading-[1.47] text-ink/75 dark:text-white/80">
            <p aria-label={introduction}>
              {introduction.split(" ").map((word, index) => (
                <span key={`${word}-${index}`} className="about-word inline-block" aria-hidden="true">
                  {word}{index < introduction.split(" ").length - 1 ? "\u00a0" : ""}
                </span>
              ))}
            </p>
          </div>
          <div className="about-stack mx-auto mt-10 grid max-w-2xl gap-6">
            <div className="about-stack-card rounded-[18px] bg-chalk p-5 shadow-[0_12px_30px_rgba(29,29,31,0.04)] transition-[background-color,box-shadow] duration-300 dark:bg-[#1c1d23] dark:shadow-[0_22px_60px_rgba(0,0,0,0.46)]">
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted dark:text-white/60">Skills</h3>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-canvas px-4 py-2 text-sm font-medium text-ink transition-[background-color] duration-300 dark:bg-[#30313a] dark:text-white/80"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="about-stack-card rounded-[18px] bg-chalk p-5 shadow-[0_12px_30px_rgba(29,29,31,0.04)] transition-[background-color,box-shadow] duration-300 dark:bg-[#1c1d23] dark:shadow-[0_22px_60px_rgba(0,0,0,0.46)]">
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted dark:text-white/60">Tools</h3>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {tools.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-full bg-canvas px-4 py-2 text-sm font-medium text-ink transition-[background-color] duration-300 dark:bg-[#30313a] dark:text-white/80"
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
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-ink px-[22px] py-[11px] text-[17px] font-medium text-white transition-[background-color,color,box-shadow,transform] duration-300 hover:bg-black hover:shadow-[0_14px_34px_rgba(29,29,31,0.18)] active:scale-95 dark:bg-white dark:text-ink dark:hover:bg-white/90 dark:hover:shadow-[0_14px_34px_rgba(255,255,255,0.12)]"
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
    <section id="contact" className="bg-canvas px-4 py-20 transition-[background-color] duration-300 dark:bg-[#101114] md:px-8 md:py-24">
      <div className="reveal mx-auto max-w-6xl text-center">
        <h2 className="text-[clamp(2.6rem,6vw,5rem)] font-semibold leading-[1.05] tracking-[-0.01em]">
          Contact
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-[21px] leading-[1.25] text-ink/75 dark:text-white/80">
          Reach out for development work or collaboration.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={`mailto:${profile.email}`}
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-ink px-[22px] py-[11px] text-[17px] font-medium text-white transition-[background-color,color,box-shadow,transform] duration-300 hover:bg-black hover:shadow-[0_14px_34px_rgba(29,29,31,0.18)] active:scale-95 dark:bg-white dark:text-ink dark:hover:bg-white/90 dark:hover:shadow-[0_14px_34px_rgba(255,255,255,0.12)]"
          >
            <Mail size={18} />
            Email me
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-transparent px-[22px] py-[11px] text-[17px] font-medium text-ink transition-[background-color,color,box-shadow,transform] duration-300 hover:bg-chalk hover:shadow-[0_12px_30px_rgba(29,29,31,0.10)] active:scale-95 dark:text-white dark:hover:bg-white/10 dark:hover:shadow-[0_18px_48px_rgba(0,0,0,0.42)]"
          >
            <Github size={18} />
            GitHub
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-transparent px-[22px] py-[11px] text-[17px] font-medium text-ink transition-[background-color,color,box-shadow,transform] duration-300 hover:bg-chalk hover:shadow-[0_12px_30px_rgba(29,29,31,0.10)] active:scale-95 dark:text-white dark:hover:bg-white/10 dark:hover:shadow-[0_18px_48px_rgba(0,0,0,0.42)]"
          >
            <Linkedin size={18} />
            LinkedIn
          </a>
        </div>
      </div>
      <footer className="mx-auto mt-20 max-w-6xl border-t border-hairline pt-8 text-center text-xs text-muted transition-[border-color] duration-300 dark:border-white/10 dark:text-white/60">
        <p>&copy; 2026 Devanand Asai. All rights reserved.</p>
      </footer>
    </section>
  );
}

export default App;
