# pattern-nextjs-webfonts

> License-safe web font loading in Next.js using `next/font/local`.

This repository demonstrates the correct pattern for loading self-hosted Monotype fonts in a Next.js 14 application. Fonts are processed at **build time** from paths in your repo and **served by your Next app** (end users’ browsers still receive font data for rendering — that is normal for the web). The important distinction is **self-hosted delivery under your web font license**, not third-party CDN fetches outside your infrastructure control.

## What this pattern demonstrates

- Loading fonts via `next/font/local` rather than a CDN import or `<link>` tag
- Excluding font files from version control while documenting where they must be placed
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

1. Obtain font files under a valid Monotype web font license
2. Place `.woff2` files in `public/fonts/` — this directory is gitignored; do not commit font files
3. Update the `src` path in `app/page.tsx` to match your font filename
4. Install and run:

```bash
npm install
npm run dev
```

`npm install` writes a new `package-lock.json` if one is not present — commit it if your team relies on a lockfile for reproducible installs.

## Font files

Font files are intentionally excluded from this repository via `.gitignore`. You must supply your own files under a valid Monotype web font license. See `public/fonts/placeholder.txt` for placement instructions.

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

Sample application **code** in this repository is licensed under the [MIT License](LICENSE). Font files are **not** included. Canonical assertion text in [reference-fonts-implementation](https://github.com/Monotype/reference-fonts-implementation) remains subject to that repository’s terms.
