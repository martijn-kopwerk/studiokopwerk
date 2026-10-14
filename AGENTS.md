# Studio Kopwerk - AI System Instructions & Brand Guidelines

These instructions define the design system, copywriting voice, and UX philosophy for Studio Kopwerk. You MUST adhere to these rules when generating or modifying code for this project.

**Design system first.** The Studio Kopwerk design system is the single source of truth for the brand (positioning, palette, type scale, tracking, motion, components, voice): https://claude.ai/artifact/8m9zeziNGjkdFoJCX2w3Vi. Read it with the Artifact tool (`read` with `paths`; start with `project/README.md`, `project/voice.md` and `project/tokens.json`). `BRAND_GUIDE.md` and this file translate it into this codebase and add what only the website has (de tekentafel, the dot's reading line, prerendering). If they disagree with the design system, the design system wins: fix the repo files, or, if the website should deliberately differ, record that in the design system itself.

Known places where the code still differs from the design system are listed in the newest `docs/ux-review/` file ("Repo wijkt af van design system"); align them when you touch that code.

## 1. Brand Identity & UX Philosophy
- **Identity:** Studio Kopwerk helpt ondernemers en bedrijven die goed zijn in hun vak, maar vastlopen in het digitale eromheen, hun werk eenvoudiger, mooier en fijner te maken. AI doet het maakwerk, jij beslist wat blijft. Toegankelijk, bescheiden, doordacht en zonder poeha.
- **Vibe:** Rustig, minimalistisch, verfijnd en doordacht.
- **Anti-Slop Design:** No generic SaaS templates. No standard 3-column grids with boring icons. Use extreme white space, high-contrast layouts, and bespoke micro-interactions.
- **Simplicity:** Don't build unnecessary UI elements (like complex forms). Prioritize low cognitive load and high-impact interactions (e.g., mailto links with copy-to-clipboard functionality instead of generic contact forms).
- **Accessibility is part of the brand ("toegankelijk"):** keyboard focus always visible, decorative duplicates `aria-hidden`, text selectable, and every animation respects `prefers-reduced-motion`.

## 2. Copywriting & Voice
- **Tone:** Confident, human-centric, and action-oriented. No robotic or overly formal tech-jargon.
- **Language:** Dutch, including labels, eyebrows and tooltips.
- **Rule:** Write copy that drives intent, not mechanism.
- **Word choice:** one word for one thing, as listed under "Words we use" in the design system's `project/voice.md` (*mailadres*, *Begin* not *Home*, *programma's* not *tools*, imperative labels). `src/tekstwacht.test.tsx` checks every page for a comma before *en* and for words we don't use.
- **Examples:**
  - Use "Vertel waar het knelt" (Tell us where it pinches) instead of "Daag ons uit", "Start een gesprek", "Neem contact op" or "Contact us". It is the one call to action, on every page: it starts from the reader's situation and needs no "ons" or "me".
  - Use "Vertel het in een mail" instead of "Deel je plannen" or "Open e-mailapplicatie": the way to the mail after "Vertel waar het knelt" asks for the same story.

## 3. Design System & CSS Variables (Tailwind)

All tokens live in `src/index.css` (`@theme`). Use tokens, never Tailwind's generic equivalents or arbitrary values.

### Theme
- **Dark first, the person decides:** the toggle's choice wins; otherwise a system setting for light (`prefers-color-scheme: light`) wins; otherwise dark. Test for light, not for dark, and render dark before any script runs.

### Colors
- **Dark Mode Core:** `--color-kopwerk-dark` (`#07090e`) - Use via `bg-kopwerk-dark`. Never use pure black (`#000000`), including for overlays and shadows (use `kopwerk-dark/…`).
- **Light Mode Core:** `slate-50` (`#f8fafc`).
- **Text & Borders:** Use Tailwind's `slate` scale (`slate-900` for light mode text, `slate-400`/`500` for secondary text/eyebrows).
- **Accents:** Tailwind's `amber` scale. `amber-500` (`#f59e0b`) for primary interaction, dots and fills. `amber-400` or `amber-600` for depth and glows. Success states use amber too; no green/emerald.
- **Contrast (WCAG AA, 4.5:1 for text):** amber *text* on light backgrounds is `amber-700` (never `amber-500`/`600`); on dark it is `amber-400`. Small grey labels: `text-subtle dark:text-slate-400` (the design system's `ink-subtle`, `#56657a` on light; never `slate-400` on white or `slate-500` on `kopwerk-dark`).

### Typography
- **Headings (Display):** `Syne` via `font-display` (Architectural, geometric, confident). Weights 400–800; `font-normal` is the lightest. Never `font-light` on Syne.
- **Body & UI (Sans):** `Plus Jakarta Sans` via `font-sans` (Clean, highly legible).
- Both are self-hosted through `@fontsource-variable/*` (imported in `src/main.tsx`). Don't add Google Fonts links; the CSP blocks them.
- **Tracking (Letter-spacing):** Use the custom tokens instead of hardcoded values or `tracking-tight`/`tracking-wide`:
  - `tracking-wide-sm` (0.04em) - For lead/body text and mixed-case button labels.
  - `tracking-wide-md` (0.1em) - For H1 titles and 14px capsule CTA labels.
  - `tracking-wide-lg` (0.15em) - For large open titles.
  - `tracking-wide-xl` (0.2em) - For uppercase buttons/labels.
  - `tracking-super-wide` (0.4em) - For eyebrow text.
  - `tracking-ultra-wide` (0.5em) - For extreme micro-typography.
  - `tracking-heading` (-0.025em) - For H2 section titles (sentence case, set tight).
  - `tracking-display` (-0.035em) - For the one `display` statement per page.
- **Display and sublead:** `<Typography variant="display">` sets the one sentence a page is about large (`text-display`, fluid): a line from the positionering or the core sentence Martijn wrote for that page. At most once per page and never as a title. `variant="sublead"` is the second step under a hero lead. The project's tokens are registered in `cn()` (`src/lib/utils.ts`) so tailwind-merge doesn't mistake `text-display` for a colour; add new tokens there too.

## 4. Components & Interactions
- **Logo:** `<KopwerkLogo>` (`src/components/ui/KopwerkLogo.tsx`), the K with its amber dot, in the header on every screen size.
- **Buttons:** Avoid generic symmetric pills. Primary CTAs use `<CapsuleButton>` (`src/components/ui/CapsuleButton.tsx`): the bespoke asymmetric capsule with a distinct icon well and contrast inversion on hover. `<Button>` is only for quiet utility controls (ghost icon buttons).
- **Micro-interactions:** Rolling-text on hover/focus via `<RollingText>` (`src/components/ui/RollingText.tsx`), or `<RollingLetters>` for one large line. Don't hand-roll the two-span pattern.
- **The call to action:** `<ContactButton>` (magnetic capsule, `aria-haspopup="dialog"`, opens the contact card). Don't rebuild it per page.
- **How a page ends:** the footer carries the page's `Slot`: the route's `slot.line` and `slot.next` (`src/routes.tsx`), the capsule and "Of mail zelf" with the address. Pages don't add a closing section of their own.
- **The contact card** (`src/components/ContactCard.tsx`) offers the frictions plus "Iets anders"; mail links go through `mailtoHref(knelt?)` (`src/lib/contact.ts`) so the subject is always "Waar het knelt" or "Waar het knelt: …".
- **Icons:** `<Icon name="…">` (`src/components/ui/Icon.tsx`), the design system's Kopwerk line icons. No `lucide-react` or other icon sets.
- **Radius:** only `rounded-2xl` and `rounded-full`.
- **Focus:** one rule for the whole site in `src/index.css`: a 2px solid outline, 2px offset, `amber-600` on light and `amber-400` on dark (the design system's `focus`). Don't add focus rings or `outline-none` to interactive elements; only headings that receive focus after navigation opt out.
- **Easing:** Use the `ease-kopwerk` token (`cubic-bezier(0.19,1,0.22,1)`), usually with `duration-500`. In Motion, use `[0.19, 1, 0.22, 1]`. Never `ease-in-out` or `easeOut`.
- **Entrance animations:** CSS via `motion-safe:animate-rise` (tune with `[--rise-from:…]` and `[animation-delay:…]`). Blocks below the first screen get `kopwerk-reveal` (a CSS scroll timeline, no script). No bouncing, no parallax.
- **Page transitions:** View Transitions through wouter's `aroundNav` (`src/lib/view-transition.ts`); `main h1` carries the `page-title` transition name, so keep one `h1` per page.
- **Motion library:** Use `m.*` components (the app is wrapped in `LazyMotion` + `MotionConfig reducedMotion="user"`), never `motion.*`.
- **Reduced motion:** Use `motion-safe:` / `motion-reduce:` variants for CSS, `useReducedMotion()` in React.

## 5. Pages & prerendering
- Every page is a concrete path in `src/routes.tsx` (its `meta` plus a component from `src/pages/`). `src/App.tsx` is the frame that stays put across pages (background, header, footer, contact card); only the page inside it changes.
- `npm run build` prerenders each route to its own HTML file (`scripts/prerender.mjs`, via `src/entry-server.tsx`), plus `404.html` and `sitemap.xml`. The browser then hydrates it (`src/entry-client.tsx`).
- Because pages are rendered without a browser first: never touch `window`, `document` or `localStorage` while rendering, only in effects or event handlers. Markup must not depend on client-only state such as the theme; use `dark:` variants instead.
- Per-page `<title>`, description, canonical and og tags come from the route's `meta` (`src/lib/head.ts`), never from `index.html`. Each page has its own share image in `public/og/` (`src/lib/share-images.ts`); after changing a title run `npm run share-images`.
- Links between pages use `Link` from `wouter`. Each page's `<h1>` gets `tabIndex={-1}`: focus moves there after navigation.
- The drafting-table background is fixed to the viewport and stays mounted across pages. A page can send its amber dot to one of its own elements with `useAmberDot()` (`src/hooks/useAmberDot.ts`), as `/werk` does for the chosen opdracht. Put dot targets in a margin, never over text, and outside `<button>`s (the one exception is a page's one moment, `useAmberDot(…, glide)`: on Begin the dot is the full stop of the promise); the dot ignores transforms so entrance animations don't throw it off. All of a page's targets sit on one reading line (the left margin on wider screens, the K's stem on phones): the dot glides only along that line, and fades out and back in when it has to go anywhere else (to or from the vertex), so it never slides across text or buttons. The footer takes the dot while it's in view and rests it in the margin beside its first line.
- On phones (under 640px) the K is drawn cropped, its stem continuing the header logo's stem (x ≈ 31px), and page content starts right of it (`pl-14 sm:px-…`). A page places the K's vertex with an empty `aria-hidden` element marked `data-tekentafel-vertex` in a gap between blocks. Geometry and line values: `src/lib/tekentafel.ts`; rules: `BRAND_GUIDE.md` §5F.

### Opdrachten (`src/content/werk/`)
- `/werk` is deliberately small: one short card per opdracht (title, client, two or three sentences, at most one image, quote or number). No pages per opdracht.
- An opdracht with an image may add a short `film:` (scenes of `beeld`, `alt`, `tekst`, optional `focus`) that opens from that image in a dialog (`src/components/werk/ProjectFilm.tsx`). Scenes are stills from a demo with example data, never real client data. Rules: `BRAND_GUIDE.md` §5G. One scene may carry `begin:` (one sentence): Begin then shows that scene instead of the full image, with the sentence below the text. Beside `begin:` a `getal:` ("5 min") sets the saving large above that sentence, on Begin and on `/werk`.
- One folder per opdracht: `index.md` (plain Markdown, no components) plus its image. Folders starting with `_` are skipped; `_sjabloon/` is the template to copy, and a test keeps it valid.
- The fields are validated by `parseProject` in `src/lib/projects.ts`; their names are Dutch (`titel`, `klant`, `datum`, `beeld`/`alt`, `citaat`/`naam`/`rol`, `getal`/`label`, `concept`).
- New opdrachten start as `concept: true`: visible in `npm run dev` and PR previews, hidden on the live site. Publishing is removing that line.
- Write in the brand voice; never invent clients, quotes or numbers. Anything not given yet stays a `[placeholder]` and the opdracht stays a draft.

## 6. Delivery
- Hosting: Azure Static Web Apps (`.github/workflows/azure-static-web-apps-*.yml`), deployed on push to `main`.
- Security headers and routing live in `public/staticwebapp.config.json`. The CSP allows no inline scripts and no third-party origins; keep it that way. The prerender step fails the build if a page would contain an inline script.
- `npm run lint` (strict `tsc`) and `npm test` (Vitest) must pass; CI runs both before building and deploying.
