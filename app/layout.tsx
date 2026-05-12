import type { Metadata } from 'next'

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
      <body>{children}</body>
    </html>
  )
}
