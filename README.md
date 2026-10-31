# Studio Kopwerk

> Helpt ondernemers en bedrijven hun werk eenvoudiger, mooier en fijner te maken. Zien wat wérkt.

Studio Kopwerk is een verfijnde, doordachte landingspagina met een rustige esthetiek, royale witruimte en subtiele interacties.

---

## 🚀 Tech Stack

- **Framework:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite 8](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) + Custom Design System (self-hosted `Syne` & `Plus Jakarta Sans` via Fontsource)
- **Animations:** CSS for entrances, [Motion](https://motion.dev/) (`motion/react`, lazily loaded via `LazyMotion`) for layout and spring interactions
- **Hosting:** [Azure Static Web Apps](https://learn.microsoft.com/azure/static-web-apps/)
- **UI Primitives & Icons:** [Base UI](https://base-ui.com/) (`@base-ui/react`) + the design system's own Kopwerk line icons (`src/components/ui/Icon.tsx`)

---

## ✨ Key Features & UX Highlights

- **High-Contrast & Dark Mode Support:** One-button theme toggle, dark first: dark unless the system asks for light, and a manual choice is remembered (`useTheme` hook).
- **Interactive Micro-Interactions:** Custom magnetic button wrappers, rolling text hover animations, and smooth physics-based transitions.
- **Interactive Contact Modal:** Accessible dialog overlay (`ContactCard`) with dynamic email copy functionality and direct mailto actions.
- **Keyboard Navigation & Accessibility:** Everything works with Tab, Enter and `Esc`; no single-key shortcuts (WCAG 2.1.4). All motion respects `prefers-reduced-motion`.
- **Performance Optimized:** Contact dialog loaded on first intent, lazily loaded animation engine, no-flash theme init, and a "drafting table" background that draws the K geometry once and then rests (CSS-only ambient light and pulse).

---

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- `npm` or `bun`

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Build for production** (prerenders every page to static HTML in `dist/`):
   ```bash
   npm run build
   ```

4. **Lint & Typecheck:**
   ```bash
   npm run lint
   ```

5. **Tests:**
   ```bash
   npm test
   ```

---

## ✍️ Een opdracht toevoegen

`/werk` toont per opdracht één korte kaart: een titel, de klant, twee of drie zinnen en eventueel één beeld, citaat of getal. Elke opdracht is een map in `src/content/werk/`.

1. **Kopieer het sjabloon** `src/content/werk/_sjabloon/` naar `src/content/werk/<korte-naam>/` (kleine letters, cijfers en streepjes).
2. **Vul bovenin in:** `titel` (wat het opleverde, in één zin), `klant`, `datum` en eventueel `sector`.
3. **Kies hoogstens één extra**, of geen:
   - `beeld` en `alt`: zet het bestand in dezelfde map, bij voorkeur `.webp` van maximaal ±2000 px breed;
   - `citaat` en `naam` (en eventueel `rol`);
   - `getal` en `label`.
   - Bij een `beeld` kan er een korte `film` achter: een lijst scènes met elk een `beeld` (één uitsnede van een scherm, niet het hele scherm; voorbeeldgegevens, geen echte klantdata), `alt`, één regel `tekst` en eventueel een `focus` waar het beeld langzaam naartoe schuift (bijv. `"70% 40%"`). Eén scène mag `begin` krijgen, één zin: Begin toont dan die scène in plaats van het hele beeld, met de zin onder de tekst. Zie `operatie-kopwerk/` als voorbeeld.
4. **Schrijf eronder** twee of drie zinnen: de vraag, wat ik maakte, wat het opleverde.
5. **Laat `concept: true` staan** en open een PR. De Azure-preview toont concepten, de live site niet. Klopt er iets niet, dan faalt de build met een melding die zegt wat er mist.
6. **Klaar?** Haal `concept: true` weg en merge. De nieuwste opdracht komt bovenaan.

Zolang er geen opdracht is, bestaat `/werk` niet: geen pagina, geen regel in de sitemap, en de URL geeft een 404. Een concept maakt de pagina alleen zichtbaar in de PR-preview; op de live site verschijnt hij pas bij de eerste gepubliceerde opdracht.

Liever niet zelf? Vraag Claude Code: "voeg een opdracht toe over …".

---

## 📁 Project Structure

```
studio-kopwerk/
├── src/
│   ├── components/
│   │   ├── layout/       # Header, Footer
│   │   ├── ui/           # CapsuleButton, RollingText, Typography, Button, Dialog, Icon, KopwerkLogo, MagneticWrapper
│   │   ├── werk/         # ProjectCard, ProjectFilm, Rekenhulp, KleineDingen
│   │   ├── AbstractBackground.tsx
│   │   ├── ContactCard.tsx
│   │   └── ThemeToggle.tsx
│   ├── hooks/            # Custom hooks (e.g. useTheme, useContact)
│   ├── lib/              # Utility functions (cn), head tags, contact details, lazy Motion features
│   ├── pages/            # One component per page (Home, Aanpak, Werk, Over, Privacy, NotFound)
│   ├── content/werk/     # The opdrachten on /werk, one folder each (see "Een opdracht toevoegen")
│   ├── content/klein/    # Images for "Kleine dingen" on /werk
│   ├── content/over/     # The portrait on Begin and /over
│   ├── App.tsx           # The frame that stays put across pages
│   ├── routes.tsx        # Every page: its path, head tags and component
│   ├── entry-client.tsx  # Browser entry: hydrates the prerendered page
│   ├── entry-server.tsx  # Renders a page to HTML at build time
│   ├── index.css         # Design system CSS variables & Tailwind imports
│   └── types.ts          # TypeScript type definitions
├── scripts/
│   ├── prerender.mjs     # Writes one HTML file per page, 404.html and sitemap.xml
│   └── share-images.mjs  # Draws each page's share image in public/og/
├── public/
│   ├── staticwebapp.config.json  # Azure SWA security headers, 404 page & routing
│   └── theme-init.js     # Applies the theme before first paint
├── AGENTS.md             # Codebase rules for AI agents
├── BRAND_GUIDE.md        # Brand source of truth
└── README.md             # Project documentation
```

---

## 🚢 Deployment

Every push to `main` runs the Azure Static Web Apps workflow: `npm ci`, `npm run lint` (strict typecheck), `npm test`, then build (with prerender) and deploy. Pull requests against `main` get a preview environment.
