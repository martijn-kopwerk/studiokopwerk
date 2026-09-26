# Studio Kopwerk - AI System Instructions & Brand Guidelines

These instructions define the design system, copywriting voice, and UX philosophy for Studio Kopwerk. You MUST adhere to these rules when generating or modifying code for this project.

## 1. Brand Identity & UX Philosophy
- **Identity:** Studio Kopwerk helpt iedereen om mooiere en fijnere ervaringen te maken, op welk vlak dan ook. Toegankelijk, bescheiden, doordacht en zonder poeha.
- **Vibe:** Rustig, minimalistisch, verfijnd en doordacht.
- **Anti-Slop Design:** No generic SaaS templates. No standard 3-column grids with boring icons. Use extreme white space, high-contrast layouts, and bespoke micro-interactions.
- **Simplicity:** Don't build unnecessary UI elements (like complex forms). Prioritize low cognitive load and high-impact interactions (e.g., mailto links with copy-to-clipboard functionality instead of generic contact forms).

## 2. Copywriting & Voice
- **Tone:** Confident, human-centric, and action-oriented. No robotic or overly formal tech-jargon.
- **Rule:** Write copy that drives intent, not mechanism.
- **Examples:**
  - Use "Daag ons uit" (Challenge us) instead of "Start een gesprek" or "Contact us".
  - Use "Deel je plannen" (Share your plans) instead of "Open e-mailapplicatie".

## 3. Design System & CSS Variables (Tailwind)

### Colors
- **Dark Mode Core:** `--color-kopwerk-dark` (`#07090e`) - Use via `bg-kopwerk-dark`. Never use pure black (`#000000`).
- **Light Mode Core:** `slate-50` (`#f8fafc`).
- **Text & Borders:** Use Tailwind's `slate` scale (`slate-900` for light mode text, `slate-400`/`500` for secondary text/eyebrows).
- **Accents:** Tailwind's `amber` scale. `amber-500` (`#f59e0b`) for primary interaction. `amber-400` or `amber-600` in dark mode for depth and glows.

### Typography
- **Headings (Display):** `Syne` (Architectural, geometric, confident).
- **Body & UI (Sans):** `Plus Jakarta Sans` (Clean, highly legible).
- **Tracking (Letter-spacing):** Use the custom CSS variables defined in `src/index.css` instead of hardcoded values:
  - `tracking-wide-sm` (0.04em) - For lead/body text.
  - `tracking-wide-md` (0.1em) - For headings (H1/H2).
  - `tracking-wide-lg` (0.15em) - For large open titles.
  - `tracking-wide-xl` (0.2em) - For uppercase buttons/labels.
  - `tracking-super-wide` (0.4em) - For eyebrow text.
  - `tracking-ultra-wide` (0.5em) - For extreme micro-typography.

## 4. Components & Interactions
- **Micro-interactions:** Use rolling-text animations on hover with overflow hidden.
- **Easing:** Prefer premium Apple-like easing curves, e.g., `ease-[cubic-bezier(0.19,1,0.22,1)]` over standard `ease-in-out`.
- **Buttons:** Avoid generic symmetric pills. Use bespoke asymmetric capsule shapes with distinct icon containers and contrast inversion on hover.
