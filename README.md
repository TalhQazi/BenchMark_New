# Benchmark Justice™ — Web Edition

The website is the Benchmark Justice mobile app built for the browser. It uses the
same screens and the same live data sources (CourtListener and Congress.gov), so
nothing on the site is hardcoded and there is only one codebase to maintain.

## Build

From this folder:

```bash
npm run build      # outputs the site to Website/dist
npm run start      # serves Website/dist at http://localhost:3000
```

`npm run build` runs `expo export --platform web` from the project root, so it
uses the API keys in the root `.env` file (see `.env.example`). Rebuild after
changing `.env`.

## Deploy

`Website/dist` is a static site. `vercel.json` and `netlify.toml` are included so
page reloads work on any route:

- **Vercel:** `vercel deploy` from `Website/` after `npm run build`
- **Netlify:** `netlify deploy --dir=dist`
- **Any static host:** upload `dist/` and send unknown paths to `index.html`

## Notes

- The API keys are compiled into the site, so anyone can read them from the
  browser. Use dedicated keys for the website.
- The previous hand-written static site (with hardcoded sample data) is archived
  in `legacy/` for reference. It is not built or deployed.
