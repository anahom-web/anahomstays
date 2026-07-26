import { useEffect, useState } from "react";
import { motion, AnimatePresence, animate, useReducedMotion } from "framer-motion";
import { EASE } from "./Reveal";
import Logo from "./Logo";
import { SLOGAN } from "../../lib/brand";

/**
 * The opening title card — silence, the wordmark, a counter climbing to
 * one hundred, then the curtain lifts. Plays once per session; never for
 * users who prefer reduced motion.
 */
export default function Intro() {
  const prefersReduced = useReducedMotion();
  const [show, setShow] = useState(() => {
    try {
      return !window.sessionStorage.getItem("anahom-intro-seen");
    } catch {
      return false;
    }
  });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!show || prefersReduced) return;
    window.__lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const controls = animate(0, 100, {
      duration: 2,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setN(Math.floor(v)),
      onComplete: () => setTimeout(() => setShow(false), 250),
    });
    return () => controls.stop();
  }, [show, prefersReduced]);

  useEffect(() => {
    if (show) return;
    try {
      window.sessionStorage.setItem("anahom-intro-seen", "1");
    } catch {
      /* private mode — fine */
    }
    window.__lenis?.start();
    document.documentElement.style.overflow = "";
  }, [show]);

  if (prefersReduced) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          data-testid="intro-curtain"
          className="fixed inset-0 z-[80] bg-anahom-charcoal"
          exit={{ y: "-100%" }}
          transition={{ duration: 1.05, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Wordmark */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="reveal-mask">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}
                className="block"
              >
                <Logo height={54} className="md:h-20" />
              </motion.span>
            </span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 1 }}
              className="mt-6 text-[11px] md:text-xs font-sans tracking-[0.35em] uppercase text-anahom-white/50"
            >
              {SLOGAN}
            </motion.span>
          </div>

          {/* Counter */}
          <div className="absolute bottom-8 right-6 md:bottom-10 md:right-12 font-display font-light text-anahom-white/25 text-6xl md:text-8xl leading-none tabular-nums select-none">
            {String(n).padStart(3, "0")}
          </div>

          {/* Loading hairline */}
          <div className="absolute bottom-10 left-6 md:left-12 right-6 md:right-64 h-px bg-anahom-white/10">
            <div
              className="h-full bg-anahom-bronze origin-left"
              style={{ transform: `scaleX(${n / 100})` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
