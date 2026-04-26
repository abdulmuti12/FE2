import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Providers from './providers'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const SHARE_IMAGE_URL = 'https://usky.ai/login-hero.jpg?v=20260426'

export const metadata: Metadata = {
  metadataBase: new URL('https://usky.ai'),
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
    canonical: 'https://usky.ai',
  },
  generator: 'Next.js',
  openGraph: {
    type: 'website',
    url: 'https://usky.ai',
    siteName: 'Usky.ai',
    title: 'Create. Own. Monetize Your AI Films',
    description:
      'Join Usky.ai, the next-generation AI film platform where creators can publish, monetize, and own their content.',
    images: [{
      url: SHARE_IMAGE_URL,
      width: 1456,
      height: 816,
      type: 'image/jpeg',
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
