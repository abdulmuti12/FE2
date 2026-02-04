'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function AboutPage() {
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
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">About Us</h1>
          <div className="flex items-center justify-center gap-2 text-sm md:text-base">
            <a href="/dashboard" className="text-gray-300 hover:text-white transition-colors">Usky.Ai</a>
            <span className="text-gray-300">&gt;</span>
            <span className="text-white">About Us</span>
          </div>
        </div>
      </div>

      {/* Main Content - Full Width Single Column */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        
        {/* Introduction */}
        <div className="mb-12">
          <p className="text-gray-300 text-sm mb-2">Last Updated: October 2025</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">About USKY.ai</h2>
          <p className="text-gray-300 leading-relaxed">USKY is the world's first AI-powered creator platform built on latest technology, designed to revolutionize how people create, watch, and earn from video content. Our mission is simple — to empower creators and audiences through transparency, fairness, and blockchain-based value creation.</p>
        </div>

        {/* For Creators Section */}
        <section className="mb-12 scroll-mt-24">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-4">For Creators – Empowering the Future of Storytelling</h3>
          <div className="space-y-3 text-gray-300">
            <p className="leading-relaxed">USKY gives creators a platform to fully own their content and build sustainable communities.</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong className="text-white">Video Listing System</strong> — Upload your films of videos with detailed descriptions, tags, and categories to maximize visibility and reach.</li>
              <li><strong className="text-white">Creator Dashboard</strong> — Track your content's performance, audience engagement, and real-time analytics all in one organized space.</li>
              <li><strong className="text-white">Monetized Earnings</strong> — Earn USKY tokens to cryptoassets every time your videos are watched.</li>
              <li><strong className="text-white">Video Licensing Options</strong> — Sell, Lend and license you videos — retain full control of your intellectual property.</li>
            </ul>
          </div>
        </section>

        {/* For Viewers Section */}
        <section className="mb-12 scroll-mt-24">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-4">For Viewers — Watch, Engage, and Earn</h3>
          <div className="space-y-3 text-gray-300">
            <p className="leading-relaxed">At USKY, audiences are more than spectators — they're part of the ecosystem.</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong className="text-white">Watch-to-Earn</strong> — Earn USKY tokens just by watching videos and supporting your favorite creators.</li>
              <li><strong className="text-white">Personalized Recommendations</strong> — Enjoy AI-curated videos that match your interests and mood.</li>
              <li><strong className="text-white">Creator Support Tools</strong> — Vote, comment, share, and leave feedback to support your favorite creators.</li>
              <li><strong className="text-white">Leaderboard Rewards</strong> — Become a top viewer and earn extra rewards by engaging, watching, and leaving feedback.</li>
            </ul>
          </div>
        </section>

        {/* Monetization & Ecosystem Section */}
        <section className="mb-12 scroll-mt-24">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Monetization & Ecosystem</h3>
          <div className="space-y-3 text-gray-300">
            <p className="leading-relaxed">USKY is redefining how creative value flows between creators and audiences.</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong className="text-white">Ad-Free Subscription</strong> — Enjoy uninterrupted viewing while supporting creators and earning rewards.</li>
              <li><strong className="text-white">NFT Video Collectibles</strong> — Transform your videos into unique NFT assets for collectors and fans.</li>
              <li><strong className="text-white">Token Marketplaces</strong> — Trade USKY tokens with other users and exchange them for the crypto assets.</li>
            </ul>
            <p className="leading-relaxed">It's a self-sustaining, creator-first economy — transparent, decentralized, and global.</p>
          </div>
        </section>

        {/* Powered by Web3 & Blockchain Section */}
        <section className="mb-12 scroll-mt-24">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Powered by Web3 & Blockchain</h3>
          <div className="space-y-3 text-gray-300">
            <p className="leading-relaxed">Every video on USKY is secured by blockchain, ensuring that authenticity, ownership, and consent are immutable and transparent.</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong className="text-white">Decentralized Ownership</strong> — Your videos are safely stored with verifiable blockchain proof of ownership.</li>
              <li><strong className="text-white">Smart Contract Payments</strong> — Earnings are distributed through blockchain smart contracts for transparency.</li>
              <li><strong className="text-white">Creator Revenue</strong> — All user reviews and ratings are cryptography-secured permanently for trust and transparency.</li>
            </ul>
          </div>
        </section>

        {/* Community & Gamification Section */}
        <section className="mb-12 scroll-mt-24">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Community & Gamification</h3>
          <div className="space-y-3 text-gray-300">
            <p className="leading-relaxed">It's an entertainment platform. It's a creative economy powered by community engagement.</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong className="text-white">Challenges & Contests</strong> — Join weekly creator challenges and earn tokens for the best submissions.</li>
              <li><strong className="text-white">Community Tiers</strong> — Earn up from Viewer to Critic to Influencer, unlocking exclusive perks and rewards.</li>
              <li><strong className="text-white">Battle Sharing Incentives</strong> — Share your favorite and earn extra rewards as the community drives the future of AI entertainment.</li>
            </ul>
            <p className="leading-relaxed">Here, participation is power — and the community drives the future of AI entertainment.</p>
          </div>
        </section>

        {/* USKY.ai Section */}
        <section className="mb-12 scroll-mt-24">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-4">USKY.ai — Redefining Cinema for the AI Era</h3>
          <p className="text-gray-300 leading-relaxed">It's more than a platform — it's a movement where creators own their art, viewers are rewarded for engagement, and together, we're reimagining what AI cinema looks like. Create. Watch. Earn. Own the future of AI entertainment — with USKY.ai.</p>
        </section>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10" />

      <Footer />
    </div>
  )
}
