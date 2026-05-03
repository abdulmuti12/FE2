export default function FaqContent({
  statsBar,
}: {
  statsBar: React.ReactNode
}) {
  return (
    <div className="space-y-8">
      {statsBar}
      <div>
        <h3 className="text-white font-bold text-2xl mb-1">Frequently Asked Questions</h3>
        <p className="text-gray-400 text-sm mb-6">Everything you need to know about USKY AI Film Award 2025.</p>
      </div>
      <div className="bg-[#0b1d35] border border-white/10 rounded-xl px-4 md:px-6">
        <div />
      </div>
    </div>
  )
}