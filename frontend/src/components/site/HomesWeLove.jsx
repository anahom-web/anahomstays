import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Overline, RevealChars, PanelReveal, Rise } from "./Reveal";
import Frame from "./Frame";

/**
 * Scene 4 — the homes.
 * Opens on a full-bleed statement, then three unhurried frames.
 * No captions, no material specifications: the photographs carry it,
 * and a single line says what they have in common.
 */
const OPENER_ID = "ChatGPT_Image_Jul_19_2026_at_07_25_57_PM_l6ex0n";

const STUDIES = [
  {
    id: "ChatGPT_Image_Jul_19_2026_at_07_14_34_PM_zfshle",
    alt: "A lime-washed living room opening onto old trees",
    ratio: "aspect-[4/3]",
    layout: "md:w-[58%] self-start",
  },
  {
    id: "18_pfj5ad",
    alt: "A carved niche holding an earthen vase",
    ratio: "aspect-[3/4]",
    layout: "md:w-[36%] self-end md:-mt-40 lg:-mt-56",
  },
  {
    id: "ChatGPT_Image_Jul_19_2026_at_07_19_24_PM_h1zqll",
    alt: "A living room settling into lamplight at dusk",
    ratio: "aspect-[16/10]",
    layout: "md:w-[68%] self-center md:mt-16",
  },
];

function Study({ study, index }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["5%", "-5%"]);

  return (
    <div ref={ref} data-testid={`home-card-${index}`} className={`relative w-full ${study.layout}`}>
      <PanelReveal className={study.ratio}>
        <motion.div style={{ y }} className="absolute -inset-y-[6%] inset-x-0 will-change-transform">
          <Frame id={study.id} w={1300} alt={study.alt} className="h-full w-full" sizes="(min-width: 768px) 60vw, 100vw" />
        </motion.div>
      </PanelReveal>
    </div>
  );
}

export default function HomesWeLove() {
  const openerRef = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: openerRef,
    offset: ["start end", "end start"],
  });
  const openerY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-8%", "8%"]);

  return (
    <section
      id="homes"
      data-testid="homes-section"
      className="relative z-10 bg-anahom-white pb-28 md:pb-40 lg:pb-48"
    >
      {/* Full-bleed statement */}
      <div ref={openerRef} className="relative h-[92svh] overflow-hidden">
        <motion.div style={{ y: openerY }} className="absolute -inset-y-[10%] inset-x-0 will-change-transform">
          <Frame
            id={OPENER_ID}
            w={2000}
            sizes="100vw"
            alt="An open living space at golden hour, palms beyond the glass"
            className="h-full w-full"
          />
        </motion.div>
        <div className="absolute inset-0 bg-anahom-charcoal/25" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-anahom-charcoal/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-6 md:px-12 lg:px-24 pb-16 md:pb-20 max-w-screen-2xl mx-auto">
          <Overline className="text-anahom-sand/90">The Homes</Overline>
          <RevealChars
            as="h2"
            lines={["Warm, tactile,", "considered."]}
            className="mt-5 font-display font-light text-anahom-white text-[clamp(2.6rem,7.5vw,7rem)] leading-[0.98] tracking-tight"
          />
        </div>
      </div>

      {/* Three frames, unhurried */}
      <div className="px-6 md:px-12 lg:px-24 mx-auto max-w-screen-2xl">
        <Rise className="max-w-xl mt-16 md:mt-24 mb-20 md:mb-28">
          <p className="font-sans text-lg text-anahom-charcoal/70 leading-relaxed">
            Every home is different. What they share is the feeling of having
            been looked after.
          </p>
        </Rise>

        <div className="flex flex-col gap-24 md:gap-8">
          <Study study={STUDIES[0]} index={0} />
          <Study study={STUDIES[1]} index={1} />

          {/* The exhale — a breath between the frames */}
          <Rise className="py-10 md:py-24 text-center">
            <p className="font-display font-light text-anahom-charcoal text-3xl md:text-5xl lg:text-6xl leading-[1.12] tracking-tight">
              spaces that feel
              <span className="text-outline"> like an exhale.</span>
            </p>
          </Rise>

          <Study study={STUDIES[2]} index={2} />
        </div>
      </div>
    </section>
  );
}
