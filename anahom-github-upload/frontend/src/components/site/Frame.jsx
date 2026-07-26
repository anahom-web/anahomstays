import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cld, lqip } from "../../lib/cloudinary";

/**
 * Blur-up media frame — the reason there are no grey boxes.
 *
 * The wrapper paints a ~1KB, heavily-blurred 32px copy of the SAME crop
 * as its own background the instant layout happens, so the frame is
 * never empty and never shifts (CLS = 0). The full asset is decoded
 * off the main thread, then cross-fades in over its own blur — the
 * image feels present before it is sharp.
 *
 * Sizing comes from `className` (an aspect ratio or a full-bleed height
 * on the parent). Pass `motionProps` to make the <img> a motion element
 * (used for the hero's settling zoom). Empty `alt` = decorative.
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
  sizes,
  motionProps,
  style,
  testId,
}) {
  const ref = useRef(null);
  const [loaded, setLoaded] = useState(false);

  // Images already complete in cache never fire onLoad after mount.
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth > 0) setLoaded(true);
  }, []);

  const Img = motionProps ? motion.img : "img";

  return (
    <div
      className={`media-frame relative overflow-hidden ${className}`}
      style={{ backgroundImage: `url("${lqip(id, pre)}")`, ...style }}
    >
      <Img
        ref={ref}
        src={cld(id, w, pre)}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : undefined}
        sizes={sizes}
        onLoad={() => setLoaded(true)}
        draggable={false}
        data-testid={testId}
        className={`media-img absolute inset-0 h-full w-full object-cover ${loaded ? "is-loaded" : ""} ${imgClassName}`}
        {...motionProps}
      />
    </div>
  );
}
