import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// The site's own tokens (src/index.css), so tailwind-merge knows `text-display` is a size, not a colour, and
// `tracking-wide-md` a letter-spacing: otherwise a later colour class would silently drop them.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["display", "footer-mail"],
      tracking: ["wide-sm", "wide-md", "wide-lg", "wide-xl", "super-wide", "ultra-wide", "heading", "display", "sublead"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
