import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { EASE } from "./Reveal";

/**
 * A trailing ring that inverts whatever it passes over and swells on
 * interactive targets. The native cursor stays — this is an accent,
 * not a replacement. Fine pointers only.
 */
export default function Cursor() {
  const prefersReduced = useReducedMotion();
  const [enabled] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches,
  );
  const [hot, setHot] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 450, damping: 45, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 450, damping: 45, mass: 0.6 });

  useEffect(() => {
    if (!enabled || prefersReduced) return;
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e) => {
      setHot(!!e.target.closest?.("a, button, select, textarea, input, [role='button']"));
    };
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [enabled, prefersReduced, x, y]);

  if (!enabled || prefersReduced) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{ x: sx, y: sy }}
      className="fixed top-0 left-0 z-[75] pointer-events-none mix-blend-difference"
    >
      <motion.div
        animate={{ scale: hot ? 2.4 : 1, opacity: hot ? 0.9 : 0.6 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="-translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full border border-white"
      />
    </motion.div>
  );
}
