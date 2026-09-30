# Studio Kopwerk — Brand Identity, Design System & Agent Style Guide

> **Purpose:** This document is the definitive design and styling blueprint for **Studio Kopwerk**. External AI agents, designers, and developers should use this specification to generate on-brand proposals (*offertes*), roadmaps, strategic documents, presentations, and web UI components that match the exact aesthetic, typography, color palette, and voice of Studio Kopwerk.

---

## 1. Brand Identity & Design Philosophy

* **Brand Name:** Studio Kopwerk
* **Tagline:** *Zien wat wérkt.* (See what *works*.)
* **Core Identity:** Studio Kopwerk helpt iedereen om mooiere en fijnere ervaringen te maken, op welk vlak dan ook.
* **Aesthetic Vibe:** Rustig, minimalistisch, doordacht, toegankelijk en zonder poeha.
* **Anti-Slop Design Principles:**
  * **Extreme Intentional Whitespace:** Generous breathing room; avoid cluttered layouts and dense text blocks.
  * **High Contrast:** Crisp dark mode (`#07090e`) and refined light mode (`#f8fafc`). **Never use pure `#000000`**.
  * **Intentional Accents:** Glowing warm Amber (`#f59e0b`) accents used sparingly as points of energy, intelligence, and focus.
  * **Low Cognitive Load:** Clear visual hierarchy, actionable summaries, driving intent rather than mechanism.

---

## 2. Logo & Brand Mark Assets

The Studio Kopwerk logo consists of an architectural, geometric **"K"** with an **Amber Dot** embedded at its central vertex.

### Asset Links (Publicly Hosted)
* **Vector SVG Logo (Dark / Light auto-adaptive):**  
  `https://www.studiokopwerk.nl/favicon.svg`  
  *(Alternative raw GitHub URL: `https://raw.githubusercontent.com/martijn-kopwerk/studiokopwerk/main/public/favicon.svg`)*
* **Raster PNG Logo:**  
  `https://www.studiokopwerk.nl/favicon.png`

### Inline Vector SVG (Copy & Paste)
When generating HTML, React, PDF, or SVG documents, embed this exact SVG:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120" aria-label="Studio Kopwerk Logo">
  <style>
    .k-shape { 
      stroke: #07090e; 
      stroke-width: 20; 
      stroke-linecap: square; 
      stroke-linejoin: miter; 
      fill: none;
    }
    @media (prefers-color-scheme: dark) {
      .k-shape { stroke: #f8fafc; }
    }
    .accent { fill: #f59e0b; }
  </style>
  <!-- The Architectural K -->
  <polyline points="30,20 30,100" class="k-shape" />
  <polyline points="94,20 40,60 94,100" class="k-shape" />
  <!-- The Amber Dot Vertex -->
  <circle cx="37" cy="60" r="14" class="accent" stroke="none" />
</svg>
```

### On the Website
The K mark sits top-left in the header on every screen size (`<KopwerkLogo>`), with a slow pulse around its amber dot (off for reduced motion).

**Background, "de tekentafel":** on load, faint hairlines draw the construction geometry of the K across the page (its stem, vertex and arm angles), the K itself appears slightly stronger, and the amber dot lands on the vertex and keeps pulsing. After that intro the drawing is still. A soft amber ambient glow follows the cursor with a long lag (it drifts slowly on touch screens). Reduced motion shows the finished drawing and a still glow. On phones (under 640px) there is no room for the large K: the guides grow out of the header logo instead (its stem becomes the left margin line, mirrored on the right), and the logo's own dot is the only amber dot.

**Theme toggle:** one round button showing the theme you switch *to* (moon in light, sun in dark). The site follows the system by default; toggling back to the system's own theme forgets the manual choice.

### The Signature "Amber Dot" Element
A standalone amber glowing indicator represents the pulse of Kopwerk. Used in headers, live status indicators, timeline nodes, and key action items:
* **HTML/Tailwind:** `<span class="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.6)]"></span>`

---

## 3. Color Palette & Semantics

| Token Name | Hex Code | Tailwind Class | Role & Usage |
| :--- | :--- | :--- | :--- |
| **Kopwerk Dark (Canvas)** | `#07090e` | `bg-kopwerk-dark` / `bg-[#07090e]` | Primary dark mode background. Deep titanium obsidian. |
| **Kopwerk Light (Canvas)** | `#f8fafc` | `bg-slate-50` | Primary light mode background. Clean crisp alabaster. |
| **Amber Primary (Energy)** | `#f59e0b` | `text-amber-500` / `bg-amber-500` | Primary brand accent, glowing dots, interactive highlights. |
| **Amber Glow / Light Text** | `#fbbf24` | `text-amber-400` | Accent text on dark backgrounds and subtle glows. |
| **Amber Deep** | `#d97706` | `bg-amber-600` / `border-amber-600` | Dots, borders, icons and glows on light backgrounds. **Not for text** (3.2:1 on white). |
| **Amber Text (Light)** | `#b45309` | `text-amber-700` | Accent text on light backgrounds: hover labels, active states, confirmations (5.0:1 on white). |
| **Slate Dark (Headings)** | `#0f172a` | `text-slate-900` | Primary light-mode typography & dark-mode card surfaces. |
| **Slate White (Headings)** | `#ffffff` | `text-white` | Primary dark-mode typography & light-mode card surfaces. |
| **Slate Muted (Body)** | `#475569` / `#cbd5e1` | `text-slate-600` / `text-slate-300` | Secondary body text, descriptions, table cells. |
| **Slate Subtext (Eyebrows)** | `#64748b` / `#94a3b8` | `text-slate-500` / `text-slate-400` | Category tags, dates, metadata, section eyebrows. |
| **Subtle Borders** | `#e2e8f0` / `#1e293b` | `border-slate-200` / `dark:border-slate-800` | Hairline dividers, card outlines, table borders. |

* **Selection Color:** `rgba(217, 119, 6, 0.25)` with inherited text color.
* **Contrast:** all text meets WCAG AA (4.5:1). On light backgrounds that means `slate-500` or darker for small labels and `amber-700` for amber text. On `#07090e`, use `slate-400` or lighter and `amber-400`.
* **Ambient Glows:** Radial gradients with `rgba(245, 158, 11, 0.05)` to `rgba(245, 158, 11, 0)` for background atmosphere.

---

## 4. Typography System & Letter-Spacing

### Fonts
The website self-hosts both fonts (`@fontsource-variable/syne`, `@fontsource-variable/plus-jakarta-sans`). For standalone documents, Google Fonts is fine:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Syne:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

1. **Display / Titles:** `Syne` (`sans-serif`, geometric, architectural, bold). Weights run 400–800: **400 (`font-normal`) is the lightest**. Never use `font-light` on Syne; it silently renders at the nearest loaded weight.
2. **Body & UI / Numerals:** `Plus Jakarta Sans` (`sans-serif`, legible, modern, geometric).

### Strict Letter-Spacing (Tracking) Rules
Studio Kopwerk relies on exaggerated, deliberate letter-spacing for premium micro-typography:

| Level | Tailwind token (website) | Value | Usage |
| :--- | :--- | :--- | :--- |
| **Ultra-Wide** | `tracking-ultra-wide` | `0.5em` | Hero eyebrows (`STUDIO`, `OFFERTE`, `ROADMAP`) |
| **Super-Wide** | `tracking-super-wide` | `0.4em` | Section eyebrows, card tags, metadata labels |
| **Wide-XL** | `tracking-wide-xl` | `0.2em` | Uppercase buttons, navigation items, status badges |
| **Wide-LG** | `tracking-wide-lg` | `0.15em` | Large H1 titles and hero numbers |
| **Wide-MD** | `tracking-wide-md` | `0.1em` | H1 and H2 titles |
| **Wide-SM** | `tracking-wide-sm` | `0.04em` | Lead paragraphs, key takeaways, summary quotes, mixed-case button labels |

In the website codebase, always use the token names (defined in `src/index.css`). The literal values below are for standalone documents that don't have the Tailwind theme. Tailwind's own `tracking-tight` / `tracking-wide` are not part of the system.

### Hierarchy Scale

* **Eyebrow (`span`):**  
  `font-sans text-xs sm:text-sm font-medium tracking-[0.4em] uppercase text-slate-500 dark:text-slate-400`
* **H1 / Document Title (`h1`):**  
  `font-display font-normal text-4xl sm:text-6xl md:text-7xl tracking-[0.1em] uppercase leading-none text-slate-900 dark:text-white`
* **H2 / Section Title (`h2`):**  
  `font-display font-medium text-2xl sm:text-4xl tracking-[0.1em] text-slate-900 dark:text-white`
* **Lead / Tagline (`p`):**  
  `font-sans text-xl sm:text-2xl font-light tracking-[0.04em] text-slate-600 dark:text-slate-300`  
  *(Key words in lead text are often italicized, e.g. `Zien wat <em class="italic font-normal">wérkt</em>.`)*
* **Body Text (`p`):**  
  `font-sans text-base font-normal leading-relaxed text-slate-700 dark:text-slate-300`
* **Metadata / Footnote (`small`):**  
  `font-sans text-xs font-semibold tracking-[0.2em] uppercase text-slate-500 dark:text-slate-400`

### Motion
* **Easing:** `cubic-bezier(0.19, 1, 0.22, 1)` (Tailwind token `ease-kopwerk`), typically 500ms. Avoid `ease-in-out` and `easeOut`.
* **Rolling text:** on hover *and* keyboard focus the label rolls up and an amber copy rolls in (overflow hidden). The duplicate is `aria-hidden`. In code: `<RollingText>`.
* **Reduced motion:** every animation (canvas, pulse, entrance, magnetic pull) stops or becomes a still state under `prefers-reduced-motion: reduce`.

---

## 5. UI & Document Component Patterns

When generating **Offertes (Proposals)**, **Project Roadmaps**, or **Executive Summaries**, adhere to these component blueprints:

### A. Document Header / Cover
```html
<header class="w-full py-12 border-b border-slate-200 dark:border-slate-800">
  <div class="flex items-center justify-between mb-8">
    <!-- Logo Badge -->
    <div class="flex items-center gap-3">
      <span class="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.6)]"></span>
      <span class="font-display font-bold tracking-[0.2em] uppercase text-sm text-slate-900 dark:text-white">Studio Kopwerk</span>
    </div>
    <!-- Document Metadata -->
    <span class="text-xs font-medium tracking-[0.4em] uppercase text-slate-500 dark:text-slate-400">
      Offerte &bull; Q3 2026
    </span>
  </div>
  
  <span class="text-xs font-medium tracking-[0.4em] uppercase text-slate-500 dark:text-slate-400 block mb-2">Voorstel</span>
  <h1 class="font-display font-normal text-5xl sm:text-6xl tracking-[0.1em] uppercase text-slate-900 dark:text-white mb-4">
    AI Prototype & Platform
  </h1>
  <p class="text-xl font-light tracking-[0.04em] text-slate-600 dark:text-slate-300">
    Van concept naar een schaalbaar, werkend digitaal fundament.
  </p>
</header>
```

### B. Content Card / Glass Surface
```html
<div class="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-[#07090e]/80 backdrop-blur-xl p-8 sm:p-10 shadow-xl shadow-slate-900/5">
  <!-- Subtle Amber Ambient Glow in Corner -->
  <div class="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
  
  <span class="text-xs font-semibold tracking-[0.3em] uppercase text-amber-700 dark:text-amber-400 mb-2 block">
    Fase 01
  </span>
  <h3 class="font-display text-2xl font-semibold text-slate-900 dark:text-white mb-4">
    Architectuur & UX Flow
  </h3>
  <p class="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
    Definiëren van de kerninteracties, datastromen en AI-logica met minimale frictie en maximale impact.
  </p>
</div>
```

### C. Roadmap / Milestone Timeline
* **Connector Line:** 1px hairline in `border-slate-200` (`dark:border-slate-800`).
* **Node Point:** `w-3 h-3 rounded-full bg-amber-500 ring-4 ring-amber-500/20`.
* **Phases:** Numbered with bold geometric Syne fonts (`01`, `02`, `03`).

### D. Pricing & Scope Tables (Offerte)
* **Headers:** Uppercase with `tracking-[0.2em]`, font size `11px`, `text-slate-400`.
* **Dividers:** Clean horizontal 1px border `border-slate-200 dark:border-slate-800`.
* **Values:** `font-sans font-medium text-slate-900 dark:text-white`.
* **Total Highlight:** Large Syne display font with an amber accent bar or background pill.

### E. Asymmetric Capsule Button (CTA)
In the website codebase this is the `<CapsuleButton>` component. Don't rebuild it inline.

```html
<a href="mailto:hallo@studiokopwerk.nl" class="group inline-flex items-center gap-6 rounded-full bg-slate-900 dark:bg-white pl-8 pr-2 py-2 text-white dark:text-slate-950 shadow-xl transition-all duration-300 hover:scale-[1.02]">
  <span class="text-sm font-medium tracking-[0.1em] uppercase">
    Daag ons uit
  </span>
  <span class="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 dark:bg-black/10 transition-colors duration-300 group-hover:bg-amber-500">
    &nearr;
  </span>
</a>
```

---

## 6. Copywriting Tone & Voice Guidelines

* **Dutch Primary Voice / Intent-Driven:**
  * Use *"Daag ons uit"* instead of *"Neem contact op"* or *"Contact us"*.
  * Use *"Zien wat wérkt"* as the definitive statement of value.
  * Use *"Deel je plannen"* instead of *"Stuur een e-mail"*.
  * Use *"Tijd voor actie"* for proposal closing and decision points.
* **Direct & Human:** No fluffy marketing jargon ("synergy", "paradigm shift", "turnkey solution"). Clear, sharp, and confident language.
* **Outcome Focus:** Always describe the tangible business value, user speed, and working prototypes rather than technical complexity for its own sake.

---

## 7. Quick Reference Prompt for Other AI Agents

When prompting an external LLM/Agent to generate an artifact for Studio Kopwerk, include this summary instruction:

```markdown
Generate this document strictly following the Studio Kopwerk Design System:
- Palette: Dark mode #07090e (never #000000), Light mode #f8fafc (slate-50), Accent Amber #f59e0b.
- Typography: Display font 'Syne' (geometric/bold) and Body font 'Plus Jakarta Sans'.
- Letter-spacing: Ultra-wide (0.4em-0.5em) for uppercase eyebrows/labels; wide (0.1em) for headings.
- Aesthetic: Minimalist, architectural, generous whitespace, frosted glass cards (backdrop-blur), glowing amber dots for status.
- Tone: Confident, action-oriented ("Zien wat wérkt", "Daag ons uit"), zero corporate filler.
- Logo URL: https://www.studiokopwerk.nl/favicon.svg
- Contact: hallo@studiokopwerk.nl
```

