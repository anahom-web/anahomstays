import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/** The house easing — every deliberate movement on the site shares it. */
export const EASE = [0.22, 1, 0.36, 1];

/**
 * Magnetic hover — the element leans gently toward the cursor and
 * settles back on a spring when it leaves. Wrap a button or link.
 */
export const Magnetic = ({ children, strength = 0.3, className = "" }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 180, damping: 16, mass: 0.4 });

  const onMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };
  const onMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ x: sx, y: sy }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
};

/**
 * Masked line-by-line slide-up reveal.
 * Pass an array of lines. Each line is clipped and slides up on view.
 *
 * The viewport trigger lives on an unclipped wrapper and propagates to
 * the masked lines via variants — a fully-clipped span can never be
 * "in view" for the IntersectionObserver, so it must not observe itself.
 */
export const RevealLines = ({
  lines = [],
  className = "",
  lineClassName = "",
  delay = 0,
  stagger = 0.12,
  as: Tag = "h2",
  testId,
}) => {
  return (
    <Tag className={className} data-testid={testId}>
      <motion.span
        className="block"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
      >
        {lines.map((line, i) => (
          <span key={i} className="reveal-mask">
            <motion.span
              className={`block ${lineClassName}`}
              variants={{
                hidden: { y: "110%" },
                visible: {
                  y: "0%",
                  transition: {
                    duration: 1.2,
                    ease: EASE,
                    delay: delay + i * stagger,
                  },
                },
              }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
};

/**
 * Character-level staggered rise — the signature title treatment.
 * Accepts `lines` (array); characters cascade continuously across lines.
 * Words never break: each word is its own inline-block.
 */
export const RevealChars = ({
  lines = [],
  className = "",
  delay = 0,
  stagger = 0.028,
  as: Tag = "h2",
  testId,
}) => {
  let charIndex = 0;
  return (
    <Tag className={className} data-testid={testId}>
      <motion.span
        className="block"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
      >
        {lines.map((line, li) => (
          <span key={li} className="block">
            {line.split(" ").map((word, wi) => (
              <span key={wi} className="inline-block whitespace-nowrap">
                {word.split("").map((ch, ci) => {
                  const d = delay + charIndex * stagger;
                  charIndex += 1;
                  return (
                    <span key={ci} className="inline-block overflow-hidden align-bottom">
                      <motion.span
                        className="inline-block"
                        variants={{
                          hidden: { y: "115%" },
                          visible: {
                            y: "0%",
                            transition: { duration: 1, ease: EASE, delay: d },
                          },
                        }}
                      >
                        {ch}
                      </motion.span>
                    </span>
                  );
                })}
                {wi < line.split(" ").length - 1 && <span>&nbsp;</span>}
              </span>
            ))}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
};

/**
 * Curtain reveal — the signature image treatment.
 *
 * Rather than covering the frame and sliding a panel away, the frame is
 * *uncovered*: a clip-path edge sweeps down while the photograph inside
 * counter-moves upward and settles out of a slight over-scale. Because
 * the two layers travel in opposition, the image reads as something
 * that was always there, behind the surface, now being shown — not an
 * asset arriving. The observer sits on the outer, unclipped wrapper;
 * a clipped element has no area and could never trigger it itself.
 */
export const PanelReveal = ({ children, className = "", delay = 0, testId }) => (
  <motion.div
    className={`relative overflow-hidden ${className}`}
    data-testid={testId}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-12%" }}
  >
    <motion.div
      className="h-full w-full will-change-[clip-path]"
      variants={{
        hidden: { clipPath: "inset(0% 0% 100% 0%)" },
        visible: {
          clipPath: "inset(0% 0% 0% 0%)",
          transition: { duration: 1.35, ease: [0.65, 0, 0.35, 1], delay },
        },
      }}
    >
      <motion.div
        className="h-full w-full will-change-transform"
        variants={{
          hidden: { y: "-10%", scale: 1.14 },
          visible: {
            y: "0%",
            scale: 1,
            transition: { duration: 1.9, ease: EASE, delay: delay + 0.06 },
          },
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  </motion.div>
);

/** Soft fade + rise for blocks of content */
export const Rise = ({ children, className = "", delay = 0, y = 28, testId }) => (
  <motion.div
    className={className}
    data-testid={testId}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-8%" }}
    transition={{ duration: 1.1, ease: EASE, delay }}
  >
    {children}
  </motion.div>
);

/** Overline eyebrow label */
export const Overline = ({ children, className = "" }) => (
  <span
    className={`inline-block text-xs md:text-sm font-sans tracking-[0.28em] uppercase text-anahom-stone ${className}`}
  >
    {children}
  </span>
);
