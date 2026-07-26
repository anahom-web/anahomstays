import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { Home, Wallet, Handshake, HeartHandshake } from "lucide-react";
import { RevealLines, Overline, EASE } from "./Reveal";
import Frame from "./Frame";

/**
 * Scene 5 — The Anahom Way.
 * One dark movement in two parts: the convictions that guide us, then
 * the journey a home takes with us. Faint architecture breathes behind
 * the text, and a single line connects every step, left to right.
 */
const BG_CONVICTIONS_ID = "ChatGPT_Image_Jul_19_2026_at_07_10_16_PM_xqf7ks";
const BG_JOURNEY_ID = "24_taehfm";

const PRINCIPLES = [
  { icon: Home, title: "A few homes, not a portfolio", body: "Chosen with intention — never counted, never collected." },
  { icon: Wallet, title: "We invest, you don't", body: "The renovation, the furnishing, the photography — all carried by us." },
  { icon: Handshake, title: "Clear terms, no fine print", body: "Honest reporting, and an agreement you can read in one sitting." },
  { icon: HeartHandshake, title: "Cared for as our own", body: "Kept beautiful, maintained, and returned better than we found it." },
];

const JOURNEY = [
  { t: "Talk", d: "A conversation about your home, and what it could become." },
  { t: "Transform", d: "We renovate and furnish it completely, at our cost." },
  { t: "Host", d: "We look after the guests, the upkeep, and every detail of the stay." },
  { t: "Grow together", d: "A long partnership, built on openness and shared success." },
];

function Principle({ item, index }) {
  const ref = useRef(null);
  const Icon = item.icon;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.92", "start 0.45"],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [0.16, 1]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity }}
      data-testid={`different-item-${index}`}
      className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-8 items-start border-t border-anahom-white/10 py-9 md:py-11"
    >
      <div className="sm:col-span-2">
        <span className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-anahom-bronze/40">
          <Icon className="w-6 h-6 text-anahom-bronze" strokeWidth={1.1} />
        </span>
      </div>
      <div className="sm:col-span-10">
        <h3 className="font-display text-2xl md:text-4xl leading-[1.12] tracking-tight text-anahom-white">
          {item.title}
        </h3>
        <p className="mt-3 font-sans text-base md:text-lg text-anahom-white/55 leading-relaxed max-w-xl">
          {item.body}
        </p>
      </div>
    </motion.div>
  );
}

function JourneyStep({ item, index }) {
  const fromLeft = index % 2 === 0;
  return (
    <div
      data-testid={`process-step-${String(index + 1).padStart(2, "0")}`}
      className="relative grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-20 items-center py-12 md:py-16 pl-12 md:pl-0"
    >
      {/* node on the line */}
      <motion.span
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.6, ease: EASE }}
        className="absolute left-4 md:left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-anahom-bronze z-10"
      />

      <motion.h4
        initial={{ opacity: 0, x: fromLeft ? -70 : 70 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-12%" }}
        transition={{ duration: 1.1, ease: EASE }}
        className={`font-display font-light text-anahom-white tracking-tight leading-none text-[clamp(2.4rem,5.5vw,4.8rem)] ${
          fromLeft ? "md:order-1 md:text-right md:pr-4" : "md:order-2 md:text-left md:pl-4"
        }`}
      >
        {item.t}
      </motion.h4>

      <motion.p
        initial={{ opacity: 0, x: fromLeft ? 70 : -70 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-12%" }}
        transition={{ duration: 1.1, ease: EASE, delay: 0.08 }}
        className={`font-sans text-base md:text-lg text-anahom-white/55 leading-relaxed max-w-md ${
          fromLeft ? "md:order-2 md:text-left md:pl-4" : "md:order-1 md:text-right md:pr-4 md:justify-self-end"
        }`}
      >
        {item.d}
      </motion.p>
    </div>
  );
}

export default function WhatMakesDifferent() {
  const ref = useRef(null);
  const journeyRef = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const bg1Opacity = useTransform(scrollYProgress, [0, 0.32, 0.46], [0.2, 0.2, 0]);
  const bg2Opacity = useTransform(scrollYProgress, [0.42, 0.55, 1], [0, 0.24, 0.24]);
  const bgY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-5%", "5%"]);

  const { scrollYProgress: journeyProgress } = useScroll({
    target: journeyRef,
    offset: ["start center", "end center"],
  });
  const lineScale = useSpring(journeyProgress, { stiffness: 90, damping: 30, mass: 0.4 });
  // A bead of light travels at the head of the filling line.
  const beadTop = useTransform(lineScale, (v) => `${Math.min(1, Math.max(0, v)) * 100}%`);

  return (
    <section
      id="different"
      ref={ref}
      data-testid="different-section"
      className="relative bg-anahom-charcoal text-anahom-white py-28 md:py-40 lg:py-48 overflow-hidden"
    >
      {/* Faint architecture behind the words */}
      <motion.div style={{ y: bgY }} className="absolute -inset-y-[6%] inset-x-0 pointer-events-none will-change-transform" aria-hidden="true">
        <motion.div style={{ opacity: bg1Opacity }} className="absolute inset-0">
          <Frame id={BG_CONVICTIONS_ID} w={1400} alt="" className="h-full w-full" />
        </motion.div>
        <motion.div style={{ opacity: bg2Opacity }} className="absolute inset-0">
          <Frame id={BG_JOURNEY_ID} pre="e_brightness:35" w={1100} alt="" className="h-full w-full" />
        </motion.div>
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-anahom-charcoal via-transparent to-anahom-charcoal pointer-events-none" />

      <div className="relative z-10 px-6 md:px-12 lg:px-24 mx-auto max-w-screen-2xl">
        {/* Scene header */}
        <div className="max-w-3xl mb-20 md:mb-28">
          <Overline className="text-anahom-sand/70">How We Work</Overline>
          <RevealLines
            as="h2"
            className="mt-6 font-display font-light text-5xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight"
            lines={["The Anahom", "Way."]}
          />
          <p className="mt-8 font-sans text-lg text-anahom-white/60 leading-relaxed max-w-md">
            A few things we believe, and four simple steps.
          </p>
        </div>

        {/* Part one — the convictions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-28 md:mb-40">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <span className="inline-block text-xs font-sans tracking-[0.28em] uppercase text-anahom-sand/70">
                What Guides Us
              </span>
              <p className="mt-6 font-sans text-base text-anahom-white/60 leading-relaxed max-w-xs">
                The things we won&rsquo;t compromise on.
              </p>
            </div>
          </div>
          <div className="lg:col-span-8">
            {PRINCIPLES.map((item, i) => (
              <Principle key={i} item={item} index={i} />
            ))}
          </div>
        </div>

        {/* Part two — the journey */}
        <div id="process" data-testid="process-section">
          <div className="text-center mb-8 md:mb-12">
            <span className="inline-block text-xs font-sans tracking-[0.28em] uppercase text-anahom-sand/70">
              What Partnership Looks Like
            </span>
            <RevealLines
              as="h3"
              className="mt-5 font-display font-light text-4xl md:text-5xl leading-[1.05] tracking-tight"
              lines={["A journey, not a checklist."]}
            />
          </div>

          <div ref={journeyRef} className="relative">
            {/* the connecting line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-anahom-white/10" />
            <motion.div
              style={{ scaleY: lineScale }}
              className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-anahom-bronze origin-top"
            />
            <motion.span
              style={{ top: beadTop }}
              className="absolute left-4 md:left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-anahom-bronze shadow-[0_0_14px_3px_rgba(168,129,47,0.55)] z-10"
            />
            {JOURNEY.map((item, i) => (
              <JourneyStep key={i} item={item} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
