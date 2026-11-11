# Benchmark Justice™ — Web Edition

The official web version of **Benchmark Justice™ · Public Records & Judicial Intelligence**.

Built with the exact design system, tokens, typography, and color palette of the mobile application.

---

## Features
- **Design Tokens & Palette:** Deep Navy (`#050A16` – `#253D66`), Judicial Gold/Brass (`#C2A15A`, `#D2B676`), Parchment, and semantic accents (Emerald, Crimson, Amber, Sapphire, Plum, Teal).
- **Typography:** Google Fonts *Playfair Display* (Serif) & *Inter* (Sans-serif), and *JetBrains Mono*.
- **Modern Theme System:** Full light/dark mode support adhering to Modern Web Guidance:
  - Default follows system preference or user override.
  - Smooth transitions without flash of unstyled content (FOUC).
  - Modern CSS `color-scheme: light dark` and `light-dark()` variables.
- **Universal Search Engine:** Real-time search across judges, lawyers, prosecutors, cases, federal dockets, and members of Congress with category filters.
- **Coverage Counters:** Dynamic statistics for 12,450+ opinions, 4.89M+ federal dockets, 3,420+ judges, and 384 active courts.
- **Interactive Filings Trend Chart:** Responsive SVG area chart tracking filings and opinions across decades with hover data tooltips.
- **Live Intelligence Stream:** Real-time updates matching CourtListener slip opinions and docket entries.
- **Judicial & Case Dossier Modals:**
  - Complete judge profiles with confirmation history, nominating presidents, education, tenure, and precedential opinions.
  - Case & docket detail with summary, full opinion text viewer, counsel of record, and one-click citation copying.
- **Research Dossier (Bookmarks):** Save judges and cases locally to your personal research dossier.

---

## How to Run

### Option 1: Direct File Open
You can open `index.html` directly in any modern browser (Chrome, Safari, Edge, Firefox).

### Option 2: Local Web Server
From the `Website/` folder:
```bash
cd Website
npx serve -l 3000 .
```
Or with npm:
```bash
cd Website
npm run dev
```
Then visit: [http://localhost:3000](http://localhost:3000)

---

## Deployment
This web application is completely self-contained with standard static assets (HTML/CSS/JS) and can be deployed directly to:
- **Vercel**: `vercel deploy`
- **Netlify**: `netlify deploy --dir=.`
- **Firebase Hosting**: `firebase deploy --only hosting`
- **GitHub Pages**

