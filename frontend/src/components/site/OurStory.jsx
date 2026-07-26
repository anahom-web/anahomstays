import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { RevealLines, Rise, Overline, Unveil } from "./Reveal";
import Frame from "./Frame";

/**
 * Scene 3 — where we are now.
 * Rises over the held philosophy frame like a sheet of paper.
 * The collage reads as moments — morning, art, light, calm —
 * drifting at two different depths, each settling quietly into view.
 */
const MOOD = [
  {
    id: "ChatGPT_Image_Jul_19_2026_at_07_03_45_PM_ixaczb",
    alt: "Morning sun through linen curtains, coffee waiting by the bed",
  },
  {
    // Real wall art from the homes — a hand-textured plaster relief.
    id: "22_v9i6et",
    pre: "c_fill,ar_3:4,g_auto,w_1200/e_brightness:12",
    alt: "A hand-textured plaster relief hung on a quiet wall",
  },
  {
    id: "19_fk1s2i",
    alt: "A rattan pendant glowing against a lime-washed arch",
  },
  {
    // The source carries dark door edges on both sides — keep the
    // centre of the balcony so the frame reads clean.
    id: "ChatGPT_Image_Jul_19_2026_at_07_21_43_PM_qqr8r1",
    pre: "c_crop,w_0.78,h_1.0,x_0.11/c_fill,ar_3:4,g_auto,w_1200",
    alt: "A cane lounge chair on a Goan balcony among the palms",
  },
];

function MoodFrame({ mood, index }) {
  return (
    <Unveil testId={`mood-image-${index}`} delay={index * 0.09} className="aspect-[3/4]">
      <Frame id={mood.id} pre={mood.pre} w={800} alt={mood.alt} className="h-full w-full" sizes="(min-width: 1024px) 25vw, 45vw" />
    </Unveil>
  );
}

export default function OurStory() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yA = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["6%", "-6%"]);
  const yB = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-6%", "8%"]);

  return (
    <section
      id="story"
      ref={ref}
      data-testid="story-section"
      className="relative z-10 -mt-[80svh] rounded-t-[2.5rem] md:rounded-t-[3.5rem] bg-anahom-white pt-28 pb-28 md:pt-36 md:pb-40 lg:pt-44 lg:pb-48 px-6 md:px-12 lg:px-24 overflow-hidden"
    >
      <div className="mx-auto max-w-screen-2xl grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Moments — a quiet collage at two depths */}
        <div className="lg:col-span-6 grid grid-cols-2 gap-4 md:gap-6">
          <motion.div style={{ y: yA }} className="grid gap-4 md:gap-6 will-change-transform">
            {[MOOD[0], MOOD[1]].map((m, i) => (
              <MoodFrame key={i} mood={m} index={i} />
            ))}
          </motion.div>
          <motion.div style={{ y: yB }} className="grid gap-4 md:gap-6 mt-8 md:mt-12 will-change-transform">
            {[MOOD[2], MOOD[3]].map((m, i) => (
              <MoodFrame key={i} mood={m} index={i + 2} />
            ))}
          </motion.div>
        </div>

        {/* Narrative */}
        <div className="lg:col-span-6 lg:pl-8">
          <Overline>Where We Are Now</Overline>
          <RevealLines
            as="h2"
            className="mt-6 font-display font-light text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-anahom-charcoal"
            lines={["The first", "chapter."]}
          />
          <div className="mt-10 space-y-6 max-w-xl">
            <Rise delay={0.05}>
              <p className="font-sans text-lg text-anahom-charcoal/75 leading-relaxed">
                Anahom is starting with a handful of homes in Goa —
                chosen carefully, and looked after properly.
              </p>
            </Rise>
            <Rise delay={0.14}>
              <p className="font-sans font-light text-2xl md:text-3xl text-anahom-charcoal leading-snug pt-2">
                If you own a home that sits empty — or know someone who does —
                we would like to meet it.
              </p>
            </Rise>
          </div>
        </div>
      </div>
    </section>
  );
}
