'use client'

import { useState, type ReactNode } from 'react'

const FAQS = [
  {
    q: 'What is the Usky AI Film Award?',
    a: "The Usky AI Film Award is Indonesia's largest AI-powered film competition, celebrating creativity and innovation through the use of artificial intelligence in filmmaking.",
  },
  {
    q: 'What are the categories?',
    a: 'Long Film, Short Film, Documentary, Advertising, Social Media Content, Music Video, and AI Influencer Creator.',
  },
  {
    q: 'What is the total prize?',
    a: 'A total prize of IDR 1 Billion, including trophies, certificates, and exclusive media exposure on Usky.ai.',
  },
  {
    q: 'When is the submission period?',
    a: 'Long AI Film, Short AI Film, AI Content for Social Media, Video Clip, Documentary AI Film and Video Advertising AI: 20 Oct, 2025 - 30 May, 2026.',
  },
  {
    q: 'How can I join?',
    a: ' Click “Join the Competition” on the website and upload your work through the Submit page following the given guidelines.',
  },
  {
    q: 'Who can participate?',
    a: 'Open to individuals, communities, students, professionals, and brands using AI in their creative process.',
  },
  {
    q: 'Can I mix AI and non-AI elements?',
    a: 'Yes, as long as the main creative elements use 70% AI technology.',
  },
  {
    q: 'How are the winners selected?',
    a: 'Entries are judged by industry professionals based on innovation, creativity, technical quality, and originality.',
  },
  {
    q: 'Is there a public voting round?',
    a: 'Yes! The People’s Choice Award will be determined by public votes through the Usky.ai website.',
  },
  {
    q: 'Is there any registration fee?',
    a: 'No — participation is completely free!',
  },
  {
    q: 'How can I become a sponsor or partner?',
    a: 'Contact our team via the Contact page or email us at Click Here.',
  },
]

function FaqItem({ faq, index, isLast }: { faq: { q: string; a: string }; index: number; isLast: boolean }) {
  const [open, setOpen] = useState(index === 0)
  return (
    <div className={`${!isLast ? 'border-b border-white/10' : ''} ${open ? 'bg-[#0b1d35]' : 'bg-transparent'} transition-colors`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-5 text-left">
        <p className={`text-sm font-semibold ${open ? 'text-white' : 'text-gray-300'}`}>{faq.q}</p>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ml-4 transition-colors ${open ? 'bg-yellow-400' : 'border border-white/30 bg-transparent'}`}>
          <span className={`text-lg font-bold leading-none ${open ? 'text-black' : 'text-white'}`}>{open ? '−' : '+'}</span>
        </div>
      </button>
      {open && <p className="text-gray-400 text-sm leading-relaxed px-6 pb-5">{faq.a}</p>}
    </div>
  )
}

export default function FaqContent({ statsBar }: { statsBar: ReactNode }) {
  return (
    <div className="space-y-8 mt-2">
      {statsBar}
      <div>
        <h3 className="text-white font-bold text-2xl">Frequently Asked Questions</h3>
      </div>
      <div className="space-y-0 border border-white/10 rounded-xl overflow-hidden">
        {FAQS.map((faq, i) => (
          <FaqItem key={i} faq={faq} index={i} isLast={i === FAQS.length - 1} />
        ))}
      </div>
    </div>
  )
}
