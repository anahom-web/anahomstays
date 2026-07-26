import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Smooth momentum scrolling — but only where it genuinely helps.
 *
 * Lenis drives the scroll position from JavaScript every frame. Chromium
 * updates position:sticky in the same frame, so the pinned scenes stay
 * glued. WebKit (Safari on Mac, and every browser on iPhone/iPad)
 * composites sticky elements asynchronously — while a script animates
 * the scroll, the pinned layers visibly lag and the scenes appear to
 * tear apart, worst of all during initial load. So on WebKit and on
 * touch devices we don't fight the platform: native Apple scrolling is
 * already inertial and smooth, and sticky stays perfectly in sync.
 *
 * Anchor links scroll smoothly in both worlds.
 */
const NAV_OFFSET = -80;

export default function SmoothScroll({ children }) {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isWebKit = /Apple/i.test(navigator.vendor || "");
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const useLenis = !reduced && !isWebKit && !isTouch;

    let lenis = null;
    let rafId = null;

    if (useLenis) {
      lenis = new Lenis({
        lerp: 0.09,
        smoothWheel: true,
        wheelMultiplier: 1,
      });
      const raf = (time) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
      // Exposed for the intro's scroll lock and programmatic checks.
      window.__lenis = lenis;
    }

    // Smooth anchor navigation, honouring the fixed nav's height.
    const handleAnchor = (e) => {
      const target = e.target.closest("a[href^='#']");
      if (!target) return;
      const id = target.getAttribute("href");
      if (id.length <= 1) return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      const offset = id === "#top" ? 0 : NAV_OFFSET;
      if (lenis) {
        lenis.scrollTo(el, { offset, duration: 1.6 });
      } else {
        const y = el.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top: Math.max(0, y), behavior: reduced ? "auto" : "smooth" });
      }
    };
    document.addEventListener("click", handleAnchor);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      document.removeEventListener("click", handleAnchor);
      if (lenis) {
        lenis.destroy();
        delete window.__lenis;
      }
    };
  }, []);

  return children;
}
