import localFont from 'next/font/local'

// next/font/local loads fonts at build time from your own infrastructure.
// Font files are never redistributed to end users at runtime — a requirement
// of Monotype web font licenses for self-hosted delivery.
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
        Font loaded via <code>next/font/local</code> — license-safe, no
        runtime redistribution.
      </p>
    </main>
  )
}