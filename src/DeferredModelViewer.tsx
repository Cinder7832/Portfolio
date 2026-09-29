import { lazy, Suspense, useEffect, useRef, useState } from "react";
import type { Artwork } from "./data";
import { usePrefersReducedMotion } from "./motion";

const ModelViewer = lazy(() => import("./ModelViewer"));

type CompactViewerRequest = {
  active: boolean;
  cancelled: boolean;
  start: () => void;
};

const compactViewerQueue: CompactViewerRequest[] = [];
let activeCompactViewer: CompactViewerRequest | null = null;

const startNextCompactViewer = () => {
  if (activeCompactViewer) return;

  while (compactViewerQueue.length) {
    const request = compactViewerQueue.shift();
    if (!request || request.cancelled) continue;
    request.active = true;
    activeCompactViewer = request;
    request.start();
    break;
  }
};

const requestCompactViewer = (start: () => void) => {
  const request: CompactViewerRequest = { active: false, cancelled: false, start };
  compactViewerQueue.push(request);
  startNextCompactViewer();

  return () => {
    if (request.cancelled) return;
    request.cancelled = true;
    if (request.active && activeCompactViewer === request) {
      activeCompactViewer = null;
      window.setTimeout(startNextCompactViewer, 80);
    }
  };
};

const findScrollParent = (element: HTMLElement): HTMLElement | Window => {
  let parent = element.parentElement;

  while (parent) {
    const overflowY = window.getComputedStyle(parent).overflowY;
    if (overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay") {
      return parent;
    }
    parent = parent.parentElement;
  }

  return window;
};

export default function DeferredModelViewer({
  artwork,
  compact = false,
  keepMounted = false,
  preload = false,
}: {
  artwork: Artwork;
  compact?: boolean;
  keepMounted?: boolean;
  preload?: boolean;
}) {
  const boundaryRef = useRef<HTMLDivElement | null>(null);
  const releaseCompactSlotRef = useRef<(() => void) | null>(null);
  const viewerActiveRef = useRef(!compact);
  const [nearViewport, setNearViewport] = useState(!compact || preload);
  const [viewerActive, setViewerActive] = useState(!compact);
  const [ready, setReady] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const boundary = boundaryRef.current;
    if (!boundary || !compact || preload) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setNearViewport(entry.isIntersecting);
      },
      { rootMargin: "96px 0px" },
    );

    observer.observe(boundary);
    return () => observer.disconnect();
  }, [compact, preload]);

  useEffect(() => {
    setReady(false);
    setShowLoader(false);
    const frame = window.requestAnimationFrame(() => setShowLoader(true));
    return () => window.cancelAnimationFrame(frame);
  }, [artwork.id]);

  useEffect(() => {
    const boundary = boundaryRef.current;
    if (!compact || !boundary) return;

    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    const scrollParent = findScrollParent(boundary);
    let cancelled = false;
    let settleTimeout = 0;
    let idleCallback = 0;

    const cancelScheduledWork = () => {
      window.clearTimeout(settleTimeout);
      if (idleCallback) {
        idleWindow.cancelIdleCallback?.(idleCallback);
        idleCallback = 0;
      }
    };

    const activateViewer = () => {
      if (cancelled || viewerActiveRef.current || releaseCompactSlotRef.current) return;

      if (preload) {
        viewerActiveRef.current = true;
        setViewerActive(true);
        return;
      }

      releaseCompactSlotRef.current = requestCompactViewer(() => {
        if (cancelled) return;
        viewerActiveRef.current = true;
        setViewerActive(true);
      });
    };

    const updateViewerAfterScroll = () => {
      cancelScheduledWork();
      settleTimeout = window.setTimeout(() => {
        if (cancelled) return;

        if (!nearViewport) {
          if (keepMounted && viewerActiveRef.current) return;
          releaseCompactSlotRef.current?.();
          releaseCompactSlotRef.current = null;
          viewerActiveRef.current = false;
          setViewerActive(false);
          setReady(false);
          return;
        }

        if (viewerActiveRef.current) return;
        if (idleWindow.requestIdleCallback) {
          idleCallback = idleWindow.requestIdleCallback(activateViewer, { timeout: 1200 });
        } else {
          settleTimeout = window.setTimeout(activateViewer, 80);
        }
      }, 220);
    };

    scrollParent.addEventListener("scroll", updateViewerAfterScroll, { passive: true });
    updateViewerAfterScroll();

    return () => {
      cancelled = true;
      cancelScheduledWork();
      scrollParent.removeEventListener("scroll", updateViewerAfterScroll);
      if (!viewerActiveRef.current) {
        releaseCompactSlotRef.current?.();
        releaseCompactSlotRef.current = null;
      }
    };
  }, [compact, keepMounted, nearViewport, preload]);

  useEffect(
    () => () => {
      releaseCompactSlotRef.current?.();
      releaseCompactSlotRef.current = null;
    },
    [],
  );

  useEffect(() => {
    if (!compact || !viewerActive || ready) return;
    const timeout = window.setTimeout(() => {
      releaseCompactSlotRef.current?.();
      releaseCompactSlotRef.current = null;
    }, 12000);
    return () => window.clearTimeout(timeout);
  }, [compact, ready, viewerActive]);

  const handleReady = () => {
    setReady(true);
    releaseCompactSlotRef.current?.();
    releaseCompactSlotRef.current = null;
  };

  return (
    <div
      ref={boundaryRef}
      className="relative h-full min-h-[inherit] w-full overflow-hidden bg-[var(--model-viewer-bg)]"
    >
      <div
        className={`absolute inset-0 z-10 grid place-items-center bg-[var(--model-viewer-bg)] transition-opacity duration-300 ${
          ready ? "pointer-events-none opacity-0" : showLoader ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      >
        <span
          className={`grid place-items-center transition-opacity duration-200 ${
            nearViewport && showLoader && !ready ? "opacity-100" : "opacity-0"
          }`}
        >
          <span
            className="model-viewer-spinner"
            style={{ animationPlayState: nearViewport && !ready ? "running" : "paused" }}
          />
        </span>
      </div>
      {viewerActive && (
        <Suspense fallback={null}>
          <div
            className={`h-full min-h-[inherit] w-full transition-opacity duration-400 ease-out ${
              ready ? "opacity-100" : "opacity-0"
            }`}
          >
            <ModelViewer
              artwork={artwork}
              compact={compact}
              motionEnabled={!reducedMotion}
              onReady={handleReady}
            />
          </div>
        </Suspense>
      )}
      {!ready && <span className="sr-only">Loading interactive 3D model</span>}
    </div>
  );
}
