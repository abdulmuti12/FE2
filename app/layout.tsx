import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Providers from './providers'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const SHARE_IMAGE_URL = new URL('/og-image.png', SITE_URL).toString()

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Usky.ai – AI Film Streaming Platform',
    template: '%s',
  },
  description:
    'Create, watch, and monetize AI-generated films on Usky.ai. A next-generation streaming platform empowering creators with ownership and fair revenue.',
  keywords: [
    'AI film platform',
    'AI streaming',
    'AI video creator',
    'creator monetization',
    'Web3 streaming',
    'NFT film',
    'AI movies',
  ],
  authors: [{ name: 'Usky.ai' }],
  alternates: {
    canonical: SITE_URL,
  },
  generator: 'Next.js',
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'Usky.ai',
    title: 'Create. Own. Monetize Your AI Films',
    description:
      'Join Usky.ai, the next-generation AI film platform where creators can publish, monetize, and own their content.',
    images: [{
      url: SHARE_IMAGE_URL,
      type: 'image/png',
      alt: 'Usky.ai Share Image'
    }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@usky',
    title: 'Usky.ai – AI Film Streaming Platform',
    description:
      'Publish and monetize AI-generated films with full ownership and transparency.',
    images: [SHARE_IMAGE_URL],
  },
  other: {
    title: 'Usky.ai – AI Film Streaming Platform',
    'og:image:secure_url': SHARE_IMAGE_URL,
    'twitter:image:src': SHARE_IMAGE_URL,
  },
  icons: {
    icon: '/usky-logo.png',
    shortcut: '/usky-logo.png',
    apple: '/usky-logo.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
