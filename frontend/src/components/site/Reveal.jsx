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
 * Unveil — the image treatment.
 *
 * Deliberately has no moving edge and no direction. A sweeping clip-path
 * or a slide reads as an effect being performed on the photograph: the
 * eye follows the edge instead of the picture. Here the frame simply
 * settles into presence — a long, purely decelerating fade out of a
 * barely-perceptible over-scale. Nothing arrives, nothing travels; the
 * image is just *there*, a moment after you look at it.
 */
export const Unveil = ({ children, className = "", delay = 0, testId }) => (
  <motion.div
    className={`relative overflow-hidden ${className}`}
    data-testid={testId}
    initial={{ opacity: 0, scale: 1.045 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, margin: "-8%" }}
    transition={{
      opacity: { duration: 1.5, ease: EASE, delay },
      scale: { duration: 2.2, ease: EASE, delay },
    }}
    style={{ willChange: "transform, opacity" }}
  >
    {children}
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
