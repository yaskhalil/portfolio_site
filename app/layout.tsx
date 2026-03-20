import type { Metadata } from 'next'
import { Geist_Mono, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import 'katex/dist/katex.min.css'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined)

const title = 'Yaseen Khalil | Computational Modeler & ML Systems Architect'
const description =
  'Exploring the mathematical architecture of intelligent systems. Bridging high-dimensional feature engineering with production data pipelines and autonomous AI integrations.'

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title,
  description,
  openGraph: {
    title,
    description,
    type: 'website',
    locale: 'en_US',
    siteName: 'Yaseen Khalil',
  },
  twitter: {
    card: 'summary',
    title,
    description,
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
