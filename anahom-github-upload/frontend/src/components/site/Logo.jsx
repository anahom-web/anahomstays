import logoSrc from "../../assets/anahom-logo.png";

/**
 * The Anahom mark — arch-and-spiral emblem with the wordmark.
 *
 * Rather than painting the flat PNG, the artwork is used as a mask over
 * a gold-foil gradient: the fill runs from deep bronze through the
 * brand gold to a pale highlight band, and a paired highlight/shadow
 * emboss lifts it off the surface. The result reads as struck metal
 * that catches the light, not a coloured image — and it stays crisp at
 * any size because the mask scales with the element.
 *
 * `height` drives the size; the aspect ratio is locked to the artwork
 * (529 × 162), so a responsive height class can never distort it or
 * shift layout.
 */
export default function Logo({ className = "", height = 34 }) {
  return (
    <span
      role="img"
      aria-label="Anahom Stays"
      className={`logo-foil inline-block w-auto shrink-0 align-middle ${className}`}
      style={{
        height,
        aspectRatio: "529 / 162",
        WebkitMaskImage: `url(${logoSrc})`,
        maskImage: `url(${logoSrc})`,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}
