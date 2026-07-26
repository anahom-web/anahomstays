import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cld, lqip } from "../../lib/cloudinary";

/** Widths we let Cloudinary generate. The browser picks one from `sizes`,
 *  so a phone never downloads a 2000px file meant for a desktop. */
const LADDER = [640, 960, 1280, 1600, 2000];

/**
 * Blur-up media frame — the reason there are no grey boxes, and no
 * empty stretches while scrolling.
 *
 * Three things happen here:
 *  1. The wrapper paints a ~1KB blurred copy of the SAME crop as its own
 *     background the instant layout happens, so a frame is never empty
 *     and never shifts (CLS = 0).
 *  2. The real file is requested through a srcSet ladder, so each device
 *     downloads only what its screen can actually show.
 *  3. Loading starts a full viewport and a half BEFORE the frame scrolls
 *     into view. Safari's native lazy threshold is tight enough that a
 *     fast scroll can outrun it and land on an unpainted frame; this
 *     observer means the picture is already there when you arrive.
 */
export default function Frame({
  id,
  pre = "",
  w = 1200,
  alt = "",
  className = "",
  imgClassName = "",
  eager = false,
  priority = false,
  sizes = "100vw",
  motionProps,
  style,
  testId,
}) {
  const holderRef = useRef(null);
  const imgRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  // Eager images fetch immediately; the rest wait until they're near.
  const [near, setNear] = useState(eager);

  useEffect(() => {
    if (near) return;
    const el = holderRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "150% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [near]);

  // Images already complete in cache never fire onLoad after mount.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) setLoaded(true);
  }, [near]);

  const widths = LADDER.filter((x) => x <= w);
  if (!widths.includes(w)) widths.push(w);
  const srcSet = widths.map((x) => `${cld(id, x, pre)} ${x}w`).join(", ");

  const Img = motionProps ? motion.img : "img";

  return (
    <div
      ref={holderRef}
      className={`media-frame relative overflow-hidden ${className}`}
      style={{ backgroundImage: `url("${lqip(id, pre)}")`, ...style }}
    >
      {near && (
        <Img
          ref={imgRef}
          src={cld(id, w, pre)}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          decoding="async"
          fetchPriority={priority ? "high" : undefined}
          onLoad={() => setLoaded(true)}
          draggable={false}
          data-testid={testId}
          className={`media-img absolute inset-0 h-full w-full object-cover ${loaded ? "is-loaded" : ""} ${imgClassName}`}
          {...motionProps}
        />
      )}
    </div>
  );
}
