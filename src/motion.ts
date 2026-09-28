import { useEffect, useState } from "react";

export const MOTION = {
  fast: 0.18,
  base: 0.32,
  slow: 0.72,
  easeOut: "power3.out",
  easeInOut: "power2.inOut",
} as const;

export const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia(reducedMotionQuery).matches;

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(prefersReducedMotion);

  useEffect(() => {
    const media = window.matchMedia(reducedMotionQuery);
    const updatePreference = () => setReduced(media.matches);

    updatePreference();
    media.addEventListener("change", updatePreference);
    return () => media.removeEventListener("change", updatePreference);
  }, []);

  return reduced;
}
