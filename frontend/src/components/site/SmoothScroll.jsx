import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Smooth momentum scrolling for the whole experience.
 *
 * Uses Lenis in lerp mode — the viewport eases toward the target every
 * frame rather than running a fixed-duration tween, which reads as one
 * continuous, weightless motion instead of a series of scroll "steps".
 * Touch is left to the platform (native momentum beats emulation on
 * phones); only the wheel is smoothed. Disabled entirely for visitors
 * who ask for reduced motion — they get honest native scroll.
 */
export default function SmoothScroll({ children }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Expose for programmatic scrolling (intro lock, checks).
    window.__lenis = lenis;

    // Smooth anchor links, respecting the fixed nav's height.
    const handleAnchor = (e) => {
      const target = e.target.closest("a[href^='#']");
      if (!target) return;
      const id = target.getAttribute("href");
      if (id.length > 1) {
        const el = document.querySelector(id);
        if (el) {
          e.preventDefault();
          lenis.scrollTo(el, { offset: id === "#top" ? 0 : -80, duration: 1.6 });
        }
      }
    };
    document.addEventListener("click", handleAnchor);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("click", handleAnchor);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return children;
}
