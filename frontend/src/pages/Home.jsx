import { MotionConfig } from "framer-motion";
import Nav from "../components/site/Nav";
import Preloader from "../components/site/Preloader";
import Cursor from "../components/site/Cursor";
import Hero from "../components/site/Hero";
import Philosophy from "../components/site/Philosophy";
import OurStory from "../components/site/OurStory";
import HomesWeLove from "../components/site/HomesWeLove";
import WhatMakesDifferent from "../components/site/WhatMakesDifferent";
import FoundersLetter from "../components/site/FoundersLetter";
import Contact from "../components/site/Contact";
import Footer from "../components/site/Footer";

/**
 * One continuous experience in scenes, not sections:
 * pinned shots the next scene slides over, colours flowing
 * ivory → limestone → charcoal without seams, corner chrome and a
 * trailing cursor holding it together, ending on one dark closing scene.
 */
export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="grain" data-testid="home-page">
        <a
          href="#philosophy"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[90] focus:bg-anahom-charcoal focus:text-anahom-white focus:px-5 focus:py-3 focus:rounded-full focus:text-sm focus:font-sans"
        >
          Skip to content
        </a>
        <Preloader />
        <Cursor />
        <Nav />
        <main id="main">
          <Hero />
          <Philosophy />
          <OurStory />
          <HomesWeLove />
          <WhatMakesDifferent />
          <FoundersLetter />
          <Contact />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
