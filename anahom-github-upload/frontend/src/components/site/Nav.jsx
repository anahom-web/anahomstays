import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Magnetic } from "./Reveal";
import Logo from "./Logo";

/**
 * Liquid-glass chrome.
 *
 * Over the opening shot the bar is pure air — only the gold mark and
 * white type. Once the film is running it frosts: a warm, saturated
 * blur that lifts the page beneath it rather than covering it, so the
 * mark always sits on its own light and never collides with content.
 * Hides on the way down, returns the moment the visitor looks up.
 */
export default function Nav() {
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      setScrolled(y > 80);
      if (y < 80) setVisible(true);
      else if (y < lastY - 4) setVisible(true);
      else if (y > lastY + 4) setVisible(false);
      lastY = y;
      ticking = false;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#philosophy", label: "Philosophy" },
    { href: "#homes", label: "Homes" },
    { href: "#different", label: "Our Way" },
  ];

  return (
    <>
      <motion.header
        data-testid="site-nav"
        initial={{ y: 0 }}
        animate={{ y: visible ? 0 : -110 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 inset-x-0 z-50"
      >
        {/* Over the opening shot: an invisible scrim. Never reads as a bar,
            but guarantees the gold mark and white type stay legible over
            whatever the photograph happens to be doing underneath. */}
        <div
          aria-hidden="true"
          className={`absolute inset-x-0 -top-2 h-[150%] pointer-events-none transition-opacity duration-700 ${
            scrolled ? "opacity-0" : "opacity-100"
          }`}
          style={{
            background:
              "linear-gradient(to bottom, rgba(28,25,22,0.55) 0%, rgba(28,25,22,0.28) 45%, transparent 100%)",
          }}
        />

        {/* the glass itself — grows in as the film starts */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 transition-opacity duration-700 ease-editorial ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            background:
              "linear-gradient(to bottom, rgba(246,241,233,0.72), rgba(246,241,233,0.55))",
            borderBottom: "1px solid rgba(168,129,47,0.18)",
            boxShadow: "0 1px 30px rgba(40,37,33,0.06)",
          }}
        />

        <div className="relative mx-auto max-w-screen-2xl px-6 md:px-12 lg:px-24 h-20 md:h-24 flex items-center justify-between">
          <a href="#top" data-testid="nav-logo" aria-label="Anahom Stays — home" className="-m-2 p-2 shrink-0">
            <Logo height={32} className={`md:h-10 ${scrolled ? "logo-foil--deep" : ""}`} />
          </a>

          <nav
            className={`hidden md:flex items-center gap-10 text-[11px] font-sans tracking-[0.25em] uppercase transition-colors duration-700 ${
              scrolled ? "text-anahom-charcoal/60" : "text-anahom-white/75"
            }`}
          >
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`nav-link transition-colors duration-500 ${
                  scrolled ? "hover:text-anahom-bronze" : "hover:text-anahom-white"
                }`}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <Magnetic strength={0.35}>
            <a
              href="#contact"
              data-testid="nav-contact-btn"
              className={`group inline-flex items-center gap-2 text-[11px] font-sans tracking-[0.25em] uppercase transition-colors duration-700 ${
                scrolled ? "text-anahom-charcoal" : "text-anahom-white"
              }`}
            >
              Let&rsquo;s talk
              <span
                className={`inline-block h-px w-8 transition-all duration-500 group-hover:w-12 ${
                  scrolled ? "bg-anahom-bronze" : "bg-anahom-white/60 group-hover:bg-anahom-white"
                }`}
              />
            </a>
          </Magnetic>
        </div>
      </motion.header>

      <motion.div
        style={{ scaleX: progress }}
        className="fixed top-0 left-0 right-0 h-[2px] bg-anahom-bronze origin-left z-[55]"
        data-testid="scroll-progress"
      />
    </>
  );
}
