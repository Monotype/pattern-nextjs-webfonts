# pattern-nextjs-webfonts

> License-safe web font loading in Next.js using `next/font/local`.

This repository demonstrates the correct pattern for loading self-hosted Monotype fonts in a Next.js 14 application. Fonts are processed at **build time** from paths in your repo and **served by your Next app** (end users’ browsers still receive font data for rendering — that is normal for the web). The important distinction is **self-hosted delivery under your web font license**, not third-party CDN fetches outside your infrastructure control.

## What this pattern demonstrates

- Loading fonts via `next/font/local` rather than a CDN import or `<link>` tag
- A **subset** `.woff2` checked in under `public/fonts/` so `next build` and CI succeed without secrets (replace with your own licensed files for forks or private use)
- Applying fonts via CSS class names for consistent usage across components

## Why `next/font/local` is the license-safe approach

Importing fonts from an external CDN causes font files to be fetched from a third-party server at runtime, outside your licensing and infrastructure control. `next/font/local` reads font files from **your** project at build time and emits optimized assets served **from your deployment**, which aligns with **self-hosted** web font licensing expectations instead of delegating delivery to another host you do not control.

## Canonical assertions implemented

This pattern implements the following assertions from [reference-fonts-implementation](https://github.com/Monotype/reference-fonts-implementation):

- `pc-008` — self-hosting web fonts requires a web font license; desktop licenses do not permit web delivery
- `bd-001` — self-hosted fonts integrate into CI/CD pipelines as versioned static assets
- `pc-010` — cross-origin font delivery requires CORS configuration

In this minimal app, font assets are served **same-origin** with the page, so you typically do not hit cross-origin `@font-face` blocking. **`pc-010` still applies** if you move fonts to another **origin** (for example a separate CDN or static host): you must send correct `Access-Control-Allow-Origin` (and related) headers on font responses.

## Usage

1. Obtain font files under a valid Monotype web font license (this repo ships a **small subset** for build/CI; use your own files in forks or production)
2. Place `.woff2` files in `public/fonts/` and update the `src` path in `app/layout.tsx` (`localFont` call) to match. Additional font names remain **gitignored** unless you force-add (`git add -f`) or add a `!` exception in `.gitignore`
3. Install and run:

```bash
npm install
npm run dev
```

This repository includes a committed **`package-lock.json`**. After cloning, use **`npm ci`** when you want installs to match CI and the lockfile exactly; use **`npm install`** when you intentionally add or upgrade dependencies (then commit the updated lockfile).

## Font files

This repository includes **`public/fonts/MyFont.woff2`**, a heavily subsetted version of Gotham Regular, so **`npm run build`** and **GitHub Actions** work out of the box. It demonstrates self-hosting only; **redistribution rights for that file are not granted to you**—use fonts you are licensed to deploy. For your own project, replace the file and the `localFont({ src: ... })` path in `app/layout.tsx`. See `public/fonts/placeholder.txt` for placement notes.

To commit a different binary despite `*.woff2` in `.gitignore`, use **`git add -f public/fonts/YourFile.woff2`** once, or add a **`!public/fonts/YourFile.woff2`** line after the `*.woff2` rule.

## Requirements

- Node.js 18+
- Next.js 14.2.35+

## Related patterns

- [pattern-react-webfonts](https://github.com/Monotype/pattern-react-webfonts) — React + Vite, CSS variable delivery
- [pattern-saas-fonts-embedding](https://github.com/Monotype/pattern-saas-fonts-embedding) — server-controlled font endpoints
- [pattern-cicd-fonts-usage](https://github.com/Monotype/pattern-cicd-fonts-usage) — CI/CD pipeline font management
- [pattern-variable-fonts-usage](https://github.com/Monotype/pattern-variable-fonts-usage) — variable font axes via CSS

## Support

Use GitHub Discussions (Q&A category) for questions about this pattern.

## License

Sample application **code** in this repository is licensed under the [MIT License](LICENSE). The **subset font file** in `public/fonts/` is included **only** as a build/CI demonstration asset; it is **not** licensed to third parties for separate redistribution—use fonts you have rights to ship. Canonical assertion text in [reference-fonts-implementation](https://github.com/Monotype/reference-fonts-implementation) remains subject to that repository’s terms.
