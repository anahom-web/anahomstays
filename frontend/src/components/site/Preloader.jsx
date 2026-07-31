import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  animate,
  cubicBezier,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { cld } from "../../lib/cloudinary";

import archSrc from "../../assets/mark/arch.png";
import bar1Src from "../../assets/mark/bar-1.png";
import bar2Src from "../../assets/mark/bar-2.png";
import bar3Src from "../../assets/mark/bar-3.png";
import omSrc from "../../assets/mark/om.png";
import wavesSrc from "../../assets/mark/waves.png";
import arcsSrc from "../../assets/mark/arcs.png";
import spiralSrc from "../../assets/mark/spiral.png";
import wordmarkSrc from "../../assets/mark/wordmark.png";

/**
 * The threshold.
 *
 * The Anahom mark is not a logo so much as a small cosmology: an arch
 * (the doorway you pass through to arrive), and inside it stillness
 * (three horizontal bars), the first sound (ॐ), that sound's resonance
 * (concentric arcs), breath rising (incense lines) and life unfolding
 * (the spiral).
 *
 * So this does not "reveal a logo". It builds that cosmology in the
 * order the symbols themselves imply — threshold, then stillness, then
 * sound, then the sound's echo, then breath, then unfolding — and the
 * percentage is not a counter running alongside it. Both read the same
 * motion value, so they cannot drift apart: 100 arrives at the exact
 * frame the spiral finishes winding.
 *
 * Everything is tunable from the two blocks directly below.
 */

/* ── Timing ─────────────────────────────────────────────────────── */

const DURATION_MS = 5600; // the cinematic runtime
const HOLD_MS = 500; // stillness at 100 before the curtain lifts
const EXIT_MS = 1200; // the dissolve into the homepage
const GATE = 0.99; // progress cannot pass this until the hero has decoded
/** Grace allowed *after* the film ends before we give up waiting on the
 *  network. Relative, not absolute: an absolute ceiling silently cuts
 *  the animation short the moment someone raises DURATION_MS past it. */
const NETWORK_GRACE_MS = 3400;
const MAX_WAIT_MS = DURATION_MS + NETWORK_GRACE_MS;

/**
 * Cues live in normalised progress (0 → 1) rather than seconds, which
 * is what keeps them welded to the percentage. Change DURATION_MS and
 * the whole choreography stretches or compresses in proportion.
 */
const CUE = {
  arch: [0.05, 0.34],
  bars: [0.27, 0.46],
  om: [0.42, 0.60],
  arcs: [0.53, 0.70],
  waves: [0.60, 0.78],
  spiral: [0.7, 0.88],
  wordmark: [0.84, 0.96],
  breath: [0.9, 1.0],
};
const BAR_STAGGER = 0.05; // each bar settles a beat after the one above

/* ── Easing ─────────────────────────────────────────────────────── */

/** Arrives fast and settles slowly — the "expensive" deceleration. */
const OUT = cubicBezier(0.16, 1, 0.3, 1);
/** Gentler, for things that should feel breathed rather than placed. */
const SOFT = cubicBezier(0.32, 0.72, 0, 1);
/** The counter's own curve: unhurried at both ends, never linear. */
const PROGRESS_EASE = [0.45, 0, 0.15, 1];

/* ── Geometry ───────────────────────────────────────────────────── */

const GOLD = "#A8812F";
const CREAM = "#F6F1E9";

/** Measured off the master lockup: the arch IS the mark's bounding box
 *  (793/974 = 79/97), and everything else is placed inside it as a
 *  percentage, so the assembled result is the real mark, not a redraw. */
const MARK_RATIO = 79 / 97;
const P = {
  arch: { left: 0, top: 0, width: 100, ratio: 793 / 974 },
  bars: { left: 21.5, top: 39.2, width: 54.4, ratio: 460 / 125 },
  om: { left: 21.5, top: 55.7, width: 27.9, ratio: 238 / 212 },
  waves: { left: 49.4, top: 55.7, width: 29.1, ratio: 219 / 218 },
  arcs: { left: 21.5, top: 76.3, width: 27.9, ratio: 227 / 222 },
  spiral: { left: 50.6, top: 76.3, width: 27.9, ratio: 218 / 222 },
};
/** The three bars, sliced apart so each can settle on its own beat. */
const BARS = [
  { src: bar1Src, top: 0 },
  { src: bar2Src, top: 36.8 },
  { src: bar3Src, top: 74.4 },
];
const BAR_H = 25.6;

/* ── Helpers ────────────────────────────────────────────────────── */

/** A piece of the mark: the PNG is used as a mask over brand gold, so
 *  the colour is ours to control and never depends on the artwork. */
const ink = (src) => ({
  WebkitMaskImage: `url(${src})`,
  maskImage: `url(${src})`,
  WebkitMaskSize: "100% 100%",
  maskSize: "100% 100%",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  backgroundColor: GOLD,
  willChange: "transform, opacity",
});

const box = (k) => ({
  position: "absolute",
  left: `${P[k].left}%`,
  top: `${P[k].top}%`,
  width: `${P[k].width}%`,
  aspectRatio: String(P[k].ratio),
});

/** Local 0 → 1 for a cue window, eased. */
const useCue = (p, [a, b], ease = OUT) =>
  useTransform(p, [a, b], [0, 1], { ease, clamp: true });

/** Bottom-up reveal, expressed as a clip so the art is uncovered where
 *  it stands rather than sliding into place. */
const useRise = (w) =>
  useTransform(w, (v) => `inset(${(1 - v) * 100}% 0% 0% 0%)`);

/* ── The pieces ─────────────────────────────────────────────────── */

/** The threshold. Rises out of the ground, because you cannot arrive
 *  anywhere until there is a doorway to arrive through. */
function Arch({ p }) {
  const w = useCue(p, CUE.arch, SOFT);
  return (
    <motion.div
      style={{
        ...box("arch"),
        ...ink(archSrc),
        clipPath: useRise(w),
        scale: useTransform(w, [0, 1], [1.03, 1]),
        opacity: useTransform(w, [0, 0.22], [0, 1]),
        transformOrigin: "50% 100%",
      }}
    />
  );
}

/** Stillness. Three horizontal lines — the tripundra, and the horizon:
 *  the horizontal is the axis of rest. They settle downward in turn. */
function Bar({ p, src, top, index }) {
  const w = useCue(p, [
    CUE.bars[0] + index * BAR_STAGGER,
    CUE.bars[1] + index * BAR_STAGGER,
  ]);
  return (
    <motion.div
      style={{
        position: "absolute",
        left: 0,
        top: `${top}%`,
        width: "100%",
        height: `${BAR_H}%`,
        ...ink(src),
        opacity: useTransform(w, [0, 0.5], [0, 1]),
        y: useTransform(w, [0, 1], ["-90%", "0%"]),
        scaleX: useTransform(w, [0, 1], [0.86, 1]),
      }}
    />
  );
}

/** The first sound. It does not appear — it is breathed in: out of
 *  soft focus and up to full size, the way a note finds its pitch. */
function Om({ p }) {
  const w = useCue(p, CUE.om, SOFT);
  return (
    <motion.div
      style={{
        ...box("om"),
        ...ink(omSrc),
        scale: useTransform(w, [0, 1], [0.86, 1]),
        opacity: useTransform(w, [0, 0.55], [0, 1]),
        filter: useTransform(w, (v) => `blur(${(1 - v) * 7}px)`),
      }}
    />
  );
}

/** The sound's resonance, spreading from the point it was struck.
 *  It follows the Om deliberately: this is cause and effect, not two
 *  elements that happen to be next to each other. */
function Arcs({ p }) {
  const w = useCue(p, CUE.arcs);
  return (
    <motion.div
      style={{
        ...box("arcs"),
        ...ink(arcsSrc),
        scale: useTransform(w, [0, 1], [0.4, 1]),
        opacity: useTransform(w, [0, 0.4], [0, 1]),
        transformOrigin: "100% 0%", // the arcs' own centre
      }}
    />
  );
}

/** Breath. Incense in a room with no draught — it can only go up, so
 *  it is uncovered from the floor of its own box upward. */
function Waves({ p }) {
  const w = useCue(p, CUE.waves, SOFT);
  return (
    <motion.div
      style={{
        ...box("waves"),
        ...ink(wavesSrc),
        clipPath: useRise(w),
        opacity: useTransform(w, [0, 0.18], [0, 1]),
      }}
    />
  );
}

/** Life unfolding. The last and longest gesture — it unwinds rather
 *  than fades, so the mark finishes on movement resolving into rest. */
function Spiral({ p }) {
  const w = useCue(p, CUE.spiral, SOFT);
  return (
    <motion.div
      style={{
        ...box("spiral"),
        ...ink(spiralSrc),
        rotate: useTransform(w, [0, 1], [-62, 0]),
        scale: useTransform(w, [0, 1], [0.7, 1]),
        opacity: useTransform(w, [0, 0.35], [0, 1]),
      }}
    />
  );
}

/* ── Counter ────────────────────────────────────────────────────── */

/** Isolated so that ticking the number re-renders three characters
 *  rather than the entire composition. */
function Counter({ p }) {
  const [n, setN] = useState(0);
  useMotionValueEvent(p, "change", (v) => setN(Math.round(v * 100)));
  return (
    <span
      data-testid="preloader-count"
      className="font-sans text-[10px] tracking-[0.42em] text-anahom-charcoal/35 tabular-nums select-none"
    >
      {String(n).padStart(3, "0")}
    </span>
  );
}

/* ── The curtain ────────────────────────────────────────────────── */

/** Matches the <link rel="preload"> in index.html, so this resolves
 *  from cache instead of starting a second download. */
const HERO_SRC = cld("20_oyfxs5", 1600);

export default function Preloader() {
  const prefersReduced = useReducedMotion();
  const [show, setShow] = useState(() => {
    try {
      return !window.sessionStorage.getItem("anahom-intro-seen");
    } catch {
      return false;
    }
  });

  const p = useMotionValue(0);
  const ready = useRef(false);

  useEffect(() => {
    if (!show) return;
    window.__lenis?.stop();

    // Scroll lock WITHOUT touching the document's overflow. Setting
    // overflow:hidden on <html> makes WebKit tear down its
    // position:sticky machinery, and it does not reliably re-attach
    // when the lock is released — the pinned scenes then scroll like
    // static blocks (the Safari "torn scenes on first load" bug).
    // Swallowing the gestures leaves the scroll container untouched.
    const swallow = (e) => e.preventDefault();
    const swallowKeys = (e) => {
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(e.key))
        e.preventDefault();
    };
    window.addEventListener("wheel", swallow, { passive: false });
    window.addEventListener("touchmove", swallow, { passive: false });
    window.addEventListener("keydown", swallowKeys);

    // The curtain is a real gate: it lifts only once the opening shot
    // has actually decoded, so nobody lands on an empty frame.
    const img = new Image();
    img.src = HERO_SRC;
    const markReady = () => {
      ready.current = true;
    };
    if (img.decode) img.decode().then(markReady, markReady);
    else {
      img.onload = markReady;
      img.onerror = markReady;
    }

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      p.set(1);
      setTimeout(() => setShow(false), HOLD_MS);
    };

    let tail;
    const controls = animate(p, 1, {
      // Someone who has asked for less motion still gets a loading gate
      // and a counter — they just get it briefly, and the mark itself
      // never moves (see `pMark` below).
      duration: prefersReduced ? 1.2 : DURATION_MS / 1000,
      ease: PROGRESS_EASE,
      // The value is clamped just short of complete until the site
      // behind is genuinely ready, so 100 always means 100.
      onUpdate: (v) => {
        if (!ready.current && v > GATE) p.set(GATE);
      },
      onComplete: () => {
        if (ready.current) return finish();
        tail = setInterval(() => ready.current && finish(), 80);
      },
    });

    const ceiling = setTimeout(finish, MAX_WAIT_MS);

    return () => {
      controls.stop();
      clearTimeout(ceiling);
      clearInterval(tail);
      window.removeEventListener("wheel", swallow);
      window.removeEventListener("touchmove", swallow);
      window.removeEventListener("keydown", swallowKeys);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, prefersReduced]);

  useEffect(() => {
    if (show) return;
    try {
      window.sessionStorage.setItem("anahom-intro-seen", "1");
    } catch {
      /* private mode — fine */
    }
    window.__lenis?.start();
  }, [show]);

  // The composition reads this, the counter and hairline read `p`. When
  // reduced motion is asked for, the mark is simply pinned to its
  // finished state — fully assembled, perfectly still — while the
  // percentage still does its job. Nothing on screen moves.
  const pMark = useTransform(p, (v) => (prefersReduced ? 1 : v));

  // One slow exhale once everything has arrived, then stillness.
  const breath = useCue(pMark, CUE.breath, SOFT);
  const breathScale = useTransform(breath, (v) =>
    prefersReduced ? 1 : 1 + Math.sin(v * Math.PI) * 0.012,
  );
  const wordCue = useCue(pMark, CUE.wordmark);
  // Hoisted out of the JSX: everything below renders inside `{show && …}`,
  // so a hook called down there would run conditionally.
  const wordY = useTransform(wordCue, [0, 1], [10, 0]);
  const wordScale = useTransform(wordCue, [0, 1], [0.985, 1]);
  const glow = useTransform(p, [0, 1], [0.15, 0.5]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          data-testid="preloader"
          role="status"
          aria-live="polite"
          aria-label="Entering Anahom Stays"
          className="fixed inset-0 z-[80] flex flex-col items-center justify-center"
          style={{ backgroundColor: CREAM }}
          exit={{ opacity: 0 }}
          transition={{ duration: EXIT_MS / 1000, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Volumetric warmth — a single soft bloom, no particles. */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[130vmin] w-[130vmin] -translate-x-1/2 -translate-y-1/2"
            style={{
              opacity: glow,
              background:
                "radial-gradient(circle, rgba(168,129,47,0.10) 0%, rgba(168,129,47,0.04) 38%, rgba(168,129,47,0) 68%)",
            }}
          />

          {/* Depth lives on this wrapper, which never animates, so the
              shadow is rasterised once instead of every frame. */}
          <div
            className="relative"
            style={{ filter: "drop-shadow(0 22px 45px rgba(120, 92, 30, 0.13))" }}
          >
            <motion.div
              style={{ scale: breathScale, willChange: "transform" }}
              exit={prefersReduced ? { opacity: 0 } : { scale: 1.06, opacity: 0 }}
              transition={{ duration: EXIT_MS / 1000, ease: [0.4, 0, 0.2, 1] }}
              className="flex flex-col items-center"
            >
              {/* The mark, assembled from its own parts */}
              <div
                data-testid="preloader-mark"
                className="relative"
                style={{
                  height: "clamp(122px, 21vh, 194px)",
                  aspectRatio: String(MARK_RATIO),
                }}
              >
                <Arch p={pMark} />
                <div style={box("bars")}>
                  {BARS.map((b, i) => (
                    <Bar key={i} p={pMark} src={b.src} top={b.top} index={i} />
                  ))}
                </div>
                <Om p={pMark} />
                <Arcs p={pMark} />
                <Waves p={pMark} />
                <Spiral p={pMark} />
              </div>

              {/* The name, last — once there is something to name */}
              <motion.div
                aria-hidden="true"
                style={{
                  ...ink(wordmarkSrc),
                  width: "clamp(148px, 26vw, 224px)",
                  aspectRatio: String(437 / 162),
                  marginTop: "clamp(18px, 3vh, 30px)",
                  opacity: wordCue,
                  y: wordY,
                  scale: wordScale,
                }}
              />
            </motion.div>
          </div>

          {/* The hairline and the count. The rule echoes the three bars
              inside the mark, so the progress readout belongs to the
              composition rather than sitting on top of it. */}
          <div className="absolute inset-x-0 bottom-[clamp(38px,7vh,74px)] flex flex-col items-center gap-4">
            <div className="h-px w-[min(190px,44vw)] overflow-hidden bg-anahom-charcoal/10">
              <motion.div
                className="h-full origin-left"
                style={{ scaleX: p, backgroundColor: GOLD, willChange: "transform" }}
              />
            </div>
            <Counter p={p} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
