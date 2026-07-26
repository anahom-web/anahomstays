/**
 * Anahom brand asset delivery via Cloudinary.
 * `f_auto,q_auto` serves AVIF/WebP to browsers that support them;
 * width is capped per placement so we never ship oversized files.
 * `pre` accepts chained transformation segments (crops, gravity,
 * brightness) applied before the delivery resize — used to art-direct
 * a source image for a specific frame.
 */
const BASE = "https://res.cloudinary.com/dlcijbrpw/image/upload";

export const cld = (id, w = 1200, pre = "") =>
  `${BASE}/${pre ? `${pre}/` : ""}f_auto,q_auto,w_${w}/${id}`;

/**
 * Blur-up placeholder: a ~1KB, heavily blurred 32px copy of the same
 * crop. Painted as the image element's own CSS background, it occupies
 * the frame in the brand's true colours the instant layout happens —
 * the full asset then resolves over it. No grey boxes, no flashes.
 */
export const lqip = (id, pre = "") =>
  `${BASE}/${pre ? `${pre}/` : ""}e_blur:1000/f_auto,q_auto:low,w_32/${id}`;

export const lqipStyle = (id, pre = "") => ({
  backgroundImage: `url(${lqip(id, pre)})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
});
