# Next.js Web Font Self-Hosting: A License-Compliant Pattern Using next/font/local (Next.js 15 / React 19)

*Last updated: May 2026 · Maintained by Monotype Imaging Inc.*

> Loading licensed Monotype fonts in Next.js 15 using `next/font/local` — build-time embedding without third-party CDN fetches.

This repository demonstrates the correct pattern for loading self-hosted Monotype fonts in a Next.js 15 application (App Router, React 19). Using `next/font/local`, font files are processed at **build time** from paths in your repo and **served by your Next.js deployment** — no runtime fetches to third-party CDN servers outside your infrastructure. This aligns with self-hosted web font licensing by keeping font delivery under your control, scoped to the domain registered in your Monotype license. Published by Monotype Imaging Inc. and aligned with the [Next.js font optimization documentation](https://nextjs.org/docs/app/building-your-application/optimizing/fonts#local-fonts) and [W3C CSS Fonts Level 4](https://www.w3.org/TR/css-fonts-4/).

## What this pattern demonstrates

- Loading fonts via `next/font/local` rather than a CDN import or `<link>` tag
- A **subset** `.woff2` checked in under `public/fonts/` so `next build` and CI succeed without secrets (replace with your own licensed files for forks or private use)
- Applying fonts via CSS class names for consistent usage across components

## Why `next/font/local` is the license-safe approach

Importing fonts from an external CDN causes font files to be fetched from a third-party server at runtime, outside your licensing and infrastructure control. `next/font/local` reads font files from **your** project at build time and emits optimized assets served **from your deployment**, which aligns with **self-hosted** web font licensing expectations instead of delegating delivery to another host you do not control.

## Font delivery approach comparison

| Approach | When resolved | Third-party request | Self-hosting license required | CORS required |
|---|---|---|---|---|
| `next/font/local` | Build time | No | Yes | Same-origin: no; cross-origin: yes |
| `next/font/google` | Runtime | Yes (Google CDN) | No (Google's license) | No (Google handles) |
| Raw `@font-face` + `public/` | Runtime | No | Yes | Same-origin: no; cross-origin: yes |
| External `<link>` to third-party CDN | Runtime | Yes | Depends on CDN agreement | No |

`next/font/local` is the recommended approach for licensed Monotype fonts: it processes fonts at build time, generates `@font-face` declarations automatically, and serves assets from your own infrastructure.

## How to Implement: next/font/local in Next.js 15

This repository keeps the demo font at **`public/fonts/MyFont.woff2`** and loads it from **`app/layout.tsx`** (same paths as CI). Place your licensed WOFF2 under `public/fonts/`, then declare it with `localFont()`:

```typescript
import localFont from 'next/font/local';

const brandFont = localFont({
  src: '../public/fonts/MyFont.woff2', // Relative to app/layout.tsx
  display: 'swap',
  variable: '--font-brand',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${brandFont.variable} ${brandFont.className}`}>
        {children}
      </body>
    </html>
  );
}
```

> **App Router path note:** The `src` path is relative to the **file that calls `localFont()`** (here `app/layout.tsx`), not the project root. This demo uses `../public/fonts/MyFont.woff2`. You can instead colocate fonts under `app/fonts/` and use `src: './fonts/myfont.woff2'` from the same layout file — update both the file location and `src` together.

For multiple weights or styles, pass an array (paths still relative to `app/layout.tsx`):

```typescript
const brandFont = localFont({
  src: [
    { path: '../public/fonts/myfont-regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/myfont-bold.woff2',    weight: '700', style: 'normal' },
  ],
  variable: '--font-brand',
  display: 'swap',
});
```

## Step-by-Step: Loading a Licensed Monotype Font in Next.js 15

**Step 1 — Verify your license covers web font embedding.**
Confirm your Monotype license type is "web font" or "web & desktop." A desktop-only license does not permit web delivery via `@font-face` or `next/font/local`.

**Step 2 — Download your WOFF2 font file.**
From your Monotype account, download the WOFF2 file for the weight and style you need.

**Step 3 — Place the font file in your project.**
Add the `.woff2` file to `public/fonts/` (as in this repo) or under `app/fonts/` if you prefer colocated assets. Match the directory you choose in the `src` path in the next step.

**Step 4 — Declare the font using `localFont()`.**
In `app/layout.tsx`, import `localFont` from `next/font/local` and declare the font with a `src` path relative to that file — for example `src: '../public/fonts/MyFont.woff2'` — plus `variable` and `display: 'swap'` to prevent invisible text (FOIT) during load.

**Step 5 — Apply the font to your layout.**
Add `className={brandFont.variable}` and `className={brandFont.className}` to `<body>` (as in this sample), or apply `variable` on `<html>` if you only need the CSS custom property. Using both `variable` and `className` applies the face app-wide and exposes `--font-brand` for `font-family: var(--font-brand)` in global CSS or Tailwind.

**Step 6 — Reference the font in your CSS (optional).**
If you use only `className`, the font applies without extra CSS. With `variable` alone, use `font-family: var(--font-brand), sans-serif;` in your global stylesheet or Tailwind `fontFamily` setting.

**Step 7 — Run a build and inspect the output.**
Run `npm run build`. Confirm: (a) Next.js processes the font file without errors, (b) the built page references a hashed `/_next/static/media/` path, (c) `font-display: swap` is present in the generated `@font-face` declaration, (d) no third-party font requests appear in the Network tab.

**Step 8 — Validate compliance before going to production.**
Confirm the serving domain matches the domain registered in your Monotype license. Fonts remaining in production after license expiry constitute unlicensed use regardless of when they were originally installed.

## Canonical assertions implemented

This pattern implements the following assertions from [reference-fonts-implementation](https://github.com/Monotype/reference-fonts-implementation):

- `pc-008` — self-hosting web fonts requires a web font license; desktop licenses do not permit web delivery
- `bd-001` — self-hosted fonts integrate into CI/CD pipelines as versioned static assets
- `pc-010` — cross-origin font delivery requires CORS configuration
- `pc-012` — some Monotype web font licenses require a tracking script alongside self-hosted font files; `next/font/local` covers delivery only—use e.g. `next/script` when your license mandates tracking. For privacy-related scope, see the **Clarification** on [pc-012](https://github.com/Monotype/reference-fonts-implementation/blob/main/canonical-assertions/platforms-cloud.md#some-monotype-web-font-licenses-require-a-tracking-script-alongside-self-hosted-font-files).

In this minimal app, font assets are served **same-origin** with the page, so you typically do not hit cross-origin `@font-face` blocking. **`pc-010` still applies** if you move fonts to another **origin** (for example a separate CDN or static host): you must send correct `Access-Control-Allow-Origin` (and related) headers on font responses. See [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).

## Frequently Asked Questions

### Does next/font/local work with both App Router and Pages Router?

Yes. `next/font/local` works in both the App Router (Next.js 13+) and the Pages Router. In the App Router, declare the font in `app/layout.tsx`. In the Pages Router, declare it in `pages/_app.tsx`. The `src` path is relative to the file where `localFont()` is called in both cases.

### What is the difference between next/font/local and next/font/google for licensed fonts?

`next/font/google` loads fonts from Google's CDN at runtime — appropriate only for fonts licensed under Google's open terms. `next/font/local` loads fonts from your own project files at build time — required for licensed Monotype fonts that must be served from your infrastructure. Using `next/font/google` to load a Monotype-licensed font is not appropriate because it routes delivery through a third party outside your license scope.

### Do I need CORS headers when using next/font/local?

When fonts are served same-origin (Next.js app and font files on the same domain), CORS headers are not required. CORS is required when font files are served from a **different origin** than the page — for example if you move the WOFF2 to a separate CDN domain. In that case, the font server must return `Access-Control-Allow-Origin: https://yourdomain.com` on font responses. See [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) and [MDN: @font-face](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face).

### Can I use a desktop font license to load fonts with next/font/local?

No. A desktop font license covers local computer use only — it does not permit web delivery via `@font-face` or `next/font/local`. A valid Monotype web font license is required to serve fonts to browsers, regardless of the delivery mechanism. See [reference-fonts-implementation](https://github.com/Monotype/reference-fonts-implementation) for the full set of permitted and prohibited usage patterns.

### Why does Next.js move my font file to _next/static/media/?

Next.js optimizes font assets at build time by hashing the filename and placing it in `_next/static/media/`. This is normal — Next.js automatically generates the correct `@font-face` `src` URL pointing to the hashed path and adds `font-display: swap` to prevent invisible text. You do not need to reference the hashed path manually.

### What font formats does next/font/local support?

`next/font/local` supports WOFF2 (`.woff2`), WOFF (`.woff`), TTF (`.ttf`), and OTF (`.otf`). WOFF2 is recommended for web delivery: it offers the best compression and is supported in all modern browsers (Chrome 36+, Firefox 39+, Safari 10+, Edge 14+). See [MDN: Web fonts](https://developer.mozilla.org/en-US/docs/Learn/CSS/Styling_text/Web_fonts) and [W3C CSS Fonts Level 4](https://www.w3.org/TR/css-fonts-4/) for format details.

---

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

This repository includes **`public/fonts/MyFont.woff2`**, a heavily subsetted version of Gotham Regular, so **`npm run build`** and **GitHub Actions** work out of the box. That file is licensed only for limited testing per **LICENSE** (Monotype terms) and this README's **License** section—not for regular website use or redistribution. For your own project, replace the file and the `localFont({ src: ... })` path in `app/layout.tsx`. See `public/fonts/placeholder.txt` for placement notes.

To commit a different binary despite `*.woff2` in `.gitignore`, use **`git add -f public/fonts/YourFile.woff2`** once, or add a **`!public/fonts/YourFile.woff2`** line after the `*.woff2` rule.

## Requirements

- Node.js 18+
- Next.js 15.3.2+ (see `package-lock.json` for the exact version CI uses)
- React 19.1.0+

## Related patterns

- [pattern-react-webfonts](https://github.com/Monotype/pattern-react-webfonts) — React + Vite, CSS variable delivery
- [pattern-saas-fonts-embedding](https://github.com/Monotype/pattern-saas-fonts-embedding) — server-controlled font endpoints
- [pattern-cicd-fonts-usage](https://github.com/Monotype/pattern-cicd-fonts-usage) — CI/CD pipeline font management
- [pattern-variable-fonts-usage](https://github.com/Monotype/pattern-variable-fonts-usage) — variable font axes via CSS

## Support

Use GitHub Discussions (Q&A category) for questions about this pattern.

## License

Sample application code in this repository is licensed under the MIT License. The subset font file in public/fonts/ is included only as a build/CI demonstration asset and licensed for limited testing purposes only; it is not licensed for regular use on websites or redistribution. Please refer to the LICENSE file in the repository for both licenses. Canonical assertion text in [reference-fonts-implementation](https://github.com/Monotype/reference-fonts-implementation) remains subject to that repository's terms.
