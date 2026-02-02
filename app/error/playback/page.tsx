'use client'

import Image from 'next/image'

export default function Playback() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl">
        {/* Content Container */}
        <div className="flex flex-col items-center text-center space-y-8 sm:space-y-10">
          {/* Text Content - Top */}
          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white text-balance">
              Playback Error
            </h3>
            <p className="text-sm sm:text-base lg:text-lg text-gray-300">
              We hit a snag loading  this video.Please retry or select another title
            </p>
          </div>

          {/* Illustration - Center */}
          <div className="w-full max-w-xs sm:max-w-md aspect-square relative flex items-center justify-center">
            <Image
              src="/images/error/image_error.png"
              alt="Connection lost illustration"
              width={500}
              height={500}
              priority
              className="w-full h-auto object-contain drop-shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
