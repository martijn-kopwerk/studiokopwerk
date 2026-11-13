# Studio Kopwerk — Brand Identity, Design System & Agent Style Guide

## Website-uitwerking, bijgewerkt op 13 november 2026

Wat Martijn maakt heet op de site een **proefversie**: een proefversie van de oplossing (nooit van het probleem), met **verzonnen gegevens**. Niet *prototype*, *werkend voorbeeld* of *voorbeeldgegevens* (bevestigd op 3 november; staat ook in het design system, `voice.md`). Schrijf geen volledig opgeleverd of beheerd product toe aan een proefversie.

Het brede aanbod blijft: een duidelijkere website, een prettiger portaal of minder handmatig werk. De eerdere vanafprijs is vervallen op verzoek van Martijn op 13 november. Geen bedrag op de website of in metadata: we spreken per opdracht vooraf af wat Martijn maakt en wat het kost. Vooraf spreken we af wat Martijn maakt, wat het kost en wanneer je het kunt proberen. De offerte bevat per opdracht een concrete datum en zegt welke bestanden je krijgt en of code erbij hoort. Geen vaste belofte van twee weken en geen standaardbelofte van alle bestanden. Tel geen rondes. Verder bouwen is vrijwillig en apart afgesproken: "Wil je ermee verder? Dan spreken we af wat daarvoor nodig is, wie het oppakt en wat het kost." Deze keuzes zijn op 13 november door Martijn bevestigd en vervangen de betreffende aanbodafspraken van 2 en 3 november. Geen *online zetten*; zeg *echt gebruiken, met je eigen gegevens en voor je klanten of medewerkers*.

Voor deze reviewbare website-uitwerking wijkt de contactkaart bewust af van de oudere volgorde in §5H: eerst de mailactie en het kopieerbare adres, daarna optionele voorbeelden in een gesloten uitklapdeel. De korte knelpuntlabels helpen bij herkenning en komen letterlijk terug in het mailonderwerp, zowel op Begin als in de contactkaart (bevestigd op 13 november). Zonder keuze en bij "Iets anders" blijft het onderwerp "Waar het knelt". Persoonlijke proeven staan ingeklapt op Over, buiten de zakelijke bewijsroute op Werk.

Deze keuzes zijn met Martijn in de chat bevestigd. De externe design-systembron kon in deze sessie niet worden gelezen of aangepast. De wijzigingen die daar nog vastgelegd moeten worden staan in `docs/ux-review/2026-11-02-uitwerking.md`; dit is geen claim dat de externe bron al is bijgewerkt.

Op telefoon staat onder de film een echte, selecteerbare uitlegzin die meewisselt met de scène, zowel in de kaart op Werk als in het grote filmvenster (bevestigd op 13 november). Automatisch afspelen blijft stil voor schermlezers; met de hand door scènes stappen mag de uitleg aankondigen. De beschikbare hoogte houdt ruimte voor de uitleg en bediening.

## Begin vanuit het werk van de bezoeker, 13 november 2026

Deze richting vervangt de eerdere keuze om de eigen opdracht op Begin te tonen. De opening noemt het brede aanbod. Daarna volgen herkenbare werksituaties, Martijn en de werkwijze. Geen opdrachtfilm of caseblok op Begin en geen besparingsgetal of rekenhulp. Die staan bij de opdracht op Werk, bereikbaar via één rustige verwijzing in het paginaslot. Ook een toekomstige klantcase verschijnt niet automatisch op Begin.

De herkenningsschetsen volgen de stijl van 'Op de tekentafel' op Werk (bijgesteld op 13 november na beoordeling van de eerste preview): een transparant vlak met gestippelde rand, een fijn puntenraster en licht onregelmatige potloodlijnen. De amberkleurige punt tekent één keer een mogelijke aanpak. Daarna blijft de tekening staan; opnieuw tekenen is een bewuste keuze. Geen stappenkaarten of voor/na-schakelaar. De betekenis staat eronder als echte selecteerbare tekst. Bij `prefers-reduced-motion` staat de voltooide schets direct stil. De voorbeelden stellen mogelijkheden voor, geen verzonnen klanten of gegarandeerde resultaten.

De vijf werksituaties zijn op elk scherm direct als keuze zichtbaar en beginnen ingeklapt. Na openen komt eerst de mogelijke opbrengst, daarna de aanpak en de mailactie. De potloodschets volgt als ondersteuning, zonder dubbel onderschrift. Martijn onderzoekt het werk en ontwerpt de oplossing; AI versnelt het uitwerken. Benoem AI waar die een concrete rol heeft, zonder ieder voordeel aan AI toe te schrijven. Offertes zijn maatwerk voor de klant met veel minder uitwerktijd, geen generiek sjabloon. De ondernemer controleert inhoud en prijs. Geen onbewezen percentages of vaste tijdsgaranties.

Onder de vijf situaties staat een open uitnodiging: "Is er bij jou iets anders onnodig lastig?" Een potloodlijn vindt één keer een kortere route; daarna rust. De knop gebruikt de bestaande contactkaart. Het is geen zesde categorie en de mailkeuze blijft optioneel. Ook de tekentafel op Werk en de rondgang komen na één cyclus tot rust. Bij verminderde beweging staan de eindbeelden direct stil. EMC volgt later, na afronding en toestemming.

## Ontwerp zonder AI-look, 7 november 2026

Op 7 november heeft Martijn een ontwerpronde naar de regels van heydamir/unslop goedgekeurd (PR #67). Waar een regel hieronder nog anders zegt, geldt dit:

- **Zinsvorm, geen wijde spatiëring.** Labels, knoppen, menu, eyebrows en paginatitels staan in gewone zinsvorm. Geen `uppercase`, en geen `tracking-wide-md` tot `tracking-ultra-wide` op tekst. Grote titels krijgen `tracking-display`, kleine tekst geen extra spatiëring.
- **Gewichten 400 tot 600.** Geen `font-bold` (700) of zwaarder en geen `font-light`. Hiërarchie komt uit grootte en kleur.
- **Geen cursief voor nadruk.** Ook niet op *wérkt*: het accent doet de nadruk al.
- **De amber stip is vlak.** Geen gloed (`shadow-[0_0_…amber…]`, `drop-shadow`) en geen eindeloze pulsring: de ring gaat één keer bij het laden.
- **Het amber licht staat stil.** Het volgt het daglicht (`daglicht.ts`) maar niet de muis, en drijft niet op telefoons.
- **Knoppen hebben hoeken.** De capsule is `rounded-xl` met een `rounded-lg` pijlvak, kleine knoppen `rounded-lg`. Niet alles is een pil. Geen magnetisch effect en geen `hover:scale`: hover is een kleur- of vlakwissel, klikken een kleine indruk (`active:scale-[0.98]`).
- **Lichte schaduwen.** Op licht klein en zacht, op donker geen schaduw maar een dun lijntje.
- **Tekst minimaal 12 px**, ook in schetsen en voorbeelden.
- **Begin opent links**, met het aanbod en de bezoeker als hoofdzaak. De eerdere film naast de opening vervalt volgens de keuze van 13 november hierboven. Korte regels (labels, onderschriften, de rondgang) eindigen zonder punt.

Het design system zelf is nog niet bijgewerkt; tot dat gebeurt, wint deze sectie voor de website.

> **Design system first.** The definitive source for the Studio Kopwerk brand is the design system: https://claude.ai/artifact/8m9zeziNGjkdFoJCX2w3Vi. This file is the website's translation of it into this codebase, plus what only the website has (de tekentafel, §5F). Where this file disagrees with the design system, the design system wins and this file should be corrected.

---

## 1. Brand Identity & Design Philosophy

* **Brand Name:** Studio Kopwerk
* **Tagline:** *Zien wat wérkt.* (See what *works*.)
* **Core Identity:** Studio Kopwerk helpt ondernemers en bedrijven die goed zijn in hun vak, maar vastlopen in het digitale eromheen. We maken het eenvoudiger, mooier en fijner: AI doet het maakwerk, jij beslist wat blijft. Beschrijf de doelgroep naar hun situatie, nooit naar grootte (geen "mkb").
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
The K mark sits top-left in the header on every screen size (`<KopwerkLogo>`), with one pulse around its amber dot on load (off for reduced motion), then still.

**Background, "de tekentafel":** on load, faint hairlines draw the construction geometry of the K across the page (its stem, vertex and arm angles), the K itself appears slightly stronger, and the amber dot lands on the vertex with one pulse. After that intro the drawing is still. A soft amber light rests where the sun would be at that hour (`daglicht.ts`); it does not follow the pointer. Reduced motion shows the finished drawing. On phones (under 640px) the K is drawn cropped: its stem continues the header logo's stem, the arms run off the right edge and the content stands left-aligned beside the stem. The full rules are in §5F.

**Theme toggle:** one round button showing the theme you switch *to* (moon in light, sun in dark). Dark first, and the person decides (design system, Themes): a choice made with the toggle wins; otherwise a system setting for light wins; otherwise the site is dark. Toggling back to the system's own theme forgets the manual choice.

### The Signature "Amber Dot" Element
A standalone flat amber dot represents the pulse of Kopwerk, without a glow. Used in headers, live status indicators, timeline nodes, and key action items:
* **HTML/Tailwind:** `<span class="inline-block w-2.5 h-2.5 rounded-full bg-amber-500"></span>`

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
| **Ink Subtle (Eyebrows)** | `#56657a` / `#94a3b8` | `text-subtle` / `text-slate-400` | Category tags, dates, metadata, section eyebrows (design system `ink-subtle`: 5.7:1 on light). |
| **Subtle Borders** | `#e2e8f0` / `#1e293b` | `border-slate-200` / `dark:border-slate-800` | Hairline dividers, card outlines, table borders. |

* **Selection Color:** `rgba(217, 119, 6, 0.25)` with inherited text color.
* **Contrast:** all text meets WCAG AA (4.5:1). On light backgrounds that means `text-subtle` (`#56657a`) or darker for small labels and `amber-700` for amber text. On `#07090e`, use `slate-400` or lighter and `amber-400`.
* **Ambient light:** only the one still daylight behind the drawing table. No other radial washes or blobs behind content.

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
Since 7 November 2026 the wide tokens are no longer used on text (see the section at the top). Large titles use `tracking-display`, H2 `tracking-heading`; small text has no extra tracking. The wide tokens below remain only for older documents:

| Level | Tailwind token (website) | Value | Usage |
| :--- | :--- | :--- | :--- |
| **Ultra-Wide** | `tracking-ultra-wide` | `0.5em` | Hero eyebrows (`STUDIO`, `OFFERTE`, `ROADMAP`) |
| **Super-Wide** | `tracking-super-wide` | `0.4em` | Section eyebrows, card tags, metadata labels |
| **Wide-XL** | `tracking-wide-xl` | `0.2em` | Uppercase buttons, navigation items, status badges |
| **Wide-LG** | `tracking-wide-lg` | `0.15em` | Large H1 titles and hero numbers |
| **Wide-MD** | `tracking-wide-md` | `0.1em` | H1 titles; 14px capsule CTA labels |
| **Wide-SM** | `tracking-wide-sm` | `0.04em` | Lead paragraphs, key takeaways, summary quotes, mixed-case button labels |

In the website codebase, always use the token names (defined in `src/index.css`). The literal values below are for standalone documents that don't have the Tailwind theme. Tailwind's own `tracking-tight` / `tracking-wide` are not part of the system.

### Hierarchy Scale

* **Eyebrow (`span`):**  
  `font-sans text-sm font-medium text-[#56657a] dark:text-slate-400`
* **H1 / Document Title (`h1`):**  
  `font-display font-normal text-4xl sm:text-6xl md:text-7xl tracking-[-0.035em] leading-[1.05] text-slate-900 dark:text-white`
* **H2 / Section Title (`h2`):**  
  `font-display font-medium text-2xl sm:text-4xl tracking-[-0.025em] text-slate-900 dark:text-white`
* **Lead / Tagline (`p`):**  
  `font-sans text-xl sm:text-2xl font-normal text-slate-600 dark:text-slate-300`
* **Body Text (`p`):**  
  `font-sans text-base font-normal leading-relaxed text-slate-700 dark:text-slate-300`
* **Metadata / Footnote (`small`):**  
  `font-sans text-sm font-medium text-[#56657a] dark:text-slate-400`
* **Sublead (`p`), the second step under a hero lead:**  
  `font-sans text-base sm:text-lg leading-relaxed tracking-[0.02em] text-[#56657a] dark:text-slate-400`
* **Display (`p` or `h2`), one statement per page:**  
  `font-display font-medium text-[clamp(3rem,9vw,8rem)] leading-[0.95] tracking-[-0.035em] text-slate-900 dark:text-white`  
  *(A line from the positionering, sentence case, never a title. In code: `<Typography variant="display">`.)*

### Motion
* **Easing:** `cubic-bezier(0.19, 1, 0.22, 1)` (Tailwind token `ease-kopwerk`), typically 500ms. Avoid `ease-in-out` and `easeOut`. Durations: 300ms for colour and hover, 500ms for movement and page changes, 900ms for entrances.
* **Entrances:** the rise (`motion-safe:animate-rise`). Blocks below the first screen rise 12px into place as they scroll into view (`.kopwerk-reveal`, a CSS scroll timeline, no script); where that isn't supported they simply stand there.
* **Page changes:** View Transitions (`src/lib/view-transition.ts`): the page's `h1` glides to where the next page's `h1` stands, the old page fades, the new one rises in. The header and the drawing stay put.
* **Not:** bouncing or overshoot, parallax, magnetic pull, hover zoom, anything that loops by itself except the werkwijze loop.
* **Rolling text:** on hover *and* keyboard focus the label rolls up and an amber copy rolls in (overflow hidden). The duplicate is `aria-hidden`. In code: `<RollingText>`.
* **Reduced motion:** every animation (canvas, pulse, entrance) stops or becomes a still state under `prefers-reduced-motion: reduce`.

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
<a href="mailto:hallo@studiokopwerk.nl" class="group inline-flex items-center gap-6 rounded-xl bg-slate-900 dark:bg-white pl-6 pr-2 py-2 text-white dark:text-slate-950 shadow-sm transition-transform duration-150 active:scale-[0.98]">
  <span class="text-base font-medium">
    Vertel waar het knelt
  </span>
  <span class="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 dark:bg-black/10 transition-colors duration-300 group-hover:bg-amber-500">
    &nearr;
  </span>
</a>
```

### F. De tekentafel (drafting-table background)
The signature backdrop: the construction drawing of the K, as if the page were still on the drafting table. On the website it is `<AbstractBackground>`; its geometry and line values live in `src/lib/tekentafel.ts` and are the source for every other use.

* **Geometry:** the K from the logo (120×120 units: stem at x=30 from y=20 to y=100, vertex at (40, 60), arm ends at x=94, dot at (37, 60)), drawn large. Full-bleed guides run through the stem, the horizontal through the vertex, both arm angles extended in both directions, and the vertical through the arm ends.
* **Lines:** guides 1px, the K itself 1.25px, in slate ink at very low opacity:

  | | Ink | Guides | K | Guides (phone) | K (phone) |
  | :--- | :--- | :--- | :--- | :--- | :--- |
  | Light | `rgb(51 65 85)` (slate-700) | 0.075 | 0.16 | 0.09 | 0.2 |
  | Dark | `rgb(226 232 240)` (slate-200) | 0.055 | 0.13 | 0.075 | 0.17 |

* **Light gets a step more than dark,** so the table doesn't vanish on slate-50: light and dark are equal in quality.
* **Layers, back to front:** the still amber daylight, the drawing, the content, then the amber dot on the vertex (the only amber in the drawing).
* **Wide screens (640px and up):** the K is about as tall as the screen, its stem at 10% of the width, left of centre, so it never competes with the wordmark.
* **Phones (under 640px):** the K is drawn cropped. Its stem continues the header logo's stem as one line, the arms run off the right edge, and the content stands left-aligned just right of the stem. A page gives the vertex a place with an empty, `aria-hidden` element marked `data-tekentafel-vertex` in a gap between blocks (on the home page: between the mission line and the button); without one the vertex sits at 60% of the height. Pages that move the dot (`/werk`) put their markers on the stem line.
* **The dot never sits on text:** only in a margin, on the stem, or in a gap left for it.
* **The dot never crosses text either:** a page's dot positions all lie on one reading line (the left margin on wide screens, the stem on phones). Along that line the dot glides; to anywhere else (to or from the vertex) it fades out and reappears. While the footer is in view the dot rests in the margin beside it.
* **The dot hands itself over:** while a component with its own dot is the block being read (the loop on Begin and Aanpak), the reading dot fades out (`useAmberDot(…, hide)`). One dot walking, amber at one or two points.
* **The page's one moment:** a page may give the dot one moment that carries meaning (`useAmberDot(…, glide)`). On Begin it is the full stop of the promise: after landing on the vertex it flies slowly (1.4s) to the end of *Zien wat wérkt* and stays there; scrolling back up to the promise flies it back. On phones the way up crosses text, so there it fades and reappears instead. The `h1` keeps a real full stop for screen readers (`sr-only`), and before the script runs the full stop is drawn in amber.
* **Motion:** on load the lines draw themselves once (about 2.6s, brand curve), the K follows, the dot lands with one pulse. Then the drawing is still. The light stays where the sun would be. Reduced motion: the finished drawing and a still dot.
* **Elsewhere (slides, covers, social images):** use the same drawing static, with the same opacities and the dot on the vertex. Not behind running text in documents or offertes.

### G. Een film bij een opdracht (`/werk`)

The card on `/werk` stays small. An opdracht with an image may add a short film behind it: a few real screens with one line each, opened by a deliberate click on the image ("Bekijk hoe het werkt"). With a silent video (`filmpje:`), the film plays in the card on `/werk` itself (`ProjectVideo`: silent, only in view, looping, pause button, a poster frame `film.webp` / `film-staand.webp` beside the video, nothing moves with reduced motion), with the capsule below it to open it large. Begin shows no project film or still; on phones the capsule on Werk sits below the image, never over it.

* **Scenes, not video:** each scene is a still image from a demo with example data (never real client data or company details) that drifts slowly towards its focus (8%, brand curve) while a thin amber bar fills. About seven seconds a scene, five to seven scenes, then a closing frame with the line *"AI doet het maakwerk, jij beslist wat blijft."* and the capsule button *Vertel waar het knelt*, which opens the contact card.
* **One detail per scene, never a whole screen:** crop each image to the one thing the caption is about (the menu, two mails, one draft, one cover) and show it whole and large on the dark stage, with room around it. A full screen of interface is a wall of text.
* **Always dark,** like a cinema, in either theme. Phones get an upright stage.
* **The viewer decides:** pause, previous, next, a bar per scene to jump to, arrow keys, Escape. With reduced motion there is no drift and nothing plays by itself; the viewer steps through.
* **Captions are text,** in Syne, readable and selectable, and short: one or two sentences that say what the scene means for people, not what it shows (that is the image's `alt`). They follow the voice rules (`programma's`, not `apps`; no comma before *en*) and must be true of the image beside them.
* **A saving reads as a saving:** "Dat scheelt minstens twee uur per offerte", never a bare "Minstens twee uur per offerte", which reads as what it costs.
* **A saving as a number:** the scene with `begin:` may add `getal:` ("5 min"). The card on `/werk` then shows it large (`<Stat>`, Syne bold) above the sentence. Only numbers the film itself says.
* **One opdracht, one card:** while there is one opdracht, `/werk` shows it as one wide card (image left, text and saving right), without a list to choose from.


### H. Het frame: navigatie en footer
* **Navigation:** the current page in ink, underlined in amber (2px, under the label). The header scrolls away; scrolling back up below the first screen brings a compact glass bar (`<CompactNav>`): the K, the pages and an outlined "Vertel waar het knelt" (phones: the K and the button). Hidden, it is `inert`. Reduced motion: no slide.
* **One slot per page (design system: `Slot`):** every page ends in the footer with its own last line (the route's `slot.line`, else "Klein beginnen, snel iets maken dat werkt."), the capsule and, smaller, "Of mail zelf" with the address and "Kopieer". At most one quiet way on (`slot.next`). Pages have no closing section of their own. Below, quiet: the pages, the company details and Privacy. The dot rests beside the last line.
* **The contact card (`ContactCard`):** the capsule opens the first conversation: the five frictions plus "Iets anders" as choices, "Vertel het in een mail" with the choice as the subject (`mailtoHref(knelt)`, "Waar het knelt: …"), and at the bottom the address with copy. Focus starts on the first choice.
* **Icons:** `<Icon name="…">` (`src/components/ui/Icon.tsx`) draws the design system's Kopwerk line icons. No third-party icon set.
* **Corners:** by size. Cards and panels `rounded-2xl`, buttons `rounded-xl` or `rounded-lg`, small inner parts `rounded-md`; `rounded-full` only for dots, rings and the focus areas of text links.

### I. Kies waar het knelt (Begin)
The frictions from the positionering, word for word, as buttons (`<KnelpuntKiezer>`): a hollow ring that fills amber when chosen, the answer below it (↳, Syne) and the capsule "Vertel het in een mail", which opens the mail with the friction in the subject ("Waar het knelt: …"). One open at a time. Before the script runs it is the plain list of pairs (`<Knelpunten>`).

### J. De rondgang (werkwijze)
"AI maakt, jij beslist" as a loop (`<Rondgang>`, design system `Loop`): three hollow nodes on a circle, amber where you decide, "En dan weer opnieuw, tot het werkt." in the middle. The dot walks the loop (quick past AI, slower at samen kijken) and waits at "Jij beslist wat blijft."; it only runs while in view, and rests there with reduced motion. The words are a real list; the drawing is `aria-hidden`. On Begin beside the `display` statement, on Aanpak in "Hoe we werken".

### K. Deelbeelden (`public/og/`)
What a chat, mail or LinkedIn shows for a link (design system: `ShareImage`): 1200×630, always dark, the drafting table's K lines, the page's own h1 with the amber dot as its full stop, the eyebrow above and the address below. One per page, listed in `src/lib/share-images.ts` and written by `npm run share-images` (headless Chrome or Edge); the PNGs are committed and a test checks every route has one. Change a page title, run the script again.
---

## 6. Copywriting Tone & Voice Guidelines

* **Dutch Primary Voice / Intent-Driven:**
  * Use *"Vertel waar het knelt"* instead of *"Neem contact op"* or *"Contact us"* (it replaced *"Daag ons uit"*).
  * Use *"Zien wat wérkt"* as the definitive statement of value.
  * Use *"Vertel het in een mail"* instead of *"Stuur een e-mail"* or *"Deel je plannen"*.
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
- Type: sentence case everywhere, no uppercase labels, no wide letter-spacing, weights 400-600, no italic.
- Aesthetic: Minimalist, architectural, generous whitespace, quiet surfaces with hairlines, one flat amber dot, no glows or pills.
- Tone: Confident, action-oriented ("Zien wat wérkt", "Vertel waar het knelt"), zero corporate filler.
- Logo URL: https://www.studiokopwerk.nl/favicon.svg
- Contact: hallo@studiokopwerk.nl
```

