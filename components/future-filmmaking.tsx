'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { ChevronRight } from 'lucide-react'

const features = [
  {
    title: 'Focused on AI Video Only',
    description: 'We specialize in one thing – AI-generated videos. That means better quality, faster delivery, and creators who truly know the tools.',
    icon: '/images/design-mode/start.png',
  },
  {
    title: 'Fast & Hassle-Free',
    description: 'No need to hire a full video team. Just send your idea and get a film delivered within days.',
    icon: '/images/design-mode/times.png',
  },
  {
    title: 'Secure Payment, Always Protected',
    description: 'Your money is held safely until your video is delivered – pay only when you\'re happy with the result.',
    icon: '/images/design-mode/world.png',
  },
  {
    title: 'Client-Centric Workflow',
    description: 'Simple briefs, clear delivery timelines, revision options – built for clients who just want great results without back-and-forth.',
    icon: '/images/design-mode/image.png',
  },
]

export function FutureFilmmaking() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % features.length)
  }

  return (
    <section className="relative min-h-[500px] md:min-h-[600px] lg:min-h-[700px] overflow-hidden rounded-2xl md:rounded-3xl">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/design-mode/a.png"
          alt="Future of Filmmaking"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-transparent" />

      {/* Content */}
      <div className="relative flex items-center h-full px-4 md:px-8 lg:px-12 py-8 md:py-12">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="mb-6 md:mb-8 lg:mb-10">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 md:mb-3">
              The Future of Filmmaking Starts Here
            </h2>
            <p className="text-xs md:text-base text-gray-300 line-clamp-2 md:line-clamp-none">
              Connect with AI-powered creators. Make short films, promos, or stories in a whole new way.
            </p>
          </div>

          {/* Mobile: Single Card Carousel */}
          <div className="md:hidden mb-6">
            <div className="bg-black/60 backdrop-blur-sm border border-white/20 rounded-2xl p-5 min-h-[200px] flex flex-col justify-between">
              {/* Content */}
              <div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {features[currentIndex].title}
                </h3>
                <p className="text-sm text-gray-200 line-clamp-3">
                  {features[currentIndex].description}
                </p>
              </div>

              {/* Icon and Next Button */}
              <div className="flex items-center justify-between mt-6">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Image
                    src={features[currentIndex].icon}
                    alt={features[currentIndex].title}
                    width={32}
                    height={32}
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <button
                  onClick={handleNext}
                  className="w-12 h-12 rounded-full bg-white text-black hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0"
                  aria-label="Next feature"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Mobile Navigation Dots */}
            <div className="flex justify-center gap-2 mt-4">
              {features.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentIndex ? 'bg-white w-6' : 'bg-white/40'
                  }`}
                  aria-label={`Go to feature ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Desktop: Grid Layout */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-3 md:p-4 lg:p-6 hover:bg-black/60 transition-colors">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12">
                    <Image
                      src={feature.icon}
                      alt={feature.title}
                      width={48}
                      height={48}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-xs md:text-sm lg:text-base font-bold text-white mb-0.5 md:mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-[10px] md:text-xs lg:text-sm text-gray-400 line-clamp-3">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Button className="w-full bg-white text-black hover:bg-gray-200 font-semibold text-sm md:text-base py-2.5 md:py-2.5">
            Explore Skydio.Ai
          </Button>
        </div>
      </div>
    </section>
  )
}
