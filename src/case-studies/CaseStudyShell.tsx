import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { ChevronLeft } from "lucide-react";
import { CASE_STUDY_CHAPTERS, type CaseStudyChapter, type CaseStudyNavigationDefinition } from "./types";

export default function CaseStudyShell({
  definition,
  scrollRef,
  onClose,
  className = "",
  children,
}: {
  definition: CaseStudyNavigationDefinition;
  scrollRef: RefObject<HTMLDivElement | null>;
  onClose: () => void;
  className?: string;
  children: ReactNode;
}) {
  const chapters = definition.chapters ?? CASE_STUDY_CHAPTERS;
  const [activeChapter, setActiveChapter] = useState<CaseStudyChapter>("showcase");
  const pendingChapter = useRef<CaseStudyChapter | null>(null);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const sections = chapters.map((chapter) => root.querySelector<HTMLElement>(`#${chapter}`)).filter(
      (section): section is HTMLElement => Boolean(section),
    );
    if (!sections.length) return;

    let frame = 0;
    let settleTimer = 0;
    const updateActiveChapter = () => {
      frame = 0;
      if (pendingChapter.current) return;
      const reachedEnd = root.scrollHeight - root.scrollTop - root.clientHeight <= 4;
      if (reachedEnd) {
        setActiveChapter(sections[sections.length - 1].id as CaseStudyChapter);
        return;
      }
      const rootTop = root.getBoundingClientRect().top;
      const chapterLine = rootTop + 80;
      let current = sections[0];

      for (const section of sections) {
        if (section.getBoundingClientRect().top <= chapterLine) current = section;
        else break;
      }

      setActiveChapter(current.id as CaseStudyChapter);
    };
    const onScroll = () => {
      if (pendingChapter.current) {
        window.clearTimeout(settleTimer);
        settleTimer = window.setTimeout(() => {
          pendingChapter.current = null;
          updateActiveChapter();
        }, 140);
      }
      if (frame) return;
      frame = window.requestAnimationFrame(updateActiveChapter);
    };

    updateActiveChapter();
    root.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      root.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      window.clearTimeout(settleTimer);
    };
  }, [chapters, scrollRef]);

  const goToChapter = (chapter: CaseStudyChapter) => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    pendingChapter.current = prefersReducedMotion ? null : chapter;
    setActiveChapter(chapter);
    scrollRef.current?.querySelector<HTMLElement>(`#${chapter}`)?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <div
      ref={scrollRef}
      className={`case-study-shell detail-scrollbar relative h-full max-w-full overflow-x-hidden overflow-y-auto ${className}`}
      style={{ fontFamily: '"Cabinet Grotesk", "Outfit", sans-serif' }}
    >
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-black text-white" aria-label={`${definition.title} case study`}>
        <div className="flex w-full items-center gap-3 px-3 py-3 md:px-4">
          <button
            type="button"
            onClick={onClose}
            className="icon-button-motion grid size-10 shrink-0 place-items-center rounded-full bg-white text-[#171717] hover:bg-white/85 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/35"
            aria-label="Back to projects"
          >
            <ChevronLeft size={19} />
          </button>
          <span className="hidden shrink-0 text-sm font-semibold sm:block">{definition.title}</span>
          <div className="ml-auto flex min-w-0 gap-1 overflow-x-auto rounded-full bg-white/8 p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {chapters.map((chapter) => {
              const active = activeChapter === chapter;
              return (
                <button
                  key={chapter}
                  type="button"
                  onClick={() => goToChapter(chapter)}
                  aria-current={active ? "location" : undefined}
                  className={`shrink-0 rounded-full px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 md:px-4 ${
                    active ? "bg-white text-[#171717]" : "text-white/64 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {definition.sections[chapter].label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
      <main className="w-full max-w-full overflow-x-hidden">{children}</main>
    </div>
  );
}
