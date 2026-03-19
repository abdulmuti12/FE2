'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Heart, Eye, Search, Plus, Clock, FileText, Trophy } from 'lucide-react'
import { useState, useMemo } from 'react'
import Image from 'next/image'

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface AwardSubmission {
  id: number
  title: string
  creator: string
  image: string
  likes: number | string
  views: number | string
  category: string
}

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

const FILTER_OPTIONS = ['Trending', 'Latest', 'Most Liked', 'Most Viewed']
const TABS = ['Projects', 'Theme', 'Terms']

const AWARD_SUBMISSIONS: AwardSubmission[] = [
  { id: 1, title: '[Judul Film]', creator: 'by Jennie Kim', image: '/film/film5.png', likes: 12, views: 15, category: 'Film' },
  { id: 2, title: '[Judul Film]', creator: 'by Jennie Kim', image: '/film/film2.png', likes: 12, views: 15, category: 'Film' },
  { id: 3, title: '[Judul Film]', creator: 'by Jennie Kim', image: '/film/film6.png', likes: 12, views: 15, category: 'Film' },
  { id: 4, title: '[Judul Film]', creator: 'by Jennie Kim', image: '/film/film4.png', likes: 12, views: 15, category: 'Film' },
  { id: 5, title: '[Judul Film]', creator: 'by Jennie Kim', image: '/film/film4.png', likes: 12, views: 15, category: 'Film' },
  { id: 6, title: '[Judul Film]', creator: 'by Jennie Kim', image: '/film/film5.png', likes: 12, views: 15, category: 'Film' },
  { id: 7, title: '[Judul Film]', creator: 'by Jennie Kim', image: '/film/film2.png', likes: 12, views: 15, category: 'Film' },
  { id: 8, title: '[Judul Film]', creator: 'by Jennie Kim', image: '/film/film6.png', likes: 12, views: 15, category: 'Film' },
]

const PRIZE_BREAKDOWN = [
  { label: '1st', amount: 'IDR 300,000,000' },
  { label: '2nd', amount: 'IDR 200,000,000' },
  { label: '3rd', amount: 'IDR 100,000,000' },
  { label: 'Honorable Mentions', amount: 'IDR 10,000,000' },
]

const FAQS = [
  {
    q: 'Who can join the competition?',
    a: "Anyone — whether you're a student, professional, digital artist, or simply an AI enthusiast — everyone is welcome to submit their AI-powered short films.",
  },
  {
    q: 'Does my film have to be fully made with AI?',
    a: "AI must play a meaningful role in your production process, but you don't have to use AI for every single element. Human creativity combined with AI tools is encouraged.",
  },
  {
    q: 'Can I use copyrighted materials in my film?',
    a: 'No. All submitted films must use original or properly licensed content. Using copyrighted music, footage, or images without permission will result in disqualification.',
  },
  {
    q: 'How long should the film be?',
    a: 'Minimum 30 seconds, maximum 15 minutes depending on category. Please check the specific category guidelines for exact duration requirements.',
  },
]

const SPECIAL_CATEGORIES = [
  {
    name: 'Best AI Short Film',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <polygon points="10 9 15 12 10 15 10 9" />
      </svg>
    ),
  },
  {
    name: 'Best AI Advertising',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400">
        <path d="M11 20H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4" />
        <path d="M11 4v16" />
        <path d="M11 8h6l3-2v12l-3-2h-6" />
        <path d="M3 14v4a2 2 0 0 0 2 2h2" />
      </svg>
    ),
  },
  {
    name: 'Best AI Animation',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400">
        <rect x="2" y="2" width="20" height="20" rx="2.18" />
        <line x1="7" y1="2" x2="7" y2="22" />
        <line x1="17" y1="2" x2="17" y2="22" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <line x1="2" y1="7" x2="7" y2="7" />
        <line x1="2" y1="17" x2="7" y2="17" />
        <line x1="17" y1="17" x2="22" y2="17" />
        <line x1="17" y1="7" x2="22" y2="7" />
        <polygon points="10 10 14 12 10 14 10 10" />
      </svg>
    ),
  },
  {
    name: 'Best AI Documentary',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <polygon points="10 12 15 15 10 18 10 12" />
      </svg>
    ),
  },
  {
    name: 'Best AI Long Film',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400">
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" />
      </svg>
    ),
  },
  {
    name: 'Best AI Music Video',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M10 8l6 4-6 4V8z" />
      </svg>
    ),
  },
]

const TIMELINE = [
  { label: 'Submission',      date: '1–30 July 2025' },
  { label: 'Public Voting',   date: '15 July – 15 August 2025' },
  { label: 'Jury Evaluating', date: '16 August 2025' },
  { label: 'Finalist Reveal', date: '16 August 2025' },
]

const JUDGING_CRITERIA = [
  { icon: '🎬', text: 'Storytelling & Narrative Strength' },
  { icon: '🤖', text: 'Creative Use of AI' },
  { icon: '🎨', text: 'Visual & Audio Quality' },
  { icon: '💡', text: 'Originality & Innovation' },
  { icon: '🎯', text: 'Overall Impact & Execution' },
]

const SUBMIT_STEPS = [
  { num: '1', title: 'Log in as a Creator',    desc: "Access the platform at usky.ai and log in using your Creator account. If you're not registered yet, sign up first to get started." },
  { num: '2', title: 'Go to "Video List"',     desc: 'After logging in, open the Video List section from your dashboard.' },
  { num: '3', title: 'Click "Add Film"',       desc: 'Begin your submission by selecting Add Film to create a new entry.' },
  { num: '4', title: 'Complete Submission',    desc: 'Fill in the submission form, genre, and other required info to fully submit your AI Short Film for peer viewing quality.' },
]

const TERMS_SECTIONS = [
  {
    title: 'Eligibility',
    items: [
      'Open to individuals aged 15 years and above.',
      'Participants may enter as individuals or teams (max 5 members).',
      'Open to Indonesian citizens and residents only for the 2025 edition.',
    ],
  },
  {
    title: 'Film Requirements',
    items: [
      'The duration depends on the category of the AI film you are submitting.',
      'Language: Any, but English or Bahasa Indonesia subtitles are mandatory.',
      'The film must incorporate AI tools in at least one area: script, visual, animation, voice, or editing.',
      'Genre must be selected from the provided list.',
    ],
  },
  {
    title: 'Originality',
    items: [
      'All films must be original and not previously published or submitted to other competitions.',
      'AI-generated content must be originally created by the participant, not reused from pre-existing works.',
    ],
  },
  {
    title: 'Submission',
    items: [
      'Submissions must be uploaded via USKY.AI platform within the designated submission period.',
      'Each participant/team can submit up to 2 films, but only one can win.',
      'Late submissions will not be accepted.',
    ],
  },
  {
    title: 'Judging & Audience Votes',
    items: [
      '60% Jury Score: Based on creativity, use of AI, storytelling, visual execution, and impact.',
      '40% Audience Score: Based on Plays, Likes, Shares, Views, and Watchlists on USKY.AI platform.',
      'All decisions by the judges and organizers are final and binding.',
    ],
  },
  {
    title: 'Rights & Usage',
    items: [
      'Participants retain ownership of their films.',
      'By submitting, participants grant USKY.AI the non-exclusive right to showcase, promote, and distribute the film for non-commercial promotional purposes with proper credit.',
      'Plagiarism, copyright infringement, offensive content, or violation of any rule will result in immediate disqualification.',
    ],
  },
]

// ─────────────────────────────────────────────
// SHARED COMPONENTS
// ─────────────────────────────────────────────

function PrizeSidebar() {
  return (
    <div className="sticky top-4 space-y-3 max-w-[380px] ml-auto">
      <p className="text-white text-sm font-bold mb-1">Details</p>

      {/* Prizes card */}
      <div className="bg-black border border-white/10 rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
          <Trophy className="w-4 h-4 text-yellow-400 shrink-0" />
          <span className="text-gray-300 text-xs font-semibold">Prizes</span>
        </div>

        <div className="px-3 pt-3">
          <div className="relative flex items-center justify-between overflow-hidden bg-gradient-to-br from-[#1a3a5f] via-[#0a192f] to-[#0d2a4a] px-5 py-4 rounded-xl border border-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 blur-3xl">
              <div className="absolute right-8 top-0 h-full w-20 bg-white/[0.04] skew-x-[-15deg]" />
              <div className="absolute right-2 top-0 h-full w-10 bg-white/[0.03] skew-x-[-15deg]" />
            </div>
            <div className="flex items-center gap-2 relative z-10">
              <Trophy className="w-4 h-4 text-yellow-400 shrink-0" />
              <span className="text-white text-sm font-bold">Prize Pool</span>
            </div>
            <span className="text-white font-extrabold text-lg relative z-10">200 USKY</span>
          </div>
        </div>

        <div className="mx-3 mt-2 mb-3 border border-white/10 rounded-xl overflow-hidden">
          {PRIZE_BREAKDOWN.map((row, i) => (
            <div
              key={row.label}
              className={`flex justify-between items-center px-4 py-3 bg-[#0b1d35] ${i < PRIZE_BREAKDOWN.length - 1 ? 'border-b border-white/10' : ''}`}
            >
              <span className="text-gray-400 text-xs">{row.label}</span>
              <span className="text-gray-200 text-xs font-semibold">{row.amount}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Submission + Ends in */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#0b1d35] border border-white/10 rounded-xl px-4 py-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <FileText className="w-3.5 h-3.5 text-gray-400" />
            <p className="text-gray-400 text-[10px] uppercase tracking-wider">Submission</p>
          </div>
          <p className="text-white font-extrabold text-lg leading-none">245</p>
        </div>
        <div className="bg-[#0b1d35] border border-white/10 rounded-xl px-4 py-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <p className="text-gray-400 text-[10px] uppercase tracking-wider">Ends in</p>
          </div>
          <p className="text-white font-extrabold text-lg leading-none">4 Days</p>
        </div>
      </div>

      <button className="w-full bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 text-black font-bold text-sm py-3 rounded-xl transition-colors">
        Submit Now
      </button>
    </div>
  )
}

function FaqAccordion({ faqs }: { faqs: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="space-y-0">
      {faqs.map((faq, i) => (
        <div key={i} className={i < faqs.length - 1 ? 'border-b border-white/10' : ''}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between py-4 text-left hover:opacity-80 transition-opacity"
          >
            <p className="text-gray-300 text-base">{faq.q}</p>
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ml-4 transition-colors ${
                open === i ? 'bg-yellow-400' : 'border border-white/30 bg-transparent'
              }`}
            >
              <span className={`text-base font-bold leading-none ${open === i ? 'text-black' : 'text-white'}`}>
                {open === i ? '−' : '+'}
              </span>
            </div>
          </button>
          {open === i && (
            <p className="text-gray-400 text-sm leading-relaxed pb-4">{faq.a}</p>
          )}
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────
// TAB: THEME
// ─────────────────────────────────────────────

function ThemeContent() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-2">

      {/* Left column */}
      <div className="md:col-span-2 space-y-8">

        {/* Intro */}
        <div>
          <h3 className="text-white font-bold text-2xl mb-0.5">Theme</h3>
          <p className="text-yellow-400 text-base font-semibold mb-2">Create Without Limits</p>
          <p className="text-gray-400 text-base leading-relaxed">
            USKY AI Film Awards invites creators across Indonesia to produce original films powered by Artificial Intelligence.
          </p>
        </div>

        {/* Categories */}
        <div>
          <p className="text-gray-300 text-base font-semibold mb-2">· You can create:</p>
          <ul className="text-gray-400 text-base space-y-1.5 ml-3">
            {['Short Film', 'Video Advertising', 'Animation Film', 'Long Film', 'Documentary AI Film', 'Video Clip'].map((item) => (
              <li key={item}>– {item}</li>
            ))}
          </ul>
        </div>

        {/* Rules */}
        <div className="space-y-2">
          <p className="text-gray-400 text-base leading-relaxed">
            Any genre is welcome — action, drama, sci-fi, romance, thriller, experimental — as long as AI plays a meaningful role in your production process.
          </p>
          <p className="text-gray-400 text-base">🎥 Minimum duration: 30 seconds</p>
          <p className="text-gray-400 text-base">🎞 Maximum duration: 15 minutes (depending on category)</p>
          <p className="text-gray-400 text-base">🤖 AI tools allowed: text-to-video, image generation, AI voice, AI editing, AI compositing, and more.</p>
        </div>

        <p className="text-gray-300 text-base font-semibold italic">
          This is your moment to redefine filmmaking in the AI era.
        </p>

        {/* Prize Pool */}
        <div className="w-full">
          <p className="text-white text-2xl font-bold mb-5 uppercase tracking-tight">💰 Prize Pool — IDR 1,000,000,000 Total</p>

          {/* Podium */}
          <div className="flex items-end justify-center gap-3 md:gap-6 mb-10 mt-16 w-full max-w-6xl mx-auto px-4">

            {/* 2nd Place */}
            <div className="flex flex-col items-center w-full max-w-[280px]">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden mb-3 border border-white/10 shadow-lg bg-slate-800">
                <Image src="/images/imagel.png" alt="2nd place" width={96} height={96} className="object-cover w-full h-full" />
              </div>
              <p className="text-white text-lg md:text-xl font-bold mb-6">Brian Ngo</p>
              <div className="relative w-full flex flex-col items-center">
                <div
                  className="w-full h-[45px] relative z-0"
                  style={{ background: 'linear-gradient(180deg, #1e3a5f 0%, #112540 100%)', clipPath: 'polygon(12% 0%, 88% 0%, 100% 100%, 0% 100%)' }}
                >
                  <div className="absolute top-0 left-[12%] right-[12%] h-[1px] bg-white/20" />
                </div>
                <div className="w-full h-[200px] bg-gradient-to-b from-[#0f2038] to-[#020d1f]/0 border-t border-white/10 flex flex-col items-center pt-10 px-4 shadow-2xl relative -mt-[1px]">
                  <div className="absolute -top-6 w-12 h-12 bg-[#cbd5e1] rounded-xl flex items-center justify-center shadow-[0_8px_25px_rgba(0,0,0,0.5)] z-10">
                    <Trophy className="w-6 h-6 text-slate-700" />
                  </div>
                  <p className="text-gray-400 text-xs md:text-sm mb-4 uppercase tracking-widest">Earn 2,000 USKY</p>
                  <p className="text-white font-bold text-xl md:text-2xl mb-3">IDR 200,000,000</p>
                  <div className="flex items-center gap-1.5 opacity-80">
                    <span className="text-sm">🥈</span>
                    <p className="text-gray-300 text-sm">2nd Place</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center w-full max-w-[320px]">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden mb-4 border-2 border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.2)] bg-slate-800">
                <Image src="/images/imagew.png" alt="1st place" width={112} height={112} className="object-cover w-full h-full" />
              </div>
              <p className="text-white text-xl md:text-2xl font-bold mb-8">Jolie Joie</p>
              <div className="relative w-full flex flex-col items-center">
                <div
                  className="w-full h-[55px] relative z-0"
                  style={{ background: 'linear-gradient(180deg, #254b85 0%, #162f55 100%)', clipPath: 'polygon(12% 0%, 88% 0%, 100% 100%, 0% 100%)' }}
                >
                  <div className="absolute top-0 left-[12%] right-[12%] h-[1px] bg-white/30" />
                </div>
                <div className="w-full h-[300px] bg-gradient-to-b from-[#162f55] to-[#020d1f]/0 border-t border-white/20 flex flex-col items-center pt-12 px-4 shadow-2xl relative -mt-[1px]">
                  <div className="absolute -top-7 w-14 h-14 bg-[#ecc159] rounded-xl flex items-center justify-center shadow-[0_10px_30px_rgba(236,193,89,0.4)] z-10">
                    <Trophy className="w-7 h-7 text-yellow-900" />
                  </div>
                  <p className="text-gray-400 text-xs md:text-sm mb-5 uppercase tracking-widest">Earn 2,000 USKY</p>
                  <p className="text-white font-black text-2xl md:text-3xl mb-4">IDR 300,000,000</p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">🥇</span>
                    <p className="text-[#ecc159] text-sm font-bold uppercase tracking-wide">1st Place</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center w-full max-w-[280px]">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden mb-3 border border-white/10 shadow-lg bg-slate-800">
                <Image src="/images/imagej.png" alt="3rd place" width={96} height={96} className="object-cover w-full h-full" />
              </div>
              <p className="text-white text-lg md:text-xl font-bold mb-6">David Do</p>
              <div className="relative w-full flex flex-col items-center">
                <div
                  className="w-full h-[45px] relative z-0"
                  style={{ background: 'linear-gradient(180deg, #1e3a5f 0%, #112540 100%)', clipPath: 'polygon(12% 0%, 88% 0%, 100% 100%, 0% 100%)' }}
                >
                  <div className="absolute top-0 left-[12%] right-[12%] h-[1px] bg-white/20" />
                </div>
                <div className="w-full h-[140px] bg-gradient-to-b from-[#0f2038] to-[#020d1f]/0 border-t border-white/10 flex flex-col items-center pt-10 px-4 shadow-2xl relative -mt-[1px]">
                  <div className="absolute -top-6 w-12 h-12 bg-[#b8784d] rounded-xl flex items-center justify-center shadow-[0_8px_25px_rgba(0,0,0,0.5)] z-10">
                    <Trophy className="w-6 h-6 text-orange-100" />
                  </div>
                  <p className="text-gray-400 text-xs md:text-sm mb-4 uppercase tracking-widest">Earn 2,000 USKY</p>
                  <p className="text-white font-bold text-xl md:text-2xl mb-3">IDR 100,000,000</p>
                  <div className="flex items-center gap-1.5 opacity-80">
                    <span className="text-sm">🥉</span>
                    <p className="text-orange-400 text-sm">3rd Place</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Special Categories */}
        <div className="max-w-3xl">
          <p className="text-white text-xl font-bold mb-4">⭐ Special Category Winners</p>
          <div className="grid grid-cols-3 gap-3">
            {SPECIAL_CATEGORIES.map((cat) => (
              <div key={cat.name} className="bg-transparent border border-white/10 rounded-xl px-5 py-4 flex flex-col justify-between h-[100px]">
                <div className="flex items-center gap-2">
                  {cat.icon}
                  <p className="text-gray-400 text-sm">{cat.name}</p>
                </div>
                <p className="text-white text-lg font-bold">TBC</p>
              </div>
            ))}
          </div>
        </div>

        {/* Honorable Mentions */}
        <div>
          <p className="text-white text-xl font-bold mb-4">🎖 Honorable Mentions</p>
          <p className="text-gray-400 text-sm mb-3">Up to 10 selected films receive IDR 10,000,000 each.</p>
          <div className="flex gap-4 flex-wrap">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-[#0b1d35] border border-white/10 rounded-xl px-9 py-4 text-center min-w-[140px]">
                <p className="text-gray-500 text-xs mb-1">TBC</p>
                <p className="text-white text-sm font-bold">IDR 10,000,000</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div>
          <p className="text-white text-xl font-bold mb-6">Timeline</p>
          <div className="relative">
            <div
              className="absolute top-2 left-2 right-116 h-[2px]"
              style={{ background: 'none', borderTop: '2px dashed rgba(234, 179, 8, 0.5)' }}
            />
            <div className="flex gap-[140px] relative">
              {TIMELINE.map((item, i) => (
                <div key={i} className="flex flex-col items-start">
                  <div className="w-4 h-4 rounded-full bg-yellow-400 z-10 mb-4 shrink-0" />
                  <p className="text-white text-sm font-bold">{item.label}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{item.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Judging Criteria */}
        <div>
          <p className="text-white text-xl font-bold mb-2">Judging Criteria</p>
          <p className="text-gray-400 text-base mb-4">Our expert panel evaluates entries based on:</p>
          <ul className="text-gray-400 text-base space-y-2">
            {JUDGING_CRITERIA.map((item) => (
              <li key={item.text} className="flex items-center gap-2">
                <span>{item.icon}</span>
                {item.text}
              </li>
            ))}
          </ul>
        </div>

        {/* Submit Your Film */}
        <div className="max-w-5xl">
          <p className="text-white text-xl font-bold mb-2">Submit Your Film</p>
          <p className="text-gray-400 text-base mb-4">
            Step-by-step guide to submit your AI-powered short film to the platform.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SUBMIT_STEPS.map((step) => (
              <div key={step.num} className="bg-[#0b1d35] border border-white/10 rounded-xl p-6">
                <p className="text-gray-400 text-base font-semibold mb-4">{step.num}</p>
                <p className="text-white text-base font-bold mb-2">{step.title}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl">
          <p className="text-white text-xl font-bold mb-4">Frequently Asked Questions</p>
          <FaqAccordion faqs={FAQS} />
        </div>

      </div>

      {/* Right sidebar */}
      <div className="space-y-4">
        <PrizeSidebar />
      </div>

    </div>
  )
}

// ─────────────────────────────────────────────
// TAB: TERMS
// ─────────────────────────────────────────────

function TermsContent() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-2">

      {/* Left column */}
      <div className="md:col-span-2 space-y-6">
        <div>
          <h3 className="text-white font-bold text-2xl mb-1">Terms & Conditions</h3>
          <p className="text-gray-400 text-sm font-semibold mb-3">Last Updated: January 2026</p>
          <p className="text-gray-400 text-base leading-relaxed">
            By submitting an entry to Usky AI Film Awards 2026 ("Awards"), you agree to comply with the following Terms & Conditions.
          </p>
        </div>

        {TERMS_SECTIONS.map((section) => (
          <div key={section.title}>
            <h4 className="text-white font-bold text-lg mb-2">{section.title}</h4>
            <ol className="text-gray-400 text-base space-y-1.5 list-none">
              {section.items.map((item, j) => (
                <li key={j}>{j + 1}. {item}</li>
              ))}
            </ol>
          </div>
        ))}

        <div>
          <h4 className="text-white font-bold text-xl mb-4">Frequently Asked Questions</h4>
          <div className="max-w-2xl">
            <FaqAccordion faqs={FAQS} />
          </div>
        </div>
      </div>

      {/* Right sidebar */}
      <div className="space-y-4">
        <PrizeSidebar />
      </div>

    </div>
  )
}

// ─────────────────────────────────────────────
// TAB: PROJECTS
// ─────────────────────────────────────────────

function ProjectsContent() {
  const [filterBy, setFilterBy] = useState('Trending')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSubmissions = useMemo(() => {
    const q = searchQuery.toLowerCase()
    return AWARD_SUBMISSIONS.filter(
      (s) => s.title.toLowerCase().includes(q) || s.creator.toLowerCase().includes(q)
    )
  }, [searchQuery])

  return (
    <>
      {/* Stats bar */}
      <div className="flex items-stretch gap-6">
        <div className="relative flex items-center justify-between overflow-hidden bg-[#0b1d35] border border-white/10 rounded-xl px-6 py-5 max-w-[900px] w-full">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80">
            <div className="absolute -right-8 top-0 h-full w-32 bg-white/[0.03] skew-x-[-20deg]" />
            <div className="absolute -right-2 top-0 h-full w-16 bg-white/[0.03] skew-x-[-20deg]" />
          </div>
          <div className="flex items-center gap-3 relative z-10">
            <Trophy className="w-5 h-5 text-yellow-400 shrink-0" />
            <span className="text-gray-400 text-sm font-semibold">Prize Pool</span>
          </div>
          <span className="text-white font-extrabold text-2xl md:text-3xl tracking-tight relative z-10">
            200 USKY
          </span>
        </div>

        <div className="flex items-center gap-3 bg-[#0b1d35] border border-white/10 rounded-xl px-5 py-5 shrink-0 min-w-[290px]">
          <FileText className="w-4 h-4 text-gray-400 shrink-0" />
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider leading-none mb-1.5">Submission</p>
            <p className="text-white font-extrabold text-xl leading-none">245</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-[#0b1d35] border border-white/10 rounded-xl px-5 py-5 shrink-0 min-w-[290px]">
          <Clock className="w-4 h-4 text-gray-400 shrink-0" />
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider leading-none mb-1.5">Ends in</p>
            <p className="text-white font-extrabold text-xl leading-none">4 Days</p>
          </div>
        </div>

        <button className="flex flex-col items-center justify-center gap-1 bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 transition-colors rounded-xl px-8 py-5 shrink-0 min-w-[280px]">
          <Plus className="w-5 h-5 text-black" />
          <span className="text-black font-bold text-sm whitespace-nowrap">Submit Now</span>
        </button>
      </div>

      {/* Submissions grid */}
      <div>
        <h2 className="text-base font-bold text-white mb-4">All Submission</h2>

        <div className="flex items-center justify-between gap-4 mb-6">
          {/* Search */}
          <div className="relative w-[280px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border border-white/15 rounded-lg pl-9 pr-4 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2.5 shrink-0 mr-6">
            <span className="text-white text-sm font-bold uppercase tracking-wider">Filter By</span>
            <div className="flex items-center gap-1.5 border border-white/15 rounded-lg px-3 py-2 bg-transparent">
              <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="8" y1="12" x2="16" y2="12" />
                <line x1="11" y1="18" x2="13" y2="18" />
              </svg>
              <div className="relative">
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="bg-transparent text-white text-sm appearance-none cursor-pointer focus:outline-none pr-5"
                >
                  {FILTER_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className="bg-[#0b1d35] text-white">{opt}</option>
                  ))}
                </select>
                <svg className="w-3 h-3 absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-5">
          {filteredSubmissions.map((submission) => (
            <div
              key={submission.id}
              className="group cursor-pointer flex flex-col bg-[#0b1d35] rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 p-3"
            >
              <div className="relative w-full rounded-lg overflow-hidden border-4 border-black" style={{ paddingBottom: '130%' }}>
                <Image
                  src={submission.image}
                  alt={submission.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300 absolute inset-0"
                />
              </div>
              <div className="px-1 pt-3 pb-1 text-center">
                <h3 className="text-white font-semibold text-sm leading-tight line-clamp-1 mb-1">
                  {submission.title}
                </h3>
                <p className="text-gray-400 text-xs mb-2.5">
                  by <span className="font-semibold text-gray-300">{submission.creator.replace('by ', '')}</span>
                </p>
                <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5" />
                    <span>{submission.likes} Likes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{submission.views} Views</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Load More */}
      <div className="flex justify-center pt-2">
        <button className="flex items-center gap-2 px-8 py-2.5 bg-[#0a1628] border border-white/10 text-gray-300 rounded-lg text-sm font-semibold hover:border-yellow-500/50 hover:text-yellow-400 transition-colors">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="2" x2="12" y2="22" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
            <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
          </svg>
          Load More
        </button>
      </div>
    </>
  )
}

// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────

export default function AwardsPage() {
  const [activeTab, setActiveTab] = useState('Projects')

  return (
    <div className="min-h-screen bg-[#050d1a] text-white font-sans">
      <Header />

      {/* Hero */}
      <div className="relative w-full overflow-hidden bg-[#050d1a]" style={{ minHeight: '280px' }}>
        <Image
          src="/images/awards/imageawards.png"
          alt="Awards hero"
          fill
          className="object-cover object-center opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050d1a]/95 via-[#050d1a]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050d1a]" />

        <div
          className="relative w-full px-6 md:px-8 pt-8 pb-10 md:pt-12 md:pb-14 flex flex-col justify-end"
          style={{ minHeight: '280px' }}
        >
          {/* Avatars */}
          <div className="flex items-center gap-2.5 mb-3">
            <div className="flex -space-x-2.5">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-[#050d1a] bg-gray-600 overflow-hidden relative"
                  style={{ zIndex: 4 - i }}
                >
                  <Image
                    src={`/images/avatar${i}.png`}
                    alt=""
                    width={32}
                    height={32}
                    className="object-cover w-full h-full"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                </div>
              ))}
              <div
                className="w-8 h-8 rounded-full border-2 border-[#050d1a] bg-[#1e3a5f] flex items-center justify-center text-[10px] font-bold text-white"
                style={{ zIndex: 0 }}
              >
                +3
              </div>
            </div>
            <span className="text-gray-300 text-sm font-medium">Join 240+ others</span>
          </div>

          {/* Countdown badge */}
          <div className="flex items-center gap-1.5 mb-5">
            <div className="flex items-center gap-1.5 border border-white/20 rounded-full px-3 py-1 w-fit bg-black/20 backdrop-blur-sm">
              <Clock className="w-3.5 h-3.5 text-gray-300" />
              <span className="text-gray-300 text-[11px] uppercase tracking-widest font-semibold">Ends in 30 days</span>
            </div>
          </div>

          <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight mb-3 text-white whitespace-nowrap">
            Indonesia's Biggest AI Film Revolution Starts Here
            <br />
            1 BILLION IDR in Prizes + National Fame
          </h1>

          <p className="text-gray-400 text-sm md:text-base leading-relaxed">
            Your film could be the next viral AI masterpiece — seen, judged, and celebrated across Indonesia.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[#050d1a] py-4">
        <div className="px-6 md:px-8">
          <div className="inline-flex items-center border border-white/15 rounded-full bg-[#0b1d35]/60 p-1 gap-1">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-6 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                  activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-yellow-400 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="px-6 md:px-8 pb-20 mt-6 space-y-6">
        {activeTab === 'Projects' && <ProjectsContent />}
        {activeTab === 'Theme'    && <ThemeContent />}
        {activeTab === 'Terms'    && <TermsContent />}
      </div>

      <Footer />
    </div>
  )
}