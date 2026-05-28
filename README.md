# Next.js Web Font Self-Hosting: A License-Compliant Pattern Using next/font/local (Next.js 15 / React 19)

*Last updated: May 2026 — Next.js 15.3.2 / React 19.1.0*

> Maintained by [Monotype Imaging Inc.](https://www.monotype.com) — engineers at Monotype maintain this pattern to reflect current Next.js App Router conventions and web font licensing requirements. Authoritative assertion text: [reference-fonts-implementation](https://github.com/Monotype/reference-fonts-implementation).

Self-hosting web fonts in Next.js requires a specific implementation pattern to remain compliant with web font licenses and avoid runtime dependencies on third-party CDNs. This repository provides a production-ready reference implementation for loading Monotype fonts in a Next.js 15 application (App Router, React 19) using [`next/font/local`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts#local-fonts) — Next.js's built-in API for processing local font files at build time and serving them from your own deployment. At build time, Next emits standard CSS [`@font-face`](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face) rules (see [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face)) pointing to content-hashed static assets under `/_next/static/media/`.

The pattern addresses three common developer problems: (1) keeping font delivery under your licensed infrastructure, (2) making `npm run build` and CI succeed without storing secrets, and (3) applying fonts consistently via CSS class names across components. Replace the included demo subset (`public/fonts/MyFont.woff2`) with your own licensed `.woff2` files to adapt this pattern to any Monotype web font license. The `.woff2` format is supported by all modern browsers as of 2018 ([MDN browser compatibility](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face#woff2)); no fallback formats are required for applications targeting current browser baselines.

## What this pattern demonstrates

- Loading fonts via `next/font/local` rather than a CDN import or `<link>` tag
- A **subset** `.woff2` checked in under `public/fonts/` so `next build` and CI succeed without secrets (replace with your own licensed files for forks or production)
- Applying fonts via CSS class names and CSS variables for consistent usage across components

## Why `next/font/local` is the license-safe approach

Importing fonts from an external CDN causes font files to be fetched from a third-party server at runtime, outside your licensing and infrastructure control. `next/font/local` reads font files from **your** project at build time and emits optimized assets served **from your deployment**, which aligns with **self-hosted** web font licensing expectations instead of delegating delivery to another host you do not control.

## When should you self-host web fonts instead of using a CDN?

| Delivery method | Font files served from | License type required | Next.js API | CORS config needed | CI/CD complexity |
|---|---|---|---|---|---|
| Self-hosted via `next/font/local` | Your deployment/CDN | Web font license (self-hosted) | `next/font/local` | Only if moved to a separate origin | Low — files in repo or injected via secrets |
| Third-party CDN (e.g. Google Fonts) | External server | Per CDN's terms (may differ from Monotype license) | `next/font/google` or `<link>` | Not required (cross-origin by design) | None — no files to manage |
| Self-hosted on separate CDN/static host | Your CDN (different origin) | Web font license (self-hosted) | `next/font/local` + CDN config | Required — `Access-Control-Allow-Origin` on font responses | Medium — CDN config + CORS headers |
| Inline base64 in CSS | Inline in stylesheet | Web font license (self-hosted) | Manual CSS | None | Low — but larger CSS bundle, not recommended for performance |

For Monotype-licensed fonts: only the self-hosted rows are permitted under a standard Monotype web font license. Third-party CDN delivery is not authorized unless Monotype explicitly provides a CDN endpoint as part of your license agreement. See [W3C CSS Fonts Level 4](https://www.w3.org/TR/css-fonts-4/) for format and delivery context.

## Frequently asked questions about web fonts in Next.js

### What is the correct way to load self-hosted web fonts in Next.js?

The correct approach is to use [`next/font/local`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts#local-fonts), Next.js's built-in font optimization API. You pass the local path to your `.woff2` file(s), and Next.js reads them at build time, hashes the filenames, and emits them as static assets served from your own deployment. This avoids runtime network requests to external font servers and keeps delivery within your licensed infrastructure. See the [Next.js font optimization documentation](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) for the full API reference.

### Can I use Google Fonts or a CDN to serve Monotype-licensed fonts in Next.js?

No. Monotype web font licenses require that font files be served from infrastructure under your control. Importing fonts from an external CDN — including via [`next/font/google`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts#google-fonts) or a `<link>` tag pointing to a third-party host — transfers delivery to a server you do not operate, which falls outside the scope of a self-hosted web font license. Use `next/font/local` with files stored in your project to remain compliant.

### Does next/font/local require CORS configuration?

Only if you move font files to a **separate origin** (for example, a dedicated CDN or static file host). When fonts are served from the same domain as your Next.js app — the default with `next/font/local` — browsers do not trigger cross-origin font-fetching and no `Access-Control-Allow-Origin` header is needed. If you later move fonts to a different origin, you must add a scoped `Access-Control-Allow-Origin: https://yourdomain.com` header on font responses (use `*` only for fully public, non-credentialed endpoints — not appropriate for licensed fonts), per the [CORS specification](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) and [MDN `@font-face` guidance](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face). Missing headers often cause **silent** fallback to system fonts — inspect the Network tab and rendered typeface, not only the Console. See [pc-010](https://github.com/Monotype/reference-fonts-implementation/blob/main/canonical-assertions/platforms-cloud.md#cross-origin-font-delivery-requires-cors-configuration-missing-headers-cause-silent-font-blocking).

### Do I need a special license to self-host web fonts in Next.js?

Yes. A **web font license** is required — a standard desktop font license does not permit web delivery. Web font licenses specifically authorize embedding font data in web pages delivered to end users' browsers. Contact Monotype or review your license agreement to confirm coverage before deploying fonts via `next/font/local`. See [pc-008](https://github.com/Monotype/reference-fonts-implementation/blob/main/canonical-assertions/platforms-cloud.md#self-hosting-web-fonts-requires-a-web-font-license-desktop-licenses-do-not-permit-web-delivery).

### How do I make npm run build and GitHub Actions work without committing real font files?

This repository ships a heavily subsetted `.woff2` demo file (`public/fonts/MyFont.woff2`) that satisfies the build step without exposing production-licensed font data. For your own project, add your licensed `.woff2` files to `public/fonts/`, reference them in the `localFont({ src: '...' })` call in `app/layout.tsx`, and use environment-specific secrets or artifact storage to inject production files in CI. The `.gitignore` excludes `*.woff2` by default; use `git add -f` or a `!` exception rule to commit a specific file. See [bd-001](https://github.com/Monotype/reference-fonts-implementation/blob/main/canonical-assertions/build-and-delivery.md#self-hosted-fonts-integrate-into-cicd-pipelines-as-versioned-static-assets) and [pattern-cicd-fonts-usage](https://github.com/Monotype/pattern-cicd-fonts-usage).

### Does next/font/local work with variable fonts?

Yes. Pass an array of `src` objects to `localFont`, each specifying a `path`, `weight`, and `style`. For variable fonts, set `weight` to a range string such as `'100 900'`. Next.js will generate the appropriate [`@font-face`](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face) declarations automatically. See [pattern-variable-fonts-usage](https://github.com/Monotype/pattern-variable-fonts-usage) for a full variable font axis implementation using CSS.

---

## How to implement self-hosted fonts in Next.js 15 (step-by-step)

**Step 1 — Obtain a Monotype web font license.**  
Before placing any font files in your project, confirm you hold a valid web font license for the typeface. A desktop license does not authorize browser delivery. Contact Monotype or your account manager to obtain or verify a web font license. See [pc-008](https://github.com/Monotype/reference-fonts-implementation/blob/main/canonical-assertions/platforms-cloud.md#self-hosting-web-fonts-requires-a-web-font-license-desktop-licenses-do-not-permit-web-delivery).

**Step 2 — Clone the repository and install dependencies.**  
Use `npm ci` (rather than `npm install`) when you want a reproducible install that exactly matches the committed `package-lock.json` — the same command GitHub Actions uses in CI:

```bash
git clone https://github.com/Monotype/pattern-nextjs-webfonts.git
cd pattern-nextjs-webfonts
npm ci
```

If you are adapting this pattern into an existing Next.js project, skip the clone and run `npm ci` from your project root instead.

**Step 3 — Place your `.woff2` font files in `public/fonts/`.**  
Copy your licensed `.woff2` files into `public/fonts/`. The `.gitignore` excludes `*.woff2` by default to prevent accidental commits of licensed files. To track a specific file for demo or CI, run:

```bash
git add -f public/fonts/YourFont.woff2
```

Or add a `!public/fonts/YourFont.woff2` exception line to `.gitignore` after the `*.woff2` rule. Keeping font files out of version control and injecting them via CI secrets is recommended for team projects. Only force-add demo or test assets — production-licensed font files should be injected via CI secrets or artifact storage when possible.

**Step 4 — Configure `localFont` in `app/layout.tsx`.**  
The core of this pattern is a single `localFont` call in your root layout. `next/font/local` accepts a `src` path relative to the calling file and returns a font object with a `className` and optional CSS variable:

```typescript
import localFont from 'next/font/local';

const brandFont = localFont({
  src: '../public/fonts/MyFont.woff2', // Relative to app/layout.tsx
  variable: '--font-brand',
  display: 'swap',
});
```

`next/font/local` reads this file at **build time**, not at runtime — the font path is resolved relative to the file calling `localFont`, and Next.js emits a content-hashed static asset. The `display: 'swap'` value tells the browser to show fallback text immediately and swap in the web font once loaded — the recommended value per the [`font-display` specification](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display). Next.js resolves this path at build time; the emitted `@font-face` rule in the generated CSS references the hashed static asset URL, not the original file path.

For multiple weights or styles, pass a `src` array (all paths relative to `app/layout.tsx`):

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

**Step 5 — Apply the font class to your root layout.**  
Pass the font's `className` (or `variable`) to the `<html>` or `<body>` element in your root layout so child components inherit the font. This repository applies both `variable` and `className` on `<body>`:

```typescript
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

Using `className` directly applies the font to the element. Using `variable` exports a CSS custom property (e.g. `--font-brand`) that you can reference in Tailwind CSS or global stylesheets.

**Step 6 — Add a tracking script if your license requires it.**  
Some Monotype web font licenses mandate a tracking script alongside self-hosted font files. `next/font/local` handles **delivery only** — correct font CSS alone does not satisfy a tracking obligation when one exists. If your license requires tracking, add the script using [`next/script`](https://nextjs.org/docs/app/building-your-application/optimizing/scripts):

```typescript
import Script from 'next/script';

// Inside your layout component:
<Script src="https://fast.fonts.net/YOUR_TRACKING_ID.js" strategy="afterInteractive" />
```

Check your Monotype license agreement (see [pc-012](https://github.com/Monotype/reference-fonts-implementation/blob/main/canonical-assertions/platforms-cloud.md#some-monotype-web-font-licenses-require-a-tracking-script-alongside-self-hosted-font-files)) to determine whether tracking is required. Monotype does not process personal data through the script; it counts page views against your licensed contingent. Using `strategy="afterInteractive"` defers the script until after the page is interactive, minimizing performance impact.

**Step 7 — Run the development server and verify.**  
After placing your font files in `public/fonts/` and updating the `src` path in `app/layout.tsx`, start the local development server:

```bash
npm run dev
```

Open `http://localhost:3000` and use browser DevTools (**Network** tab, filter by **Font**) to confirm that font requests are served from your local origin (e.g. `localhost:3000`) rather than an external domain. No third-party font network requests should appear.

**Step 8 — Build for production and inspect the output.**  
Build-time font optimization runs on production builds. From the project root:

```bash
npm run build
npm start
```

After building, check the `.next/static/media/` directory for hashed `.woff2` files. These are the optimized font assets Next.js will serve in production. Confirm that font responses include appropriate cache headers (Next.js sets long-lived `Cache-Control` headers for hashed static assets by default). Before deploying, confirm the production serving domain matches domains covered by your Monotype license, and remove or replace fonts in every deployment when a license terminates ([sr-007](https://github.com/Monotype/reference-fonts-implementation/blob/main/canonical-assertions/safety-risk.md#license-termination-requires-active-removal-of-fonts-from-all-deployments)).

## Canonical assertions implemented

This pattern implements the following assertions from [reference-fonts-implementation](https://github.com/Monotype/reference-fonts-implementation):

- `pc-008` — self-hosting web fonts requires a web font license; desktop licenses do not permit web delivery
- `bd-001` — self-hosted fonts integrate into CI/CD pipelines as versioned static assets
- `pc-010` — cross-origin font delivery requires CORS configuration
- `pc-012` — some Monotype web font licenses require a tracking script alongside self-hosted font files; `next/font/local` covers delivery only — use e.g. `next/script` when your license mandates tracking. For privacy-related scope, see the **Clarification** on [pc-012](https://github.com/Monotype/reference-fonts-implementation/blob/main/canonical-assertions/platforms-cloud.md#some-monotype-web-font-licenses-require-a-tracking-script-alongside-self-hosted-font-files).

In this minimal app, font assets are served **same-origin** with the page, so you typically do not hit cross-origin `@font-face` blocking. **`pc-010` still applies** if you move fonts to another **origin** (for example a separate CDN or static host): you must send correct `Access-Control-Allow-Origin` (and related) headers on font responses. See [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) and [MDN: @font-face](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face).

---

## Usage

1. Obtain font files under a valid Monotype web font license (this repo ships a **small subset** for build/CI; use your own files in forks or production)
2. Place `.woff2` files in `public/fonts/` and update the `src` path in `app/layout.tsx` (`localFont` call) to match
3. After placing your font files in `public/fonts/` and updating `app/layout.tsx`, install dependencies and start the local development server:

```bash
npm install
npm run dev
```

The dev server starts on `http://localhost:3000` by default. Open the page in a browser and confirm your font renders correctly before proceeding to a production build. This repository includes a committed **`package-lock.json`**. After cloning, use **`npm ci`** when you want installs to match CI and the lockfile exactly; use **`npm install`** when you intentionally add or upgrade dependencies (then commit the updated lockfile).

## Font files

This repository includes **`public/fonts/MyFont.woff2`**, a heavily subsetted version of Gotham Regular, so **`npm run build`** and **GitHub Actions** work out of the box. That file is licensed only for limited testing per **LICENSE** (Monotype terms) and this README's **License** section — not for regular website use or redistribution. For your own project, replace the file and the `localFont({ src: ... })` path in `app/layout.tsx`. See `public/fonts/placeholder.txt` for placement notes.

Because `*.woff2` is excluded in `.gitignore`, force-add any specific font file you need tracked in version control:

```bash
git add -f public/fonts/YourFile.woff2
```

Only do this for demo or test assets — production-licensed font files should be injected via CI secrets or artifact storage, not committed to the repository when avoidable.

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
