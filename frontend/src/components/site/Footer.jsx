import Logo from "./Logo";

/**
 * The footer lives inside the final dark scene — a quiet last line
 * rather than a separate section.
 */
export default function Footer() {
  return (
    <footer
      data-testid="site-footer"
      className="bg-anahom-charcoal text-anahom-white border-t border-anahom-white/10 px-6 md:px-12 lg:px-24 py-14"
    >
      <div className="mx-auto max-w-screen-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <a href="#top" aria-label="Anahom Stays — back to top" className="inline-block">
            <Logo height={32} />
          </a>
          <p className="mt-2 font-sans text-sm text-anahom-white/40 max-w-xs">
            A conscious living brand. Goa.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-8 gap-y-3 font-sans text-sm text-anahom-white/55">
          <a href="#philosophy" className="link-underline">Philosophy</a>
          <a href="#homes" className="link-underline">Homes</a>
          <a href="#different" className="link-underline">Our Way</a>
          <a href="#founders" className="link-underline">Founders</a>
          <a href="#contact" className="link-underline">Contact</a>
        </nav>
        <p className="font-sans text-xs text-anahom-white/30">
          © {new Date().getFullYear()} Anahom Stays
        </p>
      </div>
    </footer>
  );
}
