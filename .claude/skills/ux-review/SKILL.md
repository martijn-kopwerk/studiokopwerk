---
name: ux-review
description: Kritische UX-review van de hele Studio Kopwerk-site, getoetst aan het design system en de positionering, met een plan in volgorde van effect. Gebruik bij "doe een UX-review", "review de site", "hoe kan de site beter" of /ux-review.
---

# UX-review Studio Kopwerk

Een herhaalbare, kritische review van de site zoals die nu is, vergeleken met de vorige review. Schrijf in het Nederlands, in de merkstem. Wees kritisch: benoem wat aanvragen kost, niet alleen wat mooi is.

## 1. Bronnen lezen

De twee referenties waaraan je toetst:

- **Design system**: https://claude.ai/artifact/8m9zeziNGjkdFoJCX2w3Vi. Het systeem staat in bestanden. Lees ze met Artifact `read` en `paths`:
  - `project/README.md` (merkboek: positionering, principes, kleur, typografie, layout, motion, logo, beeld, iconen), `project/voice.md`, `project/ai-first.md` en `project/tokens.json`.
  - De componentrichtlijnen die de site raken: `project/components/<Naam>/README.md` voor Hero, Nav, Footer, CapsuleButton, AmberDot, Logo, Eyebrow, Timeline, Icon, ImageFrame, Insight, AiNote, StatusBadge, GlassCard, Tag. Kijk met een `files`-listing of er componenten bij zijn gekomen.
- **Positionering** (Claude Docs): https://claude.ai/artifact/SVqcEdMhQiUHfowHFPP8Tm. Laad eerst de docs-skill, `read` het project en daarna de tab.

Verder:

- `AGENTS.md` en `BRAND_GUIDE.md` in de repo. **Design system first**: waar de repo of de site afwijkt van het design system, wint het design system. Elke afwijking is een bevinding: noem de regel, de waarde in het design system en wat de site nu doet. Een bewuste afwijking van de website hoort in het design system zelf te staan; staat die er niet, dan is het een afwijking.
- De **vorige review**: het nieuwste bestand in `docs/ux-review/`. Neem de nummers over, zodat je per bevinding kunt zeggen: opgelost, deels, open, niet meer van toepassing.
- Extra bronnen alleen als de gebruiker ze noemt.
- Alle pagina's via `src/routes.tsx`, het frame (`src/App.tsx`, header, footer, contactkaart) en de inhoud in `src/content/werk/`.

## 2. De site echt bekijken

- Start de dev-server met `preview_start` en een configuratie uit `.claude/launch.json`. Is de poort al bezet door een andere sessie (die kan een andere branch tonen), voeg dan een configuratie toe op een vrije poort (bijv. `kopwerk-review`: `npx vite --port 3002 --strictPort`), zodat je zeker deze checkout bekijkt.
- Elke route plus de 404 en de contactkaart, op **1440×900** en **375×812**, in **licht en donker**. Scroll elke pagina helemaal door en let op de amber dot.
- Reset de viewport daarna (`resize_window` preset `desktop`).

## 3. Toetsen

Per pagina en voor het geheel:

1. **Positionering**: staan visie, missie, belofte, hero-regel en "AI maakt, jij beslist" er zoals in de positionering (het design system zegt: gebruik ze zoals geschreven)? Wat ziet een nieuwe bezoeker in 5 seconden?
2. **Vertrouwen**: is er een mens, bewijs (opdrachten), duidelijkheid over wat je krijgt en wat de eerste stap is?
3. **Route**: is er altijd een volgende stap voor wie nog niet klaar is voor "Daag ons uit"?
4. **Design system, onderdeel voor onderdeel**: thema per medium, kleurtokens, amber één à twee keer per beeld, typografie (h1/h2/eyebrow/lead: grootte, gewicht, tracking, hoofdletters), witruimte tussen secties, radius (alleen 2xl en full), focusstijl, motion-regels, logo en lock-up, iconen, beeld. Vergelijk ook met de componenten (Hero, Nav, Footer, Timeline, CapsuleButton, AiNote).
5. **Stem** (`voice.md`): koppen zijn conclusies, alinea's van één tot vier zinnen, de redeneerlijn, geen jargon, niets verzonnen.
6. **Ritme en beweging**: leest het als een verhaal of als lopende tekst? Waar kan beweging binnen de motion-regels van het design system iets uitleggen?
7. **Toegankelijkheid**: focus, contrast, sneltoetsen (WCAG 2.1.4), reduced motion, werkt zonder JS (prerender).
8. **Telefoon**: lengte van de pagina, de K-stam en de dot, tikdoelen.

## 4. Opleveren

- Schrijf `docs/ux-review/JJJJ-MM-DD.md` met dezelfde opbouw als de vorige: bronnen met versie, samenvatting, de stand van de vorige review, bevindingen in tabellen (nummer, ernst H/M/L, bron van de regel), een aparte tabel "Repo wijkt af van design system", wat goed is, het plan in stappen op volgorde van effect, en een kopje "Voor de volgende review".
- Verzin geen klanten, citaten, cijfers of termijnen. Wat de gebruiker moet aanleveren staat er als `[placeholder]` met "Nodig van jou".
- Geef in de chat een korte samenvatting (de 3–5 belangrijkste punten en de eerste stap) en een link naar het bestand. Maak geen code-wijzigingen tenzij daarom gevraagd wordt. Voorgestelde wijzigingen gaan via een branch en PR, nooit direct naar `main`.
