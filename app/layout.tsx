import type { Metadata } from 'next'
import { Geist_Mono, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import 'katex/dist/katex.min.css'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: '[Your Name] | Systems Architect & Quantitative Modeler',
  description: 'Specializing in advanced statistical dynamics, AI agent gateways, and high-dimensional state modeling.',
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
