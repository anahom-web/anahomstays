import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { EASE, RevealChars, Magnetic } from "./Reveal";
import Frame from "./Frame";
import { SLOGAN } from "../../lib/brand";

/**
 * Scene 1 — the establishing shot.
 * One image is held on screen across 230vh of scroll while two moments
 * unfold over it: the opening headline, then the founding belief.
 */
const HERO_ID = "20_oyfxs5";

export default function Hero() {
  const ref = useRef(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // The camera drifts and pushes in, slowly, for the entire scene.
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", prefersReduced ? "0%" : "8%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, prefersReduced ? 1 : 1.14]);

  // Moment one — the headline.
  const p1Opacity = useTransform(scrollYProgress, [0, 0.14, 0.3], [1, 1, 0]);
  const p1Y = useTransform(scrollYProgress, [0, 0.3], ["0%", "-14%"]);

  // Moment two — the belief, over the same image.
  const p2Opacity = useTransform(scrollYProgress, [0.4, 0.54, 0.8, 0.94], [0, 1, 1, 0]);
  const p2Y = useTransform(scrollYProgress, [0.4, 0.94], [36, -36]);

  const hintOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  return (
    <section
      id="top"
      ref={ref}
      data-testid="hero-section"
      className="relative h-[230vh] bg-anahom-charcoal"
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* Media layer — scroll-linked drift wraps a slow settling zoom */}
        <motion.div style={{ y: imgY, scale: imgScale }} className="absolute inset-0 will-change-transform">
          <Frame
            id={HERO_ID}
            w={2000}
            eager
            priority
            sizes="100vw"
            testId="hero-image"
            alt="A lime-washed Anahom living room with soft arches, olive trees and morning light"
            className="h-full w-full"
            motionProps={{
              initial: { scale: prefersReduced ? 1 : 1.16 },
              animate: { scale: 1 },
              transition: { duration: 3.4, ease: EASE },
            }}
          />
        </motion.div>

        {/* Readability tint */}
        <div className="absolute inset-0 bg-anahom-charcoal/40" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-anahom-charcoal/60 to-transparent" />

        {/* Moment one — headline */}
        <motion.div
          style={{ y: p1Y, opacity: p1Opacity }}
          className="absolute inset-0 z-10 flex flex-col justify-end pb-24 md:pb-28 px-6 md:px-12 lg:px-24 max-w-screen-2xl mx-auto"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-xs md:text-sm font-sans tracking-[0.3em] uppercase text-anahom-white/80 mb-6"
          >
            {SLOGAN}
          </motion.span>

          <RevealChars
            as="h1"
            delay={0.4}
            lines={["It begins", "with home."]}
            className="font-display font-light text-anahom-white text-6xl sm:text-7xl md:text-8xl lg:text-[8.5rem] leading-[0.95] tracking-tight max-w-5xl drop-shadow-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="mt-10"
          >
            <Magnetic strength={0.25}>
              <a
                href="#philosophy"
                data-testid="hero-cta"
                className="group inline-flex items-center gap-3 self-start bg-anahom-white text-anahom-charcoal font-sans text-sm tracking-wide px-7 py-3.5 rounded-full hover:bg-anahom-bronze hover:text-anahom-white transition-colors duration-500"
              >
                Begin the story
                <span className="inline-block transition-transform duration-500 group-hover:translate-x-1">→</span>
              </a>
            </Magnetic>
          </motion.div>
        </motion.div>

        {/* Moment two — the belief, held on the same image */}
        <motion.div
          style={{ y: p2Y, opacity: p2Opacity }}
          className="absolute inset-0 z-10 flex items-center justify-center px-6 md:px-12"
        >
          <p className="font-display font-light text-anahom-white text-3xl md:text-5xl lg:text-[3.2rem] leading-[1.35] text-center max-w-4xl">
            Anahom began with a simple belief —{" "}
            <span className="italic">the places we stay should leave us calmer than they found us.</span>
          </p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-3"
        >
          <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-anahom-white/70">Scroll</span>
          <div className="h-14 w-px bg-anahom-white/30 overflow-hidden">
            <motion.div
              className="h-1/2 w-full bg-anahom-white"
              animate={{ y: ["-100%", "200%"] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
