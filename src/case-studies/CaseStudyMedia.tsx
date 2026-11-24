import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { Maximize2, X } from "lucide-react";
import { MOTION, usePrefersReducedMotion } from "../motion";

export function ExpandedImageViewer({
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
        .fromTo(image, { opacity: 0, scale: 0.985 }, { opacity: 1, scale: 1, duration: MOTION.base, ease: MOTION.easeOut, clearProps: "transform,opacity" }, 0.04);
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
      aria-label={`${title} expanded image`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-white/10 dark:bg-[rgba(0,0,0,0.18)]" aria-hidden="true" />
      <button
        type="button"
        className="icon-button-motion absolute right-4 top-4 z-10 grid size-11 place-items-center rounded-full bg-[rgba(29,29,31,0.72)] text-white shadow-[0_18px_44px_rgba(0,0,0,0.22)] backdrop-blur-xl hover:bg-[rgba(29,29,31,0.86)] dark:bg-white/16 dark:hover:bg-white/24 md:right-6 md:top-6"
        aria-label="Close expanded image"
        onClick={onClose}
      >
        <X size={21} />
      </button>
      <img ref={imageRef} src={src} alt={title} className="relative z-10 max-h-[92dvh] max-w-[94vw] object-contain shadow-[0_28px_90px_rgba(0,0,0,0.46)]" />
    </div>,
    document.body,
  );
}

export function CaseStudyShowcaseImage({ src, alt, title }: { src: string; alt: string; title: string }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <div className="relative overflow-hidden">
        <img src={src} alt={alt} className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.025]" />
        <button
          type="button"
          className="icon-button-motion absolute bottom-4 right-4 z-10 grid size-11 place-items-center rounded-full bg-white text-ink shadow-[0_18px_44px_rgba(0,0,0,0.28)] hover:bg-[#f5f5f7]"
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
