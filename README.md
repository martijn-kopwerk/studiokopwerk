# Studio Kopwerk

> Helpt iedereen om mooiere en fijnere ervaringen te maken, op welk vlak dan ook. Zien wat wérkt.

Studio Kopwerk is een verfijnde, doordachte landingspagina met een rustige esthetiek, royale witruimte en subtiele interacties.

---

## 🚀 Tech Stack

- **Framework:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite 6](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) + Custom Design System (`Syne` & `Plus Jakarta Sans` typography)
- **Animations:** [Motion](https://motion.dev/) (`motion/react`)
- **UI Primitives & Icons:** [Base UI](https://base-ui.com/) (`@base-ui/react`) + [Lucide Icons](https://lucide.dev/)

---

## ✨ Key Features & UX Highlights

- **High-Contrast & Dark Mode Support:** Seamless theme toggling with support for system preferences and persistent user state (`useTheme` hook).
- **Interactive Micro-Interactions:** Custom magnetic button wrappers, rolling text hover animations, and smooth physics-based transitions.
- **Interactive Contact Modal:** Accessible dialog overlay (`ContactCard`) with dynamic email copy functionality and direct mailto actions.
- **Keyboard Navigation & Accessibility:** Keyboard shortcuts (`C` to toggle contact modal, `T` to toggle theme, `Esc` to close modal).
- **Performance Optimized:** Lazy-loaded modal dialogs and lightweight canvas-rendered abstract background animation.

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

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Lint & Typecheck:**
   ```bash
   npm run lint
   ```

---

## 📁 Project Structure

```
studio-kopwerk/
├── src/
│   ├── components/
│   │   ├── layout/       # Header, Footer
│   │   ├── ui/           # Typography, Button, Dialog, MagneticWrapper
│   │   ├── AbstractBackground.tsx
│   │   ├── ContactCard.tsx
│   │   └── ThemeToggle.tsx
│   ├── hooks/            # Custom hooks (e.g. useTheme)
│   ├── lib/              # Utility functions (cn)
│   ├── App.tsx           # Main application entry component
│   ├── index.css         # Design system CSS variables & Tailwind imports
│   ├── main.tsx          # React application root
│   └── types.ts          # TypeScript type definitions
├── AGENTS.md             # Design system & brand guidelines
└── README.md             # Project documentation
```
