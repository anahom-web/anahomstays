/**
 * Anahom brand asset delivery via Cloudinary.
 * `f_auto,q_auto` serves AVIF/WebP to browsers that support them;
 * width is capped per placement so we never ship oversized files.
 * `pre` accepts chained transformation segments (crops, gravity,
 * brightness) applied before the delivery resize — used to art-direct
 * a source image for a specific frame.
 */
import LQIP from "./lqipData";

const BASE = "https://res.cloudinary.com/dlcijbrpw/image/upload";

export const cld = (id, w = 1200, pre = "") =>
  `${BASE}/${pre ? `${pre}/` : ""}f_auto,q_auto,w_${w}/${id}`;

/**
 * Blur-up placeholder.
 *
 * Returns an inlined data URI wherever one has been generated (see
 * lqipData.js), so the frame paints in the photograph's own colours with
 * zero network requests — instantly, even on a cold cache over mobile
 * data. Falls back to a Cloudinary-generated blur for any crop that has
 * not been baked in yet, so nothing can ever render empty.
 */
export const lqip = (id, pre = "") =>
  LQIP[pre ? `${id}|${pre}` : id] ||
  `${BASE}/${pre ? `${pre}/` : ""}e_blur:1000/f_auto,q_auto:low,w_32/${id}`;
