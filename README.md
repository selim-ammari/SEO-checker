# DevSEO

Technical SEO checker for developers. Analyzes a single public URL and returns an **SEO Health Score / 100** with issues, recommendations, and optional Next.js App Router code examples.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Cheerio (HTML parsing)
- Zod (input validation)
- Vitest (unit tests)

No database, auth, or paid APIs in V1.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Optional: set `NEXT_PUBLIC_SITE_URL` for canonical/OG/sitemap URLs in production.

## Scripts

- `npm run dev` — local development
- `npm run build` — production build
- `npm run start` — run production server
- `npm test` — unit tests
- `npm run lint` — ESLint

## API

`POST /api/analyze`

```json
{ "url": "https://example.com" }
```

Returns score, grade, checks, and summary. Protected against obvious SSRF/abuse (URL validation, private IP blocking, timeout, response size limit, redirect re-validation, basic rate limiting).
