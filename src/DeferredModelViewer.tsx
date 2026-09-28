import { lazy, Suspense, useEffect, useRef, useState } from "react";
import type { Artwork } from "./data";
import { usePrefersReducedMotion } from "./motion";

const ModelViewer = lazy(() => import("./ModelViewer"));

export default function DeferredModelViewer({
  artwork,
  compact = false,
}: {
  artwork: Artwork;
  compact?: boolean;
}) {
  const boundaryRef = useRef<HTMLDivElement | null>(null);
  const [nearViewport, setNearViewport] = useState(!compact);
  const [ready, setReady] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const boundary = boundaryRef.current;
    if (!boundary || nearViewport) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "280px" },
    );

    observer.observe(boundary);
    return () => observer.disconnect();
  }, [nearViewport]);

  useEffect(() => setReady(false), [artwork.id]);

  return (
    <div
      ref={boundaryRef}
      className="relative h-full min-h-[inherit] w-full overflow-hidden bg-[var(--model-viewer-bg)]"
    >
      <div
        className={`model-viewer-fallback absolute inset-0 transition-opacity duration-500 ${
          ready ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
        aria-hidden="true"
      />
      {nearViewport && (
        <Suspense fallback={null}>
          <div
            className={`h-full min-h-[inherit] w-full transition-opacity duration-500 ${
              ready ? "opacity-100" : "opacity-0"
            }`}
          >
            <ModelViewer
              artwork={artwork}
              compact={compact}
              motionEnabled={!reducedMotion}
              onReady={() => setReady(true)}
            />
          </div>
        </Suspense>
      )}
      {!ready && <span className="sr-only">Loading interactive 3D model</span>}
    </div>
  );
}
