'use client'
 
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Heart, Eye, Search, Plus, Clock, FileText, Trophy, Play } from 'lucide-react'
import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
 
interface AwardSubmission {
  id: string | number
  name: string
  image_url: string
  likes?: number | string
  views?: number | string
  play?: number | string
}
 
const FILTER_OPTIONS = ['Trending', 'Latest', 'Most Liked', 'Most Viewed']
const TABS = ['Projects', 'Theme', 'Terms']
 
const PRIZE_BREAKDOWN = [
  { label: '1st',                amount: 'IDR 300,000,000' },
  { label: '2nd',                amount: 'IDR 200,000,000' },
  { label: '3rd',                amount: 'IDR 100,000,000' },
  { label: 'Honorable Mentions', amount: 'IDR 10,000,000'  },
]
 
const FAQS = [
  { q: 'Who can join the competition?',               a: "Anyone — whether you're a student, professional, digital artist, or simply an AI enthusiast — everyone is welcome to submit their AI-powered short films." },
  { q: 'Does my film have to be fully made with AI?', a: "AI must play a meaningful role in your production process, but you don't have to use AI for every single element. Human creativity combined with AI tools is encouraged." },
  { q: 'Can I use copyrighted materials in my film?', a: 'No. All submitted films must use original or properly licensed content. Using copyrighted music, footage, or images without permission will result in disqualification.' },
  { q: 'How long should the film be?',                a: 'Minimum 30 seconds, maximum 15 minutes depending on category. Please check the specific category guidelines for exact duration requirements.' },
]
 
const SPECIAL_CATEGORIES = [
  { name: 'Best AI Short Film',  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400"><rect x="2" y="6" width="20" height="12" rx="2"/><polygon points="10 9 15 12 10 15 10 9"/></svg> },
  { name: 'Best AI Advertising', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400"><path d="M11 20H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4"/><path d="M11 4v16"/><path d="M11 8h6l3-2v12l-3-2h-6"/><path d="M3 14v4a2 2 0 0 0 2 2h2"/></svg> },
  { name: 'Best AI Animation',   icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400"><rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/><polygon points="10 10 14 12 10 14 10 10"/></svg> },
  { name: 'Best AI Documentary', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polygon points="10 12 15 15 10 18 10 12"/></svg> },
  { name: 'Best AI Long Film',   icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg> },
  { name: 'Best AI Music Video', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M10 8l6 4-6 4V8z"/></svg> },
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
            <span className="text-white font-extrabold text-lg relative z-10">200 USKY</span>
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
// TAB: THEME
// ─────────────────────────────────────────────
 
function ThemeContent() {
  const [leaderboardData, setLeaderboardData] = useState<AwardCategory[]>([])
  const [leaderboardLoading, setLeaderboardLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | number>('1')
 
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLeaderboardLoading(true)
        const response = await fetch('/api/awards/leaderboard')
        const data = await response.json()
        if (data.count && Array.isArray(data.count)) {
          setLeaderboardData(data.count)
          if (data.count.length > 0) {
            setSelectedCategory(data.count[0].id)
          }
        }
      } catch (error) {
        console.error('[v0] Failed to fetch leaderboard:', error)
        setLeaderboardData([])
      } finally {
        setLeaderboardLoading(false)
      }
    }
    fetchLeaderboard()
  }, [])
 
  const currentCategory = leaderboardData.find(cat => cat.id === selectedCategory)
  const creators = currentCategory?.creator || []
 
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-2">
      <div className="md:col-span-2 space-y-8">
        <div>
          <h3 className="text-white font-bold text-2xl mb-0.5">Theme</h3>
          <p className="text-yellow-400 text-base font-semibold mb-2">Create Without Limits</p>
          <p className="text-gray-400 text-base leading-relaxed">USKY AI Film Awards invites creators across Indonesia to produce original films powered by Artificial Intelligence.</p>
        </div>
        <div>
          <p className="text-gray-300 text-base font-semibold mb-2">· You can create:</p>
          <ul className="text-gray-400 text-base space-y-1.5 ml-3">
            {['Short Film', 'Video Advertising', 'Animation Film', 'Long Film', 'Documentary AI Film', 'Video Clip'].map((item) => (
              <li key={item}>– {item}</li>
            ))}
          </ul>
        </div>
        <div className="space-y-2">
          <p className="text-gray-400 text-base leading-relaxed">Any genre is welcome — action, drama, sci-fi, romance, thriller, experimental — as long as AI plays a meaningful role in your production process.</p>
          <p className="text-gray-400 text-base">🎥 Minimum duration: 30 seconds</p>
          <p className="text-gray-400 text-base">🎞 Maximum duration: 15 minutes (depending on category)</p>
          <p className="text-gray-400 text-base">🤖 AI tools allowed: text-to-video, image generation, AI voice, AI editing, AI compositing, and more.</p>
        </div>
        <p className="text-gray-300 text-base font-semibold italic">This is your moment to redefine filmmaking in the AI era.</p>
 
        {/* Prize Pool Podium */}
        <div className="w-full">
          <p className="text-white text-2xl font-bold mb-5 uppercase tracking-tight">💰 Prize Pool — IDR 1,000,000,000 Total</p>
          <div className="flex items-end justify-center gap-3 md:gap-6 mb-10 mt-16 w-full max-w-6xl mx-auto px-4">
            {/* 2nd */}
            <div className="flex flex-col items-center w-full max-w-[280px]">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden mb-3 border border-white/10 shadow-lg bg-slate-800">
                <Image src="/images/imagel.png" alt="2nd place" width={96} height={96} className="object-cover w-full h-full" />
              </div>
              <p className="text-white text-lg md:text-xl font-bold mb-6">Brian Ngo</p>
              <div className="relative w-full flex flex-col items-center">
                <div className="w-full h-[45px] relative z-0" style={{ background: 'linear-gradient(180deg, #1e3a5f 0%, #112540 100%)', clipPath: 'polygon(12% 0%, 88% 0%, 100% 100%, 0% 100%)' }}>
                  <div className="absolute top-0 left-[12%] right-[12%] h-[1px] bg-white/20" />
                </div>
                <div className="w-full h-[200px] bg-gradient-to-b from-[#0f2038] to-[#020d1f]/0 border-t border-white/10 flex flex-col items-center pt-10 px-4 shadow-2xl relative -mt-[1px]">
                  <div className="absolute -top-6 w-12 h-12 bg-[#cbd5e1] rounded-xl flex items-center justify-center shadow-[0_8px_25px_rgba(0,0,0,0.5)] z-10"><Trophy className="w-6 h-6 text-slate-700" /></div>
                  <p className="text-gray-400 text-xs md:text-sm mb-4 uppercase tracking-widest">Earn 2,000 USKY</p>
                  <p className="text-white font-bold text-xl md:text-2xl mb-3">IDR 200,000,000</p>
                  <div className="flex items-center gap-1.5 opacity-80"><span className="text-sm">🥈</span><p className="text-gray-300 text-sm">2nd Place</p></div>
                </div>
              </div>
            </div>
            {/* 1st */}
            <div className="flex flex-col items-center w-full max-w-[320px]">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden mb-4 border-2 border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.2)] bg-slate-800">
                <Image src="/images/imagew.png" alt="1st place" width={112} height={112} className="object-cover w-full h-full" />
              </div>
              <p className="text-white text-xl md:text-2xl font-bold mb-8">Jolie Joie</p>
              <div className="relative w-full flex flex-col items-center">
                <div className="w-full h-[55px] relative z-0" style={{ background: 'linear-gradient(180deg, #254b85 0%, #162f55 100%)', clipPath: 'polygon(12% 0%, 88% 0%, 100% 100%, 0% 100%)' }}>
                  <div className="absolute top-0 left-[12%] right-[12%] h-[1px] bg-white/30" />
                </div>
                <div className="w-full h-[300px] bg-gradient-to-b from-[#162f55] to-[#020d1f]/0 border-t border-white/20 flex flex-col items-center pt-12 px-4 shadow-2xl relative -mt-[1px]">
                  <div className="absolute -top-7 w-14 h-14 bg-[#ecc159] rounded-xl flex items-center justify-center shadow-[0_10px_30px_rgba(236,193,89,0.4)] z-10"><Trophy className="w-7 h-7 text-yellow-900" /></div>
                  <p className="text-gray-400 text-xs md:text-sm mb-5 uppercase tracking-widest">Earn 2,000 USKY</p>
                  <p className="text-white font-black text-2xl md:text-3xl mb-4">IDR 300,000,000</p>
                  <div className="flex items-center gap-1.5"><span className="text-base">🥇</span><p className="text-[#ecc159] text-sm font-bold uppercase tracking-wide">1st Place</p></div>
                </div>
              </div>
            </div>
            {/* 3rd */}
            <div className="flex flex-col items-center w-full max-w-[280px]">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden mb-3 border border-white/10 shadow-lg bg-slate-800">
                <Image src="/images/imagej.png" alt="3rd place" width={96} height={96} className="object-cover w-full h-full" />
              </div>
              <p className="text-white text-lg md:text-xl font-bold mb-6">David Do</p>
              <div className="relative w-full flex flex-col items-center">
                <div className="w-full h-[45px] relative z-0" style={{ background: 'linear-gradient(180deg, #1e3a5f 0%, #112540 100%)', clipPath: 'polygon(12% 0%, 88% 0%, 100% 100%, 0% 100%)' }}>
                  <div className="absolute top-0 left-[12%] right-[12%] h-[1px] bg-white/20" />
                </div>
                <div className="w-full h-[140px] bg-gradient-to-b from-[#0f2038] to-[#020d1f]/0 border-t border-white/10 flex flex-col items-center pt-10 px-4 shadow-2xl relative -mt-[1px]">
                  <div className="absolute -top-6 w-12 h-12 bg-[#b8784d] rounded-xl flex items-center justify-center shadow-[0_8px_25px_rgba(0,0,0,0.5)] z-10"><Trophy className="w-6 h-6 text-orange-100" /></div>
                  <p className="text-gray-400 text-xs md:text-sm mb-4 uppercase tracking-widest">Earn 2,000 USKY</p>
                  <p className="text-white font-bold text-xl md:text-2xl mb-3">IDR 100,000,000</p>
                  <div className="flex items-center gap-1.5 opacity-80"><span className="text-sm">🥉</span><p className="text-orange-400 text-sm">3rd Place</p></div>
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
                <div className="flex items-center gap-2">{cat.icon}<p className="text-gray-400 text-sm">{cat.name}</p></div>
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
            <div className="absolute top-2 left-2 right-116 h-[2px]" style={{ background: 'none', borderTop: '2px dashed rgba(234, 179, 8, 0.5)' }} />
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
              <li key={item.text} className="flex items-center gap-2"><span>{item.icon}</span>{item.text}</li>
            ))}
          </ul>
        </div>
 
        {/* Submit Steps */}
        <div className="max-w-5xl">
          <p className="text-white text-xl font-bold mb-2">Submit Your Film</p>
          <p className="text-gray-400 text-base mb-4">Step-by-step guide to submit your AI-powered short film to the platform.</p>
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
 
        {/* Leaderboard Section */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <h3 className="text-white font-bold text-2xl mb-6">🏆 Leaderboard</h3>
 
          {/* Category Selector */}
          <div className="flex gap-3 overflow-x-auto pb-4 mb-6">
            {leaderboardData.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === category.id
                    ? 'bg-yellow-400 text-black'
                    : 'bg-[#0b1d35] text-gray-300 border border-white/10 hover:border-white/30'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
 
          {/* Leaderboard Table */}
          <div className="bg-[#0b1d35] border border-white/10 rounded-xl overflow-hidden">
            {leaderboardLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-gray-400">Loading leaderboard...</div>
              </div>
            ) : creators.length === 0 ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-gray-400">No leaderboard data available</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-[#0f2847]">
                      <th className="px-6 py-4 font-semibold text-gray-300">Rank</th>
                      <th className="px-6 py-4 font-semibold text-gray-300">Creator</th>
                      <th className="px-6 py-4 font-semibold text-gray-300 text-right">Watches</th>
                      <th className="px-6 py-4 font-semibold text-gray-300 text-right">Likes</th>
                      <th className="px-6 py-4 font-semibold text-gray-300 text-right">Votes</th>
                      <th className="px-6 py-4 font-semibold text-gray-300 text-right">Views</th>
                      <th className="px-6 py-4 font-semibold text-gray-300 text-right">Plays</th>
                      <th className="px-6 py-4 font-semibold text-yellow-400 text-right">Total Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {creators.map((creator, index) => (
                      <tr
                        key={creator.id}
                        className={`border-b border-white/5 transition-colors ${
                          index === 0 ? 'bg-yellow-400/10' :
                          index === 1 ? 'bg-gray-400/5' :
                          index === 2 ? 'bg-orange-400/5' :
                          'hover:bg-white/5'
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center">
                            {index === 0 && <span className="text-2xl">🥇</span>}
                            {index === 1 && <span className="text-2xl">🥈</span>}
                            {index === 2 && <span className="text-2xl">🥉</span>}
                            {index > 2 && <span className="text-gray-400 font-semibold">#{index + 1}</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden flex-shrink-0 flex items-center justify-center">
                              {creator.avatar ? (
                                <img src={creator.avatar} alt={creator.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                              ) : (
                                <span className="text-xs font-bold text-gray-300">{(creator.name || 'U').charAt(0).toUpperCase()}</span>
                              )}
                            </div>
                            <div>
                              <p className="text-white font-medium truncate">{creator.name || 'Unknown'}</p>
                              <p className="text-gray-400 text-xs truncate">{creator.email || ''}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right text-gray-300">{creator.watch || 0}</td>
                        <td className="px-6 py-4 text-right text-gray-300">{creator.likes || 0}</td>
                        <td className="px-6 py-4 text-right text-gray-300">{creator.vote || 0}</td>
                        <td className="px-6 py-4 text-right text-gray-300">{creator.views || 0}</td>
                        <td className="px-6 py-4 text-right text-gray-300">{creator.play || 0}</td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-bold text-yellow-400">{creator.totals || 0}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
 
      <div className="space-y-4"><PrizeSidebar /></div>
    </div>
  )
}
 
// ─────────────────────────────────────────────
// TAB: TERMS
// ─────────────────────────────────────────────
 
function TermsContent() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-2">
      <div className="md:col-span-2 space-y-6">
        <div>
          <h3 className="text-white font-bold text-2xl mb-1">Terms & Conditions</h3>
          <p className="text-gray-400 text-sm font-semibold mb-3">Last Updated: January 2026</p>
          <p className="text-gray-400 text-base leading-relaxed">By submitting an entry to Usky AI Film Awards 2026 ("Awards"), you agree to comply with the following Terms & Conditions.</p>
        </div>
        {TERMS_SECTIONS.map((section) => (
          <div key={section.title}>
            <h4 className="text-white font-bold text-lg mb-2">{section.title}</h4>
            <ol className="text-gray-400 text-base space-y-1.5 list-none">
              {section.items.map((item, j) => <li key={j}>{j + 1}. {item}</li>)}
            </ol>
          </div>
        ))}
        <div>
          <h4 className="text-white font-bold text-xl mb-4">Frequently Asked Questions</h4>
          <div className="max-w-2xl"><FaqAccordion faqs={FAQS} /></div>
        </div>
      </div>
      <div className="space-y-4"><PrizeSidebar /></div>
    </div>
  )
}
 
// ─────────────────────────────────────────────
// TAB: PROJECTS
// ─────────────────────────────────────────────
 
interface Category {
  id: string
  name: string
}
 
const MOCK_AWARDS: AwardSubmission[] = [
  { id: '1', name: 'AI Sunset',          image_url: '/film/film1.png', likes: 234, views: 1205, play: 45 },
  { id: '2', name: 'Digital Dreams',     image_url: '/film/film2.png', likes: 189, views: 987,  play: 32 },
  { id: '3', name: 'Future Vision',      image_url: '/film/film3.png', likes: 312, views: 1543, play: 67 },
  { id: '4', name: 'Neural Art',         image_url: '/film/film1.png', likes: 156, views: 876,  play: 28 },
  { id: '5', name: 'Synthetic Beauty',   image_url: '/film/film2.png', likes: 267, views: 1398, play: 51 },
  { id: '6', name: 'AI Canvas',          image_url: '/film/film3.png', likes: 298, views: 1456, play: 62 },
  { id: '7', name: 'Machine Creativity', image_url: '/film/film1.png', likes: 213, views: 1122, play: 39 },
]
 
const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'Best AI Short Film' },
  { id: '2', name: 'Best AI Advertising' },
  { id: '3', name: 'Best AI Animation' },
  { id: '4', name: 'Best AI Documentary' },
]
 
function ProjectsContent() {
  const [filterBy, setFilterBy] = useState('Latest')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [submissions, setSubmissions] = useState<AwardSubmission[]>(MOCK_AWARDS)
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES)
  const [loading, setLoading] = useState(false)
  const [categoriesLoading, setCategoriesLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [awardDetail, setAwardDetail] = useState<any>(null)
  const [awardDetailLoading, setAwardDetailLoading] = useState(false)
  const [showAwardDetail, setShowAwardDetail] = useState(false)
 
  // ─── Track view + play count when card is clicked ───
  const handleCardClick = (id: string | number) => {
    fetch(`https://api.usky.ai/award/view?id=${id}`).catch(() => {})
    fetch(`https://api.usky.ai/award/play?id=${id}`).catch(() => {})
  }
 
  const getSortParam = (filter: string) => {
    switch (filter) {
      case 'Trending':   return 'latest'
      case 'Most Liked': return 'likes'
      case 'Most Viewed': return 'views'
      default:           return 'latest'
    }
  }
 
  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true)
        const response = await fetch('/api/awards/category')
        const data = await response.json()
        if (data.status === true && data.list && Array.isArray(data.list) && data.list.length > 0) {
          setCategories(data.list as Category[])
        } else {
          setCategories(MOCK_CATEGORIES)
        }
      } catch (error) {
        console.error('[v0] Failed to fetch categories:', error)
        setCategories(MOCK_CATEGORIES)
      } finally {
        setCategoriesLoading(false)
      }
    }
    fetchCategories()
  }, [])
 
  // Fetch award detail
  useEffect(() => {
    const fetchAwardDetail = async () => {
      try {
        setAwardDetailLoading(true)
        const response = await fetch('/api/awards/awards-detail?id=440')
        const data = await response.json()
        if (data.list) {
          setAwardDetail(data.list)
          setShowAwardDetail(true)
        }
      } catch (error) {
        console.error('[v0] Failed to fetch award detail:', error)
      } finally {
        setAwardDetailLoading(false)
      }
    }
    fetchAwardDetail()
  }, [])
 
  // Fetch awards list
  useEffect(() => {
    const fetchAwards = async () => {
      try {
        setLoading(true)
        const sort = getSortParam(filterBy)
        const params = new URLSearchParams({
          sort,
          page: currentPage.toString(),
          limit: '7',
          view_type: 'potrait',
        })
        if (selectedCategory) params.append('id_category', selectedCategory)
 
        const response = await fetch(`/api/awards/list?${params.toString()}`)
        const data = await response.json()
 
        if (data.status === true && data.list && Array.isArray(data.list) && data.list.length > 0) {
          setSubmissions(data.list as AwardSubmission[])
          if (data.meta) setTotalPages(data.meta.total_pages || 1)
        } else {
          setSubmissions(MOCK_AWARDS)
          setTotalPages(1)
        }
      } catch (error) {
        console.error('[v0] Failed to fetch awards:', error)
        setSubmissions(MOCK_AWARDS)
        setTotalPages(1)
      } finally {
        setLoading(false)
      }
    }
    fetchAwards()
  }, [filterBy, selectedCategory, currentPage])
 
  const filteredSubmissions = useMemo(() => {
    if (!searchQuery) return submissions
    const q = searchQuery.toLowerCase()
    return submissions.filter((s) => s.name.toLowerCase().includes(q))
  }, [submissions, searchQuery])
 
  return (
    <div className="space-y-8">
 
      {/* Award Detail Section */}
      {showAwardDetail && awardDetail && (
        <div className="bg-[#0b1d35] border border-white/10 rounded-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 md:p-8">
            <div className="md:col-span-1 flex items-center justify-center">
              <div className="relative w-full aspect-[3/4] overflow-hidden rounded-lg bg-gray-800">
                <Image
                  src={awardDetail.image_landscape_url || awardDetail.image_url || '/film/film1.png'}
                  alt={awardDetail.name}
                  fill
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
 
          {/* Related Awards */}
          {awardDetail.relate && Array.isArray(awardDetail.relate) && awardDetail.relate.length > 0 && (
            <div className="border-t border-white/10 p-6 md:p-8">
              <h3 className="text-xl font-bold text-white mb-4">Related Awards</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                {awardDetail.relate.map((related: any) => (
                  <div
                    key={related.id}
                    className="group relative overflow-hidden rounded-lg bg-[#1e293b] hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => handleCardClick(related.id)}
                  >
                    <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-800">
                      <Image
                        src={related.image_landscape_url || related.image_url || '/film/film1.png'}
                        alt={related.name}
                        fill
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
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
 
      {/* Stats bar */}
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
          <span className="text-white font-extrabold text-2xl md:text-3xl tracking-tight relative z-10">200 USKY</span>
        </div>
        <div className="flex items-center gap-3 bg-[#0b1d35] border border-white/10 rounded-xl px-5 py-5 lg:flex-1 w-full shrink-0">
          <FileText className="w-4 h-4 text-gray-400 shrink-0" />
          <div>
            <p className="text-xs text-gray-400 leading-none mb-1.5">Submission</p>
            <p className="text-white font-extrabold text-xl leading-none">245</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-[#0b1d35] border border-white/10 rounded-xl px-5 py-5 lg:flex-1 w-full shrink-0">
          <Clock className="w-4 h-4 text-gray-400 shrink-0" />
          <div>
            <p className="text-xs text-gray-400 leading-none mb-1.5">Ends in</p>
            <p className="text-white font-extrabold text-xl leading-none">4 Days</p>
          </div>
        </div>
        <button className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 transition-colors rounded-xl px-6 py-5 lg:flex-1 w-full shrink-0">
          <Plus className="w-5 h-5 text-black" />
          <span className="text-black font-bold text-sm">Submit Now</span>
        </button>
      </div>
 
      {/* Submissions Grid */}
      <div>
        <h2 className="text-base font-bold text-white mb-4">All Submission</h2>
 
        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 w-full">
          <div className="relative w-full md:w-[280px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border border-white/15 rounded-lg pl-9 pr-4 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-2.5 shrink-0 w-full md:w-auto">
            {/* Category Filter */}
            <div className="flex items-center gap-1.5 border border-white/15 rounded-lg px-3 py-2 bg-transparent w-full md:w-auto">
              <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
              </svg>
              <div className="relative flex-1 md:flex-none min-w-[150px]">
                <select
                  value={selectedCategory}
                  onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1) }}
                  disabled={categoriesLoading}
                  className="w-full bg-[#0b1d35] text-gray-400 text-sm appearance-none cursor-pointer focus:outline-none pr-5 py-0 truncate [&>option]:bg-[#0b1d35] [&>option]:text-white"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <svg className="w-3 h-3 absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
                </svg>
              </div>
            </div>
 
            {/* Sort Filter */}
            <div className="flex items-center gap-1.5 border border-white/15 rounded-lg px-3 py-2 bg-transparent w-full md:w-auto">
              <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" />
              </svg>
              <div className="relative flex-1 md:flex-none">
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="bg-transparent text-gray-400 text-sm appearance-none cursor-pointer focus:outline-none pr-5 w-full md:w-auto [&>option]:bg-[#0b1d35] [&>option]:text-white"
                >
                  {FILTER_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <svg className="w-3 h-3 absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
 
        {/* Awards Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-gray-400">Loading awards...</div>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-gray-400">No awards found</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 w-full">
            {filteredSubmissions.map((submission) => (
              <div
                key={submission.id}
                className="group relative overflow-hidden rounded-lg bg-[#1e293b] hover:shadow-lg transition-all duration-300 cursor-pointer w-full"
                onClick={() => handleCardClick(submission.id)}
              >
                <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-800">
                  <Image
                    src={submission.image_url || '/film/film1.png'}
                    alt={submission.name}
                    fill
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
              </div>
            ))}
          </div>
        )}
      </div>
 
      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 pt-8">
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#0a1628] border border-white/10 text-gray-300 rounded-lg text-sm font-semibold hover:border-yellow-500/50 hover:text-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="text-gray-400 text-sm">Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#0a1628] border border-white/10 text-gray-300 rounded-lg text-sm font-semibold hover:border-yellow-500/50 hover:text-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
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
 
      {/* ── HERO ── */}
      <div className="relative w-full overflow-hidden bg-[#050d1a]" style={{ minHeight: '280px' }}>
        <Image src="/images/awards/imageawards.png" alt="Awards hero" fill className="object-cover object-center opacity-50" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050d1a]/95 via-[#050d1a]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050d1a]" />
        <div className="relative w-full px-6 md:px-8 pt-8 pb-10 md:pt-12 md:pb-14 flex flex-col justify-end" style={{ minHeight: '280px' }}>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="flex -space-x-2.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#050d1a] bg-gray-600 overflow-hidden relative" style={{ zIndex: 4 - i }}>
                  <Image src={`/images/avatar${i}.png`} alt="" width={32} height={32} className="object-cover w-full h-full" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                </div>
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-[#050d1a] bg-[#1e3a5f] flex items-center justify-center text-[10px] font-bold text-white" style={{ zIndex: 0 }}>+3</div>
            </div>
            <span className="text-gray-300 text-sm font-medium">Join 240+ others</span>
          </div>
          <div className="flex items-center gap-1.5 mb-5">
            <div className="flex items-center gap-1.5 border border-white/20 rounded-full px-3 py-1 w-fit bg-black/20 backdrop-blur-sm">
              <Clock className="w-3.5 h-3.5 text-gray-300" />
              <span className="text-gray-300 text-[11px] uppercase tracking-widest font-semibold">Ends in 30 days</span>
            </div>
          </div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight mb-3 text-white whitespace-nowrap">
            Indonesia's Biggest AI Film Revolution Starts Here<br />1 BILLION IDR in Prizes + National Fame
          </h1>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed">Your film could be the next viral AI masterpiece — seen, judged, and celebrated across Indonesia.</p>
        </div>
      </div>
 
      {/* ── TABS ── */}
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
 
      {/* ── TAB CONTENT ── */}
      <div className="px-6 md:px-8 pb-20 mt-6 space-y-6">
        {activeTab === 'Projects' && <ProjectsContent />}
        {activeTab === 'Theme'    && <ThemeContent />}
        {activeTab === 'Terms'    && <TermsContent />}
      </div>
 
      <Footer />
    </div>
  )
}
 






