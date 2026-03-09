'use client'

import Image from 'next/image'
import { X, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CreatorData {
  id: string
  sid?: string
  name: string
  email?: string
  avatar?: string
  avatar_url?: string
  total_video?: string
}

interface CreatorSectionProps {
  creators: CreatorData[]
}

export function CreatorSection({ creators }: CreatorSectionProps) {
  return (
    <section className="border-t border-border px-4 py-6 md:px-6 md:py-8 lg:px-12">
      <div className="mb-4 flex items-center justify-between md:mb-6">
        <h2 className="text-lg font-bold text-foreground md:text-2xl">Creator</h2>
        <div className="flex gap-2">
          <button className="rounded-full bg-accent/20 p-1.5 transition-colors hover:bg-accent/40 md:p-2">
            <X className="h-4 w-4 text-white md:h-5 md:w-5" />
          </button>
          <button className="rounded-full bg-accent/20 p-1.5 transition-colors hover:bg-accent/40 md:p-2">
            <Menu className="h-4 w-4 text-white md:h-5 md:w-5" />
          </button>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4 md:gap-6">
        {creators.map((creator) => (
          <div key={creator.id} className="flex flex-shrink-0 flex-col items-center">
            <div className="relative mb-2 h-16 w-16 overflow-hidden rounded-full bg-white/10 md:mb-4 md:h-24 md:w-24">
              <Image
                src={creator.avatar_url || '/images/pngs.png'}
                alt={creator.name}
                fill
                className="object-cover"
              />
            </div>
            <p className="text-center text-sm font-semibold text-foreground">{creator.name}</p>
            <p className="text-center text-xs text-muted-foreground">
              {creator.total_video || '0'} movies
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Button className="border border-white/20 bg-transparent text-white hover:bg-white/10">
          View All Creators
        </Button>
      </div>
    </section>
  )
}
