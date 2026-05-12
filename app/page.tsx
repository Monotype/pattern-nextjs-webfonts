import localFont from 'next/font/local'

// next/font/local reads font files at build time from your project and serves
// optimized assets from your Next deployment. End users still download font
// data in the browser (normal for the web); the pattern avoids third-party CDN
// fetches and keeps delivery under your web font license for self-hosted use.
const brandFont = localFont({
  src: '../public/fonts/MyFont.woff2',
  display: 'swap',
  variable: '--font-brand',
})

export default function Page() {
  return (
    <main className={brandFont.className}>
      <h1>Next.js Web Fonts Pattern</h1>
      <p>
        Font loaded via <code>next/font/local</code> — self-hosted from this
        app (not fetched from a third-party font CDN).
      </p>
    </main>
  )
}
