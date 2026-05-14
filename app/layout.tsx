import type { Metadata } from 'next'
import localFont from 'next/font/local'

// next/font/local reads font files at build time from your project and serves
// optimized assets from your Next deployment. End users still download font
// data in the browser (normal for the web); the pattern avoids third-party CDN
// fetches and keeps delivery under your web font license for self-hosted use.
// `variable` registers `--font-brand` on <body> for `font-family: var(--font-brand)`
// in global CSS or MDX; `className` applies the face app-wide.
// If your license requires a tracking script alongside self-hosted fonts (pc-012 in
// reference-fonts-implementation), add it explicitly (e.g. next/script)—this sample does not.
const brandFont = localFont({
  src: '../public/fonts/MyFont.woff2',
  display: 'swap',
  variable: '--font-brand',
})

export const metadata: Metadata = {
  title: 'Next.js Web Fonts Pattern',
  description: 'License-safe web font loading with next/font/local',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${brandFont.variable} ${brandFont.className}`}>
        {children}
      </body>
    </html>
  )
}
