import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ASA ELO Simulator',
  description: 'An interactive competition outcome simulator for South Asian a cappella teams',
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
