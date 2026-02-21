'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ChevronRight } from 'lucide-react'

export default function ContactSupportPage() {
  return (
    <div className="min-h-screen bg-background text-foreground dark">
      <Header />

      {/* Hero Section with Background Image */}
      <div 
        className="relative w-full h-64 md:h-96 overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/privacy-header.jpg)'
        }}
      >
        {/* Dark blue overlay for readability */}
        <div className="absolute inset-0 bg-blue-950/60"></div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-center items-center px-4 md:px-12 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Contact Support</h1>
          <div className="flex items-center justify-center gap-2 text-sm md:text-base">
            <a href="/dashboard" className="text-gray-300 hover:text-white transition-colors">Usky.Ai</a>
            <ChevronRight className="w-4 h-4 text-gray-300" />
            <span className="text-white">Contact Support</span>
          </div>
        </div>
      </div>

      {/* Main Content - Full Width Single Column */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        {/* Introduction Section */}
        <div className="mb-12 space-y-3">
          <p className="text-gray-300 leading-relaxed">
            USKY.ai is the world's first creator platform dedicated to AI-generated films, powered by blockchain technology for transparent distribution, transactions, and creative collaboration.
          </p>
          <p className="text-gray-300 leading-relaxed">
            We know this is just the beginning — and we're building the future of AI cinema together with our community. If you have ideas, feedback, or suggestions to help make USKY better, we'd love to hear from you.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Founded on the belief that the next generation of storytelling will be AI-driven, transparent, and community-powered, USKY welcomes both AI video creators and viewers to shape an entertainment ecosystem that's fair, open, and secure.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Reach out — your voice helps define the future of AI filmmaking.
          </p>
        </div>

        {/* Get in Touch Section */}
        <section className="mb-12 scroll-mt-24">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Get in Touch</h2>
          <div className="space-y-2 text-gray-300">
            <p><strong className="text-white">Email:</strong> support@usky.ai</p>
            <p><strong className="text-white">Website:</strong> www.usky.ai</p>
            <p><strong className="text-white">WhatsApp:</strong> +62 878-7300-6300</p>
          </div>
        </section>

        {/* Connect With Us Section */}
        <section className="mb-12 scroll-mt-24">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Connect With Us</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-300 ml-2">
            <li>Instagram: @usky.ai</li>
            <li>X (Twitter): @Usky_ai</li>
            <li>YouTube: USKY Official</li>
            <li>LinkedIn: USKY.ai</li>
            <li>TikTok: @usky.ai</li>
            <li>Facebook: AI USKY</li>
            <li>Discord: USKY Community</li>
            <li>Telegram: t.me/uskyal</li>
          </ol>
        </section>
      </div>

      <Footer />
    </div>
  )
}
