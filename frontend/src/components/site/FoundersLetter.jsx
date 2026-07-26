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

        <RevealLines
          as="p"
          className="font-display font-light text-3xl md:text-4xl leading-[1.3] text-anahom-charcoal"
          lines={["Dear friend,", "a note on why Anahom exists —"]}
        />

        <div className="mt-12 space-y-8 font-sans text-lg md:text-xl text-anahom-charcoal/80 leading-[1.6]">
          <Rise delay={0.05}>
            <p>
              Anahom grew from a simple conviction: that hospitality, at its best, is the
              quiet art of looking after homes — and the people in them.
            </p>
          </Rise>
          <Rise delay={0.14}>
            <p>
              We are at the very beginning. If you have a home you love, and would rather
              it were cared for than simply let, it would be a privilege to start with you.
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
