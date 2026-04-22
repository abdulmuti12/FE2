'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Heart, Eye, Search, Plus, Clock, FileText, Trophy, Play } from 'lucide-react'
import { useState, useMemo, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface AwardSubmission {
  id: string | number
  name: string
  image_url: string
  likes?: number | string
  views?: number | string
  play?: number | string
}

const TABS = ['Films', 'Leaderboard', 'Details', 'Direction', 'Scoring', 'Rules', 'FAQ']

const PRIZE_BREAKDOWN = [
  { label: '1st',                amount: 'IDR 300,000,000' },
  { label: '2nd',                amount: 'IDR 200,000,000' },
  { label: '3rd',                amount: 'IDR 100,000,000' },
  { label: 'Honorable Mentions', amount: 'IDR 10,000,000'  },
]

const FAQS = [
  {
    q: 'What is the Usky AI Film Award?',
    a: 'The Usky AI Film Award is Indonesia\'s largest AI-powered film competition, celebrating creativity and innovation through the use of artificial intelligence in filmmaking.',
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

const TIMELINE = [
  { label: 'Submission',      date: 'October 20, 2025 – May 31, 2026' },
  { label: 'Public Voting',   date: 'October 20, 2025 – June 18, 2026' },
  { label: 'Jury Evaluating', date: 'June 20 – June 30, 2026' },
  { label: 'Finalist Reveal', date: 'July 2026' },
]

const JUDGING_CRITERIA = [
  { icon: '🎬', text: 'Storytelling & Narrative Strength' },
  { icon: '🤖', text: 'Creative Use of AI' },
  { icon: '🎨', text: 'Visual & Audio Quality' },
  { icon: '💡', text: 'Originality & Innovation' },
  { icon: '🎯', text: 'Overall Impact & Execution' },
]

const SUBMIT_STEPS = [
  { num: '1', title: 'Log in as a Creator', desc: "Access the platform at usky.ai and log in using your Creator account. If you're not registered yet, sign up first to get started." },
  { num: '2', title: 'Go to "Video List"',  desc: 'After logging in, open the Video List section from your dashboard.' },
  { num: '3', title: 'Click "Add Film"',    desc: 'Begin your submission by selecting Add Film to create a new entry.' },
  { num: '4', title: 'Complete Submission', desc: 'Fill in the submission form, genre, and other required info to fully submit your AI Short Film for peer viewing quality.' },
]

const TERMS_SECTIONS = [
  { title: 'Eligibility',              items: ['Open to individuals aged 15 years and above.', 'Participants may enter as individuals or teams (max 5 members).', 'Open to Indonesian citizens and residents only for the 2025 edition.'] },
  { title: 'Film Requirements',        items: ['The duration depends on the category of the AI film you are submitting.', 'Language: Any, but English or Bahasa Indonesia subtitles are mandatory.', 'The film must incorporate AI tools in at least one area: script, visual, animation, voice, or editing.', 'Genre must be selected from the provided list.'] },
  { title: 'Originality',              items: ['All films must be original and not previously published or submitted to other competitions.', 'AI-generated content must be originally created by the participant, not reused from pre-existing works.'] },
  { title: 'Submission',               items: ['Submissions must be uploaded via USKY.AI platform within the designated submission period.', 'Each participant/team can submit up to 2 films, but only one can win.', 'Late submissions will not be accepted.'] },
  { title: 'Judging & Audience Votes', items: ['60% Jury Score: Based on creativity, use of AI, storytelling, visual execution, and impact.', '40% Audience Score: Based on Plays, Likes, Shares, Views, and Watchlists on USKY.AI platform.', 'All decisions by the judges and organizers are final and binding.'] },
  { title: 'Rights & Usage',           items: ['Participants retain ownership of their films.', 'By submitting, participants grant USKY.AI the non-exclusive right to showcase, promote, and distribute the film for non-commercial promotional purposes with proper credit.', 'Plagiarism, copyright infringement, offensive content, or violation of any rule will result in immediate disqualification.'] },
]

// ─────────────────────────────────────────────
// DIRECTION CATEGORIES DATA
// ─────────────────────────────────────────────

const DIRECTION_CATEGORIES = [
  {
  id: 1,
  title: 'Script &\nStory Writing',
  icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M12 19l7-7 3 3-7 7-3-3z" />
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
      <path d="M2 2l7.586 7.586" />
      <circle cx="11" cy="11" r="2" />
    </svg>
  ),
    description: 'Start with a strong foundation—your story. These AI tools assist in generating creative ideas, writing compelling dialogues, and structuring a screenplay. From brainstorming to the final draft, let AI guide your narrative process.',
    tools: ['ChatGPT', 'Claude', 'Gemini', 'Sudowrite', 'NovelAI','DALL-E'],
  },
 {
    id: 2,
    title: 'Visuals\n& Animation',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M13 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8" />
        <circle cx="8" cy="8" r="2" />
        <path d="M3 17l4.5-4.5 4.5 4.5" />
        <path d="M15 14v8l7-4z" />
      </svg>
    ),
    description: 'Start with a strong foundation—your story. These AI tools assist in generating creative ideas, writing compelling dialogues, and structuring a screenplay. From brainstorming to the final draft, let AI guide your narrative process.',
    tools: ['Midjourney', 'DALL-E', 'Stable Diffusion', 'RunwayML','NovelAI','Kaedim'],
  },
  {
    id: 3,
    title: '3D & Virtual\nProduction',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M12 3a6 9 0 1 0 4.5 15.5" />
        <path d="M19 10a8 4 0 0 0-14 2 8 4 0 0 0 14 2" />
        <polyline points="16 11 19 14 15 17" />
      </svg>
    ),
    description: 'Start with a strong foundation—your story. These AI tools assist in generating creative ideas, writing compelling dialogues, and structuring a screenplay. From brainstorming to the final draft, let AI guide your narrative process.',
    tools: ['Blender AI', 'NVIDIA Canvas', 'Kaedim', 'Luma AI','claude','Gemini'],
  },
{
  id: 4,
  title: 'Voice\n& Narration',
  icon: (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <path
        d="M3 13a4 4 0 1 1 8 0 4 4 0 0 1-8 0z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M13 13a4 4 0 1 1 8 0 4 4 0 0 1-8 0z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <line x1="7" y1="17" x2="17" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
    description: 'Start with a strong foundation—your story. These AI tools assist in generating creative ideas, writing compelling dialogues, and structuring a screenplay. From brainstorming to the final draft, let AI guide your narrative process.',
    tools: ['ElevenLabs', 'Murf AI', 'Play.ht', 'Resemble AI', 'Descript Overdub','ChatGPT'],
  },
  {
  id: 5,
  title: 'AI Acting &\nFace Animation',
  icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M3 9V5a0 0 0 0 1 0 0h4" />
      <path d="M21 9V5a0 0 0 0 0 0 0h-4" />
      <path d="M3 15v4a0 0 0 0 0 0 0h4" />
      <path d="M21 15v4a0 0 0 0 1 0 0h-4" />
      <circle cx="9" cy="9" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="15" cy="9" r="0.5" fill="currentColor" stroke="none" />
      <path d="M8 14s1.5 2.5 4 2.5 4-2.5 4-2.5" />
    </svg>
  ),
    description: 'Start with a strong foundation—your story. These AI tools assist in generating creative ideas, writing compelling dialogues, and structuring a screenplay. From brainstorming to the final draft, let AI guide your narrative process.',
    tools: ['D-ID', 'HeyGen', 'Synthesia', 'Wav2Lip', 'DeepFaceLab','Kaedim'],
  },
  {
    id: 6,
    title: 'Music\n& Sound Design',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
      </svg>
    ),
    description: 'Start with a strong foundation—your story. These AI tools assist in generating creative ideas, writing compelling dialogues, and structuring a screenplay. From brainstorming to the final draft, let AI guide your narrative process.',
    tools: ['Suno AI', 'Udio', 'AIVA', 'Soundraw', 'Boomy','ChatGPT','Gemini'],
  },
  {
    id: 7,
    title: 'Editing &\nPost-Production',
    icon: (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M16 13l-6 6-3-3 6-6" />
      <path d="M14.5 9.5l1.5 1.5" />
    </svg>
  ),
    description: 'Start with a strong foundation—your story. These AI tools assist in generating creative ideas, writing compelling dialogues, and structuring a screenplay. From brainstorming to the final draft, let AI guide your narrative process.',
    tools: ['Descript', 'Runway', 'Adobe Firefly', 'Topaz AI','D-ID','Kaedim'],
  },
  {
    id: 8,
    title: 'All-in-One\nAI Video Platforms',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <rect x="5" y="10" width="9" height="7" rx="1" />
      <polyline points="14 12 19 10 19 17 14 15" />
    </svg>
    ),
    description: 'Start with a strong foundation—your story. These AI tools assist in generating creative ideas, writing compelling dialogues, and structuring a screenplay. From brainstorming to the final draft, let AI guide your narrative process.',
    tools: ['Pika Labs', 'Gen-2', 'Kaiber', 'Stable Video','Midjourney','seek.ai'],
  },
]

// ─────────────────────────────────────────────
// JUDGES DATA
// ─────────────────────────────────────────────

const JUDGES = [
  { id: 1, company: 'Ketua Umum', name: 'Adisurya Abdy', role: 'Perkumpulan Tenaga Ahli Televisi dan Film Indonesia (PATFI)', image: '/images/awards/ady.jpeg' },
  { id: 2, name: 'Syaifullah Agam, PhD', role: 'Direktur Film Kemenbud RI', image: '/images/awards/agam.jpeg' },
  { id: 3, name: 'Sandiaga Uno', role: 'Dewan Penasehat USKY Al Film Award', image: '/images/awards/sandiaga.jpeg' },
  { id: 4, name: 'Iwan Setiawan', role: 'CEO Marketeers & MarkPlus, Inc.', image: '/images/awards/iwan.jpeg' },
]

// ─────────────────────────────────────────────
// SPONSOR LOGOS (SVG inline)
// ─────────────────────────────────────────────

const SPONSOR_LOGOS = [
  {
    name: 'IMAX',
    svg: (
      <svg viewBox="0 0 100 32" fill="currentColor" className="h-8 w-auto">
        <text x="0" y="26" fontSize="32" fontWeight="900" fontFamily="Arial Black, sans-serif" letterSpacing="-1">IMAX</text>
      </svg>
    ),
  },
  {
    name: 'VIVA TECHNOLOGY',
    svg: (
      <svg viewBox="0 0 110 38" fill="currentColor" className="h-9 w-auto">
        <text x="0" y="17" fontSize="15" fontWeight="800" fontFamily="Arial, sans-serif" letterSpacing="2">VIVA</text>
        <text x="0" y="35" fontSize="12" fontWeight="600" fontFamily="Arial, sans-serif" letterSpacing="1.5">TECHNOLOGY</text>
      </svg>
    ),
  },
  {
    name: 'NVIDIA',
    svg: (
      <svg viewBox="0 0 105 32" fill="currentColor" className="h-8 w-auto">
        <path d="M0 6 L0 20 L6 20 L6 13 L11 20 L17 20 L17 6 L11 6 L11 13 L6 6 Z" opacity="0.9"/>
        <text x="21" y="21" fontSize="15" fontWeight="800" fontFamily="Arial, sans-serif" letterSpacing="0.5">NVIDIA.</text>
      </svg>
    ),
  },
  {
    name: 'TRIBECA FESTIVAL',
    svg: (
      <svg viewBox="0 0 85 40" fill="currentColor" className="h-9 w-auto">
        <rect x="0" y="0" width="3" height="40" />
        <text x="9" y="17" fontSize="12" fontWeight="700" fontFamily="Arial, sans-serif" letterSpacing="0.5">TR|BECA</text>
        <text x="9" y="34" fontSize="12" fontWeight="700" fontFamily="Arial, sans-serif" letterSpacing="0.5">FEST|VAL</text>
      </svg>
    ),
  },
  {
    name: 'CapCut',
    svg: (
      <svg viewBox="0 0 80 30" fill="currentColor" className="h-7 w-auto">
        <polygon points="0,3 0,27 7,15" />
        <polygon points="10,3 10,27 17,15" opacity="0.6"/>
        <text x="21" y="21" fontSize="15" fontWeight="700" fontFamily="Arial, sans-serif">CapCut</text>
      </svg>
    ),
  },
]

// ─────────────────────────────────────────────
// MARQUEE ROW COMPONENT
// ─────────────────────────────────────────────

function MarqueeRow({ reverse = false }: { reverse?: boolean }) {
  const logos = [...SPONSOR_LOGOS, ...SPONSOR_LOGOS, ...SPONSOR_LOGOS]
  return (
    <div className="overflow-hidden w-full">
      <div
        className={`flex items-center w-max ${
          reverse ? 'animate-marquee-reverse' : 'animate-marquee'
        }`}
        style={{ gap: '5rem' }}
      >
        {logos.map((logo, i) => (
          <div
            key={`${logo.name}-${i}`}
            className="shrink-0 text-[#4a6080] hover:text-[#7a90a8] transition-colors opacity-80 hover:opacity-100 flex items-center"
          >
            {logo.svg}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// SHARED STATS BAR
// ─────────────────────────────────────────────

function formatEndInLabel(value: unknown): string {
  if (typeof value !== 'string' || !value.trim()) return '30 Days'

  const text = value.trim().toLowerCase()
  const monthMatch = text.match(/^(\d+(?:\.\d+)?)\s*months?$/)
  if (monthMatch) {
    const monthCount = Number(monthMatch[1])
    if (!Number.isNaN(monthCount)) {
      return `${Math.round(monthCount * 30)} Days`
    }
  }

  const dayMatch = text.match(/^(\d+(?:\.\d+)?)\s*days?$/)
  if (dayMatch) {
    const dayCount = Number(dayMatch[1])
    if (!Number.isNaN(dayCount)) {
      return `${Math.round(dayCount)} Days`
    }
  }

  return String(value)
}

interface AwardsStats {
  prizePool: string | number
  submission: string | number
  endIn: string
  creatorCount: string | number
}

function StatsBar({
  prizePool = '-',
  submission = '-',
  endIn = '-',
  isLoading = false,
}: {
  prizePool?: string | number
  submission?: string | number
  endIn?: string
  isLoading?: boolean
}) {
  return (
    <div className="flex flex-col lg:flex-row items-stretch gap-4 w-full">
      <div className="relative flex items-center justify-between overflow-hidden bg-[#0b1d35] border border-white/10 rounded-xl px-6 py-5 lg:flex-[2] w-full shrink-0">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -right-8 top-0 h-full w-32 bg-white/[0.03] skew-x-[-20deg]" />
          <div className="absolute -right-2 top-0 h-full w-16 bg-white/[0.03] skew-x-[-20deg]" />
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <Trophy className="w-5 h-5 text-yellow-400 shrink-0" />
          <span className="text-gray-400 text-sm font-semibold">Prize Pool</span>
        </div>
        {isLoading ? (
          <div className="h-8 md:h-9 w-28 md:w-36 rounded-md bg-white/10 animate-pulse relative z-10" />
        ) : (
          <span className="text-white font-extrabold text-2xl md:text-3xl tracking-tight relative z-10">{prizePool}</span>
        )}
      </div>
      <div className="flex items-center gap-3 bg-[#0b1d35] border border-white/10 rounded-xl px-5 py-5 lg:flex-1 w-full shrink-0">
        <FileText className="w-4 h-4 text-gray-400 shrink-0" />
        <div>
          <p className="text-xs text-gray-400 leading-none mb-1.5">Submission</p>
          {isLoading ? (
            <div className="h-6 w-20 rounded-md bg-white/10 animate-pulse" />
          ) : (
            <p className="text-white font-extrabold text-xl leading-none">{submission}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 bg-[#0b1d35] border border-white/10 rounded-xl px-5 py-5 lg:flex-1 w-full shrink-0">
        <Clock className="w-4 h-4 text-gray-400 shrink-0" />
        <div>
          <p className="text-xs text-gray-400 leading-none mb-1.5">Ends in</p>
          {isLoading ? (
            <div className="h-6 w-24 rounded-md bg-white/10 animate-pulse" />
          ) : (
            <p className="text-white font-extrabold text-xl leading-none">{endIn}</p>
          )}
        </div>
      </div>
      <button className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 transition-colors rounded-xl px-6 py-5 lg:flex-1 w-full shrink-0">
        <Plus className="w-5 h-5 text-black" />
        <span className="text-black font-bold text-sm">Submit Now</span>
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────
// SHARED COMPONENTS
// ─────────────────────────────────────────────

function PrizeSidebar() {
  return (
    <div className="sticky top-4 space-y-3 max-w-[380px] ml-auto">
      <p className="text-white text-sm font-bold mb-1">Details</p>
      <div className="bg-black border border-white/10 rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
          <Trophy className="w-4 h-4 text-yellow-400 shrink-0" />
          <span className="text-gray-300 text-xs font-semibold">Prizes</span>
        </div>
        <div className="px-3 pt-3">
          <div className="relative flex items-center justify-between overflow-hidden bg-[#0b1d35] border border-white/10 rounded-xl px-6 py-5">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 blur-3xl">
              <div className="absolute right-8 top-0 h-full w-20 bg-white/[0.04] skew-x-[-15deg]" />
              <div className="absolute right-2 top-0 h-full w-10 bg-white/[0.03] skew-x-[-15deg]" />
            </div>
            <div className="flex items-center gap-2 relative z-10">
              <Trophy className="w-4 h-4 text-yellow-400 shrink-0" />
              <span className="text-white text-sm font-bold">Prize Pool</span>
            </div>
            <span className="text-white font-extrabold text-lg relative z-10">-</span>
          </div>
        </div>
        <div className="mx-3 mt-2 mb-3 border border-white/10 rounded-xl overflow-hidden">
          {PRIZE_BREAKDOWN.map((row, i) => (
            <div key={row.label} className={`flex justify-between items-center px-4 py-3 bg-[#0b1d35] ${i < PRIZE_BREAKDOWN.length - 1 ? 'border-b border-white/10' : ''}`}>
              <span className="text-gray-400 text-xs">{row.label}</span>
              <span className="text-gray-200 text-xs font-semibold">{row.amount}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#0b1d35] border border-white/10 rounded-xl px-4 py-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <FileText className="w-3.5 h-3.5 text-gray-400" />
            <p className="text-gray-400 text-[10px] uppercase tracking-wider">Submission</p>
          </div>
          <p className="text-white font-extrabold text-lg leading-none">-</p>
        </div>
        <div className="bg-[#0b1d35] border border-white/10 rounded-xl px-4 py-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <p className="text-gray-400 text-[10px] uppercase tracking-wider">Ends in</p>
          </div>
          <p className="text-white font-extrabold text-lg leading-none">-</p>
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
          <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between py-4 text-left hover:opacity-80 transition-opacity">
            <p className="text-gray-300 text-base">{faq.q}</p>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ml-4 transition-colors ${open === i ? 'bg-yellow-400' : 'border border-white/30 bg-transparent'}`}>
              <span className={`text-base font-bold leading-none ${open === i ? 'text-black' : 'text-white'}`}>{open === i ? '−' : '+'}</span>
            </div>
          </button>
          {open === i && <p className="text-gray-400 text-sm leading-relaxed pb-4">{faq.a}</p>}
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────
// TYPES FOR LEADERBOARD
// ─────────────────────────────────────────────

interface Creator {
  id: string | number
  name: string
  email?: string
  avatar?: string | null
  watch?: string | number
  likes?: string | number
  vote?: string | number
  views?: string | number
  play?: string | number
  totals?: string | number
}

interface AwardCategory {
  id: string | number
  name: string
  duration_from?: string | number
  duration_to?: string | number
  creator?: Creator[]
}

// ─────────────────────────────────────────────
// TAB: DETAILS (Timeline + Judges + Partners)
// ─────────────────────────────────────────────

function DetailsContent({ stats, statsLoading }: { stats: AwardsStats; statsLoading: boolean }) {
  return (
    <div className="space-y-12 mt-2">
      <StatsBar prizePool={stats.prizePool} submission={stats.submission} endIn={stats.endIn} isLoading={statsLoading} />

      {/* ── Important Dates ── */}
      <div>
        <h3 className="text-white font-bold text-2xl mb-1">Important Dates</h3>
        <p className="text-gray-400 text-sm mb-10">Mark your calendar and stay on track with every key deadline</p>
        <div className="relative">
          {/* Dashed line */}
          <div className="absolute top-[7px] left-0 right-0 border-t-2 border-dashed border-yellow-400/50" />
          <div className="flex justify-between relative">
            {TIMELINE.map((item, i) => {
              const isLast = i === TIMELINE.length - 1
              return (
                <div
                  key={i}
                  className={`flex flex-col w-1/4 ${isLast ? 'items-end' : 'items-start'}`}
                >
                  <div className="w-4 h-4 rounded-full bg-yellow-400 z-10 mb-4 shrink-0" />
                  <p className={`text-white text-sm font-bold ${isLast ? 'text-right' : ''}`}>
                    {item.label}
                  </p>
                  <p className={`text-gray-400 text-xs mt-0.5 ${isLast ? 'text-right' : ''}`}>
                    {item.date}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Meet the Judges ── */}
      <div>
        <h3 className="text-white font-bold text-2xl mb-1">Meet the Judges</h3>
        <p className="text-gray-400 text-sm mb-6">Experts from film, art, and AI ready to evaluate your cinematic creation.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {JUDGES.map((judge) => (
            <div key={judge.id} className="bg-[#0b1d35] border border-white/10 rounded-lg overflow-hidden">
              <div className="relative w-full aspect-[4/3] bg-gray-800">
                <Image
                  src={judge.image}
                  alt={judge.name}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  className="object-cover object-top"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              </div>
              <div className="p-4">
                <p className="text-gray-400 text-xs mb-1">{judge.company}</p>
                <p className="text-white font-bold text-sm mb-2">{judge.name}</p>
                <p className="text-gray-400 text-xs leading-relaxed">{judge.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Partners in the Spotlight ── */}
      <div>
        <h3 className="text-white font-bold text-2xl mb-1">Partners in the Spotlight</h3>
        <p className="text-gray-400 text-sm mb-8">Together with our sponsors, we empower creators to shine.</p>
        <div className="space-y-6 overflow-hidden">
          <MarqueeRow />
          <MarqueeRow reverse />
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// TAB: LEADERBOARD
// ─────────────────────────────────────────────

interface LeaderboardCreator {
  id: string | number
  name: string
  email?: string
  avatar?: string | null
  watch: string | number
  likes: string | number
  vote: string | number
  views: string | number
  play: string | number
  totals: string | number
}

interface LeaderboardCategory {
  id: string | number
  name: string
  displays?: string | number
  duration_from?: string | number
  duration_to?: string | number
  creator?: LeaderboardCreator[]
}

function num(v: string | number | undefined): number {
  return Number(v ?? 0)
}

function LeaderboardContent({ stats, statsLoading }: { stats: AwardsStats; statsLoading: boolean }) {
  const [categories, setCategories] = useState<LeaderboardCategory[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    
    const fetchLeaderboard = async () => {
      try {
        setLoading(true)
        setError(null)

        const token = typeof window !== 'undefined' ? localStorage.getItem('user_token') : null

        const res = await fetchWithRetry(
          '/api/awards/partdata',
          2,
          { 
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            signal: controller.signal
          }
        )
        const data = await res.json()
        const categoriesData = Array.isArray(data?.list)
          ? data.list
          : Array.isArray(data?.count)
          ? data.count
          : []

        if (data.status === true && categoriesData.length > 0) {
          setCategories(categoriesData as LeaderboardCategory[])
          setSelectedCategoryId(String(categoriesData[0].id))
        } else {
          setError(data.message ?? 'No data returned')
        }
      } catch (err: any) {
        if (err.name === 'AbortError') return
        console.error('[leaderboard] error:', err)
        setError('Failed to load leaderboard.')
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
    return () => controller.abort()
  }, [])

  const currentCategory = categories.find((c) => String(c.id) === selectedCategoryId)
  const creators: LeaderboardCreator[] = currentCategory?.creator ?? []
  const sorted = [...creators].sort((a, b) => num(b.totals) - num(a.totals))

  return (
    <div className="space-y-6 mt-2">
      <StatsBar prizePool={stats.prizePool} submission={stats.submission} endIn={stats.endIn} isLoading={statsLoading} />

      <div>
        <h3 className="text-white font-bold text-2xl">Real Time Leaderboard</h3>
        <p className="text-gray-400 text-sm mt-1">
          See which films are climbing the ranks based on viewer interaction.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="shrink-0 h-9 w-32 rounded-lg bg-white/5 animate-pulse" />
            ))
          : categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(String(cat.id))}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all shrink-0 ${
                  selectedCategoryId === String(cat.id)
                    ? 'bg-yellow-400 text-black'
                    : 'bg-transparent text-gray-300 border border-white/20 hover:border-white/40'
                }`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
                </svg>
                {cat.name}
              </button>
            ))}
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-12 rounded-lg bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-16">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      ) : sorted.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <p className="text-gray-400 text-sm">No data for this category yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-2 text-gray-400 font-semibold w-12">No.</th>
                <th className="text-left py-3 px-2 text-gray-400 font-semibold">Creator</th>
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">Most Vote</th>
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">Most Play</th>
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">Most Like</th>
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">Most Watch</th>
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">Most View</th>
                <th className="text-right py-3 px-2 text-gray-400 font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((creator, index) => {
                const rank = index + 1
                const rankColor = rank === 1 ? 'text-yellow-400' : rank === 2 ? 'text-gray-300' : rank === 3 ? 'text-amber-600' : 'text-gray-400'

                return (
                  <tr key={`${creator.id}-${index}`} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className={`py-4 px-2 text-sm font-bold ${rankColor}`}>{rank}.</td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2.5">
                        {creator.avatar ? (
                          <img
                            src={`https://cdn.usky.ai/avatars/${creator.avatar}`}
                            alt={creator.name}
                            className="w-7 h-7 rounded-full object-cover shrink-0 bg-gray-700"
                            onError={(e) => { ;(e.target as HTMLImageElement).style.display = 'none' }}
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-[#1e3a5f] flex items-center justify-center shrink-0">
                            <span className="text-[10px] font-bold text-gray-300 uppercase">
                              {creator.name?.charAt(0) ?? '?'}
                            </span>
                          </div>
                        )}
                        <span className="text-white text-sm font-medium truncate max-w-[140px]">
                          {creator.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-300 text-sm">{num(creator.vote).toLocaleString()}</td>
                    <td className="py-4 px-4 text-gray-300 text-sm">{num(creator.play).toLocaleString()}</td>
                    <td className="py-4 px-4 text-gray-300 text-sm">{num(creator.likes).toLocaleString()}</td>
                    <td className="py-4 px-4 text-gray-300 text-sm">{num(creator.watch).toLocaleString()}</td>
                    <td className="py-4 px-4 text-gray-300 text-sm">{num(creator.views).toLocaleString()}</td>
                    <td className="py-4 px-2 text-right">
                      <span className="text-yellow-400 font-bold text-sm">
                        {num(creator.totals).toLocaleString()}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// TAB: DIRECTION
// ─────────────────────────────────────────────

function DirectionContent({ stats, statsLoading }: { stats: AwardsStats; statsLoading: boolean }) {
  return (
    <div className="space-y-8 mt-2">
      <StatsBar prizePool={stats.prizePool} submission={stats.submission} endIn={stats.endIn} isLoading={statsLoading} />
      <div>
        <h2 className="text-white font-bold text-2xl mb-2">Direct with the Power of AI</h2>
        <p className="text-gray-400 text-sm">Explore a new era of filmmaking where AI meets imagination</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {DIRECTION_CATEGORIES.map((cat) => (
          <div key={cat.id} className="bg-[#0b1d35] border border-white/10 rounded-xl p-5 flex flex-col gap-4 hover:border-white/20 transition-colors">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center shrink-0 text-yellow-400">
                {cat.icon}
              </div>
              <h3 className="text-white font-bold text-sm leading-snug whitespace-pre-line">{cat.title}</h3>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed flex-1">{cat.description}</p>
            <div>
              {/* <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-2">Tools</p> */}
              {/* <div className="flex flex-wrap gap-1.5">
                {cat.tools.map((tool) => (
                  <span key={tool} className="border border-gray-300/40 bg-gray-300/30 text-transparent text-[10px] px-5 py-2 rounded-md">
                    {tool}
                  </span>
                ))}
              </div> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// TAB: SCORING
// ─────────────────────────────────────────────

function ScoringContent({ stats, statsLoading }: { stats: AwardsStats; statsLoading: boolean }) {
  const JURY_CRITERIA = [
    { icon: '🤖', label: 'AI Integration',       desc: 'How creatively and effectively AI tools are used in the filmmaking process.',        weight: '25%' },
    { icon: '💫', label: 'Originality & Creativity', desc: 'Uniqueness of concept, storytelling, and visual execution.',                     weight: '20%' },
    { icon: '🎬', label: 'Storytelling',         desc: 'Coherence, emotional impact, and clarity of the narrative.',                         weight: '20%' },
    { icon: '🎛️', label: 'Technical Quality',    desc: 'Quality of editing, sound design, visual production, and overall polish.',           weight: '15%' },
    { icon: '🎨', label: 'Artistic Style',       desc: 'Composition, color use, pacing, and artistic direction.',                            weight: '10%' },
    { icon: '💥', label: 'Overall Impact',       desc: 'The lasting impression and audience resonance.',                                     weight: '10%' },
  ]

  return (
    <div className="space-y-6 mt-2">
      <StatsBar prizePool={stats.prizePool} submission={stats.submission} endIn={stats.endIn} isLoading={statsLoading} />
      <div>
        <h3 className="text-white font-bold text-2xl mb-2">Scoring Breakdown</h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          Every great film deserves recognition—from professionals and the public.<br />
          At USKY AWARD 2025, we combine expert evaluation and audience engagement to choose the best.
        </p>
      </div>
      <div>
        <p className="text-white text-base mb-4">
          <span className="font-bold italic">Judges' Evaluation</span>
          <span className="text-gray-400 font-normal"> (70% of Final Score)</span>
        </p>
        <div className="w-full">
          <div className="grid grid-cols-12 px-4 py-2 text-gray-500 text-xs font-semibold uppercase tracking-wider border-b border-white/10">
            <div className="col-span-3">Criteria</div>
            <div className="col-span-7">Description</div>
            <div className="col-span-2 text-right">Weight</div>
          </div>
          {JURY_CRITERIA.map((item, i) => (
            <div key={i} className={`grid grid-cols-12 px-4 py-4 items-center ${i < JURY_CRITERIA.length - 1 ? 'border-b border-white/5' : ''} hover:bg-white/[0.02] transition-colors`}>
              <div className="col-span-3 flex items-center gap-2">
                <span className="text-base">{item.icon}</span>
                <span className="text-white text-sm font-medium">{item.label}</span>
              </div>
              <div className="col-span-7 text-gray-400 text-sm">{item.desc}</div>
              <div className="col-span-2 text-right text-white font-bold text-sm">{item.weight}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="border border-yellow-400/30 bg-yellow-400/5 rounded-xl px-6 py-5">
        <p className="text-white font-bold text-base mb-1">
          Audience Metrics <span className="font-normal text-gray-400">(30% of Final Score)</span>
        </p>
        <p className="text-gray-400 text-sm">
          Let the public speak! Audience support on the USKY.AI platform counts too based on{' '}
          <span className="text-yellow-400 font-semibold">Plays</span>,{' '}
          <span className="text-yellow-400 font-semibold">Watchlists</span>,{' '}
          <span className="text-yellow-400 font-semibold">Likes</span>,{' '}
          <span className="text-yellow-400 font-semibold">Shares</span>, and{' '}
          <span className="text-yellow-400 font-semibold">Views</span>.
        </p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// RULES SECTIONS DATA
// ─────────────────────────────────────────────

const RULES_CARDS = [
  {
    title: 'Eligibility',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" />
      </svg>
    ),
    items: ['Open to individuals aged 15 years and above.', 'Participants may enter as individuals or teams (max 5 members).', 'Open to Indonesian citizens and residents only for the 2025 edition.'],
  },
  {
    title: 'Film Requirements',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="2" y="2" width="20" height="20" rx="2" /><line x1="7" y1="2" x2="7" y2="22" /><line x1="17" y1="2" x2="17" y2="22" /><line x1="2" y1="7" x2="7" y2="7" /><line x1="17" y1="7" x2="22" y2="7" /><line x1="2" y1="12" x2="22" y2="12" /><line x1="2" y1="17" x2="7" y2="17" /><line x1="17" y1="17" x2="22" y2="17" />
      </svg>
    ),
    items: ['Maximum duration: 60 minutes (including credits).', 'Language: Any, but English or Bahasa Indonesia subtitles are mandatory.', 'The film must incorporate AI tools in at least one of these areas: script, visual, animation, voice, or editing.', 'Genre must be selected from the provided list.'],
  },
  {
    title: 'Originality',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="5" y="2" width="14" height="20" rx="2" /><polyline points="9 12 11 14 15 10" /><line x1="9" y1="7" x2="15" y2="7" />
      </svg>
    ),
    items: ['All films must be original and not previously published or submitted to other competitions.', 'AI-generated content must be originally created by the participant, not reused from pre-existing works.'],
  },
  {
    title: 'Submission',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><polyline points="9 15 12 12 15 15" />
      </svg>
    ),
    items: ['Submissions must be uploaded via USKY.AI platform within the designated submission period.', 'Each participant/team can submit up to 2 films, but only one can win.', 'Late submissions will not be accepted.'],
  },
  {
    title: 'Judging & Audience Votes',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="9" cy="7" r="4" /><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
      </svg>
    ),
    items: ['70% Jury Score: Based on creativity, use of AI, storytelling, visual execution, and impact.', '30% Audience Score: Based on Plays, Likes, Shares, Views, and Watchlists on USKY.AI platform.', 'All decisions by the judges and organizers are final and binding.'],
  },
  {
    title: 'Rights & Usage',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="12" cy="12" r="10" /><polyline points="9 12 11 14 15 10" />
      </svg>
    ),
    items: ['Participants retain ownership of their films.', 'By submitting, participants grant USKY.AI the non-exclusive right to showcase, promote, and distribute the film for non-commercial promotional purposes with proper credit.', 'Plagiarism, copyright infringement, offensive content, or violation of any rule will result in immediate disqualification.'],
  },
]

// ─────────────────────────────────────────────
// TAB: RULES
// ─────────────────────────────────────────────

function RulesContent({ stats, statsLoading }: { stats: AwardsStats; statsLoading: boolean }) {
  return (
    <div className="space-y-8 mt-2">
      <StatsBar prizePool={stats.prizePool} submission={stats.submission} endIn={stats.endIn} isLoading={statsLoading} />
      <div>
        <h3 className="text-white font-bold text-2xl mb-1">The Rules of the Reel</h3>
        <p className="text-gray-400 text-sm">From eligibility to judging make sure your masterpiece qualifies for the spotlight.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {RULES_CARDS.map((card) => (
          <div key={card.title} className="bg-[#0b1d35] border border-white/10 rounded-xl p-5 flex flex-col gap-4 hover:border-white/20 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center shrink-0 text-yellow-400">
                {card.icon}
              </div>
              <h4 className="text-white font-bold text-sm leading-snug">{card.title}</h4>
            </div>
            <ul className="space-y-2">
              {card.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-400 text-xs leading-relaxed">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// TAB: FAQ
// ─────────────────────────────────────────────

function FaqContent({ stats, statsLoading }: { stats: AwardsStats; statsLoading: boolean }) {
  return (
    <div className="space-y-8 mt-2">
      <StatsBar prizePool={stats.prizePool} submission={stats.submission} endIn={stats.endIn} isLoading={statsLoading} />
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

// ─────────────────────────────────────────────
// TAB: FILMS
// ─────────────────────────────────────────────

interface Category {
  id: string
  name: string
}

function FilmsContent({ stats, statsLoading }: { stats: AwardsStats; statsLoading: boolean }) {
  const [filterBy, setFilterBy] = useState('Latest')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Inisialisasi awal bersih (array kosong) agar tidak meload dummy data sebelum Fetch API selesai
  const [submissions, setSubmissions] = useState<AwardSubmission[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  
  const [loading, setLoading] = useState(false)
  const [categoriesLoading, setCategoriesLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [awardDetail, setAwardDetail] = useState<any>(null)
  const [awardDetailLoading, setAwardDetailLoading] = useState(false)
  const [showAwardDetail, setShowAwardDetail] = useState(false)
  const awardsCacheRef = useRef<Record<string, { submissions: AwardSubmission[]; totalPages: number; fetchedAt: number }>>({})

  const handleCardClick = (id: string | number) => {
    fetch(`https://api.usky.ai/award/view?id=${id}`, { keepalive: true }).catch(() => {})
    fetch(`https://api.usky.ai/award/play?id=${id}`, { keepalive: true }).catch(() => {})
  }

  const getSortParam = (filter: string) => {
    switch (filter) {
      case 'Trending':    return 'latest'
      case 'Most Liked':  return 'likes'
      case 'Most Viewed': return 'views'
      default:            return 'latest'
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true)
        const token = localStorage.getItem('user_token')
        const response = await fetch('/api/awards/category', {
          method: 'GET',
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          signal: controller.signal
        })
        const data = await response.json()
        if (data.status === true && data.list && Array.isArray(data.list) && data.list.length > 0) {
          setCategories(data.list as Category[])
        } else {
          setCategories([])
        }
      } catch (error: any) {
        if (error.name === 'AbortError') return
        console.error('[v0] Failed to fetch categories:', error)
        setCategories([])
      } finally {
        setCategoriesLoading(false)
      }
    }
    fetchCategories()
    return () => controller.abort()
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const fetchAwardDetail = async () => {
      try {
        setAwardDetailLoading(true)
        const response = await fetch('/api/awards/detail?id=', { signal: controller.signal })
        const data = await response.json()
        if (data.list) {
          setAwardDetail(data.list)
          setShowAwardDetail(true)
        }
      } catch (error: any) {
        if (error.name === 'AbortError') return
        console.error('[v0] Failed to fetch award detail:', error)
      } finally {
        setAwardDetailLoading(false)
      }
    }
    fetchAwardDetail()
    return () => controller.abort()
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const fetchAwards = async () => {
      try {
        const sort = getSortParam(filterBy)
        const token = localStorage.getItem('user_token')
        const cacheKey = `${sort}|${selectedCategory || 'all'}|${currentPage}`
        const cached = awardsCacheRef.current[cacheKey]
        const now = Date.now()
        const CACHE_TTL_MS = 60_000

        if (cached) {
          setSubmissions(cached.submissions)
          setTotalPages(cached.totalPages)
          setLoading(false)
          if (now - cached.fetchedAt < CACHE_TTL_MS) {
            return
          }
        } else {
          setLoading(true)
        }

        if (!token) {
          setSubmissions([])
          setTotalPages(1)
          setLoading(false)
          return
        }

        const params = new URLSearchParams({
          sort,
          page: currentPage.toString(),
          limit: '20',
          view_type: 'potrait',
        })
        if (selectedCategory) params.append('id_category', selectedCategory)

        const response = await fetch(`/api/awards/list?${params.toString()}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal
        })
        const data = await response.json()
        if (data.status === true && data.list && Array.isArray(data.list)) {
          const nextSubmissions = data.list as AwardSubmission[]
          const nextTotalPages = data.meta ? (data.meta.total_pages || 1) : 1
          setSubmissions(nextSubmissions)
          setTotalPages(nextTotalPages)
          awardsCacheRef.current[cacheKey] = {
            submissions: nextSubmissions,
            totalPages: nextTotalPages,
            fetchedAt: now,
          }
        } else {
          setSubmissions([])
          setTotalPages(1)
          awardsCacheRef.current[cacheKey] = {
            submissions: [],
            totalPages: 1,
            fetchedAt: now,
          }
        }
      } catch (error: any) {
        if (error.name === 'AbortError') return
        console.error('[v0] Failed to fetch awards:', error)
        setSubmissions([])
        setTotalPages(1)
      } finally {
        setLoading(false)
      }
    }
    fetchAwards()
    return () => controller.abort()
  }, [filterBy, selectedCategory, currentPage])

  const filteredSubmissions = useMemo(() => {
    if (!searchQuery) return submissions
    const q = searchQuery.toLowerCase()
    return submissions.filter((s) => s.name.toLowerCase().includes(q))
  }, [submissions, searchQuery])

  const paginationItems = useMemo<(number | string)[]>(() => {
    if (totalPages <= 1) return [1]
    const pages = new Set<number>([1, totalPages, currentPage - 1, currentPage, currentPage + 1])
    const sortedPages = Array.from(pages).filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b)

    const items: (number | string)[] = []
    for (let i = 0; i < sortedPages.length; i += 1) {
      const page = sortedPages[i]
      const prev = sortedPages[i - 1]
      if (i > 0 && page - prev > 1) {
        items.push('...')
      }
      items.push(page)
    }
    return items
  }, [currentPage, totalPages])

  return (
    <div className="space-y-8">
      {/* ── Award Detail Section ── */}
      {showAwardDetail && awardDetail && (
        <div className="bg-[#0b1d35] border border-white/10 rounded-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 md:p-8">
            <div className="md:col-span-1 flex items-center justify-center">
              <div className="relative w-full aspect-[3/4] overflow-hidden rounded-lg bg-gray-800">
                <Image
                  src={awardDetail.image_landscape_url || awardDetail.image_url || '/film/film1.png'}
                  alt={awardDetail.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="md:col-span-2 flex flex-col justify-between">
              <div>
                {awardDetail.dates && (
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-gray-400 bg-[#1e3a5f] rounded-full px-3 py-1">
                      {new Date(awardDetail.dates).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                )}
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{awardDetail.name}</h2>
                <div className="text-gray-400 text-base leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: awardDetail.description || '' }} />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-[#1e3a5f] rounded-lg p-3">
                  <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Watches</p>
                  <p className="text-white font-bold text-lg">{awardDetail.watch || 0}</p>
                </div>
                <div className="bg-[#1e3a5f] rounded-lg p-3">
                  <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Likes</p>
                  <p className="text-white font-bold text-lg">{awardDetail.likes || 0}</p>
                </div>
                <div className="bg-[#1e3a5f] rounded-lg p-3">
                  <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Votes</p>
                  <p className="text-white font-bold text-lg">{awardDetail.vote || 0}</p>
                </div>
                <div className="bg-[#1e3a5f] rounded-lg p-3">
                  <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Views</p>
                  <p className="text-white font-bold text-lg">{awardDetail.views || 0}</p>
                </div>
              </div>
              {awardDetail.video_url && (
                <div className="mt-6">
                  <a
                    href={awardDetail.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-6 py-3 rounded-lg transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    Watch Video
                  </a>
                </div>
              )}
            </div>
          </div>
          {awardDetail.relate && Array.isArray(awardDetail.relate) && awardDetail.relate.length > 0 && (
            <div className="border-t border-white/10 p-6 md:p-8">
              <h3 className="text-xl font-bold text-white mb-4">Related Awards</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                {awardDetail.relate.map((related: any) => (
                  <Link
                    key={related.id}
                    href={`/dashboard/awards/detail?id=${related.id}`}
                    prefetch={false}
                    className="group relative overflow-hidden rounded-lg bg-[#1e293b] hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => handleCardClick(related.id)}
                  >
                    <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-800">
                      <Image
                        src={related.image_landscape_url || related.image_url || '/film/film1.png'}
                        alt={related.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                      <div className="absolute inset-0 flex flex-col justify-end p-2.5">
                        <h4 className="text-xs md:text-sm font-bold text-white leading-tight mb-0.5 line-clamp-2">{related.name}</h4>
                        <div className="flex items-center justify-between text-white/70">
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3 md:w-3.5 md:h-3.5" />
                            <span className="text-[10px] md:text-xs font-medium">{related.likes || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3 md:w-3.5 md:h-3.5" />
                            <span className="text-[10px] md:text-xs font-medium">{related.views || 0}</span>
                          </div>
                        </div>
                      </div>
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                          <Play className="w-4 h-4 md:w-5 md:h-5 text-white fill-white" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Stats bar ── */}
      <StatsBar prizePool={stats.prizePool} submission={stats.submission} endIn={stats.endIn} isLoading={statsLoading} />

      {/* ── Submissions Grid ── */}
      <div>
        <h2 className="text-base font-bold text-white mb-4">All Submission</h2>
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-5 scrollbar-hide">
          <button
            onClick={() => { setSelectedCategory(''); setCurrentPage(1) }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all shrink-0 ${
              selectedCategory === ''
                ? 'bg-yellow-400 text-black border border-yellow-400'
                : 'bg-transparent text-gray-300 border border-white/20 hover:border-white/40 hover:text-white'
            }`}
          >
            All Category
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.id); setCurrentPage(1) }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-yellow-400 text-black border border-yellow-400'
                  : 'bg-transparent text-gray-300 border border-white/20 hover:border-white/40 hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {loading && filteredSubmissions.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-gray-400 animate-pulse">Loading awards...</div>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-gray-400">No awards found</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 transition-all duration-500 w-full">
            {filteredSubmissions.map((submission, index) => (
              <Link
                key={submission.id}
                href={`/dashboard/awards/detail?id=${submission.id}`}
                prefetch={false}
                className="group relative overflow-hidden rounded-xl bg-[#0f172a] hover:shadow-lg transition-all duration-300 cursor-pointer w-full border border-white/8 hover:border-white/20"
                onClick={() => handleCardClick(submission.id)}
              >
                <div className="relative w-full aspect-[2/3] overflow-hidden bg-gray-800">
                  <Image
                    src={submission.image_url || '/film/film1.png'}
                    alt={submission.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                    loading={index < 6 ? 'eager' : 'lazy'}
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-2.5">
                    <h3 className="text-xs md:text-sm font-bold text-white leading-tight mb-0.5 line-clamp-2">{submission.name}</h3>
                    <div className="flex items-center justify-between text-white/70">
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3 md:w-3.5 md:h-3.5" />
                        <span className="text-[10px] md:text-xs font-medium">{submission.likes || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3 md:w-3.5 md:h-3.5" />
                        <span className="text-[10px] md:text-xs font-medium">{submission.views || 0}</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                      <Play className="w-4 h-4 md:w-5 md:h-5 text-white fill-white" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex justify-center pt-8">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-[#0b1d35] border border-white/15 text-gray-300 rounded-lg text-sm font-semibold hover:border-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            {paginationItems.map((item, index) =>
              item === '...' ? (
                <span key={`ellipsis-${index}`} className="px-2 text-gray-500 text-sm">
                  ...
                </span>
              ) : (
                <button
                  key={`page-${item}`}
                  onClick={() => setCurrentPage(item as number)}
                  className={`min-w-[36px] px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    currentPage === item
                      ? 'bg-yellow-400 text-black border border-yellow-400'
                      : 'bg-[#0b1d35] text-gray-300 border border-white/15 hover:border-white/30'
                  }`}
                >
                  {item}
                </button>
              )
            )}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 bg-[#0b1d35] border border-white/15 text-gray-300 rounded-lg text-sm font-semibold hover:border-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────

export default function AwardsPage() {
  const [activeTab, setActiveTab] = useState('Films')
  const [statsLoading, setStatsLoading] = useState(true)
  const [stats, setStats] = useState<AwardsStats>({
    prizePool: '-',
    submission: '-',
    endIn: '-',
    creatorCount: '-',
  })

  useEffect(() => {
    const controller = new AbortController()
    const fetchPartdata = async () => {
      try {
        setStatsLoading(true)
        const token = typeof window !== 'undefined' ? localStorage.getItem('user_token') : null
        const res = await fetchWithRetry('/api/awards/partdata', 2, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          signal: controller.signal,
        })
        const data = await res.json()
        setStats({
          prizePool:
            data?.prize_pool !== undefined && data?.prize_pool !== null
              ? data.prize_pool
              : '-',
          submission:
            data?.submission !== undefined && data?.submission !== null
              ? data.submission
              : '-',
          endIn: formatEndInLabel(data?.end_in),
          creatorCount:
            data?.creator_count !== undefined && data?.creator_count !== null
              ? data.creator_count
              : '-',
        })
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('[awards] partdata error:', error)
        }
      } finally {
        if (!controller.signal.aborted) setStatsLoading(false)
      }
    }
    fetchPartdata()
    return () => controller.abort()
  }, [])

  return (
    <div className="min-h-screen bg-[#050d1a] text-white font-sans">
      <Header />

      {/* ── HERO ── */}
      <div className="relative w-full overflow-hidden bg-[#050d1a]" style={{ minHeight: '280px' }}>
        <Image src="/images/awards/imageawards.png" alt="Awards hero" fill sizes="100vw" className="object-cover object-center opacity-50" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050d1a]/95 via-[#050d1a]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050d1a]" />
        <div className="relative w-full px-6 md:px-8 pt-8 pb-6 md:pt-12 md:pb-8 flex flex-col justify-end" style={{ minHeight: '280px' }}>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="flex -space-x-2.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#050d1a] bg-gray-600 overflow-hidden relative" style={{ zIndex: 4 - i }}>
                  <Image src={`/images/avatar${i}.png`} alt="" width={32} height={32} className="object-cover w-full h-full" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                </div>
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-[#050d1a] bg-[#1e3a5f] flex items-center justify-center text-[10px] font-bold text-white" style={{ zIndex: 0 }}>+3</div>
            </div>
            {statsLoading ? (
              <span className="inline-block h-4 w-28 rounded bg-white/10 animate-pulse" />
            ) : (
              <Link
                href="/dashboard/awards/creator-award"
                className="text-gray-300 text-sm font-medium hover:text-white transition-colors"
              >
                Join {stats.creatorCount !== '-' ? `${stats.creatorCount}+` : '240+'} others
              </Link>
            )}
          </div>
          <div className="flex items-center gap-1.5 mb-5">
            <div className="flex items-center gap-1.5 border border-white/20 rounded-full px-3 py-1 w-fit bg-black/20 backdrop-blur-sm">
              <Clock className="w-3.5 h-3.5 text-gray-300" />
              {statsLoading ? (
                <span className="inline-block h-3 w-16 rounded bg-white/10 animate-pulse" />
              ) : (
                <span className="text-gray-300 text-[11px] uppercase tracking-widest font-semibold">
                  Ends in {stats.endIn}
                </span>
              )}
            </div>
          </div>
          <h1 className="text-xl md:text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight mb-3 text-white whitespace-nowrap">
            Indonesia's Biggest AI Film Revolution Starts Here<br />1 BILLION IDR in Prizes + National Fame
          </h1>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed">Your film could be the next viral AI masterpiece — seen, judged, and celebrated across Indonesia.</p>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="bg-[#050d1a] py-2">
        <div className="px-6 md:px-8 overflow-x-auto">
          <div className="inline-flex items-center border border-white/15 rounded-full bg-[#0b1d35]/60 p-1 gap-1 min-w-max">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-5 py-2 text-sm font-semibold rounded-full transition-all duration-200 whitespace-nowrap ${
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

      {/* ── TAB CONTENT ── */}
      <div className="px-6 md:px-8 pb-20 mt-6 space-y-6">
        {activeTab === 'Films'       && <FilmsContent stats={stats} statsLoading={statsLoading} />}
        {activeTab === 'Leaderboard' && <LeaderboardContent stats={stats} statsLoading={statsLoading} />}
        {activeTab === 'Details'     && <DetailsContent stats={stats} statsLoading={statsLoading} />}
        {activeTab === 'Direction'   && <DirectionContent stats={stats} statsLoading={statsLoading} />}
        {activeTab === 'Scoring'     && <ScoringContent stats={stats} statsLoading={statsLoading} />}
        {activeTab === 'Rules'       && <RulesContent stats={stats} statsLoading={statsLoading} />}
        {activeTab === 'FAQ'         && <FaqContent stats={stats} statsLoading={statsLoading} />}
      </div>

      <Footer />
    </div>
  )
}

async function fetchWithRetry(
  url: string,
  retries = 2,
  options?: RequestInit
) {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        ...options,
      })
      if (res.ok) return res
      if (i < retries) await new Promise(r => setTimeout(r, 1000 * (i + 1)))
    } catch (err: any) {
      if (err.name === 'AbortError') throw err // Berhenti retry jika dibatalkan (unmount)
      if (i < retries) await new Promise(r => setTimeout(r, 1000 * (i + 1)))
    }
  }
  throw new Error('Fetch gagal setelah retry')
}
