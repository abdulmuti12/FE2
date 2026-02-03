'use client'

import Image from 'next/image'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ChevronRight } from 'lucide-react'

export default function TermsPage() {
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
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Terms Of Use</h1>
          <div className="flex items-center justify-center gap-2 text-sm md:text-base">
            <a href="/dashboard" className="text-gray-300 hover:text-white transition-colors">Usky.Ai</a>
            <ChevronRight className="w-4 h-4 text-gray-300" />
            <span className="text-white">Terms of Use</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-12 py-12 md:py-16">
        {/* Terms of Service Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-8 bg-yellow-400 rounded-full"></div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">Terms of Service</h2>
          </div>
          <p className="text-gray-400 text-sm mb-4">Last Updated: October 2025</p>
          <p className="text-gray-300 leading-relaxed">
            Welcome to USKY. These Terms of Service ("Terms") govern your access and use of the USKY platform, including all content and services offered by USKY. By accessing or using USKY, you agree to be bound by these Terms.
          </p>
        </section>

        {/* 1. Overview */}
        <section className="mb-12">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-4">1. Overview</h3>
          <p className="text-gray-300 leading-relaxed mb-4">
            USKY is a proprietary digital subscription service that allows members to access and enjoy AI-generated entertainment content. For USKY's purposes, references to services in this section refer to USKY and USKY-branded websites, apps, and other services.
          </p>
          <p className="text-gray-300 leading-relaxed mb-4">
            These Terms govern your access to and use of the USKY service, which includes:
          </p>
          <ul className="list-disc list-inside text-gray-300 leading-relaxed mb-4 space-y-2">
            <li>All features, recommendations, functionalities, and services</li>
            <li>All content and software associated with the service</li>
          </ul>
          <p className="text-gray-300 leading-relaxed">
            References to "USKY," "we," "us," or "our" refer to the USKY service and its operators. References to "you" or "your" refer to the registered member or user of the service.
          </p>
        </section>

        {/* 2. Membership Plans */}
        <section className="mb-12">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-4">2. Membership Plans</h3>
          <p className="text-gray-300 leading-relaxed mb-4">
            USKY offers multiple subscription options. You must have internet access, a USKY-ready device, and a valid Payment Method to use the service. Unless canceled online, your subscription will automatically continue following the initial subscription period. We may change the fees or charges for your subscription plan.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Certain USKY subscriptions may be offered through third-party partners. Specific terms, limitations, or other details will be displayed during registration or communications directly to you.
          </p>
        </section>

        {/* 3. Prohibited Offers */}
        <section className="mb-12">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-4">3. Prohibited Offers</h3>
          <p className="text-gray-300 leading-relaxed mb-4">
            USKY may periodically provide special offers in promotional memberships ("Offers"). Eligibility is determined at our sole discretion, and we reserve the right to withdraw an Offer if we determine reused ineligibility conditions, limitations, or expiration are present.
          </p>
        </section>

        {/* 4. Billing and Cancellation */}
        <section className="mb-12">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-4">4. Billing and Cancellation</h3>
          
          <h4 className="text-lg font-semibold text-white mb-3 mt-6">4.1 Payment Methods</h4>
          <p className="text-gray-300 leading-relaxed mb-4">
            Your subscription fee will be charged to the billing method in your account. Billing cycles may vary by plan. Visit your Account → Billing Details page to view your next payment date.
          </p>

          <h4 className="text-lg font-semibold text-white mb-3 mt-6">4.2 Payment Authorization</h4>
          <p className="text-gray-300 leading-relaxed mb-4">
            You authorize USKY to charge your selected Payment Method. If a payment fails, we may suspend access until a valid Payment Method is provided. You are responsible for all unauthorized or invalid payment details.
          </p>

          <h4 className="text-lg font-semibold text-white mb-3 mt-6">4.3 Updating Payment Methods</h4>
          <p className="text-gray-300 leading-relaxed mb-4">
            You can update your payment method anytime via Account Settings. By adding your payment details, you authorize continued billing to the new method.
          </p>

          <h4 className="text-lg font-semibold text-white mb-3 mt-6">4.4 Cancellations</h4>
          <p className="text-gray-300 leading-relaxed mb-4">
            You can cancel your USKY membership anytime. Access continues until the end of your current billing period. Payments are non-refundable and no partial refunds are provided. To cancel, manage your subscription in Account Settings or contact our support team.
          </p>

          <h4 className="text-lg font-semibold text-white mb-3 mt-6">4.5 Price and Plan Changes</h4>
          <p className="text-gray-300 leading-relaxed mb-4">
            We may modify subscription options or features with 30 days' prior notice. If you do not wish to accept the changes, you may cancel before the new rate takes effect.
          </p>
        </section>

        {/* 5. USKY Service Usage */}
        <section className="mb-12">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-4">5. USKY Service Usage</h3>
          
          <h4 className="text-lg font-semibold text-white mb-3 mt-6">5.1 Account Registration</h4>
          <p className="text-gray-300 leading-relaxed mb-4">
            You must be 18 years or older to create a USKY account. Minors may use the service only under adult supervision.
          </p>

          <h4 className="text-lg font-semibold text-white mb-3 mt-6">5.2 Personal and Non-Commercial Use</h4>
          <p className="text-gray-300 leading-relaxed mb-4">
            USKY is for personal and non-commercial use only. You may not share access beyond your household unless explicitly stated by your subscription plan.
          </p>

          <h4 className="text-lg font-semibold text-white mb-3 mt-6">5.3 Streaming Access</h4>
          <p className="text-gray-300 leading-relaxed mb-4">
            You may access certain content from the country where your account was created, and only within your subscription period.
          </p>

          <h4 className="text-lg font-semibold text-white mb-3 mt-6">5.4 Content Upload</h4>
          <p className="text-gray-300 leading-relaxed mb-4">
            Some content may be user-submitted and does not purport to make a collaboration post with USKY's official Instagram or TikTok accounts directly. This serves as a verification step to confirm the authenticity of the creator's work.
          </p>

          <h4 className="text-lg font-semibold text-white mb-3 mt-6">5.5 Offline Access</h4>
          <p className="text-gray-300 leading-relaxed mb-4">
            Certain content may be available for temporary download ("Offline Titles") on select devices. Restrictions may apply, including viewing and storage limitations.
          </p>

          <h4 className="text-lg font-semibold text-white mb-3 mt-6">5.6 Prohibited Activities</h4>
          <p className="text-gray-300 leading-relaxed mb-4">You agree not to:</p>
          <ul className="list-disc list-inside text-gray-300 leading-relaxed space-y-2">
            <li>Copy, reproduce, or distribute any USKY content</li>
            <li>Circumvent security or content restriction methods</li>
            <li>Reverse-engineer, modify, or tamper with our services</li>
            <li>Upload hateful or malicious content</li>
            <li>Use automated tools to monitor service performance</li>
            <li>Use the service for any commercial or illegal purpose</li>
          </ul>

          <h4 className="text-lg font-semibold text-white mb-3 mt-6">5.7 Streaming Quality</h4>
          <p className="text-gray-300 leading-relaxed mb-4">
            While quality may vary by location and connection speed, minimum recommended speeds are as follows:
          </p>
          <ul className="list-disc list-inside text-gray-300 leading-relaxed space-y-2">
            <li>HD (720p): 3 Mbps</li>
            <li>Full HD (1080p): 5 Mbps</li>
            <li>4K: 25 Mbps (select regions)</li>
          </ul>
          <p className="text-gray-300 leading-relaxed mt-4">
            You are responsible for any data or internet charges from your service provider.
          </p>

          <h4 className="text-lg font-semibold text-white mb-3 mt-6">5.8 Software Usage</h4>
          <p className="text-gray-300 leading-relaxed mb-4">
            The USKY software is proprietary and may automatically update. Some third-party software may also be under their respective licenses.
          </p>
        </section>

        {/* 6. Account Security */}
        <section className="mb-12">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-4">6. Account Security</h3>
          <p className="text-gray-300 leading-relaxed">
            You are responsible for safeguarding your account credentials. Do not share your password or Payment Method details. Should unauthorized account sharing or fraudulent activity occur, it may result in account suspension or deletion. USKY is not liable for any losses resulting from unauthorized access or use of your account.
          </p>
        </section>

        {/* 7. Miscellaneous */}
        <section className="mb-12">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-4">7. Miscellaneous</h3>
          
          <h4 className="text-lg font-semibold text-white mb-3 mt-6">7.1 Unsolicited Content Submissions</h4>
          <p className="text-gray-300 leading-relaxed mb-4">
            Please do not submit unsolicited content to USKY, as we do not accept it. All submissions are confidential and may be similar to existing or future USKY projects.
          </p>

          <h4 className="text-lg font-semibold text-white mb-3 mt-6">7.2 Customer Support</h4>
          <p className="text-gray-300 leading-relaxed mb-4">
            For help or inquiries, please visit the USKY Help Center or contact us@usky.io. Our team may assist with technical issues, but only with your context.
          </p>

          <h4 className="text-lg font-semibold text-white mb-3 mt-6">7.3 Archived Clause</h4>
          <p className="text-gray-300 leading-relaxed mb-4">
            If any part of these Terms is found invalid or unenforceable, the remaining provisions remain in full effect.
          </p>

          <h4 className="text-lg font-semibold text-white mb-3 mt-6">7.4 Changes to Terms</h4>
          <p className="text-gray-300 leading-relaxed mb-4">
            We may update these Terms periodically. Material changes will be communicated at least 30 days in advance. Continued use of the service after changes take effect constitutes your acceptance.
          </p>

          <h4 className="text-lg font-semibold text-white mb-3 mt-6">7.5 Electronic Communication</h4>
          <p className="text-gray-300 leading-relaxed mb-4">
            All notices and inquiries, including configurations, password resets, or policy changes will be sent electronically via the email linked to your USKY account.
          </p>
        </section>

        {/* Acceptance of Terms */}
        <section className="border-t border-white/10 pt-8 mt-12">
          <h3 className="text-lg font-bold text-white mb-3">Acceptance of Terms</h3>
          <p className="text-gray-300 leading-relaxed">
            By using USKY, you acknowledge that you have read, understood, and agreed to these Terms of Service.
          </p>
        </section>
      </div>

      <Footer />
    </div>
  )
}
