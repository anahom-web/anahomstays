import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { RevealLines, Overline } from "./Reveal";
import Frame from "./Frame";

/**
 * Scene 2 — the philosophy.
 * A single full-bleed image is pinned for the whole scene while the
 * heading and four statements fade through over it. The next scene
 * then slides up over the held frame like a sheet of paper.
 */
const STATEMENTS = [
  "A home is never just walls. It is a mood you step into.",
  "Cared for properly, a house gives something back — light, quiet, and room to breathe.",
  "So a stay feels less like a booking, and more like a return.",
];

// The held frame: a canopy bed at dusk. One unbroken image, held for the
// whole scene while the words move through it — nothing floats over it.
const BG_ID = "16_m4mnqx";

// Moments finish by 78% of the scene; the rest is a held frame that
// the next scene rises over.
const SLOT_START = 0.02;
const SLOT_END = 0.78;

function Moment({ progress, index, total, children, testId, className = "" }) {
  const slot = (SLOT_END - SLOT_START) / total;
  const start = SLOT_START + index * slot;
  const end = start + slot;
  const fade = slot * 0.32;
  const isFirst = index === 0;
  const isLast = index === total - 1;

  const opacity = useTransform(
    progress,
    isFirst
      ? [0, end - fade, end]
      : isLast
        ? [start, start + fade]
        : [start, start + fade, end - fade, end],
    isFirst ? [1, 1, 0] : isLast ? [0, 1] : [0, 1, 1, 0],
  );
  const y = useTransform(progress, [start, end], isFirst ? [0, -40] : [40, isLast ? 0 : -40]);

  return (
    <motion.div
      style={{ opacity, y }}
      data-testid={testId}
      className={`absolute inset-0 flex items-center justify-center px-6 md:px-12 ${className}`}
    >
      {children}
    </motion.div>
  );
}

function StaticPhilosophy() {
  return (
    <section
      id="philosophy"
      data-testid="philosophy-section"
      className="relative bg-anahom-charcoal text-anahom-white py-28 px-6 md:px-12 lg:px-24"
    >
      <div className="mx-auto max-w-screen-2xl">
        <Overline className="text-anahom-sand/70">What Anahom Means</Overline>
        <h2 className="mt-6 font-display font-light text-4xl md:text-6xl leading-[1.05] tracking-tight">
          The name holds our whole belief.
        </h2>
        <Frame
          id={BG_ID}
          w={1400}
          testId="philosophy-image-1"
          alt="A canopy bed at dusk in a lime-washed Anahom bedroom"
          className="my-16 aspect-[16/9]"
        />
        <div className="max-w-3xl space-y-10">
          {STATEMENTS.map((text, i) => (
            <p key={i} data-testid={`philosophy-statement-${i}`} className="font-display font-light text-2xl md:text-3xl leading-[1.4]">
              {text}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Philosophy() {
  const ref = useRef(null);
  const prefersReduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // The camera pushes in for the entire scene.
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.18]);
  const barScaleX = useTransform(scrollYProgress, [SLOT_START, SLOT_END], [0, 1]);

  const total = STATEMENTS.length + 1;
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const slot = (SLOT_END - SLOT_START) / total;
    const i = Math.min(total - 1, Math.max(0, Math.floor((v - SLOT_START) / slot)));
    if (i !== active) setActive(i);
  });

  if (prefersReduced) return <StaticPhilosophy />;

  return (
    <section
      id="philosophy"
      ref={ref}
      data-testid="philosophy-section"
      className="relative z-0 bg-anahom-charcoal"
      style={{ height: "500vh" }}
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* The held frame — one image, held for the whole scene */}
        <motion.div style={{ scale: bgScale }} className="absolute inset-0 will-change-transform">
          <Frame
            id={BG_ID}
            w={1900}
            sizes="100vw"
            testId="philosophy-image-1"
            alt="A canopy bed at dusk in a lime-washed Anahom bedroom"
            className="h-full w-full"
          />
        </motion.div>
        <div className="absolute inset-0 bg-anahom-charcoal/60" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-anahom-charcoal/40 to-transparent" />

        {/* Moment 0 — the scene title */}
        <Moment progress={scrollYProgress} index={0} total={total}>
          <div className="text-center">
            <Overline className="text-anahom-sand/80">What Anahom Means</Overline>
            <RevealLines
              as="h2"
              className="mt-6 font-display font-light text-4xl md:text-6xl lg:text-7xl leading-[1.04] tracking-tight text-anahom-white"
              lines={["The name holds", "our whole belief."]}
            />
          </div>
        </Moment>

        {/* Moments 1–4 — the statements, over the same held image */}
        {STATEMENTS.map((text, i) => (
          <Moment
            key={i}
            progress={scrollYProgress}
            index={i + 1}
            total={total}
            testId={`philosophy-statement-${i}`}
          >
            <p className="font-display font-light text-anahom-white text-[clamp(1.7rem,4vw,2.8rem)] leading-[1.5] tracking-[0.015em] text-center max-w-5xl">
              {text}
            </p>
          </Moment>
        ))}

        {/* Scene progress */}
        <div className="absolute bottom-10 inset-x-6 md:inset-x-12 lg:inset-x-24 z-10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-anahom-white/50">
              The Philosophy
            </span>
            <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-anahom-white/50 tabular-nums">
              {String(Math.max(active, 0) + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </div>
          <div className="h-px bg-anahom-white/15 overflow-hidden">
            <motion.div style={{ scaleX: barScaleX }} className="h-full bg-anahom-bronze origin-left" />
          </div>
        </div>
      </div>
    </section>
  );
}
