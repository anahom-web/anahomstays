import { motion } from "framer-motion";
import { RevealLines, Rise, Overline } from "./Reveal";

/**
 * The founders' letter — not a company profile, an opened notebook.
 * Rises over the journey scene as a warm sheet of paper: no card,
 * no shadow, just serif type, generous margins and a hand signature.
 */
export default function FoundersLetter() {
  return (
    <section
      id="founders"
      data-testid="founders-section"
      className="relative z-10 -mt-10 md:-mt-14 rounded-t-[2.5rem] md:rounded-t-[3.5rem] bg-anahom-white pt-28 pb-28 md:pt-40 md:pb-40 px-6 md:px-12"
    >
      <div className="mx-auto max-w-2xl">
        <div className="text-center mb-16">
          <Overline>A Letter From The Founders</Overline>
        </div>

        {/* A heading, not a paragraph: every other scene contributes an
            h2 to the outline and this one was silently missing from it. */}
        <RevealLines
          as="h2"
          className="font-display font-light text-3xl md:text-4xl leading-[1.3] text-anahom-charcoal"
          lines={["Dear friend,", "why we began —"]}
        />

        <div className="mt-12 space-y-8 font-sans text-lg md:text-xl text-anahom-charcoal/80 leading-[1.6]">
          <Rise delay={0.05}>
            <p>We came to Goa for a few weeks. We stayed.</p>
          </Rise>
          <Rise delay={0.12}>
            <p>
              It was not the beaches. It was the pace — mornings that begin slowly,
              evenings that arrive without a schedule. Living here teaches you a calm
              that a city never will, and that is the thing worth passing on.
            </p>
          </Rise>
          <Rise delay={0.19}>
            <p>
              So we set out to make spaces you feel before anyone explains them — where
              the light, the linen and the quiet all say the same thing. Where every
              detail speaks.
            </p>
          </Rise>
          <Rise delay={0.26}>
            <p>
              That is the whole of it. If your home could hold that, we would love to
              hear from you.
            </p>
          </Rise>
        </div>

        {/* Signature */}
        <div className="mt-16">
          <motion.p
            initial={{ opacity: 0, rotate: 0 }}
            whileInView={{ opacity: 1, rotate: -1.5 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, delay: 0.3 }}
            style={{ fontFamily: '"Dancing Script", cursive' }}
            className="text-4xl md:text-5xl text-anahom-charcoal leading-tight origin-left"
          >
            Arun &amp; Tanishka
          </motion.p>
          <div className="mt-7 flex flex-col sm:flex-row sm:gap-10 gap-1 font-sans text-sm text-anahom-charcoal/70">
            <span data-testid="founder-arun">
              <span className="text-anahom-charcoal">Arun Singh</span>, Co-Founder
            </span>
            <span data-testid="founder-tanishka">
              <span className="text-anahom-charcoal">Tanishka Verma</span>, Co-Founder
            </span>
          </div>
          <p className="mt-5 font-sans text-xs tracking-[0.2em] uppercase text-anahom-stone">
            Anahom · Goa
          </p>
        </div>
      </div>
    </section>
  );
}
