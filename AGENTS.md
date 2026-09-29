# Studio Kopwerk - AI System Instructions & Brand Guidelines

These instructions define the design system, copywriting voice, and UX philosophy for Studio Kopwerk. You MUST adhere to these rules when generating or modifying code for this project.

`BRAND_GUIDE.md` is the single source of truth for the brand (palette, type scale, tracking, component blueprints, voice). This file summarises it for work in this codebase. If the two ever disagree, `BRAND_GUIDE.md` wins; fix this file.

## 1. Brand Identity & UX Philosophy
- **Identity:** Studio Kopwerk helpt iedereen om mooiere en fijnere ervaringen te maken, op welk vlak dan ook. Toegankelijk, bescheiden, doordacht en zonder poeha.
- **Vibe:** Rustig, minimalistisch, verfijnd en doordacht.
- **Anti-Slop Design:** No generic SaaS templates. No standard 3-column grids with boring icons. Use extreme white space, high-contrast layouts, and bespoke micro-interactions.
- **Simplicity:** Don't build unnecessary UI elements (like complex forms). Prioritize low cognitive load and high-impact interactions (e.g., mailto links with copy-to-clipboard functionality instead of generic contact forms).
- **Accessibility is part of the brand ("toegankelijk"):** keyboard focus always visible, decorative duplicates `aria-hidden`, text selectable, and every animation respects `prefers-reduced-motion`.

## 2. Copywriting & Voice
- **Tone:** Confident, human-centric, and action-oriented. No robotic or overly formal tech-jargon.
- **Language:** Dutch, including labels, eyebrows and tooltips.
- **Rule:** Write copy that drives intent, not mechanism.
- **Examples:**
  - Use "Daag ons uit" (Challenge us) instead of "Start een gesprek", "Neem contact op" or "Contact us".
  - Use "Deel je plannen" (Share your plans) instead of "Open e-mailapplicatie".

## 3. Design System & CSS Variables (Tailwind)

All tokens live in `src/index.css` (`@theme`). Use tokens, never Tailwind's generic equivalents or arbitrary values.

### Colors
- **Dark Mode Core:** `--color-kopwerk-dark` (`#07090e`) - Use via `bg-kopwerk-dark`. Never use pure black (`#000000`), including for overlays and shadows (use `kopwerk-dark/…`).
- **Light Mode Core:** `slate-50` (`#f8fafc`).
- **Text & Borders:** Use Tailwind's `slate` scale (`slate-900` for light mode text, `slate-400`/`500` for secondary text/eyebrows).
- **Accents:** Tailwind's `amber` scale. `amber-500` (`#f59e0b`) for primary interaction. `amber-400` or `amber-600` in dark mode for depth and glows. Success states use amber too; no green/emerald.

### Typography
- **Headings (Display):** `Syne` via `font-display` (Architectural, geometric, confident). Weights 400–800; `font-normal` is the lightest. Never `font-light` on Syne.
- **Body & UI (Sans):** `Plus Jakarta Sans` via `font-sans` (Clean, highly legible).
- Both are self-hosted through `@fontsource-variable/*` (imported in `src/main.tsx`). Don't add Google Fonts links; the CSP blocks them.
- **Tracking (Letter-spacing):** Use the custom tokens instead of hardcoded values or `tracking-tight`/`tracking-wide`:
  - `tracking-wide-sm` (0.04em) - For lead/body text and mixed-case button labels.
  - `tracking-wide-md` (0.1em) - For headings (H1/H2).
  - `tracking-wide-lg` (0.15em) - For large open titles.
  - `tracking-wide-xl` (0.2em) - For uppercase buttons/labels.
  - `tracking-super-wide` (0.4em) - For eyebrow text.
  - `tracking-ultra-wide` (0.5em) - For extreme micro-typography.

## 4. Components & Interactions
- **Buttons:** Avoid generic symmetric pills. Primary CTAs use `<CapsuleButton>` (`src/components/ui/CapsuleButton.tsx`): the bespoke asymmetric capsule with a distinct icon well and contrast inversion on hover. `<Button>` is only for quiet utility controls (ghost icon buttons).
- **Micro-interactions:** Rolling-text on hover/focus via `<RollingText>` (`src/components/ui/RollingText.tsx`). Don't hand-roll the two-span pattern.
- **Easing:** Use the `ease-kopwerk` token (`cubic-bezier(0.19,1,0.22,1)`), usually with `duration-500`. In Motion, use `[0.19, 1, 0.22, 1]`. Never `ease-in-out` or `easeOut`.
- **Entrance animations:** CSS via `motion-safe:animate-rise` (tune with `[--rise-from:…]` and `[animation-delay:…]`).
- **Motion library:** Use `m.*` components (the app is wrapped in `LazyMotion` + `MotionConfig reducedMotion="user"`), never `motion.*`.
- **Reduced motion:** Use `motion-safe:` / `motion-reduce:` variants for CSS, `useReducedMotion()` in React.

## 5. Delivery
- Hosting: Azure Static Web Apps (`.github/workflows/azure-static-web-apps-*.yml`), deployed on push to `main`.
- Security headers and routing live in `public/staticwebapp.config.json`. The CSP allows no inline scripts and no third-party origins; keep it that way.
- `npm run lint` (strict `tsc`) must pass; CI runs it before deploying.
