'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ChevronRight, X, Menu } from 'lucide-react'
import { useState } from 'react'

export default function PrivacyPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const privacySections = [
    { id: 'introduction', title: 'Privacy Policy' },
    { id: 'information-collection', title: 'Information We Collect' },
    { id: 'information-use', title: 'How We Use Your Information' },
    { id: 'information-sharing', title: 'Information Sharing' },
    { id: 'data-retention', title: 'Data Retention' },
    { id: 'user-rights', title: 'Your Rights & Choices' },
    { id: 'security', title: 'Security Measures' },
    { id: 'third-party', title: 'Third-Party Services' },
    { id: 'cookies', title: 'Cookies & Tracking Technologies' },
    { id: 'children', title: 'Children\'s Privacy' },
    { id: 'international', title: 'International Data Transfers' },
    { id: 'changes', title: 'Changes to This Policy' },
    { id: 'contact', title: 'Contact Us' },
  ]

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

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
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Privacy Policy</h1>
          <div className="flex items-center justify-center gap-2 text-sm md:text-base">
            <a href="/dashboard" className="text-gray-300 hover:text-white transition-colors">Usky.Ai</a>
            <ChevronRight className="w-4 h-4 text-gray-300" />
            <span className="text-white">Privacy Policy</span>
          </div>
        </div>
      </div>

      {/* Main Content - Full Width Single Column */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        {/* Introduction */}
        <div className="mb-12">
          <p className="text-gray-300 text-sm mb-2">Last Updated: October 2025</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Privacy Policy</h2>
          <p className="text-gray-300 leading-relaxed">At USKY ai, your privacy matters. We are committed to protecting your personal data, ensuring transparency, and empowering you to control how your information is used.</p>
        </div>

          {/* 1. About USKY.ai */}
          <section id="information-collection" className="mb-12 scroll-mt-24">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4">1. About USKY.ai</h3>
            <p className="text-gray-300 leading-relaxed">
              USKY is an innovative AI-powered creative platform built on blockchain technology. Through our platform, users can watch, create, and monetize AI-generated films and web series using USKY tokens. By accessing or using USKY Services, you agree to the terms of this Privacy Policy.
            </p>
          </section>

          {/* 2. Membership */}
          <section id="information-use" className="mb-12 scroll-mt-24">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4">2. Membership</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              We collect information to operate and maintain the USKY Experience. This includes information generated from blockchain transactions and user interactions on our platform. We partner with trusted third-party partners to process and protect user data in accordance with applicable privacy regulations.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              (a) Personal Information
            </p>
            <ul className="list-disc list-inside text-gray-300 leading-relaxed mb-4 space-y-2 ml-2">
              <li>Account login credentials (e.g., password)</li>
              <li>Profile preferences, language, and regional data</li>
              <li>Communication preferences</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mb-4">
              (b) Payment Information
            </p>
            <ul className="list-disc list-inside text-gray-300 leading-relaxed mb-4 space-y-2 ml-2">
              <li>Payment method details (credit cards or other payment methods)</li>
              <li>Billing address and transaction history</li>
              <li>Wallet or blockchain addresses for token transactions</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mb-4">
              (c) Usage & Activity Data
            </p>
            <ul className="list-disc list-inside text-gray-300 leading-relaxed mb-4 space-y-2 ml-2">
              <li>Content you watch, timestamps, and viewing duration</li>
              <li>Service identifiers, IP address, browser type, and session logs</li>
              <li>Advertising interaction data</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mb-4">
              (d) Communications
            </p>
            <ul className="list-disc list-inside text-gray-300 leading-relaxed space-y-2 ml-2">
              <li>Messages sent to our support team</li>
              <li>Feedback and survey responses</li>
              <li>Marketing preferences and notifications</li>
            </ul>
          </section>

          {/* 3. How We Use Your Information */}
          <section id="information-sharing" className="mb-12 scroll-mt-24">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4">3. How We Use Your Information</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              We use your personal data to improve your experience and ensure transparency in our blockchain-powered ecosystem.
            </p>

            <h4 className="text-lg font-semibold text-white mb-3 mt-6">Primary Objectives</h4>
            <ul className="list-disc list-inside text-gray-300 leading-relaxed mb-4 space-y-2 ml-2">
              <li>Platform Development: To provide streaming, content creation, and monetization services</li>
              <li>Blockchain Transactions: To record transactions, NFT ownership, and Token distribution on the blockchain</li>
              <li>Marketing & Analytics: To analyze usage, improve features, and send promotional content</li>
              <li>Legal Compliance: To comply with regulations and resolve disputes</li>
            </ul>
          </section>

          {/* 4. Blockchain and Data Transparency */}
          <section id="data-retention" className="mb-12 scroll-mt-24">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4">4. Blockchain and Data Transparency</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              Some actors on USKY – such as token transactions, NFT mints – are recorded on the blockchain. This means certain personal data related to blockchain transactions may be embedded in the blockchain and immutable. All personal data on blockchain records cannot be deleted or modified through traditional means.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Important Disclaimer: Immutable Personal Data on Chain and ensure that only non-identifiable or hashed data is included in blockchain records whenever possible.
            </p>
          </section>

          {/* 5. How We Share Information */}
          <section id="user-rights" className="mb-12 scroll-mt-24">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4">5. How We Share Information</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              We do not sell your personal information. However, we share data with trusted partners to operate the platform:
            </p>
            <h4 className="text-lg font-semibold text-white mb-3 mt-6">(a) RWI Service Providers</h4>
            <p className="text-gray-300 leading-relaxed mb-4">
              Trusted vendors who handle platform operations, payment processing, analytics</p>
            
            <h4 className="text-lg font-semibold text-white mb-3 mt-6">(b) RWI Business Partners</h4>
            <p className="text-gray-300 leading-relaxed mb-4">
              Entities that integrate USKY Platform via APIs for affiliated services</p>
            
            <h4 className="text-lg font-semibold text-white mb-3 mt-6">(c) RWI Advertising & Sub-acquired plane</h4>
            <p className="text-gray-300 leading-relaxed mb-4">
              We may share advertiser cookie data with third parties to deliver relevant ads</p>
            
            <h4 className="text-lg font-semibold text-white mb-3 mt-6">(d) RWI Legal & Security Purposes</h4>
            <p className="text-gray-300 leading-relaxed">
              We disclose information where required by law, court order, or to protect rights and safety</p>
          </section>

          {/* 6. International Data Transfers */}
          <section id="security" className="mb-12 scroll-mt-24">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4">6. International Data Transfers</h3>
            <p className="text-gray-300 leading-relaxed">
              USKY operates globally. Your information may be transferred across borders, we ensure your information remains protected by implementing safeguards such as data protection agreements, encryption, and GDPR compliance.
            </p>
          </section>

          {/* 7. Data Retention */}
          <section id="third-party" className="mb-12 scroll-mt-24">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4">7. Data Retention</h3>
            <p className="text-gray-300 leading-relaxed">
              We retain information for as long as your account is active or as needed to provide services. Blockchain data is permanently retained.
            </p>
          </section>

          {/* 8. Your Rights and Choices */}
          <section id="cookies" className="mb-12 scroll-mt-24">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4">8. Your Rights and Choices</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              Depending on your location, you may have the following rights:
            </p>
            <ul className="list-disc list-inside text-gray-300 leading-relaxed mb-4 space-y-2 ml-2">
              <li>Access – Receive a copy of your data</li>
              <li>Correction – Fix inaccurate or incomplete information</li>
              <li>Deletion – Request deletion of your account and associated data (excluding blockchain records)</li>
              <li>Restriction – Limit how we use your data</li>
              <li>Portability – Obtain your data in a machine-readable format</li>
              <li>Objection – Opt out of marketing communications and certain data uses</li>
              <li>Withdraw Consent – Change your privacy preferences at any time</li>
            </ul>
            <p className="text-gray-300 leading-relaxed">
              To exercise your rights, contact us at privacy@usky.com with details of your request.
            </p>
          </section>

          {/* 9. Cookies and Tracking Technologies */}
          <section id="children" className="mb-12 scroll-mt-24">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4">9. Cookies and Tracking Technologies</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              USKY uses cookies and similar technologies to:
            </p>
            <ul className="list-disc list-inside text-gray-300 leading-relaxed mb-4 space-y-2 ml-2">
              <li>Keep you signed in</li>
              <li>Analyze user behavior for service improvement</li>
              <li>Enhance platform performance</li>
              <li>Deliver relevant ads and monitor effectiveness</li>
            </ul>
            <p className="text-gray-300 leading-relaxed">
              You can control cookie preferences in your browser settings or Account &gt; Privacy Settings.
            </p>
          </section>

          {/* 10. Security Measures */}
          <section id="international" className="mb-12 scroll-mt-24">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4">10. Security Measures</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              We utilize industry-standard safeguards to protect your data, including:
            </p>
            <ul className="list-disc list-inside text-gray-300 leading-relaxed mb-4 space-y-2 ml-2">
              <li>End-to-end encryption for sensitive data</li>
              <li>Limited employee access to user information</li>
              <li>Regular security audits and penetration testing</li>
            </ul>
            <p className="text-gray-300 leading-relaxed">
              However, no system is completely secure. We encourage users to protect their passwords and wallet keys and report security issues.
            </p>
          </section>

          {/* 11. Children's Privacy */}
          <section id="changes" className="mb-12 scroll-mt-24">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4">11. Children's Privacy</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              USKY is not intended for children under 13 years old. We do not knowingly collect information from children. If we discover a child has created an account, we will promptly delete the account and associated data.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Parents or guardians concerned about their child's use should contact us immediately at privacy@usky.com.
            </p>
          </section>

          {/* 12. Communication Preferences */}
          <section id="contact" className="mb-12 scroll-mt-24">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4">12. Communication Preferences</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              We send you:
            </p>
            <ul className="list-disc list-inside text-gray-300 leading-relaxed mb-4 space-y-2 ml-2">
              <li>Transactional emails about your account and activity</li>
              <li>Updates on features and platform changes</li>
              <li>Opt-in marketing emails, newsletters, and surveys</li>
            </ul>
            <p className="text-gray-300 leading-relaxed">
              Manage your preferences through Account Settings or click 'unsubscribe' in marketing emails.
            </p>
          </section>

          {/* 13. Changes to This Policy */}
          <section id="changes" className="mb-12 scroll-mt-24">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4">13. Changes to This Policy</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              We may update this Privacy Policy. Significant changes will be communicated via email or prominently displayed on the platform. Your continued use after updates indicates acceptance.
            </p>
          </section>

          {/* 14. Contact Us */}
          <section id="contact" className="mb-12 scroll-mt-24">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4">14. Contact Us</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              For privacy inquiries or to exercise your rights, contact our Data Protection Team:
            </p>
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-4 md:p-6 mt-4">
              <p className="text-gray-300 mb-2"><span className="text-white font-semibold">Email:</span> privacy@usky.com</p>
              <p className="text-gray-300"><span className="text-white font-semibold">Support: Support@usky.com</span></p>
            </div>
          </section>
      </div>

      <Footer />
    </div>
  )
}
